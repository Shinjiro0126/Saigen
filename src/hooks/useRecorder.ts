import { useCallback, useEffect, useState } from "react";
import { captureCommands, openUrl, runCommands, stepCommands } from "../lib/commands";
import type { TestCase, TestRun, TestStep } from "../types";

export function useRecorder(testCase: TestCase | null) {
  const [run, setRun] = useState<TestRun | null>(null);
  const [steps, setSteps] = useState<TestStep[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isRecording = run?.status === "running";

  useEffect(() => {
    if (!isRecording) return;
    setElapsed(0);
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  const start = useCallback(async () => {
    if (!testCase) return;
    setIsLoading(true);
    try {
      const newRun = await runCommands.start(testCase.id);
      setRun(newRun);
      setSteps([]);
      setElapsed(0);
      if (testCase.url) await openUrl(testCase.url);
    } finally {
      setIsLoading(false);
    }
  }, [testCase]);

  const addStep = useCallback(
    async (description: string) => {
      if (!run) return null;
      const step = await stepCommands.add(run.id, description, "pending");
      setSteps((prev) => [...prev, step]);
      return step;
    },
    [run]
  );

  const changeStatus = useCallback(async (step: TestStep, status: string) => {
    const updated = await stepCommands.update(
      step.id,
      step.description,
      status,
      step.screenshot
    );
    setSteps((prev) => prev.map((s) => (s.id === step.id ? updated : s)));
  }, []);

  const takeScreenshotForStep = useCallback(
    async (step: TestStep) => {
      if (!run) return;
      try {
        const filename = await captureCommands.takeScreenshot(run.id, step.step_number);
        const updated = await stepCommands.update(
          step.id,
          step.description,
          step.status,
          filename
        );
        setSteps((prev) => prev.map((s) => (s.id === step.id ? updated : s)));
      } catch (e) {
        console.error("screenshot failed:", e);
      }
    },
    [run]
  );

  const end = useCallback(
    async (status: string, notes: string) => {
      if (!run) return null;
      setIsLoading(true);
      try {
        const updated = await runCommands.end(run.id, status, notes);
        setRun(updated);
        return updated;
      } finally {
        setIsLoading(false);
      }
    },
    [run]
  );

  const abort = useCallback(async () => {
    if (!run) return;
    await runCommands.abort(run.id);
    setRun(null);
    setSteps([]);
    setElapsed(0);
  }, [run]);

  return {
    run,
    steps,
    elapsed,
    isRecording,
    isLoading,
    start,
    addStep,
    changeStatus,
    takeScreenshotForStep,
    end,
    abort,
  };
}
