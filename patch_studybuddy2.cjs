const fs = require('fs');
let code = fs.readFileSync('src/components/StudyBuddy.tsx', 'utf8');

code = code.replace(
  /\[\s*"Write an active recall quiz",\s*"Explain with a restaurant analogy",\s*"Give focus strategies",\s*\]/,
  '["Explain this like I\'m 10", "Quick 3-question quiz", "How was my school day?", "Tell me a fun fact", "Tell me a joke"]'
);

fs.writeFileSync('src/components/StudyBuddy.tsx', code);
console.log("Patched Quick Prompts!");
