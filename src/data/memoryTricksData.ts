export interface MemoryTrick {
  id: string;
  subject: 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'General Learning';
  title: string;
  difficulty: 'Quick Hack' | 'Deep Framework' | 'Exam Lifesaver';
  mnemonicCode: string;
  explanation: string;
  realWorldAnalogy: string;
  formulaOrFact: string;
  visualCue: string;
  howToPractice: string;
}

export const MEMORY_TRICKS: MemoryTrick[] = [
  // --- CHEMISTRY TRICKS ---
  {
    id: 'chem-oil-rig',
    subject: 'Chemistry',
    title: 'OIL RIG & LEO GER for Redox Reactions',
    difficulty: 'Quick Hack',
    mnemonicCode: 'O.I.L.  R.I.G.  &  L.E.O. the lion says G.E.R.',
    explanation: 'OIL = Oxidation Is Loss of electrons. RIG = Reduction Is Gain of electrons. LEO = Lose Electrons Oxidation. GER = Gain Electrons Reduction.',
    realWorldAnalogy: 'Think of electrons like negative debt: when an atom Loses debt (electrons), its oxidation state goes UP (Oxidation). When it Gains debt, its state goes DOWN (Reduction).',
    formulaOrFact: 'Zn → Zn²⁺ + 2e⁻ (Oxidation/Loss) | Cu²⁺ + 2e⁻ → Cu (Reduction/Gain)',
    visualCue: 'An oil rig in the sea pumping away electrons.',
    howToPractice: 'Write down a balanced redox reaction and immediately tag each half-cell with OIL or RIG.'
  },
  {
    id: 'chem-electronegativity',
    subject: 'Chemistry',
    title: 'FONClBrISCH: Electronegativity Hierarchy',
    difficulty: 'Exam Lifesaver',
    mnemonicCode: 'FONCl - Br - I - S - C - H ("Phone Call Brought Ice Cream Hot")',
    explanation: 'Decreasing electronegativity order: Fluorine (4.0) > Oxygen (3.5) > Nitrogen (3.0) ≈ Chlorine (3.0) > Bromine (2.8) > Iodine (2.5) ≈ Sulfur (2.5) ≈ Carbon (2.5) > Hydrogen (2.1).',
    realWorldAnalogy: 'Fluorine is the greedy king who snatches all electrons in the kingdom; Hydrogen is the generous peasant.',
    formulaOrFact: 'F (4.0) > O (3.5) > N/Cl (3.0) > Br (2.8) > I/S/C (2.5) > H (2.1)',
    visualCue: 'A ringing vintage telephone on top of an iceberg with a scoop of hot ice cream.',
    howToPractice: 'Use this whenever deciding bond polarity, dipole moments, or hydrogen bonding criteria (only F, O, N form true H-bonds!).'
  },
  {
    id: 'chem-sn1-sn2',
    subject: 'Chemistry',
    title: 'SN1 vs SN2 Nucleophilic Substitution Mechanism',
    difficulty: 'Deep Framework',
    mnemonicCode: 'SN1 = 1 substrate in RDS (2 steps, Carbocation, Protic solvent) | SN2 = 2 molecules in RDS (1 step, Backside attack, Aprotic solvent)',
    explanation: 'The number represents the molecularity of the rate-determining step! SN1 takes 2 steps because the leaving group must depart FIRST to form a carbocation intermediate (favored in polar protic solvents that stabilize ions). SN2 occurs in 1 concerted step with Walden inversion (like an umbrella blown inside out).',
    realWorldAnalogy: 'SN1 is a divorce followed by a new marriage (2 steps). SN2 is a quick tag-team swap where the newcomer kicks the old partner out the back door in one motion.',
    formulaOrFact: 'Rate(SN1) = k[R-X] (Tertiary > Secondary > Primary) | Rate(SN2) = k[R-X][Nu⁻] (Primary > Secondary > Tertiary)',
    visualCue: 'An umbrella being flipped inside out on a windy rainy day for SN2 backside inversion.',
    howToPractice: 'Draw the transition state of bromomethane attacked by hydroxide ion, showing partial bonds.'
  },

  // --- PHYSICS TRICKS ---
  {
    id: 'phys-flemings-left',
    subject: 'Physics',
    title: "Fleming's Left-Hand Rule for Magnetic Force on Wires",
    difficulty: 'Exam Lifesaver',
    mnemonicCode: 'F.B.I. or Father - Mother - Child (Thumb, Forefinger, Second Finger)',
    explanation: 'Hold your left hand with Thumb, Forefinger, and Middle finger mutually perpendicular. Thumb = Force (Father/F), Forefinger = Magnetic Field (Mother/B), Middle Finger = Current (Child/I).',
    realWorldAnalogy: 'Like an FBI badge: Force, B-field, I-current.',
    formulaOrFact: 'F = I * (L × B) = I * L * B * sin(θ)',
    visualCue: 'An FBI officer pointing their left hand in 3 orthogonal dimensions.',
    howToPractice: 'Point your index finger north (magnetic field) and middle finger east (current). Your thumb naturally points up (motor force).'
  },
  {
    id: 'phys-em-spectrum',
    subject: 'Physics',
    title: 'Electromagnetic Spectrum by Frequency Order',
    difficulty: 'Quick Hack',
    mnemonicCode: 'Raging Martians Invaded Venus Using X-ray Guns',
    explanation: 'Lowest frequency (longest wavelength) to highest frequency: Radio waves → Microwaves → Infrared → Visible Light (ROYGBIV) → Ultraviolet → X-rays → Gamma rays.',
    realWorldAnalogy: 'Radio is harmless music; Gamma is universe-shattering cosmic nuclear radiation.',
    formulaOrFact: 'E = h * f = h * c / λ (Gamma has highest energy and frequency, Radio has longest wavelength)',
    visualCue: 'Martians with Ray guns landing on Venus.',
    howToPractice: 'Say the sentence while drawing a wave getting tighter and tighter from left to right.'
  },
  {
    id: 'phys-sign-convention',
    subject: 'Physics',
    title: 'Cartesian Optics Sign Convention (Mirrors & Lenses)',
    difficulty: 'Deep Framework',
    mnemonicCode: 'Incident light travels Left to Right. Everything against the light is NEGATIVE.',
    explanation: 'Place the pole/optical center at the origin (0,0). Object distance (u) is almost always negative because objects sit on the left. Distances measured in the direction of incident light are positive.',
    realWorldAnalogy: 'Think of standard Cartesian graph (X, Y) where the pole is (0,0). Left is negative X, Right is positive X.',
    formulaOrFact: 'Mirror: 1/f = 1/v + 1/u | Lens: 1/f = 1/v - 1/u',
    visualCue: 'A coordinate axis overlaying a concave mirror with arrows from the left.',
    howToPractice: 'For a concave mirror, focal length f is ALWAYS negative; for a convex mirror, f is ALWAYS positive.'
  },

  // --- MATHEMATICS TRICKS ---
  {
    id: 'math-trig-cast',
    subject: 'Mathematics',
    title: 'The C-A-S-T Rule for Trigonometric Quadrants',
    difficulty: 'Quick Hack',
    mnemonicCode: 'A.S.T.C. ("All Silver Tea Cups" or C.A.S.T. starting from Quadrant IV)',
    explanation: 'Quadrant I (0° to 90°): ALL positive. Quadrant II (90° to 180°): SIN positive. Quadrant III (180° to 270°): TAN positive. Quadrant IV (270° to 360°): COS positive.',
    realWorldAnalogy: 'Imagine drinking from "All Silver Tea Cups" as you rotate counter-clockwise around the unit circle.',
    formulaOrFact: 'Q1: sin, cos, tan > 0 | Q2: sin > 0 | Q3: tan > 0 | Q4: cos > 0',
    visualCue: 'A four-quadrant unit circle with four shiny silver teacups in each quadrant.',
    howToPractice: 'Calculate sin(150°): 150° is in Q2, so sin is POSITIVE. sin(150°) = sin(180° - 30°) = +1/2.'
  },
  {
    id: 'math-soh-cah-toa',
    subject: 'Mathematics',
    title: 'Soh-Cah-Toa & Right Triangle Trigonometry',
    difficulty: 'Quick Hack',
    mnemonicCode: 'S.O.H. - C.A.H. - T.O.A.',
    explanation: 'Sin = Opposite / Hypotenuse. Cos = Adjacent / Hypotenuse. Tan = Opposite / Adjacent.',
    realWorldAnalogy: 'Imagine an ancient chief named Chief SohCahToa climbing a steep triangle.',
    formulaOrFact: 'sin(θ) = O/H | cos(θ) = A/H | tan(θ) = O/A',
    visualCue: 'A right-angled triangle with O, A, and H clearly color-coded.',
    howToPractice: 'Find cos(θ) given opposite = 3, adjacent = 4, hypotenuse = 5. Cos = A/H = 4/5 = 0.8.'
  },
  {
    id: 'math-vedic-multiplication',
    subject: 'Mathematics',
    title: 'Vedic Math: Vertically & Crosswise Multiplication',
    difficulty: 'Deep Framework',
    mnemonicCode: 'Urdhva Tiryagbhyam: |  X  |  (Multiply columns, cross-multiply diagonals and sum)',
    explanation: 'To multiply two 2-digit numbers like 23 × 12: Step 1 (Units): 3×2 = 6. Step 2 (Cross): (2×2) + (3×1) = 4+3 = 7. Step 3 (Tens): 2×1 = 2. Total = 276. Can be computed mentally in 3 seconds!',
    realWorldAnalogy: 'Like tying shoelaces: down, cross diagonally, down.',
    formulaOrFact: '(10a + b)(10c + d) = 100(ac) + 10(ad + bc) + bd',
    visualCue: 'Diagram showing two vertical lines and an X in the center connecting digits.',
    howToPractice: 'Calculate 31 × 22 mentally using step 1 (1×2=2), step 2 (3×2 + 1×2 = 8), step 3 (3×2=6) → 682!'
  },

  // --- BIOLOGY TRICKS ---
  {
    id: 'bio-taxonomy',
    subject: 'Biology',
    title: 'Biological Classification Taxonomic Ranks',
    difficulty: 'Quick Hack',
    mnemonicCode: 'Dear King Philip Came Over For Good Soup',
    explanation: 'Domain → Kingdom → Phylum → Class → Order → Family → Genus → Species.',
    realWorldAnalogy: 'A king visiting a feast: the widest domain narrows down to a specific royal bowl of soup.',
    formulaOrFact: 'Domain > Kingdom > Phylum > Class > Order > Family > Genus > Species (Broadest to most specific)',
    visualCue: 'A medieval king sitting down to eat a steaming bowl of soup.',
    howToPractice: 'Classify Homo sapiens: Eukarya (Domain), Animalia (Kingdom), Chordata (Phylum), Mammalia (Class), Primates (Order), Hominidae (Family), Homo (Genus), sapiens (Species).'
  },
  {
    id: 'bio-mitosis',
    subject: 'Biology',
    title: 'Mitosis Cellular Division Phases',
    difficulty: 'Quick Hack',
    mnemonicCode: 'P.M.A.T. ("Pass Me A Tomato" or "Pray More At Test")',
    explanation: 'Prophase (chromosomes condense) → Metaphase (chromosomes line up in the Middle) → Anaphase (chromosomes pulled Apart) → Telophase (Two nuclei form).',
    realWorldAnalogy: 'M = Middle (Metaphase). A = Apart (Anaphase). T = Two (Telophase).',
    formulaOrFact: 'Interphase (G1-S-G2) → Prophase → Metaphase → Anaphase → Telophase → Cytokinesis',
    visualCue: 'Four microscope slides showing cell division progression.',
    howToPractice: 'Associate the first letter of each stage with its physical chromosome action: M = Middle, A = Apart, T = Two.'
  },

  // --- GENERAL ACCELERATED STUDY FRAMEWORKS ---
  {
    id: 'general-feynman-technique',
    subject: 'General Learning',
    title: 'The Feynman 4-Step Comprehension Engine',
    difficulty: 'Deep Framework',
    mnemonicCode: 'Choose → Teach to a 10-Year-Old → Pinpoint Gaps → Simplify & Analogize',
    explanation: 'Step 1: Pick a topic. Step 2: Explain it out loud or on paper as if teaching a 6th-grade child without jargon. Step 3: Identify where your explanation breaks down or relies on memorized buzzwords. Step 4: Re-read the source to fill that gap and create a clean metaphor.',
    realWorldAnalogy: 'If you cannot build a bridge with simple wooden blocks, you do not understand civil engineering.',
    formulaOrFact: 'Retention Rate: Passive reading ~10% | Teaching others / Feynman ~90%',
    visualCue: 'A chalkboard showing complex differential equations translated into cartoon levers and gears.',
    howToPractice: 'Pick today’s hardest concept and record a 60-second voice note explaining it with zero technical jargon.'
  },
  {
    id: 'general-memory-palace',
    subject: 'General Learning',
    title: 'Method of Loci (The Roman Memory Palace)',
    difficulty: 'Deep Framework',
    mnemonicCode: 'Familiar Route + Vivid Absurd Spatial Anchors',
    explanation: 'Your brain has millions of years of spatial survival navigation hardwired into the hippocampus. Place the items you need to remember at specific furniture landmarks in your childhood bedroom, making each interaction absurd, exaggerated, and sensory.',
    realWorldAnalogy: 'You never forget where your bed, refrigerator, or front door are. Attach facts to those immutable coordinates.',
    formulaOrFact: 'Hippocampal spatial mapping boosts long-term serial recall by 300%.',
    visualCue: 'A blueprint of a house where each room contains giant glowing physics equations.',
    howToPractice: 'Memorize the first 10 elements of the periodic table by placing them in 10 consecutive locations in your room.'
  }
];

export const TRICK_SUBJECTS = [
  'All Subjects',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Biology',
  'General Learning'
];
