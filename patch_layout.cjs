const fs = require('fs');
let code = fs.readFileSync('src/pages/StudentDashboard.tsx', 'utf8');

// The layout in StudentDashboard:
/*
  return (
    <div className="h-screen bg-[#f3f6fc] dark:bg-slate-900 flex overflow-hidden font-sans transition-colors duration-300">
      ... success banner
      {/* Persistent Left Sidebar * /}
      <aside ... > ... </aside>
      {/* Main Content Area * /}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 overflow-hidden relative">
      ... header ...
      <main className="flex-1 overflow-y-auto px-6 lg:px-10 pb-20">
*/

// I'm going to rewrite the return statement entirely up to <main>
const returnRegex = /return \([\s\S]*?<main className="flex-1 overflow-y-auto px-6 lg:px-10 pb-20">/;

const newReturn = `  return (
    <div className="h-full bg-[#f3f6fc] dark:bg-slate-900 overflow-y-auto font-sans transition-colors duration-300">
      {/* Dynamic Success notifications banner */}
      {successBanner && (
        <div id="success-floater-banner" className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successBanner}</span>
        </div>
      )}
      
      {/* Top Header */}
      <header className="px-6 lg:px-10 py-5 flex items-center justify-between sticky top-0 z-20 bg-[#f3f6fc]/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-transparent transition-colors duration-300">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 rounded-full border border-orange-100 dark:border-orange-500/20 shadow-sm">
             <Flame className="w-5 h-5" />
             <span className="font-bold text-sm tracking-wide">{dailyStreak} Day Streak</span>
          </div>
          
          <div className="flex items-center justify-end w-full lg:w-auto gap-4">
             <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Workspace Node</span>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 justify-end">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Active
              </span>
            </div>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-blue-600 shadow-sm transition-all"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownloadData}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
              title="Export PDF Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetData}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
              title="Reset workspace coordinates"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ml-2">
              <User className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header>

      <main className="px-6 lg:px-10 pb-20">`;

code = code.replace(returnRegex, newReturn);

// End of file wrapper adjustment
const footerRegex = /<\/main>\s*<QuickBrainDump \/>\s*<\/div>\s*<\/div>\s*\);/;
const newFooter = `      </main>\n      <QuickBrainDump />\n    </div>\n  );`;
code = code.replace(footerRegex, newFooter);

fs.writeFileSync('src/pages/StudentDashboard.tsx', code);
console.log("Patched layout");
