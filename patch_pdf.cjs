const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'doc.save("LuminatiAI_Study_Report.pdf");',
  `doc.save("LuminatiAI_Study_Report.pdf");
    try {
      const url = doc.output('bloburl');
      window.open(url.toString(), '_blank');
    } catch(e) {}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched PDF download");
