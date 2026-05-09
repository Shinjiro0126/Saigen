import { Circle, Square } from "lucide-react";
import { Button } from "../ui/Button";

interface RecordingBarProps {
  elapsed: number;
  onEnd: () => void;
  onAbort: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function RecordingBar({ elapsed, onEnd, onAbort }: RecordingBarProps) {
  return (
    <div className="flex items-center gap-4 bg-red-950/30 border border-red-800/40 rounded-xl px-4 py-3 mb-6">
      <span className="flex items-center gap-2 text-red-400 font-medium text-sm">
        <Circle size={9} className="fill-red-400 animate-pulse" />
        録音中
      </span>
      <span className="text-red-300 font-mono text-sm tabular-nums">
        {formatTime(elapsed)}
      </span>
      <div className="flex-1" />
      <Button variant="ghost" size="sm" onClick={onAbort}>
        中断
      </Button>
      <Button variant="danger" size="sm" onClick={onEnd}>
        <Square size={12} />
        録音終了
      </Button>
    </div>
  );
}
