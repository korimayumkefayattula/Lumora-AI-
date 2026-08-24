const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
  const scrollToTop = () => {
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const scrollToCalendar = () => {
    const el = document.getElementById('smart-calendar-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const scrollToTasks = () => {
    const el = document.getElementById('task-tracker-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
`;

code = code.replace(
  /  const scrollToTop = \(\) => window\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\);\n  const scrollToCalendar = \(\) => \{\n    const el = document\.getElementById\('smart-calendar-section'\);\n    if \(el\) el\.scrollIntoView\(\{ behavior: 'smooth' \}\);\n  \};\n  const scrollToTasks = \(\) => \{\n    const el = document\.getElementById\('task-tracker-section'\);\n    if \(el\) el\.scrollIntoView\(\{ behavior: 'smooth' \}\);\n  \};\n/,
  replacement + '\\n'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched scrolling");
