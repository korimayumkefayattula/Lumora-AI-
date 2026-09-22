import React, { useState } from 'react';
import { FileQuestion, Plus, ExternalLink, RefreshCw, AlertCircle, CheckCircle2, BarChart2 } from 'lucide-react';
import { createAcademicQuizForm, fetchFormResponses, GoogleFormItem } from '../../services/googleWorkspace';
import { WorkspaceConfirmationModal } from './WorkspaceConfirmationModal';

interface GoogleFormsPanelProps {
  token: string | null;
  onRequestAuth: () => void;
}

export const GoogleFormsPanel: React.FC<GoogleFormsPanelProps> = ({ token, onRequestAuth }) => {
  const [createdForms, setCreatedForms] = useState<GoogleFormItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Creation State
  const [showCreate, setShowCreate] = useState(false);
  const [formTitle, setFormTitle] = useState('CBSE Physics Chapter 1 Diagnostic Quiz');
  const [documentTitle, setDocumentTitle] = useState('Physics Assessment Form');

  // Confirmation modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Active form response inspection
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [formResponses, setFormResponses] = useState<any>(null);
  const [loadingResponses, setLoadingResponses] = useState(false);

  const handlePromptCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !documentTitle.trim()) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmCreate = async () => {
    if (!token) return;
    setIsConfirmOpen(false);
    setLoading(true);
    setError(null);
    try {
      const newForm = await createAcademicQuizForm(token, formTitle.trim(), documentTitle.trim());
      setCreatedForms((prev) => [newForm, ...prev]);
      setShowCreate(false);
    } catch (err: any) {
      console.error('Failed to create form:', err);
      setError(err?.message || 'Failed to create Google Form.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckResponses = async (formId: string) => {
    if (!token) return;
    setSelectedFormId(formId);
    setLoadingResponses(true);
    try {
      const res = await fetchFormResponses(token, formId);
      setFormResponses(res);
    } catch (err: any) {
      console.error('Failed to fetch responses:', err);
      setFormResponses({ error: err?.message || 'Could not fetch responses yet.' });
    } finally {
      setLoadingResponses(false);
    }
  };

  if (!token) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Connect Google Forms</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Generate interactive Google Forms quizzes, collect peer survey responses, and track real-time question statistics.
        </p>
        <button
          onClick={onRequestAuth}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-sm"
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
          <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Google Forms Quiz & Survey Creator
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                Connected
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create academic assessments and track respondent answers
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showCreate ? 'Close' : 'Create Google Form'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Creator Box */}
      {showCreate && (
        <form onSubmit={handlePromptCreate} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
            Create Form in your Google Account
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Public Quiz Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Document File Name</label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Review & Create Form
            </button>
          </div>
        </form>
      )}

      {/* Forms List */}
      <div className="space-y-3">
        {createdForms.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8">
            <p>No Google Forms generated in this session yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Click &quot;Create Google Form&quot; above to provision a quiz directly in your Google account!
            </p>
          </div>
        ) : (
          createdForms.map((form) => (
            <div
              key={form.formId}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {form.title}
                </span>
                <div className="flex items-center gap-2">
                  {form.responderUri && (
                    <a
                      href={form.responderUri}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:underline"
                    >
                      <span>Open Form</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => handleCheckResponses(form.formId)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <BarChart2 className="w-3 h-3" />
                    <span>Responses</span>
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Form ID: {form.formId}
              </div>

              {selectedFormId === form.formId && (
                <div className="mt-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Form Response Data:
                  </div>
                  {loadingResponses ? (
                    <div className="text-slate-400">Loading form responses...</div>
                  ) : formResponses?.responses ? (
                    <div>Total Responses Received: {formResponses.responses.length}</div>
                  ) : (
                    <div className="text-slate-400">No responses submitted yet. Share the responder link above!</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      <WorkspaceConfirmationModal
        isOpen={isConfirmOpen}
        title="Confirm Google Form Creation"
        description="Are you sure you want to create a new Google Form document in your personal Google Drive?"
        confirmLabel="Create Form"
        details={[
          { label: 'Form Title', value: formTitle },
          { label: 'Document Name', value: documentTitle },
        ]}
        onConfirm={handleConfirmCreate}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
