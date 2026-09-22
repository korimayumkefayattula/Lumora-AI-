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
  ChevronRight,
  Split,
  Eye,
  SlidersHorizontal,
  Shuffle,
  Lightbulb,
  Radio,
  FileCode,
  CheckCircle2,
  Search
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
  keyLabels?: string[];
}

const MODEL_OPTIONS = [
  { id: 'nano-banana-free', name: 'Nano Banana Free Model', desc: 'Best free model for visuals, mind maps, flowcharts & infographics (ChatGPT DALL-E 3 style)', badge: 'Best Free • Nano Banana', icon: '🍌' },
  { id: 'vector-svg', name: 'Lumora Vector AI (Gemini SVG)', desc: '100% precision annotated SVG diagrams with infinite zoom', badge: 'Vector SVG', icon: '📐' },
  { id: 'imagen-3', name: 'Google Imagen 3.0 Ultra', desc: 'Studio photorealism & 4K educational macro rendering', badge: 'Imagen 3', icon: '🎨' }
];

const STYLE_OPTIONS = [
  { id: 'chatgpt-infographic', name: 'ChatGPT Style Infographic', desc: 'Modular bento cards, vibrant modern palette, metrics & vector icons', icon: Palette },
  { id: 'chatgpt-mindmap', name: 'ChatGPT Style Mind Map', desc: 'Glowing central concept core with organic branches & sleek pill cards', icon: Sparkles },
  { id: 'chatgpt-flowchart', name: 'ChatGPT Style Flowchart', desc: 'Step-by-step pipeline layout with process cards & decision diamonds', icon: Binary },
  { id: 'neoclassical-allegory', name: 'Neoclassical Enlightenment Allegory', desc: 'Regnault & David oil painting with allegorical figures of Reason & Science', icon: Sparkles },
  { id: 'scientific-diagram', name: 'Scientific Diagram', desc: 'Crisp labeled callouts & white backdrop', icon: Compass },
  { id: 'textbook-illustration', name: 'Textbook Illustration', desc: 'Detailed educational print line art', icon: BookOpen },
  { id: '3d-render', name: '3D Scientific Render', desc: 'Photorealistic volumetric Octane lighting', icon: Layers },
  { id: 'infographic', name: 'Modern Infographic', desc: 'Clean vector flowcharts, stats & cards', icon: Palette },
  { id: 'dark-neon', name: 'Dark Neon High-Tech', desc: 'Glowing cybernetic & holographic lines', icon: Atom },
  { id: 'blueprint', name: 'Technical Blueprint', desc: 'Engineering navy grid & drafting schematics', icon: Binary },
  { id: 'chalkboard', name: 'Chalkboard Sketch', desc: 'Classic lecture blackboard sketch', icon: Sliders },
  { id: 'photorealistic', name: 'Photorealistic Macro', desc: '8K authentic physical textures & realism', icon: ImageIcon },
];

const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9 Wide', desc: 'Slides & Desktop', iconWidth: 'w-6 h-3.5' },
  { id: '4:3', label: '4:3 Standard', desc: 'Textbook / Notes', iconWidth: 'w-5 h-3.5' },
  { id: '1:1', label: '1:1 Square', desc: 'Flashcards', iconWidth: 'w-4 h-4' },
  { id: '3:4', label: '3:4 Portrait', desc: 'Worksheets', iconWidth: 'w-3.5 h-4.5' },
  { id: '9:16', label: '9:16 Tall', desc: 'Mobile / Stories', iconWidth: 'w-3 h-5' },
];

const SUBJECT_PRESETS = [
  {
    category: 'Enlightenment & Allegories',
    icon: Sparkles,
    items: [
      { label: 'Allegory of Reason, Truth & Geometry', prompt: 'A magnificent 1793 French Enlightenment neoclassical oil painting in the style of Jean-Baptiste Regnault and Jacques-Louis David. Allegorical figures representing Reason with a level plumb-line, winged Genius of Knowledge with a flame atop the head, dramatic chiaroscuro lighting, neoclassical drapery, celestial clouds and golden heavenly light, oil on canvas masterwork.' },
      { label: 'Apotheosis of Isaac Newton & Gravitation', prompt: 'Neoclassical historical allegory depicting Sir Isaac Newton receiving the divine light of mathematical truth, surrounded by allegorical muses of Geometry, Calculus and Celestial Mechanics, celestial planetary orbs in the background, dramatic museum canvas texture.' },
      { label: 'The Genius of Mathematics Unveiling Nature', prompt: 'Grand classical allegory of a winged youth holding a glowing compass and parchment unveiling the veiled statue of Nature, radiant golden atmosphere, Roman architectural columns, classical oil painting.' },
      { label: 'The Temple of Chemistry & Elements', prompt: 'Neoclassical allegorical scene in a grand marble temple where figures of Lavoisier and Mendeleev arrange the elements under the watchful eye of Minerva, atmospheric smoky braziers, rich chiaroscuro.' }
    ]
  },
  {
    category: 'Biology',
    icon: Dna,
    items: [
      { label: 'Human Heart 4 Chambers', prompt: 'Detailed anatomical cross-section diagram of the human heart showing 4 chambers (left/right atrium and ventricles), bicuspid and tricuspid valves, aorta, pulmonary artery, and directional oxygenated vs deoxygenated blood flow arrows with clear labels on a clean white background.' },
      { label: 'Plant Cell vs Animal Cell', prompt: 'Side-by-side comparative educational diagram of a Plant Cell and an Animal Cell, highlighting cell wall, chloroplasts, large central vacuole, mitochondria, endoplasmic reticulum, and nucleus with color-coded labels.' },
      { label: 'DNA Double Helix & Base Pairs', prompt: 'Structural biochemistry illustration of the DNA double helix showing antiparallel sugar-phosphate backbones, major and minor grooves, and complementary nitrogenous base pairs (Adenine-Thymine, Guanine-Cytosine) with hydrogen bonds.' },
      { label: 'Neuron Action Potential Synapse', prompt: 'Detailed microscopic illustration of a neuron chemical synapse showing axon terminal, synaptic vesicles releasing neurotransmitters, synaptic cleft, receptor channels on postsynaptic membrane, and electrical action potential wave.' },
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
      { label: 'Newton’s Laws Inclined Plane', prompt: 'Free body diagram of a mass m resting on an inclined plane of angle theta, showing weight vector mg, normal force N, gravitational components mg sin(theta) and mg cos(theta), and static friction force.' },
      { label: 'Carnot Heat Engine Cycle', prompt: 'Thermodynamics P-V indicator diagram showing the 4 stages of the Carnot cycle (isothermal expansion, adiabatic expansion, isothermal compression, adiabatic compression) with work done area and efficiency formula.' }
    ]
  },
  {
    category: 'Chemistry',
    icon: Compass,
    items: [
      { label: 'Electrolysis of Water Apparatus', prompt: 'High-clarity laboratory apparatus diagram for the electrolysis of acidified water using Hoffman apparatus, showing battery DC connection, inert platinum electrodes, anode generating Oxygen gas (1 volume), and cathode generating Hydrogen gas (2 volumes).' },
      { label: 'Atomic Orbital Hybridization (sp3)', prompt: '3D orbital shapes diagram showing sp3 hybridization in Methane (CH4), sp2 in Ethene, and sp in Ethyne with tetrahedral bond angles of 109.5 degrees and overlapping sigma and pi bonds.' },
      { label: 'Periodic Table Trends Infographic', prompt: 'Infographic of the periodic table showing directional arrows and trends for Electronegativity, Ionization Energy, Electron Affinity, and Atomic Radius across periods and groups.' },
      { label: 'Fractional Distillation of Crude Oil', prompt: 'Cross-section illustration of a petroleum fractional distillation fractionating column showing temperature gradient from bottom (350C) to top (20C) and condensing fractions (bitumen, diesel, kerosene, petrol, refinery gas).' }
    ]
  },
  {
    category: 'Math & CS',
    icon: Binary,
    items: [
      { label: 'Trigonometric Unit Circle', prompt: 'Mathematically precise Unit Circle diagram showing key angles in degrees (0 to 360) and radians (0 to 2pi), corresponding (cos theta, sin theta) coordinate values, and quadrant signs on a Cartesian grid.' },
      { label: 'Pythagorean Theorem Visual Proof', prompt: 'Visual geometric proof diagram of Pythagoras theorem showing a right-angled triangle with sides a, b, hypotenuse c and square areas a^2, b^2, c^2 color-coded to show a^2 + b^2 = c^2.' },
      { label: 'Binary Search Tree & Traversals', prompt: 'Computer science data structure diagram of a balanced Binary Search Tree (BST) showing root, parent, left/right child nodes, and step-by-step Inorder, Preorder, and Postorder traversal routes.' },
      { label: 'Neural Network Architecture', prompt: 'Deep learning neural network architecture diagram displaying input layer neurons, multi-layer hidden representations with weight connections, ReLU activations, and softmax classification output layer.' }
    ]
  },
  {
    category: 'Astronomy',
    icon: Sparkles,
    items: [
      { label: 'Solar System Planetary Orbits', prompt: 'Scale-referenced pedagogical diagram of the Solar System showing the Sun, Terrestrial planets (Mercury, Venus, Earth, Mars), Asteroid Belt, Gas Giants (Jupiter, Saturn), Ice Giants (Uranus, Neptune), and Kuiper Belt.' },
      { label: 'Black Hole Structure & Event Horizon', prompt: 'Astrophysical illustration of a spinning Kerr Black Hole showing the central singularity, event horizon, photon sphere, swirling glowing accretion disk with relativistic beaming, and relativistic plasma jets.' },
      { label: 'Stellar Evolution Life Cycle', prompt: 'Flowchart diagram of stellar evolution from Stellar Nebula to Average Star vs Massive Star branches, ending in Red Giant, Planetary Nebula, White Dwarf, Supernova, Neutron Star, and Black Hole.' }
    ]
  }
];

const RANDOM_CONCEPT_IDEAS = [
  "Cross-section of human eye with cornea, lens, retina, fovea, and optic nerve",
  "Plate tectonics convergent vs divergent boundary subduction zone with magma chambers",
  "Nitrogen cycle in ecosystem showing nitrogen fixation, nitrification, assimilation, and denitrification",
  "Doppler effect wave compression with moving sound source and observer frequency shift",
  "Enzyme-substrate lock and key mechanism versus induced fit model with active site transition state",
  "Hydraulic press Pascal's Principle showing input piston force F1, area A1 and output lifting force F2, area A2",
  "Bohr model versus quantum mechanical electron cloud probability density for Hydrogen atom"
];

export default function ImageGenerator() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("nano-banana-free");
  const [selectedStyle, setSelectedStyle] = useState("scientific-diagram");
  const [selectedAspect, setSelectedAspect] = useState("16:9");
  const [activeCategory, setActiveCategory] = useState("Biology");
  const [qualityBoost, setQualityBoost] = useState(true);
  
  const [currentImage, setCurrentImage] = useState<GeneratedImageItem | null>(null);
  const [comparisonImage, setComparisonImage] = useState<GeneratedImageItem | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [history, setHistory] = useState<GeneratedImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState("");
  
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
          if (parsed.length > 1) {
            setComparisonImage(parsed[1]);
          }
        }
      }
    } catch (e) {
      console.error("Failed to read image history:", e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (item: GeneratedImageItem) => {
    setHistory(prev => {
      const updated = [item, ...prev.filter(i => i.id !== item.id)].slice(0, 40);
      try {
        localStorage.setItem('lumora_generated_images', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your generated diagrams history?")) {
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
      if (data.recommendedStyle && STYLE_OPTIONS.some(s => s.id === data.recommendedStyle)) {
        setSelectedStyle(data.recommendedStyle);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setEnhancing(false);
    }
  };

  // Surprise Me / Random Concept
  const handleRandomPrompt = () => {
    const randomTopic = RANDOM_CONCEPT_IDEAS[Math.floor(Math.random() * RANDOM_CONCEPT_IDEAS.length)];
    setPrompt(randomTopic);
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
          inputImage: inputImage || undefined,
          subject: activeCategory,
          qualityBoost
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.details || data.error || "Failed to generate visual diagram.");
      }

      const newItem: GeneratedImageItem = {
        id: Math.random().toString(36).substring(2, 9),
        prompt: prompt.trim(),
        imageUrl: data.imageUrl,
        timestamp: Date.now(),
        aspectRatio: selectedAspect,
        style: selectedStyle,
        subject: activeCategory,
        modelUsed: data.modelUsed || 'Lumora AI Visualizer'
      };

      if (currentImage) {
        setComparisonImage(currentImage);
      }
      setCurrentImage(newItem);
      saveToHistory(newItem);
    } catch (err: any) {
      console.error("Generate error:", err);
      setErrorMessage(err.message || "Failed to synthesize visual. Please try again.");
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
      if (currentImage.imageUrl.startsWith('data:image/svg+xml;base64,')) {
        const svgCode = atob(currentImage.imageUrl.replace('data:image/svg+xml;base64,', ''));
        await navigator.clipboard.writeText(svgCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
      const response = await fetch(currentImage.imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      navigator.clipboard.writeText(currentImage.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download image
  const handleDownload = (format: 'png' | 'svg' | 'jpg' = 'png') => {
    if (!currentImage?.imageUrl) return;
    const a = document.createElement('a');
    a.href = currentImage.imageUrl;
    const ext = currentImage.imageUrl.startsWith('data:image/svg') ? 'svg' : format;
    const filename = `lumora-${(currentImage.prompt.slice(0, 32).replace(/[^a-zA-Z0-9]/g, '_')) || 'diagram'}.${ext}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredHistory = history.filter(item => 
    !historyFilter || 
    item.prompt.toLowerCase().includes(historyFilter.toLowerCase()) || 
    (item.subject && item.subject.toLowerCase().includes(historyFilter.toLowerCase()))
  );

  return (
    <div className="h-full bg-slate-50 dark:bg-[#090a10] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
      
      {/* HEADER BAR */}
      <header className="px-6 py-3.5 bg-white dark:bg-[#11131c] border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display tracking-tight flex items-center gap-2">
              <span>LumoraAI Studio Visualizer</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span>Next-Gen Image & Diagram AI</span>
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create high-clarity scientific diagrams, 3D anatomical models, and vector charts powered by Gemini 3.7 & Flux
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 1 && (
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                isCompareMode
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                  : 'bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>{isCompareMode ? 'Exit Split View' : 'Compare Diagrams'}</span>
            </button>
          )}

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-300 transition-colors flex items-center gap-1.5"
              title="Clear generated history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          
          <button
            onClick={() => navigate('/student/explain-simply')}
            className="text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors flex items-center gap-1"
          >
            <span>Explain Topic</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Controls, Engine Options, Presets (5 Cols) */}
        <div className="lg:col-span-5 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#10121b] flex flex-col h-full overflow-y-auto p-5 space-y-6">
          
          {/* PROMPT INPUT SECTION */}
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Concept or Diagram Description
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRandomPrompt}
                    className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors"
                    title="Insert random educational topic"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Surprise Me</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={enhancing || !prompt.trim()}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {enhancing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                    <span>AI Enhance</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Cross-section of a chloroplast showing thylakoid discs, grana stacks, and stroma with photosynthesis light reaction arrows..."
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none resize-none h-28 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-all leading-relaxed"
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
                <div className="flex items-center gap-3 p-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl">
                  <img 
                    src={inputImage} 
                    alt="Reference" 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700" 
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-medium text-rose-900 dark:text-rose-300">Reference Image Attached</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">The AI will edit and adapt this visual based on your prompt.</p>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-slate-300 dark:border-slate-700/80 hover:border-rose-400 dark:hover:border-rose-500 rounded-xl p-2.5 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Upload textbook photo, sketch, or diagram to remix</span>
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

            {/* AI ENGINE SELECTOR */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-rose-500" />
                  <span>AI Rendering Engine</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="checkbox"
                    id="quality-boost"
                    checked={qualityBoost}
                    onChange={(e) => setQualityBoost(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <label htmlFor="quality-boost" className="text-[11px] font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    Studio Clarity Boost
                  </label>
                </div>
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
                          ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 ring-1 ring-rose-400'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold leading-tight flex items-center gap-1">
                          <span>{m.icon}</span>
                          <span>{m.name}</span>
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                          isSelected ? 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
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
                Visual & Pedagogical Style
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
                          ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`} />
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
                Output Dimension / Aspect Ratio
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {ASPECT_RATIOS.map((ratio) => {
                  const isSelected = selectedAspect === ratio.id;
                  return (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setSelectedAspect(ratio.id)}
                      className={`py-2 px-1.5 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className={`border rounded ${isSelected ? 'border-white bg-white/30' : 'border-slate-400 bg-slate-200 dark:bg-slate-700'} ${ratio.iconWidth}`} />
                      <span className="text-[10px] font-bold">{ratio.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 leading-relaxed flex items-start gap-2">
                <X className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Notice: </strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing High-Precision Visual...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Diagram (LumoraAI)</span>
                </>
              )}
            </button>
          </form>

          {/* CURATED SUBJECT PRESET PROMPTS */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                <span>Curated Syllabus Diagrams</span>
              </h3>
              <div className="flex gap-1 overflow-x-auto pb-1 max-w-[220px]">
                {SUBJECT_PRESETS.map((p) => (
                  <button
                    key={p.category}
                    onClick={() => setActiveCategory(p.category)}
                    className={`text-[11px] px-2 py-0.5 rounded-lg font-semibold transition-all shrink-0 ${
                      activeCategory === p.category
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
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
                  className="text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 transition-all group"
                >
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 flex items-center justify-between">
                    <span>{item.label}</span>
                    <Sparkles className="w-3 h-3 text-slate-300 group-hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        <div className="lg:col-span-7 bg-slate-100/60 dark:bg-[#07080d] p-6 flex flex-col overflow-y-auto space-y-6">
          
          {/* PRIMARY DISPLAY CANVAS OR SPLIT COMPARISON */}
          {isCompareMode && comparisonImage && currentImage ? (
            /* SPLIT COMPARISON VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div className="bg-white dark:bg-[#11131c] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Diagram A (Active)</span>
                  <span className="text-[10px] text-slate-400">{currentImage.aspectRatio}</span>
                </div>
                <div className="flex-1 flex items-center justify-center p-2">
                  <img
                    src={currentImage.imageUrl}
                    alt={currentImage.prompt}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[360px] object-contain rounded-xl"
                  />
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {currentImage.prompt}
                </p>
              </div>

              <div className="bg-white dark:bg-[#11131c] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Diagram B (Previous)</span>
                  <span className="text-[10px] text-slate-400">{comparisonImage.aspectRatio}</span>
                </div>
                <div className="flex-1 flex items-center justify-center p-2">
                  <img
                    src={comparisonImage.imageUrl}
                    alt={comparisonImage.prompt}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[360px] object-contain rounded-xl"
                  />
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {comparisonImage.prompt}
                </p>
              </div>
            </div>
          ) : (
            /* STANDARD DISPLAY CANVAS */
            <div className="flex-1 bg-white dark:bg-[#11131c] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm p-4 flex flex-col justify-between min-h-[440px]">
              
              {/* Top Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  {currentImage ? (
                    <>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {STYLE_OPTIONS.find(s => s.id === currentImage.style)?.name || 'Diagram'}
                      </span>
                      <span>•</span>
                      <span>Ratio {currentImage.aspectRatio}</span>
                      <span>•</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold text-[10px] border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-rose-500" />
                        <span>{currentImage.modelUsed || 'LumoraAI'}</span>
                      </span>
                    </>
                  ) : (
                    <span>Studio Canvas Preview</span>
                  )}
                </div>

                {currentImage && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyImage}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                      title="Copy image or SVG data"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                    
                    <button
                      onClick={() => handleDownload('png')}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-rose-200 dark:border-rose-800"
                      title="Download PNG image"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
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
              <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden min-h-[340px]">
                {loading ? (
                  <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 animate-pulse">
                        <Sparkles className="w-8 h-8 animate-spin" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Synthesizing Scientific Visual...
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        LumoraAI is calculating labeled anatomical callouts and optical gradients.
                      </p>
                    </div>
                  </div>
                ) : currentImage ? (
                  <div className="w-full h-full flex items-center justify-center relative group">
                    <img
                      src={currentImage.imageUrl}
                      alt={currentImage.prompt}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-[480px] object-contain rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80"
                    />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <button
                        onClick={() => setInputImage(currentImage.imageUrl)}
                        className="bg-black/80 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Remix / Edit</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center max-w-sm text-slate-400">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center text-slate-300 dark:text-slate-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        Your Studio Visual Will Appear Here
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Type any science, math, or history concept or select one of the curated curriculum presets to begin.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Prompt Footnote & Direct Action Links */}
              {currentImage && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-600 dark:text-slate-400 line-clamp-2 max-w-lg">
                    <span className="font-semibold text-slate-900 dark:text-slate-200">Concept Prompt: </span>
                    {currentImage.prompt}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigate('/student/explain-simply')}
                      className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <span>Explain in detail</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* HISTORY GALLERY */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-[#11131c] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-rose-500" />
                  <span>Session Gallery ({history.length})</span>
                </h3>
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Filter gallery..."
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-8 pr-2 py-1 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filteredHistory.map((item) => {
                  const isCurrent = currentImage?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCurrentImage(item)}
                      className={`group relative rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 cursor-pointer border-2 transition-all ${
                        isCurrent 
                          ? 'border-rose-500 ring-2 ring-rose-500/20' 
                          : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 flex flex-col justify-between">
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
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col">
          {/* Lightbox Header */}
          <div className="p-4 flex items-center justify-between text-white border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">{STYLE_OPTIONS.find(s => s.id === currentImage.style)?.name}</span>
              <span className="text-xs text-white/60">({currentImage.aspectRatio})</span>
              <span className="text-xs text-rose-400 font-semibold">• {currentImage.modelUsed}</span>
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
                  onClick={() => setZoomLevel(prev => Math.min(4, prev + 0.25))}
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
                onClick={() => handleDownload('png')}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
          <div className="p-4 bg-black/70 text-white/90 text-xs text-center border-t border-white/10">
            {currentImage.prompt}
          </div>
        </div>
      )}

    </div>
  );
}
