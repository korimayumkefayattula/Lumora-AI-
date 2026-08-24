import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Loader2, 
  Download, 
  Copy, 
  Check, 
  Maximize2, 
  X, 
  Wand2, 
  Upload, 
  RefreshCw, 
  Trash2, 
  BookOpen, 
  Layers, 
  Sliders, 
  Palette, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Compass,
  Atom,
  Dna,
  Binary,
  Share2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GeneratedImageItem {
  id: string;
  prompt: string;
  enhancedPrompt?: string;
  imageUrl: string;
  timestamp: number;
  aspectRatio: string;
  style: string;
  subject?: string;
  modelUsed?: string;
}

const MODEL_OPTIONS = [
  { id: 'omniroute', name: 'OmniRoute Proxy (Local / Custom)', desc: 'Routes to your local OmniRoute proxy (:20128)', badge: 'OmniRoute' },
  { id: 'nano-banana-free', name: 'Nano Banana Free AI', desc: 'High-speed visual illustration engine (Free & Unlimited)', badge: 'Free & Fast' },
  { id: 'vector-svg', name: 'Nano Banana Vector AI', desc: '100% accurate annotated SVG diagrams (Gemini 3.7)', badge: 'Precision SVG' },
  { id: 'gemini-3.1-flash-lite-image', name: 'Nano Banana 2 Lite', desc: 'Fast pedagogical visualizer (Gemini Paid Tier)', badge: 'Gemini Lite' },
  { id: 'gemini-3.1-flash-image', name: 'Nano Banana 2 (HQ)', desc: 'High definition scientific visualizer (Gemini Paid)', badge: 'Gemini HQ' },
  { id: 'gemini-3-pro-image', name: 'Nano Banana Pro', desc: '4K Ultra crisp textbook studio render (Gemini Pro)', badge: 'Gemini Pro' }
];

const STYLE_OPTIONS = [
  { id: 'scientific-diagram', name: 'Scientific Diagram', desc: 'Crisp white background & labeled parts', icon: Compass },
  { id: 'textbook-illustration', name: 'Textbook Illustration', desc: 'Detailed educational print line art', icon: BookOpen },
  { id: '3d-render', name: '3D Scientific Render', desc: 'Photorealistic volumetric depth & lighting', icon: Layers },
  { id: 'infographic', name: 'Modern Infographic', desc: 'Clean vector flowcharts and icons', icon: Palette },
  { id: 'chalkboard', name: 'Chalkboard Sketch', desc: 'Classic blackboard lecture drawing', icon: Sliders },
  { id: 'photorealistic', name: 'Photorealistic Macro', desc: 'Authentic physical textures & realism', icon: ImageIcon },
];

const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9', desc: 'Wide (Slides/Desktop)', class: 'aspect-video' },
  { id: '4:3', label: '4:3', desc: 'Standard (Notes)', class: 'aspect-[4/3]' },
  { id: '1:1', label: '1:1', desc: 'Square (Flashcards)', class: 'aspect-square' },
  { id: '3:4', label: '3:4', desc: 'Portrait (Worksheets)', class: 'aspect-[3/4]' },
  { id: '9:16', label: '9:16', desc: 'Tall (Mobile)', class: 'aspect-[9/16]' },
];

const SUBJECT_PRESETS = [
  {
    category: 'Biology',
    icon: Dna,
    items: [
      { label: 'Human Heart 4 Chambers', prompt: 'Detailed anatomical cross-section diagram of the human heart showing 4 chambers (left/right atrium and ventricles), bicuspid and tricuspid valves, aorta, pulmonary artery, and directional oxygenated vs deoxygenated blood flow arrows with clear labels on a clean white background.' },
      { label: 'Plant Cell vs Animal Cell', prompt: 'Side-by-side comparative educational diagram of a Plant Cell and an Animal Cell, highlighting cell wall, chloroplasts, large central vacuole, mitochondria, endoplasmic reticulum, and nucleus with color-coded labels.' },
      { label: 'DNA Double Helix', prompt: 'Structural biochemistry illustration of the DNA double helix showing antiparallel sugar-phosphate backbones, major and minor grooves, and complementary nitrogenous base pairs (Adenine-Thymine, Guanine-Cytosine) with hydrogen bonds.' },
      { label: 'Photosynthesis Mechanism', prompt: 'Educational process diagram of photosynthesis in chloroplast thylakoid and stroma, illustrating light-dependent reactions generating ATP/NADPH and the Calvin Cycle fixing CO2 into glucose.' }
    ]
  },
  {
    category: 'Physics',
    icon: Atom,
    items: [
      { label: 'Optics: Concave Mirror Ray Diagram', prompt: 'Precision physics optics ray diagram for a concave mirror with an object placed beyond the center of curvature (C), showing parallel ray through focus (F) and focal ray reflecting parallel to form a real, inverted, diminished image with optical axis, focal point, and pole clearly marked.' },
      { label: 'Electromagnetic Wave Spectrum', prompt: 'Horizontal physics spectrum chart of electromagnetic waves from Radio waves, Microwaves, Infrared, Visible Light rainbow breakdown, Ultraviolet, X-rays to Gamma rays with relative wavelength and frequency values.' },
      { label: 'Electric Motor Working Principle', prompt: 'Clear pedagogical 3D diagram of a DC electric motor showing rectangular armature coil in a permanent magnetic field, carbon brushes, split-ring commutator, and Fleming’s Left Hand Rule directional force vectors.' },
      { label: 'Newton’s Laws Inclined Plane', prompt: 'Free body diagram of a mass m resting on an inclined plane of angle theta, showing weight vector mg, normal force N, gravitational components mg sin(theta) and mg cos(theta), and static friction force.' }
    ]
  },
  {
    category: 'Chemistry',
    icon: Compass,
    items: [
      { label: 'Electrolysis of Water', prompt: 'High-clarity laboratory apparatus diagram for the electrolysis of acidified water using Hoffman apparatus, showing battery DC connection, inert platinum electrodes, anode generating Oxygen gas (1 volume), and cathode generating Hydrogen gas (2 volumes).' },
      { label: 'Atomic Orbital Hybridization', prompt: '3D orbital shapes diagram showing sp3 hybridization in Methane (CH4), sp2 in Ethene, and sp in Ethyne with tetrahedral bond angles of 109.5 degrees and overlapping sigma bonds.' },
      { label: 'Periodic Trends Heatmap', prompt: 'Infographic of the periodic table showing directional arrows and trends for Electronegativity, Ionization Energy, Electron Affinity, and Atomic Radius across periods and groups.' }
    ]
  },
  {
    category: 'Math & CS',
    icon: Binary,
    items: [
      { label: 'Trigonometric Unit Circle', prompt: 'Mathematically precise Unit Circle diagram showing key angles in degrees (0 to 360) and radians (0 to 2pi), corresponding (cos theta, sin theta) coordinate values, and quadrant signs on a Cartesian grid.' },
      { label: 'Pythagorean Theorem Proof', prompt: 'Visual geometric proof diagram of Pythagoras theorem showing a right-angled triangle with sides a, b, hypotenuse c and square areas a^2, b^2, c^2 color-coded to show a^2 + b^2 = c^2.' },
      { label: 'Binary Search Tree & Traversals', prompt: 'Computer science data structure diagram of a balanced Binary Search Tree (BST) showing root, parent, left/right child nodes, and step-by-step Inorder, Preorder, and Postorder traversal routes.' }
    ]
  }
];

export default function ImageGenerator() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("nano-banana-free");
  const [selectedStyle, setSelectedStyle] = useState("scientific-diagram");
  const [selectedAspect, setSelectedAspect] = useState("16:9");
  const [activeCategory, setActiveCategory] = useState("Biology");
  
  const [currentImage, setCurrentImage] = useState<GeneratedImageItem | null>(null);
  const [history, setHistory] = useState<GeneratedImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Remix / Image Input
  const [inputImage, setInputImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Zoom / Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lumora_generated_images');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        if (parsed.length > 0) {
          setCurrentImage(parsed[0]);
        }
      }
    } catch (e) {
      console.error("Failed to read image history:", e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (item: GeneratedImageItem) => {
    setHistory(prev => {
      const updated = [item, ...prev.filter(i => i.id !== item.id)].slice(0, 30);
      try {
        localStorage.setItem('lumora_generated_images', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your generated images history?")) {
      setHistory([]);
      try {
        localStorage.removeItem('lumora_generated_images');
      } catch (e) {}
    }
  };

  // AI Prompt Enhancer
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || enhancing) return;
    setEnhancing(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/enhance-image-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          subject: activeCategory,
          style: STYLE_OPTIONS.find(s => s.id === selectedStyle)?.name
        })
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setEnhancing(false);
    }
  };

  // Generate Image
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;
    
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          aspectRatio: selectedAspect,
          style: selectedStyle,
          model: selectedModel,
          inputImage: inputImage || undefined
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.details || data.error || "Failed to generate image.");
      }

      const newItem: GeneratedImageItem = {
        id: Math.random().toString(36).substring(2, 9),
        prompt: prompt.trim(),
        imageUrl: data.imageUrl,
        timestamp: Date.now(),
        aspectRatio: selectedAspect,
        style: selectedStyle,
        subject: activeCategory,
        modelUsed: data.modelUsed || (selectedModel === 'nano-banana-free' ? 'Nano Banana Free Engine' : 'Nano Banana 2 Lite')
      };

      setCurrentImage(newItem);
      saveToHistory(newItem);
    } catch (err: any) {
      console.error("Generate error:", err);
      setErrorMessage(err.message || "Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload for remixing
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setInputImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!currentImage?.imageUrl) return;
    try {
      const response = await fetch(currentImage.imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image to clipboard:", err);
      // Fallback: Copy URL text
      navigator.clipboard.writeText(currentImage.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download image
  const handleDownload = () => {
    if (!currentImage?.imageUrl) return;
    const a = document.createElement('a');
    a.href = currentImage.imageUrl;
    const filename = `lumora-diagram-${(currentImage.prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')) || 'image'}.png`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
      
      {/* HEADER */}
      <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
              <span>Educational Diagram & Visualizer AI</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                <span>🍌</span>
                <span>Nano Banana Free AI</span>
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate labeled scientific diagrams, 3D anatomical models, and textbook illustrations with zero quota limits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-red-300 transition-colors flex items-center gap-1.5"
              title="Clear generated history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear History</span>
            </button>
          )}
          <button
            onClick={() => navigate('/student/explain-simply')}
            className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
          >
            <span>Explain Simply</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Controls, Prompts, Presets (5 Cols) */}
        <div className="lg:col-span-5 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full overflow-y-auto p-5 space-y-6">
          
          {/* PROMPT INPUT SECTION */}
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Concept or Diagram Description
                </label>
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={enhancing || !prompt.trim()}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {enhancing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5" />
                  )}
                  <span>AI Enhance Prompt</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Cross-section of a chloroplast showing thylakoids, grana, and stroma with photosynthesis light reaction labels..."
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-28 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-all leading-relaxed"
                />
                {prompt && (
                  <button
                    type="button"
                    onClick={() => setPrompt("")}
                    className="absolute right-3 top-3 p-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* REMIX / SOURCE IMAGE (OPTIONAL) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  Optional Reference Image / Diagram to Modify:
                </span>
                {inputImage && (
                  <button
                    type="button"
                    onClick={() => setInputImage(null)}
                    className="text-red-500 hover:underline text-[11px]"
                  >
                    Remove Reference
                  </button>
                )}
              </div>

              {inputImage ? (
                <div className="flex items-center gap-3 p-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl">
                  <img 
                    src={inputImage} 
                    alt="Reference" 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700" 
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-medium text-blue-900 dark:text-blue-300">Reference Image Attached</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">The AI will edit and adapt this visual based on your prompt.</p>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-2.5 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Upload textbook photo or sketch to modify</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* AI MODEL SELECTOR */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>🍌</span>
                  <span>AI Image Engine</span>
                </label>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                  Free & Unlimited Available
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MODEL_OPTIONS.map((m) => {
                  const isSelected = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold leading-tight">{m.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                          isSelected ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{m.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STYLE SELECTOR */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Illustration Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLE_OPTIONS.map((style) => {
                  const Icon = style.icon;
                  const isSelected = selectedStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-bold leading-tight">{style.name}</div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{style.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ASPECT RATIO */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Aspect Ratio
              </label>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setSelectedAspect(ratio.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedAspect === ratio.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 leading-relaxed flex items-start gap-2">
                <X className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Generation notice: </strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Visual with Nano Banana...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Diagram (Nano Banana)</span>
                </>
              )}
            </button>
          </form>

          {/* CURATED SUBJECT PRESET PROMPTS */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Curated Syllabus Diagrams
              </h3>
              <div className="flex gap-1">
                {SUBJECT_PRESETS.map((p) => (
                  <button
                    key={p.category}
                    onClick={() => setActiveCategory(p.category)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      activeCategory === p.category
                        ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SUBJECT_PRESETS.find(s => s.category === activeCategory)?.items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(item.prompt);
                  }}
                  className="text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-800 transition-all group"
                >
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                    <span>{item.label}</span>
                    <Sparkles className="w-3 h-3 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Canvas & Gallery (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-100/70 dark:bg-slate-950 p-6 flex flex-col overflow-y-auto space-y-6">
          
          {/* PRIMARY DISPLAY CANVAS */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col justify-between min-h-[420px]">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                {currentImage ? (
                  <>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {STYLE_OPTIONS.find(s => s.id === currentImage.style)?.name || 'Diagram'}
                    </span>
                    <span>•</span>
                    <span>Ratio {currentImage.aspectRatio}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold text-[10px] border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                      <span>🍌</span>
                      <span>{currentImage.modelUsed || 'Nano Banana AI'}</span>
                    </span>
                  </>
                ) : (
                  <span>Canvas Preview</span>
                )}
              </div>

              {currentImage && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyImage}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Copy image"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-blue-200 dark:border-blue-800"
                    title="Download PNG"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setIsLightboxOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Expand Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Canvas Main Image / Loading State */}
            <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden min-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 animate-pulse">
                      <Sparkles className="w-8 h-8 animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Generating Scientific Diagram...
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Gemini is rendering high-precision educational labels and structures.
                    </p>
                  </div>
                </div>
              ) : currentImage ? (
                <div className="w-full h-full flex items-center justify-center relative group">
                  <img
                    src={currentImage.imageUrl}
                    alt={currentImage.prompt}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[460px] object-contain rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                  />
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button
                      onClick={() => setInputImage(currentImage.imageUrl)}
                      className="bg-black/75 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Remix / Edit</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center max-w-sm text-slate-400">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      Your Diagram Will Appear Here
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Type a science concept or click one of the syllabus presets on the left to start.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Footnote & Direct Action Links */}
            {currentImage && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-600 dark:text-slate-400 line-clamp-2 max-w-lg">
                  <span className="font-semibold text-slate-900 dark:text-slate-200">Prompt: </span>
                  {currentImage.prompt}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/student/explain-simply')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Explain in detail</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* HISTORY GALLERY */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span>Session Gallery ({history.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {history.map((item) => {
                  const isCurrent = currentImage?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCurrentImage(item)}
                      className={`group relative rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 cursor-pointer border-2 transition-all ${
                        isCurrent 
                          ? 'border-blue-600 ring-2 ring-blue-500/20' 
                          : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-1 rounded self-start">
                          {item.aspectRatio}
                        </span>
                        <p className="text-[10px] text-white line-clamp-2 leading-tight drop-shadow">
                          {item.prompt}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && currentImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col">
          {/* Lightbox Header */}
          <div className="p-4 flex items-center justify-between text-white border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">{STYLE_OPTIONS.find(s => s.id === currentImage.style)?.name}</span>
              <span className="text-xs text-white/60">({currentImage.aspectRatio})</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Viewport */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
            <img
              src={currentImage.imageUrl}
              alt={currentImage.prompt}
              referrerPolicy="no-referrer"
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease-out' }}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Lightbox Footer */}
          <div className="p-4 bg-black/60 text-white/80 text-xs text-center border-t border-white/10">
            {currentImage.prompt}
          </div>
        </div>
      )}

    </div>
  );
}
