import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  id?: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const history = await apiClient.get('/history');
      if (history && history.length > 0) {
        // Just take the first session for now or implement session switching later
        const cleanHistory = history[0].history.map((msg: Message) => {
          if (msg.role === 'user' && msg.content.includes('[User location context:')) {
            return {
              ...msg,
              content: msg.content.split('\n\n[User location context:')[0]
            };
          }
          return msg;
        });
        setMessages(cleanHistory);
        setSessionId(history[0].session_id);
      }
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const sendMessage = async (query: string, locationData?: { lat: number; lng: number } | null) => {
    if (!query.trim()) return;

    // Display the clean query in the UI
    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Prepare what the backend actually receives
    let backendQuery = query;
    if (locationData) {
      backendQuery += `\n\n[User location context: Latitude: ${locationData.lat}, Longitude: ${locationData.lng}]`;
    }

    let assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      await apiClient.stream('/chat/stream', { query: backendQuery, session_id: sessionId }, (chunk) => {
        if (chunk.content) {
          assistantMessage.content += chunk.content;
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { ...assistantMessage };
            return next;
          });
        }
      });
    } catch (error) {
      console.error('Failed to send message', error);
      assistantMessage.content = 'Sorry, I encountered an error. Please try again.';
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...assistantMessage };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    setMessages,
  };
}
