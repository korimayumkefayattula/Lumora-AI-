const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentDashboard.tsx', 'utf8');

// The file exports `export default function App() {`
// Change it to `export default function StudentDashboard() {`
code = code.replace('export default function App() {', 'export default function StudentDashboard() {');

fs.writeFileSync('src/pages/StudentDashboard.tsx', code);
console.log("Patched component name in StudentDashboard.tsx");
