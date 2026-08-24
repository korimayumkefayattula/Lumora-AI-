const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const notebookEndpoint = `
// API Endpoint for NotebookLM-style multi-document reasoning
app.post("/api/notebook-lm", async (req, res) => {
  try {
    const { files, query } = req.body;
    if (!files || !Array.isArray(files) || files.length === 0) {
      res.status(400).json({ error: "At least one file is required" });
      return;
    }
    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }
    
    const ai = getAiClient();
    
    const parts = [
      { text: "You are an expert AI tutor. Answer the student's question using ONLY the provided documents. If the answer is not in the documents, say you cannot find it in the sources, but then provide a helpful general answer. Cite your sources by document name." },
      ...files.map((file) => ({
        inlineData: { data: file.data, mimeType: file.mimeType }
      })),
      { text: \`\\n\\nStudent Question: \${query}\` }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts }]
    });

    res.json({ answer: response.text });
  } catch (error) {
    res.status(500).json({ 
       error: "Failed to analyze documents", 
       details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check your billing details or upgrade to a paid tier." : error.message || String(error)
     });
  }
});
`;

// Insert before the analyze-document endpoint
code = code.replace(
  '// API Endpoint to analyze uploaded documents',
  notebookEndpoint + '\n// API Endpoint to analyze uploaded documents'
);

fs.writeFileSync('server.ts', code);
console.log("Patched server with notebook-lm endpoint");
