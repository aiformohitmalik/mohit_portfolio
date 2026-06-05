import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';
import Profile from '../models/Profile.js';
import Section from '../models/Section.js';
import Chunk from '../models/Chunk.js';

// ── LLM Client Initialization (lazy — env vars aren't available at import time)
let groq = null;
let gemini = null;

function getGroq() {
  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

function getGemini() {
  if (!gemini && process.env.GEMINI_API_KEY) {
    gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return gemini;
}

// ── In-Memory Rate Limiter (sliding window) ─────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || [];
  // Remove timestamps outside the window
  const recent = entry.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  recent.push(now);
  return false;
}

// Clean up stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const recent = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recent);
    }
  }
}, 5 * 60 * 1000);

// ── System Prompt ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT_TEMPLATE = `You are "Mannu" — Mohit's AI assistant on his portfolio website.
Answer only about Mohit's professional background, skills, and experience.
Base answers strictly on the provided context. Do not invent details.
If the context lacks the answer, say: "I don't have that detail — reach out to Mohit directly via the contact form."
Redirect unrelated questions politely back to Mohit's career.
Keep answers under 4 sentences. Be technically precise and confident.

CONTEXT:
{context}`;

// ── Dual-Provider LLM Call ──────────────────────────────────────────────────
async function generateResponse(systemPrompt, userMessage) {
  const groqClient = getGroq();
  const geminiClient = getGemini();

  // PRIMARY: Groq — Llama 3.3 70B (~200ms, 30 RPM)
  if (groqClient) {
    try {
      const groqResponse = await groqClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.25,
        max_tokens: 512,
      });
      return {
        text: groqResponse.choices[0].message.content,
        provider: 'groq',
      };
    } catch (groqError) {
      console.warn('⚠️  Groq failed, falling back to Gemini:', groqError.message);
    }
  }

  // FALLBACK: Gemini 2.5 Flash (~1-2s, 15 RPM)
  if (geminiClient) {
    try {
      const geminiResponse = await geminiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.25,
        },
      });
      return {
        text: geminiResponse.text,
        provider: 'gemini',
      };
    } catch (geminiError) {
      console.error('❌ Gemini also failed:', geminiError.message);
      throw new Error('Both LLM providers are unavailable. Please try again later.');
    }
  }

  throw new Error('No LLM provider configured. Set GROQ_API_KEY or GEMINI_API_KEY.');
}

// ── Hierarchical RAG Handler ────────────────────────────────────────────────
export async function chatHandler(req, res) {
  try {
    // Rate limiting by IP
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        error:
          "You're asking too many questions too fast! Please wait a minute and try again. Mannu needs a breather 😅",
      });
    }

    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message to ask Mannu.',
      });
    }

    const userMessage = message.trim().substring(0, 500); // Limit input length

    // ── Pass 0: Always fetch L1 profile breadcrumb ──────────────────────
    const profile = await Profile.findOne({ level: 1 });
    const profileContext = profile
      ? `[PROFILE] ${profile.summary}`
      : '[PROFILE] Mohit Malik — Physical AI Engineer and Robotic Simulation specialist.';

    // ── Pass 1 (Coarse): $text search on sections ───────────────────────
    let sections = [];
    try {
      sections = await Section.find(
        { $text: { $search: userMessage } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(2)
        .lean();
    } catch (err) {
      // If text search fails (e.g., no index yet), fallback to all sections
      console.warn('⚠️  Section text search failed, fetching all sections:', err.message);
      sections = await Section.find({}).limit(3).lean();
    }

    const sectionContext = sections
      .map((s) => `[${s.category.toUpperCase()}] ${s.summary}`)
      .join('\n');

    // ── Pass 2 (Fine): $text search on chunks, scoped by matched sections
    let chunks = [];
    if (sections.length > 0) {
      const sectionIds = sections.map((s) => s._id);
      try {
        chunks = await Chunk.find(
          {
            parentId: { $in: sectionIds },
            $text: { $search: userMessage },
          },
          { score: { $meta: 'textScore' } }
        )
          .sort({ score: { $meta: 'textScore' } })
          .limit(3)
          .lean();
      } catch (err) {
        // Fallback: just get chunks from matched sections without text search
        console.warn('⚠️  Chunk text search failed, fetching by parentId:', err.message);
        chunks = await Chunk.find({ parentId: { $in: sectionIds } })
          .limit(3)
          .lean();
      }
    }

    const chunkContext = chunks.map((c) => `[DETAIL] ${c.text}`).join('\n');

    // ── Assemble hierarchical context ───────────────────────────────────
    const assembledContext = [profileContext, sectionContext, chunkContext]
      .filter(Boolean)
      .join('\n\n');

    const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace('{context}', assembledContext);

    // ── Generate LLM response ───────────────────────────────────────────
    const result = await generateResponse(systemPrompt, userMessage);

    return res.json({
      success: true,
      response: result.text,
      provider: result.provider,
    });
  } catch (error) {
    console.error('❌ Chat handler error:', error);
    return res.status(500).json({
      success: false,
      error: "Mannu ran into an issue processing your question. Please try again in a moment.",
    });
  }
}

export default chatHandler;
