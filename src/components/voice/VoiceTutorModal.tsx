import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, Volume2, VolumeX, Pause, Play, Square, Settings as SettingsIcon, 
  Send, RotateCcw, Edit3, MessageSquare, AlertCircle, Sparkles, Languages, Check, 
  Globe, BookOpen, Clock, RefreshCw, ChevronRight, History, HelpCircle, Lightbulb
} from 'lucide-react';
import { VoiceState, VoiceSettings, VoiceMessage, VoiceSession, SupportedLanguage } from '../../types/voice';
import { VoiceOrb } from './VoiceOrb';
import { GoogleAssistantWave } from './GoogleAssistantWave';
import { VoiceSettingsModal } from './VoiceSettingsModal';
import { VoiceSessionSummaryModal } from './VoiceSessionSummaryModal';
import { getVoiceSettings, saveVoiceSettings } from '../../services/voiceSettingsService';
import { VoiceRecognitionService } from '../../services/voiceRecognitionService';
import { TextToSpeechService } from '../../services/textToSpeechService';
import { AITutorService } from '../../services/aiTutorService';
import { VoiceSessionService } from '../../services/voiceSessionService';
import LumoraLogo from '../LumoraLogo';
import ReactMarkdown from 'react-markdown';

interface VoiceTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectContext?: string;
  documentContext?: string;
}

const GOOGLE_SUGGESTION_CHIPS = [
  "Explain in simple terms",
  "Give a real-world example",
  "What is the key formula?",
  "Quiz me on this concept",
  "Explain in Hindi / Hinglish",
  "What are common exam mistakes?"
];

export const VoiceTutorModal: React.FC<VoiceTutorModalProps> = ({
  isOpen,
  onClose,
  subjectContext,
  documentContext,
}) => {
  // State variables
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [settings, setSettings] = useState<VoiceSettings>(getVoiceSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Transcript and messages
  const [liveTranscript, setLiveTranscript] = useState('');
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [manualEditText, setManualEditText] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);

  // Audio output state
  const [isMuted, setIsMuted] = useState(false);
  const [textInputFallback, setTextInputFallback] = useState('');

  // Error handling
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  // Active Session Tracking
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => Date.now().toString());
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [summarySession, setSummarySession] = useState<VoiceSession | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [pastSessions, setPastSessions] = useState<VoiceSession[]>([]);
  const [showHistoryTab, setShowHistoryTab] = useState(false);

  // Service instances refs
  const recognitionRef = useRef<VoiceRecognitionService | null>(null);
  const ttsRef = useRef<TextToSpeechService | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      recognitionRef.current = new VoiceRecognitionService();
      ttsRef.current = new TextToSpeechService();
      setSettings(getVoiceSettings());
      setPastSessions(VoiceSessionService.getAllSessions());
      setSessionStartTime(Date.now());
      setCurrentSessionId(Date.now().toString());

      // Initial greeting message in Google Assistant style
      const greeting = settings.language === 'hi-IN'
        ? "नमस्ते! मैं लुमोरा गूगल-स्टाइल एआई असिस्टेंट हूँ। आज आप क्या समझना चाहते हैं?"
        : settings.language === 'bilingual'
        ? "Hi! Main aapka Lumora Voice Assistant hoon. Aap mujhse koi bhi academic question pooch sakte hain."
        : "Hi, I'm your Lumora AI Assistant. How can I help with your studies today?";

      const initMsg: VoiceMessage = {
        id: 'init-' + Date.now(),
        sender: 'ai',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initMsg]);

      // Speak greeting if audio enabled
      if (settings.autoPlay && !isMuted) {
        speakAIAnswer(greeting, true);
      } else {
        handleStartListening();
      }
    } else {
      cleanupSession();
    }
  }, [isOpen]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveTranscript]);

  const cleanupSession = () => {
    recognitionRef.current?.stop();
    ttsRef.current?.stop();
    setVoiceState('idle');
  };

  const speakAIAnswer = (text: string, triggerAutoListenAfter = true) => {
    if (!ttsRef.current) return;
    setVoiceState('speaking');

    ttsRef.current.speak(text, settings, {
      onStart: () => {
        setVoiceState('speaking');
      },
      onSentence: (idx) => {
        setActiveSentenceIndex(idx);
      },
      onEnd: () => {
        setVoiceState('idle');
        setActiveSentenceIndex(null);
        // Auto-listen loop like Google Assistant
        if (triggerAutoListenAfter && settings.autoListen) {
          setTimeout(() => {
            handleStartListening();
          }, 500);
        }
      },
      onError: (err) => {
        console.warn('TTS error:', err);
        setVoiceState('idle');
        setActiveSentenceIndex(null);
      }
    });
  };

  const handleStartListening = async () => {
    if (voiceState === 'speaking' && settings.interruptAI) {
      ttsRef.current?.stop();
    }

    setErrorMessage(null);
    setLiveTranscript('');
    setVoiceState('listening');

    if (!recognitionRef.current) {
      recognitionRef.current = new VoiceRecognitionService();
    }

    const success = await recognitionRef.current.start(
      {
        onResult: (text, isFinal) => {
          setLiveTranscript(text);
          if (isFinal && settings.autoListen) {
            handleStopListeningAndSubmit(text);
          }
        },
        onVolumeChange: (vol) => {
          setVolumeLevel(vol);
        },
        onError: (err) => {
          console.warn('Speech recognition note:', err);
          if (err.includes('No speech was detected')) {
            setVoiceState('idle');
            return;
          }
          setVoiceState('error');
          if (err.includes('denied') || err.includes('permission') || err.includes('hardware')) {
            setMicPermissionDenied(true);
            setErrorMessage("Microphone input is unavailable in this browser environment. You can type your questions directly into the input bar below!");
          } else {
            setErrorMessage(err);
          }
        },
        onEnd: () => {
          if (voiceState === 'listening') {
            // Auto submit if transcript available
            if (liveTranscript.trim()) {
              handleStopListeningAndSubmit();
            } else {
              setVoiceState('idle');
            }
          }
        },
      },
      settings.language
    );

    if (!success && !micPermissionDenied) {
      setVoiceState('error');
    }
  };

  const handleStopListeningAndSubmit = async (overrideText?: string) => {
    recognitionRef.current?.stop();
    const query = (overrideText || liveTranscript || manualEditText).trim();
    if (!query) {
      setVoiceState('idle');
      return;
    }

    setLiveTranscript('');
    setIsEditingTranscript(false);

    // Append user message
    const userMsg: VoiceMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setVoiceState('processing');

    try {
      const response = await AITutorService.askQuestion({
        question: query,
        history: updatedMessages,
        language: settings.language,
        responseLength: settings.responseLength,
        subjectContext,
        documentContext,
      });

      const aiMsg: VoiceMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: response.suggestedFollowups,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Speak AI Answer aloud
      if (!isMuted && settings.autoPlay) {
        speakAIAnswer(response.answer, true);
      } else {
        setVoiceState('idle');
      }

    } catch (err: any) {
      setVoiceState('error');
      setErrorMessage(err.message || 'Failed to connect to Lumora AI.');
    }
  };

  const handleTextFallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInputFallback.trim()) return;
    const txt = textInputFallback;
    setTextInputFallback('');
    handleStopListeningAndSubmit(txt);
  };

  const handleInterruptAI = () => {
    ttsRef.current?.stop();
    setVoiceState('idle');
    handleStartListening();
  };

  const handlePauseResume = () => {
    if (voiceState === 'speaking') {
      if (ttsRef.current?.getIsPaused()) {
        ttsRef.current.resume();
        setVoiceState('speaking');
      } else {
        ttsRef.current?.pause();
        setVoiceState('paused');
      }
    }
  };

  const handleEndConversation = () => {
    cleanupSession();
    const durationSeconds = Math.max(5, Math.round((Date.now() - sessionStartTime) / 1000));
    const userQuestions = messages.filter((m) => m.sender === 'user');

    const sessionRecord: VoiceSession = {
      id: currentSessionId,
      title: userQuestions[0]?.text.slice(0, 40) || 'Voice Study Session',
      createdAt: new Date().toISOString(),
      durationSeconds,
      questionsCount: userQuestions.length,
      topics: VoiceSessionService.extractTopics(messages),
      language: settings.language,
      messages,
      contextSubject: subjectContext,
      contextDocumentName: documentContext,
    };

    VoiceSessionService.saveSession(sessionRecord);
    setSummarySession(sessionRecord);
    setIsSummaryOpen(true);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    const updated = saveVoiceSettings({ language: lang });
    setSettings(updated);
    recognitionRef.current?.setLanguage(lang);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
        
        {/* Google Assistant Container Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl h-[92vh] flex flex-col overflow-hidden text-slate-100 relative">
          
          {/* Google 4-Color Glowing Header Bar */}
          <div className="h-1.5 w-full grid grid-cols-4 shrink-0">
            <div className="bg-[#4285F4] shadow-sm shadow-[#4285F4]" />
            <div className="bg-[#EA4335] shadow-sm shadow-[#EA4335]" />
            <div className="bg-[#FBBC05] shadow-sm shadow-[#FBBC05]" />
            <div className="bg-[#34A853] shadow-sm shadow-[#34A853]" />
          </div>

          {/* Header Bar */}
          <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05] animate-pulse" style={{ animationDelay: '300ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse" style={{ animationDelay: '450ms' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight font-display">
                    Google Assistant Voice Tutor
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Powered by Gemini 2.5 Voice Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector Pill */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                {[
                  { id: 'en-US', label: 'English' },
                  { id: 'hi-IN', label: 'Hindi' },
                  { id: 'bilingual', label: 'Hinglish' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleLanguageChange(l.id as SupportedLanguage)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                      settings.language === l.id ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowHistoryTab(!showHistoryTab)}
                className={`p-2 rounded-xl border transition-colors ${
                  showHistoryTab ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Voice History"
              >
                <History className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-colors"
                title="Voice Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

            {/* Left Orb Visualizer & Controls Panel */}
            <div className="md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center justify-between shrink-0">
              
              {/* Status Header Indicator */}
              <div className="text-center space-y-1">
                <GoogleAssistantWave 
                  state={voiceState} 
                  volume={volumeLevel} 
                  onClick={voiceState === 'idle' ? handleStartListening : voiceState === 'speaking' ? handleInterruptAI : undefined} 
                />

                {subjectContext && (
                  <p className="text-[10px] text-blue-400 font-semibold truncate max-w-[220px]">
                    Focus: {subjectContext}
                  </p>
                )}
              </div>

              {/* Center Voice Orb with Google Palette */}
              <div className="my-4">
                <VoiceOrb 
                  state={voiceState} 
                  volume={volumeLevel} 
                  onClick={voiceState === 'idle' ? handleStartListening : voiceState === 'speaking' ? handleInterruptAI : undefined}
                />
              </div>

              {/* Action Buttons Bar */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-center gap-3">
                  
                  {/* Interrupt / Mic Trigger */}
                  <button
                    onClick={voiceState === 'speaking' ? handleInterruptAI : voiceState === 'listening' ? () => handleStopListeningAndSubmit() : handleStartListening}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold shadow-lg transition-all ${
                      voiceState === 'listening' 
                        ? 'bg-[#4285F4] text-white shadow-[#4285F4]/40 scale-105 animate-pulse' 
                        : voiceState === 'speaking'
                        ? 'bg-[#FBBC05] text-slate-950 shadow-[#FBBC05]/40 hover:scale-105'
                        : 'bg-gradient-to-tr from-[#4285F4] to-[#34A853] text-white shadow-blue-600/30 hover:scale-105'
                    }`}
                    title={voiceState === 'speaking' ? "Tap to Interrupt" : voiceState === 'listening' ? "Tap to Stop & Send" : "Tap to Speak"}
                  >
                    {voiceState === 'listening' ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-6 h-6" />}
                  </button>

                  {/* Pause / Resume */}
                  {voiceState === 'speaking' && (
                    <button
                      onClick={handlePauseResume}
                      className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors"
                      title={ttsRef.current?.getIsPaused() ? "Resume Speech" : "Pause Speech"}
                    >
                      {ttsRef.current?.getIsPaused() ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    </button>
                  )}

                  {/* Speaker Mute Toggle */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors ${
                      isMuted 
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                    }`}
                    title={isMuted ? "Unmute Voice" : "Mute Voice"}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-2 border-t border-slate-800/80">
                  <span>Speed: {settings.speakingSpeed}x</span>
                  <button 
                    onClick={handleEndConversation}
                    className="text-rose-400 hover:underline font-bold"
                  >
                    End Session
                  </button>
                </div>
              </div>

            </div>

            {/* Right Dialogue Stream & Live Speech Transcript */}
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-950/40">
              
              {/* Message Transcript Timeline */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
                
                {/* Past Sessions Drawer if open */}
                {showHistoryTab && (
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-4 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-xs text-slate-300 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-blue-400" />
                        <span>Past Voice Tutor Sessions</span>
                      </h4>
                      <button onClick={() => setShowHistoryTab(false)} className="text-slate-400 hover:text-white text-xs">
                        Close
                      </button>
                    </div>
                    {pastSessions.length === 0 ? (
                      <p className="text-xs text-slate-500 py-2">No past sessions found.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {pastSessions.slice(0, 5).map((s) => (
                          <div key={s.id} className="p-2 bg-slate-800/60 rounded-xl text-xs flex items-center justify-between">
                            <span className="font-medium text-slate-200 truncate max-w-[200px]">{s.title}</span>
                            <span className="text-[10px] text-slate-400">{Math.round(s.durationSeconds / 60)}m</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div 
                    key={msg.id || i}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === 'user' 
                        ? 'bg-[#4285F4] text-white' 
                        : 'bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#34A853] text-white'
                    }`}>
                      {msg.sender === 'user' ? 'You' : 'G'}
                    </div>

                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#4285F4] text-white rounded-tr-xs shadow-md'
                        : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-xs shadow-md space-y-2'
                    }`}>
                      {msg.sender === 'user' ? (
                        <p>{msg.text}</p>
                      ) : (
                        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      )}

                      {/* Suggested Quick Follow-ups */}
                      {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                        <div className="pt-2 border-t border-slate-700/60 flex flex-wrap gap-1.5 mt-2">
                          {msg.suggestedFollowups.map((f, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleStopListeningAndSubmit(f)}
                              className="px-2.5 py-1 bg-slate-700/70 hover:bg-[#4285F4] hover:text-white text-[11px] font-semibold text-slate-300 rounded-full border border-slate-600 transition-colors text-left"
                            >
                              💡 {f}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Live Real-time Listening Transcript */}
                {liveTranscript && (
                  <div className="flex gap-3 flex-row-reverse animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-[#4285F4] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      You
                    </div>
                    <div className="bg-[#4285F4]/80 text-white rounded-2xl rounded-tr-xs p-4 text-xs sm:text-sm max-w-[85%] shadow-md border border-[#4285F4]">
                      <p>{liveTranscript}</p>
                      <span className="text-[10px] opacity-75 mt-1 block">Transcribing in real-time...</span>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-2xl text-xs text-red-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <div className="flex-1">
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div ref={transcriptEndRef} />
              </div>

              {/* Bottom Google Suggestion Pills & Input Area */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-3 shrink-0">
                
                {/* Google Assistant Suggestion Chips Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar no-scrollbar">
                  {GOOGLE_SUGGESTION_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleStopListeningAndSubmit(chip)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full text-xs font-medium border border-slate-700 whitespace-nowrap transition-colors shrink-0"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Fallback Text Input */}
                <form onSubmit={handleTextFallbackSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={textInputFallback}
                    onChange={(e) => setTextInputFallback(e.target.value)}
                    placeholder="Type a message or tap mic to speak..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 outline-none focus:border-[#4285F4] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!textInputFallback.trim()}
                    className="bg-[#4285F4] hover:bg-blue-600 disabled:opacity-40 text-white p-2.5 rounded-2xl transition-all shadow-md shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>

            </div>

          </div>

          {/* Bottom Glowing Google Assistant Light Bar Edge */}
          <div className="h-1 w-full grid grid-cols-4 shrink-0">
            <div className="bg-[#4285F4]" />
            <div className="bg-[#EA4335]" />
            <div className="bg-[#FBBC05]" />
            <div className="bg-[#34A853]" />
          </div>

        </div>

      </div>

      {/* Settings Modal */}
      <VoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          recognitionRef.current?.setLanguage(newSettings.language);
        }}
      />

      {/* Session Summary Modal */}
      {summarySession && (
        <VoiceSessionSummaryModal
          isOpen={isSummaryOpen}
          onClose={() => {
            setIsSummaryOpen(false);
            onClose();
          }}
          session={summarySession}
        />
      )}
    </>
  );
};
