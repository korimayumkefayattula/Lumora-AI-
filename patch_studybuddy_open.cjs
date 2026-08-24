const fs = require('fs');
let code = fs.readFileSync('src/components/StudyBuddy.tsx', 'utf8');

code = code.replace(
  'const [isOpen, setIsOpen] = useState<boolean>(true);',
  ''
);

code = code.replace(
  /onClick=\{\(\) => setIsOpen\(!isOpen\)\}/,
  ''
);

code = code.replace(
  /\{isOpen \? <ChevronDown className="w-4 h-4" \/> : <ChevronUp className="w-4 h-4" \/>\}/,
  ''
);

code = code.replace(
  /\{isOpen && \(/,
  '<>'
);

code = code.replace(
  /          <\/form>\n        <\/div>\n      \)\}/,
  '          </form>\n        </div>\n      </>'
);

fs.writeFileSync('src/components/StudyBuddy.tsx', code);
console.log("Patched StudyBuddy to be always open");
