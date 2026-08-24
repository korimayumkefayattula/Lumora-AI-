const fs = require('fs');
let code = fs.readFileSync('src/components/TaskTracker.tsx', 'utf8');

const getCategoryColor = `
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Exam Prep': return 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300';
      case 'Assignment': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300';
      case 'Research': return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300';
      case 'Reading': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300';
      case 'Writing': return 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300';
      case 'Coding': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300';
    }
  };
`;

code = code.replace(
  '  const formatTime = (dateStr: string, minutes: number) => {',
  getCategoryColor + '\n  const formatTime = (dateStr: string, minutes: number) => {'
);

code = code.replace(
  '{task.priority === \'medium\' && <span className="ml-2 text-[10px] bg-amber-50 text-amber-500 px-1.5 py-0.5 rounded uppercase">Med</span>}',
  '{task.priority === \'medium\' && <span className="ml-2 text-[10px] bg-amber-50 text-amber-500 px-1.5 py-0.5 rounded uppercase">Med</span>}\n                      {task.category && <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-bold ${getCategoryColor(task.category)}`}>{task.category}</span>}'
);

fs.writeFileSync('src/components/TaskTracker.tsx', code);
console.log("Patched TaskTracker list rendering");
