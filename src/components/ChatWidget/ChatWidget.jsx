import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Simple markdown formatter to structure bullet lists, bold text, and paragraphs
const renderMarkdown = (text) => {
  if (!text) return '';
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    
    // Parse bold text: **bold** -> <strong>bold</strong>
    const parseBold = (str) => {
      const parts = str.split('**');
      return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
    };

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletContent = trimmed.slice(2);
      currentList.push(
        <li key={`li-${idx}`} style={{ marginLeft: '18px', listStyleType: 'disc', marginBottom: '6px', lineHeight: '1.4' }}>
          {parseBold(bulletContent)}
        </li>
      );
    } else {
      // If we were building a list, push it to elements first
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${idx}`} style={{ margin: '0 0 10px 0', padding: 0 }}>{currentList}</ul>);
        currentList = [];
      }

      if (trimmed === '') {
        elements.push(<div key={`gap-${idx}`} style={{ height: '8px' }} />);
      } else {
        elements.push(
          <p key={`p-${idx}`} style={{ margin: '0 0 10px 0', lineHeight: '1.5' }}>
            {parseBold(trimmed)}
          </p>
        );
      }
    }
  });

  if (currentList.length > 0) {
    elements.push(<ul key="ul-final" style={{ margin: '0 0 10px 0', padding: 0 }}>{currentList}</ul>);
  }

  return elements;
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('connecting');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typewriterRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  // Cleanup typewriter interval on unmount
  useEffect(() => {
    return () => {
      if (typewriterRef.current) {
        clearInterval(typewriterRef.current);
      }
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  // Keyboard handler: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Clear any active typewriter animations first
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
    }

    const userMessage = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        throw new Error('Server responded with an error status.');
      }

      // Add a placeholder assistant message that we'll type into
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      // Typewriter control states
      let textQueue = '';
      let typedText = '';
      let streamFinished = false;

      // Start the typewriter typing loop (20ms interval is comfortable and premium)
      typewriterRef.current = setInterval(() => {
        if (textQueue.length > 0) {
          // Adaptive speed: if the queue gets backed up (fast stream), type faster (batch of 3 chars) to stay caught up
          const batchSize = textQueue.length > 80 ? 3 : 1;
          const charsToType = textQueue.substring(0, batchSize);
          textQueue = textQueue.substring(batchSize);
          typedText += charsToType;

          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0) {
              next[next.length - 1] = {
                ...next[next.length - 1],
                content: typedText,
              };
            }
            return next;
          });
        } else if (streamFinished) {
          clearInterval(typewriterRef.current);
          typewriterRef.current = null;
        }
      }, 20);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: !done });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data: ')) {
              const dataStr = trimmedLine.slice(6).trim();
              if (dataStr) {
                try {
                  const data = JSON.parse(dataStr);
                  if (data.error) {
                    streamFinished = true;
                    setMessages((prev) => {
                      const next = [...prev];
                      if (next.length > 0) {
                        next[next.length - 1] = {
                          ...next[next.length - 1],
                          content: data.error,
                          isError: true,
                        };
                      }
                      return next;
                    });
                  } else if (data.chunk) {
                    // Push incoming text to the queue
                    textQueue += data.chunk;
                  } else if (data.done) {
                    streamFinished = true;
                    // Add metadata once streaming is fully done
                    setMessages((prev) => {
                      const next = [...prev];
                      if (next.length > 0) {
                        next[next.length - 1] = {
                          ...next[next.length - 1],
                          provider: data.provider,
                        };
                      }
                      return next;
                    });
                  }
                } catch (e) {
                  buffer = line + '\n' + buffer;
                }
              }
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Can't reach the server right now. Please try again in a moment.",
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ── Floating Bubble (closed state) ──────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        className="chat-bubble"
        onClick={() => setIsOpen(true)}
        aria-label="Open Mannu AI chat"
        id="chat-bubble-trigger"
      >
        <span className="chat-bubble-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5c0 4.14-3.58 7.5-8 7.5a8.4 8.4 0 01-3.8-.9L3 20l1.9-5.7A8.38 8.38 0 014 11.5C4 7.36 7.58 4 12 4s8 3.36 8 7.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path className="chat-bubble-sparkle" d="M13.5 7.5L14.5 9.5L16.5 10.5L14.5 11.5L13.5 13.5L12.5 11.5L10.5 10.5L12.5 9.5L13.5 7.5z" fill="currentColor" />
          </svg>
        </span>
      </button>
    );
  }

  // ── Chat Panel (open state) ─────────────────────────────────────────────
  return (
    <div className="chat-overlay" role="dialog" aria-label="Mannu AI Chat" id="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar">M</div>
          <div className="chat-header-info">
            <span className="chat-header-name">Mannu</span>
            <span className="chat-header-status">
              <span className={`chat-status-dot ${backendStatus === 'connecting' ? 'connecting' : ''}`} />
              {backendStatus === 'online' ? 'Online' : backendStatus === 'connecting' ? 'Connecting...' : 'Offline'}
            </span>
          </div>
        </div>
        <button
          className="chat-close-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
          id="chat-close-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chat-messages-container">
        {/* Welcome message */}
        {messages.length === 0 && !isLoading && (
          <div className="chat-welcome">
            <span className="chat-welcome-emoji">👋</span>
            <p className="chat-welcome-text">
              Hi! I'm <strong>Mannu</strong>, Mohit's AI assistant.<br />
              Ask me anything about his experience, skills, or projects.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className={`chat-message-bubble ${msg.isError ? 'chat-error-bubble' : ''}`}>
              {msg.role === 'assistant' && !msg.isError ? renderMarkdown(msg.content) : msg.content}
            </div>
            <div className="chat-message-meta">
              <span>{formatTime(msg.timestamp)}</span>
              {msg.role === 'assistant' && <span>· Mannu</span>}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="chat-typing">
            <div className="chat-typing-dots">
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </div>
            <span className="chat-typing-label">Mannu is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder="Ask about Mohit's skills, experience..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          maxLength={500}
          id="chat-input-field"
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          id="chat-send-btn"
        >
          <svg className="chat-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
