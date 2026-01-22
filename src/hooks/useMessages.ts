'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message, Conversation } from '@/types';

interface UseMessagesOptions {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
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

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

      const response = await fetch(`/api/messages?${params}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

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
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. The server took too long to respond (20s timeout).');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      }
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

        // Note: We don't refresh messages here anymore - webhooks will handle updates
        console.log('Message sent successfully, webhook will update conversation');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        throw err;
      }
    },
    [accountSid, authToken]
  );

  // Initial fetch only (no polling)
  useEffect(() => {
    fetchMessagesFromApi();
  }, [fetchMessagesFromApi]);

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
