import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  Circle, 
  Award, 
  Download, 
  FileText, 
  Sparkles, 
  Lock, 
  Unlock, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Bookmark, 
  Share2, 
  Copy, 
  Check, 
  BookOpen, 
  Zap,
  Printer,
  ShieldCheck,
  Maximize2,
  Volume2,
  VolumeX,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UpskillingCourse, CourseChapter } from '../../data/upskillingCoursesData';

interface VideoPlayerModalProps {
  course: UpskillingCourse;
  initialChapterIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  isProUser: boolean;
  onUpgradeToPro: () => void;
  completedLessons: string[];
  onToggleLessonComplete: (lessonId: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  course,
  initialChapterIndex = 0,
  isOpen,
  onClose,
  isProUser,
  onUpgradeToPro,
  completedLessons,
  onToggleLessonComplete,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterIndex);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'summary' | 'notes' | 'certificate' | 'resources'>('curriculum');
  const [noteInput, setNoteInput] = useState('');
  const [savedNotes, setSavedNotes] = useState<{ id: string; chapterTitle: string; text: string; time: string }[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCertPreview, setShowCertPreview] = useState(false);
  const [studentName, setStudentName] = useState('Alex Johnson');
  const [isMuted, setIsMuted] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);

  const currentChapter = course.chapters[currentChapterIndex] || course.chapters[0];
  const isCurrentLessonProLocked = !isProUser && currentChapterIndex > 0;

  // Load saved notes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`lumora_notes_${course.id}`);
      if (stored) {
        setSavedNotes(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [course.id]);

  // Update current chapter when initial index changes
  useEffect(() => {
    setCurrentChapterIndex(initialChapterIndex);
  }, [initialChapterIndex]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentYoutubeId = currentChapter.youtubeId || course.primaryYoutubeId;
  const startParam = currentChapter.timestampSeconds ? `&start=${currentChapter.timestampSeconds}` : '';
  const directYoutubeUrl = `https://www.youtube.com/watch?v=${currentYoutubeId}${currentChapter.timestampSeconds ? `&t=${currentChapter.timestampSeconds}s` : ''}`;
  // Standard YouTube embed with autoplay=1, playsinline=1, mute control, and origin
  const embedUrl = `https://www.youtube.com/embed/${currentYoutubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1${startParam}`;

  const handleSelectChapter = (index: number) => {
    if (!isProUser && index > 0) {
      // Trigger pro upgrade prompt
      setActiveTab('curriculum');
      return;
    }
    setCurrentChapterIndex(index);
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < course.chapters.length - 1) {
      handleSelectChapter(currentChapterIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      handleSelectChapter(currentChapterIndex - 1);
    }
  };

  const handleSaveNote = () => {
    if (!noteInput.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      chapterTitle: currentChapter.title,
      text: noteInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    setNoteInput('');
    try {
      localStorage.setItem(`lumora_notes_${course.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDeleteNote = (id: string) => {
    const updated = savedNotes.filter(n => n.id !== id);
    setSavedNotes(updated);
    try {
      localStorage.setItem(`lumora_notes_${course.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const completedCount = course.chapters.filter(ch => completedLessons.includes(ch.id)).length;
  const progressPercent = Math.round((completedCount / course.chapters.length) * 100);
  const isCourseFullyCompleted = completedCount === course.chapters.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-7xl h-[92vh] max-h-[950px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Bar */}
        <div className="h-14 px-4 sm:px-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold tracking-wider uppercase shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Pro Masterclass
            </span>
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
                <span>{course.title}</span>
                <span className="text-slate-400 text-xs hidden sm:inline">• {course.channelName}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Share link */}
            <button 
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
              title="Share Course Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            {/* Close Modal */}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area (Split Grid) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left / Center Video Stage (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col bg-black overflow-y-auto">
            
            {/* 16:9 Video Embed or Pro Locked Gate */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {isCurrentLessonProLocked ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
                    <Lock className="w-8 h-8" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
                    Pro Member Lecture
                  </span>
                  <h3 className="text-xl font-bold text-white max-w-md mb-2">
                    {currentChapter.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-md mb-6">
                    This advanced module is part of the Lumora Pro Upskilling Curriculum. Upgrade to stream unlimited masterclasses, AI lecture notes, and earn verifiable certificates.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onUpgradeToPro}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Unlock Full Pro Access
                    </button>
                    <button
                      onClick={() => handleSelectChapter(0)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
                    >
                      Watch Free Preview (Lecture 1)
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <iframe
                    key={`${currentChapter.id}-${currentYoutubeId}-${currentChapterIndex}-${playerKey}-${isMuted ? 'muted' : 'unmuted'}`}
                    src={embedUrl}
                    title={currentChapter.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  {/* Subtle Autoplay Indicator & Sound control */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-emerald-400 text-[11px] font-medium flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Autoplay Ready</span>
                    </div>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white hover:text-amber-300 text-[11px] font-semibold flex items-center gap-1.5 shadow-md transition-colors"
                      title={isMuted ? 'Click to Unmute Audio' : 'Audio is Unmuted'}
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                          <span>Muted (Click to Unmute 🔊)</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Sound On</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Watch on YouTube button on top right of video */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <a
                      href={directYoutubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Watch on YouTube</span>
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Video Controls & Meta Strip */}
            <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-col gap-4">
              
              {/* Lecture Title & Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
                    <span>Lecture {currentChapterIndex + 1} of {course.chapters.length}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {currentChapter.duration}
                    </span>
                  </div>
                  <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {currentChapter.title}
                  </h1>
                </div>

                {/* Lesson Action Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrevChapter}
                    disabled={currentChapterIndex === 0}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 transition-colors"
                    title="Previous Lesson"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onToggleLessonComplete(currentChapter.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      completedLessons.includes(currentChapter.id)
                        ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {completedLessons.includes(currentChapter.id) ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleNextChapter}
                    disabled={currentChapterIndex === course.chapters.length - 1}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 transition-colors"
                    title="Next Lesson"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Channel Profile Info & YouTube Link */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <img 
                    src={course.channelAvatar} 
                    alt={course.channelName} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-200">{course.channelName}</span>
                      <span title="Verified Creator">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{course.subscribers} Subscribers • {course.instructor}</span>
                  </div>
                </div>

                <a
                  href={`https://www.youtube.com/watch?v=${currentYoutubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

            {/* Bottom Overview Text */}
            <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-300 space-y-3">
              <p className="leading-relaxed">
                {currentChapter.summary}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 text-[11px] border border-slate-700/60">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Companion Panel (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col bg-slate-900 border-l border-slate-800 overflow-hidden">
            
            {/* Tabs Selector */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-2 overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'curriculum'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curriculum ({course.chapters.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('summary')}
                className={`py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'summary'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Notes</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Notebook</span>
              </button>

              <button
                onClick={() => setActiveTab('certificate')}
                className={`py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'certificate'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Certificate</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* TAB 1: CURRICULUM */}
              {activeTab === 'curriculum' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 text-slate-400">
                    <span>Course Progress: {progressPercent}%</span>
                    <span>{completedCount}/{course.chapters.length} Lectures</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    {course.chapters.map((ch, idx) => {
                      const isActive = idx === currentChapterIndex;
                      const isCompleted = completedLessons.includes(ch.id);
                      const isLocked = !isProUser && idx > 0;

                      return (
                        <div
                          key={ch.id}
                          onClick={() => handleSelectChapter(idx)}
                          className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isActive
                              ? 'bg-rose-950/30 border-rose-500/50 shadow-sm'
                              : isLocked
                              ? 'bg-slate-900/40 border-slate-800/80 opacity-75 hover:border-slate-700'
                              : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Play/Lock Status Icon */}
                          <div className="pt-0.5 shrink-0">
                            {isLocked ? (
                              <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                <Lock className="w-3 h-3" />
                              </div>
                            ) : isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : isActive ? (
                              <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse">
                                <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center group-hover:text-white">
                                <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
                              </div>
                            )}
                          </div>

                          {/* Chapter Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                isActive ? 'text-rose-400' : 'text-slate-400'
                              }`}>
                                Lesson {idx + 1}
                              </span>
                              <span className="text-[10px] text-slate-400">{ch.duration}</span>
                            </div>
                            <h4 className={`text-xs font-semibold leading-snug line-clamp-2 ${
                              isActive ? 'text-white' : 'text-slate-300'
                            }`}>
                              {ch.title}
                            </h4>
                            {isLocked && (
                              <span className="mt-1 inline-block text-[10px] font-bold text-amber-400">
                                Pro Member Only
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: AI SUMMARY & TAKEAWAYS */}
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-rose-300 text-xs font-bold">
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      <span>AI Key Concept Summary</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentChapter.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Core Skills Taught:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {course.skillsLearned.map((skill, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Actionable Takeaways:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {course.takeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: PERSONAL STUDY NOTEBOOK */}
              {activeTab === 'notes' && (
                <div className="space-y-4 flex flex-col h-full">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>Add Note for: {currentChapter.title.slice(0, 30)}...</span>
                      <span className="text-[10px] text-slate-400">Auto-saved locally</span>
                    </label>
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Write your study notes, key formulas, or code snippets here..."
                      rows={3}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                    <button
                      onClick={handleSaveNote}
                      disabled={!noteInput.trim()}
                      className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save Study Note</span>
                    </button>
                  </div>

                  {/* List of saved notes */}
                  <div className="space-y-2 flex-1 overflow-y-auto pt-2">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Saved Notes ({savedNotes.length})
                    </h4>
                    {savedNotes.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">
                        No notes saved yet for this course. Type above to begin.
                      </p>
                    ) : (
                      savedNotes.map((note) => (
                        <div key={note.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 group">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-semibold text-rose-400 truncate max-w-[180px]">{note.chapterTitle}</span>
                            <div className="flex items-center gap-2">
                              <span>{note.time}</span>
                              <button 
                                onClick={() => handleDeleteNote(note.id)}
                                className="text-slate-500 hover:text-rose-400 transition-colors"
                                title="Delete note"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                            {note.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CERTIFICATE OF COMPLETION */}
              {activeTab === 'certificate' && (
                <div className="space-y-4 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Award className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Lumora Pro Upskilling Certificate
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Complete all {course.chapters.length} lectures in this masterclass to earn your verified credentials.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-400">Completion Status:</span>
                    <span className={`font-bold ${isCourseFullyCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {completedCount} of {course.chapters.length} Lectures Finished
                    </span>
                  </div>

                  {isCourseFullyCompleted ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs">
                        🎉 Congratulations! You have fully completed this masterclass!
                      </div>
                      <button
                        onClick={() => setShowCertPreview(true)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        <span>View & Print Verified Certificate</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        // Mark all complete to allow instant verification demo
                        course.chapters.forEach(ch => {
                          if (!completedLessons.includes(ch.id)) {
                            onToggleLessonComplete(ch.id);
                          }
                        });
                      }}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Quick Complete All for Demo Certificate
                    </button>
                  )}
                </div>
              )}

              {/* TAB 5: RESOURCES */}
              {activeTab === 'resources' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Course Companion Resources:
                  </h4>
                  {course.resourceLinks.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Download className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">{res.title}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400" />
                    </a>
                  ))}
                </div>
              )}

            </div>

            {/* Bottom Upgrade CTA if user is free */}
            {!isProUser && (
              <div className="p-3 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">Free Preview Mode</span>
                </div>
                <button
                  onClick={onUpgradeToPro}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-sm transition-colors"
                >
                  Unlock Pro
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Certificate Modal */}
      {showCertPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-8 border-8 border-amber-400 shadow-2xl space-y-6 text-center">
            
            <button 
              onClick={() => setShowCertPreview(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                LUMORA AI ACADEMY OF TECHNOLOGY
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Certificate of Professional Upskilling
              </h1>
              <p className="text-xs text-slate-500">This is to certify that</p>
            </div>

            <div className="border-b-2 border-slate-900 pb-2 max-w-sm mx-auto">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="text-xl sm:text-2xl font-bold font-serif text-center w-full focus:outline-none text-rose-700 bg-transparent"
                title="Click to edit your name"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              has successfully completed all lectures, masterclass curriculum, and practical assessments in 
              <strong className="block text-slate-900 font-bold mt-1 text-sm sm:text-base">
                {course.title}
              </strong>
              produced by <span className="font-semibold text-rose-600">{course.channelName}</span> in partnership with Lumora AI.
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-left text-[11px] text-slate-500">
              <div>
                <p className="font-bold text-slate-900">Credential ID: LUM-{(Math.random() * 100000).toFixed(0)}</p>
                <p>Issued: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <div className="font-serif italic text-base text-slate-800 font-bold">Alexander Vance, PhD</div>
                <p className="text-[10px]">Academic Dean, Lumora AI</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertPreview(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition-colors"
              >
                Back to Course
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
