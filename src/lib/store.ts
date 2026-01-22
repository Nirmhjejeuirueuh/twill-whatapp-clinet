import { Message } from '@/types';

type MessageStoreListener = (messages: Message[]) => void;

class MessageStore {
  private messages: Message[] = [];
  private listeners: MessageStoreListener[] = [];
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
    this.notifyListeners();
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
    this.notifyListeners();
  }

  // Event listener methods
  addListener(listener: MessageStoreListener): void {
    this.listeners.push(listener);
    console.log('📌 MessageStore listener added. Total listeners:', this.listeners.length);
  }

  removeListener(listener: MessageStoreListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
    console.log('📌 MessageStore listener removed. Total listeners:', this.listeners.length);
  }

  private notifyListeners(): void {
    console.log('🔔 Notifying', this.listeners.length, 'listeners with', this.messages.length, 'messages');
    this.listeners.forEach(listener => {
      try {
        listener(this.getMessages());
      } catch (error) {
        console.error('Error notifying MessageStore listener:', error);
      }
    });
  }
}

export const messageStore = MessageStore.getInstance();