import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Plus } from "lucide-react";
import { useProjectStore } from "../store/projectStore";
import { Button } from "../components/ui/Button";

export function Dashboard() {
  const { projects, fetchProjects } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">テスト実行の概要</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-3xl font-bold text-white">{projects.length}</div>
          <div className="text-sm text-gray-400 mt-1">プロジェクト</div>
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

      {projects.length === 0 ? (
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
      ) : (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-3">プロジェクト一覧</h2>
          <div className="space-y-2">
            {projects.slice(0, 5).map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}/suites`)}
                className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-colors text-left"
              >
                <span className="font-medium text-white text-sm">{p.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(p.created_at).toLocaleDateString("ja-JP")}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
