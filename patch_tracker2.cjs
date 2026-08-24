const fs = require('fs');
let code = fs.readFileSync('src/components/TaskTracker.tsx', 'utf8');

code = code.replace(
  '                   {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}\n                 </select>',
  '                   {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}\n                 </select>\n                 <select\n                   value={newTaskCategory}\n                   onChange={e => setNewTaskCategory(e.target.value as any)}\n                   className="text-sm bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg outline-none"\n                 >\n                   <option value="">Select Category (Optional)...</option>\n                   <option value="Exam Prep">Exam Prep</option>\n                   <option value="Assignment">Assignment</option>\n                   <option value="Research">Research</option>\n                   <option value="Reading">Reading</option>\n                   <option value="Writing">Writing</option>\n                   <option value="Coding">Coding</option>\n                   <option value="Other">Other</option>\n                 </select>'
);

fs.writeFileSync('src/components/TaskTracker.tsx', code);
console.log("Patched TaskTracker form");
