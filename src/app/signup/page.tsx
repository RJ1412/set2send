"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/api";
import { 
  Send, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

const GoogleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.1.3-1.12 2.22L12 14.1v3.9h6.69c1.9-1.8 3-4.5 3-7.73z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.89-3.02c-1.08.72-2.47 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.27a7.22 7.22 0 0 1 0-4.54V6.58H1.21a11.96 11.96 0 0 0 0 10.84l4.06-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.31 0 3.18 2.12 1.21 5.3L5.27 8.45c.95-2.85 3.6-4.96 6.73-4.96z" />
  </svg>
);

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successOverlay, setSuccessOverlay] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const referralFromLink = searchParams.get("ref");
    if (referralFromLink) setReferralCode(referralFromLink);
  }, [searchParams]);

  useEffect(() => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !businessName || !email || !password || !confirmPassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        fullName,
        businessName,
        email,
        password,
        referral_code: referralCode,
      });

      const { user, accessToken } = response.data;
      useAuthStore.getState().setAuth(user, accessToken);

      setIsLoading(false);
      setSuccessOverlay(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1600);

    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Failed to create account. Please try again.");
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        setErrorMsg("");
        
        const response = await api.post("/auth/google", {
          token: codeResponse.access_token,
          referral_code: referralCode
        });
        
        const { user, accessToken } = response.data;
        useAuthStore.getState().setAuth(user, accessToken);

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
      setErrorMsg("Google Sign Up failed.");
      console.log('Login Failed:', error);
    }
  });

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* Success Animation Overlay */}
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
              Account Created Successfully!
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-2 font-medium"
            >
              Redirecting you to your workspace...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SECTION */}
      <div className="col-span-12 md:col-span-5 lg:col-span-6 bg-[#FAF9F6] p-8 sm:p-12 flex flex-col justify-between items-start text-left relative overflow-hidden min-h-[30vh] md:min-h-screen z-10 border-r border-[#E8E4D9]">
        
        {/* Brand Header */}
        <Link
          href="/"
          className="flex items-center gap-2 font-sans font-black text-[#1A1A1A] text-2xl tracking-tighter relative z-10 select-none"
        >
          <span className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-[#D4AF37] flex items-center justify-center font-extrabold shadow-md border border-[#D4AF37]/30">S</span>
          <span>set2send</span>
        </Link>

        {/* Central Illustration Area */}
        <div className="my-auto py-8 relative z-10 w-full flex flex-col items-start gap-8">
          <div className="max-w-md">
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1A1A1A] tracking-tight leading-none">
              Automate Conversations Across Every Channel
            </h2>
            <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-4 leading-relaxed font-medium">
              Launch AI-powered messaging workflows across Instagram, WhatsApp, Messenger, Telegram, and more.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-[#1A1A1A]/50 tracking-wider relative z-10 select-none hidden md:block">
          SECURED VIA SSL ENCRYPTION
        </div>
      </div>

      {/* RIGHT SIDE: REGISTER CARD CONTAINER */}
      <div className="col-span-12 md:col-span-7 lg:col-span-6 flex items-center justify-center p-6 sm:p-12 bg-white z-10 relative">
        
        <div className="absolute top-6 right-8 text-xs font-semibold text-[#1A1A1A]/70 z-20">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#D4AF37] hover:underline font-bold transition-all">
            Sign In
          </Link>
        </div>

        <div className="w-full max-w-[480px] bg-white border border-[#E8E4D9] shadow-2xl rounded-3xl p-6 sm:p-10 relative z-10 text-left my-auto">
          
          <div className="flex flex-col gap-2 mb-8">
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">Create Account</h3>
            <p className="text-[#1A1A1A]/60 text-xs font-medium">Start automating your social campaigns in minutes.</p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#1A1A1A]/60">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-[#1A1A1A]/40" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E8E4D9] hover:border-[#D4AF37] focus:border-[#D4AF37] rounded-xl py-3 pl-10 pr-4 text-xs text-[#1A1A1A] outline-none transition-all placeholder-[#1A1A1A]/30 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#1A1A1A]/60">Business Name</label>
              <div className="relative flex items-center">
                <Building className="absolute left-3 w-4 h-4 text-[#1A1A1A]/40" />
                <input
                  type="text"
                  required
                  placeholder="Acme Corp"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E8E4D9] hover:border-[#D4AF37] focus:border-[#D4AF37] rounded-xl py-3 pl-10 pr-4 text-xs text-[#1A1A1A] outline-none transition-all placeholder-[#1A1A1A]/30 font-medium"
                />
              </div>
            </div>

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
              <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#1A1A1A]/60">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-[#1A1A1A]/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 8 characters"
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

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#1A1A1A]/60">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-[#1A1A1A]/40" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E8E4D9] hover:border-[#D4AF37] focus:border-[#D4AF37] rounded-xl py-3 pl-10 pr-10 text-xs text-[#1A1A1A] outline-none transition-all placeholder-[#1A1A1A]/30 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 p-1 text-[#1A1A1A]/40 hover:text-[#1A1A1A] cursor-pointer outline-none select-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#1A1A1A]/60">Referral Code (Optional)</label>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-3 w-4 h-4 text-[#1A1A1A]/40" />
                <input
                  type="text"
                  placeholder="e.g. abcd123"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E8E4D9] hover:border-[#D4AF37] focus:border-[#D4AF37] rounded-xl py-3 pl-10 pr-4 text-xs text-[#1A1A1A] outline-none transition-all placeholder-[#1A1A1A]/30 font-medium"
                />
              </div>
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-grow h-px bg-[#E8E4D9]"></div>
            <span className="text-[9px] font-mono text-[#1A1A1A]/50 font-bold uppercase tracking-wider">Or</span>
            <div className="flex-grow h-px bg-[#E8E4D9]"></div>
          </div>

          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className={`w-full py-3 bg-white border border-[#E8E4D9] hover:bg-[#FAF9F6] text-[#1A1A1A] font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer ${
              isLoading ? "opacity-60 cursor-wait" : "hover:scale-[1.01]"
            }`}
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>

        </div>

      </div>

    </div>
  );
}

