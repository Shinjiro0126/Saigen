import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useTestCaseStore } from "../store/testCaseStore";
import { useRecorder } from "../hooks/useRecorder";
import { RecordingBar } from "../components/recorder/RecordingBar";
import { StepList } from "../components/recorder/StepList";
import { EndRunDialog } from "../components/recorder/EndRunDialog";
import { Button } from "../components/ui/Button";
import { openUrl } from "../lib/commands";

export function Recorder() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { cases } = useTestCaseStore();
  const testCase = cases.find((c) => c.id === caseId) ?? null;

  const {
    run,
    steps,
    elapsed,
    isRecording,
    isLoading,
    start,
    addStep,
    changeStatus,
    takeScreenshotForStep,
    end,
    abort,
  } = useRecorder(testCase);

  const [endDialogOpen, setEndDialogOpen] = useState(false);

  const handleEnd = async (status: string, notes: string) => {
    const updated = await end(status, notes);
    setEndDialogOpen(false);
    if (updated) navigate(`/runs/${updated.id}`);
  };

  const handleAbort = async () => {
    if (!window.confirm("録音を中断しますか？操作ログは破棄されます。")) return;
    await abort();
  };

  if (!testCase) {
    return (
      <div className="p-6">
        <p className="text-gray-500 text-sm">
          テストケースが見つかりません。ケース一覧から開き直してください。
        </p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          戻る
        </Button>
      </div>
    );
  }


  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          disabled={isRecording}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-0.5">テスト録音</div>
          <h1 className="text-xl font-bold text-white truncate">{testCase.name}</h1>
        </div>
        {testCase.url && (
          <button
            onClick={() => openUrl(testCase.url)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-indigo-400 hover:text-indigo-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ExternalLink size={14} />
            ブラウザで開く
          </button>
        )}
      </div>

      {/* 録音中: コントロールバー */}
      {isRecording && (
        <RecordingBar
          elapsed={elapsed}
          onEnd={() => setEndDialogOpen(true)}
          onAbort={handleAbort}
        />
      )}

      {/* 未開始 */}
      {!run && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm mb-6">
            録音を開始するとキーボード・マウス操作が記録されます。
            {testCase.url && (
              <span className="block mt-1 text-gray-500">
                開始時に対象URL がブラウザで自動的に開きます。
              </span>
            )}
          </p>
          <Button size="lg" onClick={start} disabled={isLoading}>
            {isLoading ? "準備中..." : "● 録音開始"}
          </Button>
        </div>
      )}

      {/* 録音中: ステップ一覧 */}
      {run && isRecording && (
        <StepList
          steps={steps}
          isRecording
          onAddStep={addStep}
          onStatusChange={changeStatus}
          onScreenshot={takeScreenshotForStep}
        />
      )}

{/* 録音終了ダイアログ */}
      <EndRunDialog
        open={endDialogOpen}
        isLoading={isLoading}
        onClose={() => setEndDialogOpen(false)}
        onSubmit={handleEnd}
      />
    </div>
  );
}
