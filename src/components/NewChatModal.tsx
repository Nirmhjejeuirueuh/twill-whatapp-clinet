'use client';

import { useState } from 'react';
import { X, ArrowLeft, Search, UserPlus } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (phoneNumber: string) => void;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onStartChat,
}: NewChatModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleStartChat = () => {
    if (phoneNumber.trim()) {
      // Format the phone number
      let formatted = phoneNumber.trim();
      if (!formatted.startsWith('+')) {
        formatted = '+' + formatted;
      }
      onStartChat(formatted);
      setPhoneNumber('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-start z-50">
      <div className="bg-[#111b21] w-[400px] h-full flex flex-col animate-slide-in">
        {/* Header */}
        <div className="bg-[#202c33] pt-[60px] pb-4 px-6">
          <div className="flex items-center gap-6">
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#2a3942] rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#e9edef]" />
            </button>
            <h2 className="text-lg text-[#e9edef]">New chat</h2>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8696a0]" />
            <input
              type="text"
              placeholder="Search name or number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#202c33] text-[#e9edef] pl-12 pr-4 py-2 rounded-lg focus:outline-none placeholder-[#8696a0] text-sm"
            />
          </div>
        </div>

        {/* New Contact */}
        <div className="px-3 py-2">
          <button className="w-full flex items-center gap-4 p-3 hover:bg-[#202c33] rounded-lg transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <span className="text-[#e9edef]">New contact</span>
          </button>
        </div>

        {/* Manual Phone Entry */}
        <div className="px-6 py-4 border-t border-[#2a3942]">
          <p className="text-sm text-[#8696a0] mb-3">
            Enter a phone number to start a chat
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg focus:outline-none placeholder-[#8696a0]"
            />
            <button
              onClick={handleStartChat}
              disabled={!phoneNumber.trim()}
              className="px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#00a884]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start
            </button>
          </div>
          <p className="text-xs text-[#8696a0] mt-2">
            Include country code (e.g., +1 for US)
          </p>
        </div>

        {/* Frequently Contacted */}
        <div className="px-6 py-4">
          <p className="text-xs text-[#00a884] font-medium mb-2">
            FREQUENTLY CONTACTED
          </p>
          <div className="text-center text-[#8696a0] py-8">
            <p className="text-sm">No frequent contacts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
