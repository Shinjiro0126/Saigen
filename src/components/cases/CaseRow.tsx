import { useState } from "react";
import { ExternalLink, History, Pencil, Play, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { RunHistoryModal } from "../runs/RunHistoryModal";
import { openUrl } from "../../lib/commands";
import type { TestCase } from "../../types";

interface CaseRowProps {
  testCase: TestCase;
  onEdit: (testCase: TestCase) => void;
  onDelete: (id: string) => void;
}

const priorityLabel = { high: "高", medium: "中", low: "低" } as const;

export function CaseRow({ testCase, onEdit, onDelete }: CaseRowProps) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-colors group">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">{testCase.name}</span>
            <Badge variant={testCase.priority}>
              {priorityLabel[testCase.priority]}
            </Badge>
          </div>
          {testCase.description && (
            <p className="text-sm text-gray-500 mt-0.5 truncate">{testCase.description}</p>
          )}
          {testCase.url && (
            <button
              onClick={() => openUrl(testCase.url)}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-0.5 truncate max-w-full"
            >
              <ExternalLink size={11} className="shrink-0" />
              <span className="truncate">{testCase.url}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-xs transition-colors"
            title="実行履歴"
          >
            <History size={13} />
            履歴
          </button>
          <button
            onClick={() => navigate(`/cases/${testCase.id}/record`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-lg text-xs font-medium transition-colors"
          >
            <Play size={12} />
            実行
          </button>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-1">
            <button
              onClick={() => onEdit(testCase)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <RunHistoryModal
        open={historyOpen}
        testCase={testCase}
        onClose={() => setHistoryOpen(false)}
        onStartRecord={() => navigate(`/cases/${testCase.id}/record`)}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="テストケースを削除"
        description={`「${testCase.name}」を削除しますか？関連する実行データもすべて削除されます。`}
        onConfirm={() => { onDelete(testCase.id); setConfirmOpen(false); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
