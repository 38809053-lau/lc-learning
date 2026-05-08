import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TocSession, ConflictDiagram, RealityTree, Solution, ActionItem, Effect } from '../types/toc';

export const generateId = () => Math.random().toString(36).substring(2, 11);

interface TocState {
  session: TocSession | null;
  
  setProblem: (problem: string) => void;
  setConflictDiagram: (diagram: ConflictDiagram) => void;
  setRealityTree: (tree: RealityTree) => void;
  addEffect: (effect: Effect) => void;
  updateEffect: (id: string, text: string) => void;
  removeEffect: (id: string) => void;
  addConnection: (from: string, to: string) => void;
  removeConnection: (from: string, to: string) => void;
  setCoreProblem: (problem: string) => void;
  addSolution: (solution: Solution) => void;
  selectSolution: (solution: Solution | null) => void;
  setRefinedPlan: (plan: TocSession['refinedPlan']) => void;
  addActionItem: (item: ActionItem) => void;
  updateActionItem: (id: string, updates: Partial<ActionItem>) => void;
  toggleActionItem: (id: string) => void;
  removeActionItem: (id: string) => void;
  setCurrentStep: (step: number) => void;
  resetSession: () => void;
}

export const useTocStore = create<TocState>()(
  persist(
    (set) => ({
      session: null,

      setProblem: (problem) =>
        set((state) => ({
          session: state.session
            ? { ...state.session, problem, updatedAt: Date.now() }
            : {
                id: generateId(),
                problem,
                currentStep: 1,
                conflictDiagram: null,
                realityTree: null,
                solutions: [],
                selectedSolution: null,
                refinedPlan: null,
                actionItems: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
        })),

      setConflictDiagram: (diagram) =>
        set((state) => ({
          session: state.session
            ? { ...state.session, conflictDiagram: diagram, updatedAt: Date.now() }
            : null,
        })),

      setRealityTree: (tree) =>
        set((state) => ({
          session: state.session
            ? { ...state.session, realityTree: tree, updatedAt: Date.now() }
            : null,
        })),

      addEffect: (effect) =>
        set((state) => {
          if (!state.session?.realityTree) return state;
          return {
            session: {
              ...state.session,
              realityTree: {
                ...state.session.realityTree,
                effects: [...state.session.realityTree.effects, effect],
              },
              updatedAt: Date.now(),
            },
          };
        }),

      updateEffect: (id, text) =>
        set((state) => {
          if (!state.session?.realityTree) return state;
          return {
            session: {
              ...state.session,
              realityTree: {
                ...state.session.realityTree,
                effects: state.session.realityTree.effects.map((e) =>
                  e.id === id ? { ...e, text } : e
                ),
              },
              updatedAt: Date.now(),
            },
          };
        }),

      removeEffect: (id) =>
        set((state) => {
          if (!state.session?.realityTree) return state;
          return {
            session: {
              ...state.session,
              realityTree: {
                ...state.session.realityTree,
                effects: state.session.realityTree.effects.filter((e) => e.id !== id),
                connections: state.session.realityTree.connections.filter(
                  (c) => c.from !== id && c.to !== id
                ),
              },
              updatedAt: Date.now(),
            },
          };
        }),

      addConnection: (from, to) =>
        set((state) => {
          if (!state.session?.realityTree) return state;
          const exists = state.session.realityTree.connections.some(
            (c) => c.from === from && c.to === to
          );
          if (exists) return state;
          return {
            session: {
              ...state.session,
              realityTree: {
                ...state.session.realityTree,
                connections: [...state.session.realityTree.connections, { from, to }],
              },
              updatedAt: Date.now(),
            },
          };
        }),

      removeConnection: (from, to) =>
        set((state) => {
          if (!state.session?.realityTree) return state;
          return {
            session: {
              ...state.session,
              realityTree: {
                ...state.session.realityTree,
                connections: state.session.realityTree.connections.filter(
                  (c) => !(c.from === from && c.to === to)
                ),
              },
              updatedAt: Date.now(),
            },
          };
        }),

      setCoreProblem: (problem) =>
        set((state) => {
          if (!state.session?.realityTree) return state;
          return {
            session: {
              ...state.session,
              realityTree: {
                ...state.session.realityTree,
                coreProblem: problem,
              },
              updatedAt: Date.now(),
            },
          };
        }),

      addSolution: (solution) =>
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                solutions: [...state.session.solutions, solution],
                updatedAt: Date.now(),
              }
            : null,
        })),

      selectSolution: (solution) =>
        set((state) => ({
          session: state.session
            ? { ...state.session, selectedSolution: solution, updatedAt: Date.now() }
            : null,
        })),

      setRefinedPlan: (plan) =>
        set((state) => ({
          session: state.session
            ? { ...state.session, refinedPlan: plan, updatedAt: Date.now() }
            : null,
        })),

      addActionItem: (item) =>
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                actionItems: [...state.session.actionItems, item],
                updatedAt: Date.now(),
              }
            : null,
        })),

      updateActionItem: (id, updates) =>
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                actionItems: state.session.actionItems.map((item) =>
                  item.id === id ? { ...item, ...updates } : item
                ),
                updatedAt: Date.now(),
              }
            : null,
        })),

      toggleActionItem: (id) =>
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                actionItems: state.session.actionItems.map((item) =>
                  item.id === id ? { ...item, completed: !item.completed } : item
                ),
                updatedAt: Date.now(),
              }
            : null,
        })),

      removeActionItem: (id) =>
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                actionItems: state.session.actionItems.filter((item) => item.id !== id),
                updatedAt: Date.now(),
              }
            : null,
        })),

      setCurrentStep: (step) =>
        set((state) => ({
          session: state.session
            ? { ...state.session, currentStep: step, updatedAt: Date.now() }
            : null,
        })),

      resetSession: () => set({ session: null }),
    }),
    {
      name: 'toc-storage',
    }
  )
);
