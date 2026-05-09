import { CheckCircle, Clock, FolderOpen, XCircle, Ban } from "lucide-react";
import type { TestRun } from "../../types";
import { captureCommands } from "../../lib/commands";

interface RunSummaryProps {
  run: TestRun;
  stepCount: number;
}

const statusConfig = {
  passed:  { icon: CheckCircle, color: "text-green-400", bg: "bg-green-900/20 border-green-700/30", label: "合格" },
  failed:  { icon: XCircle,    color: "text-red-400",   bg: "bg-red-900/20 border-red-700/30",     label: "不合格" },
  aborted: { icon: Ban,        color: "text-gray-400",  bg: "bg-gray-800 border-gray-700",          label: "中断" },
  running: { icon: Clock,      color: "text-yellow-400",bg: "bg-yellow-900/20 border-yellow-700/30",label: "実行中" },
} as const;

function duration(start: string, end: string | null): string {
  if (!end) return "—";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}分${s % 60}秒` : `${s}秒`;
}

export function RunSummary({ run, stepCount }: RunSummaryProps) {
  const cfg = statusConfig[run.status as keyof typeof statusConfig] ?? statusConfig.running;
  const Icon = cfg.icon;

  return (
    <div className={`border rounded-xl p-5 mb-6 ${cfg.bg}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon size={28} className={cfg.color} />
          <div>
            <div className={`text-lg font-bold ${cfg.color}`}>{cfg.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {new Date(run.started_at).toLocaleString("ja-JP")}
            </div>
          </div>
        </div>
        <button
          onClick={() => captureCommands.openFolder(run.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors border border-gray-700"
        >
          <FolderOpen size={13} />
          フォルダを開く
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-black/20 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500 mb-0.5">所要時間</div>
          <div className="text-sm font-medium text-white">
            {duration(run.started_at, run.ended_at)}
          </div>
        </div>
        <div className="bg-black/20 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500 mb-0.5">ステップ数</div>
          <div className="text-sm font-medium text-white">{stepCount} 件</div>
        </div>
      </div>

      {run.notes && (
        <div className="mt-3 bg-black/20 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500 mb-1">メモ</div>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{run.notes}</p>
        </div>
      )}
    </div>
  );
}
