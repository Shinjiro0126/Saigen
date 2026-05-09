import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Layers, Plus, XCircle, Ban } from "lucide-react";
import { statsCommands } from "../lib/commands";
import { Button } from "../components/ui/Button";
import type { AppStats } from "../types";

const statusIcon = {
  passed:  <CheckCircle size={13} className="text-green-400 shrink-0" />,
  failed:  <XCircle    size={13} className="text-red-400 shrink-0" />,
  aborted: <Ban        size={13} className="text-gray-500 shrink-0" />,
} as const;

const statusLabel = { passed: "合格", failed: "不合格", aborted: "中断" } as const;

function passRate(stats: AppStats): string {
  if (stats.run_count === 0) return "—";
  return `${Math.round((stats.passed_count / stats.run_count) * 100)}%`;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AppStats | null>(null);

  useEffect(() => {
    statsCommands.get().then(setStats);
  }, []);

  const s = stats;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">テスト実行の概要</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "プロジェクト", value: s?.project_count ?? "—" },
          { label: "テストケース", value: s?.case_count ?? "—" },
          { label: "実行回数",     value: s?.run_count ?? "—" },
          { label: "合格率",       value: s ? passRate(s) : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* 最近の実行 */}
      {s && s.recent_runs.length > 0 ? (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-3">最近の実行</h2>
          <div className="space-y-1.5">
            {s.recent_runs.map((run) => {
              const icon = statusIcon[run.status as keyof typeof statusIcon] ?? statusIcon.aborted;
              const label = statusLabel[run.status as keyof typeof statusLabel] ?? run.status;
              return (
                <button
                  key={run.run_id}
                  onClick={() => navigate(`/runs/${run.run_id}`)}
                  className="w-full flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-colors text-left"
                >
                  {icon}
                  <span className="flex-1 text-sm font-medium text-white truncate">
                    {run.case_name}
                  </span>
                  <span className="text-xs text-gray-500 shrink-0">{label}</span>
                  <span className="text-xs text-gray-600 shrink-0">
                    {new Date(run.started_at).toLocaleDateString("ja-JP")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : s && s.project_count === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <Layers size={40} className="text-gray-700 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-300 mb-1">
            プロジェクトがありません
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            プロジェクトを作成してテスト管理を始めましょう。
          </p>
          <Button onClick={() => navigate("/projects")}>
            <Plus size={16} />
            プロジェクトを作成
          </Button>
        </div>
      ) : s ? (
        <div className="text-sm text-gray-600 text-center py-6">
          まだテストが実行されていません
        </div>
      ) : null}
    </div>
  );
}
