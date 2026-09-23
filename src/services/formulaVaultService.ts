import { saveKeepNote, KeepNoteItem, storeKeepNotesLocally, getStoredKeepNotes } from './firestoreWorkspace';

export interface VaultFormula {
  id: string;
  symbol: string;
  name: string;
  latex: string;
  subject: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | 'Computer Science';
  topic: string;
  definition: string;
  variables: Array<{ symbol: string; meaning: string; units?: string }>;
  examTip: string;
  favorite?: boolean;
}

const VAULT_STORAGE_KEY = 'lumora_formula_vault_custom';
const VAULT_FAVORITES_KEY = 'lumora_formula_vault_favorites';

export const SEED_VAULT_FORMULAS: VaultFormula[] = [
  {
    id: 'f_relativity_time',
    symbol: 'Δt = γΔt₀',
    name: 'Relativistic Time Dilation',
    latex: '\\Delta t = \\frac{\\Delta t_0}{\\sqrt{1 - \\frac{v^2}{c^2}}}',
    subject: 'Physics',
    topic: 'Special Relativity',
    definition: 'Clocks in relative motion tick slower compared to stationary proper time clocks.',
    variables: [
      { symbol: 'Δt', meaning: 'Dilated time interval measured by observer', units: 'seconds (s)' },
      { symbol: 'Δt₀', meaning: 'Proper time interval measured in rest frame of clock', units: 'seconds (s)' },
      { symbol: 'v', meaning: 'Relative velocity of the moving frame', units: 'm/s' },
      { symbol: 'c', meaning: 'Speed of light in vacuum (299,792,458 m/s)', units: 'm/s' },
      { symbol: 'γ', meaning: 'Lorentz factor: 1 / sqrt(1 - v²/c²)', units: 'dimensionless (≥ 1)' }
    ],
    examTip: 'Proper time Δt₀ is always measured between events occurring at the exact same spatial location in that frame.'
  },
  {
    id: 'f_de_broglie',
    symbol: 'λ = h / p',
    name: 'de Broglie Wavelength',
    latex: '\\lambda = \\frac{h}{p} = \\frac{h}{m v}',
    subject: 'Physics',
    topic: 'Quantum Mechanics',
    definition: 'Every moving quantum particle possesses an associated matter wave whose wavelength is inversely proportional to momentum.',
    variables: [
      { symbol: 'λ', meaning: 'de Broglie matter wavelength', units: 'meters (m)' },
      { symbol: 'h', meaning: 'Planck\'s constant (6.626 × 10⁻³⁴ J·s)', units: 'J·s' },
      { symbol: 'p', meaning: 'Linear momentum (m × v)', units: 'kg·m/s' },
      { symbol: 'm', meaning: 'Particle mass', units: 'kg' }
    ],
    examTip: 'To find de Broglie wavelength from accelerating voltage V: λ = h / sqrt(2mqV).'
  },
  {
    id: 'f_sn2_rate',
    symbol: 'Rate = k[R-X][Nu⁻]',
    name: 'SN2 Bimolecular Substitution Rate Law',
    latex: '\\text{Rate} = k [\\text{R-X}][\\text{Nu}^-]',
    subject: 'Chemistry',
    topic: 'Organic Reaction Mechanisms',
    definition: 'Bimolecular second-order nucleophilic substitution occurring via a single concerted transition state with 100% Walden inversion.',
    variables: [
      { symbol: 'k', meaning: 'Second-order rate constant', units: 'M⁻¹ s⁻¹' },
      { symbol: '[R-X]', meaning: 'Concentration of alkyl halide substrate', units: 'mol/L' },
      { symbol: '[Nu⁻]', meaning: 'Concentration of attacking nucleophile', units: 'mol/L' }
    ],
    examTip: 'Doubling nucleophile concentration doubles the rate in SN2, but has ZERO effect in SN1!'
  },
  {
    id: 'f_nernst',
    symbol: 'E = E° - (RT/nF)ln(Q)',
    name: 'Nernst Electrochemical Equation',
    latex: 'E = E^\\circ - \\frac{RT}{nF} \\ln Q = E^\\circ - \\frac{0.0592}{n} \\log_{10} Q',
    subject: 'Chemistry',
    topic: 'Electrochemistry',
    definition: 'Calculates non-standard reduction potential of an electrochemical cell as a function of reaction quotient Q.',
    variables: [
      { symbol: 'E', meaning: 'Cell potential under non-standard conditions', units: 'Volts (V)' },
      { symbol: 'E°', meaning: 'Standard cell potential', units: 'Volts (V)' },
      { symbol: 'n', meaning: 'Number of moles of electrons transferred', units: 'mol' },
      { symbol: 'Q', meaning: 'Reaction quotient ([Products] / [Reactants])', units: 'dimensionless' }
    ],
    examTip: 'At true thermodynamic equilibrium: E_cell = 0 V and Q = K_eq, yielding E° = (0.0592/n) log K.'
  },
  {
    id: 'f_hardy_weinberg',
    symbol: 'p² + 2pq + q² = 1',
    name: 'Hardy-Weinberg Equilibrium Principle',
    latex: 'p^2 + 2pq + q^2 = 1 \\quad \\text{and} \\quad p + q = 1',
    subject: 'Biology',
    topic: 'Genetics & Population Evolution',
    definition: 'Allele and genotype frequencies in a large, randomly mating population remain constant across generations in the absence of evolutionary forces.',
    variables: [
      { symbol: 'p', meaning: 'Frequency of dominant allele (A)', units: 'ratio (0 to 1)' },
      { symbol: 'q', meaning: 'Frequency of recessive allele (a)', units: 'ratio (0 to 1)' },
      { symbol: 'p²', meaning: 'Frequency of homozygous dominant genotype (AA)', units: 'ratio' },
      { symbol: '2pq', meaning: 'Frequency of heterozygous carriers (Aa)', units: 'ratio' },
      { symbol: 'q²', meaning: 'Frequency of homozygous recessive individuals (aa)', units: 'ratio' }
    ],
    examTip: 'Always calculate q first by finding the square root of the recessive phenotype frequency q²!'
  },
  {
    id: 'f_fourier_transform',
    symbol: 'F(ω) = ∫ f(t) e^(-iωt) dt',
    name: 'Continuous Fourier Transform',
    latex: 'F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} \\, dt',
    subject: 'Mathematics',
    topic: 'Signal Processing & Differential Equations',
    definition: 'Decomposes a continuous time-domain signal into its constituent frequency components via complex sinusoidal projection.',
    variables: [
      { symbol: 'F(ω)', meaning: 'Complex frequency spectrum output', units: 'amplitude/phase' },
      { symbol: 'f(t)', meaning: 'Original time-domain signal wave', units: 'amplitude' },
      { symbol: 'ω', meaning: 'Angular frequency (2πf)', units: 'rad/s' },
      { symbol: 'e^(-iωt)', meaning: 'Euler rotation basis vector: cos(ωt) - i sin(ωt)', units: 'complex' }
    ],
    examTip: 'Convolution in the time domain corresponds to simple algebraic multiplication in the frequency domain: F{f * g} = F(ω) · G(ω).'
  },
  {
    id: 'f_transformer_attention',
    symbol: 'Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V',
    name: 'Scaled Dot-Product Self-Attention',
    latex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V',
    subject: 'Computer Science',
    topic: 'Neural Networks & Transformers',
    definition: 'Calculates pairwise token relevance weights by projecting queries and keys, normalized by root dimension to prevent gradient vanishing.',
    variables: [
      { symbol: 'Q', meaning: 'Queries matrix (what each token seeks)', units: 'matrix' },
      { symbol: 'K', meaning: 'Keys matrix (what each token offers)', units: 'matrix' },
      { symbol: 'V', meaning: 'Values matrix (actual semantic embeddings)', units: 'matrix' },
      { symbol: 'd_k', meaning: 'Dimensionality of key vectors (scaling factor)', units: 'integer' }
    ],
    examTip: 'The 1/√d_k factor keeps dot products from growing excessively large, avoiding extreme regions of softmax where gradients saturate.'
  }
];

export function getAllVaultFormulas(): VaultFormula[] {
  try {
    const rawCustom = localStorage.getItem(VAULT_STORAGE_KEY);
    const custom: VaultFormula[] = rawCustom ? JSON.parse(rawCustom) : [];
    const favorites = getVaultFavoriteIds();

    const merged = [...SEED_VAULT_FORMULAS, ...custom];
    return merged.map(f => ({
      ...f,
      favorite: favorites.includes(f.id)
    }));
  } catch {
    return SEED_VAULT_FORMULAS;
  }
}

export function getVaultFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(VAULT_FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleVaultFormulaFavorite(formulaId: string): boolean {
  try {
    const current = getVaultFavoriteIds();
    let updated: string[];
    let isFav = false;
    if (current.includes(formulaId)) {
      updated = current.filter(id => id !== formulaId);
      isFav = false;
    } else {
      updated = [...current, formulaId];
      isFav = true;
    }
    localStorage.setItem(VAULT_FAVORITES_KEY, JSON.stringify(updated));
    return isFav;
  } catch {
    return false;
  }
}

export function addCustomVaultFormula(formula: Omit<VaultFormula, 'id'>): VaultFormula {
  const newFormula: VaultFormula = {
    ...formula,
    id: `custom_form_${Date.now()}`
  };
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    const custom: VaultFormula[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify([newFormula, ...custom]));
  } catch (err) {
    console.error('Error saving formula:', err);
  }
  return newFormula;
}

export async function exportVaultToKeep(formulas: VaultFormula[], userId?: string | null): Promise<KeepNoteItem> {
  const title = `Formula Vault: ${formulas.length} Core STEM Equations`;
  const content = formulas.map((f, idx) => {
    const vars = f.variables.map(v => `  - ${v.symbol}: ${v.meaning}${v.units ? ` (${v.units})` : ''}`).join('\n');
    return `[#${idx + 1}] ${f.name} (${f.subject} • ${f.topic})\nFormula: ${f.symbol}\nLatex: ${f.latex}\nVariables:\n${vars}\nExam Tip: ${f.examTip}`;
  }).join('\n\n---\n\n');

  const item: KeepNoteItem = {
    id: `keep_vault_${Date.now()}`,
    title,
    content,
    color: 'teal',
    pinned: true,
    tags: ['Formula Vault', 'Definitions', 'STEM Cheat Sheet', 'Dr. Agnes'],
    userId: userId || 'local_student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const stored = getStoredKeepNotes();
  storeKeepNotesLocally([item, ...stored]);

  if (userId) {
    try {
      await saveKeepNote(item);
    } catch {}
  }

  return item;
}
