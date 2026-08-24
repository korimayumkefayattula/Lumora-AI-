export type VoiceState = 
  | 'idle' 
  | 'listening' 
  | 'processing' 
  | 'speaking' 
  | 'paused' 
  | 'error';

export type SupportedLanguage = 'en-US' | 'hi-IN' | 'bilingual';

export interface VoiceSettings {
  voiceName: string;
  speakingSpeed: number; // 0.75 - 1.5
  responseLength: 'concise' | 'balanced' | 'detailed';
  language: SupportedLanguage;
  autoListen: boolean; // Hands-free mode
  autoPlay: boolean;
  interruptAI: boolean;
  volume: number; // 0.0 - 1.0
}

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isFinal?: boolean;
  suggestedFollowups?: string[];
  activeSentenceIndex?: number;
}

export interface VoiceSession {
  id: string;
  title: string;
  createdAt: string;
  endedAt?: string;
  durationSeconds: number;
  questionsCount: number;
  topics: string[];
  language: SupportedLanguage;
  messages: VoiceMessage[];
  contextSubject?: string;
  contextDocumentName?: string;
}

export interface MicPermissionState {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
  error?: string;
}
