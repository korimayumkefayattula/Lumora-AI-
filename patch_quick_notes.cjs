const fs = require('fs');
let code = fs.readFileSync('src/components/QuickNotes.tsx', 'utf8');

code = code.replace(
  'import { Save, FileText } from "lucide-react";',
  'import { Save, FileText, Mic, MicOff } from "lucide-react";'
);

const stateAndLogic = `
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
`;

code = code.replace(
  'const [notes, setNotes] = useState(() => localStorage.getItem("socrates_quick_notes") || "");',
  'const [notes, setNotes] = useState(() => localStorage.getItem("socrates_quick_notes") || "");\n' + stateAndLogic
);

code = code.replace(
  '<span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">',
  `<button 
          onClick={toggleListening}
          className={\`p-2 rounded-full transition-all \${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}\`}
          title={isListening ? "Stop listening" : "Start dictation"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">`
);

fs.writeFileSync('src/components/QuickNotes.tsx', code);
console.log("Patched QuickNotes with speech recognition");
