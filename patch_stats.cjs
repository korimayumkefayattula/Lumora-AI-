const fs = require('fs');
let code = fs.readFileSync('src/components/StudyStats.tsx', 'utf8');

code = code.replace(
  'completedPomodoros: number;',
  'completedPomodoros: number;\n  xpPoints: number;'
);

code = code.replace(
  'export default function StudyStats({ subjects, tasks, completedPomodoros }: StudyStatsProps) {',
  'export default function StudyStats({ subjects, tasks, completedPomodoros, xpPoints }: StudyStatsProps) {'
);

code = code.replace(
  '{totalTasksCount}',
  '{Math.round(xpPoints * 1.2 + completedPomodoros * 5)}'
);

code = code.replace(
  '<span className="text-sm font-medium">All Task</span>',
  '<span className="text-sm font-medium">Focus Score</span>'
);

fs.writeFileSync('src/components/StudyStats.tsx', code);
console.log("Patched StudyStats");
