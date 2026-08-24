const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'import ConceptVisualizer from "./components/ConceptVisualizer";',
  'import ConceptVisualizer from "./components/ConceptVisualizer";\nimport SmartCalendar from "./components/SmartCalendar";\nimport QuickBrainDump from "./components/QuickBrainDump";'
);

const newTrackerAndCalendar = `
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 flex flex-col gap-8">
                  <SmartCalendar tasks={tasks} subjects={subjects} onUpdateTaskDate={(taskId, newDate) => {
                    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, date: newDate } : t));
                  }} />
                  <TaskTracker
`;

code = code.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">\s*<div className="lg:col-span-2">\s*<TaskTracker/,
  newTrackerAndCalendar
);

code = code.replace(
  '    </main>',
  '    </main>\n      <QuickBrainDump />'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
