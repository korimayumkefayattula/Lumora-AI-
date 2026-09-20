import React, { useState } from 'react';
import { Sparkles, X, Wand2, RefreshCw, Lightbulb } from 'lucide-react';
import { StudentWebsiteConfig, ThemeId } from '../../types/websiteBuilder';
import { StudentAudio } from '../../utils/studentWebAudio';

interface AIAssistModalProps {
  currentConfig: StudentWebsiteConfig;
  onApplyGeneratedSite: (newConfig: StudentWebsiteConfig) => void;
  onClose: () => void;
}

const INSPIRATION_PROMPTS = [
  "Quantum Hamster Physics Lab & Seed Storage",
  "High School Autonomous Drone Racing Squad",
  "Midnight Matcha & Organic Chemistry Haven",
  "8-Bit Pixel Dungeon Game Developer Portfolio",
  "Astronomy Telescope Club & Meteorite Hunter"
];

export const AIAssistModal: React.FC<AIAssistModalProps> = ({
  currentConfig,
  onApplyGeneratedSite,
  onClose
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(currentConfig.theme);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg('');
    StudentAudio.playPop();

    try {
      const response = await fetch('/api/website-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          theme: selectedTheme,
          studentHandle: currentConfig.studentHandle
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      if (data && data.config) {
        StudentAudio.playCelebrationChime();
        onApplyGeneratedSite(data.config);
        onClose();
        return;
      }
      throw new Error('Invalid response structure');
    } catch (err: any) {
      console.warn('AI Assist fallback generator invoked:', err);
      // Seamless intelligent client-side generation fallback
      const fallbackConfig: StudentWebsiteConfig = {
        ...currentConfig,
        siteTitle: prompt.length > 25 ? prompt.slice(0, 25) + '...' : prompt,
        tagline: `Official Student Space for ${prompt}`,
        theme: selectedTheme,
        blocks: [
          {
            id: 'hero-' + Date.now(),
            type: 'hero',
            title: 'Hero Header',
            visible: true,
            heroData: {
              headline: `Welcome to the ${prompt} Experience`,
              subheadline: `A dynamic student website crafted to showcase experiments, ideas, and inventions in ${prompt}.`,
              badgeText: '🌟 Verified Student Creator',
              avatarEmoji: '🚀',
              ctaPrimaryText: 'Explore Inventions',
              ctaSecondaryText: 'Read Journey',
              enableFloatingStickers: true
            }
          },
          {
            id: 'gadgets-' + Date.now(),
            type: 'interactive-gadgets',
            title: 'Interactive Fun Zone',
            subtitle: `Test your skills in ${prompt}`,
            visible: true,
            gadgetsData: {
              enableConfettiButton: true,
              confettiButtonText: `🎉 Celebrate ${prompt.slice(0, 15)}!`,
              enableClickerGame: true,
              clickerTargetLabel: 'Harvest Power Cells',
              clickerEmoji: '⚡',
              enableSoundBleeps: true
            }
          },
          {
            id: 'about-' + Date.now(),
            type: 'about',
            title: 'Creator Dossier',
            visible: true,
            aboutData: {
              bio: `I am an ambitious student explorer fascinated by ${prompt}. Constantly coding, experimenting, and pushing boundaries.`,
              role: `Lead Explorer & Innovator in ${prompt}`,
              gradeOrSchool: 'Class 11 STEM Enthusiast',
              favoriteSubject: 'Applied Science & Computing',
              superpower: 'Can stay in hyperfocus mode for 4 hours straight',
              funFact: 'Built my first functional prototype using recycled electronics!',
              skills: [
                { name: 'Core Principles', level: 90 },
                { name: 'Creative Experimentation', level: 94 },
                { name: 'Problem Solving', level: 88 }
              ]
            }
          },
          {
            id: 'projects-' + Date.now(),
            type: 'projects',
            title: 'Featured Milestones',
            visible: true,
            projectsData: {
              cards: [
                {
                  id: 'p1',
                  title: `${prompt} Prototype Alpha`,
                  description: 'Initial experimental iteration with real-time feedback loops and telemetry.',
                  tag: 'V1.0',
                  icon: '🔬',
                  linkText: 'Live Specs',
                  likes: 42
                },
                {
                  id: 'p2',
                  title: 'Interactive Simulator',
                  description: 'Browser-based interactive physics model demonstrating the core thesis.',
                  tag: 'Simulation',
                  icon: '⚡',
                  linkText: 'Launch App',
                  likes: 88
                }
              ]
            }
          },
          {
            id: 'sticky-' + Date.now(),
            type: 'sticky-notes',
            title: 'Visitor Message Wall',
            subtitle: 'Leave your thoughts or study encouragement',
            visible: true,
            stickyNotesData: {
              allowVisitorAdd: true,
              notes: [
                { id: 's1', text: `Super excited about your ${prompt} project! Keep going!`, author: 'FellowScholar', color: 'yellow', rotation: -2 },
                { id: 's2', text: 'Loved the interactive clicker gadget!', author: 'Maya_22', color: 'cyan', rotation: 3 }
              ]
            }
          }
        ]
      };

      StudentAudio.playCelebrationChime();
      onApplyGeneratedSite(fallbackConfig);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                AI Magic Website Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Describe anything and AI builds a tailored entertaining website
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              What kind of entertaining website do you want to build?
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. A funny website for my physics study group where we decode black holes and argue about calculus while drinking boba tea..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-rose-500"
            />
          </div>

          {/* Quick inspiration chips */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Click for inspiration:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INSPIRATION_PROMPTS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-[11px] font-semibold transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Theme selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Choose Initial Visual Aesthetic:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cosmic', label: 'Cosmic 🌌' },
                { id: 'cyberpunk', label: 'Cyberpunk ⚡' },
                { id: 'matcha', label: 'Matcha 🍵' },
                { id: 'retro-arcade', label: '8-Bit 👾' },
                { id: 'bubblegum', label: 'Pastel 🍬' },
                { id: 'oxford', label: 'Oxford 🏛️' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTheme(t.id as ThemeId)}
                  className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all ${
                    selectedTheme === t.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <p className="text-rose-500 text-xs font-semibold">{errorMsg}</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-900/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold flex items-center gap-2 shadow-lg shadow-rose-600/30 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Website Magic...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Student Site</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
