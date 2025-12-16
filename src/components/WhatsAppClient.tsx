'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import EmptyState from './EmptyState';
import SettingsModal from './SettingsModal';
import NewChatModal from './NewChatModal';
import ConnectionStatus from './ConnectionStatus';
import { Conversation } from '@/types';
import { Plus } from 'lucide-react';

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
}

const STORAGE_KEY = 'twilio_config';

export default function WhatsAppClient() {
  const [config, setConfig] = useState<TwilioConfig>({
    accountSid: '',
    authToken: '',
    whatsappNumber: '',
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
      } catch (e) {
        console.error('Failed to parse saved config:', e);
      }
    }
    setLoading(false);
  }, []);

  // Save config to localStorage
  const handleSaveConfig = (newConfig: TwilioConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    fetchMessages(newConfig);
  };

  // Fetch messages
  const fetchMessages = useCallback(async (cfg?: TwilioConfig) => {
    const activeConfig = cfg || config;
    
    if (!activeConfig.accountSid || !activeConfig.authToken || !activeConfig.whatsappNumber) {
      setIsConnected(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        accountSid: activeConfig.accountSid,
        authToken: activeConfig.authToken,
        whatsappNumber: activeConfig.whatsappNumber,
      });

      const response = await fetch(`/api/messages?${params}`);
      const result = await response.json();

      if (result.success) {
        setConversations(result.data.conversations);
        setIsConnected(true);
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
        setIsConnected(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, [config, selectedConversation]);

  // Initial fetch and polling
  useEffect(() => {
    if (config.accountSid && config.authToken && config.whatsappNumber) {
      fetchMessages();
      const interval = setInterval(() => fetchMessages(), 5000);
      return () => clearInterval(interval);
    }
  }, [config.accountSid, config.authToken, config.whatsappNumber, fetchMessages]);

  // Send message
  const handleSendMessage = async (body: string) => {
    if (!selectedConversation) return;

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedConversation.phoneNumber,
          body,
          accountSid: config.accountSid,
          authToken: config.authToken,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Refresh messages after sending
      await fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  // Start new chat
  const handleStartChat = (phoneNumber: string) => {
    const formattedNumber = phoneNumber.startsWith('whatsapp:')
      ? phoneNumber
      : `whatsapp:${phoneNumber}`;

    // Check if conversation already exists
    const existing = conversations.find(c => c.phoneNumber === formattedNumber);
    
    if (existing) {
      setSelectedConversation(existing);
    } else {
      // Create new conversation placeholder
      const newConversation: Conversation = {
        phoneNumber: formattedNumber,
        lastMessage: {
          sid: 'temp',
          body: '',
          from: `whatsapp:${config.whatsappNumber}`,
          to: formattedNumber,
          direction: 'outbound',
          status: 'sent',
          dateCreated: new Date().toISOString(),
          dateSent: null,
        },
        messages: [],
        unreadCount: 0,
      };
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    }
  };

  // Show settings modal if not configured
  useEffect(() => {
    if (!loading && !config.accountSid && !config.authToken) {
      setSettingsOpen(true);
    }
  }, [loading, config]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#111b21]">
      {/* Connection Status */}
      <ConnectionStatus
        isConnected={isConnected}
        isLoading={loading}
        error={error}
        onRefresh={() => fetchMessages()}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onOpenSettings={() => setSettingsOpen(true)}
          whatsappNumber={config.whatsappNumber}
        />

        {/* Chat Area */}
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            whatsappNumber={`whatsapp:${config.whatsappNumber}`}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      {/* New Chat FAB */}
      <button
        onClick={() => setNewChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#00a884] rounded-full flex items-center justify-center shadow-lg hover:bg-[#00a884]/90 transition-colors z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveConfig}
        initialConfig={config}
      />

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        onStartChat={handleStartChat}
      />
    </div>
  );
}
