'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  MoreVertical,
  Search,
  Filter,
  Settings,
  Users,
  Archive,
  Star,
  Trash2,
} from 'lucide-react';
import { Conversation } from '@/types';
import { formatPhoneNumber, getInitials } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

interface SidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onOpenSettings: () => void;
  onDeleteConversation: (conversationSid: string) => Promise<void>;
  whatsappNumber: string;
  onLoadMoreConversations?: () => Promise<void>;
  isLoadingMoreConversations?: boolean;
  onStartLazyLoading?: () => void;
  onStopLazyLoading?: () => void;
  isLazyLoadingActive?: boolean;
}

export default function Sidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  onOpenSettings,
  onDeleteConversation,
  whatsappNumber,
  onLoadMoreConversations,
  isLoadingMoreConversations = false,
  onStartLazyLoading,
  onStopLazyLoading,
  isLazyLoadingActive = false,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'groups'>('all');
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);
  const conversationsContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  const handleDelete = async (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation(); // Prevent conversation selection

    console.log('🗑️ Delete button clicked for conversation:', {
      sid: conversation.sid,
      phoneNumber: conversation.phoneNumber,
      friendlyName: conversation.friendly_name,
      sidType: typeof conversation.sid,
      sidLength: conversation.sid?.length || 0
    });

    // Don't allow deleting temp conversations or conversations without SID
    if (!conversation.sid || conversation.sid === 'temp-conv' || conversation.sid === '') {
      console.error('❌ Invalid conversation for deletion:', {
        hasSid: !!conversation.sid,
        sid: conversation.sid,
        isTempConv: conversation.sid === 'temp-conv',
        isEmpty: conversation.sid === ''
      });
      alert('Cannot delete this conversation: Invalid or unsaved conversation');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the conversation with ${formatPhoneNumber(conversation.phoneNumber)}?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      await onDeleteConversation(conversation.sid);
    }
  };

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

  const handleScroll = () => {
    if (!conversationsContainerRef.current) return;

    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set new timeout to debounce scroll events
    const timeout = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = conversationsContainerRef.current!;
      
      // Check if near top for lazy loading (loading older messages)
      const isNearTop = scrollTop < 100; // Within 100px of the top
      
      if (onStartLazyLoading && onStopLazyLoading) {
        if (isNearTop && !isLazyLoadingActive) {
          console.log('📜 User scrolled near top of conversation list - starting lazy loading');
          onStartLazyLoading();
        } else if (!isNearTop && isLazyLoadingActive) {
          console.log('📜 User scrolled away from top of conversation list - stopping lazy loading');
          onStopLazyLoading();
        }
      }

      // Check if near bottom for loading more conversations
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold

      if (isNearBottom && onLoadMoreConversations && !isLoadingMoreConversations) {
        onLoadMoreConversations();
      }
    }, 300); // 300ms debounce

    setScrollTimeout(timeout);
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
    <div className="w-full md:w-[380px] lg:w-[420px] md:min-w-[340px] md:max-w-[480px] bg-[#111b21] border-r border-[#2a3942] flex flex-col h-full">
      {/* Header */}
      <div className="h-[70px] px-5 md:px-6 flex items-center justify-between bg-[#202c33] border-b border-[#2a3942]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-full bg-[#00a884] flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm md:text-base text-[#e9edef] font-medium truncate">WhatsApp Business</span>
            <span className="text-xs text-[#8696a0] truncate">
              {whatsappNumber ? formatPhoneNumber(whatsappNumber) : 'Not connected'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors">
            <Users className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors">
            <Archive className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors"
          >
            <Settings className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button className="p-2 md:p-2.5 hover:bg-[#2a3942] rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-[#aebac1]" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-5 md:px-6 space-y-2 border-b border-[#2a3942]">
        <div className="flex items-center gap-3 bg-[#202c33] rounded-lg px-4 py-2 mt-4">
          <Search className="w-5 h-5 text-[#8696a0] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#e9edef] focus:outline-none placeholder-[#8696a0] text-sm md:text-base"
          />
          <button className="p-1.5 hover:bg-[#2a3942] rounded-full transition-colors flex-shrink-0">
            <Filter className="w-5 h-5 text-[#8696a0]" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2.5 overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2 my-2 text-sm md:text-base rounded-full transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#00a884] text-white'
                : 'bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-5 my-2 text-sm md:text-base rounded-full transition-colors whitespace-nowrap ${
              activeFilter === 'unread'
                ? 'bg-[#00a884] text-white'
                : 'bg-[#202c33] text-[#8696a0] hover:bg-[#2a3942]'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveFilter('groups')}
            className={`px-5 my-2 text-sm md:text-base rounded-full transition-colors whitespace-nowrap ${
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
      <div 
        ref={conversationsContainerRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#8696a0] px-8 py-12">
            <MessageSquare className="w-20 h-20 mb-6 opacity-50" />
            <p className="text-center text-sm md:text-base leading-relaxed">
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
              onMouseEnter={() => setHoveredConversation(conversation.phoneNumber)}
              onMouseLeave={() => setHoveredConversation(null)}
              className={`flex items-center gap-4 px-5 md:px-6 py-4 md:py-5 cursor-pointer transition-colors border-b border-[#2a3942]/50 hover:bg-[#202c33] relative ${
                selectedConversation?.phoneNumber === conversation.phoneNumber
                  ? 'bg-[#2a3942] border-l-4 border-l-[#00a884]'
                  : ''
              }`}
            >
              {/* Avatar */}
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${getAvatarColor(conversation.phoneNumber)}`}>
                <span className="text-white font-medium text-sm md:text-base">
                  {getInitials(conversation.phoneNumber)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#e9edef] font-medium truncate text-sm md:text-base">
                    {conversation.profileName || formatPhoneNumber(conversation.phoneNumber)}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {/* Delete button - show on hover */}
                    {hoveredConversation === conversation.phoneNumber && (
                      <button
                        onClick={(e) => handleDelete(e, conversation)}
                        className="p-1.5 hover:bg-[#374249] rounded-full transition-colors"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4 text-[#8696a0] hover:text-red-400" />
                      </button>
                    )}
                    <span
                      className={`text-xs md:text-sm ${
                        conversation.unreadCount > 0
                          ? 'text-[#00a884] font-medium'
                          : 'text-[#8696a0]'
                      }`}
                    >
                      {conversation.lastMessage ? formatMessageTime(conversation.lastMessage.dateCreated) : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm md:text-base text-[#8696a0] truncate flex items-center gap-1.5 max-w-[70%]">
                    {conversation.lastMessage?.direction === 'outbound' && (
                      <span className="text-[#53bdeb] flex-shrink-0">✓</span>
                    )}
                    {conversation.lastMessage?.body || '[No messages]'}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {conversation.unreadCount > 0 && (
                      <span className="bg-[#00a884] text-white text-xs md:text-sm rounded-full min-w-[22px] h-6 flex items-center justify-center px-2">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator for more conversations */}
        {isLoadingMoreConversations && (
          <div className="flex items-center justify-center py-4 px-6">
            <div className="flex items-center gap-3 text-[#8696a0]">
              <div className="w-4 h-4 border-2 border-[#8696a0] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading more conversations...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer with encryption notice */}
      <div className="px-6 py-4 border-t border-[#2a3942]">
        <p className="text-xs md:text-sm text-[#8696a0] text-center leading-relaxed">
          🔒 Messages are end-to-end encrypted via Twilio
        </p>
      </div>
    </div>
  );
}
