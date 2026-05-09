import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { captureCommands, runCommands, stepCommands } from "../lib/commands";
import { RunSummary } from "../components/runs/RunSummary";
import { ScreenshotGallery } from "../components/runs/ScreenshotGallery";
import { OperationsLog } from "../components/runs/OperationsLog";
import type { OperationEvent, TestRun, TestStep } from "../types";

const stepStatusStyle = {
  pending: "text-gray-500",
  passed:  "text-green-400",
  failed:  "text-red-400",
} as const;

const stepStatusIcon = {
  pending: null,
  passed:  <Check size={12} />,
  failed:  <X size={12} />,
} as const;

export function RunDetail() {
  const { runId } = useParams<{ runId: string }>();
  const navigate = useNavigate();

  const [run, setRun] = useState<TestRun | null>(null);
  const [steps, setSteps] = useState<TestStep[]>([]);
  const [ops, setOps] = useState<OperationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!runId) return;
    (async () => {
      setIsLoading(true);
      try {
        const [r, s, o] = await Promise.all([
          runCommands.get(runId),
          stepCommands.list(runId),
          captureCommands.getOperations(runId),
        ]);
        setRun(r);
        setSteps(s);
        setOps(o);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [runId]);

  if (isLoading) {
    return <div className="p-6 text-gray-500 text-sm">読み込み中...</div>;
  }

  if (!run) {
    return (
      <div className="p-6 text-gray-500 text-sm">実行データが見つかりません。</div>
    );
  }

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="text-xs text-gray-500 mb-0.5">実行詳細</div>
          <h1 className="text-xl font-bold text-white">
            {new Date(run.started_at).toLocaleString("ja-JP")}
          </h1>
        </div>
      </div>

      {/* サマリー */}
      <RunSummary run={run} stepCount={steps.length} />

      {/* ステップ一覧 */}
      {steps.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-medium text-gray-400 mb-3">
            ステップ <span className="text-gray-600">({steps.length})</span>
          </h2>
          <div className="space-y-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5"
              >
                <span className="text-xs text-gray-600 tabular-nums w-5 text-right shrink-0">
                  {step.step_number}
                </span>
                <span className="flex-1 text-sm text-white">{step.description}</span>
                <span
                  className={`flex items-center gap-1 text-xs ${stepStatusStyle[step.status]}`}
                >
                  {stepStatusIcon[step.status]}
                  {step.status === "passed"
                    ? "合格"
                    : step.status === "failed"
                    ? "不合格"
                    : "未"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* スクリーンショット */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-400 mb-3">スクリーンショット</h2>
        <ScreenshotGallery steps={steps} screenshotsDir={run.screenshots_dir} />
      </section>

      {/* 操作ログ */}
      <OperationsLog operations={ops} />
    </div>
  );
}
