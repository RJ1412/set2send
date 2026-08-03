"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/api";
import { 
  Send, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  MessageCircle,
  Globe
} from "lucide-react";

const GoogleIcon = ({ className = "w-4.5 h-4.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.1.3-1.12 2.22L12 14.1v3.9h6.69c1.9-1.8 3-4.5 3-7.73z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.89-3.02c-1.08.72-2.47 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.27a7.22 7.22 0 0 1 0-4.54V6.58H1.21a11.96 11.96 0 0 0 0 10.84l4.06-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.31 0 3.18 2.12 1.21 5.3L5.27 8.45c.95-2.85 3.6-4.96 6.73-4.96z" />
  </svg>
);

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successOverlay, setSuccessOverlay] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, accessToken } = response.data;
      useAuthStore.getState().setAuth(user, accessToken);

      setLoggedInUser(user);
      setIsLoading(false);
      setSuccessOverlay(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1600);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Sign in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        setErrorMsg("");
        
        const response = await api.post("/auth/google", {
          token: codeResponse.access_token
        });
        
        const { user, accessToken } = response.data;
        useAuthStore.getState().setAuth(user, accessToken);

        setLoggedInUser(user);
        setIsLoading(false);
        setSuccessOverlay(true);
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 1600);
      } catch (err: any) {
        setErrorMsg(err.response?.data?.error || "Google authentication failed.");
        setIsLoading(false);
      }
    },
    onError: (error) => {
      setErrorMsg("Google Sign In failed.");
      console.log('Login Failed:', error);
    }
  });

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* Success Redirect Overlay */}
      <AnimatePresence>
        {successOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FAF9F6]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full bg-[#1A1A1A] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-6 shadow-2xl"
            >
              <ShieldCheck className="w-10 h-10 animate-bounce" />
            </motion.div>
            <motion.h2
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-black text-[#1A1A1A] font-sans tracking-tight"
            >
              Welcome back, {loggedInUser?.full_name || loggedInUser?.name}!
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-2 font-medium"
            >
              Redirecting you to your Set2Send dashboard...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SECTION */}
      <div className="col-span-12 md:col-span-7 lg:col-span-6 bg-[#FAF9F6] p-8 sm:p-12 md:p-16 flex flex-col justify-between items-start text-left relative overflow-hidden min-h-[45vh] md:min-h-screen z-10 border-r border-[#E8E4D9]">
        
        {/* Set2Send Brand Header */}
        <Link
          href="/"
          className="flex items-center gap-2 font-sans font-black text-[#1A1A1A] text-2xl tracking-tighter relative z-10 select-none"
        >
          <span className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-[#D4AF37] flex items-center justify-center font-extrabold shadow-md border border-[#D4AF37]/30">S</span>
          <span>set2send</span>
        </Link>

        {/* Central Headlines & Features */}
        <div className="my-auto py-8 relative z-10 w-full flex flex-col gap-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-serif font-black text-[#1A1A1A] tracking-tight leading-none">
              Welcome Back.
            </h2>
            <p className="text-[#1A1A1A]/70 text-sm mt-4 leading-relaxed max-w-md font-medium">
              Sign in to continue managing your intelligent chat automations and CRM.
            </p>
          </div>
          
          <div className="flex flex-col gap-5 mt-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center shrink-0 mt-0.5 border border-[#1A1A1A]/10">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1A1A1A]">AI-Powered Automation</h4>
                <p className="text-xs text-[#1A1A1A]/60 mt-1">Intelligent comment-to-DM and auto-replies</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center shrink-0 mt-0.5 border border-[#1A1A1A]/10">
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1A1A1A]">Omnichannel Presence</h4>
                <p className="text-xs text-[#1A1A1A]/60 mt-1">Works seamlessly across Instagram, WhatsApp, Messenger & Telegram</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center shrink-0 mt-0.5 border border-[#1A1A1A]/10">
                <Globe className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1A1A1A]">Built for Growth</h4>
                <p className="text-xs text-[#1A1A1A]/60 mt-1">Designed specifically for Indian creators & D2C brands</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secured badge footer */}
        <div className="text-[10px] font-mono text-[#1A1A1A]/50 tracking-wider relative z-10 select-none hidden md:block uppercase font-bold">
          SECURED IDENTITY GATEWAY v2.6 • SSL ENABLED
        </div>
      </div>

      {/* RIGHT SECTION: CENTERED AUTHENTICATION CARD */}
      <div className="col-span-12 md:col-span-5 lg:col-span-6 flex items-center justify-center p-6 sm:p-12 bg-white z-10 relative">
        
        {/* Redirect sign up header link */}
        <div className="absolute top-6 right-8 text-xs font-semibold text-[#1A1A1A]/70 z-20">
          New to Set2Send?{" "}
          <Link href="/signup" className="text-[#D4AF37] hover:underline font-bold transition-all">
            Create Account
          </Link>
        </div>

        {/* Authentication Card */}
        <div className="w-full max-w-[480px] bg-white border border-[#E8E4D9] shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10 relative z-10 text-left my-auto">
          
          <div className="flex flex-col gap-1.5 mb-6 md:mb-8">
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">Sign In</h3>
            <p className="text-[#1A1A1A]/60 text-xs font-medium">Connect through Google OAuth or email credentials.</p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <div>
                <p className="font-bold">{errorMsg}</p>
              </div>
            </div>
          )}

          <fieldset disabled={isLoading} className="flex flex-col gap-4 group">
            
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className={`w-full py-3 bg-white border border-[#E8E4D9] hover:bg-[#FAF9F6] text-[#1A1A1A] font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer ${
                isLoading ? "opacity-60 cursor-wait" : "hover:scale-[1.01]"
              }`}
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <div className="my-3 flex items-center gap-3">
              <div className="flex-grow h-px bg-[#E8E4D9]"></div>
              <span className="text-[9px] font-mono text-[#1A1A1A]/50 font-bold uppercase tracking-wider select-none">Or</span>
              <div className="flex-grow h-px bg-[#E8E4D9]"></div>
            </div>

            <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#1A1A1A]/60">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-[#1A1A1A]/40" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8E4D9] hover:border-[#D4AF37] focus:border-[#D4AF37] rounded-xl py-3 pl-10 pr-4 text-xs text-[#1A1A1A] outline-none transition-all placeholder-[#1A1A1A]/30 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#1A1A1A]/60">Password</label>
                  <Link href="/forgot-password" className="text-[10px] text-[#D4AF37] hover:underline font-bold transition-all uppercase tracking-wider font-mono">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-[#1A1A1A]/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8E4D9] hover:border-[#D4AF37] focus:border-[#D4AF37] rounded-xl py-3 pl-10 pr-10 text-xs text-[#1A1A1A] outline-none transition-all placeholder-[#1A1A1A]/30 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-[#1A1A1A]/40 hover:text-[#1A1A1A] cursor-pointer outline-none select-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1 select-none">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E8E4D9] bg-[#FAF9F6] text-[#D4AF37] accent-[#D4AF37] cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-[#1A1A1A]/60 font-medium cursor-pointer">
                  Remember Me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 mt-2 bg-[#1A1A1A] hover:bg-[#333333] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                  isLoading ? "opacity-60 cursor-wait" : "hover:scale-[1.01]"
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </fieldset>

        </div>
      </div>
    </div>
  );
}
