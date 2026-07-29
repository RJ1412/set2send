"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  MessageSquare, 
  Phone, 
  Check, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

// Custom brand SVGs to prevent dependency failure
const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const ChromeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" x2="12" y1="8" y2="8" />
    <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
    <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
  </svg>
);

export default function GoogleAuthPage() {
  const router = useRouter();

  // Simulated Google accounts for picker modal
  const simulatedAccounts = [
    { name: "Alex Rivers", email: "alex.rivers@gmail.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" },
    { name: "Jordan Cole", email: "jordan.cole@gmail.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" }
  ];

  // UI state
  const [showPicker, setShowPicker] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successOverlay, setSuccessOverlay] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Route guard: Check if already logged in
  useEffect(() => {
    const session = localStorage.getItem("active_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed) {
          if (parsed.onboardingCompleted || parsed.onboarding_completed) {
            router.push("/dashboard");
          } else if (parsed.profileStepCompleted) {
            router.push("/onboarding/channel-selection");
          } else {
            router.push("/onboarding/profile");
          }
        }
      } catch (e) {
        localStorage.removeItem("active_session");
      }
    }
  }, [router]);

  const triggerGoogleLogin = () => {
    setShowPicker(true);
  };

  const handleSelectAccount = (account: { name: string; email: string; avatar: string }) => {
    setShowPicker(false);
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      try {
        // Retrieve users list
        const usersList = JSON.parse(localStorage.getItem("users_db") || "[]");
        let user = usersList.find((u: any) => u.email.toLowerCase() === account.email.toLowerCase());

        const googleId = `google_${Math.floor(1000000000 + Math.random() * 9000000000)}`;

        if (!user) {
          // New User Registration
          user = {
            full_name: account.name,
            name: account.name,
            email: account.email.toLowerCase(),
            avatar_url: account.avatar,
            image: account.avatar,
            google_id: googleId,
            method: "google",
            created_at: new Date().toISOString(),
            created: new Date().toLocaleDateString(),
            onboarding_completed: false,
            onboardingCompleted: false,
            status: "new_user",
            workspace: "My Workspace"
          };
          usersList.push(user);
          localStorage.setItem("users_db", JSON.stringify(usersList));
        } else {
          // Returning User
          // Map standard keys just in case
          user.name = user.full_name || user.name;
          user.image = user.avatar_url || user.image;
        }

        // Setup active session
        const sessionData = {
          ...user,
          lastLogin: new Date().toLocaleString()
        };
        localStorage.setItem("active_session", JSON.stringify(sessionData));

        setAuthenticatedUser(user);
        setIsLoading(false);
        setSuccessOverlay(true);

        setTimeout(() => {
          if (user.onboardingCompleted || user.onboarding_completed) {
            router.push("/dashboard");
          } else if (user.profileStepCompleted) {
            router.push("/onboarding/channel-selection");
          } else {
            router.push("/onboarding/profile");
          }
        }, 1500);

      } catch (err) {
        setIsLoading(false);
        setErrorMsg("Failed to authenticate with Google. Please try again.");
      }
    }, 1200);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;
    
    handleSelectAccount({
      name: customName,
      email: customEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customName)}&background=8b5cf6&color=fff`
    });
  };

  return (
    <div className="bg-[#030303] text-zinc-100 min-h-screen flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {successOverlay && authenticatedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-450 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <ShieldCheck className="w-10 h-10 animate-bounce" />
            </motion.div>
            <motion.h2
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-black text-white"
            >
              Google Authentication Successful!
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-400 text-xs sm:text-sm mt-2 font-medium"
            >
              {(authenticatedUser.onboardingCompleted || authenticatedUser.onboarding_completed)
                ? "Bypassing setup. Loading your dashboard console..."
                : "Initializing default workspace setup..."}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Account Selector Dialog Modal */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl max-w-sm w-full text-left"
            >
              <div className="flex items-center gap-2 mb-4">
                <ChromeIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-black text-white">Sign in with Google</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed font-medium mb-5">
                Select a simulated Google Account to complete Set2Send OAuth synchronization.
              </p>

              {/* Accounts list */}
              <div className="flex flex-col gap-2.5">
                {simulatedAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => handleSelectAccount(account)}
                    className="w-full p-3 bg-zinc-950 border border-zinc-850 hover:border-zinc-850 hover:bg-zinc-900 rounded-2xl flex items-center gap-3.5 transition-all text-left cursor-pointer"
                  >
                    <img src={account.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-zinc-800" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{account.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{account.email}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3.5">
                <div className="flex-grow h-px bg-zinc-850"></div>
                <span className="text-[9px] font-mono text-zinc-600 font-bold uppercase tracking-wider">Or Use Custom</span>
                <div className="flex-grow h-px bg-zinc-850"></div>
              </div>

              {/* Custom login form */}
              <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3.5">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 hover:border-zinc-800 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 hover:border-zinc-800 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-550 hover:bg-purple-650 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                >
                  Create Custom Profile
                </button>
              </form>

              <button
                onClick={() => setShowPicker(false)}
                className="w-full text-center text-[10px] font-bold font-mono text-zinc-550 hover:text-zinc-450 uppercase underline tracking-wider mt-4"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <span className="w-8 h-8 rounded-lg bg-zinc-950 text-[#f97316] flex items-center justify-center font-extrabold shadow-md">S</span>
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
              <div className="w-20 h-20 rounded-full bg-zinc-950/60 border border-white/5 flex items-center justify-center">
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
              className="absolute top-8 right-12 p-2.5 rounded-xl bg-blue-500/20 border border-blue-555/30 text-blue-200 shadow-md"
            >
              <MessageSquare className="w-5 h-5" />
            </motion.div>

          </div>

          <div className="max-w-md">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Automate Conversations Across Every Channel
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm mt-4 leading-relaxed font-medium">
              Connect Instagram, WhatsApp, Messenger, Telegram and more with AI-powered automation.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col gap-3 text-left w-full text-xs font-semibold text-zinc-300">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">✓</div>
              <span>Secure OAuth Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">✓</div>
              <span>No password required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">✓</div>
              <span>Setup in under 2 minutes</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] font-mono text-white/50 tracking-wider relative z-10 select-none hidden md:block">
          SECURED VIA GOOGLE IDENTITY PLATFORM
        </div>

      </div>

      {/* ==================================================
          RIGHT SIDE: GOOGLE SIGN-IN CONTAINER
          ================================================== */}
      <div className="col-span-12 md:col-span-7 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-[#040406] z-10 relative">
        
        {/* Soft background decor behind card */}
        <div className="absolute w-80 h-80 rounded-full bg-purple-650/5 blur-[95px] pointer-events-none z-0"></div>

        {/* Card */}
        <div className="w-full max-w-[480px] bg-zinc-900/60 border border-zinc-800/80 shadow-2xl rounded-3xl p-6 sm:p-10 backdrop-blur-md relative z-10 text-left">
          
          <div className="flex flex-col gap-2 mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">Welcome to Set2Send</h3>
            <p className="text-zinc-550 text-xs font-medium">Continue with Google to create your workspace and start building automations.</p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Login Trigger Button */}
          <button
            onClick={triggerGoogleLogin}
            disabled={isLoading}
            className={`w-full py-4 bg-white hover:bg-zinc-100 text-zinc-950 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer ${
              isLoading ? "opacity-60 cursor-wait" : "hover:scale-[1.01]"
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.1.3-1.12 2.22L12 14.1v3.9h6.69c1.9-1.8 3-4.5 3-7.73z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.89-3.02c-1.08.72-2.47 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.27a7.22 7.22 0 0 1 0-4.54V6.58H1.21a11.96 11.96 0 0 0 0 10.84l4.06-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.31 0 3.18 2.12 1.21 5.3L5.27 8.45c.95-2.85 3.6-4.96 6.73-4.96z" />
              </svg>
            )}
            <span>{isLoading ? "Redirecting..." : "Continue with Google"}</span>
          </button>

          {/* Privacy/Terms Links */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80 flex justify-center gap-4 text-[10px] text-zinc-550 font-mono tracking-wider">
            <a href="#" className="hover:underline hover:text-zinc-400">TERMS OF SERVICE</a>
            <span>•</span>
            <a href="#" className="hover:underline hover:text-zinc-400">PRIVACY POLICY</a>
          </div>

          {/* Sign In link for existing users */}
          <div className="mt-6 text-center text-xs text-zinc-500 font-medium">
            Already have an account?{" "}
            <Link href="/signin" className="text-purple-400 hover:underline font-bold">
              Sign In
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
