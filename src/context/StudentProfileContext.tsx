import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TodayPlanTask {
  id: string;
  subject: string;
  title: string;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Exam Level' | 'High Priority';
  progress: number; // 0 - 100
  isCompleted: boolean;
  completed?: boolean;
  route: string;
  actionRoute?: string;
  type: 'concept' | 'practice' | 'quiz' | 'revision';
}

export interface SubjectProgress {
  name: string;
  progressPercentage: number;
  accuracy: number;
  totalChapters: number;
  completedChapters: number;
  status: 'Strong' | 'Needs Practice' | 'High Priority';
}

export interface StudentProfile {
  name: string;
  email: string;
  classGrade: string;
  subjects: string[];
  learningGoals: string[];
  targetExam: string;
  dailyStudyTime: string; // "15 minutes", "30 minutes", "45 minutes", "60 minutes", "90+ minutes"
  preferredStyle: string;
  isOnboarded: boolean;
  studyStreak: number;
  streakDays: number;
  todayStudyMinutes: number;
  totalStudyMinutesToday: number;
  dailyGoalHours: number;
  topicsCompletedThisWeek: number;
  quizAccuracyAvg: number;
  weeklyGoalHours: number;
  weeklyProgressHours: number;
  trend: 'Improving' | 'Stable' | 'Needs Attention';
  trendDelta: string;
  todayPlan: TodayPlanTask[];
  lastActivity: {
    subject: string;
    chapter: string;
    progressPercentage: number;
    progress?: number;
    route: string;
    actionRoute?: string;
  };
  subjectsBreakdown: SubjectProgress[];
}

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Alex Johnson',
  email: 'alex.student@lumora.ai',
  classGrade: 'Class 11 / High School',
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
  learningGoals: ['Understand difficult topics', 'Prepare for exams', 'Build better study habits'],
  targetExam: 'Final Board & Competitive Exams 2026',
  dailyStudyTime: '60 minutes',
  preferredStyle: 'Socratic & Visual',
  isOnboarded: true,
  studyStreak: 5,
  streakDays: 5,
  todayStudyMinutes: 45,
  totalStudyMinutesToday: 45,
  dailyGoalHours: 2,
  topicsCompletedThisWeek: 18,
  quizAccuracyAvg: 78,
  weeklyGoalHours: 15,
  weeklyProgressHours: 11.5,
  trend: 'Improving',
  trendDelta: '+14% vs last week',
  todayPlan: [
    {
      id: 'task-1',
      subject: 'Mathematics',
      title: 'Quadratic Equations & Discriminant Properties',
      durationMinutes: 30,
      difficulty: 'Medium',
      progress: 68,
      isCompleted: false,
      completed: false,
      route: '/student/concept-explorer',
      actionRoute: '/student/concept-explorer',
      type: 'concept'
    },
    {
      id: 'task-2',
      subject: 'Physics',
      title: 'Light Reactions & Photons Absorption',
      durationMinutes: 25,
      difficulty: 'Easy',
      progress: 0,
      isCompleted: false,
      completed: false,
      route: '/student/tutor',
      actionRoute: '/student/tutor',
      type: 'concept'
    },
    {
      id: 'task-3',
      subject: 'Biology',
      title: 'Cellular Structure — 15-Question Quiz',
      durationMinutes: 15,
      difficulty: 'Exam Level',
      progress: 0,
      isCompleted: false,
      completed: false,
      route: '/student/quiz',
      actionRoute: '/student/quiz',
      type: 'quiz'
    },
    {
      id: 'task-4',
      subject: 'Algebra',
      title: 'Targeted Spaced Revision Session',
      durationMinutes: 10,
      difficulty: 'High Priority',
      progress: 0,
      isCompleted: false,
      completed: false,
      route: '/student/revision',
      actionRoute: '/student/revision',
      type: 'revision'
    }
  ],
  lastActivity: {
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    progressPercentage: 68,
    progress: 68,
    route: '/student/concept-explorer',
    actionRoute: '/student/concept-explorer'
  },
  subjectsBreakdown: [
    { name: 'Mathematics', progressPercentage: 62, accuracy: 72, totalChapters: 14, completedChapters: 9, status: 'Needs Practice' },
    { name: 'Physics', progressPercentage: 48, accuracy: 64, totalChapters: 16, completedChapters: 8, status: 'High Priority' },
    { name: 'Chemistry', progressPercentage: 67, accuracy: 74, totalChapters: 12, completedChapters: 8, status: 'Needs Practice' },
    { name: 'Biology', progressPercentage: 91, accuracy: 89, totalChapters: 15, completedChapters: 14, status: 'Strong' }
  ]
};

interface StudentProfileContextType {
  profile: StudentProfile;
  updateProfile: (partial: Partial<StudentProfile>) => void;
  toggleTaskCompletion: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  completeOnboarding: (data: {
    name: string;
    classGrade: string;
    subjects: string[];
    learningGoals: string[];
    dailyStudyTime: string;
    targetExam: string;
  }) => void;
  resetOnboarding: () => void;
  logStudySession: (minutes: number) => void;
}

const StudentProfileContext = createContext<StudentProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'lumora_student_profile_v2';

export const StudentProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load student profile from localStorage:', e);
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save student profile:', e);
    }
  }, [profile]);

  const updateProfile = (partial: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...partial }));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setProfile(prev => {
      const updatedTasks = prev.todayPlan.map(t => {
        if (t.id === taskId) {
          const nextCompleted = !t.isCompleted;
          return {
            ...t,
            isCompleted: nextCompleted,
            progress: nextCompleted ? 100 : 0
          };
        }
        return t;
      });

      const completedCount = updatedTasks.filter(t => t.isCompleted).length;
      return {
        ...prev,
        todayPlan: updatedTasks,
        topicsCompletedThisWeek: prev.topicsCompletedThisWeek + (updatedTasks.find(t => t.id === taskId)?.isCompleted ? 1 : 0)
      };
    });
  };

  const completeOnboarding = (data: {
    name: string;
    classGrade: string;
    subjects: string[];
    learningGoals: string[];
    dailyStudyTime: string;
    targetExam: string;
  }) => {
    // Generate initial personalized tasks based on chosen subjects
    const newTasks: TodayPlanTask[] = [
      {
        id: 'init-task-1',
        subject: data.subjects[0] || 'Mathematics',
        title: `Core Concept Diagnostic & Overview`,
        durationMinutes: 25,
        difficulty: 'Medium',
        progress: 0,
        isCompleted: false,
        route: '/student/concept-explorer',
        type: 'concept'
      },
      {
        id: 'init-task-2',
        subject: data.subjects[1] || (data.subjects[0] ? `${data.subjects[0]} Practice` : 'Science'),
        title: `Guided Practice & Problem Solving`,
        durationMinutes: 20,
        difficulty: 'Easy',
        progress: 0,
        isCompleted: false,
        route: '/student/tutor',
        type: 'practice'
      },
      {
        id: 'init-task-3',
        subject: data.subjects[0] || 'General',
        title: `10-Question Diagnostic Quiz`,
        durationMinutes: 15,
        difficulty: 'Exam Level',
        progress: 0,
        isCompleted: false,
        route: '/student/quiz',
        type: 'quiz'
      },
      {
        id: 'init-task-4',
        subject: 'Active Recall',
        title: `High-Yield Spaced Revision Cards`,
        durationMinutes: 10,
        difficulty: 'High Priority',
        progress: 0,
        isCompleted: false,
        route: '/student/revision',
        type: 'revision'
      }
    ];

    const subjectsBreakdown: SubjectProgress[] = data.subjects.map((subj, idx) => ({
      name: subj,
      progressPercentage: idx === 0 ? 55 : idx === 1 ? 40 : 30,
      accuracy: 70 + (idx * 5) % 25,
      totalChapters: 12,
      completedChapters: Math.max(1, 6 - idx),
      status: idx === 0 ? 'Needs Practice' : idx === 1 ? 'High Priority' : 'Strong'
    }));

    setProfile(prev => ({
      ...prev,
      name: data.name || prev.name,
      classGrade: data.classGrade,
      subjects: data.subjects.length > 0 ? data.subjects : prev.subjects,
      learningGoals: data.learningGoals,
      dailyStudyTime: data.dailyStudyTime,
      targetExam: data.targetExam,
      isOnboarded: true,
      todayPlan: newTasks,
      subjectsBreakdown: subjectsBreakdown.length > 0 ? subjectsBreakdown : prev.subjectsBreakdown,
      lastActivity: {
        subject: data.subjects[0] || 'Mathematics',
        chapter: 'Introductory Mastery',
        progressPercentage: 45,
        route: '/student/concept-explorer'
      }
    }));
  };

  const resetOnboarding = () => {
    setProfile(prev => ({ ...prev, isOnboarded: false }));
  };

  const logStudySession = (minutes: number) => {
    setProfile(prev => ({
      ...prev,
      todayStudyMinutes: prev.todayStudyMinutes + minutes,
      weeklyProgressHours: +(prev.weeklyProgressHours + (minutes / 60)).toFixed(1)
    }));
  };

  return (
    <StudentProfileContext.Provider
      value={{
        profile: {
          ...profile,
          streakDays: profile.streakDays ?? profile.studyStreak,
          totalStudyMinutesToday: profile.totalStudyMinutesToday ?? profile.todayStudyMinutes,
          dailyGoalHours: profile.dailyGoalHours ?? 2,
        },
        updateProfile,
        toggleTaskCompletion,
        toggleTaskComplete: toggleTaskCompletion,
        completeOnboarding,
        resetOnboarding,
        logStudySession
      }}
    >
      {children}
    </StudentProfileContext.Provider>
  );
};

export const useStudentProfile = () => {
  const ctx = useContext(StudentProfileContext);
  if (!ctx) {
    throw new Error('useStudentProfile must be used within a StudentProfileProvider');
  }
  return ctx;
};
