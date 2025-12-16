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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

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

  const getStatusIcon = (status: Message['status'], direction: Message['direction']) => {
    if (direction === 'inbound') return null;

    switch (status) {
      case 'queued':
        return <Clock className="w-3.5 h-3.5 text-[#8696a0]" />;
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-[#8696a0]" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-[#8696a0]" />;
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />;
      case 'failed':
        return <span className="text-red-500 text-xs">!</span>;
      default:
        return <Check className="w-3.5 h-3.5 text-[#8696a0]" />;
    }
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

  return (
    <div className="flex-1 flex flex-col bg-[#0b141a] h-full">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between bg-[#202c33] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(conversation.phoneNumber)}`}>
            <span className="text-white font-medium">
              {getInitials(conversation.phoneNumber)}
            </span>
          </div>
          <div>
            <h2 className="text-[#e9edef] font-normal">
              {conversation.profileName || formatPhoneNumber(conversation.phoneNumber)}
            </h2>
            <p className="text-xs text-[#8696a0]">
              {conversation.isOnline
                ? 'online'
                : conversation.lastSeen
                ? `last seen ${conversation.lastSeen}`
                : 'click here for contact info'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-[#2a3942] rounded-full transition-colors">
            <Video className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button className="p-2 hover:bg-[#2a3942] rounded-full transition-colors">
            <Phone className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button className="p-2 hover:bg-[#2a3942] rounded-full transition-colors">
            <Search className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button className="p-2 hover:bg-[#2a3942] rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-[#aebac1]" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto chat-pattern px-[60px] py-4">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Header */}
            <div className="flex justify-center my-4">
              <span className="bg-[#182229] text-[#8696a0] text-xs px-3 py-1 rounded-lg shadow-sm">
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
                  className={`flex mb-1 message-appear ${
                    isOutbound ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`relative max-w-[65%] px-3 py-2 rounded-lg shadow-sm ${
                      isOutbound
                        ? `bg-[#005c4b] ${showTail ? 'message-out' : ''}`
                        : `bg-[#202c33] ${showTail ? 'message-in' : ''}`
                    }`}
                  >
                    {/* Media Content */}
                    {msg.mediaUrl && msg.mediaUrl.length > 0 && (
                      <div className="mb-2">
                        {msg.mediaContentType?.[0]?.startsWith('image/') ? (
                          <img
                            src={msg.mediaUrl[0]}
                            alt="Media"
                            className="rounded-lg max-w-full"
                          />
                        ) : (
                          <div className="bg-[#2a3942] rounded-lg p-3 flex items-center gap-2">
                            <File className="w-8 h-8 text-[#00a884]" />
                            <span className="text-[#e9edef] text-sm">Attachment</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Body */}
                    <p className="text-[#e9edef] text-sm whitespace-pre-wrap break-words">
                      {msg.body}
                    </p>

                    {/* Time and Status */}
                    <div className="flex items-center justify-end gap-1 mt-1 -mb-1">
                      <span className="text-[10px] text-[#8696a0]">
                        {formatMessageTime(msg.dateCreated)}
                      </span>
                      {getStatusIcon(msg.status, msg.direction)}
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
      <div className="px-4 py-3 bg-[#202c33] flex items-center gap-2 flex-shrink-0">
        <button className="p-2 hover:bg-[#2a3942] rounded-full transition-colors">
          <Smile className="w-6 h-6 text-[#8696a0]" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2 hover:bg-[#2a3942] rounded-full transition-colors"
          >
            <Paperclip className="w-6 h-6 text-[#8696a0]" />
          </button>

          {/* Attachment Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-[#233138] rounded-lg shadow-lg overflow-hidden">
              <div className="py-2">
                <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#2a3942] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#e9edef]">Photos & Videos</span>
                </button>
                <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#2a3942] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#e9edef]">Camera</span>
                </button>
                <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#2a3942] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <File className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#e9edef]">Document</span>
                </button>
                <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#2a3942] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#e9edef]">Contact</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg focus:outline-none placeholder-[#8696a0]"
          />
        </div>

        {message.trim() ? (
          <button
            onClick={handleSend}
            disabled={sending}
            className="p-2 hover:bg-[#2a3942] rounded-full transition-colors"
          >
            <Send className={`w-6 h-6 ${sending ? 'text-[#8696a0]' : 'text-[#00a884]'}`} />
          </button>
        ) : (
          <button className="p-2 hover:bg-[#2a3942] rounded-full transition-colors">
            <Mic className="w-6 h-6 text-[#8696a0]" />
          </button>
        )}
      </div>
    </div>
  );
}
