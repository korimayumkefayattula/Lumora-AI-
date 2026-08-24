const fs = require('fs');
let code = fs.readFileSync('src/components/StudyBuddy.tsx', 'utf8');

if (!code.includes('const [isRecording, setIsRecording] = useState')) {
  code = code.replace(
    'const [loading, setLoading] = useState<boolean>(false);',
    'const [loading, setLoading] = useState<boolean>(false);\n  const [isRecording, setIsRecording] = useState(false);\n  const toggleRecording = () => { setIsRecording(!isRecording); if (!isRecording) { setTimeout(() => setIsRecording(false), 2000); alert("Voice input requires microphone permissions and server setup."); } };'
  );
}

fs.writeFileSync('src/components/StudyBuddy.tsx', code);
console.log("Patched mic state");
