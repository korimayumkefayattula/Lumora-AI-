import React from 'react';
import { 
  X, Plus, Trash2, Check, Sparkles, User, Layers, 
  Gamepad2, MessageSquare, HelpCircle, FileQuestion, Link 
} from 'lucide-react';
import { WebBlock, ProjectCard, TriviaItem, FaqItem, LinkItem } from '../../types/websiteBuilder';

interface BlockEditorDrawerProps {
  block: WebBlock | null;
  onClose: () => void;
  onSaveBlock: (updatedBlock: WebBlock) => void;
}

const EMOJI_PICKER_OPTIONS = ['👨‍🚀', '👩‍🔬', '🧙‍♂️', '👾', '🕹️', '🍵', '⚡', '🤖', '🚀', '🎨', '🧠', '🔬', '🏛️', '🔥', '✨'];

export const BlockEditorDrawer: React.FC<BlockEditorDrawerProps> = ({
  block,
  onClose,
  onSaveBlock
}) => {
  if (!block) return null;

  const [current, setCurrent] = React.useState<WebBlock>({ ...block });

  React.useEffect(() => {
    setCurrent({ ...block });
  }, [block]);

  const handleFieldChange = (key: string, value: any) => {
    setCurrent(prev => ({ ...prev, [key]: value }));
  };

  const handleSubFieldChange = (section: string, field: string, value: any) => {
    setCurrent(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSaveBlock(current);
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Block Settings
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white capitalize">
            Edit {current.type.replace('-', ' ')}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
        {/* Title & Subtitle */}
        <div className="space-y-3">
          <label className="block font-bold text-slate-700 dark:text-slate-300">
            Block Title
          </label>
          <input
            type="text"
            value={current.title}
            onChange={e => handleFieldChange('title', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-rose-500"
          />
        </div>

        {/* 1. HERO EDITOR */}
        {current.type === 'hero' && current.heroData && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Avatar Icon / Emoji</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {EMOJI_PICKER_OPTIONS.map(em => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => handleSubFieldChange('heroData', 'avatarEmoji', em)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-transform ${
                      current.heroData?.avatarEmoji === em ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 scale-110' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Badge Label</label>
              <input
                type="text"
                value={current.heroData.badgeText}
                onChange={e => handleSubFieldChange('heroData', 'badgeText', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Main Headline</label>
              <input
                type="text"
                value={current.heroData.headline}
                onChange={e => handleSubFieldChange('heroData', 'headline', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Subheadline & Bio Intro</label>
              <textarea
                rows={3}
                value={current.heroData.subheadline}
                onChange={e => handleSubFieldChange('heroData', 'subheadline', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Primary Button</label>
                <input
                  type="text"
                  value={current.heroData.ctaPrimaryText}
                  onChange={e => handleSubFieldChange('heroData', 'ctaPrimaryText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Secondary Button</label>
                <input
                  type="text"
                  value={current.heroData.ctaSecondaryText}
                  onChange={e => handleSubFieldChange('heroData', 'ctaSecondaryText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. GADGETS EDITOR */}
        {current.type === 'interactive-gadgets' && current.gadgetsData && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 dark:text-slate-200">Confetti Cannon Button</span>
                <input
                  type="checkbox"
                  checked={current.gadgetsData.enableConfettiButton}
                  onChange={e => handleSubFieldChange('gadgetsData', 'enableConfettiButton', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
              </div>
              {current.gadgetsData.enableConfettiButton && (
                <input
                  type="text"
                  value={current.gadgetsData.confettiButtonText}
                  onChange={e => handleSubFieldChange('gadgetsData', 'confettiButtonText', e.target.value)}
                  placeholder="Button Label (e.g., 🚀 Launch Confetti!)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 dark:text-slate-200">Tap Clicker Mini-Game</span>
                <input
                  type="checkbox"
                  checked={current.gadgetsData.enableClickerGame}
                  onChange={e => handleSubFieldChange('gadgetsData', 'enableClickerGame', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
              </div>
              {current.gadgetsData.enableClickerGame && (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 dark:text-slate-400">Clicker Target Label</label>
                    <input
                      type="text"
                      value={current.gadgetsData.clickerTargetLabel}
                      onChange={e => handleSubFieldChange('gadgetsData', 'clickerTargetLabel', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 dark:text-slate-400">Tap Emoji</label>
                    <input
                      type="text"
                      value={current.gadgetsData.clickerEmoji}
                      onChange={e => handleSubFieldChange('gadgetsData', 'clickerEmoji', e.target.value)}
                      className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 3. ABOUT EDITOR */}
        {current.type === 'about' && current.aboutData && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Student Role / Title</label>
              <input
                type="text"
                value={current.aboutData.role}
                onChange={e => handleSubFieldChange('aboutData', 'role', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">School / Grade Level</label>
              <input
                type="text"
                value={current.aboutData.gradeOrSchool}
                onChange={e => handleSubFieldChange('aboutData', 'gradeOrSchool', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Bio Description</label>
              <textarea
                rows={3}
                value={current.aboutData.bio}
                onChange={e => handleSubFieldChange('aboutData', 'bio', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Favorite Subject</label>
                <input
                  type="text"
                  value={current.aboutData.favoriteSubject}
                  onChange={e => handleSubFieldChange('aboutData', 'favoriteSubject', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Superpower</label>
                <input
                  type="text"
                  value={current.aboutData.superpower}
                  onChange={e => handleSubFieldChange('aboutData', 'superpower', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Fun Fact</label>
              <input
                type="text"
                value={current.aboutData.funFact}
                onChange={e => handleSubFieldChange('aboutData', 'funFact', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* 4. PROJECTS EDITOR */}
        {current.type === 'projects' && current.projectsData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300">Project Cards</span>
              <button
                type="button"
                onClick={() => {
                  const newCard: ProjectCard = {
                    id: 'proj-' + Date.now(),
                    title: 'New Science Project',
                    description: 'Brief overview of this experiment or coding demo.',
                    tag: 'Lab',
                    icon: '🔬',
                    linkText: 'Learn More',
                    likes: 12
                  };
                  handleSubFieldChange('projectsData', 'cards', [...current.projectsData!.cards, newCard]);
                }}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-3">
              {current.projectsData.cards.map((card, idx) => (
                <div key={card.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = current.projectsData!.cards.filter(c => c.id !== card.id);
                        handleSubFieldChange('projectsData', 'cards', updated);
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <input
                        type="text"
                        value={card.title}
                        onChange={e => {
                          const updated = [...current.projectsData!.cards];
                          updated[idx] = { ...card, title: e.target.value };
                          handleSubFieldChange('projectsData', 'cards', updated);
                        }}
                        placeholder="Title"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={card.tag}
                        onChange={e => {
                          const updated = [...current.projectsData!.cards];
                          updated[idx] = { ...card, tag: e.target.value };
                          handleSubFieldChange('projectsData', 'cards', updated);
                        }}
                        placeholder="Tag (e.g. Robot)"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={e => {
                      const updated = [...current.projectsData!.cards];
                      updated[idx] = { ...card, description: e.target.value };
                      handleSubFieldChange('projectsData', 'cards', updated);
                    }}
                    placeholder="Description"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-900/80">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black flex items-center gap-1.5 shadow-md shadow-rose-600/30"
        >
          <Check className="w-4 h-4" />
          <span>Apply Changes</span>
        </button>
      </div>
    </div>
  );
};
