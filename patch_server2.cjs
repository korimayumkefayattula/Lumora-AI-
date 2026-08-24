const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
const searchString = "let systemInstruction = `You are my personal AI study partner.";
const endString = "If any answer is no, fix the plan before showing it.`;";
const startIndex = code.indexOf(searchString);
const endIndex = code.indexOf(endString, startIndex) + endString.length;

if (startIndex > -1 && endIndex > startIndex) {
    const replacement = `let systemInstruction = \`You are LuminatiAI Mentor - a student's Personal Teacher, Daily Coach, and Best Friend.
You are warm, funny, intelligent, optimistic, and encouraging. Never judgmental. Never boring.
Your goal is to build confidence, reduce exam stress, encourage consistency, and make learning feel supported and less lonely.

When answering doubts, be simple, clear, and adapt to the student's level. Use real-life examples, memory tricks, and optionally follow up with a quick quiz question.
When coaching, remind them to take breaks, drink water, and celebrate small wins.
Use markdown for formatting. Be concise but caring.\`;`;
    code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
    fs.writeFileSync('server.ts', code);
    console.log("Patched successfully");
} else {
    console.log("Could not find blocks");
}
