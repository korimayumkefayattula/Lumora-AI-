import React, { useState, useEffect } from 'react';
import { Mail, Send, RefreshCw, AlertCircle, CheckCircle2, User, Clock, Inbox, ArrowUpRight } from 'lucide-react';
import { fetchRecentEmails, sendEmail, GmailMessagePreview } from '../../services/googleWorkspace';
import { WorkspaceConfirmationModal } from './WorkspaceConfirmationModal';

interface GmailStudyInboxPanelProps {
  token: string | null;
  onRequestAuth: () => void;
}

export const GmailStudyInboxPanel: React.FC<GmailStudyInboxPanelProps> = ({ token, onRequestAuth }) => {
  const [emails, setEmails] = useState<GmailMessagePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compose State
  const [showCompose, setShowCompose] = useState(false);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);

  // Confirmation Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const loadEmails = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecentEmails(token, 8);
      setEmails(data);
    } catch (err: any) {
      console.error('Failed to load Gmail messages:', err);
      setError(err?.message || 'Could not load Gmail inbox.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadEmails();
    }
  }, [token]);

  const handlePromptSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || !subject.trim() || !body.trim()) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmSend = async () => {
    if (!token) return;
    setIsConfirmOpen(false);
    setLoading(true);
    setError(null);
    try {
      await sendEmail(token, to.trim(), subject.trim(), body.trim());
      setTo('');
      setSubject('');
      setBody('');
      setShowCompose(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 5000);
      await loadEmails();
    } catch (err: any) {
      console.error('Email sending failed:', err);
      setError(err?.message || 'Failed to send email.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Connect Gmail for Academic Updates</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Read academic communications, assignment notifications, and send messages directly from your Lumora workspace.
        </p>
        <button
          onClick={onRequestAuth}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-all shadow-sm"
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
          <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Gmail Academic Inbox
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                Connected
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronized with your official Google Gmail account
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadEmails}
            disabled={loading}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Refresh inbox"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{showCompose ? 'Close Compose' : 'Compose Email'}</span>
          </button>
        </div>
      </div>

      {sendSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Email successfully sent through your Gmail account!</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Compose Form */}
      {showCompose && (
        <form onSubmit={handlePromptSend} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
            Compose New Email (Sent via your authorized Gmail account)
          </div>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Recipient Email (e.g. professor@school.edu or classmate@domain.com)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
            <input
              type="text"
              placeholder="Subject (e.g. Doubt Regarding Thermodynamics Assignment)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
            <textarea
              rows={4}
              placeholder="Write your email content here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowCompose(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
            >
              Review & Send Email
            </button>
          </div>
        </form>
      )}

      {/* Messages List */}
      <div className="space-y-2.5">
        {emails.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            {loading ? 'Fetching recent emails from Gmail...' : 'No recent emails found in your primary inbox.'}
          </div>
        ) : (
          emails.map((msg) => (
            <div
              key={msg.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300/80 transition-all bg-slate-50/40 dark:bg-slate-800/30 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {msg.subject}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {msg.date ? new Date(msg.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <User className="w-3 h-3 text-slate-400" />
                <span className="truncate">{msg.from}</span>
              </div>
              {msg.snippet && (
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {msg.snippet}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Mandatory User Confirmation Dialog before sending an email */}
      <WorkspaceConfirmationModal
        isOpen={isConfirmOpen}
        title="Confirm Sending Gmail Message"
        description="Are you sure you want to send this email through your connected Google Account? This will dispatch a real email message."
        confirmLabel="Yes, Send Email"
        details={[
          { label: 'Recipient', value: to },
          { label: 'Subject', value: subject },
          { label: 'Message Length', value: `${body.length} characters` },
        ]}
        onConfirm={handleConfirmSend}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
