import React, { useState } from "react";
import { Image as ImageIcon, Loader2, Sparkles, Search, Download, Copy, Check, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const QUICK_TOPICS = [
  "Chloroplast Photosynthesis",
  "DNA Double Helix",
  "Neuron Synapse",
  "DC Motor Principle",
  "Water Electrolysis"
];

export default function ConceptVisualizer() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent, customTopic?: string) => {
    if (e) e.preventDefault();
    const query = (customTopic || topic).trim();
    if (!query) return;

    if (customTopic) {
      setTopic(customTopic);
    }

    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: query,
          style: 'scientific-diagram',
          aspectRatio: '16:9'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to generate visual diagram.");
      }

      const data = await response.json();
      if (data.imageUrl || data.imageBase64) {
        setImageUrl(data.imageUrl || `data:${data.mimeType || 'image/png'};base64,${data.imageBase64}`);
      }
    } catch (err: any) {
      setError(err.details || err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!imageUrl) return;
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>LumoraAI Concept Visualizer</span>
              <Sparkles className="w-3 h-3 text-rose-500" />
            </h2>
            <p className="text-xs text-slate-500">Synthesize annotated visual diagrams instantly</p>
          </div>
        </div>
        <Link 
          to="/student/diagrams" 
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
        >
          <span>Studio</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* QUICK SUGGESTIONS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {QUICK_TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleGenerate(undefined, t)}
            className="text-[11px] font-medium bg-slate-100 dark:bg-slate-700/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-600 dark:text-slate-300 hover:text-rose-600 px-2.5 py-1 rounded-lg shrink-0 transition-colors"
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => handleGenerate(e)} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, Plant vs Animal Cell..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm rounded-xl py-2.5 pl-9 pr-3 text-slate-700 dark:text-slate-200 outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            disabled={isGenerating}
          />
        </div>
        <button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 shadow-sm"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Visualize</span>
        </button>
      </form>

      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-xl p-3">
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 relative aspect-video flex items-center justify-center group">
          <img 
            src={imageUrl} 
            alt={`Diagram for ${topic}`} 
            referrerPolicy="no-referrer"
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm p-1.5 rounded-xl">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs flex items-center gap-1"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a 
              href={imageUrl} 
              download={`lumora-${topic.replace(/\s+/g, '-').toLowerCase()}.png`} 
              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs flex items-center gap-1 font-semibold"
              title="Download PNG"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save</span>
            </a>
          </div>
        </div>
      )}
      
      {!imageUrl && !isGenerating && !error && (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed bg-slate-50 dark:bg-slate-800/50 aspect-video flex flex-col items-center justify-center text-slate-400 gap-2">
           <ImageIcon className="w-8 h-8 opacity-20" />
           <p className="text-xs font-medium">Enter a topic or click a suggestion chip above</p>
        </div>
      )}
    </div>
  );
}
