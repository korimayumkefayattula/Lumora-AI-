import React from 'react';
import { 
  Play, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Zap, 
  Layers 
} from 'lucide-react';
import { UpskillingCourse } from '../../data/upskillingCoursesData';

interface UpskillingCourseCardProps {
  course: UpskillingCourse;
  onPlayCourse: (course: UpskillingCourse, chapterIndex?: number) => void;
  completedLessonsCount: number;
  isProUser: boolean;
  onUpgradeToPro: () => void;
}

export const UpskillingCourseCard: React.FC<UpskillingCourseCardProps> = ({
  course,
  onPlayCourse,
  completedLessonsCount,
  isProUser,
  onUpgradeToPro
}) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${course.primaryYoutubeId}/hqdefault.jpg`;
  const progressPercent = Math.round((completedLessonsCount / course.chapters.length) * 100);

  const handleCardClick = () => {
    onPlayCourse(course, 0);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#121217] hover:border-rose-500/60 dark:hover:border-rose-500/50 shadow-sm hover:shadow-xl hover:shadow-rose-950/10 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail Area with Autoplay Action Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img 
          src={thumbnailUrl} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

        {/* Top Badges: Pro & Category */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            {/* PRO Badge */}
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-current" />
              PRO
            </span>

            {/* Featured Badge if present */}
            {course.featuredBadge && (
              <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-amber-300 text-[10px] font-semibold">
                {course.featuredBadge}
              </span>
            )}
          </div>

          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-medium border border-white/10">
            {course.categoryLabel}
          </span>
        </div>

        {/* Centered Play Button that blooms on hover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-rose-600/90 group-hover:bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-115 transition-all duration-300 group-hover:shadow-rose-600/50">
            <Play className="w-5 h-5 ml-0.5 fill-current text-white" />
          </div>
        </div>

        {/* Autoplay Banner on Hover */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white pointer-events-none">
          <div className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-[10px]">Click to Autoplay</span>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-slate-200">
            {course.duration}
          </span>
        </div>

        {/* Progress bar if started */}
        {completedLessonsCount > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-2">
          {/* Channel Info Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <img 
                src={course.channelAvatar} 
                alt={course.channelName} 
                className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-700"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate flex items-center gap-1">
                <span>{course.channelName}</span>
                <ShieldCheck className="w-3 h-3 text-blue-500 shrink-0" />
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span>{course.rating}</span>
            </div>
          </div>

          {/* Course Title */}
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {course.shortDescription}
          </p>
        </div>

        {/* Meta Specs & Progress footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {course.lecturesCount} Lessons
            </span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-medium text-[10px]">
              {course.level}
            </span>
          </div>

          {completedLessonsCount > 0 ? (
            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {progressPercent}% Done
            </span>
          ) : (
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Start Free
              <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
