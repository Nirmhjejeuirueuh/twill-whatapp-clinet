export interface Message {
  sid: string;
  body: string;
  from: string;
  to: string;
  direction: 'inbound' | 'outbound';
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'received';
  dateCreated: string;
  dateSent: string | null;
  mediaUrl?: string[];
  mediaContentType?: string[];
}

export interface Conversation {
  phoneNumber: string;
  profileName?: string;
  lastMessage: Message;
  messages: Message[];
  unreadCount: number;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
}

export interface WebhookPayload {
  MessageSid: string;
  Body: string;
  From: string;
  To: string;
  NumMedia: string;
  MediaUrl0?: string;
  MediaContentType0?: string;
  ProfileName?: string;
  WaId?: string;
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
