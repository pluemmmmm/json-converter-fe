import React, { useState, useRef } from "react";
import { Copy, Check, Download, Upload, FileText, X } from "lucide-react";

interface EditorPanelProps {
  title: string;
  badge?: string;
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  isOutput?: boolean;
  fileName?: string | null;
  onClearFile?: () => void;
  onFileUpload?: (file: File) => void;
  onExport?: () => boolean | void;
  exportLabel?: string;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  title,
  badge,
  value,
  onChange,
  readOnly = false,
  placeholder,
  isOutput = false,
  fileName,
  onClearFile,
  onFileUpload,
  onExport,
  exportLabel = "Export",
}) => {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportClick = () => {
    if (!value || !onExport) return;
    const ok = onExport();
    if (ok !== false) {
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isOutput || !onFileUpload) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (isOutput || !onFileUpload) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isOutput || !onFileUpload) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col bg-slate-900/80 border rounded-xl overflow-hidden shadow-xl transition-colors ${
        isDragging ? "border-blue-500 bg-blue-950/20" : "border-slate-800"
      }`}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && !isOutput && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-xs border-2 border-dashed border-blue-500 rounded-xl flex flex-col items-center justify-center gap-2 p-6 pointer-events-none">
          <div className="p-3 bg-blue-500/15 rounded-full border border-blue-500/30 animate-bounce">
            <Upload size={32} className="text-blue-400" />
          </div>
          <p className="text-sm font-semibold text-slate-100">Drop your JSON file here</p>
          <p className="text-xs text-blue-400">Supports .json files</p>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-medium text-slate-400 min-h-[44px]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">{title}</span>
          {!isOutput && fileName && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/60 text-blue-300 text-[11px] font-mono">
              <FileText size={11} className="text-blue-400" />
              <span className="max-w-[140px] truncate" title={fileName}>
                {fileName}
              </span>
              {onClearFile && (
                <button
                  type="button"
                  onClick={onClearFile}
                  title="Remove file"
                  className="hover:text-red-400 ml-0.5"
                >
                  <X size={10} />
                </button>
              )}
            </span>
          )}
        </div>

        {isOutput ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!value}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition"
              title="Copy to clipboard"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>

            {onExport && (
              <button
                type="button"
                onClick={handleExportClick}
                disabled={!value}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 disabled:opacity-40 transition"
                title={`Export as ${exportLabel}`}
              >
                {exported ? <Check size={12} className="text-emerald-400" /> : <Download size={12} />}
                {exported ? "Exported!" : exportLabel}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {onFileUpload && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 hover:border-blue-500/50 hover:text-white transition"
                  title="Upload JSON file from your device"
                >
                  <Upload size={12} className="text-blue-400" />
                  <span>Upload JSON</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
            {!fileName && (
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                {badge || "Paste raw JSON"}
              </span>
            )}
          </div>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`flex-1 w-full p-4 bg-transparent font-mono text-xs md:text-sm resize-none focus:outline-none placeholder-slate-600 ${
          isOutput ? "text-emerald-400" : "text-slate-200"
        }`}
        rows={18}
      />
    </div>
  );
};
