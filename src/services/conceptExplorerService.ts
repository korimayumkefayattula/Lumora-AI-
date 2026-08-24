import { 
  ConceptMapData, 
  ConceptComparison, 
  ConceptHistoryItem 
} from '../types/conceptExplorer';

const HISTORY_STORAGE_KEY = 'lumora_concept_explorer_history_v1';
const SAVED_MAPS_KEY = 'lumora_saved_concept_maps_v1';

export class ConceptExplorerService {
  /**
   * Fetch or generate a Concept Exploration Map
   */
  static async exploreTopic(
    topic: string, 
    subject: string = "Science", 
    gradeLevel: string = "Class 10 / High School",
    notebookContext?: string
  ): Promise<ConceptMapData> {
    try {
      const res = await fetch('/api/concept-explorer/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, gradeLevel, notebookContext })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.nodes && data.nodes.length > 0) {
          this.saveToHistory({
            id: `hist_${Date.now()}`,
            topic: data.topic || topic,
            subject: data.subject || subject,
            gradeLevel: data.gradeLevel || gradeLevel,
            timestamp: new Date().toISOString(),
            nodeCount: data.nodes.length,
            overview: data.oneSentenceOverview || 'Interactive concept exploration'
          });
          return data;
        }
      }
    } catch (err) {
      console.warn("Concept Explorer API error, generating fallback learning map...", err);
    }

    // Fallback Generator
    const fallbackData = this.generateFallbackConceptMap(topic, subject, gradeLevel);
    this.saveToHistory({
      id: `hist_${Date.now()}`,
      topic: fallbackData.topic,
      subject: fallbackData.subject,
      gradeLevel: fallbackData.gradeLevel,
      timestamp: new Date().toISOString(),
      nodeCount: fallbackData.nodes.length,
      overview: fallbackData.oneSentenceOverview
    });

    return fallbackData;
  }

  /**
   * Ask Lumora AI about a concept
   */
  static async askConceptQuestion(
    topic: string,
    question: string,
    activeNodeLabel?: string,
    graphContext?: any
  ): Promise<string> {
    try {
      const res = await fetch('/api/concept-explorer/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, question, activeNodeLabel, graphContext })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.answer) return data.answer;
      }
    } catch (e) {
      console.warn("Ask Concept API failed, fallback response used.");
    }

    return `Great question about ${activeNodeLabel || topic}! "${question}" directly relates to how energy and information transfer across the system. The key principle here is maintaining fundamental balance and conservation principles.`;
  }

  /**
   * Compare two concepts
   */
  static async compareConcepts(
    conceptA: string,
    conceptB: string,
    subject: string = "General Science"
  ): Promise<ConceptComparison> {
    try {
      const res = await fetch('/api/concept-explorer/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conceptA, conceptB, subject })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.conceptA && data.similarities) return data;
      }
    } catch (e) {
      console.warn("Concept Compare API failed, generating fallback comparison.");
    }

    return {
      conceptA,
      conceptB,
      summaryComparison: `${conceptA} and ${conceptB} are foundational concepts in ${subject} that students frequently confuse due to their closely linked mechanisms.`,
      similarities: [
        `Both process fundamental physical or mathematical quantities within a system.`,
        `Both rely on conservation laws and structural equations.`,
        `Both form core requirements for advanced problem solving in ${subject}.`
      ],
      keyDifferences: [
        {
          aspect: 'Primary Focus',
          conceptAValue: `Focuses on input transformation and baseline energy/structure.`,
          conceptBValue: `Focuses on output flow, rate of change, or secondary reaction.`
        },
        {
          aspect: 'Direction / Vector',
          conceptAValue: 'Unidirectional or scalar potential in baseline state.',
          conceptBValue: 'Dynamic, vector-based or reversible flow.'
        },
        {
          aspect: 'Key Equation',
          conceptAValue: 'Potential = Force × Distance / Input Parameter',
          conceptBValue: 'Rate = Δ Quantity / Δ Time'
        }
      ],
      commonConfusions: `Students often mix up the cause with the effect. Remember that ${conceptA} establishes the necessary conditions before ${conceptB} can occur.`,
      mnemonicOrTip: `Pro-tip: Think of ${conceptA} as stored potential water in a reservoir, and ${conceptB} as the water flowing out through the generator turbine!`
    };
  }

  /**
   * Manage Local Storage History
   */
  static getHistory(): ConceptHistoryItem[] {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static saveToHistory(item: ConceptHistoryItem): void {
    try {
      const current = this.getHistory();
      const filtered = current.filter(i => i.topic.toLowerCase() !== item.topic.toLowerCase());
      const updated = [item, ...filtered].slice(0, 20); // Keep top 20
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving concept history", e);
    }
  }

  static clearHistory(): void {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }

  /**
   * Save Concept Maps to Favorites/Bookmarks
   */
  static getSavedMaps(): ConceptMapData[] {
    try {
      const raw = localStorage.getItem(SAVED_MAPS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static saveConceptMap(map: ConceptMapData): void {
    try {
      const current = this.getSavedMaps();
      const filtered = current.filter(m => m.topic.toLowerCase() !== map.topic.toLowerCase());
      localStorage.setItem(SAVED_MAPS_KEY, JSON.stringify([map, ...filtered]));
    } catch (e) {
      console.error("Error saving map", e);
    }
  }

  /**
   * Rich Fallback Generator for offline or demo use
   */
  private static generateFallbackConceptMap(topic: string, subject: string, gradeLevel: string): ConceptMapData {
    const topicTitle = topic.trim() || "Photosynthesis";
    
    return {
      topic: topicTitle,
      subject: subject || "Biology / Natural Science",
      gradeLevel: gradeLevel || "Class 10 / High School",
      estimatedMasteryTime: "20-25 mins",
      oneSentenceOverview: `${topicTitle} is the fundamental biological process through which light energy is transformed into chemical energy in living cells.`,
      coreNodeId: 'node_core',
      nodes: [
        {
          id: 'node_prereq_1',
          label: 'Light & Solar Energy Spectrum',
          category: 'prerequisite',
          shortDescription: 'Electromagnetic radiation photons absorbed by pigments.',
          importance: 'high',
          difficulty: 'Easy',
          status: 'mastered'
        },
        {
          id: 'node_prereq_2',
          label: 'Cellular Structure & Chloroplasts',
          category: 'prerequisite',
          shortDescription: 'Organelles containing thylakoid membranes and stroma fluid.',
          importance: 'critical',
          difficulty: 'Medium',
          status: 'mastered'
        },
        {
          id: 'node_core',
          label: topicTitle,
          category: 'core',
          shortDescription: `Central mechanism of ${topicTitle} converting inputs into outputs.`,
          importance: 'critical',
          difficulty: 'Medium',
          status: 'exploring'
        },
        {
          id: 'node_sub_1',
          label: 'Light-Dependent Reactions',
          category: 'subconcept',
          shortDescription: 'Photolysis of water producing ATP and NADPH in thylakoids.',
          importance: 'high',
          difficulty: 'Medium',
          status: 'not_started'
        },
        {
          id: 'node_sub_2',
          label: 'Light-Independent Calvin Cycle',
          category: 'subconcept',
          shortDescription: 'Carbon fixation converting CO2 into glucose sugars in stroma.',
          importance: 'high',
          difficulty: 'Hard',
          status: 'not_started'
        },
        {
          id: 'node_app_1',
          label: 'Global Carbon Cycle Balance',
          category: 'application',
          shortDescription: 'Regulation of Earth atmospheric oxygen and carbon dioxide levels.',
          importance: 'high',
          difficulty: 'Easy',
          status: 'not_started'
        },
        {
          id: 'node_app_2',
          label: 'Agricultural Crop Yields',
          category: 'application',
          shortDescription: 'Optimizing light, water, and nutrient delivery for food production.',
          importance: 'medium',
          difficulty: 'Easy',
          status: 'not_started'
        },
        {
          id: 'node_adv_1',
          label: 'C4 & CAM Evolutionary Pathways',
          category: 'advanced',
          shortDescription: 'Specialized photosynthetic adaptations for arid, high-temp environments.',
          importance: 'medium',
          difficulty: 'Hard',
          status: 'not_started'
        }
      ],
      relationships: [
        { source: 'node_prereq_1', target: 'node_core', relationLabel: 'provides light energy for' },
        { source: 'node_prereq_2', target: 'node_core', relationLabel: 'serves as cellular site for' },
        { source: 'node_core', target: 'node_sub_1', relationLabel: 'initiates via' },
        { source: 'node_core', target: 'node_sub_2', relationLabel: 'drives downstream' },
        { source: 'node_core', target: 'node_app_1', relationLabel: 'maintains global' },
        { source: 'node_core', target: 'node_app_2', relationLabel: 'directly impacts' },
        { source: 'node_sub_2', target: 'node_adv_1', relationLabel: 'evolves into specialized' }
      ],
      explanations: {
        simpleAnalogy: `Imagine a solar-powered bakery inside plant leaves! The sun provides free electrical energy, water is brought up from the roots, and carbon dioxide gas is taken from the air. The tiny leaf bakers bake delicious glucose sugar cakes for plant energy and release fresh oxygen gas into the air for humans to breathe!`,
        schoolLevel: `${topicTitle} is an endothermic chemical reaction occurring inside plant chloroplasts. Chlorophyll pigment absorbs sunlight, splitting water molecules ($2H_2O \\rightarrow 4H^+ + 4e^- + O_2$). The resulting hydrogen ions and high-energy electrons combine with carbon dioxide ($CO_2$) to synthesize glucose ($C_6H_{12}O_6$), while oxygen gas is released as a vital byproduct.`,
        advancedDeepDive: `The biochemical pathway is partitioned into two distinct phases: 1) Non-cyclic photophosphorylation in the thylakoid membrane where Photosystem II (P680) and Photosystem I (P700) absorb photons to generate a proton motive force driving ATP synthase and NADPH production. 2) The Calvin-Benson Cycle in the stroma, where the enzyme RuBisCO catalyzes carbon fixation of RuBP ($5C$) into 3-PGA, subsequently reduced to G3P triose phosphate sugars using ATP and NADPH.`,
        examChecklist: [
          'State the overall balanced chemical equation: $6CO_2 + 6H_2O + \\text{light} \\rightarrow C_6H_{12}O_6 + 6O_2$.',
          'Identify the exact organelle location: Chloroplasts (Thylakoids for light phase, Stroma for dark phase).',
          'Explain the role of RuBisCO as the primary enzyme catalyzing carbon fixation.',
          'Differentiate between Light-dependent (produces ATP/NADPH + O2 byproduct) and Light-independent phases (uses ATP/NADPH to make glucose).'
        ]
      },
      whyAndHow: {
        whyExists: `Without ${topicTitle}, solar energy striking Earth would dissipate purely as thermal heat. Plants evolved this mechanism over 2.5 billion years ago (the Great Oxidation Event) to capture kinetic light quanta and store them as stable chemical bonds, building the base energy pyramid for all terrestrial aerobic life.`,
        howItWorks: `1. Light Photons strike Chlorophyll pigments in Thylakoid membranes.\n2. Photolysis splits $H_2O$, freeing $O_2$ gas and energizing electrons.\n3. Electron Transport Chain pumps $H^+$ protons generating ATP & NADPH.\n4. RuBisCO fixes $CO_2$ into 3-carbon molecules inside the Stroma.\n5. ATP and NADPH reduce these molecules into glucose sugar.`,
        keyPrinciples: [
          'Law of Conservation of Energy: Photons → Chemical Bonds',
          'Photolysis of Water generates atmospheric Oxygen',
          'Enzyme RuBisCO rate-limits Carbon Fixation efficiency',
          'Light Intensity, $CO_2$ concentration, and Temperature act as limiting factors'
        ]
      },
      realWorldExamples: [
        {
          title: 'Solar Panels vs Plant Leaves',
          scenario: 'Comparing photovoltaic solar panels to living leaves.',
          visualDescription: 'A glowing solar panel next to a detailed green leaf cross-section.',
          practicalImpact: 'Engineers use biomimicry from photosynthesis to design artificial solar-fuel cells.'
        },
        {
          title: 'Greenhouses & Yield Control',
          scenario: 'Farmers pumping $CO_2$ and artificial LED grow lights inside commercial greenhouses.',
          visualDescription: 'Bright red and blue LED lights illuminating strawberry hydroponic beds.',
          practicalImpact: 'Increases photosynthesis rate by 300%, enabling year-round food cultivation.'
        }
      ],
      misconceptions: [
        {
          myth: 'Plants perform photosynthesis during the day and do NOT respire at all.',
          fact: 'Plants respire continuously 24/7 (day and night).',
          explanation: 'Photosynthesis occurs during sunlight hours to store energy, but cellular respiration in mitochondria runs non-stop to break down sugars for cellular maintenance.'
        },
        {
          myth: 'Dark reactions (Calvin Cycle) can only happen at night in pitch darkness.',
          fact: 'Dark reactions usually happen during the daytime alongside light reactions.',
          explanation: 'They are called "light-independent" because they do not directly absorb photons, but they require the ATP and NADPH actively synthesized during daylight!'
        }
      ],
      keyTerms: [
        { term: 'Chloroplast', definition: 'The double-membraned organelle in plant cells where photosynthesis occurs.', pronunciation: 'KLOR-uh-plast' },
        { term: 'Chlorophyll', definition: 'Green pigment that absorbs red and blue light wavelengths while reflecting green light.', pronunciation: 'KLOR-uh-fill' },
        { term: 'Thylakoid', definition: 'Flattened saclike membranes inside chloroplasts where light reactions take place.', pronunciation: 'THY-luh-koyd' },
        { term: 'RuBisCO', definition: 'Ribulose-1,5-bisphosphate carboxylase-oxygenase, the enzyme responsible for fixing atmospheric CO2.', pronunciation: 'roo-BIS-koh' }
      ],
      quizQuestions: [
        {
          id: 'q1',
          question: 'Where do the light-dependent reactions of photosynthesis take place within a plant cell?',
          options: [
            'In the outer mitochondrial membrane',
            'Inside the thylakoid membranes of chloroplasts',
            'In the stroma fluid of chloroplasts',
            'Inside the cell nucleus'
          ],
          correctIndex: 1,
          explanation: 'Light-dependent reactions occur in the thylakoid membranes where chlorophyll pigments and the electron transport chain are embedded.'
        },
        {
          id: 'q2',
          question: 'What is the primary source of oxygen gas ($O_2$) released during photosynthesis?',
          options: [
            'The breakdown of Carbon Dioxide ($CO_2$)',
            'The photolysis (splitting) of Water ($H_2O$)',
            'The breakdown of Glucose ($C_6H_{12}O_6$)',
            'Cellular respiration in mitochondria'
          ],
          correctIndex: 1,
          explanation: 'Light energy splits water molecules ($H_2O$) in photolysis, releasing oxygen gas as a byproduct.'
        }
      ]
    };
  }
}
