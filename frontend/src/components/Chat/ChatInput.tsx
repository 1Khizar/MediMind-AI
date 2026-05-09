'use client';

import React, { useState } from 'react';
import { Send, MapPin, Paperclip, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStartVoice: () => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, onStartVoice, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputWrapper}>
          <button type="button" style={styles.iconBtn}>
            <Paperclip size={20} color="var(--text-muted)" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms or ask a medical question..."
            style={styles.input}
            disabled={isLoading}
          />
        </div>
        <button 
          type="button" 
          onClick={onStartVoice}
          style={styles.micBtn}
          title="Start Voice Consultation"
        >
          <Mic size={20} />
        </button>
        <button 
          type="submit" 
          style={{
            ...styles.sendBtn,
            opacity: input.trim() && !isLoading ? 1 : 0.5,
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
          }}
          disabled={!input.trim() || isLoading}
        >
          <Send size={20} />
        </button>
      </form>
      <p style={styles.disclaimer}>
        MedicAI provides information for educational purposes. Always consult a professional for medical advice.
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px 0',
    background: 'linear-gradient(to top, white 80%, rgba(255,255,255,0))',
    position: 'sticky',
    bottom: 0,
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    background: 'white',
    padding: '8px',
    borderRadius: '20px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-lg)',
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 8px',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    padding: '12px 0',
    color: 'var(--foreground)',
  },
  iconBtn: {
    padding: '8px',
    borderRadius: '12px',
    transition: 'background 0.2s ease',
    color: 'var(--text-muted)',
  },
  sendBtn: {
    background: 'var(--primary)',
    color: 'white',
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  disclaimer: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: '12px',
  }
};
