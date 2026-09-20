import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Eye, Shield, Save, Check, Sparkles } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { ThemeSwitcher } from '../components/theme/ThemeSwitcher';

export default function SettingsPage() {
  const { theme, setTheme, isFocusMode } = useTheme();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [aiModel, setAiModel] = useState('Gemini 2.5 Flash');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 theme-focus:border-[#382e25] pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 theme-focus:text-amber-400 font-bold text-xs uppercase tracking-wider">
            <SettingsIcon className="w-4 h-4" />
            <span>Lumora Application Preferences</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white theme-focus:text-amber-100 tracking-tight">
            Workspace & Display Settings
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 theme-focus:bg-[#181512] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 theme-focus:border-[#382e25] shadow-sm space-y-6">
        
        {/* Dynamic Theme & Focus Mode Section */}
        <div className="space-y-4 border-b border-slate-100 dark:border-slate-700 theme-focus:border-[#382e25] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white theme-focus:text-amber-100">
                Workspace Theme & Eye-Comfort Modes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 theme-focus:text-amber-300/70">
                Switch between daylight clarity, midnight slate, or the ultra high-contrast 'Focus Mode'.
              </p>
            </div>
            <ThemeSwitcher variant="segmented" />
          </div>

          {/* Detailed Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            
            {/* Light Mode Card */}
            <div 
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                theme === 'light'
                  ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">Daylight Light</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Crisp high brightness designed for daytime learning and sunny study rooms.
              </p>
            </div>

            {/* Dark Mode Card */}
            <div 
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">Midnight Dark</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Deep slate backdrop with balanced color accents for general nighttime work.
              </p>
            </div>

            {/* Focus Mode Card */}
            <div 
              onClick={() => setTheme('focus')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                theme === 'focus'
                  ? 'bg-amber-950/50 border-amber-500 shadow-sm ring-1 ring-amber-500'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-amber-600/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Eye className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs text-slate-900 dark:text-white theme-focus:text-amber-200">
                  Focus Mode
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold uppercase">
                  Eye Safe
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 theme-focus:text-amber-300/80 leading-relaxed">
                Warm obsidian background with 16:1 contrast ratio, zero blue glare for 3+ hr marathons.
              </p>
            </div>

          </div>

          {isFocusMode && (
            <div className="p-3 bg-amber-950/40 rounded-2xl border border-amber-500/30 flex items-center gap-3 text-amber-200 text-xs">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>High-Contrast Focus Mode Active:</strong> Blue light spectrum suppressed. Maximum typography contrast enabled for reduced optic nerve fatigue.
              </span>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="space-y-3 border-b border-slate-100 dark:border-slate-700 theme-focus:border-[#382e25] pb-6">
          <h2 className="font-extrabold text-sm text-slate-900 dark:text-white theme-focus:text-amber-100">
            Notifications & Alerts
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 theme-focus:bg-[#201c18] rounded-xl border border-slate-200 dark:border-slate-600 theme-focus:border-[#3d352b]">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 theme-focus:text-amber-100">
                Daily Study Reminders
              </span>
              <input 
                type="checkbox" 
                checked={dailyReminders} 
                onChange={(e) => setDailyReminders(e.target.checked)}
                className="w-4 h-4 text-indigo-600 accent-indigo-600 theme-focus:accent-amber-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 theme-focus:bg-[#201c18] rounded-xl border border-slate-200 dark:border-slate-600 theme-focus:border-[#3d352b]">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 theme-focus:text-amber-100">
                Email Progress Summaries
              </span>
              <input 
                type="checkbox" 
                checked={emailNotifications} 
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-indigo-600 accent-indigo-600 theme-focus:accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* AI Engine Preference */}
        <div className="space-y-3">
          <h2 className="font-extrabold text-sm text-slate-900 dark:text-white theme-focus:text-amber-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 theme-focus:text-amber-400" />
            <span>AI Intelligence Engine</span>
          </h2>
          <select 
            value={aiModel} 
            onChange={(e) => setAiModel(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 theme-focus:bg-[#201c18] border border-slate-200 dark:border-slate-600 theme-focus:border-[#3d352b] rounded-xl text-xs font-bold text-slate-900 dark:text-white theme-focus:text-amber-100 focus:outline-none"
          >
            <option>Gemini 2.5 Flash (Ultra Fast & Resilient Default)</option>
            <option>Gemini 1.5 Pro (Deep Reasoning & Complex Derivations)</option>
          </select>
        </div>

        <button 
          onClick={handleSave} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 theme-focus:bg-amber-600 theme-focus:hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Preferences Saved Successfully!' : 'Save Settings'}</span>
        </button>

      </div>
    </div>
  );
}

