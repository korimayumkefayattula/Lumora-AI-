export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';

export type StudioViewMode = 'split' | 'preview' | 'code';

export type ActiveCodeTab = 'html' | 'css' | 'js' | 'combined';

export interface CodeProject {
  id: string;
  title: string;
  description: string;
  html: string;
  css: string;
  js: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface LovableChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedTweaks?: string[];
  codeSnapshot?: {
    html: string;
    css: string;
    js: string;
  };
}

export interface ConsoleLogMessage {
  id: string;
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export interface StarterAppTemplate {
  id: string;
  title: string;
  tagline: string;
  category: 'Science' | 'Games' | 'Productivity' | 'Portfolio' | 'Math';
  icon: string;
  badge: string;
  html: string;
  css: string;
  js: string;
  suggestedTweaks: string[];
}
