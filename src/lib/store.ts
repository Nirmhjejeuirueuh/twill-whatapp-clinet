import { Message } from '@/types';

class MessageStore {
  private messages: Message[] = [];
  private static instance: MessageStore;

  private constructor() {}

  static getInstance(): MessageStore {
    if (!MessageStore.instance) {
      MessageStore.instance = new MessageStore();
    }
    return MessageStore.instance;
  }

  addMessage(message: Message): void {
    this.messages.push(message);
    console.log('📦 Stored message in MessageStore:', message.sid);
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  getMessagesByConversation(phoneNumber: string): Message[] {
    return this.messages.filter(msg =>
      msg.from === phoneNumber || msg.to === phoneNumber
    );
  }

  clear(): void {
    this.messages = [];
  }
}

export const messageStore = MessageStore.getInstance();