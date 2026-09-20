import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Play, RefreshCw, Download, Copy, Check, Terminal,
  Laptop, Tablet, Smartphone, Maximize2, Minimize2, Code, Eye,
  Columns, Send, Wand2, History, Undo2, ArrowUpRight, FolderOpen,
  HelpCircle, ChevronDown, ChevronUp, AlertTriangle, Info, CheckCircle2,
  Rocket, Users, Radio, Cloud
} from 'lucide-react';
import {
  CodeProject, LovableChatMessage, DeviceViewport, StudioViewMode,
  ActiveCodeTab, ConsoleLogMessage, StarterAppTemplate
} from '../../types/lovableStudio';
import { LOVABLE_STARTERS } from '../../data/lovableStarters';
import { useStudentProfile } from '../../context/StudentProfileContext';
import { 
  saveProjectToFirestore, 
  joinCollaborativeWorkspace, 
  broadcastWorkspaceUpdate, 
  StudentProjectRecord, 
  CollaboratorUser,
  SharedWorkspaceState 
} from '../../services/firebaseWebBuilderService';
import { PublishModal } from './PublishModal';
import { SharedWorkspaceModal } from './SharedWorkspaceModal';

interface LovableStudioProps {
  onSwitchToBlockBuilder?: () => void;
}

export const LovableStudio: React.FC<LovableStudioProps> = ({ onSwitchToBlockBuilder }) => {
  const { profile } = useStudentProfile();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Initialize project state from localStorage or default starter
  const [project, setProject] = useState<CodeProject>(() => {
    const saved = localStorage.getItem('lumora_lovable_project_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const defaultStarter = LOVABLE_STARTERS[0];
    return {
      id: 'proj-' + Date.now(),
      title: defaultStarter.title,
      description: defaultStarter.tagline,
      html: defaultStarter.html,
      css: defaultStarter.css,
      js: defaultStarter.js,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
  });

  // History stack for undo / snapshots
  const [historyStack, setHistoryStack] = useState<CodeProject[]>([]);

  // Studio UI state
  const [viewMode, setViewMode] = useState<StudioViewMode>('split');
  const [device, setDevice] = useState<DeviceViewport>('desktop');
  const [activeTab, setActiveTab] = useState<ActiveCodeTab>('html');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [promptInput, setPromptInput] = useState<string>('');
  const [showConsole, setShowConsole] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogMessage[]>([]);
  const [showStartersModal, setShowStartersModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);

  // Firestore 30-Second Auto-Save State
  const [autoSaveStatus, setAutoSaveStatus] = useState<{
    status: 'saved' | 'saving' | 'error';
    lastSavedTime: string;
  }>({ status: 'saved', lastSavedTime: 'Just now' });
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>('');

  // Modals state
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [showSharedWorkspaceModal, setShowSharedWorkspaceModal] = useState<boolean>(false);

  // Shared workspace co-editing state (Firebase Realtime Database)
  const [sharedRoomId, setSharedRoomId] = useState<string | null>(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('collab') || null;
    } catch (e) {
      return null;
    }
  });
  const [collaborators, setCollaborators] = useState<CollaboratorUser[]>([]);
  const [remotePeerNotice, setRemotePeerNotice] = useState<string | null>(null);
  const broadcastDebounceRef = useRef<any>(null);

  // Chat conversation state
  const [messages, setMessages] = useState<LovableChatMessage[]>(() => {
    const saved = localStorage.getItem('lumora_lovable_chat_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'msg-init',
        sender: 'assistant',
        text: `### 👋 Welcome to Lovable Student AI Studio!\nI am your AI full-stack pair programmer. You can ask me to **build interactive web apps from scratch** or **iterate on your existing code**.\n\nTry prompting me: *"Build an interactive periodic table with sound"*, *"Make a retro cyberpunk pomodoro timer"*, or *"Add a dark mode toggle"*!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTweaks: [
          'Add a sound effect when clicking elements',
          'Add a search filter and score tracker',
          'Switch color palette to neon synthwave'
        ]
      }
    ];
  });

  // Save project & chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumora_lovable_project_v1', JSON.stringify(project));
      localStorage.setItem('lumora_lovable_chat_v1', JSON.stringify(messages));
    } catch (e) {}
  }, [project, messages]);

  // AUTO-SAVE MECHANISM: Saves project code to Firestore every 30 seconds to prevent data loss
  useEffect(() => {
    const runAutoSave = async () => {
      const codeSnapshot = `${project.id}|${project.title}|${project.html}|${project.css}|${project.js}`;
      if (codeSnapshot === lastSavedSnapshot) return;

      setAutoSaveStatus(prev => ({ ...prev, status: 'saving' }));
      const record: StudentProjectRecord = {
        id: project.id,
        title: project.title,
        description: project.description,
        html: project.html,
        css: project.css,
        js: project.js,
        version: project.version,
        studentHandle: profile?.name ? profile.name.toLowerCase().replace(/\s+/g, '_') : 'student',
        studentEmail: profile?.email || 'student@lumora.ai',
        updatedAt: new Date().toISOString()
      };

      const res = await saveProjectToFirestore(record);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (res.success) {
        setLastSavedSnapshot(codeSnapshot);
        setAutoSaveStatus({ status: 'saved', lastSavedTime: timeStr });
      } else {
        setAutoSaveStatus({ status: 'error', lastSavedTime: timeStr });
      }
    };

    // Trigger auto-save every 30 seconds
    const interval = setInterval(runAutoSave, 30000);
    return () => clearInterval(interval);
  }, [project, lastSavedSnapshot, profile]);

  // SHARED WORKSPACE MULTIPLAYER CO-EDITING: Firebase Realtime Database
  useEffect(() => {
    if (!sharedRoomId) {
      setCollaborators([]);
      return;
    }

    const myUser: CollaboratorUser = {
      id: 'user-' + (profile?.name ? profile.name.replace(/\s+/g, '-').toLowerCase() : 'student') + '-' + Math.random().toString(36).substr(2, 4),
      name: profile?.name || 'Student Creator',
      email: profile?.email || 'student@lumora.ai',
      color: ['#ec4899', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 6)],
      activeFile: activeTab === 'combined' ? 'preview' : activeTab,
      lastActive: Date.now()
    };

    const cleanup = joinCollaborativeWorkspace({
      roomId: sharedRoomId,
      user: myUser,
      onRemoteUpdate: (remoteState: SharedWorkspaceState) => {
        setProject(prev => {
          if (
            prev.html === remoteState.html &&
            prev.css === remoteState.css &&
            prev.js === remoteState.js
          ) {
            return prev;
          }
          return {
            ...prev,
            html: remoteState.html ?? prev.html,
            css: remoteState.css ?? prev.css,
            js: remoteState.js ?? prev.js
          };
        });

        if (remoteState.lastEditedBy && remoteState.lastEditedBy !== myUser.name) {
          setRemotePeerNotice(`${remoteState.lastEditedBy} updated project code`);
          setTimeout(() => setRemotePeerNotice(null), 3500);
        }
      },
      onPresenceUpdate: (collabs) => {
        setCollaborators(collabs);
      }
    });

    return () => cleanup();
  }, [sharedRoomId, profile, activeTab]);

  // Listen to postMessage from iframe sandbox console
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'STUDIO_CONSOLE') {
        const newLog: ConsoleLogMessage = {
          id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          level: event.data.level || 'log',
          message: event.data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setConsoleLogs(prev => [...prev.slice(-49), newLog]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Generate full combined standalone HTML document with sandboxed console proxy script
  const generateSandboxedSrcDoc = (p: CodeProject) => {
    const consoleInterceptorScript = `
      <script>
        (function() {
          function sendLog(level, args) {
            try {
              var msg = Array.from(args).map(function(item) {
                if (typeof item === 'object') {
                  try { return JSON.stringify(item); } catch(e) { return String(item); }
                }
                return String(item);
              }).join(' ');
              window.parent.postMessage({ type: 'STUDIO_CONSOLE', level: level, message: msg }, '*');
            } catch(e) {}
          }
          var origLog = console.log;
          var origWarn = console.warn;
          var origError = console.error;
          var origInfo = console.info;

          console.log = function() { origLog.apply(console, arguments); sendLog('log', arguments); };
          console.warn = function() { origWarn.apply(console, arguments); sendLog('warn', arguments); };
          console.error = function() { origError.apply(console, arguments); sendLog('error', arguments); };
          console.info = function() { origInfo.apply(console, arguments); sendLog('info', arguments); };

          window.onerror = function(msg, url, line) {
            sendLog('error', ['[Runtime Error Line ' + line + ']: ' + msg]);
            return false;
          };
        })();
      </script>
    `;

    // If HTML is a full <!DOCTYPE html>, inject CSS & JS properly
    let doc = p.html || '';

    // If style.css is not yet inline, inject it
    if (p.css && p.css.trim()) {
      if (doc.includes('</head>')) {
        doc = doc.replace('</head>', `<style>\n${p.css}\n</style>\n</head>`);
      } else {
        doc = `<style>\n${p.css}\n</style>\n` + doc;
      }
    }

    // Inject console interceptor before closing head or at top
    if (doc.includes('<head>')) {
      doc = doc.replace('<head>', `<head>\n${consoleInterceptorScript}`);
    } else {
      doc = consoleInterceptorScript + doc;
    }

    // If JS exists, inject before </body> or at end
    if (p.js && p.js.trim()) {
      const scriptTag = `<script>\n${p.js}\n</script>`;
      if (doc.includes('</body>')) {
        doc = doc.replace('</body>', `${scriptTag}\n</body>`);
      } else {
        doc = doc + '\n' + scriptTag;
      }
    }

    return doc;
  };

  // Submit AI Prompt (New app or Iterate existing)
  const handleSendPrompt = async (promptOverride?: string) => {
    const textToSend = promptOverride || promptInput;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: LovableChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setPromptInput('');
    setIsGenerating(true);

    // Save snapshot before changes
    setHistoryStack(prev => [...prev.slice(-9), JSON.parse(JSON.stringify(project))]);

    try {
      const isIterate = project && (project.html || project.js);
      const res = await fetch('/api/lovable-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend.trim(),
          mode: isIterate ? 'iterate' : 'new',
          currentCode: {
            html: project.html,
            css: project.css,
            js: project.js
          },
          history: messages.slice(-4).map(m => ({ role: m.sender, text: m.text }))
        })
      });

      if (!res.ok) {
        throw new Error('Server returned ' + res.status);
      }

      const data = await res.json();
      if (data.success && data.project) {
        const newProj: CodeProject = {
          id: project.id,
          title: data.project.appName || project.title,
          description: data.project.explanation || project.description,
          html: data.project.html || project.html,
          css: data.project.css || project.css,
          js: data.project.js || project.js,
          createdAt: project.createdAt,
          updatedAt: new Date().toISOString(),
          version: project.version + 1
        };

        setProject(newProj);
        setIframeKey(k => k + 1);

        const aiMsg: LovableChatMessage = {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          text: `### ✨ ${data.project.appName || 'Updated Web App'}\n${data.project.explanation || 'I have generated your requested application code with full Tailwind CSS styling and interactive JavaScript logic.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedTweaks: data.project.suggestedTweaks || [
            'Add an ambient audio chime',
            'Add a high score counter',
            'Make the cards bounce on hover'
          ],
          codeSnapshot: {
            html: newProj.html,
            css: newProj.css,
            js: newProj.js
          }
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      const errorMsg: LovableChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        text: `⚠️ **Notice**: I encountered a network issue, but your current project is safe! You can continue editing your code manually or try another prompt.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Load a starter template
  const handleLoadStarter = (starter: StarterAppTemplate) => {
    setHistoryStack(prev => [...prev.slice(-9), JSON.parse(JSON.stringify(project))]);
    const newProj: CodeProject = {
      id: 'proj-' + Date.now(),
      title: starter.title,
      description: starter.tagline,
      html: starter.html,
      css: starter.css,
      js: starter.js,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: project.version + 1
    };
    setProject(newProj);
    setIframeKey(k => k + 1);
    setShowStartersModal(false);

    const loadMsg: LovableChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'assistant',
      text: `### 🚀 Loaded Template: ${starter.title}\n${starter.tagline}\n\nYou can ask me to customize any part of this app (e.g. colors, game rules, animations, or features).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedTweaks: starter.suggestedTweaks
    };
    setMessages(prev => [...prev, loadMsg]);
  };

  // Undo / Revert to previous code
  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setHistoryStack(prev => prev.slice(0, -1));
    setProject(previous);
    setIframeKey(k => k + 1);
  };

  // Download Standalone Self-Contained HTML File
  const handleDownloadStandaloneHtml = () => {
    const fullHtml = generateSandboxedSrcDoc(project);
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'student-app'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy active code to clipboard
  const handleCopyCode = () => {
    let textToCopy = '';
    if (activeTab === 'html') textToCopy = project.html;
    else if (activeTab === 'css') textToCopy = project.css;
    else if (activeTab === 'js') textToCopy = project.js;
    else textToCopy = generateSandboxedSrcDoc(project);

    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Trigger manual hot-reload
  const handleReload = () => {
    setIframeKey(k => k + 1);
  };

  // Manual Firestore Project Save
  const handleManualSave = async () => {
    setAutoSaveStatus({ status: 'saving', lastSavedTime: 'Saving...' });
    const record: StudentProjectRecord = {
      id: project.id,
      title: project.title,
      description: project.description,
      html: project.html,
      css: project.css,
      js: project.js,
      version: project.version,
      studentHandle: profile?.name ? profile.name.toLowerCase().replace(/\s+/g, '_') : 'student',
      studentEmail: profile?.email || 'student@lumora.ai',
      updatedAt: new Date().toISOString()
    };
    const res = await saveProjectToFirestore(record);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (res.success) {
      setLastSavedSnapshot(`${project.id}|${project.title}|${project.html}|${project.css}|${project.js}`);
      setAutoSaveStatus({ status: 'saved', lastSavedTime: timeStr });
    } else {
      setAutoSaveStatus({ status: 'error', lastSavedTime: timeStr });
    }
  };

  // Synchronize code edits with peer collaborators in real time (Firebase Realtime Database)
  const handleCodeChange = (file: 'html' | 'css' | 'js', newCode: string) => {
    const updated = { ...project, [file]: newCode };
    setProject(updated);

    if (sharedRoomId) {
      if (broadcastDebounceRef.current) clearTimeout(broadcastDebounceRef.current);
      broadcastDebounceRef.current = setTimeout(() => {
        broadcastWorkspaceUpdate({
          roomId: sharedRoomId,
          userId: profile?.name || 'student',
          userName: profile?.name || 'Classmate',
          html: updated.html,
          css: updated.css,
          js: updated.js
        });
      }, 300);
    }
  };

  return (
    <div className={`flex flex-col bg-slate-950 text-slate-100 min-h-[calc(100vh-5rem)] ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-slate-950' : ''}`}>
      
      {/* Top Header Bar: Lovable / Replit IDE Controls */}
      <header className="px-4 py-3 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        
        {/* Left: Branding & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                className="bg-transparent text-sm sm:text-base font-black text-white focus:outline-none border-b border-transparent focus:border-cyan-500 px-0.5"
              />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase tracking-wider">
                Lovable Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block truncate max-w-md">
              {project.description || 'Interactive student web application'}
            </p>
          </div>
        </div>

        {/* Center: Viewport & View Mode Toggles */}
        <div className="flex items-center gap-2">
          
          {/* View Mode (Split, Preview, Code) */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'split' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Split View (Code + Preview)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'preview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Live App Preview Only"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Preview</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'code' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Code Editor Only"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Code</span>
            </button>
          </div>

          {/* Device Frames (when preview visible) */}
          {viewMode !== 'code' && (
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 hidden sm:flex items-center gap-1">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  device === 'desktop' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View (100%)"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  device === 'tablet' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  device === 'mobile' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">

          {/* 30-Second Auto-Save Firestore Indicator */}
          <button
            type="button"
            onClick={handleManualSave}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] hover:border-slate-700 transition cursor-pointer"
            title="Auto-saves to Cloud Firestore every 30 seconds to prevent data loss. Click to save now."
          >
            <span
              className={`w-2 h-2 rounded-full ${
                autoSaveStatus.status === 'saving'
                  ? 'bg-amber-400 animate-ping'
                  : autoSaveStatus.status === 'error'
                  ? 'bg-rose-500'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-slate-300 font-mono">
              {autoSaveStatus.status === 'saving'
                ? 'Saving...'
                : `Saved • ${autoSaveStatus.lastSavedTime}`}
            </span>
          </button>

          {/* Shared Workspace Button (Multiplayer Co-editing via Firebase Realtime Database) */}
          <button
            onClick={() => setShowSharedWorkspaceModal(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              sharedRoomId
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Co-edit in real-time with classmates via Firebase Realtime Database"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">
              {sharedRoomId ? `Room: ${sharedRoomId}` : 'Shared Workspace'}
            </span>
            {sharedRoomId && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </button>

          {/* Publish Live Button (Firebase Hosting Integration) */}
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition active:scale-95"
            title="Publish live to Firebase Hosting with unique shareable link"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
          
          {/* Starters Library */}
          <button
            onClick={() => setShowStartersModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Templates</span>
          </button>

          {/* Undo */}
          {historyStack.length > 0 && (
            <button
              onClick={handleUndo}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Undo last AI modification"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}

          {/* Run Code / Reload Preview */}
          <button
            onClick={handleReload}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
            title="Re-run code in sandbox"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
          </button>

          {/* Download Standalone HTML */}
          <button
            onClick={handleDownloadStandaloneHtml}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
            title="Download full runnable HTML file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Studio'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Optional link to visual blocks mode */}
          {onSwitchToBlockBuilder && (
            <button
              onClick={onSwitchToBlockBuilder}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 hidden lg:flex items-center gap-1"
            >
              <span>🧱 Block Builder</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Layout: 3 Columns or Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: AI Lovable Copilot & Chat (4 cols on desktop) */}
        <aside className="lg:col-span-4 border-r border-slate-800 bg-slate-900/60 flex flex-col h-[500px] lg:h-auto overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                AI App Copilot
              </span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              Gemini 3.8 Flash
            </span>
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-rose-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* Suggested Quick Follow-ups */}
                  {msg.suggestedTweaks && msg.suggestedTweaks.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/50 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        💡 Quick Tweaks:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedTweaks.map((tweak, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendPrompt(tweak)}
                            disabled={isGenerating}
                            className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500 transition disabled:opacity-50"
                          >
                            + {tweak}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800/70 border border-slate-700 max-w-[85%] text-slate-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
                <span className="text-xs font-semibold">Crafting complete code & layout...</span>
              </div>
            )}
          </div>

          {/* Prompt Input Form */}
          <div className="p-3 border-t border-slate-800 bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask Lovable to build or edit anything..."
                disabled={isGenerating}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!promptInput.trim() || isGenerating}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-40 transition flex items-center justify-center"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </aside>

        {/* RIGHT AREA: Code Editor and/or Live Sandbox Preview (8 cols) */}
        <main className="lg:col-span-8 flex flex-col bg-slate-950 overflow-hidden relative">
          
          {/* Top Bar for Code & Preview Tabs */}
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            
            {/* File Tabs */}
            {(viewMode === 'code' || viewMode === 'split') ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('html')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition ${
                    activeTab === 'html'
                      ? 'bg-slate-800 text-orange-400 border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  index.html
                </button>
                <button
                  onClick={() => setActiveTab('css')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition ${
                    activeTab === 'css'
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  style.css
                </button>
                <button
                  onClick={() => setActiveTab('js')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition ${
                    activeTab === 'js'
                      ? 'bg-slate-800 text-amber-400 border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  app.js
                </button>
                <button
                  onClick={() => setActiveTab('combined')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition ${
                    activeTab === 'combined'
                      ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Combined
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Interactive Sandbox Preview</span>
              </div>
            )}

            {/* Quick Actions (Copy, Toggle Console) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 transition"
                title="Copy current code tab"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="text-[11px]">{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => setShowConsole(!showConsole)}
                className={`px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition ${
                  showConsole ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Toggle Virtual Sandbox Console"
              >
                <Terminal className="w-3 h-3" />
                <span className="text-[11px]">Console ({consoleLogs.length})</span>
              </button>
            </div>
          </div>

          {/* Main Area: Split or Single View */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* CODE EDITOR PANE */}
            {(viewMode === 'code' || viewMode === 'split') && (
              <div className={`flex-1 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 overflow-hidden ${
                viewMode === 'code' ? 'w-full' : 'md:w-1/2'
              }`}>
                <div className="flex-1 p-2 overflow-auto font-mono text-xs">
                  <textarea
                    value={
                      activeTab === 'html'
                        ? project.html
                        : activeTab === 'css'
                        ? project.css
                        : activeTab === 'js'
                        ? project.js
                        : generateSandboxedSrcDoc(project)
                    }
                    onChange={(e) => {
                      if (activeTab === 'html') handleCodeChange('html', e.target.value);
                      else if (activeTab === 'css') handleCodeChange('css', e.target.value);
                      else if (activeTab === 'js') handleCodeChange('js', e.target.value);
                    }}
                    readOnly={activeTab === 'combined'}
                    className="w-full h-full min-h-[300px] bg-transparent text-slate-200 focus:outline-none resize-none p-2 leading-relaxed font-mono selection:bg-rose-900/60"
                    spellCheck={false}
                  />
                </div>
                <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                  <span>Press "Run" to hot reload sandbox</span>
                  <span>{activeTab.toUpperCase()} Mode</span>
                </div>
              </div>
            )}

            {/* LIVE SANDBOX PREVIEW PANE */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className={`flex-1 flex flex-col bg-slate-900/40 items-center justify-center p-2 sm:p-4 overflow-auto ${
                viewMode === 'preview' ? 'w-full' : 'md:w-1/2'
              }`}>
                {/* Device Frame Wrapper */}
                <div
                  className={`h-full flex flex-col rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 ${
                    device === 'desktop'
                      ? 'w-full'
                      : device === 'tablet'
                      ? 'w-[768px] max-w-full'
                      : 'w-[375px] max-w-full'
                  }`}
                >
                  {/* Browser Address Bar Simulation */}
                  <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                    </div>
                    
                    <div className="flex-1 max-w-sm mx-auto px-3 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5 truncate">
                      <span className="text-emerald-400">🔒</span>
                      <span>https://lumora.student/app/{project.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'demo'}</span>
                    </div>

                    <button
                      onClick={handleReload}
                      className="p-1 rounded text-slate-400 hover:text-white transition"
                      title="Reload sandbox"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Sandboxed Iframe (with sandbox attribute) */}
                  <div className="flex-1 w-full bg-slate-950 relative">
                    <iframe
                      key={iframeKey}
                      ref={iframeRef}
                      title="Student App Live Preview"
                      srcDoc={generateSandboxedSrcDoc(project)}
                      sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                      className="w-full h-full min-h-[450px] border-0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM VIRTUAL CONSOLE DRAWER */}
          {showConsole && (
            <div className="h-44 border-t border-slate-800 bg-slate-950 flex flex-col font-mono text-xs z-10 shadow-xl">
              <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-[11px]">Sandbox Console Output</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConsoleLogs([])}
                    className="text-[10px] text-slate-400 hover:text-slate-200"
                  >
                    Clear Logs
                  </button>
                  <button
                    onClick={() => setShowConsole(false)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-1">
                {consoleLogs.length === 0 ? (
                  <p className="text-slate-600 text-[11px] italic">No console logs yet. Call console.log() in your code to see outputs here.</p>
                ) : (
                  consoleLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`text-[11px] flex items-start gap-2 leading-tight ${
                        log.level === 'error'
                          ? 'text-rose-400 bg-rose-950/20 p-1 rounded'
                          : log.level === 'warn'
                          ? 'text-amber-400'
                          : log.level === 'info'
                          ? 'text-cyan-400'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="text-slate-600 text-[9px] select-none">[{log.timestamp}]</span>
                      <span className="flex-1 break-all">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* STARTER TEMPLATES MODAL */}
      {showStartersModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">Choose a Starter App</h3>
              </div>
              <button
                onClick={() => setShowStartersModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select any pre-built full-stack interactive prototype. You can immediately customize and prompt the AI to adapt it!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto flex-1 pr-1">
              {LOVABLE_STARTERS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleLoadStarter(s)}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/80 cursor-pointer transition flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {s.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-rose-400 transition">
                      {s.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {s.tagline}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-xs font-bold text-cyan-400">
                    <span>Launch in Studio</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Firebase Hosting Live Publish Modal */}
      {showPublishModal && (
        <PublishModal
          project={{
            ...project,
            studentHandle: profile?.name ? profile.name.toLowerCase().replace(/\s+/g, '_') : 'student',
            studentEmail: profile?.email || 'student@lumora.ai',
            updatedAt: new Date().toISOString()
          }}
          studentName={profile?.name || 'Student Creator'}
          studentEmail={profile?.email || 'student@lumora.ai'}
          onClose={() => setShowPublishModal(false)}
        />
      )}

      {/* Shared Workspace Real-Time Co-Editing Modal */}
      {showSharedWorkspaceModal && (
        <SharedWorkspaceModal
          currentRoomId={sharedRoomId}
          collaborators={collaborators}
          isJoined={Boolean(sharedRoomId)}
          onJoinRoom={(roomId) => {
            setSharedRoomId(roomId);
            const url = new URL(window.location.href);
            url.searchParams.set('collab', roomId);
            window.history.replaceState({}, '', url.toString());
          }}
          onLeaveRoom={() => {
            setSharedRoomId(null);
            setCollaborators([]);
            const url = new URL(window.location.href);
            url.searchParams.delete('collab');
            window.history.replaceState({}, '', url.toString());
          }}
          onClose={() => setShowSharedWorkspaceModal(false)}
          onForceSync={() => {
            if (sharedRoomId) {
              broadcastWorkspaceUpdate({
                roomId: sharedRoomId,
                userId: profile?.name || 'student',
                userName: profile?.name || 'Classmate',
                html: project.html,
                css: project.css,
                js: project.js
              });
            }
          }}
        />
      )}
    </div>
  );
};
