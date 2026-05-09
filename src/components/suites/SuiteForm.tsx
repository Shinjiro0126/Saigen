import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { TestSuite } from "../../types";

interface SuiteFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  initial?: TestSuite | null;
}

export function SuiteForm({ open, onClose, onSubmit, initial }: SuiteFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
  }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit(name.trim(), description.trim());
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "スイートを編集" : "スイートを作成"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            名前 <span className="text-red-400">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 認証機能テスト"
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
            placeholder="テストスイートの概要..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none text-sm"
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
