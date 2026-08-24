import { SupportedLanguage } from '../types/voice';

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface VoiceRecognitionCallbacks {
  onResult: (text: string, isFinal: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  onError: (error: string) => void;
  onEnd?: () => void;
}

export class VoiceRecognitionService {
  private recognition: any = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private volumeAnimFrame: number | null = null;
  private isListening = false;
  private language: SupportedLanguage = 'en-US';

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public static async checkMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt'> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return 'denied';
    }
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (status.state === 'granted' || status.state === 'denied') {
          return status.state;
        }
      }
    } catch (e) {
      // Permission API not supported for microphone in some browsers
    }
    return 'prompt';
  }

  public static async requestMicrophoneAccess(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Close stream immediately after checking permission
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (e) {
      return false;
    }
  }

  public setLanguage(lang: SupportedLanguage) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = this.getRecognitionLang(lang);
    }
  }

  private getRecognitionLang(lang: SupportedLanguage): string {
    switch (lang) {
      case 'hi-IN':
        return 'hi-IN';
      case 'bilingual':
        return 'hi-IN'; // SpeechRecognition parses Hindi/English when set to hi-IN or en-IN
      case 'en-US':
      default:
        return 'en-US';
    }
  }

  public async start(callbacks: VoiceRecognitionCallbacks, language: SupportedLanguage = 'en-US'): Promise<boolean> {
    this.stop(); // Ensure previous session clean
    this.language = language;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      callbacks.onError("Speech recognition is not supported on this browser. You can use text input instead.");
      return false;
    }

    try {
      // 1. Get media stream for live audio analysis (waveform/orb)
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            this.audioContext = new AudioCtx();
            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64;
            source.connect(this.analyser);

            this.monitorVolume((vol) => {
              callbacks.onVolumeChange?.(vol);
            });
          }
        } catch (e: any) {
          console.warn('Media stream microphone access note:', e?.name || e);
          if (e?.name === 'NotAllowedError' || e?.name === 'PermissionDeniedError') {
            callbacks.onError("Microphone access was denied. Please allow microphone access in your browser settings or use text mode.");
            this.stop();
            return false;
          } else if (e?.name === 'NotFoundError' || e?.name === 'DevicesNotFoundError') {
            callbacks.onError("No microphone hardware detected. You can type your questions using text mode below.");
            this.stop();
            return false;
          }
          // Continue without visual audio meter if AudioContext fails but SpeechRecognition works
        }
      }

      // 2. Instantiate Speech Recognition
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.getRecognitionLang(language);

      let finalTranscript = '';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const text = (finalTranscript + ' ' + interimTranscript).trim();
        const isFinal = event.results[event.results.length - 1]?.isFinal || false;
        callbacks.onResult(text, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'aborted') {
          // Ignore manual aborts when stopping recognition
          return;
        }

        let errorMsg = "Microphone error occurred.";
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errorMsg = "Microphone access was denied. Please allow microphone access in your browser settings or type your question below.";
        } else if (event.error === 'audio-capture') {
          errorMsg = "No audio capture device found. Please verify your microphone is connected, or type your question below.";
        } else if (event.error === 'no-speech') {
          errorMsg = "No speech was detected. Tap the microphone when you are ready to speak.";
        } else if (event.error === 'network') {
          errorMsg = "Network connection issue during speech recognition. You can try again or use text mode.";
        } else if (event.error) {
          errorMsg = `Speech recognition notice: ${event.error}. You can also type your questions below.`;
        }
        
        this.isListening = false;
        callbacks.onError(errorMsg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        callbacks.onEnd?.();
      };

      this.recognition.start();
      return true;

    } catch (err: any) {
      callbacks.onError(err.message || "Could not start speech recognition.");
      this.stop();
      return false;
    }
  }

  private monitorVolume(onVolume: (vol: number) => void) {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const update = () => {
      if (!this.analyser) return;
      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const normalizedVolume = Math.min(100, Math.round((average / 128) * 100));
      onVolume(normalizedVolume);
      this.volumeAnimFrame = requestAnimationFrame(update);
    };

    update();
  }

  public stop() {
    this.isListening = false;
    if (this.volumeAnimFrame !== null) {
      cancelAnimationFrame(this.volumeAnimFrame);
      this.volumeAnimFrame = null;
    }
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
    this.analyser = null;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}
