import React, { useState } from 'react';
import { LucideIcon, Maximize2, Minimize2, MoreVertical, RefreshCw, Pin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface WidgetContainerProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
  onRefresh?: () => void;
  onAction?: () => void;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-indigo-500',
  badge,
  badgeColor,
  onRefresh,
  headerAction,
  children,
  className = '',
  collapsible = false,
}) => {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  return (
    <div
      id={id}
      className={`rounded-3xl transition-all duration-300 overflow-hidden flex flex-col glass-panel ${
        theme === 'focus'
          ? 'text-amber-100 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(245,158,11,0.1)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7)]'
          : theme === 'dark'
          ? 'text-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7),inset_0_1.5px_2px_rgba(255,255,255,0.08)] hover:shadow-[0_25px_55px_-12px_rgba(0,0,0,0.85)]'
          : 'text-slate-900 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.1),inset_0_2px_3px_rgba(255,255,255,0.9)] hover:shadow-[0_22px_50px_-10px_rgba(0,0,0,0.14)]'
      } ${isPinned ? 'ring-2 ring-indigo-500/50 dark:ring-rose-500/50 theme-focus:ring-amber-500/50' : ''} ${className}`}
    >
      {/* Widget Header - Frosted Glass & Specular Edge */}
      <div className={`px-5 py-3.5 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
        theme === 'focus'
          ? 'border-[#2d241d]/70 bg-[#161310]/50'
          : theme === 'dark'
          ? 'border-white/[0.07] bg-white/[0.02]'
          : 'border-slate-200/50 bg-white/40'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          {/* Claymorphic 3D Icon Box */}
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 clay-icon-box transition-transform hover:scale-105 active:scale-95 ${
            theme === 'focus'
              ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/40 border border-amber-500/40 text-amber-400'
              : theme === 'dark'
              ? 'bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 text-rose-400'
              : 'bg-gradient-to-b from-white to-slate-100 border border-slate-200/80 text-indigo-600'
          }`}>
            <Icon className="w-4 h-4 drop-shadow-xs" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm tracking-tight truncate">{title}</h3>
              {badge && (
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 clay-pill transition-all ${
                  badgeColor || (theme === 'focus' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/15 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-500/20')
                }`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 theme-focus:text-amber-300/60 truncate font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right actions - Neuromorphic Tactile Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {headerAction}

          {onRefresh && (
            <button
              onClick={handleRefresh}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 theme-focus:hover:text-amber-200 neuro-btn-convex ${
                theme === 'focus' ? 'bg-[#201c18]' : theme === 'dark' ? 'bg-slate-800/80' : 'bg-white'
              } ${isRefreshing ? 'animate-spin' : ''}`}
              title="Refresh widget"
              aria-label="Refresh widget"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all neuro-btn-convex ${
              theme === 'focus' ? 'bg-[#201c18]' : theme === 'dark' ? 'bg-slate-800/80' : 'bg-white'
            } ${
              isPinned
                ? 'text-rose-500 theme-focus:text-amber-400 active'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 theme-focus:hover:text-amber-200'
            }`}
            title={isPinned ? 'Unpin widget' : 'Pin widget to top'}
            aria-label="Pin widget"
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 theme-focus:hover:text-amber-200 neuro-btn-convex ${
                theme === 'focus' ? 'bg-[#201c18]' : theme === 'dark' ? 'bg-slate-800/80' : 'bg-white'
              }`}
              title={isCollapsed ? 'Expand widget' : 'Collapse widget'}
              aria-label="Collapse widget"
            >
              {isCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Widget Body */}
      {!isCollapsed && (
        <div className="p-5 flex-1 flex flex-col backdrop-blur-xs">
          {children}
        </div>
      )}
    </div>
  );
};
