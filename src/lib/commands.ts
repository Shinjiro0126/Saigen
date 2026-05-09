import { invoke } from "@tauri-apps/api/core";
import type { Project, TestCase, TestSuite } from "../types";

const isTauri = () =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

function call<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  if (!isTauri()) return Promise.resolve([] as unknown as T);
  return invoke<T>(command, args);
}

export const projectCommands = {
  create: (name: string, description: string) =>
    invoke<Project>("create_project", { name, description }),

  list: () => call<Project[]>("list_projects"),

  update: (id: string, name: string, description: string) =>
    invoke<Project>("update_project", { id, name, description }),

  delete: (id: string) => invoke<void>("delete_project", { id }),
};

export const suiteCommands = {
  create: (project_id: string, name: string, description: string) =>
    invoke<TestSuite>("create_suite", { project_id, name, description }),

  list: (project_id: string) =>
    call<TestSuite[]>("list_suites", { project_id }),

  update: (id: string, name: string, description: string) =>
    invoke<TestSuite>("update_suite", { id, name, description }),

  delete: (id: string) => invoke<void>("delete_suite", { id }),
};

export const caseCommands = {
  create: (
    suite_id: string,
    name: string,
    description: string,
    priority: string,
    url: string
  ) =>
    invoke<TestCase>("create_case", { suite_id, name, description, priority, url }),

  list: (suite_id: string) => call<TestCase[]>("list_cases", { suite_id }),

  update: (
    id: string,
    name: string,
    description: string,
    priority: string,
    url: string
  ) =>
    invoke<TestCase>("update_case", { id, name, description, priority, url }),

  delete: (id: string) => invoke<void>("delete_case", { id }),
};

export const openUrl = (url: string) =>
  isTauri() ? invoke<void>("open_url", { url }) : Promise.resolve();
