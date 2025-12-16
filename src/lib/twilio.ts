import 'server-only';
import twilio from 'twilio';
import { Message, Conversation } from '@/types';

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

export async function fetchMessages(
  accountSid?: string,
  authToken?: string,
  whatsappNumber?: string,
  limit: number = 100
): Promise<Message[]> {
  const client = getTwilioClient(accountSid, authToken);
  const ourNumber = whatsappNumber || process.env.TWILIO_WHATSAPP_NUMBER;

  if (!ourNumber) {
    throw new Error('WhatsApp number not configured');
  }

  console.log('🔍 Fetching messages from Twilio...');
  console.log('   WhatsApp Number:', ourNumber);
  console.log('   Using AccountSID:', accountSid?.substring(0, 10) || 'from env');

  try {
    // Fetch messages sent to our number
    console.log('   → Fetching inbound messages...');
    const inboundMessages = await client.messages.list({
      to: `whatsapp:${ourNumber}`,
      limit,
    });
    console.log(`   ✓ Found ${inboundMessages.length} inbound messages`);

    // Fetch messages sent from our number
    console.log('   → Fetching outbound messages...');
    const outboundMessages = await client.messages.list({
      from: `whatsapp:${ourNumber}`,
      limit,
    });
    console.log(`   ✓ Found ${outboundMessages.length} outbound messages`);

    const allMessages: Message[] = [...inboundMessages, ...outboundMessages].map((msg) => ({
      sid: msg.sid,
      body: msg.body || '',
      from: msg.from || '',
      to: msg.to || '',
      direction: msg.direction === 'inbound' ? 'inbound' : 'outbound',
      status: msg.status as Message['status'],
      dateCreated: msg.dateCreated?.toISOString() || new Date().toISOString(),
      dateSent: msg.dateSent?.toISOString() || null,
      mediaUrl: msg.subresourceUris?.media ? [] : undefined,
    }));

    // Sort by date
    allMessages.sort(
      (a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
    );

    console.log(`✅ Successfully fetched ${allMessages.length} total messages from Twilio API`);
    return allMessages;
  } catch (error: any) {
    console.error('❌ Error fetching messages from Twilio API:');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    console.error('   Status:', error.status);
    if (error.code === 20003) {
      console.error('   → Authentication failed. Check your Account SID and Auth Token.');
    }
    throw error;
  }
}

export function groupMessagesIntoConversations(
  messages: Message[],
  ourNumber: string
): Conversation[] {
  const conversationMap = new Map<string, Conversation>();
  const formattedOurNumber = ourNumber.startsWith('whatsapp:')
    ? ourNumber
    : `whatsapp:${ourNumber}`;

  messages.forEach((message) => {
    // Determine the other party's number
    const otherParty =
      message.from === formattedOurNumber ? message.to : message.from;

    if (!conversationMap.has(otherParty)) {
      conversationMap.set(otherParty, {
        phoneNumber: otherParty,
        lastMessage: message,
        messages: [],
        unreadCount: 0,
      });
    }

    const conversation = conversationMap.get(otherParty)!;
    conversation.messages.push(message);

    // Update last message if this one is newer
    if (
      new Date(message.dateCreated) >
      new Date(conversation.lastMessage.dateCreated)
    ) {
      conversation.lastMessage = message;
    }

    // Count unread (received but not delivered/read outbound messages don't count)
    if (message.direction === 'inbound' && message.status === 'received') {
      conversation.unreadCount++;
    }
  });

  // Sort conversations by last message date (newest first)
  const conversations = Array.from(conversationMap.values());
  conversations.sort(
    (a, b) =>
      new Date(b.lastMessage.dateCreated).getTime() -
      new Date(a.lastMessage.dateCreated).getTime()
  );

  return conversations;
}

export async function sendWhatsAppMessage(
  to: string,
  body: string,
  mediaUrl?: string,
  accountSid?: string,
  authToken?: string
): Promise<Message> {
  const client = getTwilioClient(accountSid, authToken);
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!whatsappNumber) {
    throw new Error('WhatsApp number not configured');
  }

  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  const formattedFrom = `whatsapp:${whatsappNumber}`;

  console.log('🚀 Sending WhatsApp message:');
  console.log('  From:', formattedFrom);
  console.log('  To:', formattedTo);
  console.log('  Body:', body);

  try {
    const messageOptions: {
      from: string;
      to: string;
      body: string;
      mediaUrl?: string[];
    } = {
      from: formattedFrom,
      to: formattedTo,
      body,
    };

    if (mediaUrl) {
      messageOptions.mediaUrl = [mediaUrl];
    }

    const sentMessage = await client.messages.create(messageOptions);

    console.log('📨 Twilio response:');
    console.log('  SID:', sentMessage.sid);
    console.log('  Status:', sentMessage.status);
    console.log('  Direction:', sentMessage.direction);

    return {
      sid: sentMessage.sid,
      body: sentMessage.body || body,
      from: sentMessage.from || formattedFrom,
      to: sentMessage.to || formattedTo,
      direction: 'outbound',
      status: sentMessage.status as Message['status'],
      dateCreated: sentMessage.dateCreated?.toISOString() || new Date().toISOString(),
      dateSent: sentMessage.dateSent?.toISOString() || null,
    };
  } catch (error) {
    console.error('❌ Error sending message:');
    console.error('  Error:', error);
    throw error;
  }
}

export function getInitials(phoneNumber: string): string {
  const cleaned = phoneNumber.replace('whatsapp:', '').replace('+', '');
  return cleaned.slice(-2).toUpperCase();
}
