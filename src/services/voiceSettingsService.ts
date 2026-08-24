import { VoiceSettings } from '../types/voice';

const STORAGE_KEY = 'lumora_voice_settings';

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceName: '',
  speakingSpeed: 1.0,
  responseLength: 'balanced',
  language: 'en-US',
  autoListen: true,
  autoPlay: true,
  interruptAI: true,
  volume: 1.0,
};

export const getVoiceSettings = (): VoiceSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to parse voice settings', e);
  }
  return DEFAULT_VOICE_SETTINGS;
};

export const saveVoiceSettings = (settings: Partial<VoiceSettings>): VoiceSettings => {
  const current = getVoiceSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save voice settings', e);
  }
  return updated;
};
