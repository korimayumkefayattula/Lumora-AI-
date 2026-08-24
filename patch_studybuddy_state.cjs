const fs = require('fs');
let code = fs.readFileSync('src/components/StudyBuddy.tsx', 'utf8');

code = code.replace(
  'const [isOpen, setIsOpen] = useState(false);',
  'const [isOpen, setIsOpen] = useState(false);\n  const [selectedFile, setSelectedFile] = useState<File | null>(null);'
);

fs.writeFileSync('src/components/StudyBuddy.tsx', code);
console.log("Patched StudyBuddy state");
