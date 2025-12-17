// Messaging API Message (updated for consistency)
export interface Message {
  sid: string; // Message SID (starts with IM or SM)
  conversation_sid?: string; // Conversation SID (starts with CH) - optional for Messaging API
  body: string;
  author?: string; // Phone number of the sender (for Conversations API compatibility)
  from?: string; // Sender phone number (for Messaging API)
  to?: string; // Recipient phone number (for Messaging API)
  participant_sid?: string | null; // Participant SID (starts with MB) - optional
  direction: 'inbound' | 'outbound';
  index?: number; // Message index in conversation - optional for Messaging API
  dateCreated: string;
  dateUpdated?: string | null;
  media?: Array<{
    sid: string;
    size: number;
    content_type: string;
    filename: string;
  }> | null;
  delivery?: {
    total: number;
    sent: string;
    delivered: string;
    read: string;
    failed: string;
    undelivered: string;
  } | null;
  attributes?: string;
}

// Conversations API Conversation
export interface Conversation {
  sid: string; // Conversation SID (starts with CH)
  account_sid: string;
  chat_service_sid: string; // Service SID (starts with IS)
  messaging_service_sid?: string;
  friendly_name: string; // We'll use phone number as friendly name
  unique_name?: string;
  phoneNumber: string; // Custom field - the participant's phone number
  profileName?: string; // Custom field
  lastMessage?: Message; // Custom field
  messages: Message[]; // Custom field
  unreadCount: number; // Custom field
  state: 'initializing' | 'inactive' | 'active' | 'closed';
  date_created: string;
  date_updated: string;
  isOnline?: boolean;
  lastSeen?: string;
}

// Participant in a Conversation
export interface Participant {
  sid: string; // Participant SID (starts with MB)
  conversation_sid: string;
  account_sid: string;
  identity?: string | null;
  messaging_binding?: {
    type: 'sms' | 'whatsapp';
    address: string; // Phone number
    proxy_address: string; // Twilio number
  };
  attributes?: string;
  role_sid?: string;
  date_created: string;
  date_updated: string;
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
}

// Conversations API Webhook Payload (onMessageAdded event)
export interface WebhookPayload {
  EventType: string; // e.g., "onMessageAdded", "onConversationAdded"
  ConversationSid: string;
  MessageSid?: string;
  Body?: string;
  Author?: string;
  ParticipantSid?: string;
  DateCreated?: string;
  Index?: number;
  // Legacy fields for backwards compatibility
  From?: string;
  To?: string;
  ProfileName?: string;
}

export interface SendMessageRequest {
  to: string;
  body: string;
  mediaUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
