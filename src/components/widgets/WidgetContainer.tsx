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
      className={`rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col ${
        theme === 'focus'
          ? 'bg-[#181512] border-[#382e25] text-amber-100 shadow-xs hover:border-[#4d3f33]'
          : theme === 'dark'
          ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xs hover:border-slate-700'
          : 'bg-white border-slate-200/90 text-slate-900 shadow-xs hover:border-slate-300'
      } ${isPinned ? 'ring-2 ring-indigo-500/40 theme-focus:ring-amber-500/40' : ''} ${className}`}
    >
      {/* Widget Header */}
      <div className={`px-5 py-4 flex items-center justify-between border-b transition-colors ${
        theme === 'focus'
          ? 'border-[#2d241d] bg-[#14120f]/60'
          : theme === 'dark'
          ? 'border-slate-800/80 bg-slate-950/40'
          : 'border-slate-100 bg-slate-50/70'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
            theme === 'focus'
              ? 'bg-[#26201a] border-[#44382c] text-amber-400'
              : theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-indigo-400'
              : 'bg-indigo-50 border-indigo-100 text-indigo-600'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight truncate">{title}</h3>
              {badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                  badgeColor || (theme === 'focus' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300')
                }`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 theme-focus:text-amber-300/60 truncate font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {headerAction}

          {onRefresh && (
            <button
              onClick={handleRefresh}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 theme-focus:hover:text-amber-200 transition-colors ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Refresh widget"
              aria-label="Refresh widget"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-lg transition-colors ${
              isPinned
                ? 'text-indigo-500 theme-focus:text-amber-400 bg-indigo-50 dark:bg-indigo-950/40 theme-focus:bg-amber-950/40'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 theme-focus:hover:text-amber-200'
            }`}
            title={isPinned ? 'Unpin widget' : 'Pin widget to top'}
            aria-label="Pin widget"
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 theme-focus:hover:text-amber-200 transition-colors"
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
        <div className="p-5 flex-1 flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
