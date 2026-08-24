import { VoiceSession, VoiceMessage, SupportedLanguage } from '../types/voice';

const SESSIONS_STORAGE_KEY = 'lumora_voice_sessions';
const STATS_STORAGE_KEY = 'lumora_voice_stats';

export interface VoiceStats {
  totalSessions: number;
  totalDurationSeconds: number;
  totalQuestions: number;
  lastSessionDate: string;
}

export class VoiceSessionService {
  public static getAllSessions(): VoiceSession[] {
    try {
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load voice sessions', e);
      return [];
    }
  }

  public static saveSession(session: VoiceSession): void {
    try {
      const sessions = this.getAllSessions();
      const existingIdx = sessions.findIndex((s) => s.id === session.id);
      if (existingIdx >= 0) {
        sessions[existingIdx] = session;
      } else {
        sessions.unshift(session);
      }
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));

      // Update analytics
      this.updateStats(session);
    } catch (e) {
      console.error('Failed to save voice session', e);
    }
  }

  public static getStats(): VoiceStats {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Compute from existing sessions
    const sessions = this.getAllSessions();
    const stats: VoiceStats = {
      totalSessions: sessions.length,
      totalDurationSeconds: sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0),
      totalQuestions: sessions.reduce((acc, s) => acc + (s.questionsCount || 0), 0),
      lastSessionDate: sessions[0]?.createdAt || new Date().toISOString(),
    };
    return stats;
  }

  private static updateStats(session: VoiceSession): void {
    const stats = this.getStats();
    stats.totalSessions += 1;
    stats.totalDurationSeconds += session.durationSeconds || 0;
    stats.totalQuestions += session.questionsCount || 0;
    stats.lastSessionDate = new Date().toISOString();
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {}
  }

  public static extractTopics(messages: VoiceMessage[]): string[] {
    const userMsgs = messages.filter((m) => m.sender === 'user').map((m) => m.text);
    const keywords = ['physics', 'chemistry', 'math', 'biology', 'formula', 'photosynthesis', 'equation', 'newton', 'calculus', 'history', 'reaction', 'organic'];
    const found: string[] = [];
    userMsgs.forEach((msg) => {
      keywords.forEach((kw) => {
        if (msg.toLowerCase().includes(kw) && !found.includes(kw)) {
          found.push(kw.charAt(0).toUpperCase() + kw.slice(1));
        }
      });
    });
    return found.length > 0 ? found : ['General Study Doubts'];
  }
}
