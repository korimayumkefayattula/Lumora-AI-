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
            className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
              theme === 'focus'
                ? 'bg-[#201c18] border-[#382e25]'
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-300 dark:border-slate-600"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white theme-focus:text-amber-100 truncate">
                  {peer.name}
                </h4>
                <p className="text-[10px] text-slate-400 theme-focus:text-amber-300/60 truncate font-medium">
                  {peer.subject} • {peer.sessionMinutes}m sprint
                </p>
              </div>
            </div>

            {/* High Five / Cheer Button */}
            <button
              onClick={() => handleCheer(peer.id)}
              className={`p-1.5 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all active:scale-95 ${
                cheeredPeers[peer.id]
                  ? 'bg-rose-500 text-white border-rose-500 animate-bounce'
                  : 'bg-white dark:bg-slate-700 theme-focus:bg-[#14120f] border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-rose-500'
              }`}
              title="Send motivation cheer"
            >
              <Heart className={`w-3 h-3 ${cheeredPeers[peer.id] ? 'fill-current' : ''}`} />
              <span className="text-[10px]">
                {cheeredPeers[peer.id] ? 'Cheered!' : 'Cheer'}
              </span>
            </button>
          </div>
        ))}

        {/* Global Motivational Pulse */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
          theme === 'focus'
            ? 'bg-[#201c18] border-[#382e25] text-amber-200'
            : 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200'
        }`}>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="text-[11px] font-bold">Silent Co-Study Lounge</span>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 theme-focus:text-amber-400">
            Join Room →
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};
