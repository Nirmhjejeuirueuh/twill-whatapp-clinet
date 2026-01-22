'use client';

import { Wifi, WifiOff, RefreshCw, Settings } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export default function ConnectionStatus({
  isConnected,
  isLoading,
  error,
  onRefresh,
  onOpenSettings,
}: ConnectionStatusProps) {
  if (isConnected && !error) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Loading State */}
      {isLoading && (
        <div className="bg-[#00a884] text-white px-5 md:px-6 py-3 md:py-3.5 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm md:text-base">Connecting to Twilio...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-600 text-white px-5 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm md:text-base">{error}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="px-4 md:px-5 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm md:text-base flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
              Retry
            </button>
            <button
              onClick={onOpenSettings}
              className="px-4 md:px-5 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm md:text-base flex items-center gap-2"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
              Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
