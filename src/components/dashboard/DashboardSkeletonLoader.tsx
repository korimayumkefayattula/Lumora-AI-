import React from 'react';
import { Sparkles, BrainCircuit, Calendar, BarChart3, AlertTriangle, RefreshCw } from 'lucide-react';

interface SkeletonProps {
  className?: string;
}

export const SkeletonPulse: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 theme-focus:bg-[#28211b] rounded-lg ${className}`} />
);

// 1. Ask Lumora Hero Skeleton
export const AskLumoraHeroSkeleton: React.FC = () => (
  <div className="clay-widget rounded-[16px] p-5 sm:p-6 border border-slate-200/90 dark:border-purple-900/40 space-y-4">
    {/* Header */}
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <SkeletonPulse className="w-8 h-8 rounded-[12px]" />
        <div className="space-y-1.5">
          <SkeletonPulse className="w-28 h-4" />
          <SkeletonPulse className="w-44 h-3" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SkeletonPulse className="w-24 h-7 rounded-[10px]" />
        <SkeletonPulse className="w-28 h-7 rounded-[10px]" />
      </div>
    </div>

    {/* Big Input Area */}
    <div className="clay-surface rounded-[14px] p-4 bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-purple-900/30 space-y-3">
      <SkeletonPulse className="w-3/4 h-5" />
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="w-7 h-7 rounded-lg" />
          <SkeletonPulse className="w-7 h-7 rounded-lg" />
          <SkeletonPulse className="w-7 h-7 rounded-lg" />
        </div>
        <SkeletonPulse className="w-24 h-8 rounded-[10px]" />
      </div>
    </div>

    {/* Suggestion Chips */}
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <SkeletonPulse className="w-16 h-3" />
      <SkeletonPulse className="w-24 h-6 rounded-[8px]" />
      <SkeletonPulse className="w-20 h-6 rounded-[8px]" />
      <SkeletonPulse className="w-24 h-6 rounded-[8px]" />
      <SkeletonPulse className="w-28 h-6 rounded-[8px]" />
      <SkeletonPulse className="w-32 h-6 rounded-[8px]" />
    </div>
  </div>
);

// 2. Continue Learning Cards Skeleton
export const ContinueLearningSkeleton: React.FC = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <SkeletonPulse className="w-36 h-4" />
      <SkeletonPulse className="w-20 h-3" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="clay-widget rounded-[16px] p-5 space-y-4">
          <div className="space-y-2">
            <SkeletonPulse className="w-16 h-3" />
            <SkeletonPulse className="w-full h-4" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <SkeletonPulse className="w-20 h-3" />
              <SkeletonPulse className="w-12 h-3" />
            </div>
            <SkeletonPulse className="w-full h-2 rounded-full" />
            <SkeletonPulse className="w-20 h-4 mt-2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 3. Today's Plan Skeleton
export const TodayPlanSkeleton: React.FC = () => (
  <div className="clay-widget rounded-[16px] p-5 space-y-4">
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
      <div className="flex items-center gap-2">
        <SkeletonPulse className="w-7 h-7 rounded-[10px]" />
        <div className="space-y-1">
          <SkeletonPulse className="w-24 h-3.5" />
          <SkeletonPulse className="w-28 h-2.5" />
        </div>
      </div>
      <SkeletonPulse className="w-20 h-3" />
    </div>

    <div className="space-y-1.5">
      <div className="flex justify-between">
        <SkeletonPulse className="w-24 h-3" />
        <SkeletonPulse className="w-10 h-3" />
      </div>
      <SkeletonPulse className="w-full h-2 rounded-full" />
    </div>

    <div className="space-y-2 pt-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-[12px] border border-slate-100 dark:border-slate-800/60">
          <SkeletonPulse className="w-5 h-5 rounded-[6px]" />
          <SkeletonPulse className="w-3/4 h-3.5" />
        </div>
      ))}
    </div>
  </div>
);

// 4. Quick Study Tools Skeleton
export const QuickStudyToolsSkeleton: React.FC = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <SkeletonPulse className="w-32 h-4" />
      <SkeletonPulse className="w-28 h-3" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="clay-widget rounded-[16px] p-3 flex flex-col items-center justify-center gap-2">
          <SkeletonPulse className="w-8 h-8 rounded-[12px]" />
          <SkeletonPulse className="w-12 h-3" />
        </div>
      ))}
    </div>
  </div>
);

// 5. Lumora Recommendation Skeleton
export const LumoraRecommendationSkeleton: React.FC = () => (
  <div className="clay-widget rounded-[16px] p-5 border border-purple-200/80 dark:border-purple-800/60">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-2 max-w-xl w-full">
        <SkeletonPulse className="w-32 h-5 rounded-full" />
        <SkeletonPulse className="w-3/4 h-5" />
        <SkeletonPulse className="w-full h-3.5" />
      </div>
      <SkeletonPulse className="w-full sm:w-48 h-10 rounded-[14px]" />
    </div>
  </div>
);

// 6. Progress & Revision Triplet Skeleton
export const ProgressRevisionTripletSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[1, 2, 3].map((card) => (
      <div key={card} className="clay-widget rounded-[16px] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <SkeletonPulse className="w-7 h-7 rounded-[10px]" />
            <div className="space-y-1">
              <SkeletonPulse className="w-24 h-3.5" />
              <SkeletonPulse className="w-28 h-2.5" />
            </div>
          </div>
          <SkeletonPulse className="w-16 h-3" />
        </div>
        <div className="space-y-3">
          <SkeletonPulse className="w-full h-3" />
          <SkeletonPulse className="w-full h-2 rounded-full" />
          <div className="grid grid-cols-3 gap-2 pt-2">
            <SkeletonPulse className="h-12 rounded-[10px]" />
            <SkeletonPulse className="h-12 rounded-[10px]" />
            <SkeletonPulse className="h-12 rounded-[10px]" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Complete Dashboard Composite Skeleton Loader
export const DashboardSkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in" aria-busy="true" aria-label="Loading student dashboard">
      {/* Dynamic Greeting Skeleton */}
      <div className="pt-4 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="space-y-2">
          <SkeletonPulse className="w-64 h-8" />
          <SkeletonPulse className="w-48 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonPulse className="w-28 h-8 rounded-[12px]" />
          <SkeletonPulse className="w-28 h-8 rounded-[12px]" />
        </div>
      </div>

      {/* 1. Tier 1 Hero: Ask Lumora */}
      <AskLumoraHeroSkeleton />

      {/* 2 & 3. Continue Learning & Today's Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <ContinueLearningSkeleton />
        </div>
        <div className="lg:col-span-5">
          <TodayPlanSkeleton />
        </div>
      </div>

      {/* 4. Quick Study Tools */}
      <QuickStudyToolsSkeleton />

      {/* 5. Recommendation Card */}
      <LumoraRecommendationSkeleton />

      {/* 6 & 7. Progress Triplet */}
      <ProgressRevisionTripletSkeleton />
    </div>
  );
};

export default DashboardSkeletonLoader;
