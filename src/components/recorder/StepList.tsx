import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { StepItem } from "./StepItem";
import type { TestStep } from "../../types";

interface StepListProps {
  steps: TestStep[];
  isRecording: boolean;
  onAddStep: (description: string) => Promise<TestStep | null>;
  onStatusChange: (step: TestStep, status: string) => void;
  onScreenshot: (step: TestStep) => void;
}

export function StepList({
  steps,
  isRecording,
  onAddStep,
  onStatusChange,
  onScreenshot,
}: StepListProps) {
  const [inputOpen, setInputOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputOpen) inputRef.current?.focus();
  }, [inputOpen]);

  const handleAdd = async () => {
    if (!description.trim()) return;
    setAdding(true);
    try {
      await onAddStep(description.trim());
      setDescription("");
      setInputOpen(false);
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") {
      setInputOpen(false);
      setDescription("");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-400">
          ステップ
          {steps.length > 0 && (
            <span className="ml-1.5 text-gray-600">({steps.length})</span>
          )}
        </h2>
      </div>

      <div className="space-y-2 mb-3">
        {steps.length === 0 && !inputOpen && (
          <p className="text-sm text-gray-600 py-4 text-center">
            ステップを追加してテスト内容を記録しましょう。
          </p>
        )}
        {steps.map((step) => (
          <StepItem
            key={step.id}
            step={step}
            isRecording={isRecording}
            onStatusChange={onStatusChange}
            onScreenshot={onScreenshot}
          />
        ))}
      </div>

      {isRecording && (
        <>
          {inputOpen ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ステップの説明を入力... (Enter で追加)"
                className="flex-1 bg-gray-800 border border-indigo-500 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none"
              />
              <button
                onClick={handleAdd}
                disabled={adding || !description.trim()}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                {adding ? "追加中..." : "追加"}
              </button>
              <button
                onClick={() => { setInputOpen(false); setDescription(""); }}
                className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 text-sm rounded-lg transition-colors"
              >
                キャンセル
              </button>
            </div>
          ) : (
            <button
              onClick={() => setInputOpen(true)}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-500 hover:text-white hover:bg-gray-800 border border-dashed border-gray-700 hover:border-gray-600 rounded-lg transition-colors"
            >
              <Plus size={15} />
              ステップを追加
            </button>
          )}
        </>
      )}
    </div>
  );
}
