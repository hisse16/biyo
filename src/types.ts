export type AppTab = 'home' | 'explore' | 'photosynthesis' | 'simulation' | 'questions';

// Keşfet alt adımları
export type ExploreStep = 'cell' | 'chloroplast_anatomy' | 'two_regions';

// Fotosentez alt adımları
export type PhotosynthesisView = 'big_picture' | 'light_reactions' | 'calvin_cycle' | 'steps';

export interface CellOrganelle {
  id: string;
  name: string;
  role: string;
  isChloroplast?: boolean;
}

export interface ChloroplastPart {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  location: string;
  reactionType: 'light' | 'calvin' | 'structure';
}

export interface SimulationParams {
  light: number; // 0 to 100
  water: number; // 0 to 100
  co2: number;   // 0 to 100
  speed: 'slow' | 'normal' | 'fast';
  showElectrons: boolean;
  showProtons: boolean;
}

export interface QuestionItem {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correctKey: string;
  explanation: string;
}

export interface ExperimentScenario {
  id: string;
  name: string;
  description: string;
  light: number;
  water: number;
  co2: number;
  expectedRate: 'Düşük' | 'Orta' | 'Yüksek';
  limitingFactor: string;
  explanation: string;
}

export interface ProcessStep {
  id: number;
  title: string;
  focusArea: 'light_source' | 'ps2' | 'photolysis' | 'ets' | 'atp_synthase' | 'ps1' | 'nadph' | 'calvin' | 'glucose';
  description: string;
}
