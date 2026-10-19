import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, RefreshCw, Trash2, Upload, Download } from "lucide-react";
import { FormatType } from "@/types/converter";

interface FormatSelectorProps {
  currentFormat: FormatType;
  onSelectFormat: (format: FormatType) => void;
  onConvert: () => void;
  onClear: () => void;
  isLoading: boolean;
  onFileUpload?: (file: File) => void;
  onExport?: () => void;
  hasOutput?: boolean;
}

const AVAILABLE_FORMATS: FormatType[] = ["csv", "yaml", "xml", "typescript", "sql"];

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  currentFormat,
  onSelectFormat,
  onConvert,
  onClear,
  isLoading,
  onFileUpload,
  onExport,
  hasOutput = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = tabRefs.current[currentFormat];
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [currentFormat]);

  return (
    <div className="max-w-7xl mx-auto w-full mb-4 flex flex-wrap items-center justify-between gap-3">
      {/* Format Tabs with Sliding Active Indicator */}
      <div className="relative flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 select-none overflow-hidden">
        {/* Animated Sliding Background Indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-lg bg-blue-600 shadow-md shadow-blue-500/25 transition-all duration-200 ease-out pointer-events-none"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.width > 0 ? 1 : 0,
          }}
        />

        {AVAILABLE_FORMATS.map((fmt) => (
          <button
            key={fmt}
            ref={(el) => {
              tabRefs.current[fmt] = el;
            }}
            type="button"
            onClick={() => onSelectFormat(fmt)}
            className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors duration-150 cursor-pointer ${
              currentFormat === fmt
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center flex-wrap gap-2">
        <button
          onClick={onClear}
          className="btn-bounce flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/30 border border-slate-800 rounded-lg transition cursor-pointer"
          title="Clear all inputs and outputs"
        >
          <Trash2 size={14} /> Clear
        </button>

        {onFileUpload && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-bounce flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition select-none cursor-pointer"
              title="Upload JSON file from your device"
            >
              <Upload size={14} className="text-blue-400" />
              <span>Upload JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onFileUpload(file);
                }
                e.target.value = "";
              }}
            />
          </>
        )}

        <button
          onClick={() => onConvert()}
          disabled={isLoading}
          className="btn-bounce flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
          Convert to {currentFormat.toUpperCase()}
        </button>

        {hasOutput && onExport && (
          <button
            onClick={onExport}
            className="btn-bounce flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg shadow-lg shadow-emerald-600/25 border border-emerald-500/40 transition cursor-pointer"
            title={`Export as ${currentFormat.toUpperCase()}`}
          >
            <Download size={15} />
            Export {currentFormat.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  );
};
