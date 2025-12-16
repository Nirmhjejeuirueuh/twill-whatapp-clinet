import { Message, Conversation } from '@/types';

// In-memory store for messages (in production, use a database)
class MessageStore {
  private messages: Map<string, Message> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private listeners: Set<(messages: Message[]) => void> = new Set();
  private whatsappNumber: string = '';

  setWhatsappNumber(number: string) {
    this.whatsappNumber = number.startsWith('whatsapp:') ? number : `whatsapp:${number}`;
  }

  getWhatsappNumber(): string {
    return this.whatsappNumber;
  }

  addMessage(message: Message): void {
    this.messages.set(message.sid, message);
    this.updateConversation(message);
    this.notifyListeners();
  }

  addMessages(messages: Message[]): void {
    messages.forEach((msg) => {
      this.messages.set(msg.sid, msg);
      this.updateConversation(msg, false);
    });
    this.notifyListeners();
  }

  private updateConversation(message: Message, notify: boolean = true): void {
    const otherParty =
      message.from === this.whatsappNumber ? message.to : message.from;

    let conversation = this.conversations.get(otherParty);

    if (!conversation) {
      conversation = {
        phoneNumber: otherParty,
        lastMessage: message,
        messages: [],
        unreadCount: 0,
      };
      this.conversations.set(otherParty, conversation);
    }

    // Add message if not already present
    if (!conversation.messages.find((m) => m.sid === message.sid)) {
      conversation.messages.push(message);
      conversation.messages.sort(
        (a, b) =>
          new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
      );
    }

    // Update last message if newer
    if (
      new Date(message.dateCreated) >
      new Date(conversation.lastMessage.dateCreated)
    ) {
      conversation.lastMessage = message;
    }

    // Update unread count
    if (message.direction === 'inbound') {
      conversation.unreadCount = conversation.messages.filter(
        (m) => m.direction === 'inbound' && m.status === 'received'
      ).length;
    }
  }

  getMessage(sid: string): Message | undefined {
    return this.messages.get(sid);
  }

  getAllMessages(): Message[] {
    return Array.from(this.messages.values()).sort(
      (a, b) =>
        new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
    );
  }

  getConversations(): Conversation[] {
    return Array.from(this.conversations.values()).sort(
      (a, b) =>
        new Date(b.lastMessage.dateCreated).getTime() -
        new Date(a.lastMessage.dateCreated).getTime()
    );
  }

  getConversation(phoneNumber: string): Conversation | undefined {
    return this.conversations.get(phoneNumber);
  }

  markAsRead(phoneNumber: string): void {
    const conversation = this.conversations.get(phoneNumber);
    if (conversation) {
      conversation.unreadCount = 0;
      this.notifyListeners();
    }
  }

  subscribe(listener: (messages: Message[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const messages = this.getAllMessages();
    this.listeners.forEach((listener) => listener(messages));
  }

  clear(): void {
    this.messages.clear();
    this.conversations.clear();
    this.notifyListeners();
  }
}

// Singleton instance
export const messageStore = new MessageStore();
