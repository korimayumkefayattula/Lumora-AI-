const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentDashboard.tsx', 'utf8');

// Find the start of the bottom nav
const bottomNavStart = code.indexOf('{/* Floating Bottom Nav */}');
if (bottomNavStart !== -1) {
  // It ends with the final </div> of the component, just replace everything after bottomNavStart up to the end
  const beforeNav = code.substring(0, bottomNavStart);
  code = beforeNav + '\n    </div>\n  );\n}\n';
}

fs.writeFileSync('src/pages/StudentDashboard.tsx', code);
console.log("Removed bottom nav");
