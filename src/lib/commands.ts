import { invoke } from "@tauri-apps/api/core";
import type { TestCase, TestSuite } from "../types";

export const suiteCommands = {
  create: (name: string, description: string) =>
    invoke<TestSuite>("create_suite", { name, description }),

  list: () => invoke<TestSuite[]>("list_suites"),

  update: (id: string, name: string, description: string) =>
    invoke<TestSuite>("update_suite", { id, name, description }),

  delete: (id: string) => invoke<void>("delete_suite", { id }),
};

export const caseCommands = {
  create: (suite_id: string, name: string, description: string, priority: string) =>
    invoke<TestCase>("create_case", { suite_id, name, description, priority }),

  list: (suite_id: string) => invoke<TestCase[]>("list_cases", { suite_id }),

  update: (id: string, name: string, description: string, priority: string) =>
    invoke<TestCase>("update_case", { id, name, description, priority }),

  delete: (id: string) => invoke<void>("delete_case", { id }),
};
