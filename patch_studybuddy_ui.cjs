const fs = require('fs');
let code = fs.readFileSync('src/components/StudyBuddy.tsx', 'utf8');

const replacementFormStart = `
          {selectedFile && (
            <div className="px-3 pt-2 pb-1 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Paperclip className="w-3 h-3" />
                {selectedFile.name}
              </span>
              <button onClick={() => setSelectedFile(null)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
            </div>
          )}
          <form 
            onSubmit={(e) => handleSendMessage(e)}
            className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-2 items-center"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
                }
              }} 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Attach File (Image/PDF)"
              className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-sm border border-slate-200"
            >
              <Paperclip className="w-4 h-4" />
            </button>
`;

code = code.replace(
  /<form\s+onSubmit=\{\(e\) => handleSendMessage\(e\)\}\s+className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800\/50 flex gap-2 items-center"\s+>/,
  replacementFormStart
);

code = code.replace(
  'disabled={loading || !inputValue.trim()}',
  'disabled={loading || (!inputValue.trim() && !selectedFile)}'
);

code = code.replace(
  'disabled={loading || !inputValue.trim()}',
  'disabled={loading || (!inputValue.trim() && !selectedFile)}'
);

fs.writeFileSync('src/components/StudyBuddy.tsx', code);
console.log("Patched StudyBuddy form UI");
