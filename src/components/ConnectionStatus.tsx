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
        <div className="bg-[#00a884] text-white px-4 py-2 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Connecting to Twilio...</span>
        </div>
      )}

      {/* Not Connected State */}
      {!isLoading && !isConnected && !error && (
        <div className="bg-yellow-600 text-white px-4 py-2 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">Not connected. Please configure your Twilio credentials.</span>
          <button
            onClick={onOpenSettings}
            className="ml-2 px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors text-sm"
          >
            <Settings className="w-4 h-4 inline mr-1" />
            Settings
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors text-sm flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={onOpenSettings}
              className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors text-sm flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
