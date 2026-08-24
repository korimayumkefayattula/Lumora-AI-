import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Send, Sparkles, Plus, Bookmark } from 'lucide-react';

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  subject: string;
  title: string;
  content: string;
  likes: number;
  commentsCount: number;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Aarav Sharma (Class 12 CBSE)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      time: '2 hours ago',
      subject: 'Physics',
      title: 'Easy trick to remember Lens Formula vs Mirror Formula sign conventions!',
      content: 'Always measure distances from the optical center. Real images have negative v for mirrors and positive v for lenses. Lumora AI verified this method!',
      likes: 24,
      commentsCount: 6
    },
    {
      id: '2',
      author: 'Priya Patel (JEE Aspirant)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      time: '5 hours ago',
      subject: 'Chemistry',
      title: 'How many hours are you guys studying daily for boards?',
      content: 'Following Lumora AI study planner with 6 hours daily. Streak is at 18 days now!',
      likes: 42,
      commentsCount: 15
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSubject, setNewSubject] = useState('Physics');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item: CommunityPost = {
      id: Date.now().toString(),
      author: 'Alex Morgan (You)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: 'Just now',
      subject: newSubject,
      title: newTitle,
      content: newContent,
      likes: 1,
      commentsCount: 0
    };
    setPosts([item, ...posts]);
    setNewTitle('');
    setNewContent('');
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Lumora Student Peer Network</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Community Study Forum & Groups
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Post Form */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-500" />
            <span>Ask Question or Share Study Tip</span>
          </h2>

          <form onSubmit={handleCreatePost} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Subject</label>
              <select 
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold dark:text-white"
              >
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
                <option>Biology</option>
                <option>General Discussion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Title</label>
              <input 
                type="text"
                placeholder="Question or Discussion topic..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Details</label>
              <textarea 
                rows={3}
                placeholder="Explain your doubt or study method..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none dark:text-white"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post to Community</span>
            </button>
          </form>
        </div>

        {/* Community Feed */}
        <div className="lg:col-span-8 space-y-4">
          {posts.map(post => (
            <div key={post.id} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white">{post.author}</h3>
                    <span className="text-[10px] text-slate-400">{post.time}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-bold">
                  {post.subject}
                </span>
              </div>

              <h2 className="font-bold text-sm text-slate-900 dark:text-white">{post.title}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{post.content}</p>

              <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 font-bold"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes} Upvotes</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 font-bold">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentsCount} Replies</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
