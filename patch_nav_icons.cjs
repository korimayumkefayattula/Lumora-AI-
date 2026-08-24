const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('MessageSquare')) {
  code = code.replace(
    'LayoutDashboard, CalendarDays',
    'LayoutDashboard, CalendarDays, MessageSquare, ListTodo'
  );
}

code = code.replace(
  /<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" \/><\/svg>/,
  '<MessageSquare className="w-6 h-6" />'
);

code = code.replace(
  /<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" \/><\/svg>/,
  '<ListTodo className="w-6 h-6" />'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched bottom nav icons");
