import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Heart, ExternalLink, Plus, MessageSquare, Volume2, 
  VolumeX, Play, Trophy, HelpCircle, Check, ArrowRight, Share2, 
  Smile, Flame, Star, Laptop, ShieldCheck, Zap
} from 'lucide-react';
import { StudentWebsiteConfig, WebBlock, ProjectCard, StickyNoteItem, TriviaItem } from '../../types/websiteBuilder';
import { THEME_DEFINITIONS } from '../../data/websiteTemplates';
import { StudentAudio } from '../../utils/studentWebAudio';

interface LiveWebsiteRendererProps {
  config: StudentWebsiteConfig;
  onUpdateConfig?: (updated: StudentWebsiteConfig) => void;
  isInteractive?: boolean;
}

export const LiveWebsiteRenderer: React.FC<LiveWebsiteRendererProps> = ({
  config,
  onUpdateConfig,
  isInteractive = true
}) => {
  const theme = THEME_DEFINITIONS[config.theme] || THEME_DEFINITIONS.cosmic;
  
  // Interactive Local States
  const [likesState, setLikesState] = useState<Record<string, number>>({});
  const [clickerCount, setClickerCount] = useState<number>(0);
  const [clickerCombo, setClickerCombo] = useState<number>(1);
  const [comboTimer, setComboTimer] = useState<any>(null);
  const [revealedTrivia, setRevealedTrivia] = useState<Record<string, boolean>>({});
  const [isRainActive, setIsRainActive] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<Record<string, boolean>>({});
  
  // New Sticky Note Input state
  const [newStickyText, setNewStickyText] = useState('');
  const [newStickyAuthor, setNewStickyAuthor] = useState('');
  const [newStickyColor, setNewStickyColor] = useState<'yellow' | 'pink' | 'cyan' | 'green' | 'purple'>('yellow');
  const [showAddSticky, setShowAddSticky] = useState(false);

  // Trigger Confetti Blast
  const triggerConfetti = (e?: React.MouseEvent) => {
    StudentAudio.playCelebrationChime();
    
    // Multi-burst colorful confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 200);
  };

  // Handle Game Clicker
  const handleClickerTap = () => {
    StudentAudio.playCoinBleep();
    setClickerCount(prev => prev + (1 * clickerCombo));
    
    // Combo multiplier logic
    setClickerCombo(prev => Math.min(10, prev + 1));
    if (comboTimer) clearTimeout(comboTimer);
    const timer = setTimeout(() => {
      setClickerCombo(1);
    }, 2500);
    setComboTimer(timer);
  };

  // Handle Project Card Like
  const handleLikeProject = (id: string, initialLikes = 0) => {
    StudentAudio.playPop();
    setLikesState(prev => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + 1
    }));
  };

  // Toggle Ambient Rain noise
  const handleToggleRain = () => {
    const newState = !isRainActive;
    StudentAudio.toggleRain(newState);
    setIsRainActive(newState);
  };

  // Handle adding new sticky note
  const handleAddStickyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStickyText.trim()) return;

    StudentAudio.playPop();
    const newNote: StickyNoteItem = {
      id: 'sticky-' + Date.now(),
      text: newStickyText.trim(),
      author: newStickyAuthor.trim() || 'Fellow Student',
      color: newStickyColor,
      rotation: Math.floor(Math.random() * 8) - 4
    };

    if (onUpdateConfig) {
      const updatedBlocks = config.blocks.map(b => {
        if (b.type === 'sticky-notes' && b.stickyNotesData) {
          return {
            ...b,
            stickyNotesData: {
              ...b.stickyNotesData,
              notes: [newNote, ...(b.stickyNotesData.notes || [])]
            }
          };
        }
        return b;
      });
      onUpdateConfig({ ...config, blocks: updatedBlocks });
    }

    setNewStickyText('');
    setNewStickyAuthor('');
    setShowAddSticky(false);
  };

  // Font family class mapper
  const getFontClass = () => {
    switch (config.font) {
      case 'display': return 'font-sans tracking-tight';
      case 'mono': return 'font-mono tracking-tight';
      case 'serif': return 'font-serif tracking-normal';
      default: return 'font-sans';
    }
  };

  return (
    <div 
      className={`min-h-full w-full transition-colors duration-300 select-text ${theme.bgClass} ${getFontClass()}`}
      style={{ backgroundColor: theme.canvasBg }}
    >
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-opacity-80 border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${theme.gradient} flex items-center justify-center text-white text-base shadow-md`}>
            {theme.emoji}
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight leading-tight">
              {config.siteTitle}
            </h1>
            <p className="text-[10px] opacity-70">
              @{config.studentHandle} • Lumora Student Web
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          {/* Rain Sound Button if ambient player exists */}
          <button
            onClick={handleToggleRain}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isRainActive 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title="Toggle Cozy Rain Sound"
          >
            {isRainActive ? <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
            <span className="hidden sm:inline">{isRainActive ? 'Rain Playing' : 'Cozy Rain'}</span>
          </button>

          <button
            onClick={() => triggerConfetti()}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r ${theme.gradient} shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1`}
            title="Celebrate with confetti"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cheer!</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {config.blocks.filter(b => b.visible).map(block => {
          switch (block.type) {
            
            // 1. HERO BLOCK
            case 'hero': {
              const h = block.heroData;
              if (!h) return null;
              return (
                <section key={block.id} className="relative text-center py-6 sm:py-12 space-y-6">
                  {/* Floating fun sticker badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md border border-white/20 bg-white/5">
                    <span className="text-sm">{h.avatarEmoji || '🚀'}</span>
                    <span className="tracking-wide">{h.badgeText}</span>
                  </div>

                  {/* Animated / Gradient Headline */}
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.gradient}`}>
                      {h.headline}
                    </span>
                  </h2>

                  <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed opacity-85">
                    {h.subheadline}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-3.5 pt-2 flex-wrap">
                    <button
                      onClick={() => triggerConfetti()}
                      className={`px-6 py-3 rounded-2xl font-black text-sm text-white bg-gradient-to-r ${theme.gradient} shadow-lg shadow-violet-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{h.ctaPrimaryText || 'Explore Now'}</span>
                    </button>
                    {h.ctaSecondaryText && (
                      <button
                        onClick={() => {
                          const projectsElem = document.getElementById('block-projects');
                          if (projectsElem) projectsElem.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-3 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5"
                      >
                        <span>{h.ctaSecondaryText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </section>
              );
            }

            // 2. INTERACTIVE GADGETS & FUN GAMES BLOCK
            case 'interactive-gadgets': {
              const g = block.gadgetsData;
              if (!g) return null;
              return (
                <section key={block.id} className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl space-y-6 relative overflow-hidden`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
                        <Trophy className="w-4 h-4" />
                        <span>Interactive Entertainment Hub</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black mt-0.5">{block.title}</h3>
                      {block.subtitle && <p className="text-xs opacity-75">{block.subtitle}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 border border-white/20">
                        Level {Math.floor(clickerCount / 25) + 1} Player
                      </span>
                    </div>
                  </div>

                  {/* 2-Column Gadget Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Confetti Blast Trigger */}
                    {g.enableConfettiButton && (
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-2xl shadow-md">
                          🎉
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm">Celebration Cannon</h4>
                          <p className="text-xs opacity-70 mt-1">Tap to launch high-altitude physics confetti with celebration chords!</p>
                        </div>
                        <button
                          onClick={() => triggerConfetti()}
                          className={`w-full py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r ${theme.gradient} hover:scale-102 active:scale-98 transition-all shadow-md`}
                        >
                          {g.confettiButtonText || 'Launch Confetti!'}
                        </button>
                      </div>
                    )}

                    {/* Fun Tap Clicker Game */}
                    {g.enableClickerGame && (
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between items-center text-center space-y-3">
                        <div className="flex items-center justify-between w-full text-xs font-mono opacity-80">
                          <span>Combo: <strong className="text-amber-400">{clickerCombo}x</strong></span>
                          <span>Score: <strong className="text-cyan-400">{clickerCount}</strong></span>
                        </div>

                        <button
                          onClick={handleClickerTap}
                          className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:scale-110 active:scale-90 transition-all flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/30 cursor-pointer select-none"
                          title="Click to harvest points!"
                        >
                          {g.clickerEmoji || '⚡'}
                        </button>

                        <div>
                          <h4 className="font-extrabold text-sm">{g.clickerTargetLabel || 'Click to boost energy!'}</h4>
                          <p className="text-[11px] opacity-70 mt-0.5">Keep tapping fast to maintain your multiplier combo!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );
            }

            // 3. ABOUT ME / STUDENT PROFILE BLOCK
            case 'about': {
              const a = block.aboutData;
              if (!a) return null;
              return (
                <section key={block.id} className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl space-y-6`}>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                    <Laptop className="w-4 h-4" />
                    <span>Student Profile & Superpowers</span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-2xl font-black">{a.role}</h3>
                        <p className="text-xs font-semibold opacity-75">{a.gradeOrSchool}</p>
                      </div>

                      <p className="text-sm leading-relaxed opacity-90">
                        {a.bio}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Favorite Subject</span>
                          <p className="text-xs font-bold text-cyan-300 mt-0.5">{a.favoriteSubject}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Academic Superpower</span>
                          <p className="text-xs font-bold text-amber-300 mt-0.5">{a.superpower}</p>
                        </div>
                      </div>

                      {a.funFact && (
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-extrabold">Fun Fact: </strong>
                            {a.funFact}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Skill Meters */}
                    {a.skills && a.skills.length > 0 && (
                      <div className="w-full md:w-72 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider opacity-70">Mastery Levels</h4>
                        {a.skills.map((sk, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span>{sk.name}</span>
                              <span className="font-mono text-cyan-400">{sk.level}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-700`}
                                style={{ width: `${sk.level}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );
            }

            // 4. PROJECTS SHOWCASE BLOCK
            case 'projects': {
              const p = block.projectsData;
              if (!p || !p.cards) return null;
              return (
                <section key={block.id} id="block-projects" className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-400">
                        <Sparkles className="w-4 h-4" />
                        <span>Showcase & Inventions</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black mt-0.5">{block.title}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {p.cards.map(card => {
                      const currentLikes = likesState[card.id] ?? card.likes ?? 0;
                      return (
                        <div 
                          key={card.id}
                          className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} shadow-lg flex flex-col justify-between space-y-4 hover:scale-102 transition-all group`}
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/10">
                                {card.icon || '🚀'}
                              </span>
                              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/10 border border-white/10 uppercase tracking-wide">
                                {card.tag}
                              </span>
                            </div>

                            <h4 className="font-black text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                              {card.title}
                            </h4>
                            <p className="text-xs opacity-80 leading-relaxed">
                              {card.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                            <button
                              onClick={() => handleLikeProject(card.id, card.likes)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-rose-400"
                              title="Like this project"
                            >
                              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                              <span className="font-mono font-bold text-slate-200">{currentLikes}</span>
                            </button>

                            {card.linkText && (
                              <button 
                                onClick={() => triggerConfetti()}
                                className="font-bold text-xs text-cyan-300 hover:underline flex items-center gap-1"
                              >
                                <span>{card.linkText}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }

            // 5. STICKY NOTES GUESTBOOK BLOCK
            case 'sticky-notes': {
              const s = block.stickyNotesData;
              if (!s) return null;
              
              const colorClasses = {
                yellow: 'bg-amber-300 text-slate-950 shadow-amber-500/20',
                pink: 'bg-rose-300 text-slate-950 shadow-rose-500/20',
                cyan: 'bg-cyan-300 text-slate-950 shadow-cyan-500/20',
                green: 'bg-emerald-300 text-slate-950 shadow-emerald-500/20',
                purple: 'bg-purple-300 text-slate-950 shadow-purple-500/20'
              };

              return (
                <section key={block.id} className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl space-y-6`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-yellow-400">
                        <MessageSquare className="w-4 h-4" />
                        <span>Interactive Visitor Board</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black mt-0.5">{block.title}</h3>
                      {block.subtitle && <p className="text-xs opacity-75">{block.subtitle}</p>}
                    </div>

                    {s.allowVisitorAdd && (
                      <button
                        onClick={() => setShowAddSticky(!showAddSticky)}
                        className="px-4 py-2 rounded-xl font-extrabold text-xs bg-yellow-400 hover:bg-yellow-300 text-slate-950 flex items-center gap-1.5 shadow-md self-start sm:self-auto transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Post a Sticky Note</span>
                      </button>
                    )}
                  </div>

                  {/* Add Sticky Note Form */}
                  {showAddSticky && (
                    <form onSubmit={handleAddStickyNote} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={newStickyAuthor}
                          onChange={e => setNewStickyAuthor(e.target.value)}
                          placeholder="Your Name / Handle"
                          className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-yellow-400"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs opacity-70">Color:</span>
                          {(['yellow', 'pink', 'cyan', 'green', 'purple'] as const).map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setNewStickyColor(c)}
                              className={`w-6 h-6 rounded-full transition-transform ${
                                c === 'yellow' ? 'bg-amber-300' :
                                c === 'pink' ? 'bg-rose-300' :
                                c === 'cyan' ? 'bg-cyan-300' :
                                c === 'green' ? 'bg-emerald-300' : 'bg-purple-300'
                              } ${newStickyColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={newStickyText}
                        onChange={e => setNewStickyText(e.target.value)}
                        placeholder="Write an encouraging study tip, cheer, or shoutout..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-yellow-400"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddSticky(false)}
                          className="px-3 py-1.5 rounded-lg text-xs opacity-70 hover:opacity-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl font-bold text-xs bg-yellow-400 text-slate-950 hover:bg-yellow-300"
                        >
                          Stick on Wall!
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Sticky Notes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {s.notes.map(note => (
                      <div
                        key={note.id}
                        className={`p-4 rounded-xl shadow-lg transform transition-transform hover:scale-105 duration-200 relative ${colorClasses[note.color] || colorClasses.yellow}`}
                        style={{ transform: `rotate(${note.rotation}deg)` }}
                      >
                        <div className="w-3 h-3 rounded-full bg-slate-900/20 mx-auto -mt-2 mb-2 shadow-xs" />
                        <p className="text-xs font-medium leading-relaxed font-sans min-h-[48px]">
                          "{note.text}"
                        </p>
                        <div className="text-[10px] font-black uppercase text-right pt-2 border-t border-slate-950/20 mt-2">
                          — {note.author}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            // 6. QUOTES & TRIVIA RIDDLES BLOCK
            case 'quotes-trivia': {
              const q = block.quotesTriviaData;
              if (!q || !q.triviaList) return null;
              return (
                <section key={block.id} className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl space-y-5`}>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>Brain Teasers & Science Riddles</span>
                  </div>
                  <h3 className="text-xl font-black">{block.title}</h3>

                  <div className="space-y-3">
                    {q.triviaList.map(item => {
                      const isRevealed = revealedTrivia[item.id];
                      return (
                        <div 
                          key={item.id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs font-black text-purple-300">
                              [{item.category}]
                            </span>
                            <button
                              onClick={() => {
                                StudentAudio.playPop();
                                setRevealedTrivia(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                              }}
                              className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-cyan-300"
                            >
                              {isRevealed ? 'Hide Answer' : '💡 Reveal Answer'}
                            </button>
                          </div>

                          <p className="text-xs sm:text-sm font-bold text-slate-100">
                            {item.question}
                          </p>

                          {isRevealed && (
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 mt-2 flex items-start gap-2">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <p className="leading-relaxed">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }

            // 7. AMBIENT PLAYER BLOCK
            case 'ambient-player': {
              return (
                <section key={block.id} className={`p-6 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                      🎧
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-100">{block.ambientPlayerData?.presetTitle || 'Ambient Focus Generator'}</h4>
                      <p className="text-xs opacity-70">Synthesized white/pink noise rain for effortless 25-minute study sprints</p>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleRain}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
                      isRainActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isRainActive ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Play className="w-4 h-4" />}
                    <span>{isRainActive ? 'Stop Ambient Rain' : 'Play Rain Sounds'}</span>
                  </button>
                </section>
              );
            }

            // 8. FAQ ACCORDION BLOCK
            case 'faq': {
              const f = block.faqData;
              if (!f || !f.items) return null;
              return (
                <section key={block.id} className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl space-y-4`}>
                  <h3 className="text-lg font-black">{block.title}</h3>
                  <div className="space-y-2">
                    {f.items.map(item => {
                      const isOpen = activeFaq[item.id];
                      return (
                        <div key={item.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                          <button
                            onClick={() => {
                              StudentAudio.playPop();
                              setActiveFaq(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                            }}
                            className="w-full text-left font-bold text-xs sm:text-sm flex items-center justify-between text-slate-200"
                          >
                            <span>{item.q}</span>
                            <span className="text-base">{isOpen ? '−' : '+'}</span>
                          </button>
                          {isOpen && (
                            <p className="text-xs opacity-80 mt-2 pt-2 border-t border-white/10 leading-relaxed">
                              {item.a}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }

            // 9. LINKS & FOOTER BLOCK
            case 'links-contact': {
              const l = block.linksData;
              if (!l) return null;
              return (
                <section key={block.id} className="text-center py-6 space-y-6">
                  {l.items && l.items.length > 0 && (
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {l.items.map(link => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-bold transition-all flex items-center gap-2 text-slate-100"
                        >
                          <span>{link.icon}</span>
                          <span>{link.label}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] opacity-60 max-w-md mx-auto">
                    {l.footerNotice}
                  </div>
                </section>
              );
            }

            default:
              return null;
          }
        })}
      </main>
    </div>
  );
};
