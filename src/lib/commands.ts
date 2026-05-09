import { invoke } from "@tauri-apps/api/core";
import type { AppStats, OperationEvent, Project, TestCase, TestRun, TestStep, TestSuite } from "../types";

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

export const runCommands = {
  start: (case_id: string) => invoke<TestRun>("start_run", { case_id }),
  end: (run_id: string, status: string, notes: string) =>
    invoke<TestRun>("end_run", { run_id, status, notes }),
  abort: (run_id: string) => invoke<void>("abort_run", { run_id }),
  list: (case_id: string) => call<TestRun[]>("list_runs", { case_id }),
  get: (run_id: string) => invoke<TestRun>("get_run", { run_id }),
  delete: (run_id: string) => invoke<void>("delete_run", { run_id }),
};

export const stepCommands = {
  add: (run_id: string, description: string, status: string) =>
    invoke<TestStep>("add_step", { run_id, description, status }),
  list: (run_id: string) => call<TestStep[]>("list_steps", { run_id }),
  update: (id: string, description: string, status: string, screenshot?: string | null) =>
    invoke<TestStep>("update_step", { id, description, status, screenshot }),
};

export const captureCommands = {
  takeScreenshot: (run_id: string, step_number: number) =>
    invoke<string>("take_screenshot", { run_id, step_number }),
  getOperations: (run_id: string) =>
    call<OperationEvent[]>("get_operations", { run_id }),
  openFolder: (run_id: string) => invoke<void>("open_folder", { run_id }),
};

const emptyStats: AppStats = {
  project_count: 0, suite_count: 0, case_count: 0,
  run_count: 0, passed_count: 0, failed_count: 0, recent_runs: [],
};

export const statsCommands = {
  get: () => isTauri() ? invoke<AppStats>("get_stats") : Promise.resolve(emptyStats),
};

export const openUrl = (url: string) =>
  isTauri() ? invoke<void>("open_url", { url }) : Promise.resolve();
