import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Sparkles, 
  Loader2, 
  Download, 
  Image as ImageIcon, 
  Search, 
  Eye, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Maximize2
} from 'lucide-react';

interface GeminiPoolStatus {
  totalKeys: number;
  healthyKeyCount: number;
  activeKeyIndex: number;
}

export default function InfographicGenerator() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState<"mind map" | "flowchart" | "infographic" | "architecture">("mind map");
  const [engineMode, setEngineMode] = useState<"nano-banana" | "vector-svg" | "dual">("dual");
  const [activeTab, setActiveTab] = useState<"visual" | "svg" | "both">("visual");
  const [loading, setLoading] = useState(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [poolStatus, setPoolStatus] = useState<GeminiPoolStatus | null>(null);

  // Fetch pool status
  useEffect(() => {
    fetch("/api/gemini/pool-status")
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setPoolStatus(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const generateInfographic = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim() || loading) return;
    
    setLoading(true);
    setSvgContent(null);
    setImageUrl(null);
    
    try {
      const res = await fetch("/api/generate-infographic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: topic.trim(), 
          type,
          format: engineMode,
          aspectRatio: "16:9"
        })
      });
      const data = await res.json();
      if (data.success || data.svg || data.imageUrl) {
        if (data.svg) setSvgContent(data.svg);
        if (data.imageUrl) setImageUrl(data.imageUrl);
        setModelUsed(data.modelUsed || "Nano Banana Visual Engine (ChatGPT DALL-E 3 Style)");
        if (data.imageUrl && !data.svg) setActiveTab("visual");
        else if (data.svg && !data.imageUrl) setActiveTab("svg");
      } else {
        alert(data.error || "Failed to generate infographic");
      }
    } catch(err) {
      alert("Error contacting the visual generation server");
    } finally {
      setLoading(false);
    }
  };

  const downloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumora_${topic.replace(/\s+/g, '_')}_${type.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const QUICK_TOPICS = [
    { label: "Photosynthesis Pathways", type: "infographic" as const },
    { label: "Sorting Algorithms Time Complexity", type: "flowchart" as const },
    { label: "Special Relativity & Spacetime", type: "mind map" as const },
    { label: "Deep Neural Network Architecture", type: "architecture" as const },
    { label: "Cellular Mitosis vs Meiosis", type: "infographic" as const },
  ];

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        
        {/* Top Header & Multi-Key Status Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
               <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-white">AI Visual Diagram Studio</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/20">
                  🍌 Nano Banana & ChatGPT Style
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate high-resolution mind maps, flowcharts, and infographics styled like ChatGPT DALL-E 3
              </p>
            </div>
          </div>

          {/* Multi-Key Pool Health Badge */}
          {poolStatus && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Gemini Multi-Key Pool: <strong>{poolStatus.totalKeys} key{poolStatus.totalKeys > 1 ? 's' : ''}</strong> active & failover ready
              </span>
            </div>
          )}
        </div>

        {/* Input Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in">
           <div className="mb-6">
             <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display flex items-center gap-2">
               <Zap className="w-5 h-5 text-indigo-500" />
               Generate Visual Study Aids & System Diagrams
             </h2>
             <p className="text-slate-500 text-xs mt-0.5">
               Powered by the free Nano Banana visual model for photo-clean ChatGPT style graphics plus Gemini vector SVG generation.
             </p>
           </div>
           
           <form onSubmit={generateInfographic} className="space-y-4">
             <div className="flex flex-col md:flex-row gap-3">
               <div className="flex-1 relative">
                 <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                 <input 
                   type="text" 
                   value={topic}
                   onChange={e => setTopic(e.target.value)}
                   placeholder="e.g., Photosynthesis Calvin Cycle, Dijkstra Algorithm, Quantum Entanglement..."
                   className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 transition-colors text-slate-800 dark:text-slate-100"
                 />
               </div>
               
               <select 
                 value={type} 
                 onChange={e => setType(e.target.value as any)}
                 className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm outline-none focus:border-indigo-500 transition-colors md:w-44 text-slate-700 dark:text-slate-200 font-medium"
               >
                 <option value="mind map">🧠 Mind Map</option>
                 <option value="flowchart">🔀 Flowchart</option>
                 <option value="infographic">📊 Infographic</option>
                 <option value="architecture">🏛️ Architecture</option>
               </select>

               <select 
                 value={engineMode} 
                 onChange={e => setEngineMode(e.target.value as any)}
                 className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm outline-none focus:border-indigo-500 transition-colors md:w-56 text-slate-700 dark:text-slate-200 font-medium"
               >
                 <option value="dual">✨ Dual (Visual + SVG)</option>
                 <option value="nano-banana">🍌 Nano Banana (ChatGPT Visual)</option>
                 <option value="vector-svg">📐 Vector SVG Only</option>
               </select>
               
               <button 
                 type="submit" 
                 disabled={!topic.trim() || loading}
                 className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-900/50 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 shrink-0 text-sm"
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                 Generate
               </button>
             </div>

             {/* Quick Subject Chips */}
             <div className="flex items-center gap-2 flex-wrap pt-1">
               <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Try quick topic:</span>
               {QUICK_TOPICS.map((item, i) => (
                 <button
                   key={i}
                   type="button"
                   onClick={() => {
                     setTopic(item.label);
                     setType(item.type);
                   }}
                   className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition border border-slate-200 dark:border-slate-700"
                 >
                   {item.label}
                 </button>
               ))}
             </div>
           </form>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-sm min-h-[420px]">
             <div className="relative mb-6">
               <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                 <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
               </div>
               <div className="absolute top-0 right-0 -mt-2 -mr-2">
                 <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
               </div>
             </div>
             <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display mb-1.5">
               Synthesizing {type} via Nano Banana Visual Engine...
             </h3>
             <p className="text-slate-500 text-xs max-w-md">
               Crafting ChatGPT DALL-E 3 aesthetic layout with modular nodes, vibrant palettes, and precision vector paths.
             </p>
          </div>
        )}
        
        {/* Results View */}
        {(imageUrl || svgContent) && !loading && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in overflow-hidden flex flex-col">
            {/* Header with Tab Switching & Downloads */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60">
              
              {/* Output Tab Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-700/60 p-1 rounded-xl">
                {imageUrl && (
                  <button
                    onClick={() => setActiveTab("visual")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      activeTab === "visual"
                        ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    ChatGPT Style Visual
                  </button>
                )}
                {svgContent && (
                  <button
                    onClick={() => setActiveTab("svg")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      activeTab === "svg"
                        ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Interactive Vector SVG
                  </button>
                )}
                {imageUrl && svgContent && (
                  <button
                    onClick={() => setActiveTab("both")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      activeTab === "both"
                        ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Side-by-Side Dual View
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {imageUrl && (
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Full Image
                  </a>
                )}
                {svgContent && (
                  <button 
                    onClick={downloadSvg}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-semibold text-white shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download SVG
                  </button>
                )}
              </div>
            </div>
            
            {/* Display Body */}
            <div className="p-6 bg-slate-900 min-h-[500px]">
               {activeTab === "visual" && imageUrl && (
                 <div className="flex flex-col items-center justify-center">
                   <div className="max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                     <img 
                       src={imageUrl} 
                       alt={topic} 
                       className="w-full h-auto object-contain max-h-[640px]"
                     />
                   </div>
                   <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
                     <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                     Generated with Nano Banana Visual Engine in signature ChatGPT DALL-E 3 aesthetic
                   </p>
                 </div>
               )}

               {activeTab === "svg" && svgContent && (
                 <div className="flex flex-col items-center justify-center overflow-auto p-4">
                   <div 
                     className="w-full max-w-4xl flex items-center justify-center"
                     dangerouslySetInnerHTML={{ __html: svgContent }} 
                   />
                 </div>
               )}

               {activeTab === "both" && imageUrl && svgContent && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <div className="flex flex-col">
                     <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                       <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                       ChatGPT DALL-E 3 Style Visual
                     </div>
                     <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 flex items-center justify-center p-2">
                       <img src={imageUrl} alt={topic} className="w-full h-auto object-contain rounded-xl max-h-[480px]" />
                     </div>
                   </div>

                   <div className="flex flex-col">
                     <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                       <Layers className="w-3.5 h-3.5 text-emerald-400" />
                       Interactive Vector SVG
                     </div>
                     <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 flex items-center justify-center p-4">
                       <div 
                         className="w-full h-full flex items-center justify-center"
                         dangerouslySetInnerHTML={{ __html: svgContent }} 
                       />
                     </div>
                   </div>
                 </div>
               )}
            </div>

            {/* Footer info */}
            {modelUsed && (
              <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Model: <strong>{modelUsed}</strong></span>
                <span>Topic: <strong>{topic}</strong> ({type})</span>
              </div>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}
