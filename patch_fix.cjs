const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '                  />\\n                  <Flashcards subjects={subjects} />',
  '                  /></div>\\n                  <Flashcards subjects={subjects} />'
);

// Wait, the newlines in code are literal newlines.
code = code.replace(
  /                  \/>\n                  <Flashcards subjects=\{subjects\} \/>/,
  '                  /></div>\n                  <Flashcards subjects={subjects} />'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx missing closing div");
