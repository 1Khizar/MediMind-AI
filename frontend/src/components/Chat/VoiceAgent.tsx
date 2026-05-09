'use client';

import React, { useEffect, useState } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  useConnectionState,
  BarVisualizer,
} from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import '@livekit/components-styles';
import { apiClient } from '@/lib/api';

export default function VoiceAgent({ onDisconnect }: { onDisconnect: () => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const data = await apiClient.get('/auth/livekit-token');
        setToken(data.token);
      } catch (err) {
        console.error('Failed to fetch Voice Token', err);
        setError('Could not connect to voice server. Is the backend running?');
      }
    }
    fetchToken();
  }, []);

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <span style={{ fontSize: 32 }}>⚠️</span>
          <p style={{ margin: 0, fontWeight: 600 }}>{error}</p>
          <button style={styles.endBtn} onClick={onDisconnect}>
            Go Back to Text Chat
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner} />
        <p style={styles.hint}>Setting up secure voice connection...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      audio={true}
      onDisconnected={onDisconnect}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <VoiceUI onDisconnect={onDisconnect} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function VoiceUI({ onDisconnect }: { onDisconnect: () => void }) {
  const connectionState = useConnectionState();
  const { state: agentState, audioTrack } = useVoiceAssistant();

  const isConnecting = connectionState !== ConnectionState.Connected;
  
  // Determine what message and emoji to show
  let emoji = '💊';
  let statusLine = '';
  let statusColor = '#64748b';

  if (isConnecting) {
    emoji = '⏳';
    statusLine = 'Connecting to MedicAI...';
    statusColor = '#94a3b8';
  } else if (!agentState || agentState === 'connecting') {
    emoji = '💊';
    statusLine = '✅ Connected — MedicAI is greeting you, please wait...';
    statusColor = '#16a34a';
  } else if (agentState === 'speaking') {
    emoji = '🔊';
    statusLine = '🔊 MedicAI is speaking — listen carefully';
    statusColor = '#0070f3';
  } else if (agentState === 'listening') {
    emoji = '👂';
    statusLine = '🎤 Listening — speak your symptoms now!';
    statusColor = '#16a34a';
  } else if (agentState === 'thinking') {
    emoji = '🧠';
    statusLine = '🧠 Thinking about your question...';
    statusColor = '#7c3aed';
  } else if (agentState === 'idle') {
    emoji = '💊';
    statusLine = '✅ Ready — speak into your microphone';
    statusColor = '#16a34a';
  }

  const isSpeaking = agentState === 'speaking';
  const isListening = agentState === 'listening';

  return (
    <div style={styles.container}>
      {/* Animated avatar circle */}
      <div
        style={{
          ...styles.avatarOuter,
          boxShadow: isSpeaking
            ? '0 0 0 16px rgba(0,112,243,0.15), 0 0 0 32px rgba(0,112,243,0.07)'
            : isListening
            ? '0 0 0 16px rgba(22,163,74,0.15), 0 0 0 32px rgba(22,163,74,0.07)'
            : '0 0 0 8px rgba(0,112,243,0.06)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        <div style={styles.avatarInner}>
          <span style={{ fontSize: 52 }}>{emoji}</span>
        </div>
      </div>

      <h2 style={styles.title}>MedicAI Voice Consultation</h2>

      {/* Status badge */}
      <div style={{ ...styles.statusBadge, color: statusColor, borderColor: statusColor + '33' }}>
        {statusLine || 'Connecting...'}
      </div>

      {/* Audio visualizer — shows when AI is speaking */}
      {audioTrack && isSpeaking && (
        <div style={styles.visualizerWrap}>
          <BarVisualizer
            trackRef={audioTrack}
            barCount={28}
            style={{ height: '56px', width: '100%' }}
          />
        </div>
      )}

      {/* User hint */}
      <p style={styles.hint}>
        {isConnecting
          ? 'Please wait while we connect...'
          : isListening
          ? 'Speak clearly — MedicAI can hear you!'
          : isSpeaking
          ? 'MedicAI is speaking. You can interrupt anytime.'
          : 'MedicAI will greet you and then listen for your symptoms.'}
      </p>

      <button onClick={onDisconnect} style={styles.endBtn}>
        ✖ End Voice Consultation
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '40px',
    background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
  },
  avatarOuter: {
    borderRadius: '50%',
    transition: 'box-shadow 0.4s ease',
  },
  avatarInner: {
    width: 120,
    height: 120,
    background: 'linear-gradient(135deg, #0070f3 0%, #7c3aed 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  statusBadge: {
    padding: '8px 20px',
    borderRadius: 99,
    border: '1.5px solid',
    fontSize: 14,
    fontWeight: 600,
    background: 'white',
    textAlign: 'center',
  },
  visualizerWrap: {
    width: '100%',
    maxWidth: 340,
    background: 'white',
    borderRadius: 16,
    padding: '12px 16px',
    boxShadow: '0 4px 20px rgba(0,112,243,0.1)',
  },
  hint: {
    fontSize: 13,
    color: '#94a3b8',
    margin: 0,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 1.6,
  },
  spinner: {
    width: 48,
    height: 48,
    border: '4px solid #e0e7ff',
    borderTopColor: '#0070f3',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorBox: {
    background: '#fff4f4',
    color: '#c00',
    padding: '32px',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    textAlign: 'center',
    maxWidth: 360,
  },
  endBtn: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #ef4444, #c00)',
    color: 'white',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
  },
};
