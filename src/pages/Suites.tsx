import { useEffect, useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
import { useSuiteStore } from "../store/suiteStore";
import { SuiteCard } from "../components/suites/SuiteCard";
import { SuiteForm } from "../components/suites/SuiteForm";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import type { TestSuite } from "../types";

export function Suites() {
  const { suites, isLoading, fetchSuites, createSuite, updateSuite, deleteSuite } =
    useSuiteStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TestSuite | null>(null);

  useEffect(() => {
    fetchSuites();
  }, [fetchSuites]);

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
    } else {
      await createSuite(name, description);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">テストスイート</h1>
          <p className="text-sm text-gray-500 mt-1">{suites.length}件</p>
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
