export type WidgetId =
  | 'stats'
  | 'focus_timer'
  | 'soundscapes'
  | 'streak_energy'
  | 'daily_brain_boost'
  | 'spaced_repetition'
  | 'exam_countdown'
  | 'homework_scanner'
  | 'wellness'
  | 'live_study_room'
  | 'quick_scratchpad'
  | 'task_tracker'
  | 'smart_calendar';

export type WidgetSize = 'sm' | 'md' | 'lg' | 'full';

export interface WidgetConfig {
  id: WidgetId;
  title: string;
  category: 'Core Study' | 'AI & Learning' | 'Productivity' | 'Wellness & Social';
  description: string;
  iconName: string;
  defaultSize: WidgetSize;
  enabled: boolean;
  order: number;
}

export interface ExamItem {
  id: string;
  subject: string;
  date: string;
  targetScore: string;
  readinessScore: number;
}

export interface SoundTrack {
  id: string;
  name: string;
  icon: string;
  type: 'synth' | 'audio';
  frequency?: number;
  noiseType?: 'white' | 'pink' | 'brown';
}

export interface FlashcardItem {
  id: string;
  subject: string;
  question: string;
  answer: string;
  dueIn: string;
  masteryLevel: number;
}

export interface PeerStudent {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  sessionMinutes: number;
  status: 'focusing' | 'break' | 'reviewing';
}
