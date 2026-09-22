import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, ExternalLink, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { 
  fetchCalendarEvents, 
  createCalendarEvent, 
  deleteCalendarEvent, 
  CalendarEventItem 
} from '../../services/googleWorkspace';
import { WorkspaceConfirmationModal } from './WorkspaceConfirmationModal';

interface GoogleCalendarPanelProps {
  token: string | null;
  onRequestAuth: () => void;
}

export const GoogleCalendarPanel: React.FC<GoogleCalendarPanelProps> = ({ token, onRequestAuth }) => {
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [startTime, setStartTime] = useState('10:00');
  const [durationHours, setDurationHours] = useState('1');
  const [description, setDescription] = useState('');

  // Confirmation Modals State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'create' | 'delete';
    targetEvent?: CalendarEventItem;
    payload?: any;
  }>({ isOpen: false, type: 'create' });

  const loadEvents = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCalendarEvents(token);
      setEvents(data);
    } catch (err: any) {
      console.error('Failed to load Google Calendar events:', err);
      setError(err?.message || 'Could not load Google Calendar events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadEvents();
    }
  }, [token]);

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const startDateTime = new Date(`${startDate}T${startTime}:00`).toISOString();
    const endDateTime = new Date(
      new Date(`${startDate}T${startTime}:00`).getTime() + parseFloat(durationHours) * 3600 * 1000
    ).toISOString();

    setConfirmModal({
      isOpen: true,
      type: 'create',
      payload: {
        summary: title.trim(),
        description: description.trim(),
        startDateTime,
        endDateTime,
      },
    });
  };

  const handleConfirmAction = async () => {
    if (!token) return;
    const { type, payload, targetEvent } = confirmModal;
    setConfirmModal({ isOpen: false, type: 'create' });

    try {
      if (type === 'create' && payload) {
        setLoading(true);
        await createCalendarEvent(token, payload);
        setTitle('');
        setDescription('');
        setShowAddForm(false);
        await loadEvents();
      } else if (type === 'delete' && targetEvent) {
        setLoading(true);
        await deleteCalendarEvent(token, targetEvent.id);
        await loadEvents();
      }
    } catch (err: any) {
      console.error('Calendar operation error:', err);
      setError(err?.message || 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Connect Google Calendar</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Synchronize your exam dates, AI study sessions, and revision deadlines directly with your official Google Calendar.
        </p>
        <button
          onClick={onRequestAuth}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm"
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
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Google Calendar Sync
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                Connected
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live bi-directional synchronization with your Google Calendar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadEvents}
            disabled={loading}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Refresh events"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Close Form' : 'Schedule Study Session'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Event Form */}
      {showAddForm && (
        <form onSubmit={handleCreatePrompt} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
            Schedule New Study Session on Google Calendar
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Session Title (e.g. Physics Wave Optics Revision)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              >
                <option value="0.5">30 min</option>
                <option value="1">1 hour</option>
                <option value="1.5">1.5 hours</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Description or study notes (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
            >
              Confirm & Save to Google Calendar
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            {loading ? 'Fetching events from Google Calendar...' : 'No upcoming Google Calendar events found.'}
          </div>
        ) : (
          events.map((ev) => {
            const startStr = ev.start.dateTime || ev.start.date || '';
            const displayDate = startStr ? new Date(startStr).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'All Day';

            return (
              <div
                key={ev.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400/60 transition-colors bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {ev.summary}
                    </span>
                    {ev.htmlLink && (
                      <a
                        href={ev.htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-blue-500"
                        title="Open in Google Calendar"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{displayDate}</span>
                    {ev.description && (
                      <span className="text-slate-400 truncate max-w-xs">
                        • {ev.description}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      type: 'delete',
                      targetEvent: ev,
                    })
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  title="Remove from Calendar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Mandatory User Confirmation Modal */}
      <WorkspaceConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'create' ? 'Add Event to Google Calendar' : 'Delete Calendar Event'}
        description={
          confirmModal.type === 'create'
            ? 'Are you sure you want to add this academic study session to your personal Google Calendar?'
            : 'Are you sure you want to delete this event from your Google Calendar? This action cannot be undone.'
        }
        confirmLabel={confirmModal.type === 'create' ? 'Add Event' : 'Delete Event'}
        isDestructive={confirmModal.type === 'delete'}
        details={
          confirmModal.type === 'create' && confirmModal.payload
            ? [
                { label: 'Event Title', value: confirmModal.payload.summary },
                { label: 'Start Time', value: new Date(confirmModal.payload.startDateTime).toLocaleString() },
                { label: 'End Time', value: new Date(confirmModal.payload.endDateTime).toLocaleString() },
              ]
            : confirmModal.targetEvent
            ? [
                { label: 'Event', value: confirmModal.targetEvent.summary },
                { label: 'Time', value: confirmModal.targetEvent.start.dateTime || 'All Day' },
              ]
            : []
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'create' })}
      />
    </div>
  );
};
