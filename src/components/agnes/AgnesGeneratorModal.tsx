import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Video, 
  Layers, 
  GraduationCap, 
  BookOpen, 
  Loader2, 
  Flame, 
  Compass,
  Check
} from 'lucide-react';
import { 
  AgnesSubject, 
  AgnesDifficulty, 
  AgnesVideo 
} from '../../types/agnesVideo';
import { generateAgnesVideo } from '../../services/agnesVideoService';
import { AgnesAvatar } from './AgnesAvatar';

interface AgnesGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoGenerated: (video: AgnesVideo) => void;
  prefillTopic?: string;
  prefillSubject?: string;
}

export const AgnesGeneratorModal: React.FC<AgnesGeneratorModalProps> = ({
  isOpen,
  onClose,
  onVideoGenerated,
  prefillTopic = '',
  prefillSubject = '',
}) => {
  const [topic, setTopic] = useState(prefillTopic);
  const [subject, setSubject] = useState<AgnesSubject>(
    (prefillSubject as AgnesSubject) || 'Physics'
  );

  React.useEffect(() => {
    if (prefillTopic) {
      setTopic(prefillTopic);
    }
    if (prefillSubject) {
      setSubject(prefillSubject as AgnesSubject);
    }
  }, [prefillTopic, prefillSubject]);
  const [difficulty, setDifficulty] = useState<AgnesDifficulty>('Competitive (JEE/NEET/GATE)');
  const [teachingStyle, setTeachingStyle] = useState<'visual_analogy' | 'rigorous_proof' | 'exam_masterclass'>('visual_analogy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  if (!isOpen) return null;

  const popularToughTopics = [
    { name: 'Quantum Tunneling', subject: 'Physics' as AgnesSubject },
    { name: 'Diels-Alder Cycloaddition', subject: 'Chemistry' as AgnesSubject },
    { name: 'Navier-Stokes Equations', subject: 'Physics' as AgnesSubject },
    { name: 'Hardy-Weinberg Equilibrium', subject: 'Biology' as AgnesSubject },
    { name: 'Epsilon-Delta Limit Proof', subject: 'Mathematics' as AgnesSubject },
    { name: 'Backpropagation Gradient Flow', subject: 'Computer Science' as AgnesSubject },
    { name: 'Electrochemical Nernst Equation', subject: 'Chemistry' as AgnesSubject },
    { name: 'Lenz\'s Law & Eddy Currents', subject: 'Physics' as AgnesSubject },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationStep(1);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      const generated = await generateAgnesVideo({
        topic: topic.trim(),
        subject,
        difficulty,
        teachingStyle,
        sceneCount: 4,
      });

      clearInterval(stepInterval);
      setIsGenerating(false);
      onVideoGenerated(generated);
      onClose();
    } catch (err) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      console.error('Failed to generate video:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <AgnesAvatar isSpeaking={isGenerating} mood="explaining" size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                  Agnes AI Engine
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-[10px] font-semibold text-slate-400">Tough Topics Studio</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Generate Video Breakdown</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {!isGenerating ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Tough Concept, Chapter, or Paradox</span>
                <span className="text-[10px] text-slate-500">e.g. Krebs Cycle step 3, Lenz\'s Law</span>
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter any tough topic you struggle with..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Popular Tough Topics Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" />
                <span>Or pick a notoriously tricky topic:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularToughTopics.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(item.name);
                      setSubject(item.subject);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-xl font-medium transition-all ${
                      topic === item.name
                        ? 'bg-rose-600 text-white font-bold ring-2 ring-rose-400/40'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Discipline</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'] as AgnesSubject[]).map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => setSubject(subj)}
                    className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all ${
                      subject === subj
                        ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {subj === 'Computer Science' ? 'CompSci' : subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Rigor Level Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Audience & Rigor</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as AgnesDifficulty)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="High School (CBSE/AP/IB)">High School (CBSE / AP / IB)</option>
                <option value="Competitive (JEE/NEET/GATE)">Competitive (JEE Advanced / NEET / GATE)</option>
                <option value="Undergraduate">Undergraduate / College Level</option>
                <option value="Explain Like I'm 10">Explain Like I'm 10 (Zero Jargon)</option>
              </select>
            </div>

            {/* Teaching Style Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Agnes Teaching Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTeachingStyle('visual_analogy')}
                  className={`p-2.5 rounded-2xl border text-left text-xs transition-all ${
                    teachingStyle === 'visual_analogy'
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/40'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-black text-[11px] mb-0.5">Visual Analogies</div>
                  <div className="text-[10px] text-slate-400">Mental models & intuition</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTeachingStyle('rigorous_proof')}
                  className={`p-2.5 rounded-2xl border text-left text-xs transition-all ${
                    teachingStyle === 'rigorous_proof'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200 ring-2 ring-amber-500/40'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-black text-[11px] mb-0.5">Derivation & Math</div>
                  <div className="text-[10px] text-slate-400">Proof steps & formulas</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTeachingStyle('exam_masterclass')}
                  className={`p-2.5 rounded-2xl border text-left text-xs transition-all ${
                    teachingStyle === 'exam_masterclass'
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500/40'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-black text-[11px] mb-0.5">Exam Traps</div>
                  <div className="text-[10px] text-slate-400">Tricks & scoring points</div>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!topic.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-40 text-white font-extrabold text-sm shadow-xl shadow-rose-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Generate Agnes Video Presentation</span>
              </button>
            </div>
          </form>
        ) : (
          /* Live Generation Animation */
          <div className="py-8 px-4 text-center space-y-5 animate-fade-in">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
              <AgnesAvatar isSpeaking={true} mood="explaining" size="sm" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white">
                Dr. Agnes is Architecting Your Video
              </h3>
              <p className="text-xs text-slate-400">
                Crafting chalkboard formulas, visual simulations, and narration for &quot;{topic}&quot;
              </p>
            </div>

            {/* Stepper Status */}
            <div className="max-w-xs mx-auto space-y-2 text-left text-xs font-mono">
              <div className={`flex items-center gap-2 ${generationStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <Check className="w-3.5 h-3.5" />
                <span>Deconstructing first principles</span>
              </div>
              <div className={`flex items-center gap-2 ${generationStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <Check className="w-3.5 h-3.5" />
                <span>Synthesizing blackboard equations</span>
              </div>
              <div className={`flex items-center gap-2 ${generationStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <Check className="w-3.5 h-3.5" />
                <span>Generating Agnes speech narration</span>
              </div>
              <div className={`flex items-center gap-2 ${generationStep >= 4 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rendering interactive player HUD...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
