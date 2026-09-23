import { AgnesVideo } from '../types/agnesVideo';

export const PRECURATED_AGNES_VIDEOS: AgnesVideo[] = [
  {
    id: 'agnes-quant-superpos',
    topic: 'Quantum Superposition & Wave-Particle Duality',
    subject: 'Physics',
    title: 'Why Particles Exist Everywhere Until Looked At',
    hookSentence: 'An electron does not take one path or the other—it takes every possible path simultaneously until measurement collapses the wave packet.',
    difficulty: 'Competitive (JEE/NEET/GATE)',
    estimatedDuration: '3m 45s',
    totalScenes: 4,
    tags: ['Quantum Mechanics', 'Double Slit', 'Schrödinger', 'Modern Physics'],
    examTip: 'Remember: In the double slit experiment, placing a detector at slit A collapses the interference pattern into two classical bands. Observation destroys phase coherence!',
    commonPitfalls: [
      'Thinking the electron physically splits into two pieces (it remains an indivisible particle; its probability wave interferes).',
      'Confusing quantum superposition with classical statistical uncertainty.'
    ],
    summaryTakeaways: [
      'Before measurement, state |Ψ⟩ = c1|1⟩ + c2|2⟩ with probability P(i) = |ci|².',
      'Constructive & destructive interference occurs between probability amplitudes, not matter particles.',
      'The wave function collapse is irreversible and projects the quantum system into an eigenstate.'
    ],
    scenes: [
      {
        id: 'scene-1',
        sceneNumber: 1,
        title: 'The Double-Slit Mystery: Particles Act as Waves',
        durationSeconds: 45,
        visualType: 'simulation',
        diagramType: 'wave_interference',
        diagramTitle: 'Double Slit Probability Wave Interference',
        keyFormulaOrConcept: '|Ψ⟩ = α|Slit 1⟩ + β|Slit 2⟩',
        chalkboardPoints: [
          'Photons & electrons fired one-by-one still produce an interference pattern on the screen.',
          'Each single particle interferes with its own quantum probability wave.',
          'Classical logic fails: the particle does NOT simply choose Left or Right.'
        ],
        callout: {
          title: 'Agnes Intuition Anchor',
          text: 'Imagine ripples expanding from two stones dropped in a pond. Where crest meets crest, waves amplify. Where crest meets trough, they cancel to zero.',
          type: 'intuition'
        },
        agnesNarration: 'Welcome! I am Dr. Agnes. Today we unravel one of the most counter-intuitive phenomena in all of physics: Quantum Superposition. When you fire electrons one-by-one through two tiny slits, you expect two vertical stripes on the back detector. But what actually appears is an alternating ripple of light and dark bands—an interference pattern! How can a single particle interfere with anything? The mind-bending answer: it interferes with itself.'
      },
      {
        id: 'scene-2',
        sceneNumber: 2,
        title: 'The Math of Superposition: Linear Combinations',
        durationSeconds: 55,
        visualType: 'formula',
        diagramType: 'wave_interference',
        diagramTitle: 'State Vector in Hilbert Space',
        keyFormulaOrConcept: 'Ψ(x,t) = ∑ cₙ φₙ(x) e^(-iEₙt/ħ)  where  ∑|cₙ|² = 1',
        chalkboardPoints: [
          'State vector |Ψ⟩ lives in complex Hilbert space.',
          'Coefficients cₙ are probability amplitudes: Probability P = |cₙ|².',
          'Phase difference Δθ dictates whether interference is constructive or destructive.'
        ],
        callout: {
          title: 'Crucial Formula Note',
          text: 'Never square the probabilities! You must add the complex amplitudes first: |Ψ_total|² = |Ψ₁ + Ψ₂|² = |Ψ₁|² + |Ψ₂|² + 2 Re(Ψ₁* Ψ₂). The cross term creates the fringes!',
          type: 'formula'
        },
        agnesNarration: 'Let us look at the mathematics behind this. In quantum mechanics, a system is not in a single definite state. Instead, the state vector Psi is a linear superposition of all possible eigenstates. The coefficients are complex numbers called probability amplitudes. Notice that cross-term on the board: that 2 times real part of Psi 1 conjugate times Psi 2 is where the quantum magic lives—it is the interference term that can make total probability drop to absolute zero at dark fringes!'
      },
      {
        id: 'scene-3',
        sceneNumber: 3,
        title: 'The Observer Effect: Why Measurement Collapses State',
        durationSeconds: 60,
        visualType: 'breakdown',
        diagramType: 'generic_flow',
        diagramTitle: 'Decoherence & Wavefunction Collapse',
        keyFormulaOrConcept: '|Ψ⟩  →[Measurement]→  |State k⟩ with P = |c_k|²',
        chalkboardPoints: [
          'Entanglement with the measurement device causes quantum decoherence.',
          'Which-way detector destroys the phase relation between the two paths.',
          'Interference fringes immediately vanish, leaving classical bell curves.'
        ],
        callout: {
          title: 'Exam Trap Alert',
          text: 'Human consciousness is NOT required! Any physical interaction that leaks path information into the environment collapses the superposition.',
          type: 'warning'
        },
        quizCheckpoint: {
          question: 'What happens if we place a laser detector at Slit 1 to record which slit the electron passed through?',
          options: [
            'The interference pattern gets sharper and brighter',
            'The interference pattern completely disappears into two classical stripes',
            'The electron reflects backward back into the emitter',
            'The wavelength of the electron halves'
          ],
          correctIndex: 1,
          explanation: 'Measuring path information destroys phase coherence between the two path amplitudes, collapsing the superposition and yielding two classical non-interfering bands.'
        },
        agnesNarration: 'Now comes the great paradox: what happens if you place a sensor at slit 1 to catch the electron in the act? The moment you extract which-way information, the interference pattern completely disappears! The quantum wave collapses into a classical certainty. This is known as wave function collapse. The act of measuring entangles the electron with the macro world, washing away the phase difference.'
      },
      {
        id: 'scene-4',
        sceneNumber: 4,
        title: 'Real-World Frontier: Quantum Computing & Qubits',
        durationSeconds: 50,
        visualType: 'analogy',
        diagramType: 'generic_flow',
        diagramTitle: 'Bloch Sphere & Qubit Superposition',
        keyFormulaOrConcept: '|q⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩',
        chalkboardPoints: [
          'A classical bit is 0 OR 1; a Qubit is any point on the Bloch sphere surface.',
          'N qubits simultaneously represent 2^N states (massive parallelism).',
          'Shor\'s & Grover\'s algorithms exploit constructive interference to amplify correct answers.'
        ],
        callout: {
          title: 'Agnes Takeaway Tip',
          text: 'Superposition gives quantum computers their exponential state space. Interference is what lets them cancel wrong paths and keep the right answer.',
          type: 'tip'
        },
        agnesNarration: 'Today, superposition is no longer just philosophy—it is the engine behind quantum computing. A classical bit is strictly a 0 or a 1. But a quantum qubit can inhabit a superposition of both simultaneously. With just 300 entangled qubits, you have more simultaneous states than atoms in the observable universe. Master this concept, and you master the gateway to modern physics!'
      }
    ]
  },
  {
    id: 'agnes-chem-sn1-sn2',
    topic: 'Reaction Mechanisms: SN1 vs SN2 Substitution',
    subject: 'Chemistry',
    title: 'Unlocking Nucleophilic Substitution: Stereochemistry & Kinetics',
    hookSentence: 'Is it a backside attack with Walden inversion in one swift step, or a two-step ionization creating a racemic carbocation intermediate?',
    difficulty: 'High School (CBSE/AP/IB)',
    estimatedDuration: '4m 10s',
    totalScenes: 4,
    tags: ['Organic Chemistry', 'SN1', 'SN2', 'Kinetics', 'Stereochemistry'],
    examTip: 'Polar protic solvents (H2O, EtOH) favor SN1 by stabilizing carbocations; polar aprotic solvents (DMSO, Acetone) favor SN2 by unshielding the nucleophile.',
    commonPitfalls: [
      'Assuming tertiary halides can undergo SN2 (steric hindrance makes backside attack physically impossible).',
      'Forgetting that SN1 produces a racemic mixture (both retention and inversion) due to planar sp² carbocation attack from both faces.'
    ],
    summaryTakeaways: [
      'SN2: Bimolecular, Rate = k[R-X][Nu⁻], 1 step, 100% Walden inversion, favors 1° > 2° > 3°.',
      'SN1: Unimolecular, Rate = k[R-X], 2 steps via carbocation intermediate, racemization, favors 3° > 2° > 1°.',
      'Strong nucleophile + polar aprotic = SN2; Weak nucleophile + polar protic = SN1.'
    ],
    scenes: [
      {
        id: 'chem-scene-1',
        sceneNumber: 1,
        title: 'The Battle: SN1 (Two Steps) vs SN2 (One Concerted Step)',
        durationSeconds: 50,
        visualType: 'comparison',
        diagramType: 'chemical_mechanism',
        diagramTitle: 'Comparison of Reaction Energy Profiles',
        keyFormulaOrConcept: 'SN2: Rate = k[R-X][Nu⁻]  vs  SN1: Rate = k[R-X]',
        chalkboardPoints: [
          'SN2 stands for Substitution Nucleophilic Bimolecular (two molecules in transition state).',
          'SN1 stands for Substitution Nucleophilic Unimolecular (leaving group leaves first).',
          'Kinetics test: Doubling [Nu⁻] doubles SN2 rate, but does NOTHING to SN1 rate!'
        ],
        callout: {
          title: 'Agnes Memory Hook',
          text: 'SN2 has 1 step with 2 molecules. SN1 has 2 steps with 1 molecule in the rate-determining step. The numbers are inverse of the steps!',
          type: 'intuition'
        },
        agnesNarration: 'Welcome to Dr. Agnes\'s Organic Chemistry breakdown! Nucleophilic substitution is notoriously tested on exams, but the rules are deeply logical. Think of SN2 as an aggressive ambush: the nucleophile attacks from the backside while the leaving group is pushed out in one smooth, concerted step. In contrast, SN1 is a patient waiting game: the leaving group leaves on its own first, forming an unstable carbocation before the nucleophile even steps in.'
      },
      {
        id: 'chem-scene-2',
        sceneNumber: 2,
        title: 'Steric Hindrance & Substrate Hierarchy',
        durationSeconds: 60,
        visualType: 'diagram',
        diagramType: 'chemical_mechanism',
        diagramTitle: 'Steric Crowding at Alpha Carbon',
        keyFormulaOrConcept: 'SN2 Reactivity: Methyl > 1° > 2° >> 3° (No SN2)\nSN1 Reactivity: 3° > 2° >> 1° (No SN1)',
        chalkboardPoints: [
          'In SN2, bulky alkyl groups block the backside trajectory (steric shield).',
          'In SN1, 3° carbocation is stabilized by hyperconjugation and +I inductive effect of 3 alkyl groups.',
          '2° substrates are swing voters: reaction pathway depends on solvent and nucleophile strength!'
        ],
        callout: {
          title: 'Crucial Exam Warning',
          text: 'Never draw an SN2 transition state on a tertiary carbon! The transition state energy is too high due to steric clash.',
          type: 'warning'
        },
        agnesNarration: 'Look at the board at the alpha carbon. In SN2, the nucleophile must hit the carbon exactly 180 degrees opposite the leaving group. If that carbon is surrounded by three bulky methyl groups, there is literally zero physical clearance. That is why tertiary halides NEVER undergo SN2! But in SN1, those three alkyl groups donate electron density to stabilize the positive carbocation, making tertiary substrates the champions of SN1.'
      },
      {
        id: 'chem-scene-3',
        sceneNumber: 3,
        title: 'Stereochemistry: Walden Inversion vs Racemization',
        durationSeconds: 65,
        visualType: 'simulation',
        diagramType: 'chemical_mechanism',
        diagramTitle: 'Planar Carbocation vs Umbrella Inversion',
        keyFormulaOrConcept: 'SN2: 100% Inversion (R → S)  |  SN1: ~50% Retention + ~50% Inversion (Racemic)',
        chalkboardPoints: [
          'SN2 acts like an umbrella blown inside-out in a high wind (Walden Inversion).',
          'SN1 intermediate carbocation is flat sp² planar with empty p-orbital.',
          'Nucleophile can attack top face or bottom face with near-equal probability.'
        ],
        callout: {
          title: 'Agnes Exam Trap',
          text: 'If the starting material is optically active (chiral) and undergoes SN1, the product will be an optically inactive racemic mixture!',
          type: 'tip'
        },
        quizCheckpoint: {
          question: 'What is the stereochemical outcome when (R)-2-bromobutane reacts with NaCN in pure DMSO (polar aprotic)?',
          options: [
            'Racemic mixture (50% R and 50% S)',
            'Pure (S)-2-methylbutanenitrile with 100% Walden inversion',
            'No reaction because 2° halides are inert',
            'Retention of configuration yielding 100% (R) enantiomer'
          ],
          correctIndex: 1,
          explanation: 'CN⁻ is a strong nucleophile and DMSO is polar aprotic, which forces an SN2 mechanism. SN2 proceeds with complete Walden inversion, converting the (R) configuration to (S).'
        },
        agnesNarration: 'Stereochemistry is where top scores are won or lost. In SN2, because the nucleophile attacks strictly from behind, the tetrahedral geometry flips inside-out like an umbrella in a gale—a complete Walden inversion. But in SN1, the moment the halide pops off, the carbon flattens into a trigonal planar sp2 carbocation. The nucleophile has a 50-50 shot of attacking from above or below, resulting in a racemic, optically inactive mixture.'
      },
      {
        id: 'chem-scene-4',
        sceneNumber: 4,
        title: 'Solvent & Nucleophile Decision Matrix',
        durationSeconds: 55,
        visualType: 'formula',
        diagramType: 'generic_flow',
        diagramTitle: 'Master 4-Quadrant Decision Flowchart',
        keyFormulaOrConcept: 'Polar Aprotic (Acetone, DMSO, DMF) → SN2\nPolar Protic (H₂O, MeOH, EtOH) → SN1',
        chalkboardPoints: [
          'Protic solvents hydrogen-bond to nucleophiles, trapping them in a solvent cage.',
          'Aprotic solvents solvate the cation (e.g. Na⁺) and leave the anion (Nu⁻) naked and aggressive!',
          'Strong nucleophiles (I⁻, RS⁻, CN⁻, OH⁻) favor SN2; weak nucleophiles (H₂O, ROH) favor SN1.'
        ],
        callout: {
          title: 'Golden Rule',
          text: 'Naked nucleophiles in aprotic solvents attack fast (SN2). Solvated weak nucleophiles in protic solvents wait for carbocation (SN1).',
          type: 'intuition'
        },
        agnesNarration: 'To wrap up, memorize this golden solvent rule. Protic solvents like water and alcohol wrap around anions with strong hydrogen bonds, putting the nucleophile in a cage. But polar aprotic solvents like acetone or DMSO only solvate cations, leaving the nucleophile completely unshielded and reactive for SN2 backside attack. Keep this mental matrix in mind, and you will never miss an exam question on substitution!'
      }
    ]
  },
  {
    id: 'agnes-phys-relativity',
    topic: 'Einstein\'s Special Relativity: Time Dilation & Lorentz Boost',
    subject: 'Physics',
    title: 'Why Moving Clocks Tick Slower: The Light Clock Proof',
    hookSentence: 'Because the speed of light must remain constant for every observer, space and time themselves must bend to protect that universal constant.',
    difficulty: 'Undergraduate',
    estimatedDuration: '4m 30s',
    totalScenes: 4,
    tags: ['Relativity', 'Time Dilation', 'Lorentz Factor', 'Modern Physics', 'Einstein'],
    examTip: 'Proper time Δt₀ is always measured by the clock at rest relative to the events! The dilated time Δt measured by an external moving observer is ALWAYS longer.',
    commonPitfalls: [
      'Thinking time dilation is an optical illusion or clock malfunction (it is an objective property of the fabric of spacetime; biological cells literally age slower).',
      'Confusing which observer measures proper time.'
    ],
    summaryTakeaways: [
      'Postulate 1: Laws of physics are identical in all inertial frames.',
      'Postulate 2: The speed of light c in vacuum is constant regardless of source motion.',
      'Lorentz factor γ = 1 / √(1 - v²/c²); as v → c, γ → ∞ and time stands still.'
    ],
    scenes: [
      {
        id: 'rel-scene-1',
        sceneNumber: 1,
        title: 'The Great Conflict: Maxwell vs Newton',
        durationSeconds: 50,
        visualType: 'analogy',
        diagramType: 'relativity_grid',
        diagramTitle: 'Speed of Light Invariance Across Frames',
        keyFormulaOrConcept: 'c = 299,792,458 m/s  (Invariable in all inertial frames)',
        chalkboardPoints: [
          'In Newtonian mechanics, velocities add: v_total = v_train + v_ball.',
          'Maxwell\'s equations show electromagnetic waves propagate at fixed speed c.',
          'Einstein\'s bold conclusion: if light speed cannot change, time and distance must give way!'
        ],
        callout: {
          title: 'Agnes Thought Experiment',
          text: 'If you run forward with a flashlight at 90% of the speed of light, does the beam travel at 1.9c? No! It still travels at exactly 1.0c relative to you AND relative to a bystander.',
          type: 'intuition'
        },
        agnesNarration: 'Dr. Agnes here with one of the greatest triumphs of human thought: Special Relativity. In everyday life, if you throw a baseball at 20 meters per second on a train moving at 30, a bystander sees 50. But if you shine a flashlight on that train, both you and the bystander measure light traveling at exactly c! How can two observers traveling at different speeds measure the exact same speed for the same photon? The only mathematical resolution: time itself must tick at different rates for each of you.'
      },
      {
        id: 'rel-scene-2',
        sceneNumber: 2,
        title: 'The Light Clock Derivation (Pythagoras in Spacetime)',
        durationSeconds: 65,
        visualType: 'formula',
        diagramType: 'relativity_grid',
        diagramTitle: 'Hypotenuse Light Path for Moving Observer',
        keyFormulaOrConcept: 'Δt = γ Δt₀   where   γ = 1 / √(1 - v²/c²)',
        chalkboardPoints: [
          'Inside rocket: Light bounces straight up and down between mirrors: distance = 2L.',
          'From Earth: Rocket moves forward; light must travel a diagonal zigzag path: D > 2L.',
          'Since speed of light c is constant and path D is longer, time taken Δt MUST be greater!'
        ],
        callout: {
          title: 'Pythagorean Proof',
          text: '(c Δt/2)² = (v Δt/2)² + L²   →   Δt²(c² - v²) = 4L² = c² Δt₀²   →   Δt = Δt₀ / √(1 - v²/c²)',
          type: 'formula'
        },
        agnesNarration: 'Let us build Einstein\'s famous light clock on our chalkboard. Inside a spaceship, a light pulse bounces between two mirrors separated by height L. For the astronaut inside, the time taken is simply 2L divided by c. That is proper time delta t zero. But watch what happens from Earth: as the ship flies past at velocity v, the light pulse must travel along the hypotenuse of a right triangle to catch the mirror! The path is longer. Because the speed of light cannot speed up, the duration must stretch. Using simple Pythagorean theorem, we derive the celebrated Lorentz factor gamma!'
      },
      {
        id: 'rel-scene-3',
        sceneNumber: 3,
        title: 'Experimental Proofs: Muon Lifetimes & GPS Satellites',
        durationSeconds: 55,
        visualType: 'breakdown',
        diagramType: 'relativity_grid',
        diagramTitle: 'Atmospheric Muon Survival to Sea Level',
        keyFormulaOrConcept: 'At v = 0.995c, γ ≈ 10   →   Muon lifetime extends from 2.2 μs to 22 μs',
        chalkboardPoints: [
          'Muons created in upper atmosphere (15 km up) have rest lifetime of only 2.2 microseconds.',
          'Even at speed of light, classical physics says they can only travel 660 meters before decaying.',
          'Yet detectors at sea level detect thousands of them every second! Time dilation proven.'
        ],
        callout: {
          title: 'Real World Impact',
          text: 'GPS satellites orbit at 14,000 km/h. Their atomic clocks lose 7 microseconds daily due to special relativity time dilation. Without correction, GPS would drift by 11 kilometers every single day!',
          type: 'tip'
        },
        quizCheckpoint: {
          question: 'If an astronaut travels in a spacecraft at 0.8c for 6 years according to her on-board clock (Δt₀ = 6), how much time elapses on Earth?',
          options: [
            '4.8 years',
            '6.0 years',
            '10.0 years',
            '12.5 years'
          ],
          correctIndex: 2,
          explanation: 'Lorentz factor γ = 1 / √(1 - 0.8²) = 1 / √(1 - 0.64) = 1 / 0.6 = 5/3 ≈ 1.667. Dilated time on Earth Δt = γ · Δt₀ = (5/3) · 6 = 10 years.'
        },
        agnesNarration: 'Is this real, or just theoretical mathematics? It is verified every millisecond around the globe. Cosmic rays slamming into the upper atmosphere generate subatomic particles called muons. Their half-life is so tiny that even traveling at 99.5 percent the speed of light, classical mechanics insists they should decay before traveling 700 meters. Yet thousands strike our ground detectors every second! From Earth\'s perspective, their internal clock ticks 10 times slower, allowing them to cross the entire atmosphere.'
      },
      {
        id: 'rel-scene-4',
        sceneNumber: 4,
        title: 'Spacetime Invariant: The Universal Speed Limit',
        durationSeconds: 50,
        visualType: 'simulation',
        diagramType: 'relativity_grid',
        diagramTitle: 'Minkowski Spacetime Cone & Invariant Interval',
        keyFormulaOrConcept: 'Δs² = c²Δt² - Δx² - Δy² - Δz²  (Spacetime Interval is Constant)',
        chalkboardPoints: [
          'Space and time are not separate arenas: they form 4-dimensional Minkowski spacetime.',
          'Everything in the cosmos is constantly moving through spacetime at the exact speed c.',
          'If you sit still in space, all your motion is through time. Move faster through space, and your motion through time slows!'
        ],
        callout: {
          title: 'The Ultimate Intuition',
          text: 'You cannot move faster through time than c. When you divert part of your cosmic velocity into spatial motion, your temporal velocity decreases to compensate.',
          type: 'intuition'
        },
        agnesNarration: 'Here is the ultimate takeaway to anchor in your intuition: you are always moving through 4-dimensional spacetime at the speed of light. When you are sitting motionless at your desk, 100 percent of your speed is directed through the time axis. But as you accelerate through space, you divert part of your cosmic speed into physical distance, and your clock ticks slower as a consequence. That is the poetry of Einstein\'s spacetime.'
      }
    ]
  },
  {
    id: 'agnes-bio-crispr',
    topic: 'CRISPR-Cas9 Gene Editing Mechanism',
    subject: 'Biology',
    title: 'Molecular Scissors: How Bacteria Defend Against Viruses',
    hookSentence: 'Bacteria invented an adaptive immune memory millions of years before humans discovered how to reprogram it to edit the genetic code of life.',
    difficulty: 'High School (CBSE/AP/IB)',
    estimatedDuration: '3m 50s',
    totalScenes: 4,
    tags: ['Genetics', 'CRISPR', 'Molecular Biology', 'Biotechnology', 'DNA'],
    examTip: 'Cas9 CANNOT cleave DNA without the PAM sequence (NGG in SpCas9), even if the guide RNA is 100% complementary! PAM acts as the safety check.',
    commonPitfalls: [
      'Assuming Cas9 itself recognizes the target DNA (it is the programmable 20-nucleotide guide RNA spacer that binds target DNA).',
      'Confusing Non-Homologous End Joining (NHEJ - error prone gene knockout) with Homology-Directed Repair (HDR - precise gene insertion).'
    ],
    summaryTakeaways: [
      'CRISPR array stores viral DNA spacers separated by palindromic repeats.',
      'Cas9 endonuclease complexes with single-guide RNA (sgRNA = crRNA + tracrRNA).',
      'Recognition requires both PAM (5\'-NGG-3\') inspection and 20bp RNA-DNA Watson-Crick pairing.',
      'Double-strand break (DSB) triggers cellular repair: NHEJ (knockout) or HDR (knock-in).'
    ],
    scenes: [
      {
        id: 'crispr-scene-1',
        sceneNumber: 1,
        title: 'Bacterial Immune Memory: The Genomic Mugshot',
        durationSeconds: 50,
        visualType: 'diagram',
        diagramType: 'dna_crispr',
        diagramTitle: 'CRISPR Genomic Locus in Bacterial Host',
        keyFormulaOrConcept: 'CRISPR = Clustered Regularly Interspaced Short Palindromic Repeats',
        chalkboardPoints: [
          'Bacteriophages inject viral DNA into bacterial cells to hijack them.',
          'Cas1-Cas2 proteins snip a piece of viral DNA and paste it into the CRISPR locus.',
          'Spacers serve as historical immunological memory cards of past viral infections.'
        ],
        callout: {
          title: 'Agnes Analogy',
          text: 'Think of the CRISPR locus as a microbial criminal database. Each spacer is a mugshot of a virus that tried to destroy the bacterium\'s ancestors.',
          type: 'intuition'
        },
        agnesNarration: 'Welcome students! Today we dissect CRISPR-Cas9, the revolutionary gene-editing technology that won the 2020 Nobel Prize in Chemistry. But before humans ever touched it, bacteria were using it for millions of years as an adaptive immune system. When a bacteriophage virus attacks a bacterium, specialized Cas enzymes capture a 20-basepair snippet of viral DNA and slot it into a genomic filing cabinet called the CRISPR array.'
      },
      {
        id: 'crispr-scene-2',
        sceneNumber: 2,
        title: 'The Guided Weapon: Cas9 Endonuclease & Guide RNA',
        durationSeconds: 60,
        visualType: 'simulation',
        diagramType: 'dna_crispr',
        diagramTitle: 'Cas9 Binary Complex Scanning Double-Stranded DNA',
        keyFormulaOrConcept: 'Effector Complex = Cas9 Protein + sgRNA (crRNA spacer + tracrRNA scaffold)',
        chalkboardPoints: [
          'crRNA contains the 20-nt guide sequence complementary to viral target.',
          'tracrRNA acts as the structural handle that binds tightly inside Cas9 pocket.',
          'Engineered single-guide RNA (sgRNA) fuses both into one programmable strand.'
        ],
        callout: {
          title: 'Why It Revolutionized Science',
          text: 'Older tools like TALENs and Zinc Fingers required engineering an entire new protein for every target. CRISPR only requires synthesizing 20 cheap RNA letters!',
          type: 'tip'
        },
        agnesNarration: 'When that same virus strikes again, the bacterium transcribes those stored spacers into short guide RNA molecules. This guide RNA docks right inside the Cas9 endonuclease enzyme like a bullet in a chamber. Jennifer Doudna and Emmanuelle Charpentier realized you could fuse this into a single programmable guide RNA. Now, if you want to target any gene in any organism on Earth, you only need to change 20 letters of RNA.'
      },
      {
        id: 'crispr-scene-3',
        sceneNumber: 3,
        title: 'The Safety Lock: PAM Recognition & Double-Strand Cleavage',
        durationSeconds: 65,
        visualType: 'diagram',
        diagramType: 'dna_crispr',
        diagramTitle: 'PAM Interrogation & RuvC / HNH Cleavage',
        keyFormulaOrConcept: 'PAM Sequence: 5\'-NGG-3\'  (Protospacer Adjacent Motif)',
        chalkboardPoints: [
          'Cas9 will NOT unwind DNA unless it first finds the 3-base PAM sequence: 5\'-NGG-3\'.',
          'PAM prevents bacteria from accidentally chopping up their own CRISPR genomic locus!',
          'Two catalytic domains: HNH cuts complementary strand, RuvC cuts non-complementary strand.'
        ],
        callout: {
          title: 'High-Yield Exam Trap',
          text: 'Why doesn\'t Cas9 destroy the bacterium\'s own spacer DNA? Because the bacterial CRISPR array lacks the PAM sequence! The PAM is only present on foreign viral invaders.',
          type: 'warning'
        },
        quizCheckpoint: {
          question: 'What is the biological function of the PAM (Protospacer Adjacent Motif) sequence in the CRISPR-Cas9 system?',
          options: [
            'It provides ATP energy for DNA unwinding',
            'It prevents Cas9 from cutting the host bacterium\'s own spacer DNA memory',
            'It converts RNA into DNA during reverse transcription',
            'It signals the ribosome to translate more Cas9 proteins'
          ],
          correctIndex: 1,
          explanation: 'The PAM sequence is present on foreign target DNA but absent from the host CRISPR locus, ensuring Cas9 never auto-cleaves the bacterium\'s own genome.'
        },
        agnesNarration: 'Now notice this critical safety mechanism on our diagram: the PAM sequence. Cas9 does not unzip DNA randomly. It first scans along DNA searching specifically for a short three-letter motif: N-G-G. Only when it docks on a PAM will it melt the double helix and test if the guide RNA matches. Why? Because the bacterium\'s own CRISPR memory array has the target sequence, but lacks the PAM! It is nature\'s ingenious fail-safe to prevent self-destruction.'
      },
      {
        id: 'crispr-scene-4',
        sceneNumber: 4,
        title: 'Repair Pathways: Gene Knockout vs Precise Knock-in',
        durationSeconds: 55,
        visualType: 'breakdown',
        diagramType: 'generic_flow',
        diagramTitle: 'NHEJ vs HDR DNA Repair Outcomes',
        keyFormulaOrConcept: 'NHEJ (Indel → Frameshift → Knockout) vs HDR (Donor Template → Knock-in)',
        chalkboardPoints: [
          'Cas9 does not actually edit DNA; it merely cuts a blunt double-strand break.',
          'NHEJ (Non-Homologous End Joining): cell rapidly glues ends together, often inserting/deleting bases (silencing the gene).',
          'HDR (Homology-Directed Repair): provide cell with a designer DNA template to rewrite mutations.'
        ],
        callout: {
          title: 'Clinical Milestone',
          text: 'Casgevy (approved in 2023) uses CRISPR to cure Sickle Cell Disease by reactivating fetal hemoglobin. Biology converted into medicine!',
          type: 'tip'
        },
        agnesNarration: 'A common misconception is that Cas9 edits DNA. Cas9 does not edit anything—it is simply a pair of molecular scissors that makes a clean double-strand cut 3 basepairs upstream of the PAM. The host cell\'s own repair machinery does the actual work! If the cell glues it back messily through Non-Homologous End Joining, it introduces a frameshift mutation that disables a faulty gene. If you provide a custom DNA template, the cell uses Homology-Directed Repair to copy your correct sequence right into the genome.'
      }
    ]
  },
  {
    id: 'agnes-math-fourier',
    topic: 'Fourier Transform & Frequency Domain',
    subject: 'Mathematics',
    title: 'Deconstructing Any Signal Into Pure Sine Waves',
    hookSentence: 'Just as a glass prism splits messy white sunlight into pure rainbow colors, the Fourier Transform splits any complicated signal into pure frequencies.',
    difficulty: 'Undergraduate',
    estimatedDuration: '4m 15s',
    totalScenes: 4,
    tags: ['Calculus', 'Fourier Analysis', 'Signals', 'Complex Numbers', 'Differential Equations'],
    examTip: 'Euler\'s formula e^(iθ) = cos(θ) + i sin(θ) converts the rotation around the complex unit circle into sine and cosine frequency detectors!',
    commonPitfalls: [
      'Thinking Fourier transform creates new information (it is an exact orthogonal basis transformation; total energy is conserved by Parseval\'s theorem).',
      'Confusing the time domain with frequency domain.'
    ],
    summaryTakeaways: [
      'Fourier Transform wraps a time signal f(t) around the complex circle at frequency ω.',
      'When wrapping frequency matches a natural frequency of the signal, the center of mass spikes away from origin.',
      'Forward: F(ω) = ∫ f(t) e^(-iωt) dt; Inverse: f(t) = (1/2π) ∫ F(ω) e^(iωt) dω.'
    ],
    scenes: [
      {
        id: 'fourier-scene-1',
        sceneNumber: 1,
        title: 'The Musical Chord Analogy: Unbaking the Cake',
        durationSeconds: 50,
        visualType: 'analogy',
        diagramType: 'fourier_transform',
        diagramTitle: 'Time Domain Soundwave vs Frequency Domain Peaks',
        keyFormulaOrConcept: 'f(t) = sin(2π · 440t) + 0.5 sin(2π · 880t)',
        chalkboardPoints: [
          'When an orchestra plays a chord, the microphone measures one jagged pressure wave in time.',
          'Your ear\'s cochlea mechanically separates individual frequencies (pitches).',
          'The Fourier Transform is the exact mathematical equivalent of an ear: it extracts the secret ingredients of a sound.'
        ],
        callout: {
          title: 'Agnes Visual Metaphor',
          text: 'If a musical chord is a finished cake, the Fourier Transform is a machine that hands you back the exact cups of flour, sugar, and cocoa that made it!',
          type: 'intuition'
        },
        agnesNarration: 'Hello everyone! I am Dr. Agnes, and today we tackle one of the most powerful mathematical concepts in modern civilization: the Fourier Transform. If an orchestra plays a complex chord, a microphone records only a single jagged, chaotic pressure wave over time. How does your brain instantly identify the trumpet, the violin, and the cello? Your ear computes a physical Fourier transform, breaking the messy composite wave into its pure constituent sine frequencies.'
      },
      {
        id: 'fourier-scene-2',
        sceneNumber: 2,
        title: 'The Winding Machine: Euler\'s Formula in Action',
        durationSeconds: 65,
        visualType: 'formula',
        diagramType: 'fourier_transform',
        diagramTitle: 'Wrapping the Signal Around the Complex Plane',
        keyFormulaOrConcept: 'F(ω) = ∫_{-∞}^{∞} f(t) · e^{-iωt} dt',
        chalkboardPoints: [
          'e^(-iωt) represents a unit clock hand rotating clockwise at frequency ω in the complex plane.',
          'Multiplying f(t) by e^(-iωt) wraps the signal around the origin like yarn around a spool.',
          'The integral computes the center of mass of the wound graph!'
        ],
        callout: {
          title: 'The Magic of Euler',
          text: 'e^(-iωt) = cos(ωt) - i sin(ωt). The real part extracts cosine correlations, and the imaginary part extracts sine correlations!',
          type: 'formula'
        },
        agnesNarration: 'Look at the integral on our chalkboard. It looks intimidating, but it is actually an ingenious winding machine. Term e to the negative i omega t is a rotating vector spinning around the complex plane at frequency omega. When you multiply your signal f of t by this spinning vector, you are literally wrapping the signal around the origin. If you wrap at random frequencies, the points balance evenly around the center, and the integral evaluates to near zero. But when your winding frequency matches a frequency hidden in the signal, all the peaks line up on one side, and the center of mass spikes dramatically!'
      },
      {
        id: 'fourier-scene-3',
        sceneNumber: 3,
        title: 'Duality & The Uncertainty Principle',
        durationSeconds: 55,
        visualType: 'diagram',
        diagramType: 'fourier_transform',
        diagramTitle: 'Time-Bandwidth Product & Heisenberg Relation',
        keyFormulaOrConcept: 'Δt · Δω ≥ 1/2   (Time-Bandwidth Duality)',
        chalkboardPoints: [
          'A sharp, brief impulse in time (Dirac delta) spreads out infinitely across all frequencies.',
          'A pure, eternal sine wave in time collapses into a single pin-sharp delta spike in frequency.',
          'You cannot have infinite precision in both time and frequency simultaneously.'
        ],
        callout: {
          title: 'Quantum Connection',
          text: 'Heisenberg\'s Uncertainty Principle (Δx · Δp ≥ ħ/2) is NOT quantum magic! It is simply the mathematical Fourier duality between position and momentum wavefunctions.',
          type: 'tip'
        },
        quizCheckpoint: {
          question: 'What is the Fourier transform of a pure cosine wave cos(ω₀t) that continues infinitely in time?',
          options: [
            'A flat horizontal line across all frequencies',
            'Two sharp delta spikes located at +ω₀ and -ω₀',
            'A decaying exponential curve',
            'Zero everywhere'
          ],
          correctIndex: 1,
          explanation: 'Using Euler\'s formula, cos(ω₀t) = 0.5(e^(iω₀t) + e^(-iω₀t)). Its Fourier transform consists of two discrete delta functions at positive and negative frequency ω₀.'
        },
        agnesNarration: 'This reveals a profound duality in mathematics. If you want a note with an exact, razor-sharp pitch, it must vibrate for a long duration. If you make the sound shorter and shorter like a sudden clap, it no longer has a definite pitch—it splatters across the entire frequency spectrum! In fact, Werner Heisenberg\'s quantum uncertainty principle is nothing more than this exact Fourier duality applied to particle wavefunctions.'
      },
      {
        id: 'fourier-scene-4',
        sceneNumber: 4,
        title: 'Everywhere Around You: MP3, JPEG, MRI & Wi-Fi',
        durationSeconds: 50,
        visualType: 'simulation',
        diagramType: 'generic_flow',
        diagramTitle: 'Fast Fourier Transform (FFT) in Modern Technology',
        keyFormulaOrConcept: 'FFT: Reduces O(N²) calculation to O(N log N)',
        chalkboardPoints: [
          'MP3 audio removes frequencies human ears cannot hear, shrinking file sizes by 90%.',
          'JPEG compression uses 2D Discrete Cosine Transform (DCT) to discard subtle color variations.',
          'MRI scanners measure frequency echoes from magnetic spins, using 2D FFT to reconstruct body cross-sections.'
        ],
        callout: {
          title: 'Historical Fact',
          text: 'Cooley & Tukey\'s Fast Fourier Transform (1965) is widely considered one of the top 10 most influential algorithms of the 20th century.',
          type: 'tip'
        },
        agnesNarration: 'Without the Fourier Transform, the modern digital world could not exist. Your MP3 music files, JPEG photos, Wi-Fi 6 OFDMA channel transmission, and hospital MRI body scanners all operate by translating reality between the time domain and the frequency domain. Whenever you face a difficult differential equation or signal, convert it to Fourier space—where calculus turns into simple algebra!'
      }
    ]
  },
  {
    id: 'agnes-cs-transformer',
    topic: 'Transformer Architecture & Self-Attention',
    subject: 'Computer Science',
    title: 'How AI Reads: Queries, Keys, Values & Self-Attention',
    hookSentence: 'Before transformers, AI read words one-by-one like a toddler. With self-attention, the model reads every word simultaneously and calculates how every word relates to every other word.',
    difficulty: 'Undergraduate',
    estimatedDuration: '4m 20s',
    totalScenes: 4,
    tags: ['Machine Learning', 'Deep Learning', 'Transformers', 'Attention', 'LLMs'],
    examTip: 'The division by √d_k in Attention(Q,K,V) prevents the dot products from growing excessively large, which would push softmax into regions with vanishingly small gradients.',
    commonPitfalls: [
      'Confusing Queries, Keys, and Values (Think of YouTube search: Query = search text, Keys = video titles/tags, Values = video content).',
      'Forgetting that attention has O(N²) quadratic memory complexity with sequence length N.'
    ],
    summaryTakeaways: [
      'Self-attention formula: Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) · V.',
      'Multi-Head Attention allows the model to jointly attend to information from different representation subspaces (e.g. grammar, coreference, sentiment).',
      'Positional encodings inject token order since self-attention is inherently permutation-invariant.'
    ],
    scenes: [
      {
        id: 'trans-scene-1',
        sceneNumber: 1,
        title: 'The Death of Recurrent Networks: Bottlenecks & Sequential Slowness',
        durationSeconds: 50,
        visualType: 'comparison',
        diagramType: 'attention_matrix',
        diagramTitle: 'RNN Sequential Bottleneck vs Transformer Full Matrix',
        keyFormulaOrConcept: 'h_t = tanh(W · h_{t-1} + U · x_t)   →   Attention is All You Need',
        chalkboardPoints: [
          'RNNs/LSTMs processed text strictly sequentially from left to right.',
          'Early tokens were forgotten in long sentences (vanishing gradient / memory bottleneck).',
          'Crucially: sequential processing could NOT be parallelized across GPU clusters.'
        ],
        callout: {
          title: 'Agnes Context',
          text: 'Vaswani et al. (2017) radically discarded recurrence entirely: "Attention Is All You Need" proved that pure matrix multiplication could understand language faster and deeper.',
          type: 'intuition'
        },
        agnesNarration: 'Welcome to Dr. Agnes\'s deep learning masterclass! Before 2017, natural language models were recurrent networks. They read text one token at a time, trying to pack the meaning of a whole paragraph into a single hidden vector. By the time the model reached word fifty, it had forgotten word one! Furthermore, GPUs were throttled because word two could not be computed until word one finished. Transformers shattered this limitation.'
      },
      {
        id: 'trans-scene-2',
        sceneNumber: 2,
        title: 'The Triad: Query, Key, and Value Vectors',
        durationSeconds: 65,
        visualType: 'formula',
        diagramType: 'attention_matrix',
        diagramTitle: 'Attention Mechanism Dot Product Pipeline',
        keyFormulaOrConcept: 'Attention(Q, K, V) = softmax\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
        chalkboardPoints: [
          'Every input token is projected into three vectors: Query (Q), Key (K), and Value (V).',
          'Dot product Q · Kᵀ measures how much token i wants to pay attention to token j.',
          'Softmax converts raw dot product scores into a probability distribution summing to 1.0.'
        ],
        callout: {
          title: 'The Scaling Factor √d_k',
          text: 'For high dimension d_k (e.g. 64 or 128), dot products grow large, causing softmax to saturate. Dividing by √d_k keeps gradients alive!',
          type: 'formula'
        },
        agnesNarration: 'Here is the most celebrated equation in modern AI: Attention of Q, K, V equals softmax of Q times K transpose over square root of d_k, multiplied by V. Let us demystify this. Think of a digital library. The Query is your search query. The Keys are the catalog tags on every book. Taking the dot product of your Query with all Keys computes a relevance score. Softmax normalizes those scores into percentage weights. Finally, you take a weighted sum of the Values. That is all self-attention is: a dynamic, differentiable lookup table!'
      },
      {
        id: 'trans-scene-3',
        sceneNumber: 3,
        title: 'Disambiguation in Action: "The Bank"',
        durationSeconds: 60,
        visualType: 'simulation',
        diagramType: 'attention_matrix',
        diagramTitle: 'Attention Heatmap for Context Disambiguation',
        keyFormulaOrConcept: 'Contextual Embedding = ∑ α_{ij} V_j',
        chalkboardPoints: [
          'Sentence A: "The frog jumped off the muddy bank into the river."',
          'Sentence B: "She deposited her paycheck at the local bank."',
          'In Sentence A, Query("bank") aligns heavily with Key("river") and Key("muddy"), shifting its meaning toward nature.'
        ],
        callout: {
          title: 'Core Insight',
          text: 'Static embeddings like Word2Vec had one single vector for "bank". Self-attention outputs contextual embeddings that change based on surrounding words!',
          type: 'tip'
        },
        quizCheckpoint: {
          question: 'In the self-attention formula, why is the dot product Q·Kᵀ divided by √d_k before applying the softmax function?',
          options: [
            'To ensure the matrix is symmetric',
            'To prevent large magnitude values that would cause softmax to saturate with vanishing gradients',
            'To convert the output into binary 0 or 1 values',
            'To reverse the order of words in the sentence'
          ],
          correctIndex: 1,
          explanation: 'When vector dimension d_k is large, dot products grow substantially in variance. Unscaled large values force softmax into regions where gradients are nearly zero, stalling backpropagation.'
        },
        agnesNarration: 'Watch how this solves linguistic ambiguity. Take the word "bank". Is it a financial institution, or the edge of a river? In an older model, "bank" had one fixed vector. But in a transformer, the Query for "bank" computes a massive dot product with the Key for "river" and "muddy". The resulting attention weight pulls information from "river" into "bank"\'s vector representation, crafting a context-aware contextual embedding on the fly.'
      },
      {
        id: 'trans-scene-4',
        sceneNumber: 4,
        title: 'Multi-Head Attention & The Path to Generative AI',
        durationSeconds: 50,
        visualType: 'diagram',
        diagramType: 'generic_flow',
        diagramTitle: 'Multi-Head Projection & Residual LayerNorm',
        keyFormulaOrConcept: 'MultiHead(Q,K,V) = Concat(head_1, ..., head_h) W^O',
        chalkboardPoints: [
          'Multiple heads (typically 8, 16, or 32) run in parallel on different linear projections.',
          'Head 1 might track grammar/syntax; Head 2 tracks pronoun reference; Head 3 tracks factual relationships.',
          'Residual skip-connections (x + Sublayer(x)) allow models to scale to hundreds of layers.'
        ],
        callout: {
          title: 'Agnes Final Takeaway',
          text: 'From GPT-4 to Gemini to AlphaFold 3, the transformer self-attention engine is the architectural backbone reshaping science and technology.',
          type: 'intuition'
        },
        agnesNarration: 'Why stop at one attention calculation? Multi-Head Attention splits Q, K, and V across 8, 16, or 32 parallel subspaces. One head tracks who is doing what to whom, another tracks tense and grammar, while a third tracks long-range factual dependencies. By stacking these multi-head blocks with residual connections and layer normalization, models like Gemini and GPT scale to hundreds of billions of parameters. And it all begins with that simple Q-K-V dot product.'
      }
    ]
  }
];

export function getAgnesVideoById(id: string): AgnesVideo | undefined {
  return PRECURATED_AGNES_VIDEOS.find(v => v.id === id);
}

export function getAgnesVideosBySubject(subject?: string): AgnesVideo[] {
  if (!subject || subject === 'All') return PRECURATED_AGNES_VIDEOS;
  return PRECURATED_AGNES_VIDEOS.filter(v => v.subject.toLowerCase() === subject.toLowerCase());
}
