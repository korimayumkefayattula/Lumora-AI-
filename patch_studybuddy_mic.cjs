const fs = require('fs');
let code = fs.readFileSync('src/components/StudyBuddy.tsx', 'utf8');

if (!code.includes('Mic')) {
  code = code.replace(
    'Image as ImageIcon, Paperclip, UploadCloud } from "lucide-react";',
    'Image as ImageIcon, Paperclip, UploadCloud, Mic, MicOff } from "lucide-react";'
  );
}

const stateToAdd = `
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setInputValue(''); // Clear previous input before new recording
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };
`;

code = code.replace(
  'const [selectedFile, setSelectedFile] = useState<File | null>(null);',
  'const [selectedFile, setSelectedFile] = useState<File | null>(null);\n' + stateToAdd
);

code = code.replace(
  /<button\s+id="buddy-chat-img-btn"/,
  `
            <button
              type="button"
              onClick={toggleRecording}
              className={\`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer shadow-sm border \${isRecording ? 'bg-red-100 text-red-600 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'}\`}
              title="Voice Input"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              id="buddy-chat-img-btn"`
);

fs.writeFileSync('src/components/StudyBuddy.tsx', code);
console.log("Patched StudyBuddy with mic");
