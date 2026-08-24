const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The generate-image endpoint starts around line 191
// I will just use regex to remove everything from app.post("/api/generate-image" to the NEXT app.post

const nextEndpointIndex = code.indexOf('app.post("/api/generate-quiz"');
const generateImageIndex = code.indexOf('app.post("/api/generate-image"');

const before = code.substring(0, generateImageIndex);
const after = code.substring(nextEndpointIndex);

const newEndpoint = `
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

fs.writeFileSync('server.ts', before + newEndpoint + '\n// API Endpoint to generate a quiz\n' + after.replace('// API Endpoint to generate a quiz\n', ''));
console.log("Cleaned and patched server.ts");
