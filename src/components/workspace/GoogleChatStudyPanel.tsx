import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, RefreshCw, AlertCircle, Users, Hash, Clock, User } from 'lucide-react';
import { 
  fetchChatSpaces, 
  fetchChatMessages, 
  sendChatMessage, 
  ChatSpaceItem, 
  ChatMessageItem 
} from '../../services/googleWorkspace';
import { WorkspaceConfirmationModal } from './WorkspaceConfirmationModal';

interface GoogleChatStudyPanelProps {
  token: string | null;
  onRequestAuth: () => void;
}

export const GoogleChatStudyPanel: React.FC<GoogleChatStudyPanelProps> = ({ token, onRequestAuth }) => {
  const [spaces, setSpaces] = useState<ChatSpaceItem[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ChatSpaceItem | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newMessageText, setNewMessageText] = useState('');
  const [isConfirmSendOpen, setIsConfirmSendOpen] = useState(false);

  const loadSpaces = async () => {
    if (!token) return;
    setLoadingSpaces(true);
    setError(null);
    try {
      const data = await fetchChatSpaces(token);
      setSpaces(data);
      if (data.length > 0 && !selectedSpace) {
        setSelectedSpace(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to load Google Chat spaces:', err);
      setError(err?.message || 'Could not load Google Chat spaces.');
    } finally {
      setLoadingSpaces(false);
    }
  };

  const loadMessages = async (spaceName: string) => {
    if (!token) return;
    setLoadingMessages(true);
    setError(null);
    try {
      const msgs = await fetchChatMessages(token, spaceName);
      setMessages(msgs);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      setError(err?.message || 'Could not load space messages.');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadSpaces();
    }
  }, [token]);

  useEffect(() => {
    if (token && selectedSpace) {
      loadMessages(selectedSpace.name);
    }
  }, [token, selectedSpace]);

  const handlePromptSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedSpace) return;
    setIsConfirmSendOpen(true);
  };

  const handleConfirmSend = async () => {
    if (!token || !selectedSpace) return;
    setIsConfirmSendOpen(false);
    try {
      await sendChatMessage(token, selectedSpace.name, newMessageText.trim());
      setNewMessageText('');
      await loadMessages(selectedSpace.name);
    } catch (err: any) {
      console.error('Failed to post message:', err);
      setError(err?.message || 'Failed to post message to Google Chat.');
    }
  };

  if (!token) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Connect Google Chat</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Collaborate in real time with classmates, professors, and study groups via your authorized Google Chat spaces.
        </p>
        <button
          onClick={onRequestAuth}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-all shadow-sm"
        >
          <span>Connect Google Account</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Google Chat Study Spaces
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                Connected
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct discussions with study circles and collaborative workspaces
            </p>
          </div>
        </div>

        <button
          onClick={loadSpaces}
          disabled={loadingSpaces}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors w-fit"
          title="Refresh chat spaces"
        >
          <RefreshCw className={`w-4 h-4 ${loadingSpaces ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Spaces List on left, active chat on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Spaces Sidebar */}
        <div className="md:col-span-4 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
            Available Spaces ({spaces.length})
          </div>
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {spaces.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">
                {loadingSpaces ? 'Loading spaces...' : 'No Google Chat spaces found for your account.'}
              </div>
            ) : (
              spaces.map((space) => {
                const isSelected = selectedSpace?.name === space.name;
                return (
                  <button
                    key={space.name}
                    onClick={() => setSelectedSpace(space)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{space.displayName}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Area */}
        <div className="md:col-span-8 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[320px] bg-white dark:bg-slate-900">
          {selectedSpace ? (
            <>
              {/* Space Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {selectedSpace.displayName}
                  </span>
                </div>
                <button
                  onClick={() => loadMessages(selectedSpace.name)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingMessages ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Message Feed */}
              <div className="space-y-3 py-3 overflow-y-auto max-h-64 flex-1">
                {messages.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    {loadingMessages ? 'Loading chat messages...' : 'No messages in this space yet.'}
                  </div>
                ) : (
                  messages.map((m, idx) => (
                    <div key={m.name || idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {m.sender?.displayName || 'Chat Participant'}
                        </span>
                        <span>{new Date(m.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200">{m.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Send Input */}
              <form onSubmit={handlePromptSend} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  placeholder={`Message in ${selectedSpace.displayName}...`}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={!newMessageText.trim()}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Select a chat space from the left to view messages.
            </div>
          )}
        </div>
      </div>

      {/* Mandatory User Confirmation Dialog before sending message to Google Chat */}
      <WorkspaceConfirmationModal
        isOpen={isConfirmSendOpen}
        title="Confirm Google Chat Message"
        description="Are you sure you want to post this message into the Google Chat space?"
        confirmLabel="Post Message"
        details={[
          { label: 'Chat Space', value: selectedSpace?.displayName || '' },
          { label: 'Message Text', value: newMessageText },
        ]}
        onConfirm={handleConfirmSend}
        onCancel={() => setIsConfirmSendOpen(false)}
      />
    </div>
  );
};
