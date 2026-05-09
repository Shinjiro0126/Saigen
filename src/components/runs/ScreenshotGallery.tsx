import { convertFileSrc } from "@tauri-apps/api/core";
import { ImageOff } from "lucide-react";
import type { TestStep } from "../../types";

interface ScreenshotGalleryProps {
  steps: TestStep[];
  screenshotsDir: string | null;
}

const isTauri = () => typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

export function ScreenshotGallery({ steps, screenshotsDir }: ScreenshotGalleryProps) {
  const stepsWithShots = steps.filter((s) => s.screenshot);

  if (stepsWithShots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 text-sm">
        <ImageOff size={32} className="mx-auto mb-2 opacity-40" />
        スクリーンショットはありません
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stepsWithShots.map((step) => {
        const src =
          isTauri() && screenshotsDir && step.screenshot
            ? convertFileSrc(`${screenshotsDir}/${step.screenshot}`)
            : null;

        return (
          <div key={step.id} className="group relative">
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              {src ? (
                <img
                  src={src}
                  alt={`ステップ ${step.step_number}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <ImageOff size={20} />
                </div>
              )}
            </div>
            <div className="mt-1 text-xs text-gray-500 truncate">
              <span className="text-gray-600">#{step.step_number}</span>{" "}
              {step.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
