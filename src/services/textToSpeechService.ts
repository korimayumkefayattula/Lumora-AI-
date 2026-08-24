import { VoiceSettings } from '../types/voice';

export interface TTSCallbacks {
  onStart?: () => void;
  onSentence?: (sentenceIndex: number, sentenceText: string) => void;
  onEnd?: () => void;
  onError?: (err: string) => void;
}

export class TextToSpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isSpeakingState = false;
  private isPausedState = false;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices();
  }

  public speak(
    text: string, 
    settings: VoiceSettings, 
    callbacks?: TTSCallbacks
  ): void {
    this.stop(); // Stop any ongoing speech immediately

    if (!text || !text.trim()) {
      callbacks?.onEnd?.();
      return;
    }

    // Clean text of Markdown symbols for natural speech
    const cleanText = text
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/`{1,3}.*?`{1,3}/g, '')
      .replace(/#+\s+/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[-*]\s+/g, '')
      .trim();

    // Split text into sentences for sentence-level highlighting
    const sentences = cleanText
      .split(/(?<=[.?!])\s+/)
      .filter((s) => s.trim().length > 0);

    if (sentences.length === 0) {
      callbacks?.onEnd?.();
      return;
    }

    if (!TextToSpeechService.isSupported()) {
      // Fallback to server Gemini TTS if window.speechSynthesis is missing
      this.speakViaServerTTS(cleanText, settings, callbacks);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Clear queue

      this.isSpeakingState = true;
      this.isPausedState = false;
      callbacks?.onStart?.();

      let currentSentenceIdx = 0;

      const speakSentence = (idx: number) => {
        if (idx >= sentences.length || !this.isSpeakingState) {
          this.isSpeakingState = false;
          callbacks?.onEnd?.();
          return;
        }

        currentSentenceIdx = idx;
        const sentence = sentences[idx];
        callbacks?.onSentence?.(idx, sentence);

        const utterance = new SpeechSynthesisUtterance(sentence);
        this.currentUtterance = utterance;

        utterance.rate = settings.speakingSpeed || 1.0;
        utterance.volume = settings.volume ?? 1.0;

        // Select voice
        const voices = window.speechSynthesis.getVoices();
        if (settings.voiceName) {
          const match = voices.find((v) => v.name === settings.voiceName);
          if (match) utterance.voice = match;
        } else {
          // Default voice selection based on language
          const targetLang = settings.language === 'hi-IN' || settings.language === 'bilingual' ? 'hi' : 'en';
          const match = voices.find((v) => v.lang.toLowerCase().startsWith(targetLang));
          if (match) utterance.voice = match;
        }

        utterance.onend = () => {
          if (this.isSpeakingState) {
            speakSentence(idx + 1);
          }
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          if (this.isSpeakingState) {
            speakSentence(idx + 1);
          }
        };

        window.speechSynthesis.speak(utterance);
      };

      speakSentence(0);

    } catch (e: any) {
      console.error('SpeechSynthesis failed, trying server TTS fallback:', e);
      this.speakViaServerTTS(cleanText, settings, callbacks);
    }
  }

  private async speakViaServerTTS(
    text: string, 
    settings: VoiceSettings, 
    callbacks?: TTSCallbacks
  ) {
    try {
      this.isSpeakingState = true;
      callbacks?.onStart?.();

      const res = await fetch('/api/voice-tutor/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName: settings.voiceName || 'Zephyr',
        }),
      });

      if (!res.ok) {
        throw new Error('Server TTS failed');
      }

      const data = await res.json();
      if (data.audioBase64) {
        const audioSrc = `data:audio/wav;base64,${data.audioBase64}`;
        this.currentAudioElement = new Audio(audioSrc);
        this.currentAudioElement.volume = settings.volume ?? 1.0;

        this.currentAudioElement.onended = () => {
          this.isSpeakingState = false;
          callbacks?.onEnd?.();
        };

        this.currentAudioElement.onerror = () => {
          this.isSpeakingState = false;
          callbacks?.onError?.("Failed to play voice response.");
        };

        await this.currentAudioElement.play();
      } else {
        throw new Error('No audio returned');
      }
    } catch (err: any) {
      this.isSpeakingState = false;
      callbacks?.onError?.("Speech synthesis is unavailable.");
    }
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.isPausedState = true;
    }
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.isPausedState = true;
    }
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPausedState = false;
    }
    if (this.currentAudioElement) {
      this.currentAudioElement.play();
      this.isPausedState = false;
    }
  }

  public stop(): void {
    this.isSpeakingState = false;
    this.isPausedState = false;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    this.currentUtterance = null;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public getIsPaused(): boolean {
    return this.isPausedState;
  }
}
