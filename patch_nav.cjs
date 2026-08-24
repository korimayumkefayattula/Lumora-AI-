const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'import QuickNotes from "./components/QuickNotes";',
  'import QuickNotes from "./components/QuickNotes";\nimport StudyBuddy from "./components/StudyBuddy";'
);

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
  '  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("socrates_theme") === "dark");',
  '  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("socrates_theme") === "dark");\n' + stateCode
);

code = code.replace(
  '<SmartCalendar tasks={tasks} subjects={subjects} onUpdateTaskDate={(taskId, newDate) => {',
  '<div id="smart-calendar-section"><SmartCalendar tasks={tasks} subjects={subjects} onUpdateTaskDate={(taskId, newDate) => {'
);
code = code.replace(
  /                  \}\} \/>\n                  <TaskTracker/g,
  '                  }} /></div>\n                  <div id="task-tracker-section"><TaskTracker'
);
code = code.replace(
  /                  \/>\n                <\/div>/g,
  '                  /></div>\n                </div>'
);

const newNav = `
      {/* Floating Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-[32px] px-8 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700 flex items-center gap-8 z-50">
        <button onClick={scrollToTop} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button onClick={() => setIsStudyBuddyOpen(true)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
        <button onClick={() => {
          const btn = document.querySelector('.w-14.h-14.bg-emerald-500') as HTMLButtonElement;
          if (btn) btn.click();
        }} className="w-14 h-14 bg-slate-900 dark:bg-slate-700 rounded-[20px] flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg shadow-slate-900/20">
          <Plus className="w-6 h-6" />
        </button>
        <button onClick={scrollToTasks} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
        </button>
        <button onClick={scrollToCalendar} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <CalendarDays className="w-6 h-6" />
        </button>
      </div>
      
      {/* StudyBuddy Drawer */}
      {isStudyBuddyOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsStudyBuddyOpen(false)}></div>
          <div className="relative w-full max-w-md h-full p-4 flex flex-col animate-in slide-in-from-right">
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-slate-200 dark:border-slate-700">
               <StudyBuddy subjects={subjects} />
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  /      \{\/\* Floating Bottom Nav \*\/\}[\s\S]*?<\/div>/,
  newNav
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched bottom nav and study buddy");
