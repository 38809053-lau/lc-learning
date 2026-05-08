export interface ConflictDiagram {
  D: string;
  DPrime: string;
  B: string;
  C: string;
  A: string;
}

export interface Effect {
  id: string;
  text: string;
  x: number;
  y: number;
}

export interface Connection {
  from: string;
  to: string;
}

export interface RealityTree {
  effects: Effect[];
  connections: Connection[];
  coreProblem: string;
}

export type SolutionType = 'change++' | 'no-change++' | 'conditional' | 'alternative';

export interface Solution {
  id: string;
  type: SolutionType;
  description: string;
  assumptions: string[];
  evaluation: {
    feasibility: number;
    impact: number;
    effort: number;
  };
}

export type ActionCategory = 'gold' | 'crutch' | 'mermaid' | 'crocodile';

export interface ActionItem {
  id: string;
  text: string;
  category: ActionCategory;
  priority: number;
  completed: boolean;
}

export interface TocSession {
  id: string;
  problem: string;
  currentStep: number;
  conflictDiagram: ConflictDiagram | null;
  realityTree: RealityTree | null;
  solutions: Solution[];
  selectedSolution: Solution | null;
  refinedPlan: {
    additionalConnections: Connection[];
    concerns: string[];
    corrections: string[];
  } | null;
  actionItems: ActionItem[];
  createdAt: number;
  updatedAt: number;
}

export interface Concern {
  id: string;
  text: string;
  solution: string;
  addressed: boolean;
}

export const STEPS = [
  { id: 0, name: '问题输入', path: '/', icon: 'Home' },
  { id: 1, name: '冲突图', path: '/conflict', icon: 'Cloud' },
  { id: 2, name: '现状图', path: '/reality', icon: 'GitBranch' },
  { id: 3, name: '双赢方案', path: '/solution', icon: 'Lightbulb' },
  { id: 4, name: '完善方案', path: '/refine', icon: 'Wrench' },
  { id: 5, name: '实施计划', path: '/action', icon: 'Rocket' },
  { id: 6, name: '成果展示', path: '/result', icon: 'Trophy' },
] as const;

export const SOLUTION_TYPES: Record<SolutionType, { name: string; description: string }> = {
  'change++': {
    name: '改变++',
    description: '挑战"D→C"假设，寻找例外，注入新行为'
  },
  'no-change++': {
    name: '不改变++',
    description: '挑战"D\'→B"假设，优化现有行为'
  },
  'conditional': {
    name: '条件改变',
    description: '找出冲突条件，分情况行动'
  },
  'alternative': {
    name: '另一种改变',
    description: '跳出D/D\'，直接满足B和C（最高层次）'
  }
};

export const ACTION_CATEGORIES: Record<ActionCategory, { name: string; color: string }> = {
  gold: { name: '金子（改变的好处）', color: '#10B981' },
  crutch: { name: '拐杖（不改变的坏处）', color: '#F59E0B' },
  mermaid: { name: '美人鱼（不改变的好处）', color: '#6366F1' },
  crocodile: { name: '鳄鱼（改变的坏处）', color: '#EF4444' }
};
