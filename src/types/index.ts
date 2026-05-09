export interface TestSuite {
  id: string;
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
