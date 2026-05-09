import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, Plus } from "lucide-react";
import { useSuiteStore } from "../store/suiteStore";
import { Button } from "../components/ui/Button";

export function Dashboard() {
  const { suites, fetchSuites } = useSuiteStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuites();
  }, [fetchSuites]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">テスト実行の概要</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-3xl font-bold text-white">{suites.length}</div>
          <div className="text-sm text-gray-400 mt-1">テストスイート</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-3xl font-bold text-white">—</div>
          <div className="text-sm text-gray-400 mt-1">テストケース</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-3xl font-bold text-white">—</div>
          <div className="text-sm text-gray-400 mt-1">実行済みテスト</div>
        </div>
      </div>

      {suites.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <FolderOpen size={40} className="text-gray-700 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-300 mb-1">
            テストスイートがありません
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            テストスイートを作成して記録を開始しましょう。
          </p>
          <Button onClick={() => navigate("/suites")}>
            <Plus size={16} />
            スイートを作成
          </Button>
        </div>
      ) : (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-3">最近のスイート</h2>
          <div className="space-y-2">
            {suites.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/suites/${s.id}/cases`)}
                className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-colors text-left"
              >
                <span className="font-medium text-white text-sm">{s.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(s.created_at).toLocaleDateString("ja-JP")}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
