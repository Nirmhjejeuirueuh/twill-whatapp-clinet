'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message, Conversation } from '@/types';

interface UseMessagesOptions {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
  pollingInterval?: number;
}

interface UseMessagesReturn {
  messages: Message[];
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  sendMessage: (to: string, body: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
}

export function useMessages({
  accountSid,
  authToken,
  whatsappNumber,
  pollingInterval = 5000,
}: UseMessagesOptions): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const fetchMessagesFromApi = useCallback(async () => {
    if (!accountSid || !authToken || !whatsappNumber) {
      return;
    }

    try {
      const params = new URLSearchParams({
        accountSid,
        authToken,
        whatsappNumber,
      });

      const response = await fetch(`/api/messages?${params}`);
      const result = await response.json();

      if (result.success) {
        setMessages(result.data.messages);
        setConversations(result.data.conversations);
        setError(null);

        // Update selected conversation if it exists
        if (selectedConversation) {
          const updated = result.data.conversations.find(
            (c: Conversation) => c.phoneNumber === selectedConversation.phoneNumber
          );
          if (updated) {
            setSelectedConversation(updated);
          }
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [accountSid, authToken, whatsappNumber, selectedConversation]);

  const sendMessage = useCallback(
    async (to: string, body: string) => {
      try {
        const response = await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to,
            body,
            accountSid,
            authToken,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        // Refresh messages after sending
        await fetchMessagesFromApi();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        throw err;
      }
    },
    [accountSid, authToken, fetchMessagesFromApi]
  );

  // Initial fetch
  useEffect(() => {
    fetchMessagesFromApi();
  }, [fetchMessagesFromApi]);

  // Polling for new messages
  useEffect(() => {
    if (!accountSid || !authToken || !whatsappNumber) return;

    const interval = setInterval(fetchMessagesFromApi, pollingInterval);
    return () => clearInterval(interval);
  }, [accountSid, authToken, whatsappNumber, pollingInterval, fetchMessagesFromApi]);

  return {
    messages,
    conversations,
    loading,
    error,
    sendMessage,
    refreshMessages: fetchMessagesFromApi,
    selectedConversation,
    setSelectedConversation,
  };
}
