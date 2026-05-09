import { create } from "zustand";
import { caseCommands } from "../lib/commands";
import type { TestCase } from "../types";

interface TestCaseStore {
  cases: TestCase[];
  isLoading: boolean;
  fetchCases: (suiteId: string) => Promise<void>;
  createCase: (suiteId: string, name: string, description: string, priority: string) => Promise<void>;
  updateCase: (id: string, name: string, description: string, priority: string) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
}

export const useTestCaseStore = create<TestCaseStore>((set) => ({
  cases: [],
  isLoading: false,

  fetchCases: async (suiteId) => {
    set({ isLoading: true });
    try {
      const cases = await caseCommands.list(suiteId);
      set({ cases });
    } finally {
      set({ isLoading: false });
    }
  },

  createCase: async (suiteId, name, description, priority) => {
    const c = await caseCommands.create(suiteId, name, description, priority);
    set((state) => ({ cases: [c, ...state.cases] }));
  },

  updateCase: async (id, name, description, priority) => {
    const updated = await caseCommands.update(id, name, description, priority);
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? updated : c)),
    }));
  },

  deleteCase: async (id) => {
    await caseCommands.delete(id);
    set((state) => ({ cases: state.cases.filter((c) => c.id !== id) }));
  },
}));
