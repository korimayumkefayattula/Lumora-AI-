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

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: \`Educational step-by-step diagram, clear and simple, to help understand: \${prompt}. Minimalist, high quality, vector style, informative labels, white background.\`,
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    let base64Image = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("No image was returned from the model.");
    }

    res.json({ imageBase64: base64Image });
  } catch (error: any) {
    res.status(500).json({ 
      error: "Failed to generate image", 
      details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check your billing details or upgrade to a paid tier." : error.message || String(error) 
    });
  }
});
`;

code = code.replace(
  /app\.post\("\/api\/generate-image", async \(req, res\) => \{[\s\S]*?\}\);\n/g,
  replacement + "\n"
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts image endpoint back to Gemini");
