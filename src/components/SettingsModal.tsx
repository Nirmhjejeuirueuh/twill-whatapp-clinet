'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: TwilioConfig) => void;
  initialConfig: TwilioConfig;
}

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onSave,
  initialConfig,
}: SettingsModalProps) {
  const [config, setConfig] = useState<TwilioConfig>(initialConfig);
  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const params = new URLSearchParams({
        accountSid: config.accountSid,
        authToken: config.authToken,
        whatsappNumber: config.whatsappNumber,
      });

      const response = await fetch(`/api/messages?${params}`);
      const result = await response.json();

      setTestResult(result.success ? 'success' : 'error');
    } catch {
      setTestResult('error');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#111b21] rounded-lg w-full max-w-md mx-4 shadow-2xl border border-[#2a3942]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a3942]">
          <h2 className="text-lg font-medium text-[#e9edef]">Twilio Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#202c33] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#8696a0]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-[#8696a0] mb-2">
              Account SID
            </label>
            <input
              type="text"
              value={config.accountSid}
              onChange={(e) =>
                setConfig({ ...config, accountSid: e.target.value })
              }
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg border border-[#2a3942] focus:border-[#00a884] focus:outline-none transition-colors placeholder-[#8696a0]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#8696a0] mb-2">
              Auth Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={config.authToken}
                onChange={(e) =>
                  setConfig({ ...config, authToken: e.target.value })
                }
                placeholder="Your auth token"
                className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg border border-[#2a3942] focus:border-[#00a884] focus:outline-none transition-colors placeholder-[#8696a0] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8696a0] hover:text-[#e9edef] transition-colors"
              >
                {showToken ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#8696a0] mb-2">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={config.whatsappNumber}
              onChange={(e) =>
                setConfig({ ...config, whatsappNumber: e.target.value })
              }
              placeholder="+14155238886"
              className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg border border-[#2a3942] focus:border-[#00a884] focus:outline-none transition-colors placeholder-[#8696a0]"
            />
            <p className="text-xs text-[#8696a0] mt-1">
              Your Twilio WhatsApp-enabled number (without &quot;whatsapp:&quot; prefix)
            </p>
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                testResult === 'success'
                  ? 'bg-[#00a884]/20 text-[#00a884]'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {testResult === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Connection successful!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <span>Connection failed. Check your credentials.</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2a3942]">
          <button
            onClick={handleTest}
            disabled={testing || !config.accountSid || !config.authToken || !config.whatsappNumber}
            className="px-4 py-2 text-[#00a884] hover:bg-[#00a884]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          <button
            onClick={handleSave}
            disabled={!config.accountSid || !config.authToken || !config.whatsappNumber}
            className="px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#00a884]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
