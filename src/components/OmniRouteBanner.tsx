import React, { useState } from 'react';
import { Network, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { useAIProvider } from '../context/AIProviderContext';

export const OmniRouteBanner: React.FC = () => {
  const { 
    provider, 
    setProvider, 
    omniRouteUrl, 
    setOmniRouteUrl, 
    omniRouteModel, 
    setOmniRouteModel, 
    omniRouteStatus, 
    checkOmniRouteStatus, 
    isCheckingStatus 
  } = useAIProvider();

  const [isOpen, setIsOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(omniRouteUrl);

  const handleTestConnection = async () => {
    setOmniRouteUrl(tempUrl);
    await checkOmniRouteStatus(tempUrl);
  };

  return (
    <div className="bg-[#121215]/90 dark:bg-[#121215]/95 border border-zinc-800/90 rounded-3xl p-5 shadow-xl backdrop-blur-xl transition-all mb-6 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${omniRouteStatus.connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">OmniRoute AI Gateway</h3>
              {omniRouteStatus.connected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-bold border border-emerald-800/70">
                  <CheckCircle2 className="w-3 h-3" /> Connected (:20128)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 text-[10px] font-bold border border-amber-800/60">
                  <AlertCircle className="w-3 h-3" /> Standby / Local
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {provider === 'omniroute' 
                ? `Active Provider • Routing requests through OmniRoute (${omniRouteModel})` 
                : 'Routing via Google Gemini • Toggle to route through OmniRoute'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setProvider(provider === 'omniroute' ? 'gemini' : 'omniroute')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              provider === 'omniroute'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/50'
                : 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 hover:border-rose-500/50'
            }`}
          >
            {provider === 'omniroute' ? '✓ OmniRoute Active' : 'Switch to OmniRoute'}
          </button>
          
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Configure OmniRoute Settings"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                OmniRoute Endpoint URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="http://localhost:20128"
                  className="w-full px-3 py-1.5 text-xs bg-[#0a0a0d] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isCheckingStatus}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                  Test
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                Target AI Model
              </label>
              {omniRouteStatus.models.length > 0 ? (
                <select
                  value={omniRouteModel}
                  onChange={(e) => setOmniRouteModel(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#0a0a0d] border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-rose-500 font-medium"
                >
                  {omniRouteStatus.models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={omniRouteModel}
                  onChange={(e) => setOmniRouteModel(e.target.value)}
                  placeholder="e.g. gpt-4o-mini, claude-3-5-sonnet, dall-e-3"
                  className="w-full px-3 py-1.5 text-xs bg-[#0a0a0d] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
            <span>Dashboard: <a href="http://localhost:20128/dashboard" target="_blank" rel="noreferrer" className="text-rose-400 font-semibold hover:underline inline-flex items-center gap-0.5">localhost:20128/dashboard <ExternalLink className="w-2.5 h-2.5" /></a></span>
            <span className="text-[10px] text-zinc-500">Routes study plans, tutoring, doubts & image synthesis</span>
          </div>
        </div>
      )}
    </div>
  );
};
