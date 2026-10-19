"use client";

import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 1000,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Animate progress bar to 100%
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 50);

    // Trigger fade-out shortly before completion
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, Math.max(durationMs - 200, 700));

    // Finish splash
    const endTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, durationMs);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [durationMs, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-300 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -translate-y-12" />

      {/* Center Brand */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-teal-300 bg-clip-text text-transparent mb-2">
          JSON Converter Studio
        </h1>

        <p className="text-sm text-slate-400 font-medium mb-8">
          Next-Gen Data Conversion Studio
        </p>

        {/* Progress Bar (Animates in exactly 1s) */}
        <div className="w-56 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-800 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-teal-400 rounded-full transition-all ease-out"
            style={{
              width: `${progress}%`,
              transitionDuration: `${durationMs}ms`,
            }}
          />
        </div>

        <span className="text-[11px] text-slate-500 mt-3 font-mono">
          Starting Studio...
        </span>
      </div>
    </div>
  );
};
