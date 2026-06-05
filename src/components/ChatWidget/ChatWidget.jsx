import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('connecting');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'));
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

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.response,
            provider: data.provider,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.error || 'Something went wrong. Please try again.',
            isError: true,
            timestamp: new Date(),
          },
        ]);
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
              {msg.content}
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
