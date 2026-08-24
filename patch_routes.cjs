const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const imports = `import QuizGenerator from "./pages/QuizGenerator";
import FlashcardGenerator from "./pages/FlashcardGenerator";
`;

code = code.replace('import PDFLearning from "./pages/PDFLearning";', 'import PDFLearning from "./pages/PDFLearning";\n' + imports);

const routes = `          <Route path="quiz" element={<QuizGenerator />} />
          <Route path="flashcards" element={<FlashcardGenerator />} />`;

code = code.replace('<Route path="pdf-learning" element={<PDFLearning />} />', '<Route path="pdf-learning" element={<PDFLearning />} />\n' + routes);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched routes");
