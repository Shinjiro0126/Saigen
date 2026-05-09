import { useEffect, useState } from "react";
import { Layers, Plus } from "lucide-react";
import { useProjectStore } from "../store/projectStore";
import { ProjectCard } from "../components/projects/ProjectCard";
import { ProjectForm } from "../components/projects/ProjectForm";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import type { Project } from "../types";

export function Projects() {
  const { projects, isLoading, fetchProjects, createProject, updateProject, deleteProject } =
    useProjectStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleEdit = (project: Project) => {
    setEditing(project);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (name: string, description: string) => {
    if (editing) {
      await updateProject(editing.id, name, description);
    } else {
      await createProject(name, description);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">プロジェクト</h1>
          <p className="text-sm text-gray-500 mt-1">{projects.length}件</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} />
          プロジェクトを作成
        </Button>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-sm">読み込み中...</div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<Layers size={48} />}
          title="プロジェクトがありません"
          description="プロジェクトを作成して、テストスイートを整理しましょう。"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus size={16} />
              最初のプロジェクトを作成
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}

      <ProjectForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
