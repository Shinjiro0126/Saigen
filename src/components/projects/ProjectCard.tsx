import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-600">
          {new Date(project.created_at).toLocaleDateString("ja-JP")}
        </span>
        <button
          onClick={() => navigate(`/projects/${project.id}/suites`)}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          スイートを見る
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
