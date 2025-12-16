'use client';

import { useState } from 'react';
import {
  MessageSquare,
  MoreVertical,
  Search,
  Filter,
  Settings,
  Users,
  Archive,
  Star,
} from 'lucide-react';
import { Conversation } from '@/types';
import { formatPhoneNumber, getInitials } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

interface SidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onOpenSettings: () => void;
  whatsappNumber: string;
}

export default function Sidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  onOpenSettings,
  whatsappNumber,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'groups'>('all');

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.phoneNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeFilter === 'unread') {
      return matchesSearch && conv.unreadCount > 0;
    }

    return matchesSearch;
  });

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'dd/MM/yyyy');
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

  return (
    <div className="w-[400px] min-w-[320px] max-w-[450px] bg-[#111b21] border-r border-[#2a3942] flex flex-col h-full">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between bg-[#202c33] border-b border-[#2a3942]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm text-[#e9edef] font-medium truncate">WhatsApp Business</span>
            <span className="text-xs text-[#8696a0] truncate">
              {whatsappNumber ? formatPhoneNumber(whatsappNumber) : 'Not connected'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="p-2 hover:bg-[#2a3942] rounded-full transition-colors">
            <Users className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button className="p-2 hover:bg-[#2a3942] rounded-full transition-colors">
            <Archive className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-[#2a3942] rounded-full transition-colors"
          >
            <Settings className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button className="p-2 hover:bg-[#2a3942] rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-[#aebac1]" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 py-3 space-y-3 border-b border-[#2a3942]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8696a0]" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#202c33] text-[#e9edef] pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884]/50 placeholder-[#8696a0] text-sm"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#2a3942] rounded-full transition-colors">
            <Filter className="w-4 h-4 text-[#8696a0]" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#00a884] text-white'
                : 'bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
              activeFilter === 'unread'
                ? 'bg-[#00a884] text-white'
                : 'bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveFilter('groups')}
            className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
              activeFilter === 'groups'
                ? 'bg-[#00a884] text-white'
                : 'bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]'
            }`}
          >
            Groups
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#8696a0] px-6 py-8">
            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center text-sm leading-relaxed">
              {searchQuery
                ? 'No conversations found matching your search'
                : 'No conversations yet. Start a new chat to begin messaging.'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.phoneNumber}
              onClick={() => onSelectConversation(conversation)}
              className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors border-b border-[#2a3942]/50 hover:bg-[#202c33] ${
                selectedConversation?.phoneNumber === conversation.phoneNumber
                  ? 'bg-[#2a3942] border-l-4 border-l-[#00a884]'
                  : ''
              }`}
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getAvatarColor(conversation.phoneNumber)}`}>
                <span className="text-white font-medium text-sm">
                  {getInitials(conversation.phoneNumber)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#e9edef] font-medium truncate text-sm">
                    {conversation.profileName || formatPhoneNumber(conversation.phoneNumber)}
                  </span>
                  <span
                    className={`text-xs flex-shrink-0 ${
                      conversation.unreadCount > 0
                        ? 'text-[#00a884] font-medium'
                        : 'text-[#8696a0]'
                    }`}
                  >
                    {formatMessageTime(conversation.lastMessage.dateCreated)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#8696a0] truncate flex items-center gap-1 max-w-[70%]">
                    {conversation.lastMessage.direction === 'outbound' && (
                      <span className="text-[#53bdeb] flex-shrink-0">✓</span>
                    )}
                    {conversation.lastMessage.body || '[Media]'}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {conversation.unreadCount > 0 && (
                      <span className="bg-[#00a884] text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with encryption notice */}
      <div className="px-4 py-3 border-t border-[#2a3942]">
        <p className="text-xs text-[#8696a0] text-center">
          🔒 Messages are end-to-end encrypted via Twilio
        </p>
      </div>
    </div>
  );
}
