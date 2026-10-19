"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

export type AuthMode = "login" | "register";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onLoginSuccess?: (username: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Login form states
  const [loginUser, setLoginUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form states
  const [regUser, setRegUser] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync mode whenever initialMode changes
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);
  if (prevInitialMode !== initialMode) {
    setPrevInitialMode(initialMode);
    setMode(initialMode);
    setError(null);
  }

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = loginUser.trim();
    if (!trimmed) {
      setError("Please enter your username or email");
      return;
    }
    if (!loginPassword) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const authData = {
          user: trimmed,
          loggedInAt: new Date().toISOString(),
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("json_converter_user", JSON.stringify(authData));
          window.dispatchEvent(new Event("storage"));
        }

        if (onLoginSuccess) {
          onLoginSuccess(trimmed);
        }

        onClose();
      } catch {
        setError("Unable to save authentication session");
      } finally {
        setIsLoading(false);
      }
    }, 350);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = regUser.trim();
    const trimmedEmail = regEmail.trim();

    if (!trimmedUser) {
      setError("Please choose a username");
      return;
    }
    if (!trimmedEmail) {
      setError("Please enter your email address");
      return;
    }
    if (!regPassword) {
      setError("Please create a password");
      return;
    }
    if (regPassword.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const authData = {
          user: trimmedUser,
          email: trimmedEmail,
          registeredAt: new Date().toISOString(),
          loggedInAt: new Date().toISOString(),
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("json_converter_user", JSON.stringify(authData));
          window.dispatchEvent(new Event("storage"));
        }

        if (onLoginSuccess) {
          onLoginSuccess(trimmedUser);
        }

        onClose();
      } catch {
        setError("Unable to complete registration");
      } finally {
        setIsLoading(false);
      }
    }, 450);
  };

  const handleQuickDemo = () => {
    setLoginUser("admin");
    setLoginPassword("admin123");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop (Clean dark overlay without GPU-heavy double blurs) */}
      <div
        className="fixed inset-0 bg-slate-950/75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card (Hardware-accelerated, high-performance) */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 p-6 sm:p-8 animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
          title="Close modal"
        >
          <X size={18} />
        </button>

        {/* Tab Switcher (Sign In vs Register) */}
        <div className="relative flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800 mb-6 select-none overflow-hidden">
          {/* Animated Sliding Background Indicator (Fast, 0-jank) */}
          <div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-blue-600 shadow-md shadow-blue-500/25 transition-all duration-200 ease-out pointer-events-none"
            style={{
              left: mode === "login" ? "4px" : "calc(50%)",
            }}
          />

          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
              mode === "login"
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LogIn size={14} className={mode === "login" ? "text-white" : "text-slate-400"} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
              mode === "register"
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserPlus size={14} className={mode === "register" ? "text-white" : "text-slate-400"} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Modal Header Title */}
        <div key={`header-${mode}`} className="text-center mb-5 animate-tab-content">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            {mode === "login" ? "Welcome Back" : "Join Converter Studio"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === "login"
              ? "Sign in to access your Studio workspace"
              : "Create an account to start converting data"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs animate-fade-in">
            {error}
          </div>
        )}

        {/* FORM: LOGIN */}
        {mode === "login" && (
          <form key="form-login" onSubmit={handleLoginSubmit} className="space-y-4 animate-tab-content">
            <div>
              <label
                htmlFor="auth-login-user"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                User / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input
                  id="auth-login-user"
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Enter username (e.g. admin)"
                  autoComplete="username"
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-login-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  id="auth-login-password"
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  title={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Quick Demo button */}
            <div className="flex items-center justify-end pt-0.5">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition cursor-pointer"
              >
                <Sparkles size={12} /> Auto-fill Demo
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Switch link */}
            <p className="text-center text-xs text-slate-400 pt-1">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition cursor-pointer"
              >
                Register now
              </button>
            </p>
          </form>
        )}

        {/* FORM: REGISTER */}
        {mode === "register" && (
          <form key="form-register" onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-tab-content">
            <div>
              <label
                htmlFor="auth-reg-user"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input
                  id="auth-reg-user"
                  type="text"
                  value={regUser}
                  onChange={(e) => setRegUser(e.target.value)}
                  placeholder="Choose a username"
                  autoComplete="username"
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-reg-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  id="auth-reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-reg-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  id="auth-reg-password"
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  title={showRegPassword ? "Hide password" : "Show password"}
                >
                  {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-reg-confirm"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound size={16} />
                </div>
                <input
                  id="auth-reg-confirm"
                  type={showRegPassword ? "text" : "password"}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-type your password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create Account</span>
                </>
              )}
            </button>

            {/* Switch link */}
            <p className="text-center text-xs text-slate-400 pt-1">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* Footer note */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Client-Side Local Session</span>
        </div>
      </div>
    </div>
  );
};
