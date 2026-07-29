"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Send,
  MessageSquare,
  Phone
} from "lucide-react";

// Custom brand SVGs to prevent dependency failure
const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* ==================================================
          LEFT SIDE: SPLIT ILLUSTRATION
          ================================================== */}
      <div className="col-span-12 md:col-span-5 lg:col-span-5 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-850 p-8 sm:p-12 flex flex-col justify-between items-start text-left relative overflow-hidden min-h-[30vh] md:min-h-screen z-10">
        
        {/* Soft background decor blur filters */}
        <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[85px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[-20%] w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[105px] pointer-events-none"></div>

        {/* Brand Header */}
        <Link
          href="/"
          className="flex items-center gap-2 font-sans font-black text-white text-2xl tracking-tighter relative z-10 select-none"
        >
          <span className="w-8 h-8 rounded-lg bg-gray-50 text-[#f97316] flex items-center justify-center font-extrabold shadow-md">S</span>
          <span>set2send</span>
        </Link>

        {/* Central Illustration Area */}
        <div className="my-auto py-8 relative z-10 w-full flex flex-col items-start gap-8">
          
          {/* Animated Float Graphics */}
          <div className="relative w-full h-44 flex items-center justify-center">
            
            {/* Center Portal Sphere */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                rotate: [0, 360],
              }}
              transition={{
                repeat: Infinity,
                duration: 22,
                ease: "linear",
              }}
              className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-purple-400/20 via-pink-400/25 to-blue-400/20 border border-white/10 blur-[8px] flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-gray-50/60 border border-white/5 flex items-center justify-center">
                <Send className="w-8 h-8 text-pink-450 animate-pulse" />
              </div>
            </motion.div>

            {/* Social Icons floating */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
              className="absolute top-2 left-10 p-2.5 rounded-xl bg-purple-500/20 border border-purple-555/30 text-purple-200 shadow-md"
            >
              <InstagramIcon className="w-5 h-5" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 0.3 }}
              className="absolute bottom-4 right-12 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-555/30 text-emerald-250 shadow-md"
            >
              <Phone className="w-5 h-5" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.8 }}
              className="absolute top-8 right-12 p-2.5 rounded-xl bg-blue-500/20 border border-blue-550/30 text-blue-200 shadow-md"
            >
              <MessageSquare className="w-5 h-5" />
            </motion.div>

          </div>

          <div className="max-w-md">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Restore Secure Access
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-4 leading-relaxed font-medium">
              We'll send recovery credentials to verify your ownership of the connected workspace database.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] font-mono text-white/50 tracking-wider relative z-10 select-none hidden md:block">
          SECURED VIA SSL ENCRYPTION
        </div>

      </div>

      {/* ==================================================
          RIGHT SIDE: CARD CONTAINER
          ================================================== */}
      <div className="col-span-12 md:col-span-7 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-[#FAF9F6] z-10 relative">
        
        {/* Soft background decor behind card */}
        <div className="absolute w-80 h-80 rounded-full bg-purple-650/5 blur-[95px] pointer-events-none z-0"></div>

        {/* Authentication Card */}
        <div className="w-full max-w-[480px] bg-white/60 border border-gray-200/80 shadow-2xl rounded-3xl p-6 sm:p-10 backdrop-blur-md relative z-10 text-left my-auto">
          
          <AnimatePresence>
            {!success ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">Forgot Password</h3>
                  <p className="text-gray-400 text-xs mt-2 font-medium">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleResetSubmit} className="flex flex-col gap-5">
                  {/* Email Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-500">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-zinc-850 hover:border-gray-200 focus:border-purple-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none transition-all placeholder-zinc-650 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 mt-2 bg-purple-550 hover:bg-purple-650 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                      isLoading ? "opacity-60 cursor-wait" : "hover:scale-[1.01]"
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>
                </form>

                <div className="pt-4 border-t border-gray-200/80 text-center">
                  <Link href="/signin" className="text-gray-500 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-450 mx-auto mb-2 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">Check your email</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
                    We've sent a password reset link to your email address: <br/>
                    <strong className="text-zinc-250 font-mono mt-1 inline-block">{email}</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200/80">
                  <Link href="/signin" className="text-purple-400 hover:text-purple-300 text-xs font-bold transition-colors">
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
