const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const stateCode = `
  const [isStudyBuddyOpen, setIsStudyBuddyOpen] = useState(false);
  
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToCalendar = () => {
    const el = document.getElementById('smart-calendar-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToTasks = () => {
    const el = document.getElementById('task-tracker-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
`;

code = code.replace(
  '  const [successBanner, setSuccessBanner] = useState<string | null>(null);',
  '  const [successBanner, setSuccessBanner] = useState<string | null>(null);\n' + stateCode
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched state properly");
