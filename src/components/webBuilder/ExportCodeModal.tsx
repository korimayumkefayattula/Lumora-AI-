import React, { useState } from 'react';
import { 
  X, Copy, Check, Download, ExternalLink, Code2, Globe, Sparkles 
} from 'lucide-react';
import { StudentWebsiteConfig } from '../../types/websiteBuilder';
import { THEME_DEFINITIONS } from '../../data/websiteTemplates';

interface ExportCodeModalProps {
  config: StudentWebsiteConfig;
  onClose: () => void;
}

export const ExportCodeModal: React.FC<ExportCodeModalProps> = ({
  config,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'code'>('share');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const theme = THEME_DEFINITIONS[config.theme] || THEME_DEFINITIONS.cosmic;
  const mockShareUrl = `https://lumora.me/@${config.studentHandle || 'student'}`;

  // Generate self-contained standalone HTML5 file with embedded scripts & styles
  const generateStandaloneHTML = () => {
    const heroBlock = config.blocks.find(b => b.type === 'hero' && b.visible);
    const hero = heroBlock?.heroData;
    const aboutBlock = config.blocks.find(b => b.type === 'about' && b.visible);
    const about = aboutBlock?.aboutData;
    const projectsBlock = config.blocks.find(b => b.type === 'projects' && b.visible);
    const projects = projectsBlock?.projectsData?.cards || [];
    const gadgetsBlock = config.blocks.find(b => b.type === 'interactive-gadgets' && b.visible);
    const stickyBlock = config.blocks.find(b => b.type === 'sticky-notes' && b.visible);
    const stickyNotes = stickyBlock?.stickyNotesData?.notes || [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.siteTitle} — Lumora Student Web</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <style>
    body { background-color: ${theme.canvasBg}; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
    .gradient-text { background: linear-gradient(to right, #8b5cf6, #3b82f6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body class="min-h-screen">
  <!-- Header -->
  <header class="border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 bg-black/40 z-20">
    <div class="flex items-center gap-3">
      <span class="text-2xl">${theme.emoji}</span>
      <div>
        <h1 class="font-extrabold text-base">${config.siteTitle}</h1>
        <p class="text-xs text-slate-400">@${config.studentHandle} • Lumora Student Showcase</p>
      </div>
    </div>
    <button onclick="launchConfetti()" class="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all">
      🎉 Cheer!
    </button>
  </header>

  <main class="max-w-4xl mx-auto px-6 py-12 space-y-12">
    <!-- Hero -->
    <section class="text-center py-10 space-y-4">
      <div class="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold">
        ${hero?.avatarEmoji || '🚀'} ${hero?.badgeText || 'Student Scholar'}
      </div>
      <h2 class="text-4xl sm:text-6xl font-black gradient-text">
        ${hero?.headline || config.siteTitle}
      </h2>
      <p class="text-slate-300 max-w-xl mx-auto text-base">
        ${hero?.subheadline || config.tagline}
      </p>
      <div class="pt-4 flex justify-center gap-3">
        <button onclick="launchConfetti()" class="px-6 py-3 rounded-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg hover:scale-105 transition-all">
          ${hero?.ctaPrimaryText || 'Celebrate!'}
        </button>
      </div>
    </section>

    <!-- Fun Gadget: Interactive Clicker Game -->
    ${gadgetsBlock ? `
    <section class="p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-4">
      <h3 class="font-black text-xl">⚡ Interactive Energy Core</h3>
      <p class="text-xs text-slate-400">Tap the button to harvest score points and trigger sound bleeps!</p>
      <div class="flex justify-center items-center gap-4">
        <button id="clickerBtn" onclick="handleClicker()" class="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer">
          ⚡
        </button>
        <div class="text-left font-mono">
          <div class="text-xs text-slate-400">SCORE:</div>
          <div id="scoreDisplay" class="text-3xl font-black text-cyan-400">0</div>
        </div>
      </div>
    </section>
    ` : ''}

    <!-- About Me -->
    ${about ? `
    <section class="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
      <h3 class="font-black text-xl text-cyan-400">About Me</h3>
      <p class="text-sm leading-relaxed text-slate-200">${about.bio}</p>
      <div class="grid grid-cols-2 gap-4 pt-2 text-xs">
        <div class="p-3 bg-white/5 rounded-xl">
          <strong class="text-slate-400 block">Favorite Subject:</strong>
          <span class="font-bold text-white">${about.favoriteSubject}</span>
        </div>
        <div class="p-3 bg-white/5 rounded-xl">
          <strong class="text-slate-400 block">Superpower:</strong>
          <span class="font-bold text-white">${about.superpower}</span>
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Projects -->
    ${projects.length > 0 ? `
    <section class="space-y-4">
      <h3 class="font-black text-2xl">Featured Projects & Inventions</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${projects.map(p => `
          <div class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span class="text-3xl">${p.icon || '🚀'}</span>
            <h4 class="font-bold text-base">${p.title}</h4>
            <p class="text-xs text-slate-300 leading-relaxed">${p.description}</p>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Sticky Notes Wall -->
    ${stickyNotes.length > 0 ? `
    <section class="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
      <h3 class="font-black text-xl text-yellow-400">Visitor Sticky Notes</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        ${stickyNotes.map(n => `
          <div class="p-4 rounded-xl bg-amber-300 text-slate-900 shadow-md transform rotate-1">
            <p class="text-xs font-semibold">"${n.text}"</p>
            <div class="text-[10px] font-bold text-right pt-2">— ${n.author}</div>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}
  </main>

  <footer class="text-center py-8 text-xs text-slate-500 border-t border-white/10 mt-12">
    Built with Lumora Student Simple Web Builder • Free Academic Portfolio
  </footer>

  <script>
    // Audio Synthesizer
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playCoin() {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1318, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }

    let score = 0;
    function handleClicker() {
      score += 10;
      document.getElementById('scoreDisplay').innerText = score;
      playCoin();
    }

    function launchConfetti() {
      if (typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    }
  </script>
</body>
</html>`;
  };

  const handleDownloadFile = () => {
    const html = generateStandaloneHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.studentHandle || 'student'}_website.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateStandaloneHTML());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Export & Share Student Website
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share with friends, parents, or download the standalone HTML
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

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('share')}
            className={`pb-3 text-xs font-black transition-all relative ${
              activeTab === 'share'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Instant Share Link
            {activeTab === 'share' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 text-xs font-black transition-all relative ${
              activeTab === 'code'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Raw HTML5 Code
            {activeTab === 'code' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'share' ? (
            <div className="space-y-6">
              {/* Share URL Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Your Public Student Web Address
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={mockShareUrl}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-rose-600 dark:text-rose-400 font-bold"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shrink-0 shadow-md shadow-rose-600/30 transition-all"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Download Standalone File Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-rose-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Download Offline Web Package (.html)</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Everything embedded: Tailwind styling, confetti effects, clicker games & audio. Double-click to open in any web browser!
                  </p>
                </div>

                <button
                  onClick={handleDownloadFile}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs flex items-center gap-2 shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .html</span>
                </button>
              </div>
            </div>
          ) : (
            /* Code View Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Single-file HTML5 Source (Ready to paste anywhere)
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy HTML'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                {generateStandaloneHTML()}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
