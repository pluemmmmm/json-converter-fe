"use client";

import React, { useState, useSyncExternalStore } from "react";
import { TopNav } from "@/components/TopNav";
import { FormatSelector } from "@/components/FormatSelector";
import { EditorPanel } from "@/components/EditorPanel";
import { SplashScreen } from "@/components/SplashScreen";
import { LoginModal } from "@/components/LoginModal";
import { useConverter } from "@/hooks/useConverter";

const getAuthUserSnapshot = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("json_converter_user");
    if (!stored) return null;
    const data = JSON.parse(stored);
    return data?.user || null;
  } catch {
    return null;
  }
};

const getAuthServerSnapshot = (): string | null => null;

const getQuotaSnapshot = (): number => {
  if (typeof window === "undefined") return 24;
  const stored = localStorage.getItem("json_converter_quota");
  if (!stored) return 24;
  const parsed = parseInt(stored, 10);
  return isNaN(parsed) ? 24 : parsed;
};

const getQuotaServerSnapshot = (): number => 24;

const subscribeAuth = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const currentUser = useSyncExternalStore(
    subscribeAuth,
    getAuthUserSnapshot,
    getAuthServerSnapshot
  );
  const quotaUsed = useSyncExternalStore(
    subscribeAuth,
    getQuotaSnapshot,
    getQuotaServerSnapshot
  );

  const {
    jsonInput,
    setJsonInput,
    targetFormat,
    setTargetFormat,
    output,
    error,
    isLoading,
    useBackend,
    setUseBackend,
    uploadedFileName,
    setUploadedFileName,
    handleFileUpload,
    exportOutput,
    convert,
    clear,
  } = useConverter();

  const incrementQuota = () => {
    if (typeof window !== "undefined") {
      const current = getQuotaSnapshot();
      localStorage.setItem("json_converter_quota", String(current + 1));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleResetQuota = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("json_converter_quota", "0");
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleConvert = async () => {
    const res = await convert();
    if (res) {
      incrementQuota();
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("json_converter_user");
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <>
      {/* 1-second Splash Screen on app entry */}
      {showSplash && (
        <SplashScreen durationMs={1000} onFinish={() => setShowSplash(false)} />
      )}

      {/* Auth Modal (Login / Register) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* TopNav Component */}
        <TopNav
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenLogin={() => {
            setAuthModalMode("login");
            setIsLoginModalOpen(true);
          }}
          onOpenRegister={() => {
            setAuthModalMode("register");
            setIsLoginModalOpen(true);
          }}
          useBackend={useBackend}
          onToggleBackend={setUseBackend}
          quotaUsed={quotaUsed}
          quotaLimit={currentUser ? 100 : 25}
          onResetQuota={handleResetQuota}
        />

        <main className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* Toolbar */}
          <FormatSelector
            currentFormat={targetFormat}
            onSelectFormat={setTargetFormat}
            onConvert={handleConvert}
            onClear={clear}
            isLoading={isLoading}
            onFileUpload={(file) => {
              handleFileUpload(file);
              incrementQuota();
            }}
            onExport={exportOutput}
            hasOutput={Boolean(output)}
          />

          {/* Error Alert */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-sm rounded-lg animate-fade-in flex items-center justify-between">
              <span>{error}</span>
            </div>
          )}

          {/* Workspace */}
          <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditorPanel
              title="INPUT: JSON"
              badge="Paste raw JSON"
              value={jsonInput}
              onChange={setJsonInput}
              placeholder="Paste your JSON here or drop a .json file..."
              fileName={uploadedFileName}
              onClearFile={() => setUploadedFileName(null)}
              onFileUpload={handleFileUpload}
            />

            <EditorPanel
              title={`OUTPUT: ${targetFormat.toUpperCase()}`}
              value={output}
              readOnly
              isOutput
              placeholder={`Click 'Convert to ${targetFormat.toUpperCase()}' to view output...`}
              onExport={exportOutput}
              exportLabel={`Export ${targetFormat.toUpperCase()}`}
            />
          </div>
        </main>
      </div>
    </>
  );
}
