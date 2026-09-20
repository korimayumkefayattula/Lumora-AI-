import React, { useState } from 'react';
import { 
  Quote, Sparkles, Volume2, VolumeX, Copy, Check, 
  Share2, Heart, RefreshCw, BookOpen, Brain, Download, 
  MessageSquare, Star, ArrowRight, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SCHOLAR_QUOTES, ScholarQuote, QUOTE_CATEGORIES } from '../data/scholarQuotesData';

export default function ScholarQuotesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Quotes');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [savedQuoteIds, setSavedQuoteIds] = useState<string[]>([]);
  const [randomQuoteIndex, setRandomQuoteIndex] = useState(0);

  const filteredQuotes = SCHOLAR_QUOTES.filter(q => 
    selectedCategory === 'All Quotes' || q.category === selectedCategory
  );

  const featuredDailyQuote = SCHOLAR_QUOTES[randomQuoteIndex % SCHOLAR_QUOTES.length];

  const handleCopyQuote = (q: ScholarQuote) => {
    navigator.clipboard.writeText(`"${q.quote}" — ${q.author} (${q.title})`);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakQuote = (q: ScholarQuote) => {
    if ('speechSynthesis' in window) {
      if (speakingId === q.id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`"${q.quote}". Spoken by ${q.author}, ${q.title}.`);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(q.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSaveQuote = (id: string) => {
    setSavedQuoteIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleShuffleQuote = () => {
    setRandomQuoteIndex(prev => (prev + 1) % SCHOLAR_QUOTES.length);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Quote className="w-4 h-4" />
            <span>Wisdom & Intellectual Fuel • Lumora Sanctuary</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Famous Quotes by Intellectual Giants
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1.5 max-w-2xl">
            Inspirational words from the greatest scientists, mathematicians, and philosophers to overcome study plateaus, conquer exam anxiety, and sustain deep focus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffleQuote}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-rose-500 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-rose-500" />
            <span>Shuffle Daily Wisdom</span>
          </button>
        </div>
      </div>

      {/* Hero Featured Daily Quote Card */}
      <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-4 right-6 text-slate-800 pointer-events-none opacity-20 text-9xl font-serif">
          “
        </div>

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-600/30 text-rose-300 border border-rose-500/40">
              Mentor's Quote of the Day
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Category: {featuredDailyQuote.category}
            </span>
          </div>

          <blockquote className="text-xl sm:text-3xl font-serif font-medium leading-relaxed tracking-tight text-slate-100">
            "{featuredDailyQuote.quote}"
          </blockquote>

          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${featuredDailyQuote.accentColor} flex items-center justify-center font-bold text-lg shadow-lg`}>
              {featuredDailyQuote.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-white">
                {featuredDailyQuote.author}
              </div>
              <div className="text-xs text-slate-400">
                {featuredDailyQuote.title} • <span className="text-slate-500">{featuredDailyQuote.era}</span>
              </div>
            </div>
          </div>

          {/* Practical Application for Today's Study */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
            <div className="text-xs font-black text-rose-400 flex items-center gap-1.5">
              <Brain className="w-4 h-4" />
              <span>AI Mentor's Practical Application for Your Study Today:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {featuredDailyQuote.reflectionPrompt}
            </p>
          </div>

          {/* Card Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleSpeakQuote(featuredDailyQuote)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all"
            >
              {speakingId === featuredDailyQuote.id ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
              <span>{speakingId === featuredDailyQuote.id ? 'Stop Narration' : 'Listen Aloud'}</span>
            </button>

            <button
              onClick={() => handleCopyQuote(featuredDailyQuote)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all"
            >
              {copiedId === featuredDailyQuote.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === featuredDailyQuote.id ? 'Copied to Clipboard!' : 'Copy Quote'}</span>
            </button>

            <button
              onClick={() => navigate('/student/mentors')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/40"
            >
              <span>Consult an AI Scholar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {QUOTE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl font-bold shrink-0 transition-all ${
              selectedCategory === category
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Quote Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((q) => (
          <div
            key={q.id}
            className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {q.category}
                </span>

                <button
                  onClick={() => toggleSaveQuote(q.id)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    savedQuoteIds.includes(q.id) ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                  }`}
                  title="Save Quote"
                >
                  <Heart className={`w-4 h-4 ${savedQuoteIds.includes(q.id) ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <blockquote className="text-sm sm:text-base font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                "{q.quote}"
              </blockquote>

              <div className="flex items-center gap-3 pt-2">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${q.accentColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                  {q.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">{q.author}</div>
                  <div className="text-[10px] text-slate-400">{q.title}</div>
                </div>
              </div>

              {/* Mentor Reflection */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                <span className="font-bold text-rose-500 block mb-0.5">Study Cue:</span>
                {q.reflectionPrompt}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-4">
              <button
                onClick={() => handleSpeakQuote(q)}
                className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{speakingId === q.id ? 'Playing...' : 'Audio'}</span>
              </button>

              <button
                onClick={() => handleCopyQuote(q)}
                className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 flex items-center gap-1"
              >
                {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === q.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
