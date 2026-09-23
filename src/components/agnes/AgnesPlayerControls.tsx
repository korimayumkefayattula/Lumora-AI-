import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Subtitles, 
  Maximize, 
  Minimize, 
  Settings, 
  Sparkles,
  HelpCircle,
  FileDown,
  Layers
} from 'lucide-react';
import { AgnesScene } from '../../types/agnesVideo';

interface AgnesPlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentSceneIndex: number;
  totalScenes: number;
  scenes: AgnesScene[];
  onSelectScene: (index: number) => void;
  sceneProgress: number; // 0 to 100
  totalProgress: number; // 0 to 100
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  subtitlesEnabled: boolean;
  onToggleSubtitles: () => void;
  currentSubtitle: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const AgnesPlayerControls: React.FC<AgnesPlayerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  currentSceneIndex,
  totalScenes,
  scenes,
  onSelectScene,
  sceneProgress,
  totalProgress,
  playbackSpeed,
  onChangeSpeed,
  isMuted,
  onToggleMute,
  subtitlesEnabled,
  onToggleSubtitles,
  currentSubtitle,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speeds = [0.75, 1.0, 1.25, 1.5];

  return (
    <div className="space-y-3 select-none">
      {/* Subtitles Bar (Live Dr. Agnes Closed Captions) */}
      {subtitlesEnabled && (
        <div className="min-h-[46px] flex items-center justify-center px-4 py-2 rounded-2xl bg-black/85 border border-slate-800 text-center backdrop-blur-md shadow-lg transition-all">
          <p className="text-xs sm:text-sm font-medium text-amber-200 leading-snug line-clamp-2">
            <span className="font-bold text-amber-400 font-mono mr-1.5">[Dr. Agnes]:</span>
            &quot;{currentSubtitle}&quot;
          </p>
        </div>
      )}

      {/* Main Glass Control Dock */}
      <div className="p-3 sm:p-4 rounded-3xl bg-slate-900/95 dark:bg-[#0c0e14]/95 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col gap-3">
        
        {/* Scrubber Timeline Bar with Scene Chapters */}
        <div className="space-y-1.5">
          <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden cursor-pointer group">
            {/* Background total progress */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-500 via-amber-400 to-indigo-500 transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>

          {/* Scene Chapter Markers */}
          <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto no-scrollbar">
            {scenes.map((scene, idx) => {
              const isActive = idx === currentSceneIndex;
              const isPast = idx < currentSceneIndex;

              return (
                <button
                  key={scene.id}
                  onClick={() => onSelectScene(idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono transition-all shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm ring-2 ring-amber-400/40'
                      : isPast
                      ? 'bg-slate-800/80 text-emerald-400 hover:bg-slate-700'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/80'
                  }`}
                >
                  <span>Ch.{idx + 1}</span>
                  <span className="hidden sm:inline max-w-[80px] md:max-w-[120px] truncate">{scene.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
          
          {/* Left Controls: Prev, Play, Next */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onSelectScene(Math.max(0, currentSceneIndex - 1))}
              disabled={currentSceneIndex === 0}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Previous Scene"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
              title={isPlaying ? 'Pause Video' : 'Play Video'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => onSelectScene(Math.min(totalScenes - 1, currentSceneIndex + 1))}
              disabled={currentSceneIndex === totalScenes - 1}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Next Scene"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 ml-2">
              <span className="text-white font-bold">{currentSceneIndex + 1}</span>
              <span>/</span>
              <span>{totalScenes} scenes</span>
            </div>
          </div>

          {/* Right Controls: Audio, Speed, Subtitles, Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Voiceover Mute Toggle */}
            <button
              onClick={onToggleMute}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isMuted ? 'Unmute Agnes Voiceover' : 'Mute Voiceover'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span className="hidden md:inline text-[11px] font-mono">{isMuted ? 'Muted' : 'Voice'}</span>
            </button>

            {/* Playback Speed Controller */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full mb-2 right-0 bg-slate-900 border border-slate-700 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 z-30 min-w-[70px]">
                  {speeds.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        onChangeSpeed(s);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold text-center transition-colors ${
                        playbackSpeed === s
                          ? 'bg-amber-500 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitles / CC Toggle */}
            <button
              onClick={onToggleSubtitles}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                subtitlesEnabled
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={subtitlesEnabled ? 'Disable Subtitles' : 'Enable Subtitles'}
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={onToggleFullscreen}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
