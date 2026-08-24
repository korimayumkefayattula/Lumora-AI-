/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Calendar, BookOpen, AlertCircle, Loader2, Plus, Check } from "lucide-react";
import { Subject, StudyTask } from "../types";

interface AIPlannerProps {
  subjects: Subject[];
  onAddTasks: (generatedTasks: { title: string; durationMinutes: number; priority: 'low' | 'medium' | 'high'; notes: string; subjectId: string }[]) => void;
  onAddMockSubject: (name: string) => string; // if a subject is typed but not monitored, we can help add it
}

interface GeneratedTask {
  title: string;
  durationMinutes: number;
  priority: 'low' | 'medium' | 'high';
  notes: string;
}

interface PlannerResponse {
  success: boolean;
  summary: string;
  tasks: GeneratedTask[];
}

export default function AIPlanner({ subjects, onAddTasks, onAddMockSubject }: AIPlannerProps) {
  const [subjectName, setSubjectName] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [hours, setHours] = useState<number>(6);
  const [topics, setTopics] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [plannerResult, setPlannerResult] = useState<PlannerResponse | null>(null);
  const [adoptedResult, setAdoptedResult] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick topics helpers
  const handlePredefinedSubject = (name: string) => {
    setSubjectName(name);
    const found = subjects.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setSelectedSubjectId(found.id);
    } else {
      setSelectedSubjectId("new");
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSubject = selectedSubjectId === "new" || !selectedSubjectId ? subjectName : (subjects.find(s => s.id === selectedSubjectId)?.name || subjectName);
    
    if (!finalSubject.trim()) {
      setErrorMsg("Please specify a study subject.");
      return;
    }

    setLoading(true);
    setAdoptedResult(false);
    setErrorMsg(null);
    setPlannerResult(null);

    // Dynamic messaging for loading steps
    const steps = [
      "Consulting study cognitive models...",
      "Structuring high-impact active recall intervals...",
      "Mapping chronological study sequencing...",
      "Finalizing your optimized custom template..."
    ];
    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setLoadingStep(steps[stepIndex]);
    }, 2000);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: finalSubject,
          timeAvailable: hours,
          topicKeywords: topics,
          difficulty,
          notes: additionalNotes
        })
      });

      if (!response.ok) {
        throw new Error("Luminati AI was unable to generate your study plan.");
      }

      const data = await response.json();
      setPlannerResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred while communicating with Luminati AI.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleAdoptAll = () => {
    if (!plannerResult) return;
    
    let targetSubjectId = selectedSubjectId;
    const finalSubject = selectedSubjectId === "new" || !selectedSubjectId ? subjectName : (subjects.find(s => s.id === selectedSubjectId)?.name || subjectName);
    
    // Add subject first if not monitored
    if (!selectedSubjectId || selectedSubjectId === "new") {
      targetSubjectId = onAddMockSubject(finalSubject);
    }

    // Map tasks to database schema
    const tasksToAdopt = plannerResult.tasks.map(t => ({
      title: t.title,
      durationMinutes: t.durationMinutes,
      priority: t.priority,
      notes: t.notes,
      subjectId: targetSubjectId
    }));

    onAddTasks(tasksToAdopt);
    setAdoptedResult(true);
  };

  return (
    <div id="ai-planner-panel" className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">
            Luminati AI Planner
          </h2>
          <p className="text-xs text-slate-500">
            Generate milestone templates structured for active recall
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Planner Inputs Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-4">
          {/* Subject selector and/or Custom text block */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select or Type Subject
            </label>
            <div className="space-y-2">
              <select
                id="ai-planner-subject-select"
                value={selectedSubjectId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedSubjectId(val);
                  if (val !== "new" && val !== "") {
                    setSubjectName(subjects.find(s => s.id === val)?.name || "");
                  }
                }}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2 px-3 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
              >
                <option value="">-- Choose Monitored Subject --</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>📖 {s.name}</option>
                ))}
                <option value="new">🧪 Enter Custom Subject Name</option>
              </select>

              {(selectedSubjectId === "new" || subjects.length === 0) && (
                <input
                  id="ai-planner-custom-subject-input"
                  type="text"
                  placeholder="e.g. Organic Chemistry, Modern Philosophy"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2 px-3 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              )}
            </div>
          </div>

          {/* Prompt keyword suggestions */}
          <div className="flex gap-1.5 flex-wrap">
            {["Math Exam", "React Coding", "Biology Finals", "World History"].map((topic) => (
              <button
                key={topic}
                id={`ai-predef-${topic.replace(/\s+/g, "-")}`}
                type="button"
                onClick={() => handlePredefinedSubject(topic)}
                className="text-[11px] font-medium text-slate-500 bg-slate-150 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Hours and Complexity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Target Study Hours ({hours}h)
              </label>
              <input
                id="ai-planner-hours-slider"
                type="range"
                min="2"
                max="20"
                step="1"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>2h</span>
                <span>20h</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Flow Style / Depth
              </label>
              <select
                id="ai-planner-difficulty-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2 px-2 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
              >
                <option value="beginner">⚡ Fast Concept Review</option>
                <option value="intermediate">🚀 Balanced Midterm Prep</option>
                <option value="advanced">🧬 Deep Comprehensive Study</option>
              </select>
            </div>
          </div>

          {/* Subtopics / Material Keywords */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Specific topics or chapters (Optional)
            </label>
            <input
              id="ai-planner-topics-input"
              type="text"
              placeholder="e.g. Chapter 4-6, stoichiometry, ionic bonds"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2 px-3 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Special notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Any special constraints or requests?
            </label>
            <textarea
              id="ai-planner-notes-input"
              rows={2}
              placeholder="e.g. 'I struggle with active recall formatting' or 'Include study break suggestions'"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2 px-3 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Action Trigger Button */}
          <button
            id="ai-planner-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-150"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs transition-opacity duration-300">{loadingStep}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Compile Study Schedule</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div id="ai-planner-error" className="bg-red-50 border border-red-150 rounded-xl p-3 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-600 leading-normal">{errorMsg}</p>
            </div>
          )}
        </form>

        {/* Planner Output Showcase */}
        <div className="lg:col-span-7 flex flex-col justify-center border border-slate-100 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50/50 p-5 min-h-[350px]">
          {plannerResult ? (
            <div id="ai-planner-results" className="space-y-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-50 p-4 shadow-sm">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 py-0.5 px-2 rounded-full uppercase tracking-wider">
                  AI STRATEGY SUMMARY
                </span>
                <p className="text-sm font-medium text-slate-700 mt-2 leading-relaxed">
                  {plannerResult.summary}
                </p>
              </div>

              {/* Tasks schedule overview list */}
              <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 select-none">
                {plannerResult.tasks.map((task, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 shadow-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
                        {idx + 1}. {task.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 py-0.5 px-1.5 rounded-md">
                          {task.durationMinutes}m
                        </span>
                        <span className={`text-[9px] font-bold uppercase py-0.5 px-1.5 rounded-md ${
                          task.priority === "high" 
                            ? "bg-red-50 text-red-600" 
                            : task.priority === "medium" 
                            ? "bg-orange-50 text-orange-600" 
                            : "bg-blue-50 text-blue-600"
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 lines-clamp-2">
                      💡 {task.notes}
                    </p>
                  </div>
                ))}
              </div>

              {/* Accept Plan Trigger */}
              <button
                id="ai-planner-adopt-all-btn"
                type="button"
                onClick={handleAdoptAll}
                disabled={adoptedResult}
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  adoptedResult 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-150" 
                    : "bg-slate-800 text-white hover:bg-slate-900 border border-transparent shadow-sm"
                }`}
              >
                {adoptedResult ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Adopted to Active Tasks! Check your agenda.</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Adopt Study Schedule Into My Agenda</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div id="ai-planner-placeholder" className="text-center py-6">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
              <h3 className="text-sm font-bold text-slate-600 mt-3 font-display">
                No active schedule template compiled
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                Enter your study target parameters on the left, and Luminati AI will structure a personalized chronological roadmap.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
