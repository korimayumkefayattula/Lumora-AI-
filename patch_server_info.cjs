const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const infographicEndpoint = `
// API Endpoint to generate SVG infographics / mind maps
app.post("/api/generate-infographic", async (req, res) => {
  try {
    const { topic, type } = req.body;
    if (!topic) {
      res.status(400).json({ error: "Topic is required" });
      return;
    }
    
    const ai = getAiClient();
    
    const systemInstruction = "You are an expert data visualization designer. You generate beautiful, clean, responsive SVG code for educational mind maps and infographics. Use modern colors (blue, purple, emerald), drop shadows, and clean typography (sans-serif). Return ONLY valid SVG code, no markdown wrapping, no extra text.";
    
    const prompt = \`Generate a highly visual, professional \${type || 'mind map'} about: "\${topic}". Make it structured with nodes and connecting lines. Ensure the viewBox is large enough (e.g., viewBox="0 0 800 600") and elements are well-spaced.\`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2
      }
    });

    let svgData = response.text || "";
    // Clean up if it wrapped in markdown
    svgData = svgData.replace(/\`\`\`(xml|svg|html)?\\n/g, '').replace(/\`\`\`/g, '').trim();

    res.json({ svg: svgData });
  } catch (error) {
    res.status(500).json({ 
       error: "Failed to generate infographic", 
       details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check your billing details or upgrade to a paid tier." : error.message || String(error)
     });
  }
});
`;

// Insert before the live API setup
code = code.replace(
  '// Setup dev server with Vite after API routes',
  infographicEndpoint + '\n// Setup dev server with Vite after API routes'
);

fs.writeFileSync('server.ts', code);
console.log("Patched server with generate-infographic endpoint");
