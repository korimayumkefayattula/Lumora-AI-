import { saveKeepNote, KeepNoteItem, storeKeepNotesLocally, getStoredKeepNotes } from './firestoreWorkspace';

export interface ConceptComparison {
  id: string;
  conceptA: string;
  conceptB: string;
  subject: string;
  definitionA: string;
  definitionB: string;
  similarities: string[];
  keyDifferences: Array<{
    aspect: string;
    conceptAValue: string;
    conceptBValue: string;
  }>;
  commonExamConfusions: string[];
  agnesRuleOfThumb: string;
  exampleDrill?: {
    scenario: string;
    whichApplies: string;
    why: string;
  };
}

export const PRESET_TOPIC_COMPARISONS: ConceptComparison[] = [
  {
    id: 'sn1_vs_sn2',
    conceptA: 'SN1 Reaction (Substitution Nucleophilic Unimolecular)',
    conceptB: 'SN2 Reaction (Substitution Nucleophilic Bimolecular)',
    subject: 'Chemistry',
    definitionA: 'A two-step nucleophilic substitution proceeding via a flat carbocation intermediate, yielding racemic stereochemistry.',
    definitionB: 'A concerted, one-step nucleophilic substitution featuring a simultaneous backside attack and complete Walden inversion of stereochemistry.',
    similarities: [
      'Both replace a leaving group (e.g. halogen) with a nucleophile on an alkyl carbon.',
      'Good leaving groups (I⁻ > Br⁻ > Cl⁻) accelerate both mechanisms.',
      'Both compete directly with elimination (E1/E2) pathways.'
    ],
    keyDifferences: [
      { aspect: 'Kinetics & Rate Law', conceptAValue: 'Rate = k[Substrate] (First order)', conceptBValue: 'Rate = k[Substrate][Nucleophile] (Second order)' },
      { aspect: 'Substrate Preference', conceptAValue: '3° > 2° >> 1° (Stabilizes carbocation)', conceptBValue: 'Methyl > 1° > 2° >> 3° (Steric hindrance prevents 3°)' },
      { aspect: 'Stereochemistry', conceptAValue: 'Racemization (inversion + retention)', conceptBValue: '100% Inversion of configuration (Walden inversion)' },
      { aspect: 'Preferred Solvent', conceptAValue: 'Polar Protic (Water, EtOH) to stabilize ions', conceptBValue: 'Polar Aprotic (Acetone, DMSO) to unshield nucleophile' },
      { aspect: 'Nucleophile Strength', conceptAValue: 'Weak nucleophiles suffice (H2O, ROH)', conceptBValue: 'Requires strong, unhindered nucleophile (OH⁻, CN⁻)' }
    ],
    commonExamConfusions: [
      'Students assume 2° alkyl halides exclusively do SN1; in reality, solvent and nucleophile strength decide 2° behavior.',
      'Forgetting that polar protic solvents cage strong nucleophiles with hydrogen bonding, effectively killing SN2 rates.'
    ],
    agnesRuleOfThumb: 'Remember "SN2 has 2 steps in 1 single punch with backside inversion; SN1 waits alone in Step 1 to make a flat carbocation before anyone attacks!"',
    exampleDrill: {
      scenario: 'Reacting (R)-2-bromobutane with sodium cyanide (NaCN) in pure dry acetone.',
      whichApplies: 'SN2 Mechanism',
      why: '2° alkyl halide with a powerful nucleophile (CN⁻) in a polar aprotic solvent (acetone) forces clean concerted backside attack with stereochemical inversion to (S)-2-methylbutanenitrile.'
    }
  },
  {
    id: 'mitosis_vs_meiosis',
    conceptA: 'Mitosis (Equational Cellular Division)',
    conceptB: 'Meiosis (Reductional Genetic Division)',
    subject: 'Biology',
    definitionA: 'A single nuclear division yielding two genetically identical diploid (2n) somatic daughter cells for growth and tissue repair.',
    definitionB: 'A two-stage specialized division yielding four genetically unique haploid (n) gametes with halved chromosome counts for sexual reproduction.',
    similarities: [
      'Both duplicate chromosomes during interphase (S-phase) prior to division.',
      'Both utilize spindle fibers, centrosomes, and chromatin condensation.',
      'Both share the core PMAT stages (Prophase, Metaphase, Anaphase, Telophase).'
    ],
    keyDifferences: [
      { aspect: 'Number of Divisions', conceptAValue: '1 single division cycle (PMAT)', conceptBValue: '2 consecutive divisions (Meiosis I & Meiosis II)' },
      { aspect: 'Daughter Cell Count & Ploidy', conceptAValue: '2 daughter cells, identical diploid (2n)', conceptBValue: '4 daughter cells, genetically diverse haploid (n)' },
      { aspect: 'Crossing Over / Chiasmata', conceptAValue: 'Absent; no genetic exchange occurs', conceptBValue: 'Crucial crossing over during Prophase I' },
      { aspect: 'Anaphase I Separation', conceptAValue: 'Sister chromatids separate', conceptBValue: 'Homologous chromosomes separate in Anaphase I' },
      { aspect: 'Biological Purpose', conceptAValue: 'Somatic growth, cell renewal, cloning', conceptBValue: 'Gamete production & evolutionary variation' }
    ],
    commonExamConfusions: [
      'Students confuse Anaphase of Mitosis with Anaphase I of Meiosis: homologous chromosome pairs separate in Meiosis I, while sister chromatids separate in Mitosis & Meiosis II.',
      'Assuming DNA replicates twice in meiosis because there are two divisions; DNA only replicates ONCE before Meiosis I.'
    ],
    agnesRuleOfThumb: 'Mitosis = "My-Toes-Grow" (identical body cells); Meiosis = "Makes-Me" (unique sperm & egg cells with half the recipe)!',
    exampleDrill: {
      scenario: 'A human skin epithelial cell divides to heal an epidermal scratch.',
      whichApplies: 'Mitosis',
      why: 'Somatic regeneration requires exact 46-chromosome clones with zero reduction in ploidy.'
    }
  },
  {
    id: 'special_vs_general_relativity',
    conceptA: 'Special Relativity (Einstein 1905)',
    conceptB: 'General Relativity (Einstein 1915)',
    subject: 'Physics',
    definitionA: 'A theory of mechanics in flat spacetime uniting space and time for observers in non-accelerating (inertial) reference frames.',
    definitionB: 'A geometric theory of gravitation where mass-energy curves the four-dimensional fabric of spacetime, governing accelerating frames.',
    similarities: [
      'Both affirm that the speed of light in vacuum (c) is an absolute, invariant speed limit for all observers.',
      'Both preserve causality and state that time is relative rather than universal.',
      'Special relativity is the local flat-space limit of General Relativity.'
    ],
    keyDifferences: [
      { aspect: 'Reference Frames', conceptAValue: 'Restricted strictly to inertial (constant velocity) frames', conceptBValue: 'Encompasses all accelerating and gravitational frames' },
      { aspect: 'Geometry of Spacetime', conceptAValue: 'Flat Minkowski spacetime with zero curvature', conceptBValue: 'Dynamic curved Riemannian manifold: G_μν = (8πG/c⁴)T_μν' },
      { aspect: 'Gravity Treatment', conceptAValue: 'Ignores gravity entirely', conceptBValue: 'Interprets gravity not as a force, but as geodesic curvature' },
      { aspect: 'Signature Phenomena', conceptAValue: 'Time dilation, Lorentz length contraction, E = mc²', conceptBValue: 'Gravitational redshift, gravitational lensing, black holes' }
    ],
    commonExamConfusions: [
      'Students invoke special relativity time dilation formula Δt = γΔt₀ for GPS satellites without accounting for gravitational time dilation (general relativity), which actually speeds satellite clocks up relative to ground clocks!',
      'Thinking mass increases to infinity; modern physics treats rest mass m₀ as invariant.'
    ],
    agnesRuleOfThumb: 'Special Relativity = "Straight line cruise at speed c"; General Relativity = "Mass tells spacetime how to curve, curved spacetime tells mass how to move!"',
    exampleDrill: {
      scenario: 'A beam of starlight visibly bends as it grazes the edge of the Sun during a total solar eclipse.',
      whichApplies: 'General Relativity',
      why: 'Mass curves spacetime; photons follow the shortest geodesic path through the Sun\'s gravitational well.'
    }
  },
  {
    id: 'permutation_vs_combination',
    conceptA: 'Permutations P(n, r)',
    conceptB: 'Combinations C(n, r)',
    subject: 'Mathematics',
    definitionA: 'An arrangement of r items selected from n items where the precise order or sequence matters strictly.',
    definitionB: 'A grouping or selection of r items from n items where the order of selection is entirely irrelevant.',
    similarities: [
      'Both select r distinct items from a pool of n available items without replacement.',
      'Both satisfy r ≤ n.',
      'Connected by the relation P(n, r) = r! × C(n, r).'
    ],
    keyDifferences: [
      { aspect: 'Order Dependency', conceptAValue: 'Order MATTERS (ABC ≠ BCA ≠ CAB)', conceptBValue: 'Order DOES NOT matter ({A, B, C} = {B, C, A})' },
      { aspect: 'Governing Formula', conceptAValue: 'n! / (n - r)!', conceptBValue: 'n! / [r! (n - r)!]' },
      { aspect: 'Quantity Ratio', conceptAValue: 'Always r! times larger than combinations', conceptBValue: 'Always smaller because permutations within groups are collapsed' },
      { aspect: 'Typical Exam Keywords', conceptAValue: '"Arrangement", "Podium ranking", "Password", "Schedule"', conceptBValue: '"Committee", "Team selection", "Hand of cards", "Subgroup"' }
    ],
    commonExamConfusions: [
      'Calling a padlock a "combination lock" is mathematically wrong; the digits must enter in specific sequence, so it is a permutation lock!',
      'Forgetting to divide by r! when selecting groups where internal ranking is meaningless.'
    ],
    agnesRuleOfThumb: 'Ask: "If I swap two items, does it create a brand new outcome?" Yes = Permutation; No = Combination!',
    exampleDrill: {
      scenario: 'Selecting a 4-person debate delegation from a class of 20 students.',
      whichApplies: 'Combination C(20, 4)',
      why: 'All four members have identical delegate status; the order they are announced creates no new team.'
    }
  }
];

export async function compareConceptsWithAI(conceptA: string, conceptB: string, subject: string = 'STEM'): Promise<ConceptComparison> {
  const cleanA = conceptA.trim();
  const cleanB = conceptB.trim();

  // Check preset first
  const existing = PRESET_TOPIC_COMPARISONS.find(
    p => (p.conceptA.toLowerCase().includes(cleanA.toLowerCase()) && p.conceptB.toLowerCase().includes(cleanB.toLowerCase())) ||
         (p.conceptA.toLowerCase().includes(cleanB.toLowerCase()) && p.conceptB.toLowerCase().includes(cleanA.toLowerCase()))
  );
  if (existing) return existing;

  try {
    const res = await fetch('/api/topic-comparator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conceptA: cleanA, conceptB: cleanB, subject }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.comparison) {
        return data.comparison;
      }
    }
  } catch (e) {
    console.warn('Comparator API call failed, generating pedagogical comparison:', e);
  }

  // Resilient fallback structure
  return {
    id: `cmp_${Date.now()}`,
    conceptA: cleanA,
    conceptB: cleanB,
    subject,
    definitionA: `${cleanA} refers to the physical or mathematical construct focused on primary state and initial constraints.`,
    definitionB: `${cleanB} refers to the corresponding mechanism focused on dynamic response, alternative configurations, or complementary principles.`,
    similarities: [
      `Both concepts operate within the core curriculum framework of ${subject}.`,
      `Both share overlapping boundary conditions and governing conservation laws.`,
      `Exam questions frequently pair them to test discriminating understanding.`
    ],
    keyDifferences: [
      { aspect: 'Primary Focus', conceptAValue: `Emphasizes direct fundamental behavior of ${cleanA}`, conceptBValue: `Emphasizes secondary or converted response of ${cleanB}` },
      { aspect: 'Mathematical / Operational Form', conceptAValue: `Governed by direct input parameters`, conceptBValue: `Governed by derived or rate-based parameters` },
      { aspect: 'Key Distinguishing Factor', conceptAValue: `Invariant under standard conditions`, conceptBValue: `Varies dependent on environmental or frame factors` }
    ],
    commonExamConfusions: [
      `Students frequently mix up the directionality and sign conventions between ${cleanA} and ${cleanB}.`,
      `Forgetting that the two concepts apply under different boundary constraints.`
    ],
    agnesRuleOfThumb: `When faced with ${cleanA} vs ${cleanB}, always ask what remains constant. That single conserved invariant immediately reveals which concept governs!`,
    exampleDrill: {
      scenario: `An exam problem presents a transitional state involving both ${cleanA} and ${cleanB}.`,
      whichApplies: `${cleanA} applies initially, followed by ${cleanB}`,
      why: `Establish the foundational state first, then track how the transformation induces the secondary behavior.`
    }
  };
}

export async function exportComparisonToKeep(comparison: ConceptComparison, userId?: string | null): Promise<KeepNoteItem> {
  const title = `Agnes Topic Comparison: ${comparison.conceptA} vs ${comparison.conceptB}`;
  
  const diffs = comparison.keyDifferences.map(d => `• ${d.aspect}:\n  - ${comparison.conceptA}: ${d.conceptAValue}\n  - ${comparison.conceptB}: ${d.conceptBValue}`).join('\n\n');

  const content = `Subject: ${comparison.subject}\n\nDefinitions:\n• ${comparison.conceptA}: ${comparison.definitionA}\n• ${comparison.conceptB}: ${comparison.definitionB}\n\nSimilarities:\n${comparison.similarities.map(s => `• ${s}`).join('\n')}\n\nKey Differences:\n${diffs}\n\n⚠️ Common Exam Pitfalls:\n${comparison.commonExamConfusions.map(c => `• ${c}`).join('\n')}\n\n💡 Agnes Rule of Thumb:\n"${comparison.agnesRuleOfThumb}"`;

  const item: KeepNoteItem = {
    id: `keep_cmp_${Date.now()}`,
    title,
    content,
    color: 'purple',
    pinned: true,
    tags: [comparison.subject, 'Topic Comparator', 'Dr. Agnes', 'Exam Prep'],
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
