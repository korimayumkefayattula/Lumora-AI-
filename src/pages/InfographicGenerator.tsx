import React, { useState } from 'react';
import { Network, Sparkles, Loader2, Download, Image as ImageIcon, Search } from 'lucide-react';

export default function InfographicGenerator() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("mind map");
  const [loading, setLoading] = useState(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);

  const generateInfographic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    
    setLoading(true);
    setSvgContent(null);
    
    try {
      const res = await fetch("/api/generate-infographic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, type })
      });
      const data = await res.json();
      if (data.svg) {
        setSvgContent(data.svg);
      } else {
        alert(data.error || "Failed to generate infographic");
      }
    } catch(err) {
      alert("Error reaching server");
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
    a.download = `luminati_${topic.replace(/\s+/g, '_')}_${type.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900 p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
             <Network className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-white">Visual Mind Maps</h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in">
           <div className="mb-8">
             <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Generate Visual Study Aids</h2>
             <p className="text-slate-500 text-sm mt-1">Convert any topic into a beautiful SVG mind map or infographic using AI.</p>
           </div>
           
           <form onSubmit={generateInfographic} className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 relative">
               <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 value={topic}
                 onChange={e => setTopic(e.target.value)}
                 placeholder="e.g. The Solar System, History of the Internet, Cell Biology..."
                 className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-indigo-500 transition-colors"
               />
             </div>
             
             <select 
               value={type} 
               onChange={e => setType(e.target.value)}
               className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 px-4 outline-none focus:border-indigo-500 transition-colors md:w-48"
             >
               <option value="mind map">Mind Map</option>
               <option value="infographic">Infographic</option>
               <option value="flowchart">Flowchart</option>
             </select>
             
             <button 
               type="submit" 
               disabled={!topic.trim() || loading}
               className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 shrink-0"
             >
               <Sparkles className="w-5 h-5" />
               Generate
             </button>
           </form>
        </div>
        
        {loading && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-20 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-sm h-[500px]">
             <div className="relative mb-6">
               <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                 <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
               </div>
               <div className="absolute top-0 right-0 -mt-2 -mr-2">
                 <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
               </div>
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-white font-display mb-2">Designing your {type}...</h3>
             <p className="text-slate-500 text-sm max-w-sm">Our AI is mapping out the concepts and generating beautiful vector graphics.</p>
          </div>
        )}
        
        {svgContent && !loading && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                <ImageIcon className="w-4 h-4" />
                Vector Output Generated
              </div>
              <button 
                onClick={downloadSvg}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors shadow-sm text-slate-700 dark:text-slate-200"
              >
                <Download className="w-4 h-4" />
                Download SVG
              </button>
            </div>
            
            <div className="p-6 md:p-10 flex items-center justify-center min-h-[500px] overflow-auto bg-slate-50 dark:bg-slate-900/50 checkerboard-bg">
               {/* Dangerously set SVG. In production, we should sanitize it. */}
               <div 
                 className="w-full h-full flex items-center justify-center max-w-4xl"
                 dangerouslySetInnerHTML={{ __html: svgContent }} 
               />
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
