const fs = require('fs');
let code = fs.readFileSync('src/components/TaskTracker.tsx', 'utf8');

code = code.replace(
  'const [newTaskNotes, setNewTaskNotes] = useState("");',
  'const [newTaskNotes, setNewTaskNotes] = useState("");\n  const [newTaskCategory, setNewTaskCategory] = useState<"Exam Prep" | "Assignment" | "Research" | "Reading" | "Writing" | "Coding" | "Other" | "">("");'
);

code = code.replace(
  'onAddTask(newTaskTitle.trim(), newTaskDuration, "medium", newTaskSubId, undefined, undefined, newTaskNotes.trim());',
  'onAddTask(newTaskTitle.trim(), newTaskDuration, "medium", newTaskSubId, newTaskCategory || undefined, undefined, newTaskNotes.trim());'
);

code = code.replace(
  'setNewTaskNotes("");',
  'setNewTaskNotes("");\n    setNewTaskCategory("");'
);

fs.writeFileSync('src/components/TaskTracker.tsx', code);
console.log("Patched TaskTracker state");
