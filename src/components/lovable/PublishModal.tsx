import React, { useState } from 'react';
import { 
  Globe, ExternalLink, Copy, Check, Sparkles, X, ShieldCheck, 
  Share2, Code2, Server, Eye, Rocket, CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { publishProjectToFirebaseHosting, StudentProjectRecord } from '../../services/firebaseWebBuilderService';

interface PublishModalProps {
  project: StudentProjectRecord;
  studentName?: string;
  studentEmail?: string;
  onClose: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  project,
  studentName = 'Lumora Creator',
  studentEmail = 'student@lumora.ai',
  onClose
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState<number>(0);
  const [publishedResult, setPublishedResult] = useState<{
    siteId: string;
    publishedUrl: string;
    livePreviewUrl: string;
    publishedAt: string;
  } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<'hosting' | 'preview' | 'embed' | null>(null);

  const steps = [
    'Bundling HTML, Tailwind CSS & JavaScript assets',
    'Saving deployment manifest to Cloud Firestore',
    'Deploying live container to Firebase Hosting',
    'Configuring global edge CDN & live preview routes'
  ];

  const handleStartPublish = async () => {
    setIsPublishing(true);
    setPublishStep(0);

    // Step animation for visual polish
    const stepInterval = setInterval(() => {
      setPublishStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const res = await publishProjectToFirebaseHosting({
        project,
        studentName,
        studentEmail
      });

      clearInterval(stepInterval);
      setPublishStep(steps.length);
      setIsPublishing(false);
      setPublishedResult({
        siteId: res.siteId,
        publishedUrl: res.publishedUrl,
        livePreviewUrl: res.livePreviewUrl,
        publishedAt: res.publishedAt
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      clearInterval(stepInterval);
      setIsPublishing(false);
      alert('Publishing encountered an issue. Please try again.');
    }
  };

  const copyToClipboard = (text: string, type: 'hosting' | 'preview' | 'embed') => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(type);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const embedSnippet = publishedResult 
    ? `<iframe src="${publishedResult.livePreviewUrl}" width="100%" height="600" style="border:none; border-radius:16px; overflow:hidden;" title="${project.title}"></iframe>`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-start justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Publish Live to Firebase Hosting</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Global CDN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Share your interactive creation with students, teachers, or friends worldwide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="relative z-10 space-y-6">
          {!publishedResult ? (
            <>
              {/* Project summary card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Project to Publish:</span>
                  <span className="text-[10px] text-indigo-400 font-mono">v{project.version || 1}.0</span>
                </div>
                <div className="text-base font-black text-white">{project.title || 'Untitled App'}</div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {project.description || 'Interactive student web application crafted with HTML, Tailwind CSS, and JavaScript.'}
                </p>
                <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400 border-t border-slate-800/60">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-rose-400" />
                    HTML: {(project.html || '').length} chars
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-indigo-400" />
                    JS Logic: {(project.js || '').length} chars
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Clean & Sandboxed
                  </span>
                </div>
              </div>

              {/* Progress if publishing */}
              {isPublishing && (
                <div className="space-y-3 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                      Deploying to Firebase Hosting...
                    </span>
                    <span>{Math.min(100, Math.round(((publishStep + 1) / steps.length) * 100))}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${((publishStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-indigo-300 font-mono animate-pulse">
                    {steps[publishStep] || 'Finalizing edge deployment...'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPublishing}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleStartPublish}
                  disabled={isPublishing}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-lg shadow-rose-600/30 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
                >
                  <Rocket className="w-4 h-4" />
                  <span>{isPublishing ? 'Publishing...' : 'Confirm & Deploy Live'}</span>
                </button>
              </div>
            </>
          ) : (
            /* Post-Publishing Result Screen */
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-white text-sm">Site Live on Firebase Hosting!</h4>
                  <p className="text-[11px] text-emerald-300">
                    Your site is publicly deployed with an encrypted SSL certificate and instant global CDN.
                  </p>
                </div>
              </div>

              {/* Live Preview Link Section */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Unique Live Preview URL</span>
                  <span className="text-emerald-400 font-normal">Active & Ready</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publishedResult.livePreviewUrl}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 select-all focus:outline-hidden"
                  />
                  <button
                    onClick={() => copyToClipboard(publishedResult.livePreviewUrl, 'preview')}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                    title="Copy Link"
                  >
                    {copiedUrl === 'preview' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === 'preview' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={publishedResult.livePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Live</span>
                  </a>
                </div>
              </div>

              {/* Firebase Hosting Production Domain */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Firebase Hosting Domain (`web.app`)</span>
                  <span className="text-indigo-400 font-normal">Production Target</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publishedResult.publishedUrl}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 select-all focus:outline-hidden"
                  />
                  <button
                    onClick={() => copyToClipboard(publishedResult.publishedUrl, 'hosting')}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedUrl === 'hosting' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === 'hosting' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Embed Snippet */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-rose-400" />
                    HTML Embed Code
                  </span>
                  <button
                    onClick={() => copyToClipboard(embedSnippet, 'embed')}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                  >
                    {copiedUrl === 'embed' ? 'Copied to Clipboard!' : 'Copy <iframe> Code'}
                  </button>
                </div>
                <pre className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 overflow-x-auto">
                  {embedSnippet}
                </pre>
              </div>

              {/* Close / Done */}
              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
