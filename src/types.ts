/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'admin';
  classGrade?: string;
  board?: string;
  avatar?: string;
  studyStreak: number;
  points: number;
  completedLessons: number;
  subscription: 'Free' | 'Pro Lumora' | 'Enterprise';
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  targetHoursPerWeek: number;
  icon?: string;
  progressPercentage?: number;
  chaptersCount?: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  learningObjectives: string[];
  aiExplanation?: string;
  notes?: string;
  quizCount?: number;
  flashcardCount?: number;
}

export interface StudyTask {
  id: string;
  subjectId: string;
  title: string;
  durationMinutes: number;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  date: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  isAiGenerated?: boolean;
  notes?: string;
  category?: 'Exam Prep' | 'Assignment' | 'Research' | 'Reading' | 'Writing' | 'Coding' | 'Revision' | 'Other';
}

export interface FocusSession {
  id: string;
  subjectId?: string;
  label: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'Uploading' | 'Processing' | 'Ready' | 'Error';
  url?: string;
  folderId?: string;
  isBookmarked?: boolean;
  summary?: string;
  extractedConcepts?: string[];
  notes?: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  attachments?: { name: string; url?: string; type: string }[];
  sources?: { title: string; page?: number; snippet?: string }[];
  suggestedFollowups?: string[];
  liked?: boolean | null;
  saved?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface Flashcard {
  id: string;
  subject: string;
  chapter?: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isBookmarked?: boolean;
  lastReviewed?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'short' | 'long' | 'assertion_reason' | 'case_study';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface QuizAttempt {
  id: string;
  title: string;
  subject: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  timeTakenSeconds: number;
  weakTopics: string[];
  strongTopics: string[];
  date: string;
}

export interface MockTest {
  id: string;
  title: string;
  subject: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Exam Ready';
  questions: QuizQuestion[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'task' | 'exam' | 'quiz' | 'mock_test' | 'revision';
  isCompleted: boolean;
  subject?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  color?: string;
  children?: MindMapNode[];
}

export interface SummaryItem {
  id: string;
  title: string;
  type: 'Quick Summary' | 'Detailed Summary' | 'Exam Revision' | 'Key Points' | 'Formula Sheet';
  content: string;
  date: string;
  sourceDocName?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  content: string;
  headings: { title: string; body: string }[];
  date: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  category: 'score' | 'study_hours' | 'chapter' | 'exam_prep';
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  isCompleted: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'reminder' | 'exam' | 'test' | 'achievement' | 'goal';
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  subject: string;
  title: string;
  body: string;
  likes: number;
  userLiked?: boolean;
  replies: { author: string; text: string; date: string }[];
  isBookmarked?: boolean;
  date: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  points: number;
  streak: number;
  lessonsCompleted: number;
  avatar?: string;
  badge?: string;
}

