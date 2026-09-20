export interface CompetitionQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface CompetitionEvent {
  id: string;
  title: string;
  subject: 'Physics' | 'Mathematics' | 'Chemistry' | 'Biology' | 'All-Rounder Grand Prix';
  status: 'LIVE NOW' | 'STARTING SOON' | 'WEEKEND OLYMPIAD';
  tagline: string;
  description: string;
  bannerGradient: string;
  iconEmoji: string;
  totalParticipants: number;
  durationMinutes: number;
  totalQuestions: number;
  prizePoolXP: number;
  topBadge: string;
  startTimeText: string;
  leaderboardPreview: Array<{ rank: number; name: string; score: number; school: string; timeTakenSec: number }>;
  questions: CompetitionQuestion[];
}

export const COMPETITIONS_DATA: CompetitionEvent[] = [
  {
    id: 'comp-physics-mechanics',
    title: 'National Physics Mechanics Speed Derby',
    subject: 'Physics',
    status: 'LIVE NOW',
    tagline: 'Rotational dynamics, gravitation, and conservation laws under speed pressure.',
    description: 'A rapid-fire 10-minute physics showdown designed by IIT & Olympiad coaches. Test your ability to solve multi-step mechanics questions without calculation slips.',
    bannerGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    iconEmoji: '⚡',
    totalParticipants: 3420,
    durationMinutes: 10,
    totalQuestions: 5,
    prizePoolXP: 2500,
    topBadge: 'Newtonian Champion 2026',
    startTimeText: 'Closes in 4 hours',
    leaderboardPreview: [
      { rank: 1, name: 'Aarav Sharma', score: 500, school: 'Delhi Public School, R.K. Puram', timeTakenSec: 184 },
      { rank: 2, name: 'Priya Venkatesh', score: 480, school: 'National Public School, Indiranagar', timeTakenSec: 210 },
      { rank: 3, name: 'Rohan Gupta', score: 460, school: 'Modern School, Barakhamba', timeTakenSec: 235 },
      { rank: 4, name: 'Siddharth Nair', score: 440, school: 'Bhavan Vidyalaya, Chandigarh', timeTakenSec: 260 },
      { rank: 5, name: 'Ananya Deshmukh', score: 420, school: 'DAV Public School, Pune', timeTakenSec: 280 }
    ],
    questions: [
      {
        id: 'q-phys-1',
        question: 'A solid cylinder of mass M and radius R rolls without slipping down an incline of angle θ. What is the acceleration of its center of mass?',
        options: ['(1/2) g sin θ', '(2/3) g sin θ', '(3/4) g sin θ', 'g sin θ'],
        correctIndex: 1,
        explanation: 'For a solid cylinder rolling without slipping, a = g sin θ / (1 + I_cm / (MR²)). Since I_cm = (1/2)MR², 1 + 1/2 = 3/2, so a = (2/3) g sin θ.',
        points: 100
      },
      {
        id: 'q-phys-2',
        question: 'If the distance between Earth and the Sun is suddenly halved, what would be the length of one year in days?',
        options: ['182.5 days', '129.2 days', '91.25 days', '64.6 days'],
        correctIndex: 1,
        explanation: "By Kepler's Third Law, T² ∝ R³. If R' = R/2, then (T'/T) = (1/2)^(3/2) = 1/(2√2) ≈ 1/2.828. T' = 365.25 / 2.828 ≈ 129.2 days.",
        points: 100
      },
      {
        id: 'q-phys-3',
        question: 'A body of mass m is projected vertically upward with escape velocity v_e. What is its total mechanical energy in the gravitational field at launch?',
        options: ['Zero', '- (1/2) m v_e²', '+ m g R', 'Infinite'],
        correctIndex: 0,
        explanation: 'Escape velocity is precisely defined such that the particle reaches infinity with zero kinetic energy. At infinity, potential energy is also 0, so total mechanical energy E = KE + PE = 0.',
        points: 100
      },
      {
        id: 'q-phys-4',
        question: 'In simple harmonic motion, at what displacement from the mean position are kinetic energy and potential energy exactly equal?',
        options: ['x = A / 2', 'x = A / √2', 'x = A / 3', 'x = A / 4'],
        correctIndex: 1,
        explanation: 'KE = (1/2)k(A² - x²) and PE = (1/2)kx². Setting them equal yields A² - x² = x² → 2x² = A² → x = A / √2.',
        points: 100
      },
      {
        id: 'q-phys-5',
        question: 'Two blocks of masses 2 kg and 4 kg are attached by a light string over a frictionless pulley. What is the tension in the string during motion (g = 10 m/s²)?',
        options: ['20 N', '26.7 N', '30 N', '40 N'],
        correctIndex: 1,
        explanation: 'T = (2 * m1 * m2 * g) / (m1 + m2) = (2 * 2 * 4 * 10) / (2 + 4) = 160 / 6 = 26.67 N.',
        points: 100
      }
    ]
  },
  {
    id: 'comp-math-calculus',
    title: 'Calculus Integration Blitzkrieg (10-Min Speedrun)',
    subject: 'Mathematics',
    status: 'LIVE NOW',
    tagline: 'Definite integrals, substitution, trigonometric shortcuts, and area bounded.',
    description: 'Speed and precision integration competition. Score bonus points for finishing within the first 5 minutes!',
    bannerGradient: 'from-amber-600 via-rose-700 to-purple-900',
    iconEmoji: '📐',
    totalParticipants: 4190,
    durationMinutes: 10,
    totalQuestions: 5,
    prizePoolXP: 3000,
    topBadge: 'Euler Analytical Master',
    startTimeText: 'Closes in 6 hours',
    leaderboardPreview: [
      { rank: 1, name: 'Tanvi Kulkarni', score: 500, school: 'DPS Bangalore South', timeTakenSec: 162 },
      { rank: 2, name: 'Kunal Singhania', score: 500, school: 'St. Xavier Collegiate, Kolkata', timeTakenSec: 198 },
      { rank: 3, name: 'Meera Krishnan', score: 470, school: 'Padma Seshadri Bala Bhavan, Chennai', timeTakenSec: 215 },
      { rank: 4, name: 'Harsh Vardhan', score: 440, school: 'Jaypee Public School, Noida', timeTakenSec: 240 },
      { rank: 5, name: 'Ishita Bansal', score: 420, school: 'Vivekanand Mission, Jaipur', timeTakenSec: 275 }
    ],
    questions: [
      {
        id: 'q-math-1',
        question: 'Evaluate the definite integral: ∫ from -π/2 to π/2 of (sin³(x) + x cos(x) + 1) dx',
        options: ['0', 'π', '2π', '1'],
        correctIndex: 1,
        explanation: 'Notice that sin³(x) and x cos(x) are both ODD functions. The integral of any odd function from -a to +a is identically zero! Only ∫ 1 dx from -π/2 to π/2 remains, which equals π/2 - (-π/2) = π.',
        points: 100
      },
      {
        id: 'q-math-2',
        question: 'What is the value of: lim (x → 0) of [tan(x) - sin(x)] / x³ ?',
        options: ['0', '1/2', '1', '1/6'],
        correctIndex: 1,
        explanation: '[tan(x) - sin(x)] / x³ = sin(x)(1 - cos(x)) / (x³ cos(x)) = (sin(x)/x) * (2 sin²(x/2) / x²) * (1/cos(x)) = 1 * (2/4) * 1 = 1/2.',
        points: 100
      },
      {
        id: 'q-math-3',
        question: 'The area enclosed by the parabola y² = 4ax and its latus rectum x = a is:',
        options: ['(4/3) a²', '(8/3) a²', '(16/3) a²', '4 a²'],
        correctIndex: 1,
        explanation: 'Area = 2 * ∫ from 0 to a of 2√(a) * x^(1/2) dx = 4√(a) * [ (2/3) x^(3/2) ]_0^a = (8/3) a².',
        points: 100
      },
      {
        id: 'q-math-4',
        question: 'If y = e^(x + e^(x + e^(x + ...))), then dy/dx equals:',
        options: ['y / (1 - y)', 'y / (1 + y)', '1 / (1 - y)', 'x y / (1 - y)'],
        correctIndex: 0,
        explanation: 'y = e^(x + y) → ln(y) = x + y. Differentiating both sides with respect to x: (1/y) dy/dx = 1 + dy/dx → dy/dx (1/y - 1) = 1 → dy/dx ((1 - y)/y) = 1 → dy/dx = y / (1 - y).',
        points: 100
      },
      {
        id: 'q-math-5',
        question: 'What is the sum of roots of the equation x² - |x| - 6 = 0?',
        options: ['1', '-1', '0', '5'],
        correctIndex: 2,
        explanation: 'Let u = |x| ≥ 0. Then u² - u - 6 = 0 → (u - 3)(u + 2) = 0. Since u ≥ 0, u = 3. Thus |x| = 3 → x = 3 or x = -3. Sum of roots = 3 + (-3) = 0.',
        points: 100
      }
    ]
  },
  {
    id: 'comp-chem-organic',
    title: 'Organic Chemistry Reaction Mechanism Clash',
    subject: 'Chemistry',
    status: 'STARTING SOON',
    tagline: 'Name reactions, electrophilic aromatic substitution, Aldol, and Cannizzaro pathways.',
    description: 'Test your understanding of organic electron movement, nucleophilic attacks, and reagent selectivity.',
    bannerGradient: 'from-emerald-700 via-teal-800 to-cyan-950',
    iconEmoji: '🧪',
    totalParticipants: 2890,
    durationMinutes: 12,
    totalQuestions: 5,
    prizePoolXP: 2200,
    topBadge: 'Synthesis Grandmaster',
    startTimeText: 'Starts today at 6:00 PM',
    leaderboardPreview: [
      { rank: 1, name: 'Devansh Rathore', score: 490, school: 'Mayo College, Ajmer', timeTakenSec: 210 },
      { rank: 2, name: 'Sanya Mukherjee', score: 470, school: 'South Point High School, Kolkata', timeTakenSec: 240 },
      { rank: 3, name: 'Aditya Verma', score: 450, school: 'St. Paul School, Darjeeling', timeTakenSec: 260 }
    ],
    questions: [
      {
        id: 'q-chem-1',
        question: 'Benzaldehyde treated with concentrated NaOH yields benzyl alcohol and sodium benzoate. This reaction is known as:',
        options: ['Aldol Condensation', 'Cannizzaro Reaction', 'Perkin Reaction', 'Clemmensen Reduction'],
        correctIndex: 1,
        explanation: 'Aldehydes lacking an alpha-hydrogen (like benzaldehyde and formaldehyde) undergo disproportionation in conc. alkali, forming an alcohol and a carboxylate salt. This is the Cannizzaro reaction.',
        points: 100
      },
      {
        id: 'q-chem-2',
        question: 'Which of the following carbocations is most thermodynamically stable due to resonance and hyperconjugation?',
        options: ['Primary ethyl carbocation', 'Secondary isopropyl carbocation', 'Tertiary tert-butyl carbocation', 'Tropylium cation (cycloheptatrienyl)'],
        correctIndex: 3,
        explanation: 'The Tropylium cation has 6 π-electrons in a planar, cyclic, conjugated ring (4n+2 with n=1), making it extraordinarily stable due to aromaticity!',
        points: 100
      },
      {
        id: 'q-chem-3',
        question: 'An unknown alkyl halide undergoes substitution with complete inversion of optical configuration. The mechanism is:',
        options: ['SN1', 'SN2', 'E1', 'E1cB'],
        correctIndex: 1,
        explanation: 'SN2 involves a backside nucleophilic attack with synchronous departure of the leaving group, causing 100% Walden inversion of stereochemical configuration.',
        points: 100
      },
      {
        id: 'q-chem-4',
        question: 'Which reagent cleanly converts a carboxylic acid directly to a primary alcohol?',
        options: ['NaBH₄', 'LiAlH₄', 'H₂ / Ni at room temp', 'PCC'],
        correctIndex: 1,
        explanation: 'LiAlH₄ is a powerful hydride reducing agent capable of reducing carboxylic acids and esters all the way to primary alcohols. NaBH₄ is too mild to reduce acids.',
        points: 100
      },
      {
        id: 'q-chem-5',
        question: 'Phenol upon heating with chloroform and aqueous NaOH followed by acidification gives salicylaldehyde. Name the reaction:',
        options: ['Kolbe Reaction', 'Reimer-Tiemann Reaction', 'Friedel-Crafts Acylation', 'Gattermann-Koch Reaction'],
        correctIndex: 1,
        explanation: 'The Reimer-Tiemann reaction introduces a formyl (-CHO) group ortho to the phenolic hydroxyl group via a dichlorocarbene (:CCl₂) intermediate.',
        points: 100
      }
    ]
  },
  {
    id: 'comp-bio-genetics',
    title: 'Cellular Biology & Genetics Olympiad',
    subject: 'Biology',
    status: 'WEEKEND OLYMPIAD',
    tagline: 'Molecular genetics, lac operon, Mendelian pedigrees, and photosynthetic complexes.',
    description: 'High-yield conceptual challenge mirroring International Biology Olympiad (IBO) and NEET standard.',
    bannerGradient: 'from-purple-700 via-pink-800 to-rose-950',
    iconEmoji: '🧬',
    totalParticipants: 3850,
    durationMinutes: 15,
    totalQuestions: 5,
    prizePoolXP: 2800,
    topBadge: 'Mendelian Laureate',
    startTimeText: 'Starts Saturday 10:00 AM',
    leaderboardPreview: [
      { rank: 1, name: 'Shreya Nambiar', score: 500, school: 'Sanskriti School, New Delhi', timeTakenSec: 230 },
      { rank: 2, name: 'Varun Joshi', score: 480, school: 'The Cathedral & John Connon, Mumbai', timeTakenSec: 255 }
    ],
    questions: [
      {
        id: 'q-bio-1',
        question: 'In the lac operon of E. coli, what happens to the repressor protein when lactose (allolactose) is present in the medium?',
        options: ['It binds tighter to the operator', 'It changes conformation and releases from the operator', 'It degrades the promoter region', 'It directly transcribes beta-galactosidase'],
        correctIndex: 1,
        explanation: 'Allolactose acts as an inducer; it binds to the lac repressor, altering its allosteric conformation so it cannot bind the operator, allowing RNA polymerase to transcribe the z, y, and a genes.',
        points: 100
      },
      {
        id: 'q-bio-2',
        question: 'How many molecules of ATP and NADPH are consumed in the Calvin Cycle for the synthesis of one single glucose molecule (C₆H₁₂O₆)?',
        options: ['12 ATP and 12 NADPH', '18 ATP and 12 NADPH', '18 ATP and 18 NADPH', '36 ATP and 24 NADPH'],
        correctIndex: 1,
        explanation: 'Each turn of the Calvin cycle fixing 1 CO₂ requires 3 ATP and 2 NADPH. To produce 1 hexose (glucose), 6 turns are required: 6 × 3 = 18 ATP and 6 × 2 = 12 NADPH.',
        points: 100
      },
      {
        id: 'q-bio-3',
        question: 'During DNA replication, which enzyme removes RNA primers and fills the gaps with deoxyribonucleotides in prokaryotes?',
        options: ['DNA Polymerase III', 'DNA Polymerase I', 'DNA Ligase', 'DNA Helicase'],
        correctIndex: 1,
        explanation: 'DNA Polymerase I possesses 5\' to 3\' exonuclease activity that excises RNA primers while simultaneously synthesizing DNA to fill the gap.',
        points: 100
      },
      {
        id: 'q-bio-4',
        question: 'A couple both have normal vision, but their maternal grandfathers were red-green colorblind. What is the probability that their first son will be colorblind?',
        options: ['0%', '25%', '50%', '100%'],
        correctIndex: 2,
        explanation: 'The mother is an obligate carrier (X^C X^c) because her father was colorblind. The father has normal vision (X^C Y). For their sons, the son receives Y from the father and has a 50% chance of receiving X^c from the mother.',
        points: 100
      },
      {
        id: 'q-bio-5',
        question: 'Which hormone triggers ovulation by causing the rupture of the mature Graafian follicle in the human ovarian cycle?',
        options: ['Progesterone surge', 'Luteinizing Hormone (LH) surge', 'FSH plateau', 'Oxytocin surge'],
        correctIndex: 1,
        explanation: 'High levels of estrogen exert positive feedback on the pituitary, causing an LH surge around day 14 of a 28-day cycle, which triggers ovulation.',
        points: 100
      }
    ]
  }
];
