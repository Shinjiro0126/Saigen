import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList, Plus } from "lucide-react";
import { useSuiteStore } from "../store/suiteStore";
import { useTestCaseStore } from "../store/testCaseStore";
import { CaseRow } from "../components/cases/CaseRow";
import { CaseForm } from "../components/cases/CaseForm";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import type { TestCase } from "../types";

export function Cases() {
  const { projectId, suiteId } = useParams<{ projectId: string; suiteId: string }>();
  const navigate = useNavigate();
  const { suites, fetchSuites } = useSuiteStore();
  const { cases, isLoading, fetchCases, createCase, updateCase, deleteCase } =
    useTestCaseStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TestCase | null>(null);

  const suite = suites.find((s) => s.id === suiteId);

  useEffect(() => {
    if (projectId && suites.length === 0) fetchSuites(projectId);
  }, [projectId, suites.length, fetchSuites]);

  useEffect(() => {
    if (suiteId) fetchCases(suiteId);
  }, [suiteId, fetchCases]);

  const handleEdit = (c: TestCase) => {
    setEditing(c);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (name: string, description: string, priority: string, url: string) => {
    if (editing) {
      await updateCase(editing.id, name, description, priority, url);
    } else if (suiteId) {
      await createCase(suiteId, name, description, priority, url);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/projects/${projectId}/suites`)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-0.5">テストスイート</div>
          <h1 className="text-2xl font-bold text-white truncate">
            {suite?.name ?? "..."}
          </h1>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} />
          テストケースを作成
        </Button>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-sm">読み込み中...</div>
      ) : cases.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={48} />}
          title="テストケースがありません"
          description="テストケースを作成して、手動テストを記録しましょう。"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus size={16} />
              最初のテストケースを作成
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {cases.map((c) => (
            <CaseRow
              key={c.id}
              testCase={c}
              onEdit={handleEdit}
              onDelete={deleteCase}
            />
          ))}
        </div>
      )}

      <CaseForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
