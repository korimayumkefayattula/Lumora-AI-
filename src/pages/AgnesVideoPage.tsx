import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Sparkles, 
  Play, 
  Pause, 
  Plus, 
  Bookmark, 
  BookmarkCheck, 
  Heart,
  Share2, 
  Download,
  HelpCircle, 
  FileText, 
  StickyNote, 
  Check, 
  ChevronRight, 
  Flame, 
  Brain, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  GitCompare,
  BookMarked,
  Layers,
  Filter,
  Trash2
} from 'lucide-react';
import { AgnesVideo, AgnesScene } from '../types/agnesVideo';
import { PRECURATED_AGNES_VIDEOS, getAgnesVideoById } from '../data/agnesToughTopics';
import { 
  getSavedAgnesVideos, 
  getBookmarkedVideoIds, 
  toggleVideoBookmark, 
  exportAgnesNotesToKeep 
} from '../services/agnesVideoService';
import { 
  downloadAgnesStudyPackHtml, 
  downloadAgnesStudyPackMarkdown 
} from '../services/agnesDownloadService';
import { useAuth } from '../context/AuthContext';
import { AgnesAvatar } from '../components/agnes/AgnesAvatar';
import { AgnesVideoCanvas } from '../components/agnes/AgnesVideoCanvas';
import { AgnesPlayerControls } from '../components/agnes/AgnesPlayerControls';
import { AgnesDoubtModal } from '../components/agnes/AgnesDoubtModal';
import { AgnesQuizCheckpointModal } from '../components/agnes/AgnesQuizCheckpointModal';
import { AgnesGeneratorModal } from '../components/agnes/AgnesGeneratorModal';
import { AgnesShareModal } from '../components/agnes/AgnesShareModal';
import { AITopicComparatorModal } from '../components/agnes/AITopicComparatorModal';
import { FormulaVaultModal } from '../components/agnes/FormulaVaultModal';

export default function AgnesVideoPage() {
  const { user } = useAuth();

  // All available videos: precurated + user custom generations
  const [allVideos, setAllVideos] = useState<AgnesVideo[]>(() => {
    const saved = getSavedAgnesVideos();
    return [...saved, ...PRECURATED_AGNES_VIDEOS];
  });

  const [activeVideo, setActiveVideo] = useState<AgnesVideo>(PRECURATED_AGNES_VIDEOS[0]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');

  // Selected Tab below player
  const [activeTab, setActiveTab] = useState<'notes' | 'pitfalls' | 'scenes' | 'quiz'>('notes');

  // Modals
  const [isDoubtModalOpen, setIsDoubtModalOpen] = useState(false);
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingVideo, setSharingVideo] = useState<AgnesVideo | null>(null);
  const [isTopicComparatorOpen, setIsTopicComparatorOpen] = useState(false);
  const [isFormulaVaultOpen, setIsFormulaVaultOpen] = useState(false);

  // Pre-fill topic for video generator if triggered from comparator
  const [generatorPreFillTopic, setGeneratorPreFillTopic] = useState('');
  const [generatorPreFillSubject, setGeneratorPreFillSubject] = useState('');

  // Subject Filter for library
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => getBookmarkedVideoIds());
  const [justExportedKeep, setJustExportedKeep] = useState(false);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentScene = activeVideo.scenes[currentSceneIndex] || activeVideo.scenes[0];

  // Deep link support: If ?v=videoId is in query params, load that video
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const videoParam = params.get('v');
      if (videoParam) {
        const found = allVideos.find((v) => v.id === videoParam);
        if (found) {
          setActiveVideo(found);
          setCurrentSceneIndex(0);
          setSceneProgress(0);
        }
      }
    }
  }, [allVideos]);

  // Sync subtitle text with current scene
  useEffect(() => {
    if (currentScene) {
      setCurrentSubtitle(currentScene.agnesNarration);
    }
  }, [currentScene]);

  // Handle SpeechSynthesis audio voiceover for Dr. Agnes
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (!isPlaying || isMuted) {
      window.speechSynthesis.cancel();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentScene.agnesNarration);
    utterance.rate = playbackSpeed * 0.95;
    utterance.pitch = 1.05; // Slightly higher pitch for Dr. Agnes's articulate voice

    // Pick an English female voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Zira')) &&
        v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentScene, isPlaying, isMuted, playbackSpeed]);

  // Playback timer ticker
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 100;
    const sceneTotalSeconds = (currentScene.durationSeconds || 45) / playbackSpeed;
    const stepIncrement = (intervalMs / (sceneTotalSeconds * 1000)) * 100;

    const timer = setInterval(() => {
      setSceneProgress((prev) => {
        if (prev + stepIncrement >= 100) {
          // Check if current scene has a quiz checkpoint
          if (currentScene.quizCheckpoint) {
            setIsPlaying(false);
            setIsCheckpointModalOpen(true);
            return 100;
          }

          // Move to next scene
          if (currentSceneIndex < activeVideo.scenes.length - 1) {
            setCurrentSceneIndex((idx) => idx + 1);
            return 0;
          } else {
            // Video finished
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIndex, currentScene, playbackSpeed, activeVideo.scenes.length]);

  const handleTogglePlay = () => {
    if (!isPlaying && sceneProgress >= 100) {
      // Restart from first scene if finished
      setCurrentSceneIndex(0);
      setSceneProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSelectScene = (index: number) => {
    setCurrentSceneIndex(index);
    setSceneProgress(0);
    setIsPlaying(true);
  };

  const handleToggleBookmark = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNow = toggleVideoBookmark(videoId);
    setBookmarkedIds((prev) => (isNow ? [...prev, videoId] : prev.filter((id) => id !== videoId)));
  };

  const handleOpenShareModal = (video: AgnesVideo, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSharingVideo(video);
    setIsShareModalOpen(true);
  };

  const handleDownloadStudyPack = (video: AgnesVideo, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    downloadAgnesStudyPackHtml(video);
    setDownloadNotification(`Study pack downloaded for "${video.topic}"!`);
    setTimeout(() => setDownloadNotification(null), 3500);
  };

  const handleExportToKeep = async () => {
    try {
      await exportAgnesNotesToKeep(activeVideo, user?.uid || null);
      setJustExportedKeep(true);
      setTimeout(() => setJustExportedKeep(false), 3000);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleVideoSelect = (video: AgnesVideo) => {
    window.speechSynthesis?.cancel();
    setActiveVideo(video);
    setCurrentSceneIndex(0);
    setSceneProgress(0);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComparatorVideoGenerate = (topic: string, subject: string) => {
    // Check if an existing video matches
    const found = allVideos.find(
      (v) => v.topic.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(v.topic.toLowerCase())
    );
    if (found) {
      handleVideoSelect(found);
    } else {
      setGeneratorPreFillTopic(topic);
      setGeneratorPreFillSubject(subject);
      setIsGeneratorModalOpen(true);
    }
  };

  // Filter video library
  const filteredVideos = allVideos.filter((v) => {
    if (selectedSubject === 'Bookmarks') {
      return bookmarkedIds.includes(v.id);
    }
    if (selectedSubject === 'All') return true;
    return v.subject.toLowerCase() === selectedSubject.toLowerCase();
  });

  // Dedicated bookmarked videos list
  const bookmarkedVideos = allVideos.filter((v) => bookmarkedIds.includes(v.id));

  const totalProgress = Math.round(
    ((currentSceneIndex + sceneProgress / 100) / activeVideo.scenes.length) * 100
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {downloadNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-emerald-400">
          <Check className="w-4 h-4" />
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-950/70 via-indigo-950/80 to-slate-900 border border-rose-500/30 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300 font-mono text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>Agnes Video AI</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
                Tough Topics Demystified
              </span>
              {bookmarkedIds.length > 0 && (
                <span className="px-3 py-1 rounded-xl bg-rose-500/30 border border-rose-400/50 text-rose-200 font-mono text-xs font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-current text-rose-400" />
                  <span>{bookmarkedIds.length} Favorited</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Dr. Agnes Explains the Toughest Topics
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When textbooks feel like alien hieroglyphics, Dr. Agnes Vance steps onto the digital chalkboard. 
              Cinematic multi-scene video presentations with step-by-step derivations, animated simulations, and spoken intuition.
            </p>

            {/* Quick Feature Badges & Extra Feature Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <button
                onClick={() => setIsTopicComparatorOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <GitCompare className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Topic Comparator (Feature #10)</span>
              </button>

              <button
                onClick={() => setIsFormulaVaultOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                <span>Formula & Definition Vault (Feature #11)</span>
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setGeneratorPreFillTopic('');
                setGeneratorPreFillSubject('');
                setIsGeneratorModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-xl shadow-rose-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Generate Tough Topic Video</span>
            </button>

            <button
              onClick={handleExportToKeep}
              className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                justExportedKeep
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800'
              }`}
              title="Save current video notes directly to your Google Keep notebook"
            >
              {justExportedKeep ? <Check className="w-4 h-4 text-emerald-400" /> : <StickyNote className="w-4 h-4 text-amber-400" />}
              <span>{justExportedKeep ? 'Saved to Google Keep!' : 'Export to Keep'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Cinema Experience */}
      <div
        ref={playerContainerRef}
        className={`space-y-4 rounded-3xl bg-[#07090e] border border-slate-800/90 p-4 sm:p-6 shadow-2xl relative ${
          isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto rounded-none p-6 bg-slate-950' : ''
        }`}
      >
        {/* Video Stage Title Header & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
                {activeVideo.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-[10px]">
                {activeVideo.difficulty}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{activeVideo.estimatedDuration}</span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white">{activeVideo.title}</h2>
          </div>

          {/* Action Toolbar: Favorite, Download, Share, Keep */}
          <div className="flex items-center gap-2">
            {/* Favorite / Bookmark Toggle */}
            <button
              onClick={() => handleToggleBookmark(activeVideo.id)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                bookmarkedIds.includes(activeVideo.id)
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-md shadow-rose-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={bookmarkedIds.includes(activeVideo.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <Heart
                className={`w-4 h-4 ${
                  bookmarkedIds.includes(activeVideo.id) ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              <span className="hidden sm:inline">
                {bookmarkedIds.includes(activeVideo.id) ? 'Favorited' : 'Favorite'}
              </span>
            </button>

            {/* Download Study Pack */}
            <button
              onClick={() => handleDownloadStudyPack(activeVideo)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
              title="Download offline HTML & Markdown study packet"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Download Pack</span>
            </button>

            {/* Share Video */}
            <button
              onClick={() => handleOpenShareModal(activeVideo)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
              title="Share video link or study group post"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Dynamic Canvas & Dr. Agnes Overlay Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Main Visual Blackboard Canvas */}
          <div className="lg:col-span-9 relative rounded-3xl overflow-hidden min-h-[420px] lg:min-h-[500px]">
            <AgnesVideoCanvas
              scene={currentScene}
              isSpeaking={isPlaying && !isMuted}
              onOpenCheckpoint={() => setIsCheckpointModalOpen(true)}
              onAskDoubt={() => setIsDoubtModalOpen(true)}
            />
          </div>

          {/* Right Column: Dr. Agnes Video Presenter Avatar & Live HUD */}
          <div className="lg:col-span-3 flex flex-col justify-between p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            
            {/* Dr. Agnes Avatar with Lip-Sync Speech & Mood */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 p-3">
              <AgnesAvatar
                isSpeaking={isPlaying && !isMuted}
                mood={currentScene.quizCheckpoint ? 'aha' : currentScene.callout?.type === 'warning' ? 'warning' : 'explaining'}
                size="md"
              />
              <div className="mt-3 text-center space-y-0.5">
                <h4 className="text-xs font-black text-white">Dr. Agnes Vance</h4>
                <p className="text-[10px] text-slate-400">AI STEM Educator & Explainer</p>
              </div>
            </div>

            {/* Hook & Intuition Quote */}
            <div className="p-3 rounded-2xl bg-[#090b11] border border-slate-800 text-xs leading-relaxed text-slate-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                Core Lesson Hook:
              </span>
              <p className="italic text-[11px]">&quot;{activeVideo.hookSentence}&quot;</p>
            </div>

            {/* Quick Doubt Trigger */}
            <button
              onClick={() => setIsDoubtModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 border border-rose-500/40 text-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Ask Agnes a Doubt Now</span>
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <AgnesPlayerControls
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          currentSceneIndex={currentSceneIndex}
          totalScenes={activeVideo.scenes.length}
          scenes={activeVideo.scenes}
          onSelectScene={handleSelectScene}
          sceneProgress={sceneProgress}
          totalProgress={totalProgress}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={setPlaybackSpeed}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          subtitlesEnabled={subtitlesEnabled}
          onToggleSubtitles={() => setSubtitlesEnabled(!subtitlesEnabled)}
          currentSubtitle={currentSubtitle}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      </div>

      {/* Tabs Below Video Player */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'notes', label: 'Chalkboard Derivations', icon: FileText },
            { id: 'pitfalls', label: 'Exam Traps & Score Boosters', icon: Flame },
            { id: 'scenes', label: `All Scenes (${activeVideo.scenes.length})`, icon: Video },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Chalkboard Derivations & Takeaways */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Foundational Takeaways</span>
              </h3>
              <div className="space-y-2.5">
                {activeVideo.summaryTakeaways.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                    <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold font-mono text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black text-rose-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Golden Exam Tip</span>
              </h3>
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-600/40 text-rose-200 text-xs leading-relaxed space-y-2">
                <p className="font-bold">{activeVideo.examTip}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-rose-800/40">
                  <button
                    onClick={handleExportToKeep}
                    className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
                  >
                    <StickyNote className="w-3 h-3" />
                    <span>Pin this rule into your Google Keep</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pitfalls */}
        {activeTab === 'pitfalls' && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-sm font-black text-rose-400 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Common Student Misconceptions & Exam Traps</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeVideo.commonPitfalls.map((pitfall, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-200 flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold font-mono text-sm leading-none shrink-0">⚠️</span>
                  <span className="leading-relaxed">{pitfall}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: All Scenes Playlist */}
        {activeTab === 'scenes' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
            {activeVideo.scenes.map((scene, idx) => {
              const isCurrent = currentSceneIndex === idx;
              return (
                <div
                  key={scene.id}
                  onClick={() => handleSelectScene(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isCurrent
                      ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>SCENE {idx + 1}</span>
                      <span>{scene.durationSeconds}s</span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{scene.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{scene.keyFormulaOrConcept}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400">
                    <span className="capitalize">{scene.visualType}</span>
                    {scene.quizCheckpoint && (
                      <span className="text-amber-400 font-bold">Quiz Check</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ⭐ DEDICATED BOOKMARKED & FAVORITE VIDEOS SECTION */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Bookmarked & Favorite Videos</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                  {bookmarkedVideos.length} Saved
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Your personalized masterclass shelf of challenging topics saved for quick revision
              </p>
            </div>
          </div>

          {bookmarkedVideos.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  bookmarkedVideos.forEach((v) => exportAgnesNotesToKeep(v, user?.uid || null));
                  setDownloadNotification(`All ${bookmarkedVideos.length} bookmarked topics synced to Google Keep!`);
                  setTimeout(() => setDownloadNotification(null), 3500);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <StickyNote className="w-3.5 h-3.5" />
                <span>Sync All to Keep</span>
              </button>
            </div>
          )}
        </div>

        {bookmarkedVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedVideos.map((video) => {
              const isCurrentPlaying = activeVideo.id === video.id;

              return (
                <div
                  key={`bm_${video.id}`}
                  onClick={() => handleVideoSelect(video)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between gap-3 bg-slate-900/90 hover:bg-slate-900 relative ${
                    isCurrentPlaying
                      ? 'border-rose-500 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/30'
                      : 'border-slate-800 hover:border-rose-500/40'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header Row: Subject, Custom badge, Duration & Favorite button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                          {video.subject}
                        </span>
                        {video.id.startsWith('agnes_gen_') && (
                          <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-bold">
                            Custom
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-mono mr-1">
                          {video.estimatedDuration}
                        </span>

                        {/* Unfavorite Button */}
                        <button
                          onClick={(e) => handleToggleBookmark(video.id, e)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition"
                          title="Remove from favorites"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {video.topic}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {video.hookSentence}
                    </p>
                  </div>

                  {/* Action Footer: Play, Download, Share */}
                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCurrentPlaying ? 'Now Playing' : 'Watch Now'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDownloadStudyPack(video, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Download study pack"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                      </button>

                      <button
                        onClick={(e) => handleOpenShareModal(video, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Share video"
                      >
                        <Share2 className="w-3.5 h-3.5 text-sky-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-dashed border-slate-800 text-center space-y-3">
            <Heart className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-300">No favorite videos bookmarked yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click the heart or favorite button on any video card below to save tough topics for fast pre-exam revision.
              </p>
            </div>
            {/* Quick bookmark suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-[11px] text-slate-500 font-mono">Recommended to bookmark:</span>
              {PRECURATED_AGNES_VIDEOS.slice(0, 3).map((v) => (
                <button
                  key={`rec_${v.id}`}
                  onClick={() => handleToggleBookmark(v.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{v.topic}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Library Catalog Section */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Full Tough Topic Library</h3>
              <p className="text-xs text-slate-400">Masterclass video curriculum across all STEM domains</p>
            </div>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Bookmarks'].map(
              (subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                    selectedSubject === subj
                      ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {subj === 'Computer Science' ? 'CompSci' : subj}
                </button>
              )
            )}
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => {
            const isCurrentPlaying = activeVideo.id === video.id;
            const isBookmarked = bookmarkedIds.includes(video.id);

            return (
              <div
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between gap-3 bg-slate-900/90 ${
                  isCurrentPlaying
                    ? 'border-rose-500 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/30'
                    : 'border-slate-800 hover:border-slate-700 hover:shadow-md'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                        {video.subject}
                      </span>
                      {video.id.startsWith('agnes_gen_') ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-bold">
                          Custom
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[9px] font-mono">
                          Masterclass
                        </span>
                      )}
                    </div>

                    {/* Header Controls: Duration & Favorite button */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-mono mr-1">
                        {video.estimatedDuration}
                      </span>

                      {/* Favorite Button on each video card */}
                      <button
                        onClick={(e) => handleToggleBookmark(video.id, e)}
                        className={`p-1.5 rounded-lg transition ${
                          isBookmarked
                            ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
                            : 'text-slate-500 hover:text-rose-400 hover:bg-slate-800'
                        }`}
                        title={isBookmarked ? 'Remove from Favorites' : 'Add to Favorites'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {video.topic}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {video.hookSentence}
                  </p>
                </div>

                {/* Footer Controls: Watch Now, Download, Share */}
                <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCurrentPlaying ? 'Now Playing' : 'Watch with Agnes'}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDownloadStudyPack(video, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Download offline study packet"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                    </button>

                    <button
                      onClick={(e) => handleOpenShareModal(video, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Share video lecture"
                    >
                      <Share2 className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Modals */}
      <AgnesDoubtModal
        isOpen={isDoubtModalOpen}
        onClose={() => setIsDoubtModalOpen(false)}
        topic={activeVideo.topic}
        currentScene={currentScene}
      />

      {currentScene.quizCheckpoint && (
        <AgnesQuizCheckpointModal
          isOpen={isCheckpointModalOpen}
          onClose={() => setIsCheckpointModalOpen(false)}
          checkpoint={currentScene.quizCheckpoint}
          sceneTitle={currentScene.title}
          onContinue={() => setIsPlaying(true)}
        />
      )}

      <AgnesGeneratorModal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
        prefillTopic={generatorPreFillTopic}
        prefillSubject={generatorPreFillSubject}
        onVideoGenerated={(newVideo) => {
          setAllVideos((prev) => [newVideo, ...prev]);
          handleVideoSelect(newVideo);
        }}
      />

      {/* Share Modal */}
      {sharingVideo && (
        <AgnesShareModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSharingVideo(null);
          }}
          video={sharingVideo}
        />
      )}

      {/* AI Topic Comparator Modal (Feature #10) */}
      <AITopicComparatorModal
        isOpen={isTopicComparatorOpen}
        onClose={() => setIsTopicComparatorOpen(false)}
        onGenerateVideoOnTopic={handleComparatorVideoGenerate}
      />

      {/* Formula & Definition Vault Modal (Feature #11 & #13) */}
      <FormulaVaultModal
        isOpen={isFormulaVaultOpen}
        onClose={() => setIsFormulaVaultOpen(false)}
      />

    </div>
  );
}
