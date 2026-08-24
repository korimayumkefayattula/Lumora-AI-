import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BrainCircuit, 
  BookOpen, 
  FileText, 
  Camera, 
  Layers, 
  TestTube, 
  Clock, 
  Calendar, 
  Brain, 
  PieChart, 
  BarChart3, 
  Target, 
  Users, 
  Trophy, 
  User, 
  Settings, 
  LogOut, 
  Search, 
  Compass, 
  FileCheck, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  Zap,
  Flame
} from 'lucide-react';
import LumoraLogo from '../LumoraLogo';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';
import { useTheme } from '../../context/ThemeContext';

export interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  shortcut?: string;
}

export interface NavGroup {
  groupName: string;
  categoryKey: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    groupName: 'Core AI Learning',
    categoryKey: 'core',
    items: [
      { name: 'Dashboard', path: '/student', icon: Sparkles },
      { name: 'Concept Explorer', path: '/student/concept-explorer', icon: Compass, badge: 'New' },
      { name: 'AI Homework Helper', path: '/student/homework-helper', icon: Camera, badge: 'AI' },
      { name: 'Explain Simply AI', path: '/student/explain-simply', icon: Sparkles },
      { name: 'AI Tutor', path: '/student/tutor', icon: BrainCircuit },
      { name: 'AI Doubt Solver', path: '/student/doubt-solver', icon: BookOpen },
      { name: 'PDF Learning', path: '/student/pdf-learning', icon: FileText }
    ]
  },
  {
    groupName: 'Smart Study Generators',
    categoryKey: 'generators',
    items: [
      { name: 'AI Summary', path: '/student/summary', icon: FileCheck },
      { name: 'AI Notes', path: '/student/notes', icon: FileText },
      { name: 'Flashcards', path: '/student/flashcards', icon: Layers },
      { name: 'Quiz Generator', path: '/student/quiz', icon: TestTube },
      { name: 'Mock Tests', path: '/student/mock-tests', icon: Clock },
      { name: 'AI Mind Map', path: '/student/mind-map', icon: Brain },
      { name: 'AI Image Gen', path: '/student/image-generator', icon: Sparkles },
      { name: 'Infographics', path: '/student/infographic-generator', icon: PieChart }
    ]
  },
  {
    groupName: 'Planning & Revision Hub',
    categoryKey: 'hub',
    items: [
      { name: 'Study Planner', path: '/student/study-planner', icon: Calendar },
      { name: 'Calendar', path: '/student/calendar', icon: Calendar },
      { name: 'Subjects & Chapters', path: '/student/subjects', icon: BookOpen },
      { name: 'Previous Papers', path: '/student/pyq', icon: Sparkles },
      { name: 'Revision Center', path: '/student/revision', icon: RefreshCw }
    ]
  },
  {
    groupName: 'Analytics & Community',
    categoryKey: 'growth',
    items: [
      { name: 'Analytics', path: '/student/analytics', icon: BarChart3 },
      { name: 'Goals', path: '/student/goals', icon: Target },
      { name: 'Community', path: '/student/community', icon: Users },
      { name: 'Leaderboard', path: '/student/leaderboard', icon: Trophy }
    ]
  }
];

interface FloatingSidebarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FloatingSidebar: React.FC<FloatingSidebarProps> = ({
  isMobile = false,
  onCloseMobile
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, isFocusMode } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter items based on search query or active category
  const filteredGroups = NAV_GROUPS.map((group) => {
    if (activeCategory !== 'all' && group.categoryKey !== activeCategory) {
      return null;
    }
    const filteredItems = group.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredItems.length === 0) return null;
    return {
      ...group,
      items: filteredItems
    };
  }).filter(Boolean) as NavGroup[];

  const sidebarWidthClass = isCollapsed ? 'w-20' : 'w-72';

  return (
    <aside 
      className={`
        ${isMobile ? 'w-full h-full' : `${sidebarWidthClass} my-3 ml-3 shrink-0 relative transition-all duration-300 ease-in-out`}
        flex flex-col
        rounded-3xl
        backdrop-blur-2xl
        ${theme === 'focus' 
          ? 'bg-[#161311]/90 border border-[#3d352b] text-amber-100 shadow-2xl shadow-black/80' 
          : theme === 'dark'
          ? 'bg-slate-900/85 border border-slate-800/90 text-slate-100 shadow-2xl shadow-indigo-950/20'
          : 'bg-white/85 border border-slate-200/90 text-slate-900 shadow-xl shadow-slate-200/50'
        }
        overflow-hidden
        z-30
      `}
    >
      {/* Floating Header */}
      <div className="p-4 pb-3 flex items-center justify-between border-b border-slate-100/50 dark:border-slate-800/60 theme-focus:border-[#382e25]">
        <div className="flex items-center gap-2 overflow-hidden">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/student')}>
              <LumoraLogo size="md" variant={theme === 'light' ? 'light' : 'dark'} />
            </div>
          ) : (
            <div 
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm cursor-pointer shadow-md mx-auto"
              onClick={() => setIsCollapsed(false)}
            >
              L
            </div>
          )}
        </div>

        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Quick Search & Category Tabs (Expanded only) */}
      {!isCollapsed && (
        <div className="px-3.5 pt-3 pb-2 space-y-2">
          {/* Live Tool Search */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
            theme === 'focus'
              ? 'bg-[#201c18] border-[#443930] focus-within:border-amber-500'
              : 'bg-slate-100/70 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/60 focus-within:border-indigo-500'
          }`}>
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools & features..."
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 theme-focus:text-amber-100 placeholder-slate-400 focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[10px] text-slate-400 hover:text-slate-200">
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[11px] font-bold">
            {[
              { key: 'all', label: 'All' },
              { key: 'core', label: 'Core' },
              { key: 'generators', label: 'Generators' },
              { key: 'hub', label: 'Hub' },
              { key: 'growth', label: 'Growth' }
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  activeCategory === cat.key
                    ? theme === 'focus'
                      ? 'bg-amber-900/60 text-amber-300 font-extrabold border border-amber-500/40'
                      : 'bg-indigo-600 text-white font-extrabold shadow-xs shadow-indigo-600/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Focus Mode Status Banner */}
      {isFocusMode && !isCollapsed && (
        <div className="mx-3.5 my-1.5 p-2.5 rounded-2xl bg-amber-950/40 border border-amber-600/30 flex items-center justify-between text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="font-extrabold text-[11px] tracking-wide">Focus Mode Active</span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono px-1.5 py-0.5 rounded bg-amber-900/60 border border-amber-600/40">
            Eye Safe
          </span>
        </div>
      )}

      {/* Navigation Links with Micro-animations */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-4">
        {filteredGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 theme-focus:text-amber-400/80">
                {group.groupName}
              </div>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = 
                  location.pathname === item.path || 
                  (item.path !== '/student' && location.pathname.startsWith(item.path));
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/student'}
                    onClick={onCloseMobile}
                    className="relative block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center ${
                        isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
                      } rounded-2xl text-xs font-bold transition-colors ${
                        isActive
                          ? theme === 'focus'
                            ? 'text-amber-100 font-extrabold'
                            : 'text-white font-extrabold'
                          : 'text-slate-600 dark:text-slate-300 theme-focus:text-amber-200/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {/* Spring Layout Micro-Animation Pill for Active State */}
                      {isActive && (
                        <motion.div
                          layoutId="activeFloatingNavPill"
                          className={`absolute inset-0 rounded-2xl shadow-lg -z-10 ${
                            theme === 'focus'
                              ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 border border-amber-400/40 shadow-amber-950/60'
                              : theme === 'dark'
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-600/30'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30'
                          }`}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}

                      <div className={`relative shrink-0 ${isActive ? 'scale-110' : ''} transition-transform`}>
                        <Icon 
                          className={`w-4 h-4 ${
                            isActive 
                              ? 'text-white' 
                              : 'text-slate-400 dark:text-slate-400 theme-focus:text-amber-400/80'
                          }`} 
                        />
                      </div>

                      {!isCollapsed && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-indigo-500/15 text-indigo-400 dark:text-indigo-300 theme-focus:bg-amber-400/20 theme-focus:text-amber-300'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Dock Controls */}
      <div className={`p-3 border-t border-slate-100/50 dark:border-slate-800/60 theme-focus:border-[#382e25] space-y-2 ${
        isCollapsed ? 'items-center text-center' : ''
      }`}>
        
        {/* Dynamic Theme Switcher */}
        {!isCollapsed ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 theme-focus:text-amber-400/70">
              <span>Theme Mode</span>
            </div>
            <ThemeSwitcher variant="segmented" className="w-full justify-between" />
          </div>
        ) : (
          <ThemeSwitcher variant="compact" className="mx-auto" />
        )}

        {/* Profile & Settings Quick Bar */}
        <div className={`pt-2 flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between'}`}>
          <button
            onClick={() => navigate('/student/profile')}
            className={`flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 theme-focus:hover:bg-[#241f1a] transition-colors text-left ${
              isCollapsed ? 'w-auto' : 'flex-1 min-w-0'
            }`}
            title="Profile"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="Alex Morgan"
              className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500 theme-focus:border-amber-400 shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold truncate text-slate-800 dark:text-slate-100 theme-focus:text-amber-100">
                  Alex Morgan
                </div>
                <div className="text-[10px] text-slate-400 theme-focus:text-amber-400/80 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>5 Day Streak</span>
                </div>
              </div>
            )}
          </button>

          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/student/settings')}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
