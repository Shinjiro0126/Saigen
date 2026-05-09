import { create } from "zustand";
import { projectCommands } from "../lib/commands";
import type { Project } from "../types";

interface ProjectStore {
  projects: Project[];
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  createProject: (name: string, description: string) => Promise<void>;
  updateProject: (id: string, name: string, description: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await projectCommands.list();
      set({ projects });
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (name, description) => {
    const project = await projectCommands.create(name, description);
    set((state) => ({ projects: [project, ...state.projects] }));
  },

  updateProject: async (id, name, description) => {
    const updated = await projectCommands.update(id, name, description);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
    }));
  },

  deleteProject: async (id) => {
    await projectCommands.delete(id);
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
  },
}));
