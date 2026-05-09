import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderOpen } from "lucide-react";

export function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-indigo-600/20 text-indigo-400 font-medium"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      <div className="p-5 border-b border-gray-800">
        <h1 className="text-xl font-bold text-indigo-400">Saigen</h1>
        <p className="text-xs text-gray-500 mt-0.5">再現 · テスト管理</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        <NavLink to="/" end className={linkClass}>
          <LayoutDashboard size={17} />
          ダッシュボード
        </NavLink>
        <NavLink to="/suites" className={linkClass}>
          <FolderOpen size={17} />
          テストスイート
        </NavLink>
      </nav>
    </aside>
  );
}
