import { Pencil, Play, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/Badge";
import type { TestCase } from "../../types";

interface CaseRowProps {
  testCase: TestCase;
  onEdit: (testCase: TestCase) => void;
  onDelete: (id: string) => void;
}

const priorityLabel = { high: "高", medium: "中", low: "低" } as const;

export function CaseRow({ testCase, onEdit, onDelete }: CaseRowProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white truncate">{testCase.name}</span>
          <Badge variant={testCase.priority}>
            {priorityLabel[testCase.priority]}
          </Badge>
        </div>
        {testCase.description && (
          <p className="text-sm text-gray-500 mt-0.5 truncate">
            {testCase.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
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
            onClick={() => onDelete(testCase.id)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
