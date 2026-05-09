import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FolderOpen, Plus } from "lucide-react";
import { useProjectStore } from "../store/projectStore";
import { useSuiteStore } from "../store/suiteStore";
import { SuiteCard } from "../components/suites/SuiteCard";
import { SuiteForm } from "../components/suites/SuiteForm";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import type { TestSuite } from "../types";

export function Suites() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, fetchProjects } = useProjectStore();
  const { suites, isLoading, fetchSuites, createSuite, updateSuite, deleteSuite } =
    useSuiteStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TestSuite | null>(null);

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, [projects.length, fetchProjects]);

  useEffect(() => {
    if (projectId) fetchSuites(projectId);
  }, [projectId, fetchSuites]);

  const handleEdit = (suite: TestSuite) => {
    setEditing(suite);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (name: string, description: string) => {
    if (editing) {
      await updateSuite(editing.id, name, description);
    } else if (projectId) {
      await createSuite(projectId, name, description);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/projects")}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-0.5">プロジェクト / {project?.name ?? "..."}</div>
          <h1 className="text-2xl font-bold text-white">テストスイート</h1>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} />
          スイートを作成
        </Button>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-sm">読み込み中...</div>
      ) : suites.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={48} />}
          title="スイートがありません"
          description="テストスイートを作成して、テストケースを管理しましょう。"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus size={16} />
              最初のスイートを作成
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suites.map((suite) => (
            <SuiteCard
              key={suite.id}
              suite={suite}
              projectId={projectId!}
              onEdit={handleEdit}
              onDelete={deleteSuite}
            />
          ))}
        </div>
      )}

      <SuiteForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
