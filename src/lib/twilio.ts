import 'server-only';
import twilio from 'twilio';
import { Message, Conversation, Participant } from '@/types';

let cachedClient: { sid: string; token: string; client: twilio.Twilio } | null = null;

export function getTwilioClient(accountSid?: string, authToken?: string): twilio.Twilio {
  const sid = accountSid || process.env.TWILIO_ACCOUNT_SID;
  const token = authToken || process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    throw new Error('Twilio credentials not configured');
  }

  // Only use cached client if credentials match
  if (cachedClient && cachedClient.sid === sid && cachedClient.token === token) {
    return cachedClient.client;
  }

  // Create new client with current credentials
  console.log('Creating new Twilio client with SID:', sid.substring(0, 10) + '...');
  const client = twilio(sid, token);
  cachedClient = { sid, token, client };

  return client;
}

export function resetTwilioClient(): void {
  cachedClient = null;
}

/**
 * Fetch WhatsApp messages using Messaging API
 */
export async function fetchMessages(
  accountSid?: string,
  authToken?: string,
  whatsappNumber?: string,
  limit: number = 100
): Promise<Message[]> {
  const client = getTwilioClient(accountSid, authToken);
  let ourNumber = whatsappNumber || process.env.TWILIO_WHATSAPP_NUMBER;

  if (!ourNumber) {
    throw new Error('WhatsApp number not configured');
  }

  // Ensure number is properly formatted (remove whatsapp: prefix if present, ensure + prefix)
  ourNumber = ourNumber.replace('whatsapp:', '');
  if (!ourNumber.startsWith('+')) {
    ourNumber = '+' + ourNumber;
  }

  console.log('🔍 Fetching messages from Twilio Messaging API...');
  console.log('   WhatsApp Number:', ourNumber);
  console.log('   Using AccountSID:', accountSid?.substring(0, 10) || 'from env');

  try {
    // Calculate date filter - only fetch messages from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    console.log('   → Fetching inbound messages (last 7 days)...');
    const inboundMessages = await client.messages.list({
      to: `whatsapp:${ourNumber}`,
      limit,
      dateSentAfter: sevenDaysAgo,
    });
    console.log(`   ✓ Found ${inboundMessages.length} inbound messages`);

    console.log('   → Fetching outbound messages (last 7 days)...');
    const outboundMessages = await client.messages.list({
      from: `whatsapp:${ourNumber}`,
      limit,
      dateSentAfter: sevenDaysAgo,
    });
    console.log(`   ✓ Found ${outboundMessages.length} outbound messages`);

    // Debug: Log sample messages
    if (inboundMessages.length > 0) {
      console.log('   📨 Sample inbound messages:');
      inboundMessages.slice(0, 2).forEach((msg, i) => {
        console.log(`     ${i+1}. From: ${msg.from}, Body: "${msg.body?.substring(0, 30)}...", Date: ${msg.dateCreated}`);
      });
    }
    if (outboundMessages.length > 0) {
      console.log('   📤 Sample outbound messages:');
      outboundMessages.slice(0, 2).forEach((msg, i) => {
        console.log(`     ${i+1}. To: ${msg.to}, Body: "${msg.body?.substring(0, 30)}...", Date: ${msg.dateCreated}`);
      });
    }

    // Convert to our Message format
    const allMessages: Message[] = [...inboundMessages, ...outboundMessages].map((msg) => ({
      sid: msg.sid,
      conversation_sid: '', // Not used in Messaging API
      body: msg.body || '',
      author: msg.from || '', // For compatibility
      from: msg.from || '', // Sender
      to: msg.to || '', // Recipient
      participant_sid: null,
      direction: msg.direction === 'inbound' ? 'inbound' : 'outbound',
      index: 0, // Not used in Messaging API
      dateCreated: msg.dateCreated?.toISOString() || new Date().toISOString(),
      dateUpdated: msg.dateUpdated?.toISOString() || null,
      media: msg.subresourceUris?.media ? [] : null,
      delivery: null,
      attributes: undefined,
    }));

    // Sort by date
    allMessages.sort(
      (a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
    );

    console.log(`✅ Successfully fetched ${allMessages.length} total messages from Twilio Messaging API`);
    return allMessages;
  } catch (error: any) {
    console.error('❌ Error fetching messages from Twilio Messaging API:');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    console.error('   Status:', error.status);
    if (error.code === 20003) {
      console.error('   → Authentication failed. Check your Account SID and Auth Token.');
    }
    throw error;
  }
}

/**
 * Find or create a Conversation for a WhatsApp phone number
 */
export async function getOrCreateConversation(
  phoneNumber: string,
  whatsappNumber: string,
  accountSid?: string,
  authToken?: string
): Promise<string> {
  const client = getTwilioClient(accountSid, authToken);
  const formattedPhone = phoneNumber.startsWith('whatsapp:') ? phoneNumber : `whatsapp:${phoneNumber}`;
  const formattedOurNumber = whatsappNumber.startsWith('whatsapp:') ? whatsappNumber : `whatsapp:${whatsappNumber}`;

  console.log('🔍 Finding/creating conversation for:', formattedPhone);

  try {
    // Use phone number as unique name to find existing conversation
    const uniqueName = formattedPhone.replace('whatsapp:', '').replace('+', '');

    // Try to fetch existing conversation by unique name
    try {
      const existing = await client.conversations.v1.conversations(uniqueName).fetch();
      console.log('✓ Found existing conversation:', existing.sid);
      return existing.sid;
    } catch (error: any) {
      if (error.status === 404) {
        // Conversation doesn't exist, create it WITH participants using ConversationWithParticipants API
        console.log('→ Creating new conversation with WhatsApp participant...');

        // Create conversation with participant in one call (recommended for WhatsApp)
        const participantBinding = JSON.stringify({
          messaging_binding: {
            address: formattedPhone,
            proxy_address: formattedOurNumber
          }
        });

        const conversationWithParticipant = await client.conversations.v1.conversationWithParticipants.create({
          friendlyName: formattedPhone,
          uniqueName: uniqueName,
          participant: [participantBinding]
        });

        console.log('✓ Created conversation with participant:', conversationWithParticipant.sid);
        return conversationWithParticipant.sid;
      }
      throw error;
    }
  } catch (error) {
    console.error('❌ Error in getOrCreateConversation:', error);
    throw error;
  }
}

/**
 * Send a WhatsApp message using Messaging API (for dashboard visibility)
 */
export async function sendMessage(
  to: string,
  body: string,
  from: string,
  accountSid?: string,
  authToken?: string
): Promise<Message> {
  const client = getTwilioClient(accountSid, authToken);

  console.log('📤 Sending WhatsApp message via Messaging API...');
  console.log('   To:', to);
  console.log('   From:', from);
  console.log('   Body:', body);

  try {
    const message = await client.messages.create({
      to: to,
      from: from,
      body: body,
    });

    console.log('✅ Message sent via Messaging API:', message.sid);

    return {
      sid: message.sid,
      body: message.body || body,
      from: message.from || from,
      to: message.to || to,
      direction: 'outbound',
      status: message.status as Message['status'],
      dateCreated: message.dateCreated?.toISOString() || new Date().toISOString(),
      dateSent: message.dateSent?.toISOString() || null,
    };
  } catch (error) {
    console.error('❌ Error sending message via Messaging API:', error);
    throw error;
  }
}

/**
 * Send a message in a conversation (legacy - use sendMessage instead)
 */
export async function sendConversationMessage(
  conversationSid: string,
  body: string,
  author: string,
  mediaUrl?: string,
  accountSid?: string,
  authToken?: string
): Promise<Message> {
  const client = getTwilioClient(accountSid, authToken);

  console.log('📤 Sending message to conversation:', conversationSid);
  console.log('   Author:', author);
  console.log('   Body:', body);

  try {
    const messageParams: any = {
      Author: author,
      Body: body,
    };

    if (mediaUrl) {
      // Note: For media, you'd need to upload it first to Twilio MCS
      // For now, we'll skip media support
      console.warn('⚠️  Media support not yet implemented in Conversations API');
    }

    const message = await client.conversations.v1
      .conversations(conversationSid)
      .messages.create(messageParams);

    console.log('✅ Message sent:', message.sid);

    return {
      sid: message.sid,
      conversation_sid: message.conversationSid || conversationSid,
      body: message.body || body,
      author: message.author || author,
      participant_sid: message.participantSid || null,
      direction: 'outbound',
      index: message.index || 0,
      dateCreated: message.dateCreated?.toISOString() || new Date().toISOString(),
      dateUpdated: message.dateUpdated?.toISOString() || null,
      media: message.media || null,
      delivery: message.delivery || null,
    };
  } catch (error) {
    console.error('❌ Error sending message:', error);
    throw error;
  }
}

/**
 * Fetch all conversations
 */
export async function fetchConversations(
  accountSid?: string,
  authToken?: string
): Promise<Conversation[]> {
  const client = getTwilioClient(accountSid, authToken);

  console.log('🔍 Fetching all conversations...');

  try {
    const conversations = await client.conversations.v1.conversations.list({ limit: 100 });

    console.log(`✓ Found ${conversations.length} conversations`);

    const conversationsWithDetails: Conversation[] = [];

    for (const conv of conversations) {
      // Fetch participants to get phone number
      const participants = await client.conversations.v1
        .conversations(conv.sid)
        .participants.list();

      // Find the WhatsApp participant (not us)
      const whatsappParticipant = participants.find(
        (p) => p.messagingBinding?.type === 'whatsapp'
      );

      if (!whatsappParticipant) continue; // Skip if no WhatsApp participant

      const phoneNumber = whatsappParticipant.messagingBinding?.address || '';

      conversationsWithDetails.push({
        sid: conv.sid,
        account_sid: conv.accountSid || '',
        chat_service_sid: conv.chatServiceSid || '',
        messaging_service_sid: conv.messagingServiceSid || undefined,
        friendly_name: conv.friendlyName || phoneNumber,
        unique_name: conv.uniqueName || undefined,
        phoneNumber: phoneNumber,
        messages: [], // Will be populated separately
        unreadCount: 0, // Will be calculated separately
        state: conv.state as any,
        date_created: conv.dateCreated?.toISOString() || new Date().toISOString(),
        date_updated: conv.dateUpdated?.toISOString() || new Date().toISOString(),
      });
    }

    console.log(`✅ Processed ${conversationsWithDetails.length} conversations with WhatsApp participants`);
    return conversationsWithDetails;
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    throw error;
  }
}

/**
 * Fetch messages from a conversation
 */
export async function fetchConversationMessages(
  conversationSid: string,
  whatsappNumber?: string,
  accountSid?: string,
  authToken?: string,
  limit: number = 100
): Promise<Message[]> {
  const client = getTwilioClient(accountSid, authToken);

  console.log('📥 Fetching messages from conversation:', conversationSid);

  // Format our WhatsApp number for comparison
  const formattedOurNumber = whatsappNumber
    ? (whatsappNumber.startsWith('whatsapp:') ? whatsappNumber : `whatsapp:${whatsappNumber}`)
    : '';

  try {
    const messages = await client.conversations.v1
      .conversations(conversationSid)
      .messages.list({ limit, order: 'asc' });

    console.log(`✓ Found ${messages.length} messages`);

    const formattedMessages: Message[] = messages.map((msg) => {
      const author = msg.author || 'system';
      // Message is outbound if the author is our WhatsApp number
      const isOutbound = formattedOurNumber && author === formattedOurNumber;

      return {
        sid: msg.sid,
        conversation_sid: msg.conversationSid || conversationSid,
        body: msg.body || '',
        author: author,
        participant_sid: msg.participantSid || null,
        direction: isOutbound ? 'outbound' : 'inbound',
        index: msg.index || 0,
        dateCreated: msg.dateCreated?.toISOString() || new Date().toISOString(),
        dateUpdated: msg.dateUpdated?.toISOString() || null,
        media: msg.media || null,
        delivery: msg.delivery || null,
      };
    });

    console.log(`  Outbound messages: ${formattedMessages.filter(m => m.direction === 'outbound').length}`);
    console.log(`  Inbound messages: ${formattedMessages.filter(m => m.direction === 'inbound').length}`);

    return formattedMessages;
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    throw error;
  }
}

/**
 * Fetch all conversations with their messages
 */
export async function fetchConversationsWithMessages(
  whatsappNumber: string,
  accountSid?: string,
  authToken?: string
): Promise<Conversation[]> {
  console.log('🔄 Fetching conversations with messages...');

  const conversations = await fetchConversations(accountSid, authToken);
  const formattedOurNumber = whatsappNumber.startsWith('whatsapp:')
    ? whatsappNumber
    : `whatsapp:${whatsappNumber}`;

  // Fetch messages for each conversation
  for (const conv of conversations) {
    const messages = await fetchConversationMessages(conv.sid, accountSid, authToken);
    conv.messages = messages;

    // Set last message
    if (messages.length > 0) {
      conv.lastMessage = messages[messages.length - 1];
    }

    // Calculate unread count (messages from others that are not read)
    conv.unreadCount = messages.filter(
      (msg) => msg.author !== formattedOurNumber && msg.author !== 'system'
    ).length; // Simplified - in real app, track read status
  }

  // Sort by most recent message
  conversations.sort((a, b) => {
    const aTime = a.lastMessage?.dateCreated || a.date_created;
    const bTime = b.lastMessage?.dateCreated || b.date_created;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  console.log(`✅ Fetched ${conversations.length} conversations with messages`);
  return conversations;
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  conversationSid: string,
  accountSid?: string,
  authToken?: string
): Promise<void> {
  const client = getTwilioClient(accountSid, authToken);

  console.log('🗑️  Deleting conversation:', conversationSid);

  try {
    await client.conversations.v1.conversations(conversationSid).remove();
    console.log('✅ Conversation deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting conversation:', error);
    throw error;
  }
}

export function getInitials(phoneNumber: string): string {
  const cleaned = phoneNumber.replace('whatsapp:', '').replace('+', '');
  return cleaned.slice(-2).toUpperCase();
}

/**
 * Group messages into conversations by phone number
 */
export function groupMessagesIntoConversations(
  messages: Message[],
  ourNumber: string
): Conversation[] {
  const conversationsMap = new Map<string, Conversation>();

  // Format our number for comparison
  const formattedOurNumber = ourNumber.startsWith('whatsapp:') ? ourNumber : `whatsapp:${ourNumber}`;

  messages.forEach((message) => {
    // Skip messages with missing sender/recipient info
    if (!message.from && !message.to && !message.author) {
      console.warn('⚠️ Skipping message with no from/to/author:', message.sid);
      return;
    }

    // Determine the other participant's number
    let otherNumber: string;
    if (message.direction === 'inbound') {
      // For inbound messages, the sender is the other participant
      const sender = message.from || message.author;
      if (!sender) {
        console.warn('⚠️ Skipping inbound message with no sender:', message.sid);
        return;
      }
      otherNumber = sender.startsWith('whatsapp:') ? sender : `whatsapp:${sender}`;
    } else {
      // For outbound messages, the recipient is the other participant
      const recipient = message.to || message.author; // For outbound, author might be the sender
      if (!recipient) {
        console.warn('⚠️ Skipping outbound message with no recipient:', message.sid);
        return;
      }
      // For outbound messages, we need to find the recipient from the 'to' field
      if (message.to) {
        otherNumber = message.to.startsWith('whatsapp:') ? message.to : `whatsapp:${message.to}`;
      } else {
        // If no 'to' field, skip this message as we can't determine the recipient
        console.warn('⚠️ Skipping outbound message with no recipient info:', message.sid);
        return;
      }
    }

    // Skip if this is a message to/from ourselves
    if (otherNumber === formattedOurNumber) {
      return;
    }

    // Get or create conversation
    if (!conversationsMap.has(otherNumber)) {
      conversationsMap.set(otherNumber, {
        sid: '', // No SID for Messaging API conversations
        account_sid: '',
        chat_service_sid: '',
        friendly_name: otherNumber,
        phoneNumber: otherNumber,
        messages: [],
        unreadCount: 0,
        state: 'active',
        date_created: new Date().toISOString(),
        date_updated: new Date().toISOString(),
      });
    }

    // Add message to conversation
    const conversation = conversationsMap.get(otherNumber)!;
    conversation.messages.push(message);
  });

  // Limit messages per conversation to prevent localStorage quota issues
  const MAX_MESSAGES_PER_CONVERSATION = 50;

  conversationsMap.forEach((conversation) => {
    // Sort messages by date (newest first) and keep only the most recent ones
    conversation.messages.sort(
      (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

    // Keep only the most recent messages
    if (conversation.messages.length > MAX_MESSAGES_PER_CONVERSATION) {
      conversation.messages = conversation.messages.slice(0, MAX_MESSAGES_PER_CONVERSATION);
    }

    // Re-sort by date (oldest first) for display
    conversation.messages.sort(
      (a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
    );

    // Set last message and update date
    if (conversation.messages.length > 0) {
      conversation.lastMessage = conversation.messages[conversation.messages.length - 1];
      conversation.date_updated = conversation.lastMessage.dateCreated;
    }

    // Calculate unread count (simplified - messages from others)
    conversation.unreadCount = conversation.messages.filter(
      (msg) => msg.direction === 'inbound'
    ).length;
  });

  // Convert to array and sort by most recent message
  const conversations = Array.from(conversationsMap.values());
  conversations.sort((a, b) => {
    const aTime = a.lastMessage?.dateCreated || a.date_created;
    const bTime = b.lastMessage?.dateCreated || b.date_created;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return conversations;
}
