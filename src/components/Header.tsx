import React from "react";
import { FileCode, Server, User, LogOut } from "lucide-react";

interface HeaderProps {
  useBackend: boolean;
  onToggleBackend: (val: boolean) => void;
  currentUser?: string | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  useBackend,
  onToggleBackend,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="max-w-7xl mx-auto w-full mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
          <FileCode className="text-blue-400" /> JSON Converter Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Next.js + TypeScript + Tailwind | Clean Architecture | Golang Engine
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        {currentUser && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <div className="w-5 h-5 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300">
              <User size={12} />
            </div>
            <span className="text-slate-300 font-medium">{currentUser}</span>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="ml-1 text-slate-500 hover:text-red-400 transition"
                title="Sign out"
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Server size={14} className={useBackend ? "text-emerald-400" : "text-slate-500"} />
            <input
              type="checkbox"
              checked={useBackend}
              onChange={(e) => onToggleBackend(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0"
            />
            <span className={useBackend ? "text-emerald-300 font-medium" : "text-slate-400"}>
              {useBackend ? "Go Engine (:8080)" : "Browser Client"}
            </span>
          </label>
        </div>
      </div>
    </header>
  );
};
