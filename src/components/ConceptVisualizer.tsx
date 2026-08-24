import React, { useState } from "react";
import { Image as ImageIcon, Loader2, Sparkles, Search } from "lucide-react";

export default function ConceptVisualizer() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to generate image.");
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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-600">
          <ImageIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">Concept Visualizer</h2>
          <p className="text-xs text-slate-500">Generate diagrams for difficult topics</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, Cellular Respiration..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2.5 pl-9 pr-3 text-slate-700 dark:text-slate-200 outline-none focus:border-fuchsia-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            disabled={isGenerating}
          />
        </div>
        <button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"
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
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
             <a href={imageUrl} download={`visualizer-${topic.replace(/\s+/g, '-').toLowerCase()}.png`} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-lg">
               Download Image
             </a>
          </div>
        </div>
      )}
      
      {!imageUrl && !isGenerating && !error && (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed bg-slate-50 dark:bg-slate-800/50 aspect-video flex flex-col items-center justify-center text-slate-400 gap-2">
           <ImageIcon className="w-8 h-8 opacity-20" />
           <p className="text-xs font-medium">Enter a topic to generate a visual diagram</p>
        </div>
      )}
    </div>
  );
}
