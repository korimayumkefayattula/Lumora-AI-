import React, { useState, useEffect } from "react";
import { Save, FileText, Mic, MicOff } from "lucide-react";

export default function QuickNotes() {
  const [notes, setNotes] = useState(() => localStorage.getItem("socrates_quick_notes") || "");

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";
        
        recog.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setNotes((prev) => prev + (prev && !prev.endsWith(" ") ? " " : "") + transcript + " ");
            }
          }
        };

        recog.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      if (recognition) {
        recognition.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  

  useEffect(() => {
    const handleUpdate = () => {
      setNotes(localStorage.getItem("socrates_quick_notes") || "");
    };
    window.addEventListener("socrates_notes_updated", handleUpdate);
    return () => window.removeEventListener("socrates_notes_updated", handleUpdate);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      localStorage.setItem("socrates_quick_notes", notes);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [notes]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-700 dark:border-slate-700 flex flex-col h-full transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" /> Quick Notes
        </h2>
        <button 
          onClick={toggleListening}
          className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
          title={isListening ? "Stop listening" : "Start dictation"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
          <Save className="w-3 h-3" /> Auto-saved
        </span>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Jot down quick thoughts, ideas, or questions here..."
        className="w-full flex-1 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-blue-200 dark:focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none min-h-[150px]"
      />
    </div>
  );
}
