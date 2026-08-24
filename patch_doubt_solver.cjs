const fs = require('fs');
const code = `
import React, { useState, useRef, useEffect } from 'react';
import { Upload, File, Book, Folder, MessageSquare, Search, Send, Sparkles, FileText, Layers, GitMerge, Network, ChevronRight, X, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface UploadedFile {
  id: string;
  name: string;
  data: string; // base64
  mimeType: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export default function AIDoubtSolver() {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      newFiles.push({
        id: Math.random().toString(),
        name: file.name,
        data,
        mimeType: file.type
      });
    }
    setFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleAsk = async (textToAsk: string) => {
    const q = textToAsk || query;
    if (!q.trim() || loading) return;
    if (files.length === 0) {
      alert("Please upload at least one document first!");
      return;
    }

    const userMsg: ChatMessage = { id: Math.random().toString(), sender: "user", text: q };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/notebook-lm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          files: files.map(f => ({ data: f.data, mimeType: f.mimeType, name: f.name }))
        })
      });
      const data = await res.json();
      if (data.answer) {
        setMessages(prev => [...prev, { id: Math.random().toString(), sender: "ai", text: data.answer }]);
      } else {
        alert(data.error || "Failed to get answer");
      }
    } catch (err) {
      alert("Error reaching server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-slate-900 flex overflow-hidden">
      
      {/* Left Sidebar - Documents */}
      <div className="w-72 border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <input type="file" ref={fileInputRef} className="hidden" multiple accept="application/pdf,.txt,.md" onChange={handleFileUpload} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-3 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            Upload Sources
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">Uploaded Sources</h3>
            {files.length === 0 ? (
              <p className="text-sm text-slate-500 px-2 italic">No sources uploaded yet.</p>
            ) : (
              <div className="space-y-1">
                {files.map(file => (
                  <div key={file.id} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(file.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Middle Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 relative">
        <div className="h-14 border-b border-slate-200 dark:border-slate-700 flex items-center px-6 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100 font-display">Doubt Solver</h2>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
          <div className="max-w-3xl mx-auto space-y-8 pb-32">
            
            {messages.length === 0 ? (
              <div className="text-center py-10 animate-fade-in">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-display mb-2">What would you like to understand?</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">Upload PDFs on the left, then ask a question. I'll reason across your sources to find the exact answer.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <button onClick={() => handleAsk("Explain the process of photosynthesis with chemical equation.")} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-800 transition-all group shadow-sm hover:shadow-md">
                    <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">Explain photosynthesis</h4>
                    <p className="text-xs text-slate-500">Requires a Biology PDF</p>
                  </button>
                  <button onClick={() => handleAsk("What are Newton's three laws of motion? Give examples.")} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-800 transition-all group shadow-sm hover:shadow-md">
                    <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">Newton's Laws of Motion</h4>
                    <p className="text-xs text-slate-500">Requires a Physics PDF</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map(msg => (
                  <div key={msg.id} className={\`flex gap-4 \${msg.sender === "user" ? "flex-row-reverse" : ""}\`}>
                    <div className={\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 \${msg.sender === "user" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}\`}>
                      {msg.sender === "user" ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div className={\`max-w-[80%] rounded-2xl p-5 shadow-sm \${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200"}\`}>
                       {msg.sender === "user" ? (
                         <p>{msg.text}</p>
                       ) : (
                         <div className="markdown-body prose dark:prose-invert max-w-none text-sm">
                           <ReactMarkdown>{msg.text}</ReactMarkdown>
                         </div>
                       )}
                    </div>
                  </div>
                ))}
                {loading && (
                   <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-purple-100 text-purple-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center gap-2">
                       <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                       <span className="text-sm text-slate-500 font-medium">Reasoning across documents...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
            
          </div>
        </div>
        
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-white via-white dark:from-slate-900 dark:via-slate-900 to-transparent">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleAsk(query); }} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-2 pl-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about anything in your documents..."
                className="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
              />
              <button type="submit" disabled={loading || !query.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">LuminatiAI reasons across your sources to provide accurate answers.</p>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar - Generated Artifacts */}
      <div className="w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 flex flex-col hidden xl:flex">
        <div className="h-14 border-b border-slate-200 dark:border-slate-700 flex items-center px-6 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Study Artifacts</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-xs text-slate-500 px-1 mb-4">When you ask questions, AI generates these study aids for you.</p>
          
          <button className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow text-left flex items-start gap-3 group">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Study Notes</h4>
              <p className="text-[11px] text-slate-500 mt-1">Structured notes from response</p>
            </div>
          </button>
          
          <button className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow text-left flex items-start gap-3 group">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Flashcards</h4>
              <p className="text-[11px] text-slate-500 mt-1">Generated Q&A for active recall</p>
            </div>
          </button>
          
          <button className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow text-left flex items-start gap-3 group">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Mind Map</h4>
              <p className="text-[11px] text-slate-500 mt-1">Visual concept connection</p>
            </div>
          </button>
          
        </div>
      </div>
      
    </div>
  );
}
`
fs.writeFileSync('src/pages/AIDoubtSolver.tsx', code);
console.log("Patched AIDoubtSolver.tsx");
