const fs = require('fs');
let code = fs.readFileSync('src/components/FocusTimer.tsx', 'utf8');

code = code.replace(
  '{(["pomodoro", "short", "long"] as TimerMode[]).map((tMode) => (',
  '{(["pomodoro", "short", "long"] as TimerMode[]).map((tMode) => ('
);

code = code.replace(
  '{tMode === "pomodoro" ? "Study" : tMode === "short" ? "Short Break" : "Long Break"}',
  '{tMode === "pomodoro" ? "Study" : tMode === "short" ? "Deep Focus" : "Break"}'
);

fs.writeFileSync('src/components/FocusTimer.tsx', code);
console.log("Patched timer text");
