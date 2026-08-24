const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentDashboard.tsx', 'utf8');

// I'm going to remove some of the extra widgets that are now separate pages 
// (ConceptVisualizer, Flashcards) from the Dashboard.
// First, find the imports to remove
code = code.replace(/import ConceptVisualizer from "\.\.\/components\/ConceptVisualizer";\n/, "");
code = code.replace(/import Flashcards from "\.\.\/components\/Flashcards";\n/, "");
code = code.replace(/import StudyBuddy from "\.\.\/components\/StudyBuddy";\n/, "");

// Then find the components to remove
code = code.replace(/<ConceptVisualizer \/>/g, "");
code = code.replace(/<Flashcards subjects={subjects} \/>/g, "");

fs.writeFileSync('src/pages/StudentDashboard.tsx', code);
console.log("Cleaned up StudentDashboard");
