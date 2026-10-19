"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FileCode,
  Server,
  User,
  LogIn,
  LogOut,
  UserPlus,
  ChevronDown,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { LoginModal, AuthMode } from "@/components/LoginModal";

interface TopNavProps {
  currentUser?: string | null;
  onLogout?: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  useBackend?: boolean;
  onToggleBackend?: (val: boolean) => void;
  showEngineToggle?: boolean;
  quotaUsed?: number;
  quotaLimit?: number;
  onResetQuota?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentUser,
  onLogout,
  onOpenLogin,
  onOpenRegister,
  useBackend = false,
  onToggleBackend,
  showEngineToggle = true,
  quotaUsed,
  quotaLimit,
  onResetQuota,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [internalModalMode, setInternalModalMode] = useState<AuthMode>("login");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuotaOpen, setIsQuotaOpen] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const quotaRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (quotaRef.current && !quotaRef.current.contains(e.target as Node)) {
        setIsQuotaOpen(false);
      }
    };

    if (isDropdownOpen || isQuotaOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isQuotaOpen]);

  const handleCopyUser = () => {
    if (!currentUser) return;
    navigator.clipboard.writeText(currentUser);
    setCopiedUser(true);
    setTimeout(() => setCopiedUser(false), 1500);
  };

  const handleLoginClick = () => {
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      setInternalModalMode("login");
      setInternalModalOpen(true);
    }
  };

  const handleRegisterClick = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      setInternalModalMode("register");
      setInternalModalOpen(true);
    }
  };

  // Quota Calculations & Styling
  const effectiveQuotaLimit = quotaLimit ?? (currentUser ? 100 : 25);
  const effectiveQuotaUsed = quotaUsed ?? 28;
  const quotaPercent = Math.min(
    100,
    Math.max(0, Math.round((effectiveQuotaUsed / effectiveQuotaLimit) * 100))
  );

  const quotaTextColor =
    quotaPercent >= 90
      ? "text-rose-400"
      : quotaPercent >= 70
      ? "text-amber-400"
      : "text-emerald-400";

  const quotaBarGradient =
    quotaPercent >= 90
      ? "bg-gradient-to-r from-amber-500 to-rose-500"
      : quotaPercent >= 70
      ? "bg-gradient-to-r from-yellow-400 to-amber-500"
      : "bg-gradient-to-r from-teal-400 via-emerald-400 to-blue-500";

  const quotaDotColor =
    quotaPercent >= 90
      ? "bg-rose-500"
      : quotaPercent >= 70
      ? "bg-amber-400"
      : "bg-emerald-400";

  return (
    <>
      <nav className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 md:gap-3 group cursor-pointer select-none">
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-lg md:text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
                  JSON Converter Studio
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] md:text-xs font-mono font-medium bg-blue-950/70 border border-blue-800/60 text-blue-300">
                  v1.0
                </span>
              </div>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 md:gap-3 lg:gap-4">
            {/* Quota Usage Bar Widget (Visible only when logged in) */}
            {currentUser && (
              <div className="relative" ref={quotaRef}>
                <button
                  type="button"
                  onClick={() => setIsQuotaOpen(!isQuotaOpen)}
                  className="btn-bounce flex items-center gap-2 md:gap-2.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl px-2.5 md:px-3 py-1.5 transition-all cursor-pointer shadow-xs group"
                  title="View Quota Usage Details"
                >
                  {/* Icon with pulsing status dot */}
                  <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                    <Zap size={13} className="fill-blue-400/20" />
                    <span
                      className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${quotaDotColor} ring-1.5 ring-slate-950 animate-pulse`}
                    />
                  </div>

                  {/* Bar & Percent */}
                  <div className="flex flex-col gap-0.5 min-w-[75px] sm:min-w-[95px] md:min-w-[115px]">
                    <div className="flex items-center justify-between text-[11px] md:text-xs leading-none">
                      <span className="text-slate-400 font-medium hidden sm:inline">Quota</span>
                      <span className="text-slate-400 font-medium sm:hidden">Used</span>
                      <div className="flex items-center gap-1 font-mono font-bold">
                        <span className={quotaTextColor}>{quotaPercent}%</span>
                        <span className="text-slate-500 font-normal text-[10px] hidden md:inline">
                          ({effectiveQuotaUsed}/{effectiveQuotaLimit})
                        </span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-[0.5px]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${quotaBarGradient}`}
                        style={{ width: `${quotaPercent}%` }}
                      />
                    </div>
                  </div>
                </button>

                {/* Quota Popover Dropdown */}
                {isQuotaOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Popover Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <Zap size={14} />
                        </div>
                        <span className="font-bold text-slate-100 text-xs md:text-sm">Usage Quota</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/25">
                        {currentUser ? "PRO PLAN" : "FREE TIER"}
                      </span>
                    </div>

                    {/* Quota Percentage Metric Display */}
                    <div className="my-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col gap-2">
                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-medium">Daily Conversions</span>
                          <span className="text-lg font-bold font-mono text-slate-100">
                            {effectiveQuotaUsed}{" "}
                            <span className="text-xs text-slate-400 font-normal font-sans">
                              / {effectiveQuotaLimit} ops
                            </span>
                          </span>
                        </div>
                        <span className={`text-xl font-black font-mono ${quotaTextColor}`}>
                          {quotaPercent}%
                        </span>
                      </div>

                      {/* Progress Bar with glow */}
                      <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-[1px]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 shadow-sm ${quotaBarGradient}`}
                          style={{ width: `${quotaPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                        <span>
                          Remaining:{" "}
                          <strong className="text-slate-200 font-mono">
                            {Math.max(0, effectiveQuotaLimit - effectiveQuotaUsed)}
                          </strong>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Resets in 24h</span>
                      </div>
                    </div>

                    {/* Quota Status description */}
                    <div className="text-xs text-slate-400 leading-relaxed mb-2.5">
                      {quotaPercent >= 90 ? (
                        <p className="text-rose-300 flex items-center gap-1.5 text-xs">
                          <AlertCircle size={13} className="shrink-0" />
                          Quota almost exhausted!
                        </p>
                      ) : quotaPercent >= 70 ? (
                        <p className="text-amber-300 flex items-center gap-1.5 text-xs">
                          <AlertCircle size={13} className="shrink-0" />
                          Over 70% of quota used today.
                        </p>
                      ) : (
                        <p className="text-emerald-400/90 flex items-center gap-1.5 text-xs">
                          <Check size={13} className="shrink-0" />
                          Quota usage healthy. Fast conversions active.
                        </p>
                      )}
                    </div>

                    {/* Reset Simulation Button */}
                    {onResetQuota && (
                      <button
                        type="button"
                        onClick={() => {
                          onResetQuota();
                          setIsQuotaOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer border border-slate-700/60"
                      >
                        <RefreshCw size={12} />
                        <span>Reset Quota Counter (Demo)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Engine Toggle */}
            {/*
            {showEngineToggle && onToggleBackend && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-1.5 text-xs md:text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Server
                    size={14}
                    className={useBackend ? "text-emerald-400" : "text-slate-400"}
                  />
                  <input
                    type="checkbox"
                    checked={useBackend}
                    onChange={(e) => onToggleBackend(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0 cursor-pointer"
                  />
                  <span
                    className={
                      useBackend ? "text-emerald-300 font-medium" : "text-slate-300 font-normal"
                    }
                  >
                    {useBackend ? "Go Engine (:8080)" : "Browser Client"}
                  </span>
                </label>
              </div>
            )}

            {/* User / Auth Section */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Split-Capsule */}
                <div className="flex items-center bg-slate-900/95 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-full p-1.5 pl-2.5 shadow-lg shadow-black/30 transition-all">
                  {/* Clickable user trigger for popover */}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 pr-2 group cursor-pointer"
                    title="Account details"
                  >
                    {/* Glowing Gradient Avatar with Online Dot */}
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-teal-400 p-[1.5px] shadow-xs group-hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs text-blue-300 uppercase">
                          {currentUser.charAt(0)}
                        </div>
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-pulse" />
                    </div>

                    {/* Username */}
                    <span className="text-sm md:text-base font-semibold text-slate-100 group-hover:text-white transition max-w-[130px] truncate">
                      {currentUser}
                    </span>

                    {/* Role Tag */}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/25">
                      PRO
                    </span>

                    <ChevronDown
                      size={14}
                      className={`text-slate-400 group-hover:text-slate-200 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Vertical Hairline Divider */}
                  <div className="h-4 w-px bg-slate-800 mx-1" />

                  {/* Direct Quick Logout Button */}
                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="btn-bounce flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/30 transition-all cursor-pointer"
                      title="Sign out"
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  )}
                </div>

                {/* Dropdown Popover Card */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 md:w-72 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 p-[1.5px] shadow-md shadow-blue-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-base text-blue-300 uppercase">
                          {currentUser.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-100 truncate">
                          {currentUser}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs text-slate-400 font-mono">
                            Client Session
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quota Progress Row in Profile */}
                    <div className="mt-2.5 p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                          <Zap size={12} className="text-blue-400" /> Quota Used
                        </span>
                        <span className={`font-mono font-bold text-[11px] ${quotaTextColor}`}>
                          {quotaPercent}% ({effectiveQuotaUsed}/{effectiveQuotaLimit})
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${quotaBarGradient}`}
                          style={{ width: `${quotaPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="py-2.5 space-y-1">
                      <button
                        type="button"
                        onClick={handleCopyUser}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-200 hover:text-white hover:bg-slate-800/70 transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <User size={15} className="text-slate-400" />
                          <span className="font-medium text-xs md:text-sm">Copy Username</span>
                        </span>
                        {copiedUser ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                            <Check size={13} /> Copied!
                          </span>
                        ) : (
                          <Copy size={13} className="text-slate-500" />
                        )}
                      </button>

                      <div className="px-3 py-2 rounded-xl text-sm text-slate-300 flex items-center justify-between bg-slate-950/40 border border-slate-800/40">
                        <span className="flex items-center gap-2.5">
                          <ShieldCheck size={15} className="text-blue-400" />
                          <span className="font-medium text-xs md:text-sm">Status</span>
                        </span>
                        <span className="text-xs text-blue-400 font-mono uppercase font-bold">
                          Authorized
                        </span>
                      </div>
                    </div>

                    {/* Divider & Sign Out */}
                    {onLogout && (
                      <div className="pt-2.5 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/50 border border-transparent hover:border-red-900/30 transition cursor-pointer"
                        >
                          <LogOut size={15} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-2.5">
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="btn-bounce flex items-center gap-1.5 px-3.5 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
                >
                  <LogIn size={15} className="text-slate-400" />
                  <span>Login</span>
                </button>

                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="btn-bounce flex items-center gap-1.5 px-3.5 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25 transition cursor-pointer"
                >
                  <UserPlus size={15} />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Fallback modal if onOpenLogin / onOpenRegister is not passed */}
      {!onOpenLogin && !onOpenRegister && (
        <LoginModal
          isOpen={internalModalOpen}
          initialMode={internalModalMode}
          onClose={() => setInternalModalOpen(false)}
        />
      )}
    </>
  );
};
