import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface EndRunDialogProps {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (status: string, notes: string) => Promise<void>;
}

export function EndRunDialog({ open, isLoading, onClose, onSubmit }: EndRunDialogProps) {
  const [status, setStatus] = useState<"passed" | "failed">("passed");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    await onSubmit(status, notes.trim());
    setNotes("");
    setStatus("passed");
  };

  return (
    <Modal open={open} onClose={onClose} title="録音を終了">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            テスト結果
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setStatus("passed")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                status === "passed"
                  ? "bg-green-900/40 text-green-300 border-green-700/50"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-green-700/40"
              }`}
            >
              ✓ 合格
            </button>
            <button
              onClick={() => setStatus("failed")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                status === "failed"
                  ? "bg-red-900/40 text-red-300 border-red-700/50"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-red-700/40"
              }`}
            >
              ✗ 不合格
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            メモ（任意）
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="気づいた点・バグの詳細など..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none text-sm"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "保存中..." : "保存して終了"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
