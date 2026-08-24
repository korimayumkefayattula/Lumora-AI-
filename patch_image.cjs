const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    // Using free Pollinations API as requested
    const encodedPrompt = encodeURIComponent("Educational step-by-step diagram, clear and simple, to help understand: " + prompt + ". Minimalist, high quality, vector style, informative labels, white background.");
    const imageUrl = \`https://image.pollinations.ai/prompt/\${encodedPrompt}?width=800&height=450&nologo=true\`;

    // Fetch the image to return as base64 so we don't need to change frontend
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error("Failed to fetch image from free API");
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    res.json({ imageBase64: base64Image });
  } catch (error: any) {
    res.status(500).json({ 
      error: "Failed to generate image", 
      details: error.message || String(error)
    });
  }
});
`;

code = code.replace(
  /app\.post\("\/api\/generate-image", async \(req, res\) => \{[\s\S]*?\}\);\n/g,
  replacement + "\n"
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts image endpoint");
