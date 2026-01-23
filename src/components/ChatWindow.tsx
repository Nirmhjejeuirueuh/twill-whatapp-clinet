'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Send,
  Check,
  CheckCheck,
  Clock,
  Image as ImageIcon,
  File,
  Camera,
  User,
  X,
} from 'lucide-react';
import { Conversation, Message } from '@/types';
import { formatPhoneNumber, getInitials } from '@/lib/utils';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

interface ChatWindowProps {
  conversation: Conversation;
  whatsappNumber: string;
  onSendMessage: (body: string) => Promise<void>;
}

export default function ChatWindow({
  conversation,
  whatsappNumber,
  onSendMessage,
}: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (smooth = false) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    console.log('📜 ChatWindow: messages updated to', conversation.messages.length, 'messages');
    scrollToBottom(false); // Instant scroll to prevent animation from top
  }, [conversation.messages]);

  // Scroll to bottom when chat window opens or conversation changes
  useEffect(() => {
    console.log('📜 ChatWindow: opened/changed, scrolling to latest messages');
    scrollToBottom(false);
  }, [conversation.phoneNumber]); // Run when conversation changes

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm');
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'TODAY';
    if (isYesterday(date)) return 'YESTERDAY';
    return format(date, 'MMMM d, yyyy').toUpperCase();
  };

  const getStatusIcon = (message: Message) => {
    // Only show status for outbound messages
    if (message.direction === 'inbound') return null;

    // In Conversations API, delivery status is tracked differently
    // For simplicity, we'll show checkmarks for sent messages
    const delivery = message.delivery;

    if (delivery) {
      // If we have delivery data
      const readCount = parseInt(delivery.read || '0');
      const deliveredCount = parseInt(delivery.delivered || '0');
      const failedCount = parseInt(delivery.failed || '0');

      if (failedCount > 0) {
        return <span className="text-red-500 text-xs">!</span>;
      }
      if (readCount > 0) {
        return <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />;
      }
      if (deliveredCount > 0) {
        return <CheckCheck className="w-3.5 h-3.5 text-[#8696a0]" />;
      }
      // Sent but not delivered yet
      return <Check className="w-3.5 h-3.5 text-[#8696a0]" />;
    }

    // No delivery data - just show sent
    return <Check className="w-3.5 h-3.5 text-[#8696a0]" />;
  };

  const getAvatarColor = (phoneNumber: string) => {
    const colors = [
      'bg-emerald-600',
      'bg-blue-600',
      'bg-purple-600',
      'bg-pink-600',
      'bg-orange-600',
      'bg-teal-600',
      'bg-indigo-600',
      'bg-rose-600',
    ];
    const hash = phoneNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = '';

  conversation.messages.forEach((msg) => {
    const msgDate = format(new Date(msg.dateCreated), 'yyyy-MM-dd');
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({ date: msg.dateCreated, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

  const handleImageSelect = () => {
    fileInputRef.current?.click();
    setShowAttachMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (sending) return;

    const textToSend = message.trim();
    if (!textToSend && !selectedImageFile) return;

    setSending(true);
    try {
      if (selectedImageFile) {
        // Send with image
        const formData = new FormData();
        formData.append('to', conversation.phoneNumber);
        formData.append('body', textToSend);
        formData.append('media', selectedImageFile);

        const response = await fetch('/api/send', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to send message with image');
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to send message');
        }

        // Add the sent message to the conversation immediately
        const sentMessage = result.data;
        // Update conversation with the new message
        // Note: This would need access to conversation state management
        // For now, the message will appear when webhook updates or messages are refetched

        // Clear the image after sending
        handleRemoveImage();
      } else {
        // Send text only
        await onSendMessage(textToSend);
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error toast here
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b141a] h-full min-w-0">
      {/* Header */}
      <div className="h-[70px] px-5 md:px-6 lg:px-8 flex items-center justify-between bg-[#202c33] border-b border-[#2a3942] flex-shrink-0">
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          <div className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getAvatarColor(conversation.phoneNumber)}`}>
            <span className="text-white font-medium text-sm md:text-base">
              {getInitials(conversation.phoneNumber)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[#e9edef] font-medium truncate text-base md:text-lg">
              {conversation.profileName || formatPhoneNumber(conversation.phoneNumber)}
            </h2>
            <p className="text-xs md:text-sm text-[#8696a0] truncate">
              {conversation.isOnline
                ? 'online'
                : conversation.lastSeen
                ? `last seen ${conversation.lastSeen}`
                : 'click here for contact info'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors">
            <Video className="w-5 h-5 md:w-6 md:h-6 text-[#aebac1]" />
          </button>
          <button className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors">
            <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#aebac1]" />
          </button>
          <button className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors">
            <Search className="w-5 h-5 md:w-6 md:h-6 text-[#aebac1]" />
          </button>
          <button className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 md:w-6 md:h-6 text-[#aebac1]" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto chat-pattern px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-6 md:py-8 space-y-2">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Header */}
            <div className="flex justify-center my-8">
              <span className="bg-[#182229] text-[#8696a0] text-xs md:text-sm px-5 py-2.5 rounded-full shadow-md border border-[#2a3942]">
                {formatDateHeader(group.date)}
              </span>
            </div>

            {/* Messages */}
            {group.messages.map((msg, msgIndex) => {
              const isOutbound = msg.direction === 'outbound';
              const showTail = msgIndex === 0 || 
                group.messages[msgIndex - 1].direction !== msg.direction;

              return (
                <div
                  key={msg.sid}
                  className={`flex mb-3 message-appear ${
                    isOutbound ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] px-4 md:px-5 py-2 rounded-2xl shadow-md ${
                      isOutbound
                        ? `bg-[#005c4b] text-[#e9edef] ${showTail ? 'message-out' : ''}`
                        : `bg-[#202c33] text-[#e9edef] ${showTail ? 'message-in' : ''}`
                    }`}
                  >
                    {/* Media Content */}
                    {msg.media && msg.media.length > 0 && (
                      <div className="mb-3">
                        {msg.media[0].content_type?.startsWith('image/') ? (
                          <div 
                            className="rounded-lg overflow-hidden cursor-pointer" 
                            onClick={() => {
                              if (msg.media?.[0]?.url) {
                                setViewingImage(msg.media[0].url);
                              }
                            }}
                          >
                            <img
                              src={msg.media[0].url}
                              alt={msg.media[0].filename || 'Image'}
                              className="max-w-full h-auto rounded-lg object-contain max-h-[300px]"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="bg-[#2a3942] rounded-lg p-4 flex items-center gap-3">
                            <File className="w-8 h-8 text-[#00a884]" />
                            <div>
                              <span className="text-[#e9edef] text-sm md:text-base block">{msg.media[0].filename}</span>
                              <span className="text-[#8696a0] text-xs">{(msg.media[0].size / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Body */}
                    <p className="text-[#e9edef] text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                      {msg.body}
                    </p>

                    {/* Time and Status */}
                    <div className="flex items-center justify-end gap-1.5 mt-2 -mb-0.5">
                      <span className="text-[11px] md:text-xs text-[#8696a0]">
                        {formatMessageTime(msg.dateCreated)}
                      </span>
                      {getStatusIcon(msg)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-5 md:px-6 lg:px-8 py-4 md:py-5 bg-[#202c33] flex items-center gap-3 md:gap-4 flex-shrink-0">
        <button className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors flex-shrink-0">
          <Smile className="w-6 h-6 md:w-7 md:h-7 text-[#8696a0]" />
        </button>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors"
          >
            <Paperclip className="w-6 h-6 md:w-7 md:h-7 text-[#8696a0]" />
          </button>

          {/* Attachment Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-full left-0 mb-3 bg-[#233138] rounded-xl shadow-xl overflow-hidden min-w-[200px]">
              <div className="py-3">
                <button className="w-full px-5 py-3 flex items-center gap-4 hover:bg-[#2a3942] transition-colors" onClick={handleImageSelect}>
                  <div className="w-11 h-11 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#e9edef] text-sm md:text-base">Photos & Videos</span>
                </button>
                <button className="w-full px-5 py-3 flex items-center gap-4 hover:bg-[#2a3942] transition-colors">
                  <div className="w-11 h-11 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#e9edef] text-sm md:text-base">Camera</span>
                </button>
                <button className="w-full px-5 py-3 flex items-center gap-4 hover:bg-[#2a3942] transition-colors">
                  <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <File className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#e9edef] text-sm md:text-base">Document</span>
                </button>
                <button className="w-full px-5 py-3 flex items-center gap-4 hover:bg-[#2a3942] transition-colors">
                  <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#e9edef] text-sm md:text-base">Contact</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="w-full bg-[#2a3942] text-[#e9edef] px-5 md:px-6 py-3 md:py-3.5 rounded-xl focus:outline-none placeholder-[#8696a0] text-sm md:text-base"
          />
        </div>

        {message.trim() || selectedImage ? (
          <button
            onClick={handleSend}
            disabled={sending}
            className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors flex-shrink-0"
          >
            <Send className={`w-6 h-6 md:w-7 md:h-7 ${sending ? 'text-[#8696a0]' : 'text-[#00a884]'}`} />
          </button>
        ) : (
          <button className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors flex-shrink-0">
            <Mic className="w-6 h-6 md:w-7 md:h-7 text-[#8696a0]" />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Preview */}
      {selectedImage && (
        <div className="px-5 md:px-6 lg:px-8 py-3 bg-[#202c33] border-t border-[#2a3942]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected image"
                className="w-16 h-16 object-cover rounded-lg"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-[#e9edef] text-sm">Image selected</p>
              <p className="text-[#8696a0] text-xs">
                {selectedImageFile?.name} ({(selectedImageFile?.size || 0) / 1024 / 1024 < 1
                  ? `${Math.round((selectedImageFile?.size || 0) / 1024)} KB`
                  : `${((selectedImageFile?.size || 0) / 1024 / 1024).toFixed(1)} MB`})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={viewingImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
