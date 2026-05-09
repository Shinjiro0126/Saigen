import { useState } from "react";
import { Pencil, Trash2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import type { TestSuite } from "../../types";

interface SuiteCardProps {
  suite: TestSuite;
  projectId: string;
  onEdit: (suite: TestSuite) => void;
  onDelete: (id: string) => void;
}

export function SuiteCard({ suite, projectId, onEdit, onDelete }: SuiteCardProps) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{suite.name}</h3>
            {suite.description && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{suite.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onEdit(suite)}
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
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-600">
            {new Date(suite.created_at).toLocaleDateString("ja-JP")}
          </span>
          <button
            onClick={() => navigate(`/projects/${projectId}/suites/${suite.id}/cases`)}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            テストケースを見る
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="スイートを削除"
        description={`「${suite.name}」を削除しますか？配下のテストケースと実行データもすべて削除されます。`}
        onConfirm={() => { onDelete(suite.id); setConfirmOpen(false); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
