import React, { useState, useEffect } from 'react';
import { 
  History, Search, Bookmark, Trash2, ExternalLink, 
  BookOpen, Calendar, Filter, X
} from 'lucide-react';
import { HomeworkHelperService, HomeworkHistoryItem } from '../../services/homeworkHelperService';

interface HomeworkHistoryDrawerProps {
  onSelectHistoryItem: (item: HomeworkHistoryItem) => void;
  onClose: () => void;
}

export const HomeworkHistoryDrawer: React.FC<HomeworkHistoryDrawerProps> = ({
  onSelectHistoryItem,
  onClose
}) => {
  const [history, setHistory] = useState<HomeworkHistoryItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [filterBookmarkOnly, setFilterBookmarkOnly] = useState<boolean>(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(HomeworkHelperService.getHistory());
  };

  const handleToggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    HomeworkHelperService.toggleBookmarkHistory(id);
    loadHistory();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    HomeworkHelperService.deleteHistory(id);
    loadHistory();
  };

  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Coding', 'English'];

  const filtered = history.filter((item) => {
    const matchesSearch = item.question.toLowerCase().includes(search.toLowerCase()) || item.topic.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchesBookmark = !filterBookmarkOnly || item.bookmarked;
    return matchesSearch && matchesSubject && matchesBookmark;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-lg text-slate-100">Homework History</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search past questions or topics..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
            <div className="flex gap-1">
              {subjects.slice(0, 4).map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    selectedSubject === subj
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            <button
              onClick={() => setFilterBookmarkOnly(!filterBookmarkOnly)}
              className={`p-1.5 rounded-lg border text-xs ${
                filterBookmarkOnly ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* History Item List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No saved homework sessions found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className="bg-slate-950 border border-slate-800 hover:border-indigo-500/40 p-4 rounded-xl cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-indigo-400 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30">
                    {item.subject} • {item.topic}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-200 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                  "{item.question}"
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-xs">
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Answer: {item.solution.finalAnswer}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleBookmark(e, item.id)}
                      className={`p-1 rounded hover:bg-slate-800 ${item.bookmarked ? 'text-amber-400' : 'text-slate-600'}`}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-1 rounded text-slate-600 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
