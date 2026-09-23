export type AgnesSubject = 
  | 'Physics' 
  | 'Chemistry' 
  | 'Biology' 
  | 'Mathematics' 
  | 'Computer Science' 
  | 'General STEM';

export type AgnesDifficulty = 
  | 'Foundation' 
  | 'High School (CBSE/AP/IB)' 
  | 'Undergraduate' 
  | 'Competitive (JEE/NEET/GATE)' 
  | 'Explain Like I\'m 10';

export type AgnesVisualType = 
  | 'diagram' 
  | 'analogy' 
  | 'formula' 
  | 'simulation' 
  | 'breakdown' 
  | 'comparison';

export type AgnesDiagramType =
  | 'wave_interference'
  | 'relativity_grid'
  | 'chemical_mechanism'
  | 'orbital_hybrid'
  | 'dna_crispr'
  | 'krebs_cycle'
  | 'action_potential'
  | 'fourier_transform'
  | 'attention_matrix'
  | 'limit_epsilon_delta'
  | 'lenz_magnet'
  | 'entropy_box'
  | 'generic_flow';

export interface AgnesQuizCheckpoint {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AgnesCallout {
  title: string;
  text: string;
  type: 'tip' | 'warning' | 'intuition' | 'formula';
}

export interface AgnesScene {
  id: string;
  sceneNumber: number;
  title: string;
  durationSeconds: number;
  agnesNarration: string;
  visualType: AgnesVisualType;
  keyFormulaOrConcept: string;
  chalkboardPoints: string[];
  diagramType: AgnesDiagramType;
  diagramTitle?: string;
  callout?: AgnesCallout;
  quizCheckpoint?: AgnesQuizCheckpoint;
}

export interface AgnesVideo {
  id: string;
  topic: string;
  subject: AgnesSubject;
  title: string;
  hookSentence: string;
  difficulty: AgnesDifficulty;
  estimatedDuration: string;
  totalScenes: number;
  scenes: AgnesScene[];
  summaryTakeaways: string[];
  commonPitfalls: string[];
  examTip: string;
  tags: string[];
  createdAt?: string;
  isBookmarked?: boolean;
}

export interface AgnesGenerationRequest {
  topic: string;
  subject?: AgnesSubject;
  difficulty?: AgnesDifficulty;
  teachingStyle?: 'visual_analogy' | 'rigorous_proof' | 'exam_masterclass';
  sceneCount?: number;
}

export interface AgnesDoubtRequest {
  topic: string;
  currentSceneTitle: string;
  sceneContext: string;
  studentDoubt: string;
}
