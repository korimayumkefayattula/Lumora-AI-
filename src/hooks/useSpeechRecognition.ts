import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionHookOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition(options: SpeechRecognitionHookOptions = {}) {
  const {
    continuous = true,
    interimResults = true,
    lang = 'en-US',
    onResult,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef(false);

  // Check support
  const isSupported =
    typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignore if already stopped
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      const msg = 'Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.';
      setError(msg);
      if (onError) onError(msg);
      return;
    }

    setError(null);
    isManuallyStoppedRef.current = false;

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      // Clean up previous instance if any
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            currentFinal += text + ' ';
          } else {
            currentInterim += text;
          }
        }

        if (currentFinal) {
          setTranscript((prev) => {
            const updated = (prev ? prev + ' ' : '') + currentFinal.trim();
            if (onResult) onResult(updated, true);
            return updated;
          });
        }

        setInterimTranscript(currentInterim);
        if (currentInterim && onResult) {
          onResult(currentInterim, false);
        }
      };

      recognition.onerror = (event: any) => {
        let errMessage = 'Voice recognition error occurred.';
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          errMessage = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
        } else if (event.error === 'no-speech') {
          errMessage = 'No speech was detected. Please check your microphone and speak clearly.';
        } else if (event.error === 'network') {
          errMessage = 'Speech recognition network error. Please verify your internet connection.';
        } else if (event.error === 'aborted') {
          return;
        }

        setError(errMessage);
        if (onError) onError(errMessage);
        setIsListening(false);
      };

      recognition.onend = () => {
        // If not manually stopped and continuous mode is active, restart gracefully
        if (!isManuallyStoppedRef.current && continuous) {
          try {
            recognition.start();
            return;
          } catch {
            // failed to auto-restart
          }
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      const msg = err?.message || 'Could not access speech recognition service.';
      setError(msg);
      if (onError) onError(msg);
      setIsListening(false);
    }
  }, [continuous, interimResults, isSupported, lang, onError, onResult]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isManuallyStoppedRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  };
}
