import { create } from "zustand";
import { suiteCommands } from "../lib/commands";
import type { TestSuite } from "../types";

interface SuiteStore {
  suites: TestSuite[];
  isLoading: boolean;
  fetchSuites: () => Promise<void>;
  createSuite: (name: string, description: string) => Promise<void>;
  updateSuite: (id: string, name: string, description: string) => Promise<void>;
  deleteSuite: (id: string) => Promise<void>;
}

export const useSuiteStore = create<SuiteStore>((set) => ({
  suites: [],
  isLoading: false,

  fetchSuites: async () => {
    set({ isLoading: true });
    try {
      const suites = await suiteCommands.list();
      set({ suites });
    } finally {
      set({ isLoading: false });
    }
  },

  createSuite: async (name, description) => {
    const suite = await suiteCommands.create(name, description);
    set((state) => ({ suites: [suite, ...state.suites] }));
  },

  updateSuite: async (id, name, description) => {
    const updated = await suiteCommands.update(id, name, description);
    set((state) => ({
      suites: state.suites.map((s) => (s.id === id ? updated : s)),
    }));
  },

  deleteSuite: async (id) => {
    await suiteCommands.delete(id);
    set((state) => ({ suites: state.suites.filter((s) => s.id !== id) }));
  },
}));
