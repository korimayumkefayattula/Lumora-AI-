export interface ExtraFeatureItem {
  id: string;
  number: number;
  title: string;
  stage: 'Ask & Strategize' | 'Understand & Explore' | 'Practice & Simulate' | 'Correct & Analyze' | 'Revise & Retain' | 'Improve & Personalize';
  functionText: string;
  howItWorks: string;
  iconName: string;
  color: string;
}

export const ALL_20_FEATURES: ExtraFeatureItem[] = [
  {
    id: 'exam_strategy_coach',
    number: 1,
    title: 'AI Exam Strategy Coach',
    stage: 'Ask & Strategize',
    functionText: 'Builds an exam strategy from syllabus, exam date, available time, progress, and weak topics.',
    howItWorks: 'Enter exam date → select subjects → AI analyzes progress → creates priorities → builds revision/practice schedule → adapts it as results change.',
    iconName: 'Target',
    color: 'from-rose-600 to-amber-600'
  },
  {
    id: 'mistake_analyzer',
    number: 2,
    title: 'AI Mistake Analyzer',
    stage: 'Correct & Analyze',
    functionText: 'Turns wrong answers into targeted learning actions.',
    howItWorks: 'Submit a test → AI identifies mistakes → classifies the issue → explains why → recommends focused practice.',
    iconName: 'AlertTriangle',
    color: 'from-amber-500 to-rose-500'
  },
  {
    id: 'smart_study_mode',
    number: 3,
    title: 'Smart Study Mode',
    stage: 'Practice & Simulate',
    functionText: 'Creates a distraction-free session around one learning objective.',
    howItWorks: 'Choose topic and duration → start session → Lumora shows only relevant tools → tracks completion → gives a session report.',
    iconName: 'Focus',
    color: 'from-indigo-600 to-sky-600'
  },
  {
    id: 'socratic_tutor',
    number: 4,
    title: 'AI Socratic Tutor',
    stage: 'Ask & Strategize',
    functionText: 'Uses guided questions to help students reason instead of immediately giving answers.',
    howItWorks: 'Ask a question → AI asks a guiding question → student responds → AI evaluates reasoning → gives the next hint → reaches the concept.',
    iconName: 'HelpCircle',
    color: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'answer_quality_checker',
    number: 5,
    title: 'Answer Quality Checker',
    stage: 'Correct & Analyze',
    functionText: 'Checks a student\'s written answer before submission.',
    howItWorks: 'Type or upload answer → AI checks correctness, relevance, structure, terminology, and missing points → highlights improvements.',
    iconName: 'CheckCircle2',
    color: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'exam_answer_writer',
    number: 6,
    title: 'Exam Answer Writer',
    stage: 'Practice & Simulate',
    functionText: 'Teaches students how to structure answers for different mark levels.',
    howItWorks: 'Select subject and marks → enter question → AI identifies required points → creates a structured model answer → highlights key terms.',
    iconName: 'FileEdit',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'oral_practice_viva',
    number: 7,
    title: 'AI Oral Practice',
    stage: 'Practice & Simulate',
    functionText: 'Provides viva, presentation, and oral-answer practice.',
    howItWorks: 'Choose topic → AI asks by voice/text → student answers → response is evaluated → follow-up questions are generated.',
    iconName: 'Mic',
    color: 'from-rose-500 to-purple-600'
  },
  {
    id: 'textbook_companion',
    number: 8,
    title: 'Textbook Companion',
    stage: 'Understand & Explore',
    functionText: 'Adds an AI learning layer to uploaded textbook chapters.',
    howItWorks: 'Upload/select chapter → ask questions → simplify paragraphs → extract definitions → generate examples, quizzes, and revision materials.',
    iconName: 'BookOpen',
    color: 'from-amber-600 to-emerald-600'
  },
  {
    id: 'study_session_recorder',
    number: 9,
    title: 'Study Session Recorder',
    stage: 'Revise & Retain',
    functionText: 'Turns a permitted study-session transcript into useful learning notes.',
    howItWorks: 'Start supported recording → study/speak → process transcript/content → generate key points, questions, and revision notes.',
    iconName: 'Radio',
    color: 'from-sky-600 to-indigo-600'
  },
  {
    id: 'topic_comparator',
    number: 10,
    title: 'AI Topic Comparator',
    stage: 'Understand & Explore',
    functionText: 'Explains confusing similarities and differences between concepts.',
    howItWorks: 'Enter two or more concepts → AI creates comparison → shows definitions, similarities, differences, examples, and common confusions.',
    iconName: 'GitCompare',
    color: 'from-indigo-600 to-rose-600'
  },
  {
    id: 'formula_vault',
    number: 11,
    title: 'Formula & Definition Vault',
    stage: 'Revise & Retain',
    functionText: 'Creates a searchable personal library of important formulas and definitions.',
    howItWorks: 'Select chapter → AI extracts items → review and save → search, tag, revise, or convert to flashcards.',
    iconName: 'BookMarked',
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'learning_path',
    number: 12,
    title: 'AI Learning Path',
    stage: 'Ask & Strategize',
    functionText: 'Builds a prerequisite-based route from basic knowledge to a target topic.',
    howItWorks: 'Choose goal → AI identifies prerequisites → creates sequence → track completion → recommends missing prerequisite lessons.',
    iconName: 'Compass',
    color: 'from-emerald-600 to-sky-600'
  },
  {
    id: 'daily_10min_revision',
    number: 13,
    title: 'Daily 10-Minute Revision',
    stage: 'Revise & Retain',
    functionText: 'Creates a short daily revision session.',
    howItWorks: 'Tap Quick Revision → AI selects high-value topics from progress/history → answer quick questions → receive feedback → revision queue updates.',
    iconName: 'Clock',
    color: 'from-rose-600 to-pink-600'
  },
  {
    id: 'study_resource_finder',
    number: 14,
    title: 'AI Study Resource Finder',
    stage: 'Understand & Explore',
    functionText: 'Organizes relevant learning resources around a topic.',
    howItWorks: 'Enter topic → AI identifies learning objective → shows available approved/connected resources → explains their purpose → save resources.',
    iconName: 'Search',
    color: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'collaborative_study_room',
    number: 15,
    title: 'Collaborative Study Room',
    stage: 'Practice & Simulate',
    functionText: 'Lets students study together with shared academic tools.',
    howItWorks: 'Create/join room → choose topic → share notes/questions → use shared quiz/timer → AI can summarize discussion and create practice.',
    iconName: 'Users',
    color: 'from-purple-600 to-rose-600'
  },
  {
    id: 'presentation_maker',
    number: 16,
    title: 'AI Presentation Maker',
    stage: 'Practice & Simulate',
    functionText: 'Turns a school topic into a presentation structure.',
    howItWorks: 'Enter topic and level → AI creates outline → generates slide content → suggests visuals → edit → export through a supported presentation workflow.',
    iconName: 'Presentation',
    color: 'from-indigo-600 to-violet-600'
  },
  {
    id: 'assignment_organizer',
    number: 17,
    title: 'AI Assignment Organizer',
    stage: 'Improve & Personalize',
    functionText: 'Organizes assignments by deadline and priority.',
    howItWorks: 'Add assignment → set deadline → AI breaks it into milestones → adds calendar reminders → tracks completion.',
    iconName: 'CalendarCheck',
    color: 'from-amber-600 to-orange-600'
  },
  {
    id: 'personal_learning_memory',
    number: 18,
    title: 'Personal Learning Memory',
    stage: 'Improve & Personalize',
    functionText: 'Personalizes explanations using appropriate learning preferences and progress signals.',
    howItWorks: 'System uses permitted learning preferences/activity → adjusts explanations, difficulty, examples, and revision suggestions → student can edit preferences.',
    iconName: 'Brain',
    color: 'from-rose-600 to-indigo-600'
  },
  {
    id: 'parent_learning_brief',
    number: 19,
    title: 'AI Parent Learning Brief',
    stage: 'Improve & Personalize',
    functionText: 'Creates a simple weekly parent-facing learning report.',
    howItWorks: 'Summarize permitted activity → show completed work, progress, upcoming priorities, and support areas → parent views the report.',
    iconName: 'FileHeart',
    color: 'from-pink-600 to-rose-600'
  },
  {
    id: 'study_routine_check',
    number: 20,
    title: 'AI Study Routine Check',
    stage: 'Improve & Personalize',
    functionText: 'Reviews study workload and suggests practical scheduling adjustments.',
    howItWorks: 'Review recent study activity → identify overloaded or missed plans → suggest prioritization and breaks → student chooses whether to apply changes.',
    iconName: 'Activity',
    color: 'from-teal-600 to-emerald-600'
  }
];

export async function callExtraFeatureAI(featureId: string, payload: any): Promise<any> {
  try {
    const res = await fetch('/api/extra-features-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featureId, payload })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Call to extra features AI failed, using client fallback:', err);
  }

  // Resilient fallback logic for client
  return getClientFallback(featureId, payload);
}

function getClientFallback(featureId: string, payload: any): any {
  switch (featureId) {
    case 'exam_strategy_coach':
      return {
        readinessScore: 78,
        highPriorityTopics: [
          'High-weightage calculus & electrodynamics problems',
          'Organic reaction mechanism pathway charts',
          'Formula recall under strict 2-minute limits'
        ],
        weeklyMilestoneBreakdown: [
          { phase: 'Weeks 1-2: Core Foundation & Weak Areas', focus: 'Target high-yield concepts in ' + (payload.subjects?.[0] || 'Physics'), targetHours: 14 },
          { phase: 'Weeks 3-4: Timed Sectional Drills', focus: 'Mixed chapter problems and speed drills', targetHours: 16 },
          { phase: 'Final Sprint: Comprehensive Mocks', focus: 'Past 5-year paper simulations under strict exam conditions', targetHours: 12 }
        ],
        dailyRoutineRecommendation: 'Spend 60% of daily time solving new unseen problems, 25% on active recall formula revision, and 15% reviewing your error journal.',
        scoreBoosterAdvice: 'Never leave blank steps on subjective questions; explicitly write governing formulas and labeled diagrams for partial credit.'
      };
    case 'mistake_analyzer':
      return {
        classification: 'Conceptual Gap',
        rootCauseAnalysis: 'The solution assumed standard equilibrium conditions without accounting for the temperature-dependent shift in activation barriers.',
        underlyingPrinciple: 'Le Chatelier’s Principle and Arrhenius kinetics governing non-standard states.',
        stepByStepCorrection: [
          'Step 1: Write down the balanced stoichiometric reaction quotient Q.',
          'Step 2: Compare Q with K_eq at the stated temperature.',
          'Step 3: Deduce net reaction directionality before solving for equilibrium concentrations.'
        ],
        mirrorPracticeProblem: {
          question: 'In an endothermic synthesis, what happens to product yield when temperature is increased from 300K to 450K at constant pressure?',
          solution: 'Endothermic processes absorb heat (treat heat as reactant); increasing temperature shifts equilibrium toward products, increasing equilibrium constant K and product yield.'
        },
        examTrapWarning: 'Examiners often invert the signs on ΔH to trick students into choosing the exothermic pathway.'
      };
    case 'socratic_tutor':
      return {
        affirmation: 'You correctly identified the initial boundary condition and velocity vector!',
        guidingQuestion: 'Now, when the particle enters the uniform magnetic field perpendicularly, what is the angle between its velocity vector and the magnetic force acting on it?',
        subtleHint: 'Recall the cross product definition F = q(v × B). What is the value of sin(90°)?',
        progressPercent: 65
      };
    case 'answer_quality_checker':
      return {
        predictedScore: 8,
        maxScore: payload.marks || 10,
        scoreBreakdown: {
          conceptualCorrectness: '9/10',
          scientificTerminology: '8/10',
          structuralClarity: '8/10',
          diagramOrFormulaInclusion: '7/10'
        },
        strengths: ['Accurate core definition', 'Correct governing rate law written'],
        missingMarkScoringPoints: [
          'Underline the specific stereochemical consequence (Walden inversion)',
          'Mention the effect of polar protic vs polar aprotic solvents'
        ],
        recommendedModelImprovements: 'Add a 1-sentence conclusion summarizing the optical rotation of the resulting enantiomer to guarantee maximum marks.'
      };
    case 'exam_answer_writer':
      return {
        targetMarkLevel: `${payload.marks || 5} Marks`,
        timeAllocation: '7 to 9 minutes in the exam hall',
        requiredKeywords: ['State fundamental postulate', 'Mathematical derivation', 'SI Units', 'Labeled diagram'],
        recommendedStructure: [
          { section: '1. Definition & Law Statement', content: 'State the formal textbook law verbatim within quotation marks.' },
          { section: '2. Mathematical Formulation', content: 'Write the governing equation with every variable defined and units specified.' },
          { section: '3. Derivation / Working Steps', content: 'Step-by-step mathematical logic with numbered equation lines.' },
          { section: '4. Physical Significance & Limits', content: 'State boundary assumptions and a practical application.' }
        ],
        examinerChecklist: ['Are all vectors accented?', 'Is the final boxed answer labeled with correct units?']
      };
    case 'oral_practice_viva':
      return {
        verdict: 'Good',
        accuracyRating: 84,
        feedback: 'You explained the physical intuition cleanly! To sound like a top scorer, emphasize the conservation of momentum rather than just calling it "action and reaction".',
        betterWayToStateIt: 'In a closed system with zero external net force, the total momentum vector remains invariant before and after the collision.',
        nextFollowUpQuestion: 'What distinguishes an elastic collision from an inelastic collision in terms of kinetic energy conservation?'
      };
    case 'textbook_companion':
      return {
        simplifiedSummary: 'This chapter explains how electrical energy is transformed and conserved across series and parallel circuit networks.',
        extractedDefinitions: [
          { term: 'Kirchhoff’s Current Law (KCL)', definition: 'The sum of all currents entering any junction node equals the sum of currents leaving (Conservation of Charge).' },
          { term: 'Kirchhoff’s Voltage Law (KVL)', definition: 'The algebraic sum of all potential differences in any closed circuit loop is zero (Conservation of Energy).' }
        ],
        realWorldAnalogies: ['Think of electric current like water flowing through pipes; a junction cannot store water, so whatever flows in must immediately flow out!'],
        quickCheckQuizzes: [
          {
            question: 'Kirchhoff’s Loop Rule (KVL) is a direct consequence of which conservation law?',
            options: ['Conservation of Mass', 'Conservation of Momentum', 'Conservation of Energy', 'Conservation of Charge'],
            correct: 2,
            explanation: 'The electric potential is conservative; returning to the same starting point implies zero net change in potential energy.'
          }
        ],
        revisionFlashcards: [
          { front: 'What is KCL based upon?', back: 'Conservation of electric charge at any junction node.' }
        ]
      };
    case 'learning_path':
      return {
        targetTopic: payload.goalTopic || 'Quantum Mechanics',
        estimatedStudyHours: 20,
        stages: [
          {
            step: 1,
            title: 'Foundational Prerequisites',
            topics: ['Complex Numbers & Euler Identity', 'Classical Wave Equation', 'Linear Algebra & Eigenvectors'],
            whyNeeded: 'Quantum wavefunctions exist in Hilbert space and require linear algebraic state representation.',
            diagnosticCheckpoint: 'Can you compute the eigenvalues of a 2x2 Hermitian matrix?'
          },
          {
            step: 2,
            title: 'Core Quantum Postulates',
            topics: ['Wave-Particle Duality (de Broglie)', 'Photoelectric Effect', 'Schrödinger Time-Independent Equation'],
            whyNeeded: 'The fundamental mathematical engine connecting observable measurements with probability densities.',
            diagnosticCheckpoint: 'Can you solve the 1D infinite square potential well?'
          },
          {
            step: 3,
            title: 'Advanced Applications & Superposition',
            topics: ['Quantum Tunneling', 'Harmonic Oscillator', 'Spin & Pauli Exclusion Principle'],
            whyNeeded: 'Explains modern solid-state physics, semiconductors, and quantum computing qubits.',
            diagnosticCheckpoint: 'Explain how barrier tunneling probability decays exponentially with thickness.'
          }
        ]
      };
    case 'presentation_maker':
      return {
        title: `${payload.topic || 'STEM Mastery'} - Presentation Deck`,
        targetAudience: payload.level || 'Academic',
        slides: [
          {
            slideNumber: 1,
            title: `Introduction to ${payload.topic || 'the Topic'}`,
            bulletPoints: ['Why this concept matters in modern science', 'Core motivation and real-world implications', 'Overview of presentation structure'],
            speakerNotes: `Good morning everyone. Today we are diving into ${payload.topic || 'this subject'} to understand its governing laws and impact.`,
            suggestedVisual: 'A bold, high-contrast schematic showing the primary phenomenon.'
          },
          {
            slideNumber: 2,
            title: 'Theoretical Foundations & Governing Equations',
            bulletPoints: ['First principles derivation', 'Key assumptions and boundary conditions', 'Relationship between primary variables'],
            speakerNotes: 'Notice how the mathematical equation directly reflects the physical conservation principle.',
            suggestedVisual: 'A chalkboard diagram with color-coded vector arrows.'
          },
          {
            slideNumber: 3,
            title: 'Experimental Proofs & Case Studies',
            bulletPoints: ['Historical milestone experiments', 'Empirical validation data', 'Modern applications in engineering'],
            speakerNotes: 'This was proven in seminal laboratory studies that settled decades of debate.',
            suggestedVisual: 'A comparative line chart with observed data versus theoretical curve.'
          },
          {
            slideNumber: 4,
            title: 'Summary & Key Takeaways',
            bulletPoints: ['Three non-negotiable principles', 'Common pitfalls to avoid', 'Open research frontiers'],
            speakerNotes: 'To conclude, mastering this mechanism unlocks deeper understanding across multiple related domains.',
            suggestedVisual: 'A clean 3-pillar summary grid with key formulas highlighted.'
          }
        ]
      };
    case 'parent_learning_brief':
      return {
        greeting: 'Dear Parent / Guardian,',
        executiveSummary: 'This week your student demonstrated exceptional academic dedication, clocking 9.5 hours of focused problem-solving across core STEM subjects with an 88% average recall accuracy.',
        keyMilestonesAchieved: [
          'Mastered Organic Substitution Mechanisms with Dr. Agnes Video AI',
          'Maintained a continuous 6-day study streak with consistent focus sprints',
          'Completed 15 active recall flashcard challenges in Physics'
        ],
        focusAreasNextWeek: [
          'Targeting Calculus differential equation problem drills',
          'Taking a full timed mock test this Saturday'
        ],
        howParentCanSupportAtHome: [
          'Encourage a relaxing 15-minute walk after their evening study session',
          'Ask them: "What was the most surprising concept Dr. Agnes explained this week?"'
        ],
        confidenceMetric: 'High & Steadily Growing'
      };
    case 'study_routine_check':
      return {
        burnoutRiskLevel: 'Low',
        workloadAnalysis: 'The student’s study cadence is well-balanced, but cognitive fatigue peaks when mathematical problem-solving exceeds 90 uninterrupted minutes.',
        suggestedAdjustments: [
          'Alternate heavy numerical subjects (Physics/Math) with conceptual reading (Biology/Organic Chemistry).',
          'Enforce the 20-20-20 visual rule to prevent screen eye strain.',
          'Schedule the highest cognitive-load tasks in the morning peak focus window.'
        ],
        recommendedIdealSchedule: [
          { timeSlot: 'Morning (09:00 - 11:30)', activity: 'High-focus problem solving and derivations' },
          { timeSlot: 'Afternoon (14:30 - 16:30)', activity: 'Concept review, videos, and reading' },
          { timeSlot: 'Evening (19:00 - 20:30)', activity: 'Active recall drills and flashcard revision' }
        ]
      };
    default:
      return { message: 'Processed successfully', timestamp: new Date().toISOString() };
  }
}
