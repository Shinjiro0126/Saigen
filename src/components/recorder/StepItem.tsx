import { Camera, Check, X } from "lucide-react";
import type { TestStep } from "../../types";

interface StepItemProps {
  step: TestStep;
  isRecording: boolean;
  onStatusChange: (step: TestStep, status: string) => void;
  onScreenshot: (step: TestStep) => void;
}

const statusStyle = {
  pending: "text-gray-500 bg-gray-800 border-gray-700",
  passed: "text-green-400 bg-green-900/30 border-green-700/50",
  failed: "text-red-400 bg-red-900/30 border-red-700/50",
} as const;

export function StepItem({ step, isRecording, onStatusChange, onScreenshot }: StepItemProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5">
      <span className="text-xs text-gray-600 tabular-nums w-5 shrink-0 text-right">
        {step.step_number}
      </span>
      <span className="flex-1 text-sm text-white truncate">{step.description}</span>

      {step.screenshot && (
        <span className="text-xs text-gray-500 truncate max-w-[100px]" title={step.screenshot}>
          📷 {step.screenshot}
        </span>
      )}

      {isRecording && (
        <>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onStatusChange(step, "passed")}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${
                step.status === "passed"
                  ? statusStyle.passed
                  : "text-gray-500 border-gray-700 hover:border-green-700/50 hover:text-green-400"
              }`}
            >
              <Check size={11} />
              合格
            </button>
            <button
              onClick={() => onStatusChange(step, "failed")}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${
                step.status === "failed"
                  ? statusStyle.failed
                  : "text-gray-500 border-gray-700 hover:border-red-700/50 hover:text-red-400"
              }`}
            >
              <X size={11} />
              不合格
            </button>
          </div>
          <button
            onClick={() => onScreenshot(step)}
            title="スクリーンショット撮影"
            className="p-1.5 text-gray-500 hover:text-indigo-400 hover:bg-gray-800 rounded transition-colors shrink-0"
          >
            <Camera size={14} />
          </button>
        </>
      )}

      {!isRecording && (
        <span className={`px-2 py-0.5 rounded text-xs border ${statusStyle[step.status]}`}>
          {step.status === "passed" ? "合格" : step.status === "failed" ? "不合格" : "未"}
        </span>
      )}
    </div>
  );
}
