'use client';

import { MessageSquare, Lock, Laptop, Phone } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#222e35] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00a884] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md px-8">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-[#2a3942]/50 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#2a3942] flex items-center justify-center">
              <MessageSquare className="w-12 h-12 text-[#8696a0]" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center animate-bounce">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-light text-[#e9edef] mb-4">
          WhatsApp Web
        </h1>

        {/* Description */}
        <p className="text-[#8696a0] text-sm leading-relaxed mb-6">
          Send and receive messages without keeping your phone online.
          <br />
          Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
        </p>

        {/* Features */}
        <div className="flex items-center gap-8 mb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#2a3942] flex items-center justify-center">
              <Laptop className="w-6 h-6 text-[#00a884]" />
            </div>
            <span className="text-xs text-[#8696a0]">Desktop</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#2a3942] flex items-center justify-center">
              <Phone className="w-6 h-6 text-[#00a884]" />
            </div>
            <span className="text-xs text-[#8696a0]">Mobile</span>
          </div>
        </div>

        {/* Encryption Notice */}
        <div className="flex items-center gap-2 text-[#8696a0]">
          <Lock className="w-4 h-4" />
          <span className="text-sm">End-to-end encrypted via Twilio</span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-[#00a884]" />
    </div>
  );
}
