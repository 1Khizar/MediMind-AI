'use client';

import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        ...styles.container,
        flexDirection: isAssistant ? 'row' : 'row-reverse',
      }}
    >
      <div style={{
        ...styles.avatar,
        background: isAssistant ? 'var(--primary)' : 'var(--secondary)',
        color: isAssistant ? 'white' : 'var(--text-muted)',
      }}>
        {isAssistant ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div style={{
        ...styles.bubble,
        background: isAssistant ? 'white' : 'var(--primary)',
        color: isAssistant ? 'var(--foreground)' : 'white',
        border: isAssistant ? '1px solid var(--border)' : 'none',
        borderRadius: isAssistant ? '0 16px 16px 16px' : '16px 0 16px 16px',
        boxShadow: isAssistant ? 'var(--shadow-sm)' : 'none',
      }}>
        <p style={styles.text}>{content || (isAssistant ? 'Thinking...' : '')}</p>
      </div>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'flex-start',
    maxWidth: '85%',
    margin: '0 auto 24px auto',
    width: '100%',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    padding: '16px 20px',
    maxWidth: 'calc(100% - 56px)',
    lineHeight: '1.6',
    fontSize: '15px',
  },
  text: {
    margin: 0,
    whiteSpace: 'pre-wrap',
  }
};
