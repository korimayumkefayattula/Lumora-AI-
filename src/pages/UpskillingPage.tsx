import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  Zap, 
  Award, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  BookOpen, 
  Star, 
  Filter, 
  Video, 
  Code, 
  Brain, 
  Film, 
  Palette, 
  Layers, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';
import { 
  UPSKILLING_COURSES, 
  UPSKILLING_CATEGORIES, 
  FEATURED_CHANNELS, 
  UpskillingCourse 
} from '../data/upskillingCoursesData';
import { UpskillingCourseCard } from '../components/upskilling/UpskillingCourseCard';
import { VideoPlayerModal } from '../components/upskilling/VideoPlayerModal';
import { useTheme } from '../context/ThemeContext';

export default function UpskillingPage() {
  const { theme } = useTheme();

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('All Channels');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [activeCourse, setActiveCourse] = useState<UpskillingCourse | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  // Pro membership state (synced with localStorage for instant testing)
  const [isProUser, setIsProUser] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lumora_is_pro_member');
      return saved !== null ? JSON.parse(saved) : true; // Default to Pro for immediate access
    } catch {
      return true;
    }
  });

  // Explicitly activate Pro membership
  const handleActivatePro = () => {
    setIsProUser(true);
    try {
      localStorage.setItem('lumora_is_pro_member', JSON.stringify(true));
    } catch {
      // ignore
    }
  };

  // Track completed lesson IDs
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumora_completed_upskilling_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save completed lessons
  const handleToggleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      const next = prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
      try {
        localStorage.setItem('lumora_completed_upskilling_lessons', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Toggle Pro status for easy testing & demo
  const handleToggleProStatus = () => {
    const next = !isProUser;
    setIsProUser(next);
    try {
      localStorage.setItem('lumora_is_pro_member', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // Play course handler with instant autoplay
  const handlePlayCourse = (course: UpskillingCourse, chapterIndex: number = 0) => {
    setActiveCourse(course);
    setActiveChapterIndex(chapterIndex);
    setIsPlayerOpen(true);
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return UPSKILLING_COURSES.filter(course => {
      // Category filter
      if (selectedCategory !== 'all' && course.category !== selectedCategory) {
        return false;
      }
      // Channel filter
      if (selectedChannel !== 'All Channels' && course.channelName !== selectedChannel) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'All' && course.level !== selectedLevel && course.level !== 'All Levels') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = course.shortDescription.toLowerCase().includes(query);
        const matchesChannel = course.channelName.toLowerCase().includes(query);
        const matchesTags = course.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesSkills = course.skillsLearned.some(skill => skill.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesChannel || matchesTags || matchesSkills;
      }
      return true;
    });
  }, [selectedCategory, selectedChannel, selectedLevel, searchQuery]);

  // Featured Hero Course
  const heroCourse = UPSKILLING_COURSES[0];

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      
      {/* Header & Pro Tier Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              PRO FEATURE
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Curated Masterclasses with Instant Autoplay
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Upskilling Video Academy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Learn high-income digital skills from premier channels including <strong>Simplilearn</strong>, <strong>MIT OpenCourseWare</strong>, <strong>Canva Design School</strong>, and <strong>freeCodeCamp</strong>. Click any course or chapter to immediately play in HD with AI-powered study notes.
          </p>
        </div>

        {/* Pro Status Toggle Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 p-2 rounded-2xl">
          <div className="flex items-center gap-2 px-2">
            {isProUser ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Pro Member Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Lock className="w-4 h-4" />
                <span>Free Preview Tier</span>
              </div>
            )}
          </div>

          <button
            onClick={handleToggleProStatus}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              isProUser
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md shadow-rose-600/30 hover:opacity-90'
            }`}
            title="Click to toggle between Pro and Free mode to test gating"
          >
            {isProUser ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>Switch to Free View</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Unlock Pro Free Trial</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Featured Masterclass Hero Banner */}
      {heroCourse && (
        <div 
          onClick={() => handlePlayCourse(heroCourse, 0)}
          className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-slate-900 via-zinc-900 to-black text-white p-6 sm:p-8 cursor-pointer group shadow-xl hover:shadow-2xl hover:border-rose-500/50 transition-all duration-300"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Featured Masterclass
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold">
                  {heroCourse.categoryLabel}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-300 text-xs">
                  {heroCourse.duration}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight group-hover:text-rose-400 transition-colors">
                {heroCourse.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                {heroCourse.detailedDescription}
              </p>

              {/* Channel Info & Rating */}
              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2">
                  <img 
                    src={heroCourse.channelAvatar} 
                    alt={heroCourse.channelName} 
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                  />
                  <span className="font-bold text-white">{heroCourse.channelName}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{heroCourse.rating} ({heroCourse.reviewsCount.toLocaleString()})</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center gap-3">
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 group-hover:from-rose-500 group-hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 group-hover:scale-105 transition-all">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Watch with Autoplay</span>
                </button>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  8 Full Modules + Verified Certificate
                </span>
              </div>
            </div>

            {/* Right Thumbnail Visual */}
            <div className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={`https://img.youtube.com/vi/${heroCourse.primaryYoutubeId}/hqdefault.jpg`} 
                alt={heroCourse.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-115 transition-transform">
                  <Play className="w-6 h-6 ml-0.5 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-bold text-white">
                {heroCourse.duration}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Filter Toolbar: Categories, Channels, Search & Levels */}
      <div className="space-y-4">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {UPSKILLING_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row: Channels, Search, Level */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Channel Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mr-1 hidden md:inline">
              Channels:
            </span>
            {FEATURED_CHANNELS.map(ch => {
              const isSelected = selectedChannel === ch;
              return (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {ch}
                </button>
              );
            })}
          </div>

          {/* Search Input & Difficulty Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, skills..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Level Selector */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 focus:outline-none focus:border-rose-500"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

        </div>

      </div>

      {/* Courses Grid */}
      <div className="space-y-4">
        
        {/* Results Header Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredCourses.length}</strong> masterclass courses
          </span>
          <span className="text-[11px]">
            ⚡ Click any course card to start HD autoplay
          </span>
        </div>

        {/* Grid Cards */}
        {filteredCourses.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No courses match your filter</h3>
            <p className="text-xs text-slate-500">Try resetting your search query or selecting "All Courses".</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedChannel('All Channels');
                setSearchQuery('');
                setSelectedLevel('All');
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map(course => {
              const completedCount = course.chapters.filter(ch => completedLessons.includes(ch.id)).length;
              return (
                <UpskillingCourseCard
                  key={course.id}
                  course={course}
                  onPlayCourse={handlePlayCourse}
                  completedLessonsCount={completedCount}
                  isProUser={isProUser}
                  onUpgradeToPro={handleToggleProStatus}
                />
              );
            })}
          </div>
        )}

      </div>

      {/* Pro Upskilling Perks Feature Strip */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 bg-gradient-to-r from-rose-950/20 via-amber-950/10 to-transparent space-y-6">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Why Lumora Pro Upskilling?</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2 p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Instant Autoplay Player</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              No distracting YouTube homepage algorithms, recommendations, or comments. Pure focus-driven video playback directly integrated with your curriculum.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Real-Time Notes & Summaries</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Each module includes instant AI key takeaways, core formula sheets, and a synchronized personal study notebook saved locally.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Verifiable Completion Certificates</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Complete course modules to generate an official Lumora AI Certificate of Professional Upskilling with your name and unique credential ID.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Video Player Modal with Autoplay */}
      {activeCourse && (
        <VideoPlayerModal
          course={activeCourse}
          initialChapterIndex={activeChapterIndex}
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          isProUser={isProUser}
          onUpgradeToPro={handleActivatePro}
          completedLessons={completedLessons}
          onToggleLessonComplete={handleToggleLessonComplete}
        />
      )}

    </div>
  );
}
