'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import EmptyState from './EmptyState';
import SettingsModal from './SettingsModal';
import NewChatModal from './NewChatModal';
import ConnectionStatus from './ConnectionStatus';
import { Conversation, Message } from '@/types';
import { Plus } from 'lucide-react';

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
}

const STORAGE_KEY = 'twilio_config';
const CONVERSATIONS_KEY = 'whatsapp_conversations';

// Helper function to convert messages to conversations
function messagesToConversations(messages: Message[], ourNumber: string): Conversation[] {
  const conversationsMap = new Map<string, Conversation>();

  messages.forEach(message => {
    // Determine the other participant's number
    let participantNumber = '';
    if (message.from && message.from !== ourNumber) {
      participantNumber = message.from;
    } else if (message.to && message.to !== ourNumber) {
      participantNumber = message.to;
    }

    if (!participantNumber) return; // Skip if we can't determine participant

    // Get or create conversation
    let conversation = conversationsMap.get(participantNumber);
    if (!conversation) {
      conversation = {
        sid: `conv_${participantNumber}`,
        account_sid: '', // Not available from webhook
        chat_service_sid: '', // Not available from webhook
        friendly_name: participantNumber.replace('whatsapp:', ''),
        phoneNumber: participantNumber, // Keep whatsapp: prefix
        messages: [],
        unreadCount: 0,
        state: 'active' as const,
        date_created: message.dateCreated,
        date_updated: message.dateCreated,
      };
      conversationsMap.set(participantNumber, conversation);
    }

    // Add message to conversation
    conversation.messages.push(message);

    // Update conversation's last updated time
    if (new Date(message.dateCreated) > new Date(conversation.date_updated)) {
      conversation.date_updated = message.dateCreated;
    }
  });

  // Sort messages within each conversation by date
  conversationsMap.forEach(conversation => {
    conversation.messages.sort((a, b) =>
      new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
    );
  });

  // Convert to array and sort by most recent message
  return Array.from(conversationsMap.values()).sort((a, b) =>
    new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime()
  );
}

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
  const [loadedUntil, setLoadedUntil] = useState<Date | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);
  const initialLoadDone = useRef<string>('');

  // Load config from localStorage
  useEffect(() => {
    console.log('\n🔧 ===== COMPONENT MOUNT: Loading config =====');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('✅ Config loaded from localStorage:', {
          accountSid: parsed.accountSid ? `${parsed.accountSid.slice(0,10)}...` : 'MISSING',
          authToken: parsed.authToken ? 'present' : 'MISSING',
          whatsappNumber: parsed.whatsappNumber || 'MISSING'
        });
        setConfig(parsed);
      } catch (e) {
        console.error('❌ Failed to parse saved config:', e);
      }
    } else {
      console.log('⚠️ No config found in localStorage');
    }

    // Load conversations from localStorage
    const savedConversations = localStorage.getItem(CONVERSATIONS_KEY);
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        // Filter out conversations without phone numbers (invalid data)
        const validConversations = parsed.filter((c: Conversation) => c.phoneNumber && c.phoneNumber.trim() !== '');

        console.log('📦 Loaded conversations from localStorage:', parsed.length);
        console.log('✅ Valid conversations (with phone number):', validConversations.length);
        console.log('❌ Removed invalid conversations:', parsed.length - validConversations.length);

        setConversations(validConversations);

        // If we removed any invalid conversations, clear them from localStorage
        if (validConversations.length < parsed.length) {
          localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(validConversations));
        }
      } catch (e) {
        console.error('Failed to parse saved conversations:', e);
        // Clear corrupted data
        localStorage.removeItem(CONVERSATIONS_KEY);
      }
    }

    setLoading(false);
  }, []); // Empty dependency array - only run once on mount

  // Fetch messages
  const fetchMessages = useCallback(async (cfg?: TwilioConfig, fromDate?: string, toDate?: string, isAppend = false) => {
    console.log('\n🚀 ===== fetchMessages CALLED =====');
    console.log('   Timestamp:', new Date().toISOString());
    console.log('   isAppend:', isAppend);
    
    const activeConfig = cfg || config;

    if (!activeConfig.accountSid || !activeConfig.authToken || !activeConfig.whatsappNumber) {
      console.log('❌ fetchMessages: Missing credentials, ABORTING');
      setIsConnected(false);
      return;
    }

    try {
      console.log('🌐 Making API call to /api/messages...', { fromDate, toDate });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

      const params = new URLSearchParams({
        accountSid: activeConfig.accountSid,
        authToken: activeConfig.authToken,
        whatsappNumber: activeConfig.whatsappNumber
      });

      if (fromDate) params.set('fromDate', fromDate);
      if (toDate) params.set('toDate', toDate);

      const response = await fetch(`/api/messages?${params}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        const fetched = result.data.conversations;
        
        if (!isAppend) {
          // Initial load - replace conversations
          setConversations(fetched);
          // Set loadedUntil based on the fromDate we requested
          if (fromDate) {
            setLoadedUntil(new Date(fromDate));
          } else {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            setLoadedUntil(thirtyDaysAgo);
          }
        } else {
          // Loading more - merge conversations
          setConversations(prev => {
            const merged = [...prev];
            fetched.forEach((newConv: Conversation) => {
              const existingIndex = merged.findIndex(c => c.phoneNumber === newConv.phoneNumber);
              if (existingIndex >= 0) {
                const existingMessages = merged[existingIndex].messages;
                const newMessages = newConv.messages.filter(
                  msg => !existingMessages.some(existing => existing.sid === msg.sid)
                );
                merged[existingIndex] = {
                  ...merged[existingIndex],
                  messages: [...existingMessages, ...newMessages].sort(
                    (a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
                  ),
                  date_updated: new Date(newConv.date_updated) > new Date(merged[existingIndex].date_updated)
                    ? newConv.date_updated
                    : merged[existingIndex].date_updated
                };
              } else {
                merged.push(newConv);
              }
            });
            return merged.sort((a, b) =>
              new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime()
            );
          });
          
          if (fromDate) {
            setLoadedUntil(new Date(fromDate));
          }
        }

        setIsConnected(true);
        setError(null);
      } else {
        setError(result.error);
        setIsConnected(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('API request timed out');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      }
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, [config]);

  // Load more messages (next day)
  const loadMoreMessages = useCallback(async () => {
    const now = Date.now();
    if (isLoadingMore || !loadedUntil || loading || (now - lastLoadTime) < 1000) {
      return;
    }

    console.log('🔄 Loading more messages from loadedUntil:', loadedUntil?.toISOString());

    setIsLoadingMore(true);
    setLastLoadTime(now);

    try {
      const fromDate = new Date(loadedUntil);
      fromDate.setDate(fromDate.getDate() - 1);
      const toDate = new Date(loadedUntil);

      await fetchMessages(config, fromDate.toISOString(), toDate.toISOString(), true);
    } catch (error) {
      console.error('❌ Failed to load more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [config, loadedUntil, isLoadingMore, loading, lastLoadTime, fetchMessages]);

  // Save config to localStorage
  const handleSaveConfig = (newConfig: TwilioConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    initialLoadDone.current = ''; // Reset to trigger new initial load
    fetchMessages(newConfig);
  };

  // Fetch messages once config is loaded from localStorage
  useEffect(() => {
    const configKey = `${config.accountSid}-${config.authToken}-${config.whatsappNumber}`;
    
    if (!loading && config.accountSid && config.authToken && config.whatsappNumber && initialLoadDone.current !== configKey) {
      console.log('✅ Initial load conditions met - calling fetchMessages for last 1 day!');
      initialLoadDone.current = configKey;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const today = new Date();
      fetchMessages(config, yesterday.toISOString(), today.toISOString(), false);
    }
  }, [loading, config, fetchMessages]);

  // Save conversations to localStorage whenever they change
  // Only save conversations with valid phone numbers
  useEffect(() => {
    if (!loading) {
      const validConversations = conversations.filter(c => c.phoneNumber && c.phoneNumber.trim() !== '');

      try {
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(validConversations));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('⚠️ localStorage quota exceeded. Clearing old conversations to free up space.');
          // Clear localStorage and try again with just the most recent conversations
          localStorage.removeItem(CONVERSATIONS_KEY);

          // Keep only conversations with recent messages
          const recentConversations = validConversations
            .filter(c => c.messages.length > 0)
            .sort((a, b) => new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime())
            .slice(0, 10); // Keep only 10 most recent conversations

          try {
            localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(recentConversations));
            console.log('✅ Saved recent conversations to localStorage');
          } catch (retryError) {
            console.error('❌ Still unable to save to localStorage after cleanup');
          }
        } else {
          console.error('❌ Error saving conversations to localStorage:', error);
        }
      }
    }
  }, [conversations, loading]);

  // Auto-update selected conversation when conversations change
  useEffect(() => {
    if (selectedConversation) {
      const updated = conversations.find(
        (c: Conversation) => c.phoneNumber === selectedConversation.phoneNumber
      );
      if (updated && updated.messages.length !== selectedConversation.messages.length) {
        console.log('🔄 Auto-updating selected conversation from', selectedConversation.messages.length, 'to', updated.messages.length, 'messages');
        setSelectedConversation(updated);
      }
    }
  }, [conversations, selectedConversation]);

  const conversationsRef = useRef<Conversation[]>([]);

  // Keep ref in sync with conversations state
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Listen for SSE updates (webhook messages)
  useEffect(() => {
    if (!config.whatsappNumber) return;

    console.log('📡 Connecting to SSE for real-time updates');

    const eventSource = new EventSource('/api/sse');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📡 SSE message received:', data.type);

        if (data.type === 'new_message') {
          const newMessage: Message = data.message;
          console.log('📨 New message from SSE:', newMessage.sid, 'from:', newMessage.from, 'direction:', newMessage.direction);

          // Only trigger full refresh for inbound messages
          // Outbound messages are already added immediately when sent
          if (newMessage.direction === 'inbound') {
            console.log('🔄 Triggering full message refresh from API (inbound message)...');
            fetchMessages();
          } else {
            console.log('📤 Outbound message confirmation received, skipping refresh');
          }
        }
      } catch (error) {
        console.error('❌ Error processing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE connection error:', error);
    };

    // Cleanup on unmount
    return () => {
      console.log('📡 Disconnecting SSE');
      eventSource.close();
    };
  }, [config.whatsappNumber, selectedConversation]);

  // Send message
  const handleSendMessage = async (body: string) => {
    if (!selectedConversation) {
      console.error('❌ No conversation selected');
      return;
    }

    console.log('💬 Sending message to:', selectedConversation.phoneNumber);
    console.log('  Message body:', body);

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
          whatsappNumber: config.whatsappNumber,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        console.error('❌ Send failed:', result.error);
        throw new Error(result.error);
      }

      console.log('✅ Message sent successfully, webhook will handle conversation updates');
      console.log('  Sent message data:', result.data);

      // Add the sent message to the conversation immediately for better UX
      const sentMessage = result.data;

      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv.phoneNumber === selectedConversation.phoneNumber) {
            return {
              ...conv,
              messages: [...conv.messages, sentMessage],
              date_updated: sentMessage.dateCreated,
            };
          }
          return conv;
        });
        return updated;
      });

      // Update selected conversation
      setSelectedConversation(prev => {
        if (prev) {
          return {
            ...prev,
            messages: [...prev.messages, sentMessage],
            date_updated: sentMessage.dateCreated,
          };
        }
        return null;
      });

      // Note: No need to refresh messages - webhooks will handle incoming updates
    } catch (err) {
      console.error('❌ Failed to send message:', err);
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
        sid: '', // No SID needed for Messaging API
        account_sid: '',
        chat_service_sid: '',
        friendly_name: formattedNumber,
        phoneNumber: formattedNumber,
        messages: [],
        unreadCount: 0,
        state: 'active',
        date_created: new Date().toISOString(),
        date_updated: new Date().toISOString(),
      };
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (conversationSid: string) => {
    console.log('🗑️ Attempting to delete conversation with SID:', conversationSid);

    // Validate SID before sending
    if (!conversationSid || conversationSid === 'temp-conv' || conversationSid === '') {
      console.error('Invalid conversation SID:', conversationSid);
      alert('Cannot delete this conversation: Invalid conversation ID');
      return;
    }

    try {
      const response = await fetch('/api/delete-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationSid,
          accountSid: config.accountSid,
          authToken: config.authToken,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Conversation deleted successfully');
        // Remove from local state
        setConversations(prev => prev.filter(c => c.sid !== conversationSid));

        // If this was the selected conversation, clear selection
        if (selectedConversation?.sid === conversationSid) {
          setSelectedConversation(null);
        }
      } else {
        console.error('Failed to delete conversation:', result.error);
        alert('Failed to delete conversation: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation');
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
          onDeleteConversation={handleDeleteConversation}
          whatsappNumber={config.whatsappNumber}
          onLoadMoreConversations={loadMoreMessages}
          isLoadingMoreConversations={isLoadingMore}
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
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-[#00a884] rounded-full flex items-center justify-center shadow-2xl hover:bg-[#00a884]/90 hover:scale-105 transition-all duration-200 z-40"
      >
        <Plus className="w-6 h-6 md:w-7 md:h-7 text-white" />
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
