import React, { useState } from "react";
import "./adminFonts";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, User, ArrowLeft, ShieldCheck } from "lucide-react";
import bhdsLogo from "../../assets/bihar_heritage_logo.webp";
import { login } from "../../services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      // The hosted API sleeps when idle, so a first attempt can time out.
      setError(
        err?.isTimeout || err?.isNetwork
          ? err.message
          : err?.message || "Invalid administrative credentials."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F3] text-[#2F241D] font-inter px-4 py-8">
      {/* Top Header Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#6F665E] hover:text-[#B85C38] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </Link>

      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-[420px] mx-auto my-auto py-8">
        <div className="bg-white rounded-2xl border border-[#E7DED3] p-7 sm:p-9 text-left">

          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <img loading="lazy" decoding="async"
              src={bhdsLogo}
              alt="Bihar Heritage Logo"
              className="h-14 w-auto object-contain mb-3"
            />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#B85C38] uppercase">
              Bihar Heritage Development Society
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#2F241D] mt-1">
              Control Panel Login
            </h1>
            <p className="text-xs text-[#6F665E] mt-1">
              Enter your authorized credentials to manage content.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Username / Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E7DED3] bg-white text-[#2F241D] text-sm focus:outline-none focus:border-[#B85C38] focus:ring-1 focus:ring-[#B85C38] transition placeholder:text-[#6F665E]/40 font-normal"
                />
                <User className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-[#6F665E] uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-[#6F665E]">
                  Contact the system administrator
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E7DED3] bg-white text-[#2F241D] text-sm focus:outline-none focus:border-[#B85C38] focus:ring-1 focus:ring-[#B85C38] transition placeholder:text-[#6F665E]/40 font-normal"
                />
                <Lock className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#2F241D] transition p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#E7DED3] text-[#B85C38] focus:ring-[#B85C38]/20 cursor-pointer"
                />
                <span className="text-xs text-[#6F665E]">Remember this device</span>
              </label>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#B85C38] hover:bg-[#A0502F] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? "Authenticating…" : "Sign In to Dashboard"}
            </button>
          </form>

          {/* Sign-in help */}
          <div className="mt-6 pt-4 border-t border-[#E7DED3]/70 text-center">
            <p className="text-[11px] text-[#6F665E]">
              Authorised personnel only. Credentials are verified against the
              Bihar Heritage content server.
            </p>
          </div>

        </div>
      </div>

      {/* Footer System Info */}
      <div className="text-center text-xs text-[#6F665E]/80">
        © {new Date().getFullYear()}  Bihar Heritage Development Society , Govt. of Bihar • Content Management System
      </div>
    </div>
  );
}
