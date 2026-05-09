import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, Clock, XCircle, Ban } from "lucide-react";
import { Modal } from "../ui/Modal";
import { runCommands } from "../../lib/commands";
import type { TestCase, TestRun } from "../../types";

interface RunHistoryModalProps {
  open: boolean;
  testCase: TestCase;
  onClose: () => void;
  onStartRecord: () => void;
}

const statusIcon = {
  passed:  <CheckCircle size={14} className="text-green-400 shrink-0" />,
  failed:  <XCircle    size={14} className="text-red-400 shrink-0" />,
  aborted: <Ban        size={14} className="text-gray-500 shrink-0" />,
  running: <Clock      size={14} className="text-yellow-400 shrink-0" />,
} as const;

const statusLabel = { passed: "合格", failed: "不合格", aborted: "中断", running: "実行中" } as const;

function duration(start: string, end: string | null): string {
  if (!end) return "—";
  const s = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}分${s % 60}秒` : `${s}秒`;
}

export function RunHistoryModal({ open, testCase, onClose, onStartRecord }: RunHistoryModalProps) {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    runCommands.list(testCase.id)
      .then(setRuns)
      .finally(() => setLoading(false));
  }, [open, testCase.id]);

  return (
    <Modal open={open} onClose={onClose} title={`実行履歴 — ${testCase.name}`}>
      <div className="space-y-1 max-h-80 overflow-y-auto -mx-1 px-1">
        {loading && (
          <p className="text-sm text-gray-500 text-center py-4">読み込み中...</p>
        )}
        {!loading && runs.length === 0 && (
          <p className="text-sm text-gray-600 text-center py-4">
            まだ実行履歴がありません
          </p>
        )}
        {runs.map((run) => {
          const s = run.status as keyof typeof statusIcon;
          return (
            <button
              key={run.id}
              onClick={() => { onClose(); navigate(`/runs/${run.id}`); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-left"
            >
              {statusIcon[s] ?? statusIcon.running}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white">
                  {statusLabel[s] ?? run.status}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(run.started_at).toLocaleString("ja-JP")} ·{" "}
                  {duration(run.started_at, run.ended_at)}
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-600 shrink-0" />
            </button>
          );
        })}
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-800">
        <button
          onClick={() => { onClose(); onStartRecord(); }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          ● 新しく録音
        </button>
      </div>
    </Modal>
  );
}
