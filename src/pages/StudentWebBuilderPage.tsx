import React, { useState, useEffect } from 'react';
import { 
  Globe, Laptop, Tablet, Smartphone, Maximize2, Minimize2, 
  Sparkles, Download, Wand2, Palette, Layers, RefreshCw, 
  Check, Share2, Eye, Play, Undo, ExternalLink, HelpCircle,
  Rocket, Users, Cloud
} from 'lucide-react';
import { 
  StudentWebsiteConfig, WebBlock, WebBlockType, ThemeId, FontId 
} from '../types/websiteBuilder';
import { WEBSITE_TEMPLATES, THEME_DEFINITIONS } from '../data/websiteTemplates';
import { LiveWebsiteRenderer } from '../components/webBuilder/LiveWebsiteRenderer';
import { BlockPalette } from '../components/webBuilder/BlockPalette';
import { ThemeSelector } from '../components/webBuilder/ThemeSelector';
import { BlockEditorDrawer } from '../components/webBuilder/BlockEditorDrawer';
import { ExportCodeModal } from '../components/webBuilder/ExportCodeModal';
import { AIAssistModal } from '../components/webBuilder/AIAssistModal';
import { LovableStudio } from '../components/lovable/LovableStudio';
import { useStudentProfile } from '../context/StudentProfileContext';
import { StudentAudio } from '../utils/studentWebAudio';
import { 
  saveProjectToFirestore, 
  joinCollaborativeWorkspace, 
  broadcastWorkspaceUpdate, 
  StudentProjectRecord, 
  CollaboratorUser,
  SharedWorkspaceState 
} from '../services/firebaseWebBuilderService';
import { PublishModal } from '../components/lovable/PublishModal';
import { SharedWorkspaceModal } from '../components/lovable/SharedWorkspaceModal';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function StudentWebBuilderPage() {
  const { profile } = useStudentProfile();

  // Studio Mode: 'lovable' (Lovable / Replit AI IDE) vs 'blocks' (Visual Block Canvas)
  const [builderMode, setBuilderMode] = useState<'lovable' | 'blocks'>('lovable');

  // Active configuration state
  const [siteConfig, setSiteConfig] = useState<StudentWebsiteConfig>(() => {
    const saved = localStorage.getItem('lumora_student_website_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default to cosmic template customized with student name
    const initial = JSON.parse(JSON.stringify(WEBSITE_TEMPLATES[0].config));
    if (profile?.name) {
      initial.studentHandle = profile.name.toLowerCase().replace(/\s+/g, '_');
    }
    return initial;
  });

  // Editor UI states
  const [activeTab, setActiveTab] = useState<'blocks' | 'themes'>('blocks');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [editingBlock, setEditingBlock] = useState<WebBlock | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('space-explorer');
  const [lastSavedNotice, setLastSavedNotice] = useState<boolean>(false);

  // Firebase Hosting Publish & Shared Workspace Realtime DB state
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [showSharedWorkspaceModal, setShowSharedWorkspaceModal] = useState<boolean>(false);
  const [sharedRoomId, setSharedRoomId] = useState<string | null>(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('collab') || null;
    } catch (e) {
      return null;
    }
  });
  const [collaborators, setCollaborators] = useState<CollaboratorUser[]>([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<{
    status: 'saved' | 'saving' | 'error';
    lastSavedTime: string;
  }>({ status: 'saved', lastSavedTime: 'Just now' });
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>('');

  // 30-Second Auto-save mechanism to Firestore
  useEffect(() => {
    const runAutoSave = async () => {
      const codeSnapshot = JSON.stringify(siteConfig);
      if (codeSnapshot === lastSavedSnapshot) return;

      setAutoSaveStatus(prev => ({ ...prev, status: 'saving' }));
      const projectRecord: StudentProjectRecord = {
        id: `site-${siteConfig.studentHandle || 'project'}`,
        title: siteConfig.siteTitle || 'Student Web Page',
        description: `${siteConfig.blocks.length} interactive blocks • Theme: ${siteConfig.theme}`,
        html: `<div class="theme-${siteConfig.theme} p-8 max-w-4xl mx-auto space-y-6">
  <h1 class="text-3xl font-black text-white">${siteConfig.siteTitle}</h1>
  <p class="text-sm text-slate-300">Created by @${siteConfig.studentHandle || 'student'} using Lumora Studio</p>
</div>`,
        css: `/* Theme: ${siteConfig.theme} */`,
        js: `console.log("Lumora Website Loaded");`,
        version: 1,
        studentHandle: siteConfig.studentHandle || 'student',
        studentEmail: profile?.email || 'student@lumora.ai',
        updatedAt: new Date().toISOString()
      };

      const res = await saveProjectToFirestore(projectRecord);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (res.success) {
        setLastSavedSnapshot(codeSnapshot);
        setAutoSaveStatus({ status: 'saved', lastSavedTime: timeStr });
      } else {
        setAutoSaveStatus({ status: 'error', lastSavedTime: timeStr });
      }
    };

    const interval = setInterval(runAutoSave, 30000);
    return () => clearInterval(interval);
  }, [siteConfig, lastSavedSnapshot, profile]);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumora_student_website_v1', JSON.stringify(siteConfig));
      setLastSavedNotice(true);
      const timer = setTimeout(() => setLastSavedNotice(false), 1500);
      return () => clearTimeout(timer);
    } catch (e) {
      // ignore
    }
  }, [siteConfig]);

  // Load template
  const handleLoadTemplate = (templateId: string) => {
    const found = WEBSITE_TEMPLATES.find(t => t.id === templateId);
    if (found) {
      StudentAudio.playCelebrationChime();
      const newConfig: StudentWebsiteConfig = JSON.parse(JSON.stringify(found.config));
      if (profile?.name) {
        newConfig.studentHandle = profile.name.toLowerCase().replace(/\s+/g, '_');
      }
      setSiteConfig(newConfig);
      setSelectedTemplateId(templateId);
    }
  };

  // Add block
  const handleAddBlock = (type: WebBlockType) => {
    StudentAudio.playPop();
    const newBlock: WebBlock = {
      id: `${type}-${Date.now()}`,
      type,
      title: type === 'hero' ? 'Welcome Banner' :
             type === 'interactive-gadgets' ? 'Fun Zone & Clicker' :
             type === 'about' ? 'About Student' :
             type === 'projects' ? 'Project Gallery' :
             type === 'sticky-notes' ? 'Sticky Wall' :
             type === 'quotes-trivia' ? 'Brain Teasers' :
             type === 'ambient-player' ? 'Ambient Audio' :
             type === 'faq' ? 'Frequently Asked Questions' : 'Links & Contact',
      visible: true,
      heroData: type === 'hero' ? {
        headline: 'Create, Experiment & Inspire',
        subheadline: 'A space for curious minds exploring the universe with creativity.',
        badgeText: '✨ Student Explorer',
        avatarEmoji: '🚀',
        ctaPrimaryText: 'Get Started',
        ctaSecondaryText: 'Explore More',
        enableFloatingStickers: true
      } : undefined,
      gadgetsData: type === 'interactive-gadgets' ? {
        enableConfettiButton: true,
        confettiButtonText: '🎉 Blast Confetti!',
        enableClickerGame: true,
        clickerTargetLabel: 'Smash For Power Points',
        clickerEmoji: '⚡',
        enableSoundBleeps: true
      } : undefined,
      aboutData: type === 'about' ? {
        bio: 'Passionate student learner exploring science, coding, and design.',
        role: 'Student Creator',
        gradeOrSchool: 'High School Scholar',
        favoriteSubject: 'Physics & Computer Science',
        superpower: 'Solving challenging puzzles under time pressure',
        funFact: 'Can assemble a Rubik’s cube in under 60 seconds!',
        skills: [{ name: 'Problem Solving', level: 90 }, { name: 'Creativity', level: 85 }]
      } : undefined,
      projectsData: type === 'projects' ? {
        cards: [
          {
            id: 'card-' + Date.now(),
            title: 'Sample Science Invention',
            description: 'A miniature prototype demonstrating renewable energy principles.',
            tag: 'STEM',
            icon: '🔬',
            linkText: 'Learn More',
            likes: 15
          }
        ]
      } : undefined,
      stickyNotesData: type === 'sticky-notes' ? {
        allowVisitorAdd: true,
        notes: [
          { id: 'sn-1', text: 'Welcome to my new student site! Leave a note below! 🌟', author: 'Host', color: 'yellow', rotation: -1 }
        ]
      } : undefined,
      quotesTriviaData: type === 'quotes-trivia' ? {
        triviaList: [
          {
            id: 't-1',
            category: 'Physics',
            question: 'What is the fastest thing in the known universe?',
            answer: 'Light in a vacuum, travelling at approximately 299,792,458 meters per second!'
          }
        ]
      } : undefined,
      ambientPlayerData: type === 'ambient-player' ? {
        initialSound: 'rain',
        presetTitle: 'Cozy Rain on Windowpane'
      } : undefined,
      faqData: type === 'faq' ? {
        items: [
          { id: 'f-1', q: 'What tools do you use for your projects?', a: 'Mainly open-source software, 3D printing, and Python!' }
        ]
      } : undefined,
      linksData: type === 'links-contact' ? {
        footerNotice: 'Built on Lumora Student Network',
        items: [
          { id: 'l-1', label: 'GitHub Profile', url: 'https://github.com', icon: '💻' }
        ]
      } : undefined
    };

    setSiteConfig(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
    setEditingBlock(newBlock);
  };

  // Move block
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    StudentAudio.playPop();
    const newBlocks = [...siteConfig.blocks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newBlocks.length) return;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;
    setSiteConfig(prev => ({ ...prev, blocks: newBlocks }));
  };

  // Toggle block visibility
  const handleToggleBlockVisibility = (id: string) => {
    setSiteConfig(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, visible: !b.visible } : b)
    }));
  };

  // Remove block
  const handleRemoveBlock = (id: string) => {
    StudentAudio.playPop();
    setSiteConfig(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
    if (editingBlock?.id === id) {
      setEditingBlock(null);
    }
  };

  // Save edited block
  const handleSaveBlock = (updated: WebBlock) => {
    setSiteConfig(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === updated.id ? updated : b)
    }));
  };

  // If in Lovable / Replit AI IDE Studio Mode
  if (builderMode === 'lovable') {
    return (
      <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden">
        {/* Top Studio Switcher Ribbon */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBuilderMode('lovable')}
              className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-lg shadow-rose-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ Lovable & Replit AI Studio</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 uppercase font-bold">Pro IDE</span>
            </button>
            <button
              onClick={() => setBuilderMode('blocks')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🧱 Visual Block Builder</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Natural language prompt to live sandboxed code</span>
          </div>
        </div>

        {/* Lovable Studio Workspace */}
        <div className="flex-1 overflow-hidden">
          <LovableStudio onSwitchToBlockBuilder={() => setBuilderMode('blocks')} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Top Application Bar */}
      <header className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={siteConfig.siteTitle}
                onChange={e => setSiteConfig(prev => ({ ...prev, siteTitle: e.target.value }))}
                className="font-black text-sm sm:text-base text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-rose-500 focus:outline-hidden max-w-[200px] sm:max-w-[280px]"
                title="Click to rename your site"
              />
              {lastSavedNotice && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  <Check className="w-3 h-3" />
                  <span>Saved</span>
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              Interactive Student Web Builder & Entertainment Studio
            </p>
          </div>
        </div>

        {/* Mode Switcher Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBuilderMode('lovable')}
            className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-600/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Switch to Lovable / Replit IDE</span>
          </button>
        </div>

        {/* Center: Device Switcher & Template Picker */}
        <div className="hidden md:flex items-center gap-3">
          {/* Template Remix Dropdown */}
          <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <span className="text-[10px] uppercase text-slate-400 px-2">Theme:</span>
            <select
              value={selectedTemplateId}
              onChange={e => handleLoadTemplate(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer pr-1"
            >
              {WEBSITE_TEMPLATES.map(t => (
                <option key={t.id} value={t.id} className="dark:bg-slate-900">
                  {t.emoji} {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Device Frames */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Desktop View (Full Screen)"
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceMode === 'tablet'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Tablet View (iPad Frame)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Mobile View (Smartphone Frame)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* 30-Second Auto-Save Firestore Indicator */}
          <div
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]"
            title="Auto-saves to Firestore every 30 seconds to prevent data loss."
          >
            <span
              className={`w-2 h-2 rounded-full ${
                autoSaveStatus.status === 'saving'
                  ? 'bg-amber-400 animate-ping'
                  : autoSaveStatus.status === 'error'
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'
              }`}
            />
            <span className="text-slate-600 dark:text-slate-300 font-mono">
              {autoSaveStatus.status === 'saving' ? 'Saving...' : `Firestore • ${autoSaveStatus.lastSavedTime}`}
            </span>
          </div>

          {/* Shared Workspace Button (Firebase Realtime Database) */}
          <button
            onClick={() => setShowSharedWorkspaceModal(true)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              sharedRoomId
                ? 'bg-indigo-950 text-indigo-300 border-indigo-700 shadow-sm'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400'
            }`}
            title="Real-time co-editing via Firebase Realtime Database"
          >
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">
              {sharedRoomId ? `Room: ${sharedRoomId}` : 'Shared Workspace'}
            </span>
            {sharedRoomId && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          {/* Publish Live Button (Firebase Hosting Integration) */}
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/25 active:scale-95 transition-all"
            title="Publish live to Firebase Hosting with unique shareable link"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>

          {/* AI Magic Remix */}
          <button
            onClick={() => setShowAIModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            title="Generate custom site with AI"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Magic Remix</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold hover:border-slate-400 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Preview'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Export & Download HTML */}
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export & Share</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Controls + Right Live Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side Control Panel (Hidden if Fullscreen) */}
        {!isFullscreen && (
          <aside className="w-72 lg:w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col shrink-0 z-10">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 p-2 gap-1 bg-white dark:bg-slate-900">
              <button
                onClick={() => setActiveTab('blocks')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'blocks'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Blocks ({siteConfig.blocks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('themes')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'themes'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Theme & Style</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 overflow-y-auto flex-1">
              {activeTab === 'blocks' ? (
                <BlockPalette
                  blocks={siteConfig.blocks}
                  onAddBlock={handleAddBlock}
                  onToggleBlockVisibility={handleToggleBlockVisibility}
                  onRemoveBlock={handleRemoveBlock}
                  onMoveBlock={handleMoveBlock}
                  onSelectBlockToEdit={block => setEditingBlock(block)}
                  activeEditingId={editingBlock?.id}
                />
              ) : (
                <ThemeSelector
                  currentTheme={siteConfig.theme}
                  currentFont={siteConfig.font}
                  onSelectTheme={theme => setSiteConfig(prev => ({ ...prev, theme }))}
                  onSelectFont={font => setSiteConfig(prev => ({ ...prev, font }))}
                />
              )}
            </div>
          </aside>
        )}

        {/* Center Live Canvas Stage */}
        <div className="flex-1 overflow-auto bg-slate-200/60 dark:bg-slate-950 p-4 sm:p-8 flex items-center justify-center relative">
          {/* Outer Device Frame Container */}
          <div 
            className={`transition-all duration-300 h-full flex flex-col ${
              deviceMode === 'desktop'
                ? 'w-full max-w-5xl rounded-2xl shadow-xl'
                : deviceMode === 'tablet'
                ? 'w-[768px] max-w-full rounded-[36px] p-4 bg-slate-900 shadow-2xl border-4 border-slate-800'
                : 'w-[390px] max-w-full rounded-[44px] p-3 bg-slate-900 shadow-2xl border-4 border-slate-800'
            }`}
          >
            {/* Tablet/Mobile Device Top Notch & Speaker */}
            {deviceMode !== 'desktop' && (
              <div className="w-full flex items-center justify-center pb-2">
                <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <div className="w-10 h-1 rounded-full bg-slate-800" />
                </div>
              </div>
            )}

            {/* Viewport Frame with Scrollbar */}
            <div className={`flex-1 w-full overflow-y-auto bg-white dark:bg-slate-900 ${
              deviceMode === 'desktop' ? 'rounded-2xl border border-slate-200 dark:border-slate-800' : 'rounded-[32px]'
            }`}>
              <LiveWebsiteRenderer
                config={siteConfig}
                onUpdateConfig={updated => setSiteConfig(updated)}
                isInteractive={true}
              />
            </div>
          </div>
        </div>

        {/* Right Drawer: Block Content Editor */}
        {editingBlock && (
          <BlockEditorDrawer
            block={editingBlock}
            onClose={() => setEditingBlock(null)}
            onSaveBlock={handleSaveBlock}
          />
        )}
      </div>

      {/* Export & Download Code Modal */}
      {showExportModal && (
        <ExportCodeModal
          config={siteConfig}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* AI Magic Remix Generator Modal */}
      {showAIModal && (
        <AIAssistModal
          currentConfig={siteConfig}
          onApplyGeneratedSite={newConfig => {
            setSiteConfig(newConfig);
            StudentAudio.playCelebrationChime();
          }}
          onClose={() => setShowAIModal(false)}
        />
      )}

      {/* Firebase Hosting Live Publish Modal */}
      {showPublishModal && (
        <PublishModal
          project={{
            id: `site-${siteConfig.studentHandle || 'project'}`,
            title: siteConfig.siteTitle || 'Student Web Page',
            description: `${siteConfig.blocks.length} blocks • Theme: ${siteConfig.theme}`,
            html: `<div class="theme-${siteConfig.theme} min-h-screen p-8 max-w-4xl mx-auto space-y-6 text-slate-100">
  <div class="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
    <h1 class="text-3xl font-black text-white">${siteConfig.siteTitle}</h1>
    <p class="text-sm text-indigo-300">Published live via Firebase Hosting • Created by @${siteConfig.studentHandle || 'student'}</p>
  </div>
</div>`,
            css: `/* Theme: ${siteConfig.theme} */`,
            js: `console.log("Lumora Web Page Live");`,
            version: 1,
            studentHandle: siteConfig.studentHandle || 'student',
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
                html: `<!-- ${siteConfig.siteTitle} -->`,
                css: ``,
                js: ``
              });
            }
          }}
        />
      )}
    </div>
  );
}
