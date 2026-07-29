"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Mail, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Lock
} from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();

  // Load pending user from localStorage
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  
  // Timers and limits
  const [resendTimer, setResendTimer] = useState(30);
  const [expireTimer, setExpireTimer] = useState(600); // 10 minutes (600s)
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);

  // Loaders/Status
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successOverlay, setSuccessOverlay] = useState(false);

  // Input refs for auto-focus shifting
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Load state from local storage on mount
  useEffect(() => {
    // Check if locked
    const lockTimestamp = localStorage.getItem("email_verification_lock");
    if (lockTimestamp) {
      const lockEnd = parseInt(lockTimestamp, 10);
      if (Date.now() < lockEnd) {
        setIsLocked(true);
        setLockTimeLeft(Math.ceil((lockEnd - Date.now()) / 1000));
        setErrorMsg("Your verification has been locked due to too many failed attempts.");
      } else {
        localStorage.removeItem("email_verification_lock");
      }
    }

    const pending = localStorage.getItem("pending_verification_user");
    if (!pending) {
      // No pending user registration, go back to register
      router.push("/signup");
      return;
    }

    try {
      setPendingUser(JSON.parse(pending));
    } catch (e) {
      router.push("/signup");
    }
  }, [router]);

  // Handle count down timers
  useEffect(() => {
    if (isLocked) {
      const lockInterval = setInterval(() => {
        setLockTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(lockInterval);
            setIsLocked(false);
            localStorage.removeItem("email_verification_lock");
            setErrorMsg("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(lockInterval);
    }

    // Expiration Timer
    const expireInterval = setInterval(() => {
      setExpireTimer(prev => {
        if (prev <= 1) {
          clearInterval(expireInterval);
          setErrorMsg("Your OTP code has expired. Please request a new one.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Resend countdown
    const resendInterval = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(expireInterval);
      clearInterval(resendInterval);
    };
  }, [isLocked]);

  // Handle digit box edits
  const handlePinChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    setErrorMsg("");

    const newPin = [...pin];
    newPin[index] = val;
    setPin(newPin);

    // Shift focus to next box
    if (val !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace shift focus
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && pin[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verification submission handler
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setErrorMsg("");
    const enteredCode = pin.join("");
    if (enteredCode.length < 6) {
      setErrorMsg("Please enter the complete 6-digit code.");
      return;
    }

    if (expireTimer <= 0) {
      setErrorMsg("Your OTP code has expired. Please request a new one.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Validate
      if (enteredCode === pendingUser.otpCode) {
        setIsLoading(false);
        setSuccessOverlay(true);

        // Move pending user to main database
        const usersList = JSON.parse(localStorage.getItem("users_db") || "[]");
        const newUserObj = {
          name: pendingUser.name || pendingUser.email.split("@")[0],
          email: pendingUser.email,
          image: pendingUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(pendingUser.email.split("@")[0])}&background=8b5cf6&color=fff`,
          method: pendingUser.method || "email",
          emailVerified: true,
          passwordHash: pendingUser.passwordHash || null,
          created: pendingUser.created || new Date().toLocaleDateString()
        };

        // Check duplicates
        const existsIdx = usersList.findIndex((u: any) => u.email === newUserObj.email);
        if (existsIdx >= 0) {
          usersList[existsIdx] = { ...usersList[existsIdx], ...newUserObj };
        } else {
          usersList.push(newUserObj);
        }
        localStorage.setItem("users_db", JSON.stringify(usersList));

        // Save session
        const existingSession = (() => {
          try {
            const sess = localStorage.getItem("active_session");
            return sess ? JSON.parse(sess) : {};
          } catch (e) {
            return {};
          }
        })();
        const mergedUser = { ...existingSession, ...newUserObj };
        localStorage.setItem("active_session", JSON.stringify(mergedUser));
        
        // Clear pending user
        localStorage.removeItem("pending_verification_user");

        setTimeout(() => {
          router.push("/onboarding/profile");
        }, 1500);
      } else {
        setIsLoading(false);
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 5) {
          // Lock account for 15 minutes
          const lockEnd = Date.now() + 15 * 60 * 1000;
          localStorage.setItem("email_verification_lock", lockEnd.toString());
          setIsLocked(true);
          setLockTimeLeft(900); // 15 mins
          setErrorMsg("Your verification has been locked due to too many failed attempts. Please try again in 15 minutes.");
        } else {
          setErrorMsg(`Incorrect verification code. Attempts remaining: ${5 - newAttempts}`);
          setPin(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      }
    }, 1200);
  };

  // Resend OTP
  const handleResend = () => {
    if (resendTimer > 0 || isLocked) return;

    setIsResending(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsResending(false);
      
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const updatedUser = {
        ...pendingUser,
        otpCode: newOtp,
        otpCreated: Date.now()
      };
      
      localStorage.setItem("pending_verification_user", JSON.stringify(updatedUser));
      setPendingUser(updatedUser);
      
      console.log(`[Set2Send DEV] Re-sent new verification code: ${newOtp}`);

      setResendTimer(30);
      setExpireTimer(600);
      setPin(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  // Helper formats
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* Success overlay splash */}
      <AnimatePresence>
        {successOverlay && (
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
              Email Verified Successfully!
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-xs sm:text-sm mt-2 font-medium"
            >
              Initializing profile configuration step...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDE: SPLIT PANEL */}
      <div className="col-span-12 md:col-span-5 lg:col-span-5 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-8 sm:p-12 flex flex-col justify-between items-start text-left relative overflow-hidden min-h-[30vh] md:min-h-screen z-10 border-r border-[#E8E4D9]">
        
        <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[20%] left-[-20%] w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[100px]"></div>

        {/* Brand Header */}
        <Link
          href="/"
          className="flex items-center gap-2 font-sans font-black text-white text-2xl tracking-tighter relative z-10 select-none"
        >
          <span className="w-8 h-8 rounded-lg bg-gray-50 text-[#f97316] flex items-center justify-center font-extrabold shadow-md">S</span>
          <span>set2send</span>
        </Link>

        {/* Central Illustration Area */}
        <div className="my-auto py-8 relative z-10 w-full flex flex-col items-start gap-6">
          <div className="relative w-full h-44 flex items-center justify-center">
            
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: "linear",
              }}
              className="absolute w-32 h-32 rounded-full border border-dashed border-purple-500/20 flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full border border-zinc-850 bg-gray-50/20"></div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="z-10 bg-white/90 border border-gray-200 p-5 rounded-2xl shadow-xl flex items-center justify-center text-zinc-350"
            >
              <Mail className="w-10 h-10 text-purple-400" />
            </motion.div>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Verify your Set2Send account
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-3.5 leading-relaxed font-medium">
              We require a verified email address to protect vector endpoints, API credentials, and lead sync pipelines from malicious triggers.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-white/50 tracking-wider relative z-10 select-none hidden md:block">
          SECURED LOCK GATEWAY
        </div>

      </div>

      {/* RIGHT SIDE: VERIFICATION CARD */}
      <div className="col-span-12 md:col-span-7 lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 bg-[#FAF9F6] z-10 relative">
        
        {/* Back Link */}
        <Link 
          href="/signup"
          className="absolute top-6 left-8 text-xs font-semibold text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors z-20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign Up</span>
        </Link>

        {/* Verification Card */}
        <div className="w-full max-w-[480px] bg-white/60 border border-gray-200/80 shadow-2xl rounded-3xl p-6 sm:p-10 backdrop-blur-md relative z-10 text-left my-auto">
          
          <div className="flex flex-col gap-2 mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">Enter OTP Pin</h3>
            <p className="text-gray-400 text-xs font-medium">
              We sent a 6-digit confirmation code to: <br/>
              <strong className="text-gray-600 font-bold font-mono">{pendingUser?.email || "loading..."}</strong>
            </p>
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="leading-tight">{errorMsg}</span>
            </div>
          )}

          {isLocked ? (
            <div className="flex flex-col items-center gap-6 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-md">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Verification Locked</h4>
                <p className="text-[11px] text-gray-400 mt-1 max-w-xs leading-normal">
                  Too many incorrect PIN attempts. Lock will reset automatically in:
                </p>
                <div className="text-lg font-mono font-bold text-red-400 mt-2.5 bg-red-950/20 border border-red-500/20 px-4 py-1.5 rounded-full inline-block">
                  {formatTime(lockTimeLeft)}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-6">
              
              {/* Digit boxes */}
              <div className="flex gap-2 justify-between">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`verify-otp-pin-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    className="w-12 h-14 bg-[#0c0c0e]/80 border border-zinc-850 focus:border-purple-500/80 rounded-xl text-center text-lg font-bold text-white focus:outline-none transition-colors"
                  />
                ))}
              </div>

              {/* Expiration Timer Indicator */}
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-mono font-bold uppercase tracking-wider justify-center">
                <Clock className="w-3.5 h-3.5 text-zinc-550" />
                <span>Code expires in: </span>
                <span className={expireTimer < 60 ? "text-rose-450 font-bold" : "text-zinc-350"}>
                  {formatTime(expireTimer)}
                </span>
              </div>

              {/* Verify button */}
              <button
                type="submit"
                disabled={isLoading || pin.includes("")}
                className="w-full py-4 bg-gradient-to-r from-purple-550 to-pink-500 hover:from-purple-650 hover:to-pink-600 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-purple-500/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.01]"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{isLoading ? "Validating Code..." : "Verify Code"}</span>
              </button>

              {/* Resend actions */}
              <div className="flex justify-center items-center gap-2 text-xs font-semibold text-gray-400 mt-2">
                <span>Didn't receive the email?</span>
                {resendTimer > 0 ? (
                  <span className="text-gray-500 font-mono">Resend OTP in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-purple-400 hover:underline font-bold uppercase text-[10px] tracking-wider cursor-pointer"
                  >
                    {isResending ? "Resending..." : "Resend OTP"}
                  </button>
                )}
              </div>

            </form>
          )}

          {/* DEV TOOL OTP TRACE */}
          {pendingUser && !isLocked && (
            <div className="mt-8 pt-5 border-t border-dashed border-gray-200 text-center">
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-zinc-850 text-[10px] font-mono text-zinc-550">
                DEV TOOL ONLY - RECEIVED OTP: <strong className="text-gray-600 font-bold">{pendingUser.otpCode}</strong>
              </span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
