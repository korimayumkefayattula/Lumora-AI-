import React, { useState, useEffect } from 'react';
import { Headphones, Play, Pause, Volume2, VolumeX, Radio, Sparkles, CloudRain, Waves, Wind } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { soundEngine } from '../../utils/audioSynthesizer';
import { useTheme } from '../../context/ThemeContext';

export const SoundscapesFocusWidget: React.FC = () => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('binaural_alpha');
  const [volume, setVolume] = useState(0.35);

  const tracks = [
    { id: 'binaural_alpha', name: 'Alpha Focus (10Hz)', type: 'Binaural', icon: Sparkles, color: 'text-indigo-400' },
    { id: 'binaural_gamma', name: 'Gamma Deep (40Hz)', type: 'High Intensity', icon: Radio, color: 'text-emerald-400' },
    { id: 'rain_sound', name: 'Rain on Window', type: 'Ambient', icon: CloudRain, color: 'text-sky-400' },
    { id: 'brown_noise', name: 'Deep Brown Noise', type: 'Masking', icon: Waves, color: 'text-amber-400' },
    { id: 'pink_noise', name: 'Pink Noise Flow', type: 'Calm', icon: Wind, color: 'text-purple-400' },
    { id: 'zen_drone', name: 'Zen 108Hz Drone', type: 'Meditation', icon: Sparkles, color: 'text-rose-400' },
  ];

  const handleTogglePlay = (trackId?: string) => {
    const selected = trackId || currentTrack;
    if (isPlaying && (!trackId || trackId === currentTrack)) {
      soundEngine.stop();
      setIsPlaying(false);
    } else {
      soundEngine.setVolume(volume);
      soundEngine.playTrack(selected);
      setCurrentTrack(selected);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundEngine.setVolume(newVol);
  };

  useEffect(() => {
    return () => {
      soundEngine.stop();
    };
  }, []);

  return (
    <WidgetContainer
      id="widget-soundscapes"
      title="Binaural Beats & Soundscapes"
      subtitle="Synthesized neuro-acoustics for flow state"
      icon={Headphones}
      badge={isPlaying ? 'Live Audio Active' : 'Synthesizer Ready'}
      badgeColor={isPlaying ? 'bg-emerald-500/20 text-emerald-500 font-bold animate-pulse' : undefined}
    >
      <div className="space-y-4">
        {/* Active Track Banner - Glassmorphic Frosted Player Deck */}
        <div className={`p-4 rounded-3xl glass-panel flex items-center justify-between transition-all ${
          theme === 'focus'
            ? 'border-amber-500/30'
            : isPlaying
            ? 'border-rose-500/40 shadow-[0_8px_30px_rgba(244,63,94,0.15)]'
            : 'border-white/30 dark:border-white/10'
        }`}>
          <div className="flex items-center gap-3.5">
            {/* 3D Clay Play/Pause Button */}
            <button
              onClick={() => handleTogglePlay()}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center clay-btn shrink-0 ${
                isPlaying
                  ? 'bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-[0_10px_20px_rgba(244,63,94,0.4)]'
                  : 'bg-gradient-to-b from-indigo-500 to-indigo-700 theme-focus:from-amber-400 theme-focus:to-amber-600 text-white'
              }`}
              aria-label={isPlaying ? 'Pause sound' : 'Play sound'}
            >
              {isPlaying ? <Pause className="w-5 h-5 drop-shadow-xs" /> : <Play className="w-5 h-5 fill-current ml-0.5 drop-shadow-xs" />}
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 dark:text-rose-400 theme-focus:text-amber-300/80 block">
                {isPlaying ? 'Streaming Acoustic Field' : 'Selected Acoustic Preset'}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white theme-focus:text-amber-100">
                {tracks.find((t) => t.id === currentTrack)?.name}
              </h4>
            </div>
          </div>

          {/* Sound waves animation in sunken neuromorphic slit */}
          {isPlaying && (
            <div className="flex items-end gap-1.5 h-7 px-3 py-1 neuro-inset rounded-xl bg-black/10 dark:bg-black/30">
              <div className="w-1.5 bg-rose-500 theme-focus:bg-amber-400 rounded-full animate-pulse h-4 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
              <div className="w-1.5 bg-rose-400 theme-focus:bg-amber-300 rounded-full animate-pulse h-6 shadow-[0_0_6px_rgba(244,63,94,0.6)]" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 bg-rose-500 theme-focus:bg-amber-400 rounded-full animate-pulse h-3 shadow-[0_0_6px_rgba(244,63,94,0.6)]" style={{ animationDelay: '300ms' }} />
              <div className="w-1.5 bg-rose-300 theme-focus:bg-amber-200 rounded-full animate-pulse h-5 shadow-[0_0_6px_rgba(244,63,94,0.6)]" style={{ animationDelay: '450ms' }} />
            </div>
          )}
        </div>

        {/* Sound Selection Grid - Neuromorphic Tactile Switches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {tracks.map((track) => {
            const Icon = track.icon;
            const isCurrent = currentTrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleTogglePlay(track.id)}
                className={`p-3 rounded-2xl text-left flex flex-col justify-between transition-all ${
                  isCurrent && isPlaying
                    ? 'clay-btn bg-gradient-to-br from-rose-500 to-rose-700 text-white border border-rose-400/40 shadow-[0_8px_16px_rgba(244,63,94,0.3)]'
                    : isCurrent
                    ? 'neuro-inset border border-indigo-400/40 dark:border-rose-500/40 bg-indigo-50/40 dark:bg-rose-950/20 text-indigo-950 dark:text-rose-200'
                    : 'neuro-btn-convex text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/40 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                    isCurrent && isPlaying ? 'bg-white/20 text-white' : 'clay-icon-box bg-white/60 dark:bg-slate-700/60'
                  }`}>
                    <Icon className={`w-3.5 h-3.5 ${isCurrent && isPlaying ? 'text-white' : track.color}`} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                    isCurrent && isPlaying ? 'bg-black/20 text-white' : 'text-slate-400 dark:text-slate-500 theme-focus:text-amber-300/50'
                  }`}>
                    {track.type}
                  </span>
                </div>
                <span className="text-[11px] font-extrabold truncate">{track.name}</span>
              </button>
            );
          })}
        </div>

        {/* Volume Slider in Sunken Neuromorphic Channel */}
        <div className="flex items-center gap-3 pt-1 px-1">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.4)}
            className="w-7 h-7 rounded-xl flex items-center justify-center neuro-btn-convex text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 theme-focus:hover:text-amber-200"
          >
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="flex-1 neuro-inset rounded-full p-1.5 flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-transparent rounded-lg appearance-none cursor-pointer accent-rose-500 theme-focus:accent-amber-500"
            />
          </div>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 theme-focus:text-amber-300/80 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};
