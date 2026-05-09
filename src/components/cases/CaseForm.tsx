import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { TestCase } from "../../types";

interface CaseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, priority: string, url: string) => Promise<void>;
  initial?: TestCase | null;
}

const priorities = [
  { value: "high", label: "高", active: "bg-red-600/30 text-red-300 border-red-600/50", inactive: "bg-gray-800 text-gray-400 border-gray-700" },
  { value: "medium", label: "中", active: "bg-yellow-600/30 text-yellow-300 border-yellow-600/50", inactive: "bg-gray-800 text-gray-400 border-gray-700" },
  { value: "low", label: "低", active: "bg-green-600/30 text-green-300 border-green-600/50", inactive: "bg-gray-800 text-gray-400 border-gray-700" },
] as const;

export function CaseForm({ open, onClose, onSubmit, initial }: CaseFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
    setPriority((initial?.priority as "high" | "medium" | "low") ?? "medium");
    setUrl(initial?.url ?? "");
  }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit(name.trim(), description.trim(), priority, url.trim());
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "テストケースを編集" : "テストケースを作成"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            名前 <span className="text-red-400">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: ログインフロー"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            説明
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="テストの詳細..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            優先度
          </label>
          <div className="flex gap-2">
            {priorities.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  priority === p.value ? p.active : p.inactive
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            テスト対象URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="例: https://example.com/login"
            type="url"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "保存中..." : initial ? "更新" : "作成"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
