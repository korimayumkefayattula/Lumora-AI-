const fs = require('fs');
let code = fs.readFileSync('src/components/TaskTracker.tsx', 'utf8');

code = code.replace(
  /<p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">\{task.title\}<\/p>/g,
  '<p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{task.title}{task.category && <span className={`ml-2 inline-block text-[9px] px-1.5 py-0.5 rounded font-bold ${getCategoryColor(task.category)}`}>{task.category}</span>}</p>'
);

fs.writeFileSync('src/components/TaskTracker.tsx', code);
console.log("Patched TaskTracker matrix rendering");
