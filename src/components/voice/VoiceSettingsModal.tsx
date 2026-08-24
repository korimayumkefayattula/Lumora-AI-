import React, { useState, useEffect } from 'react';
import { X, Volume2, Globe, Sliders, Play, Check, Sparkles, Mic } from 'lucide-react';
import { VoiceSettings, SupportedLanguage } from '../../types/voice';
import { TextToSpeechService } from '../../services/textToSpeechService';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onSave: (newSettings: VoiceSettings) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [form, setForm] = useState<VoiceSettings>(settings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  useEffect(() => {
    const loadVoices = () => {
      const avail = TextToSpeechService.getAvailableVoices();
      setVoices(avail);
    };
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  if (!isOpen) return null;

  const handleTestPreview = () => {
    setIsPlayingPreview(true);
    const sampleText = form.language === 'hi-IN' 
      ? 'नमस्ते! मैं लुमोरा एआई वॉयस ट्यूटर हूँ। आपकी पढ़ाई में मदद के लिए हमेशा तैयार हूँ।'
      : form.language === 'bilingual'
      ? 'Hi! Main Lumora AI Voice Tutor hoon. Aapki study prep and concepts easy banane ke liye ready hoon!'
      : "Hi there! I'm Lumora, your personal AI study mentor. Let's learn together today.";

    const tts = new TextToSpeechService();
    tts.speak(sampleText, form, {
      onEnd: () => setIsPlayingPreview(false),
      onError: () => setIsPlayingPreview(false),
    });
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Voice Tutor Settings</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Customize speech, language & interaction</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs">
          
          {/* Language Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Preferred Language</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'en-US', label: 'English', desc: 'Standard English' },
                { id: 'hi-IN', label: 'Hindi (हिंदी)', desc: 'Pure Hindi' },
                { id: 'bilingual', label: 'Bilingual (Hinglish)', desc: 'Hindi + English' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setForm({ ...form, language: lang.id as SupportedLanguage })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    form.language === lang.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-400'
                  }`}
                >
                  <p className="font-bold">{lang.label}</p>
                  <p className={`text-[10px] ${form.language === lang.id ? 'text-blue-100' : 'text-slate-400'}`}>{lang.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Response Length */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Response Length</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'concise', label: 'Concise', sub: '1-2 quick sentences' },
                { id: 'balanced', label: 'Balanced', sub: '3-4 sentences' },
                { id: 'detailed', label: 'Detailed', sub: 'In-depth + example' },
              ].map((len) => (
                <button
                  key={len.id}
                  type="button"
                  onClick={() => setForm({ ...form, responseLength: len.id as any })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    form.responseLength === len.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <p className="font-bold">{len.label}</p>
                  <p className={`text-[9px] ${form.responseLength === len.id ? 'text-indigo-100' : 'text-slate-400'}`}>{len.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Speaking Speed */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 dark:text-slate-300">Speaking Speed</label>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{form.speakingSpeed}x</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setForm({ ...form, speakingSpeed: speed })}
                  className={`py-2 rounded-xl border font-bold transition-all ${
                    form.speakingSpeed === speed
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Voice Accent / System Voice Selection */}
          {voices.length > 0 && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">System Voice Accent</label>
              <select
                value={form.voiceName}
                onChange={(e) => setForm({ ...form, voiceName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl font-medium text-slate-800 dark:text-slate-100"
              >
                <option value="">Auto-Select Best Voice</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            {/* Auto Listen */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-200/80 dark:border-slate-600/80">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Auto-Listen Mode (Hands-Free)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Automatically start listening after AI finishes answering</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, autoListen: !form.autoListen })}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  form.autoListen ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${form.autoListen ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Interrupt AI */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-200/80 dark:border-slate-600/80">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Interrupt AI Speech</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Instantly stop AI answer when you tap or speak</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, interruptAI: !form.interruptAI })}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  form.interruptAI ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${form.interruptAI ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Test Preview Button */}
          <button
            type="button"
            onClick={handleTestPreview}
            disabled={isPlayingPreview}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Play className={`w-4 h-4 text-blue-600 ${isPlayingPreview ? 'animate-spin' : ''}`} />
            <span>{isPlayingPreview ? 'Playing Preview...' : 'Play Voice Preview'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-3 bg-slate-50/50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-2xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
};
