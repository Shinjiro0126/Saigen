import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { OperationEvent } from "../../types";

interface OperationsLogProps {
  operations: OperationEvent[];
}

const typeLabel: Record<string, string> = {
  click: "クリック",
  keypress: "キー押下",
  scroll: "スクロール",
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const ms = String(Math.floor(d.getMilliseconds() / 100));
  return `${hh}:${mm}:${ss}.${ms}`;
}

function detail(op: OperationEvent): string {
  if (op.type === "click" && op.x != null && op.y != null) {
    return `(${Math.round(op.x)}, ${Math.round(op.y)})  ${op.button ?? ""}`;
  }
  if (op.type === "keypress" && op.key) return op.key;
  if (op.type === "scroll" && op.value) return `Δ ${op.value}`;
  return "—";
}

export function OperationsLog({ operations }: OperationsLogProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800 transition-colors text-sm"
      >
        <span className="font-medium text-gray-300">
          操作ログ
          <span className="ml-2 text-gray-600 font-normal">({operations.length} 件)</span>
        </span>
        {expanded ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="max-h-72 overflow-y-auto">
          {operations.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-600 text-center">
              操作ログがありません
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-950 text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">時刻</th>
                  <th className="text-left px-4 py-2 font-medium">種別</th>
                  <th className="text-left px-4 py-2 font-medium">詳細</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {operations.map((op, i) => (
                  <tr key={i} className="hover:bg-gray-800/30">
                    <td className="px-4 py-1.5 text-gray-500 tabular-nums whitespace-nowrap">
                      {formatTime(op.timestamp)}
                    </td>
                    <td className="px-4 py-1.5 text-gray-300">
                      {typeLabel[op.type] ?? op.type}
                    </td>
                    <td className="px-4 py-1.5 text-gray-400 font-mono">{detail(op)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
