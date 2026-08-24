const fs = require('fs');
let code = fs.readFileSync('src/components/StudyBuddy.tsx', 'utf8');

const oldPrompts = `<div className="flex gap-1.5 overflow-x-auto snap-x py-1 no-scrollbar whitespace-nowrap">
              <button onClick={() => handleQuickPrompt("Explain this topic like I'm 10 years old.")} className="snap-start text-[10px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-600 rounded-full px-2.5 py-1 transition-colors">
                Explain simply
              </button>
              <button onClick={() => handleQuickPrompt("Create a 3-question active recall quiz for me.")} className="snap-start text-[10px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-600 rounded-full px-2.5 py-1 transition-colors">
                Quick Quiz
              </button>
              <button onClick={() => handleQuickPrompt("How does this apply in the real world? Give examples.")} className="snap-start text-[10px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-600 rounded-full px-2.5 py-1 transition-colors">
                Real world use
              </button>
            </div>`;

const newPrompts = `<div className="flex gap-1.5 overflow-x-auto snap-x py-1 no-scrollbar whitespace-nowrap">
              <button onClick={() => handleQuickPrompt("Explain this topic like I'm 10 years old.")} className="snap-start text-[10px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-600 rounded-full px-2.5 py-1 transition-colors">
                Explain simply
              </button>
              <button onClick={() => handleQuickPrompt("Create a 3-question active recall quiz for me.")} className="snap-start text-[10px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-600 rounded-full px-2.5 py-1 transition-colors">
                Quick Quiz
              </button>
              <button onClick={() => handleQuickPrompt("How was my school day today?")} className="snap-start text-[10px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-600 rounded-full px-2.5 py-1 transition-colors">
                Ask about my day
              </button>
              <button onClick={() => handleQuickPrompt("Tell me a funny joke to relieve stress.")} className="snap-start text-[10px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-600 rounded-full px-2.5 py-1 transition-colors">
                Tell a joke
              </button>
              <button onClick={() => handleQuickPrompt("Tell me a fun fact about this subject.")} className="snap-start text-[10px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-600 rounded-full px-2.5 py-1 transition-colors">
                Fun Fact
              </button>
            </div>`;

if (code.includes('Explain simply')) {
    // Replacing the content
    const index1 = code.indexOf('<div className="flex gap-1.5 overflow-x-auto snap-x py-1 no-scrollbar whitespace-nowrap">');
    const index2 = code.indexOf('</div>', index1) + 6;
    code = code.substring(0, index1) + newPrompts + code.substring(index2);
    fs.writeFileSync('src/components/StudyBuddy.tsx', code);
    console.log("Patched Quick Prompts!");
} else {
    console.log("Could not find prompts");
}
