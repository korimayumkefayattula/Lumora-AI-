import React, { useState } from 'react';
import { 
  Users, Copy, Check, Radio, Link as LinkIcon, Sparkles, X, 
  UserCheck, ShieldAlert, LogIn, Plus, ArrowRight, Zap, RefreshCw 
} from 'lucide-react';
import { CollaboratorUser } from '../../services/firebaseWebBuilderService';

interface SharedWorkspaceModalProps {
  currentRoomId: string | null;
  collaborators: CollaboratorUser[];
  isJoined: boolean;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  onClose: () => void;
  onForceSync: () => void;
}

export const SharedWorkspaceModal: React.FC<SharedWorkspaceModalProps> = ({
  currentRoomId,
  collaborators,
  isJoined,
  onJoinRoom,
  onLeaveRoom,
  onClose,
  onForceSync
}) => {
  const [inputRoomId, setInputRoomId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const generateNewRoomCode = () => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const nums = '23456789';
    let code = 'ROOM-';
    for (let i = 0; i < 3; i++) code += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 3; i++) code += nums.charAt(Math.floor(Math.random() * nums.length));
    return code;
  };

  const handleCreateNew = () => {
    const newCode = generateNewRoomCode();
    onJoinRoom(newCode);
  };

  const handleJoinInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRoomId.trim()) return;
    onJoinRoom(inputRoomId.trim().toUpperCase());
  };

  const copyRoomInvite = () => {
    const inviteUrl = `${window.location.origin}/student/web-builder?collab=${currentRoomId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-100 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between border-b border-slate-800/80 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Live Shared Workspace</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Firebase Realtime DB
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Co-edit HTML, CSS & JS simultaneously with your classmates in real time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-5">
          {isJoined && currentRoomId ? (
            <div className="space-y-4">
              {/* Active Room Status */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live Multiplayer Session Active
                  </span>
                  <span className="text-xs font-mono font-black text-white bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    {currentRoomId}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  All code changes are automatically synchronized across all connected browsers using Firebase Realtime Database.
                </p>
              </div>

              {/* Share invite link */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Share Room Invite Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/student/web-builder?collab=${currentRoomId}`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 select-all focus:outline-hidden"
                  />
                  <button
                    onClick={copyRoomInvite}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Active Collaborators Presence List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Connected Students ({collaborators.length})</span>
                  <button
                    onClick={onForceSync}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync State</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {collaborators.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-center">
                      Waiting for classmates to join with your Room Code...
                    </div>
                  ) : (
                    collaborators.map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-xs"
                            style={{ backgroundColor: c.color || '#6366f1' }}
                          >
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{c.name}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            </div>
                            <span className="text-[10px] text-slate-400">{c.email}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-900/50">
                          {c.activeFile ? `Editing ${c.activeFile}` : 'Active'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Leave Room Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={onLeaveRoom}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition"
                >
                  Leave Shared Room
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Create or Join Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Create New Room */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-black text-white">Start New Room</h4>
                    <p className="text-[11px] text-slate-400">
                      Generate an instant collaboration room code and invite classmates to build together.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create Room</span>
                  </button>
                </div>

                {/* Option 2: Join Existing Room */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 transition space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                      <LogIn className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-black text-white">Join with Code</h4>
                    <p className="text-[11px] text-slate-400">
                      Enter a 6-digit room code shared by your classmate or project partner.
                    </p>
                  </div>

                  <form onSubmit={handleJoinInput} className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. ROOM-ABC123"
                      value={inputRoomId}
                      onChange={(e) => setInputRoomId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder:text-slate-500 uppercase focus:outline-hidden focus:border-rose-500"
                    />
                    <button
                      type="submit"
                      disabled={!inputRoomId.trim()}
                      className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                    >
                      <span>Join Room</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Collaborative Features Info Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  Features sub-second updates, live typing indicator, and conflict-free peer updates using Google Firebase infrastructure.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
