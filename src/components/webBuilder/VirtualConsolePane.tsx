import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, Trash2, Copy, Check, Filter, Search, ChevronDown, 
  ChevronUp, AlertCircle, AlertTriangle, Info, Play, CornerDownLeft,
  Maximize2, Minimize2, Sparkles, RefreshCw
} from 'lucide-react';

export interface ConsoleLogMessage {
  id: string;
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  count?: number;
}

interface VirtualConsolePaneProps {
  logs: ConsoleLogMessage[];
  onClear: () => void;
  onExecuteCommand?: (cmd: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  maxHeight?: string;
}

export const VirtualConsolePane: React.FC<VirtualConsolePaneProps> = ({
  logs,
  onClear,
  onExecuteCommand,
  isOpen,
  onToggle,
  maxHeight = '280px'
}) => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'log' | 'warn' | 'error'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [replInput, setReplInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const errorCount = logs.filter(l => l.level === 'error').length;
  const warnCount = logs.filter(l => l.level === 'warn').length;
  const infoCount = logs.filter(l => l.level === 'log' || l.level === 'info').length;

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'all') {
      if (filterLevel === 'log' && log.level !== 'log' && log.level !== 'info') return false;
      if (filterLevel === 'warn' && log.level !== 'warn') return false;
      if (filterLevel === 'error' && log.level !== 'error') return false;
    }
    if (searchQuery.trim()) {
      return log.message.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (isOpen) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.length, isOpen]);

  const handleCopyLogs = () => {
    const text = logs
      .map(l => `[${l.timestamp}] [${l.level.toUpperCase()}]: ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text || 'No console logs.');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replInput.trim()) return;
    if (onExecuteCommand) {
      onExecuteCommand(replInput.trim());
    }
    setReplInput('');
  };

  return (
    <div className="w-full bg-slate-950 border-t border-slate-800 flex flex-col transition-all z-20 text-xs font-mono shadow-2xl">
      
      {/* Console Top Bar / Header */}
      <div className="px-3 py-2 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 text-slate-200 hover:text-white font-bold transition group"
            title={isOpen ? 'Collapse Virtual Console' : 'Expand Virtual Console'}
          >
            <div className="w-5 h-5 rounded-md bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/40">
              <Terminal className="w-3 h-3" />
            </div>
            <span className="font-sans font-bold text-xs tracking-wide">Virtual Sandbox Console</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Counts summary */}
          <div className="flex items-center gap-1.5 ml-1">
            {errorCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" />
                <span>{errorCount}</span>
              </span>
            )}
            {warnCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>{warnCount}</span>
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold">
              {logs.length} logs
            </span>
          </div>
        </div>

        {/* Console Controls (when open) */}
        {isOpen && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Pills */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setFilterLevel('all')}
                className={`px-2 py-0.5 rounded font-sans font-semibold transition ${
                  filterLevel === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterLevel('log')}
                className={`px-2 py-0.5 rounded font-sans font-semibold transition ${
                  filterLevel === 'log' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Logs ({infoCount})
              </button>
              <button
                onClick={() => setFilterLevel('warn')}
                className={`px-2 py-0.5 rounded font-sans font-semibold transition ${
                  filterLevel === 'warn' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                Warn ({warnCount})
              </button>
              <button
                onClick={() => setFilterLevel('error')}
                className={`px-2 py-0.5 rounded font-sans font-semibold transition ${
                  filterLevel === 'error' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-rose-300'
                }`}
              >
                Errors ({errorCount})
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter logs..."
                className="pl-6 pr-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 w-28 sm:w-36 font-sans"
              />
            </div>

            {/* Copy Logs */}
            <button
              onClick={handleCopyLogs}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Copy all logs to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Clear Console */}
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition"
              title="Clear console output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen Expand */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title={isExpanded ? 'Restore Console Size' : 'Expand Console Size'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Console Output Body */}
      {isOpen && (
        <div 
          className="overflow-y-auto p-2.5 space-y-1 select-text bg-slate-950"
          style={{ height: isExpanded ? '460px' : maxHeight }}
        >
          {filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-slate-600 font-sans space-y-1">
              <Terminal className="w-8 h-8 mx-auto opacity-30 text-indigo-400" />
              <p className="text-xs font-semibold text-slate-500">Virtual sandbox console is clean and active.</p>
              <p className="text-[11px] text-slate-600 font-mono">
                Execute code or run <span className="text-cyan-400">console.log("Hello Lumora")</span> to see live runtime output!
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isError = log.level === 'error';
              const isWarn = log.level === 'warn';
              const isInfo = log.level === 'info' || log.level === 'log';

              return (
                <div
                  key={log.id}
                  className={`flex items-start gap-2.5 px-2.5 py-1.5 rounded-lg border leading-relaxed break-all ${
                    isError
                      ? 'bg-rose-950/30 border-rose-900/60 text-rose-300'
                      : isWarn
                      ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                      : 'bg-slate-900/40 border-slate-900 text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isError ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <span className="text-cyan-500 font-bold">›</span>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 shrink-0 font-mono select-none">
                    {log.timestamp}
                  </span>

                  <span className="flex-1 font-mono whitespace-pre-wrap">
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>
      )}

      {/* Interactive REPL / Command Line Input Bar */}
      {isOpen && (
        <form onSubmit={handleReplSubmit} className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-cyan-400 font-bold font-mono">›</span>
          <input
            type="text"
            value={replInput}
            onChange={(e) => setReplInput(e.target.value)}
            placeholder="Evaluate JavaScript expression in live sandbox (e.g. console.log(window.innerWidth) or Math.PI * 2)..."
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none text-xs font-mono"
          />
          <button
            type="submit"
            disabled={!replInput.trim()}
            className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-sans text-xs font-bold flex items-center gap-1 transition"
          >
            <span>Run</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>
      )}
    </div>
  );
};
