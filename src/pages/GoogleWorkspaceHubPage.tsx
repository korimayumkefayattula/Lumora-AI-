import React, { useState } from 'react';
import { 
  Calendar, 
  Mail, 
  MessageSquare, 
  FileQuestion, 
  FolderOpen, 
  StickyNote, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Database,
  Layers,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight,
  Mic
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleCalendarPanel } from '../components/workspace/GoogleCalendarPanel';
import { GmailStudyInboxPanel } from '../components/workspace/GmailStudyInboxPanel';
import { GoogleChatStudyPanel } from '../components/workspace/GoogleChatStudyPanel';
import { GoogleFormsPanel } from '../components/workspace/GoogleFormsPanel';
import { GooglePickerPanel } from '../components/workspace/GooglePickerPanel';
import { GoogleKeepNotesPanel } from '../components/workspace/GoogleKeepNotesPanel';
import { SpeechToKeepNoteModal } from '../components/workspace/SpeechToKeepNoteModal';

export default function GoogleWorkspaceHubPage() {
  const { user, workspaceToken, requestWorkspaceAccess } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'calendar' | 'gmail' | 'chat' | 'forms' | 'picker' | 'keep'>('all');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);

  const handleConnect = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      await requestWorkspaceAccess();
    } catch (err: any) {
      console.error('Workspace Auth failed:', err);
      setAuthError(err?.message || 'Failed to authorize Google Workspace scopes.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Services Hub', icon: Layers },
    { id: 'calendar', label: 'Google Calendar', icon: Calendar },
    { id: 'gmail', label: 'Gmail Inbox', icon: Mail },
    { id: 'chat', label: 'Google Chat', icon: MessageSquare },
    { id: 'forms', label: 'Google Forms', icon: FileQuestion },
    { id: 'picker', label: 'Google Drive Picker', icon: FolderOpen },
    { id: 'keep', label: 'Google Keep Notes', icon: StickyNote },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-blue-800/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Workspace & Firebase Suite</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Google Workspace & Academic Cloud
          </h1>

          <p className="text-xs md:text-sm text-blue-100/80 leading-relaxed max-w-2xl">
            Integrated productivity suite connecting Google Calendar, Gmail, Google Chat, Google Forms, Google Drive Picker, and Google Keep notes powered by Firebase Firestore.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Status pills & Dictate Keep Note CTA */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-xs font-semibold backdrop-blur-xs">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Firebase: cool-yardage-953sn</span>
            </div>

            <button
              onClick={() => setIsSpeechModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
              title="Dictate thoughts into a new Google Keep note"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>Dictate Keep Note (Speech API)</span>
            </button>

            {workspaceToken ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Account Connected ({user?.email || 'Authorized'})</span>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isAuthenticating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs transition-all shadow-md active:scale-95"
              >
                {/* Official Google 'G' icon styling */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isAuthenticating ? 'Connecting...' : 'Sign in with Google & Authorize'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Layers className="w-96 h-96 text-white" />
        </div>
      </div>

      {authError && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{authError}</span>
        </div>
      )}

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {(activeTab === 'all' || activeTab === 'calendar') && (
          <GoogleCalendarPanel token={workspaceToken} onRequestAuth={handleConnect} />
        )}

        {(activeTab === 'all' || activeTab === 'gmail') && (
          <GmailStudyInboxPanel token={workspaceToken} onRequestAuth={handleConnect} />
        )}

        {(activeTab === 'all' || activeTab === 'chat') && (
          <GoogleChatStudyPanel token={workspaceToken} onRequestAuth={handleConnect} />
        )}

        {(activeTab === 'all' || activeTab === 'forms') && (
          <GoogleFormsPanel token={workspaceToken} onRequestAuth={handleConnect} />
        )}

        {(activeTab === 'all' || activeTab === 'picker') && (
          <GooglePickerPanel token={workspaceToken} onRequestAuth={handleConnect} />
        )}

        {(activeTab === 'all' || activeTab === 'keep') && (
          <GoogleKeepNotesPanel userId={user?.uid || null} onRequestAuth={handleConnect} />
        )}
      </div>

      {/* Speech Recognition Keep Note Dictation Modal */}
      <SpeechToKeepNoteModal
        isOpen={isSpeechModalOpen}
        onClose={() => setIsSpeechModalOpen(false)}
        userId={user?.uid || null}
        initialPinned={true}
      />
    </div>
  );
}
