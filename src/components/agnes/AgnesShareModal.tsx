import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Send, 
  Sparkles, 
  ExternalLink, 
  Code,
  QrCode,
  Users
} from 'lucide-react';
import { AgnesVideo } from '../../types/agnesVideo';

interface AgnesShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: AgnesVideo;
}

export const AgnesShareModal: React.FC<AgnesShareModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'message' | 'embed'>('link');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/student/agnes-videos?v=${video.id}` 
    : `https://lumora.ai/student/agnes-videos?v=${video.id}`;

  const shareText = `🎓 Check out this tough topic breakdown on "${video.title}" by Dr. Agnes Vance on LumoraAI!\n\n💡 "${video.hookSentence}"\n\nWatch the interactive chalkboard derivation and simulations:\n${currentUrl}`;

  const embedCode = `<iframe src="${currentUrl}" width="100%" height="600" title="${video.title} - Dr. Agnes Masterclass" frameborder="0" allow="fullscreen"></iframe>`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {}
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2500);
    } catch {}
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Master ${video.topic} with Dr. Agnes Vance! ${video.hookSentence}`,
          url: currentUrl,
        });
      } catch (err) {
        console.warn('Native share dismissed or failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(video.title + ' - Dr. Agnes Masterclass')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Share Video Lecture</h3>
              <p className="text-[11px] text-slate-400">Share with classmates, study partners, or teachers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Card Brief */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
                {video.subject}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {video.estimatedDuration} • {video.scenes.length} Scenes
              </span>
            </div>
            <h4 className="text-sm font-black text-white line-clamp-1">{video.title}</h4>
            <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">
              &quot;{video.hookSentence}&quot;
            </p>
          </div>

          {/* Share Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'link' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct Link
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'message' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Study Group Post
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'embed' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Embed / Code
            </button>
          </div>

          {/* Tab 1: Direct Link */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 truncate">
                  {currentUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Instant Social Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleWhatsAppShare}
                  className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleTelegramShare}
                  className="p-3 rounded-2xl bg-sky-950/40 hover:bg-sky-950/70 border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Telegram</span>
                </button>
              </div>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition border border-slate-700"
                >
                  <Share2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>More Sharing Options (Device Share)</span>
                </button>
              )}
            </div>
          )}

          {/* Tab 2: Study Group Post */}
          {activeTab === 'message' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                A formatted academic study note ready to paste into your Discord server, WhatsApp study group, or classroom forum:
              </p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-line leading-relaxed max-h-44 overflow-y-auto">
                {shareText}
              </div>
              <button
                onClick={handleCopyText}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  copiedText
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? 'Copied Message to Clipboard!' : 'Copy Study Group Message'}</span>
              </button>
            </div>
          )}

          {/* Tab 3: Embed */}
          {activeTab === 'embed' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Embed this interactive Agnes Video masterclass into your student portfolio, blog, or LMS:
              </p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 break-all leading-relaxed">
                {embedCode}
              </div>
              <button
                onClick={handleCopyEmbed}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  copiedEmbed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {copiedEmbed ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                <span>{copiedEmbed ? 'Copied Embed Code!' : 'Copy iFrame Embed Code'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-rose-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Encourage peer learning & group discussion</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
