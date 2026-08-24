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
        {/* Active Track Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
          theme === 'focus'
            ? 'bg-[#201c18] border-[#382e25]'
            : isPlaying
            ? 'bg-indigo-950/40 border-indigo-500/40'
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTogglePlay()}
              className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 theme-focus:bg-amber-500 theme-focus:hover:bg-amber-600 text-white'
              }`}
              aria-label={isPlaying ? 'Pause sound' : 'Play sound'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 theme-focus:text-amber-300/60 block">
                {isPlaying ? 'Currently Streaming' : 'Selected Soundscape'}
              </span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white theme-focus:text-amber-100">
                {tracks.find((t) => t.id === currentTrack)?.name}
              </h4>
            </div>
          </div>

          {/* Sound waves animation if playing */}
          {isPlaying && (
            <div className="flex items-end gap-1 h-6 px-2">
              <div className="w-1 bg-indigo-500 theme-focus:bg-amber-400 rounded-full animate-pulse h-4" />
              <div className="w-1 bg-indigo-400 theme-focus:bg-amber-300 rounded-full animate-pulse h-6" style={{ animationDelay: '150ms' }} />
              <div className="w-1 bg-indigo-500 theme-focus:bg-amber-400 rounded-full animate-pulse h-3" style={{ animationDelay: '300ms' }} />
              <div className="w-1 bg-indigo-300 theme-focus:bg-amber-200 rounded-full animate-pulse h-5" style={{ animationDelay: '450ms' }} />
            </div>
          )}
        </div>

        {/* Sound Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {tracks.map((track) => {
            const Icon = track.icon;
            const isCurrent = currentTrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleTogglePlay(track.id)}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isCurrent && isPlaying
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                    : 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 hover:border-slate-300 theme-focus:bg-[#201c18] theme-focus:border-[#382e25]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isCurrent && isPlaying ? 'text-white' : track.color}`} />
                  <span className={`text-[9px] font-bold uppercase ${
                    isCurrent && isPlaying ? 'text-indigo-200' : 'text-slate-400 theme-focus:text-amber-300/50'
                  }`}>
                    {track.type}
                  </span>
                </div>
                <span className="text-[11px] font-bold truncate">{track.name}</span>
              </button>
            );
          })}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.4)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 theme-focus:hover:text-amber-200"
          >
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 theme-focus:bg-[#332b22] rounded-lg appearance-none cursor-pointer accent-indigo-600 theme-focus:accent-amber-500"
          />
          <span className="text-[10px] font-bold text-slate-400 theme-focus:text-amber-300/70 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};
