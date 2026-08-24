export type NodeCategory = 'core' | 'prerequisite' | 'subconcept' | 'application' | 'advanced';
export type NodeImportance = 'critical' | 'high' | 'medium';
export type NodeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ConceptNode {
  id: string;
  label: string;
  category: NodeCategory;
  shortDescription: string;
  importance?: NodeImportance;
  difficulty?: NodeDifficulty;
  status?: 'not_started' | 'exploring' | 'mastered';
}

export interface ConceptRelationship {
  source: string;
  target: string;
  relationLabel: string;
}

export interface ConceptExplanations {
  simpleAnalogy: string;
  schoolLevel: string;
  advancedDeepDive: string;
  examChecklist: string[];
}

export interface WhyAndHow {
  whyExists: string;
  howItWorks: string;
  keyPrinciples: string[];
}

export interface RealWorldExample {
  title: string;
  scenario: string;
  visualDescription?: string;
  practicalImpact: string;
}

export interface Misconception {
  myth: string;
  fact: string;
  explanation: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
  pronunciation?: string;
}

export interface ConceptQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ConceptMapData {
  topic: string;
  subject: string;
  gradeLevel: string;
  estimatedMasteryTime?: string;
  oneSentenceOverview: string;
  coreNodeId?: string;
  nodes: ConceptNode[];
  relationships: ConceptRelationship[];
  explanations: ConceptExplanations;
  whyAndHow: WhyAndHow;
  realWorldExamples: RealWorldExample[];
  misconceptions: Misconception[];
  keyTerms: KeyTerm[];
  quizQuestions: ConceptQuizQuestion[];
  isNotebookGrounded?: boolean;
}

export interface ConceptComparison {
  conceptA: string;
  conceptB: string;
  summaryComparison: string;
  similarities: string[];
  keyDifferences: {
    aspect: string;
    conceptAValue: string;
    conceptBValue: string;
  }[];
  commonConfusions: string;
  mnemonicOrTip?: string;
}

export interface ConceptHistoryItem {
  id: string;
  topic: string;
  subject: string;
  gradeLevel: string;
  timestamp: string;
  nodeCount: number;
  overview: string;
}
