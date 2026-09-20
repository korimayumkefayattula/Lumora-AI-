export type ThemeId = 'cosmic' | 'cyberpunk' | 'matcha' | 'retro-arcade' | 'bubblegum' | 'oxford';

export type FontId = 'sans' | 'display' | 'mono' | 'serif';

export type WebBlockType = 
  | 'hero' 
  | 'about' 
  | 'projects' 
  | 'interactive-gadgets' 
  | 'sticky-notes' 
  | 'quotes-trivia' 
  | 'ambient-player' 
  | 'faq' 
  | 'links-contact';

export interface ProjectCard {
  id: string;
  title: string;
  description: string;
  tag: string;
  icon: string; // emoji or icon key
  linkText?: string;
  linkUrl?: string;
  likes?: number;
}

export interface StickyNoteItem {
  id: string;
  text: string;
  author: string;
  color: 'yellow' | 'pink' | 'cyan' | 'green' | 'purple';
  rotation: number; // deg for playful sticky look
}

export interface TriviaItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon: string;
  bgColor?: string;
}

export interface WebBlock {
  id: string;
  type: WebBlockType;
  title: string;
  subtitle?: string;
  visible: boolean;
  
  // Type-specific content payloads
  heroData?: {
    headline: string;
    subheadline: string;
    badgeText: string;
    avatarEmoji: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
    enableFloatingStickers: boolean;
  };
  aboutData?: {
    bio: string;
    role: string;
    gradeOrSchool: string;
    favoriteSubject: string;
    superpower: string;
    funFact: string;
    skills: { name: string; level: number }[];
  };
  projectsData?: {
    cards: ProjectCard[];
  };
  gadgetsData?: {
    enableConfettiButton: boolean;
    confettiButtonText: string;
    enableClickerGame: boolean;
    clickerTargetLabel: string;
    clickerEmoji: string;
    enableSoundBleeps: boolean;
  };
  stickyNotesData?: {
    notes: StickyNoteItem[];
    allowVisitorAdd: boolean;
  };
  quotesTriviaData?: {
    triviaList: TriviaItem[];
  };
  ambientPlayerData?: {
    initialSound: 'rain' | 'lofi-crackle' | 'chiptune' | 'off';
    presetTitle: string;
  };
  faqData?: {
    items: FaqItem[];
  };
  linksData?: {
    items: LinkItem[];
    footerNotice: string;
  };
}

export interface StudentWebsiteConfig {
  id: string;
  siteTitle: string;
  tagline: string;
  studentHandle: string;
  theme: ThemeId;
  font: FontId;
  blocks: WebBlock[];
  createdDate: string;
  likesCount: number;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  emoji: string;
  bgClass: string;
  canvasBg: string;
  accentColor: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  subtextColor: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
}
