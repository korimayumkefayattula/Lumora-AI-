const fs = require('fs');
let code = fs.readFileSync('src/components/StudyBuddy.tsx', 'utf8');

const replacement = `
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async (e?: React.FormEvent, customQuestion?: string, isImageMode = false) => {
    if (e) e.preventDefault();
    const query = customQuestion || inputValue;
    if (!query.trim() && !selectedFile || loading) return;

    let base64File = null;
    let mimeType = null;
    if (selectedFile) {
      base64File = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(selectedFile);
      });
      mimeType = selectedFile.type;
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: isImageMode ? \`Draw me an image to explain: \${query}\` : query
    };
    if (selectedFile) {
      userMsg.text += " (File attached)";
    }

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setSelectedFile(null);
    setLoading(true);
`;

code = code.replace(
  /  const handleSendMessage = async \(e\?: React\.FormEvent, customQuestion\?: string, isImageMode = false\) => \{[\s\S]*?setLoading\(true\);/,
  replacement
);

code = code.replace(
  'body: JSON.stringify({',
  'body: JSON.stringify({ fileBase64: base64File, mimeType,'
);

fs.writeFileSync('src/components/StudyBuddy.tsx', code);
console.log("Patched StudyBuddy submit");
