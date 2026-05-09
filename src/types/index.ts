export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TestSuite {
  id: string;
  project_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TestCase {
  id: string;
  suite_id: string;
  name: string;
  description: string;
  priority: "high" | "medium" | "low";
  url: string;
  created_at: string;
  updated_at: string;
}

export interface TestRun {
  id: string;
  case_id: string;
  status: "running" | "passed" | "failed" | "aborted";
  started_at: string;
  ended_at: string | null;
  notes: string;
  ops_path: string | null;
  screenshots_dir: string | null;
}

export interface TestStep {
  id: string;
  run_id: string;
  step_number: number;
  description: string;
  status: "pending" | "passed" | "failed";
  screenshot: string | null;
  created_at: string;
}

export interface OperationEvent {
  timestamp: string;
  type: "click" | "keypress" | "scroll";
  x: number | null;
  y: number | null;
  button: string | null;
  key: string | null;
  value: string | null;
  screenshot_ref: string | null;
}
