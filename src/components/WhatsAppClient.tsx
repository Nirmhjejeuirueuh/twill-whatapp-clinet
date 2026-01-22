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
  const fetchMessages = useCallback(async (cfg?: TwilioConfig) => {
    console.log('\n🚀 ===== fetchMessages CALLED =====');
    console.log('   Timestamp:', new Date().toISOString());
    console.log('   Config source:', cfg ? 'provided as parameter' : 'using state config');
    
    const activeConfig = cfg || config;

    console.log('🔍 Active config check:', {
      accountSid: activeConfig.accountSid ? `${activeConfig.accountSid.slice(0,10)}...` : 'MISSING',
      authToken: activeConfig.authToken ? 'present' : 'MISSING',
      whatsappNumber: activeConfig.whatsappNumber || 'MISSING'
    });

    if (!activeConfig.accountSid || !activeConfig.authToken || !activeConfig.whatsappNumber) {
      console.log('❌ fetchMessages: Missing credentials, ABORTING');
      console.log('===== fetchMessages ENDED (failed) =====\n');
      setIsConnected(false);
      return;
    }

    try {
      console.log('🌐 Making API call to /api/messages...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const params = new URLSearchParams({
        accountSid: activeConfig.accountSid,
        authToken: activeConfig.authToken,
        whatsappNumber: activeConfig.whatsappNumber
      });

      const response = await fetch(`/api/messages?${params}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      console.log('📡 API response status:', response.status);
      console.log('📡 API response ok:', response.ok);

      if (!response.ok) {
        console.error('❌ API response not ok:', response.status, response.statusText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📦 API response received, success:', result.success);

      if (result.success) {
        console.log('📥 Fetched conversations (Messaging API):');
        console.log('  Total conversations:', result.data.conversations.length);
        const totalMessages = result.data.conversations.reduce((sum: number, c: Conversation) => sum + c.messages.length, 0);
        console.log('  Total messages:', totalMessages);
        result.data.conversations.forEach((conv: Conversation, i: number) => {
          console.log(`  Conversation ${i+1}: ${conv.phoneNumber} (${conv.messages.length} messages)`);
        });

        // Replace with fetched conversations (don't merge to avoid stale data)
        const fetched = result.data.conversations;

        // Debug: Log all conversation SIDs
        console.log('📋 Current conversations:', fetched.map((c: Conversation) => ({
          sid: c.sid,
          phoneNumber: c.phoneNumber,
          messageCount: c.messages.length
        })));

        setConversations(fetched);
        setIsConnected(true);
        setError(null);

        // Update selected conversation if it exists
        setSelectedConversation(prev => {
          if (!prev) return null;
          const updated = fetched.find(
            (c: Conversation) => c.phoneNumber === prev.phoneNumber
          );
          if (updated) {
            console.log('🔄 Updating selected conversation with', updated.messages.length, 'messages');
            return updated;
          }
          return prev;
        });
      } else {
        setError(result.error);
        setIsConnected(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.error('❌ API call timed out after 90 seconds');
        setError('API request timed out');
      } else {
        console.error('❌ fetchMessages error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      }
      setIsConnected(false);
    } finally {
      console.log('===== fetchMessages ENDED =====\n');
      setLoading(false);
    }
  }, [config]);

  // Save config to localStorage
  const handleSaveConfig = (newConfig: TwilioConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    fetchMessages(newConfig);
  };

  // Fetch messages once config is loaded from localStorage
  useEffect(() => {
    console.log('\n🔄 ===== FETCH EFFECT TRIGGERED =====');
    console.log('   loading:', loading);
    console.log('   config.accountSid:', config.accountSid ? `${config.accountSid.slice(0,10)}...` : 'MISSING');
    console.log('   config.authToken:', config.authToken ? 'present' : 'MISSING');
    console.log('   config.whatsappNumber:', config.whatsappNumber || 'MISSING');

    if (!loading && config.accountSid && config.authToken && config.whatsappNumber) {
      console.log('✅ All conditions met - calling fetchMessages now!');
      fetchMessages();
    } else {
      console.log('⏸️  Waiting for config to load...');
    }
  }, [loading, config.accountSid, config.authToken, config.whatsappNumber, fetchMessages]);

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
          console.log('📨 New message from SSE:', newMessage.sid, 'from:', newMessage.from);

          // Ensure whatsappNumber has whatsapp: prefix
          const ourNumber = config.whatsappNumber.startsWith('whatsapp:')
            ? config.whatsappNumber
            : `whatsapp:+${config.whatsappNumber.replace(/\+/g, '')}`;

          console.log('🔍 SSE: ourNumber:', ourNumber);

          // Convert single message to conversation
          const webhookConversations = messagesToConversations([newMessage], ourNumber);

          console.log('🔍 SSE: webhookConversations created:', webhookConversations.length);
          if (webhookConversations.length > 0) {
            console.log('🔍 SSE: webhookConv.phoneNumber:', webhookConversations[0].phoneNumber);
          }

          if (webhookConversations.length === 0) {
            console.log('⚠️ SSE: No conversations created from message, skipping');
            return;
          }

          const webhookConv = webhookConversations[0];
          console.log('🔍 SSE: webhookConv.phoneNumber:', webhookConv.phoneNumber);

          // Update conversations state
          setConversations(prevConversations => {
            console.log('🔍 SSE: Updating conversations, current count:', prevConversations.length);
            const updated = [...prevConversations];
            const existingIndex = updated.findIndex(c => c.phoneNumber === webhookConv.phoneNumber);

            console.log('🔍 SSE: existingIndex:', existingIndex);

            if (existingIndex >= 0) {
              // Update existing conversation
              const existing = updated[existingIndex];
              const allMessages = [...existing.messages];

              // Add new message if not already present
              if (!allMessages.find(msg => msg.sid === newMessage.sid)) {
                allMessages.push(newMessage);
                allMessages.sort((a, b) =>
                  new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
                );
                console.log('✅ SSE: Added new message to conversation, total messages:', allMessages.length);
              } else {
                console.log('⚠️ SSE: Message already exists in conversation');
              }

              updated[existingIndex] = {
                ...existing,
                messages: allMessages,
                date_updated: newMessage.dateCreated,
              };
            } else {
              // Add new conversation
              console.log('✅ SSE: Creating new conversation');
              updated.push(webhookConv);
            }

            console.log('🔍 SSE: Returning updated conversations, count:', updated.length);
            return updated;
          });

          // Update selected conversation if it's the active one
          setSelectedConversation(prev => {
            if (!prev) {
              console.log('⚠️ SSE: No selected conversation');
              return null;
            }
            
            console.log('🔍 SSE: Checking if selected conversation matches');
            console.log('   Selected:', prev.phoneNumber);
            console.log('   Webhook:', webhookConv.phoneNumber);
            
            if (prev.phoneNumber === webhookConv.phoneNumber) {
              const allMessages = [...prev.messages];
              if (!allMessages.find(msg => msg.sid === newMessage.sid)) {
                allMessages.push(newMessage);
                allMessages.sort((a, b) =>
                  new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
                );
                console.log('✅ SSE: Updated selected conversation, total messages:', allMessages.length);
              }
              return {
                ...prev,
                messages: allMessages,
              };
            }
            
            console.log('⚠️ SSE: Selected conversation does not match webhook');
            return prev;
          });
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
