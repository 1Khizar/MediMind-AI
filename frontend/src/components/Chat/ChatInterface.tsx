'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import LocationModal from '../LocationModal';
import VoiceAgent from './VoiceAgent';
import { Shield, Activity, Heart, MapPin } from 'lucide-react';

export default function ChatInterface() {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const handleLocationDecision = (allowed: boolean) => {
    if (allowed && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Use console.log to prevent Next.js from throwing a red error overlay for timeouts
          console.log("Location access notice:", error.message || "Unknown error");
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
      );
    }
  };

  const handleSendMessage = (query: string) => {
    sendMessage(query, location);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleInfo}>
            <h1 style={styles.title}>Medical Consultation</h1>
            <div style={styles.status}>
              <div style={styles.pulse}></div>
              <span>System active & professional</span>
            </div>
          </div>
          <div style={styles.actions}>
            <div style={styles.stat}>
              <Shield size={16} color="var(--accent)" />
              <span>Secure</span>
            </div>
            <div style={styles.stat}>
              <Activity size={16} color="var(--primary)" />
              <span>Real-time</span>
            </div>
            {location && (
              <div style={styles.stat}>
                <MapPin size={16} color="var(--accent)" />
                <span>Location Active</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <LocationModal onDecision={handleLocationDecision} />

      <main style={styles.chatArea}>
        {isVoiceMode ? (
          <div style={styles.voiceArea}>
            <VoiceAgent onDisconnect={() => setIsVoiceMode(false)} />
          </div>
        ) : messages.length === 0 ? (
          <div style={styles.welcome}>
            <div style={styles.welcomeIcon}>
              <Heart size={48} color="var(--primary)" />
            </div>
            <h2 style={styles.welcomeTitle}>Welcome to MedicAI</h2>
            <p style={styles.welcomeText}>
              I'm your professional medical assistant. How can I help you today?
              You can describe your symptoms, ask about medications, or request health tips.
            </p>
            <div style={styles.suggestions}>
              <button 
                onClick={() => handleSendMessage('What are the common symptoms of influenza?')} 
                style={styles.suggestion}
              >
                Influenza symptoms
              </button>
              <button 
                onClick={() => handleSendMessage('How can I improve my sleep quality?')} 
                style={styles.suggestion}
              >
                Better sleep tips
              </button>
              <button 
                onClick={() => handleSendMessage('Explain the benefits of a balanced diet.')} 
                style={styles.suggestion}
              >
                Balanced diet benefits
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.messageList}>
            {messages.map((msg, index) => (
              <ChatMessage key={index} role={msg.role} content={msg.content} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <ChatInput 
        onSendMessage={handleSendMessage} 
        onStartVoice={() => setIsVoiceMode(!isVoiceMode)}
        isLoading={isLoading} 
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    marginLeft: 'var(--sidebar-width)',
    position: 'relative',
  },
  header: {
    padding: '16px 40px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
  },
  titleInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  pulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 0 rgba(32, 201, 151, 0.4)',
    animation: 'pulse 2s infinite',
  },
  actions: {
    display: 'flex',
    gap: '20px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-muted)',
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
  },
  messageList: {
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
  },
  welcome: {
    margin: 'auto',
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  welcomeIcon: {
    width: '80px',
    height: '80px',
    background: 'rgba(0, 112, 243, 0.05)',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '800',
    margin: 0,
  },
  welcomeText: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '12px',
  },
  suggestion: {
    padding: '10px 16px',
    background: 'white',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--foreground)',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-sm)',
  }
};
