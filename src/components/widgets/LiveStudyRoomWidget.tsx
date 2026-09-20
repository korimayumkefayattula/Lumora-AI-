import React, { useState } from 'react';
import { Users, Flame, Heart, Sparkles, MessageSquare, Radio } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { useTheme } from '../../context/ThemeContext';
import { PeerStudent } from './types';

export const LiveStudyRoomWidget: React.FC = () => {
  const { theme } = useTheme();

  const [peers, setPeers] = useState<PeerStudent[]>([
    {
      id: 'p-1',
      name: 'Maya S.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      subject: 'Organic Chem',
      sessionMinutes: 42,
      status: 'focusing',
    },
    {
      id: 'p-2',
      name: 'Ethan K.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      subject: 'Calculus III',
      sessionMinutes: 75,
      status: 'focusing',
    },
    {
      id: 'p-3',
      name: 'Elena R.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      subject: 'Neuroscience',
      sessionMinutes: 25,
      status: 'focusing',
    },
  ]);

  const [cheeredPeers, setCheeredPeers] = useState<Record<string, boolean>>({});

  const handleCheer = (peerId: string) => {
    setCheeredPeers((prev) => ({ ...prev, [peerId]: true }));
    setTimeout(() => {
      setCheeredPeers((prev) => ({ ...prev, [peerId]: false }));
    }, 2000);
  };

  return (
    <WidgetContainer
      id="widget-live-study-room"
      title="Global Study Room"
      subtitle="1,420 students focusing live together"
      icon={Users}
      badge="Live Pulse"
      badgeColor="bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30"
    >
      <div className="space-y-3">
        {peers.map((peer) => (
          <div
            key={peer.id}
            className={`p-3.5 rounded-2xl clay-surface flex items-center justify-between transition-all ${
              theme === 'focus'
                ? 'bg-gradient-to-br from-[#26201a] to-[#181411] border border-amber-500/20 text-amber-100'
                : 'bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-white/10'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-9 h-9 rounded-full object-cover p-0.5 neuro-inset"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white theme-focus:text-amber-100 truncate">
                  {peer.name}
                </h4>
                <p className="text-[10px] text-slate-400 theme-focus:text-amber-300/60 truncate font-medium">
                  {peer.subject} • {peer.sessionMinutes}m sprint
                </p>
              </div>
            </div>

            {/* High Five / Cheer Button - Neuromorphic / Claymorphic Interaction */}
            <button
              onClick={() => handleCheer(peer.id)}
              className={`p-1.5 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                cheeredPeers[peer.id]
                  ? 'clay-pill bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-[0_4px_12px_rgba(244,63,94,0.4)] animate-bounce'
                  : 'neuro-btn-convex text-slate-600 dark:text-slate-300 hover:text-rose-500 bg-white dark:bg-slate-800'
              }`}
              title="Send motivation cheer"
            >
              <Heart className={`w-3 h-3 ${cheeredPeers[peer.id] ? 'fill-current text-white' : 'text-rose-500'}`} />
              <span className="text-[10px]">
                {cheeredPeers[peer.id] ? 'Cheered!' : 'Cheer'}
              </span>
            </button>
          </div>
        ))}

        {/* Global Motivational Pulse - Glassmorphic Frosted Bar */}
        <div className={`p-3 rounded-2xl glass-panel flex items-center justify-between text-xs ${
          theme === 'focus'
            ? 'border-amber-500/30 text-amber-200'
            : 'border-white/40 text-slate-800 dark:text-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="text-[11px] font-extrabold">Silent Co-Study Lounge</span>
          </div>
          <span className="text-[10px] font-black clay-pill px-2 py-0.5 bg-indigo-500/20 dark:bg-rose-500/20 text-indigo-600 dark:text-rose-300 theme-focus:text-amber-400 cursor-pointer">
            Join Room →
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};
