"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Key, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  QrCode
} from "lucide-react";

// Inline QR code mockup helper SVG
const MockQRCode = () => (
  <svg viewBox="0 0 100 100" className="w-28 h-28 text-white bg-white p-2.5 rounded-xl border border-gray-200">
    {/* QR code pattern simulations */}
    <rect x="0" y="0" width="25" height="25" fill="black" />
    <rect x="5" y="5" width="15" height="15" fill="white" />
    <rect x="9" y="9" width="7" height="7" fill="black" />
    
    <rect x="75" y="0" width="25" height="25" fill="black" />
    <rect x="80" y="5" width="15" height="15" fill="white" />
    <rect x="84" y="9" width="7" height="7" fill="black" />

    <rect x="0" y="75" width="25" height="25" fill="black" />
    <rect x="5" y="80" width="15" height="15" fill="white" />
    <rect x="9" y="84" width="7" height="7" fill="black" />

    {/* Custom random data clusters */}
    <rect x="35" y="10" width="10" height="5" fill="black" />
    <rect x="55" y="10" width="5" height="10" fill="black" />
    <rect x="35" y="25" width="5" height="15" fill="black" />
    <rect x="45" y="35" width="15" height="5" fill="black" />
    <rect x="65" y="25" width="10" height="10" fill="black" />
    <rect x="75" y="35" width="15" height="15" fill="black" />

    <rect x="10" y="35" width="15" height="10" fill="black" />
    <rect x="10" y="55" width="10" height="15" fill="black" />
    <rect x="25" y="65" width="15" height="5" fill="black" />
    <rect x="35" y="55" width="10" height="10" fill="black" />
    
    <rect x="50" y="50" width="20" height="25" fill="black" />
    <rect x="55" y="55" width="10" height="15" fill="white" />
    <rect x="75" y="60" width="15" height="10" fill="black" />
    <rect x="60" y="80" width="25" height="10" fill="black" />
    <rect x="45" y="85" width="10" height="10" fill="black" />
  </svg>
);

export default function SecuritySetupPage() {
  const router = useRouter();

  // Active user session
  const [sessionUser, setSessionUser] = useState<any>(null);
  
  // Selection states
  const [activeMethod, setActiveMethod] = useState<"auth_app" | "email" | "sms" | null>(null);
  const [securitySaved, setSecuritySaved] = useState(false);
  const [savedMethod, setSavedMethod] = useState<string | null>(null);

  // Authenticator App input Pin
  const [authPin, setAuthPin] = useState(["", "", "", "", "", ""]);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);
  
  // SMS binding inputs
  const [smsPhone, setSmsPhone] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsPin, setSmsPin] = useState(["", "", "", "", "", ""]);
  const [isVerifyingSms, setIsVerifyingSms] = useState(false);

  // Status Loaders
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successOverlay, setSuccessOverlay] = useState(false);

  // Load user session
  useEffect(() => {
    const sessionStr = localStorage.getItem("active_session");
    if (!sessionStr) {
      router.push("/signin");
      return;
    }
    try {
      const parsed = JSON.parse(sessionStr);
      if (parsed) {
        if (parsed.onboardingCompleted || parsed.onboarding_completed) {
          router.push("/dashboard");
          return;
        }
      }
      setSessionUser(parsed);
      if (parsed.phone) {
        setSmsPhone(parsed.phone);
      }
    } catch (e) {
      router.push("/signin");
    }
  }, [router]);

  // Activate Authenticator Pin entry
  const handleVerifyAuthApp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const code = authPin.join("");
    if (code.length < 6) {
      setErrorMsg("Please enter the complete 6-digit pin.");
      return;
    }

    setIsVerifyingAuth(true);

    setTimeout(() => {
      setIsVerifyingAuth(false);
      // Validate code (123456 is dev bypass)
      if (code === "123456") {
        setSavedMethod("authenticator");
        setSecuritySaved(true);
        setErrorMsg("");
      } else {
        setErrorMsg("Invalid authenticator PIN. Try entering 123456.");
        setAuthPin(["", "", "", "", "", ""]);
      }
    }, 1200);
  };

  // Trigger SMS sending
  const handleSendSms = () => {
    if (!smsPhone) {
      setErrorMsg("Phone number is required.");
      return;
    }
    setErrorMsg("");
    setIsSendingSms(true);

    setTimeout(() => {
      setIsSendingSms(false);
      setSmsSent(true);
      console.log(`[Set2Send DEV] 2FA SMS Code dispatched: 123456`);
    }, 1200);
  };

  // Verify SMS Pin
  const handleVerifySms = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const code = smsPin.join("");
    if (code.length < 6) {
      setErrorMsg("Please enter the 6-digit confirmation pin.");
      return;
    }

    setIsVerifyingSms(true);

    setTimeout(() => {
      setIsVerifyingSms(false);
      if (code === "123456") {
        setSavedMethod("sms");
        setSecuritySaved(true);
        setErrorMsg("");
      } else {
        setErrorMsg("Incorrect code. Try entering 123456.");
        setSmsPin(["", "", "", "", "", ""]);
      }
    }, 1200);
  };

  // Enable Email OTP immediately
  const handleEnableEmail2FA = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSavedMethod("email");
      setSecuritySaved(true);
      setErrorMsg("");
    }, 850);
  };

  // Save security session and continue
  const handleSecurityContinue = (skip: boolean = false) => {
    setIsLoading(true);

    setTimeout(() => {
      const is2FA = !skip && securitySaved;
      const type = is2FA ? savedMethod : null;

      // Update session values
      const updatedSession = {
        ...sessionUser,
        twoFactorEnabled: is2FA,
        twoFactorType: type,
        securityStepCompleted: true
      };

      localStorage.setItem("active_session", JSON.stringify(updatedSession));

      // Check off 2FA checking index specifically for authentication challenging
      if (is2FA) {
        localStorage.setItem(`2fa_enabled_${sessionUser.email}`, "true");
        localStorage.setItem(`2fa_type_${sessionUser.email}`, type || "authenticator");
      } else {
        localStorage.removeItem(`2fa_enabled_${sessionUser.email}`);
        localStorage.removeItem(`2fa_type_${sessionUser.email}`);
      }

      // Update database record
      const usersList = JSON.parse(localStorage.getItem("users_db") || "[]");
      const userIdx = usersList.findIndex((u: any) => u.email === sessionUser.email);
      if (userIdx >= 0) {
        usersList[userIdx] = { ...usersList[userIdx], ...updatedSession };
        localStorage.setItem("users_db", JSON.stringify(usersList));
      }

      setIsLoading(false);
      setSuccessOverlay(true);

      setTimeout(() => {
        if (updatedSession && updatedSession.channel) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding/channel-selection");
        }
      }, 1500);

    }, 1000);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* Background neon filters */}
      <div className="absolute top-[5%] left-[20%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

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
              Security Settings Verified!
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-xs sm:text-sm mt-2 font-medium"
            >
              Proceeding to channel selection step...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDE: PROGRESS FLOW DETAILS */}
      <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-8 sm:p-12 flex flex-col justify-between items-start text-left relative overflow-hidden min-h-[30vh] md:min-h-screen z-10 border-r border-[#E8E4D9]">
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

        {/* Progress Details */}
        <div className="my-auto py-8 relative z-10 w-full flex flex-col items-start gap-8">
          <div>
            <span className="text-[9px] font-mono font-bold text-[#f97316] uppercase tracking-widest border border-[#f97316]/20 bg-[#f97316]/10 px-2.5 py-1 rounded-full">STEP 4 OF 8</span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight mt-4">
              Secure your credentials
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
              Activate Multi-Factor Authenticator checks (2FA) to protect vector endpoints, API webhook tokens, and client subscriber telemetry databases.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-xs font-mono font-bold text-gray-400 text-left">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>1. REGISTRATION</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>2. EMAIL VERIFICATION</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>3. PROFILE SETUP</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-[10px] animate-pulse">4</span>
              <span>4. ACCOUNT SECURITY</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-white/50 tracking-wider relative z-10 select-none hidden md:block">
          SECURITY PROTOCOL ENFORCER
        </div>
      </div>

      {/* RIGHT SIDE: 2FA CARD SELECTORS */}
      <div className="col-span-12 md:col-span-8 flex items-center justify-center p-6 sm:p-12 bg-[#FAF9F6] z-10 overflow-y-auto">
        <div className="w-full max-w-[520px] my-auto">
          
          <div className="text-left mb-6">
            <h3 className="text-2xl font-black text-white">Configure 2FA</h3>
            <p className="text-gray-400 text-xs mt-1.5 font-medium">Select a second-factor verification method to protect logins.</p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Verification Saved Banner */}
          {securitySaved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-950/15 border border-emerald-500/20 text-emerald-450 text-xs font-semibold flex items-center gap-3.5 text-left"
            >
              <Check className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-extrabold uppercase text-[9px] tracking-wider">MFA Setup Verified!</div>
                <span>Successfully locked credentials under 2FA <strong className="text-white capitalize">{savedMethod}</strong> configuration. Click continue to proceed.</span>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-3.5 text-left">
            
            {/* Authenticator App Option */}
            <div className={`border rounded-2xl overflow-hidden transition-all ${
              activeMethod === "auth_app" 
                ? "bg-purple-955/5 border-purple-500/35 shadow-md" 
                : "bg-white/30 border-zinc-850 hover:border-gray-200"
            }`}>
              <button
                type="button"
                onClick={() => { setActiveMethod("auth_app"); setSecuritySaved(false); }}
                className="w-full p-4 flex items-center gap-4 cursor-pointer outline-none border-none text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-xs font-black text-white flex items-center gap-2">
                    <span>Authenticator App</span>
                    <span className="text-[8px] border border-purple-500/30 text-purple-400 bg-purple-950/20 px-1.5 py-0.5 rounded font-mono uppercase font-extrabold">RECOMMENDED</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-normal font-medium">Use Google Authenticator, Duo, or 1Password to scan code.</p>
                </div>
              </button>

              <AnimatePresence>
                {activeMethod === "auth_app" && !securitySaved && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-5 border-t border-zinc-850/60 overflow-hidden pt-4 flex flex-col gap-4 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                      <MockQRCode />
                      <div className="flex-grow flex flex-col gap-1.5">
                        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Secret Binding Key</span>
                        <div className="px-3.5 py-2 rounded-lg bg-gray-50 border border-zinc-850 text-gray-600 font-mono select-all w-max text-xs font-bold">
                          S2SD-J7X2-K9W1-P3Q4
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium mt-1">
                          Scan the QR code or enter the secret key manually inside your Authenticator app. Enter the resulting 6-digit confirmation pin:
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleVerifyAuthApp} className="flex gap-2 items-center">
                      <div className="flex gap-1">
                        {authPin.map((val, idx) => (
                          <input
                            key={idx}
                            id={`auth-app-pin-${idx}`}
                            type="text"
                            maxLength={1}
                            value={val}
                            onChange={(e) => {
                              if (isNaN(Number(e.target.value))) return;
                              const newPin = [...authPin];
                              newPin[idx] = e.target.value;
                              setAuthPin(newPin);
                              if (e.target.value !== "" && idx < 5) {
                                document.getElementById(`auth-app-pin-${idx + 1}`)?.focus();
                              }
                            }}
                            className="w-8 h-10 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm font-bold text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                          />
                        ))}
                      </div>
                      <button
                        type="submit"
                        disabled={isVerifyingAuth || authPin.includes("")}
                        className="bg-purple-550 hover:bg-purple-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-4.5 py-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {isVerifyingAuth ? "Verifying..." : "Verify"}
                      </button>
                    </form>

                    <div className="text-[9px] font-mono text-zinc-550">
                      DEV NOTE - CONFIRM CODE: <strong className="text-gray-500 font-bold">123456</strong>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Email OTP Option */}
            <div className={`border rounded-2xl overflow-hidden transition-all ${
              activeMethod === "email" 
                ? "bg-purple-955/5 border-purple-500/35 shadow-md" 
                : "bg-white/30 border-zinc-850 hover:border-gray-200"
            }`}>
              <button
                type="button"
                onClick={() => { setActiveMethod("email"); setSecuritySaved(false); }}
                className="w-full p-4 flex items-center gap-4 cursor-pointer outline-none border-none text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Email OTP</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-normal font-medium">Verify logins via temporary codes sent directly to your verified email.</p>
                </div>
              </button>

              <AnimatePresence>
                {activeMethod === "email" && !securitySaved && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-5 border-t border-zinc-850/60 overflow-hidden pt-4 flex flex-col gap-3 text-xs"
                  >
                    <p className="text-[10px] text-gray-400 leading-normal font-medium">
                      Set2Send will dispatch verification PIN parameters to: <strong className="text-gray-600 font-mono">{sessionUser?.email}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={handleEnableEmail2FA}
                      className="bg-white hover:bg-zinc-100 text-zinc-950 text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg w-max cursor-pointer"
                    >
                      Enable Email 2FA
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SMS OTP Option */}
            <div className={`border rounded-2xl overflow-hidden transition-all ${
              activeMethod === "sms" 
                ? "bg-purple-955/5 border-purple-500/35 shadow-md" 
                : "bg-white/30 border-zinc-850 hover:border-gray-200"
            }`}>
              <button
                type="button"
                onClick={() => { setActiveMethod("sms"); setSecuritySaved(false); }}
                className="w-full p-4 flex items-center gap-4 cursor-pointer outline-none border-none text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">SMS OTP</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-normal font-medium">Dispatches SMS confirmation PIN codes to your mobile phone number.</p>
                </div>
              </button>

              <AnimatePresence>
                {activeMethod === "sms" && !securitySaved && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-5 border-t border-zinc-850/60 overflow-hidden pt-4 flex flex-col gap-4 text-xs"
                  >
                    <div className="flex gap-2 items-end">
                      <div className="flex-grow flex flex-col gap-1.5">
                        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Mobile Number</span>
                        <input
                          type="text"
                          value={smsPhone}
                          onChange={(e) => setSmsPhone(e.target.value)}
                          disabled={smsSent}
                          placeholder="e.g. +1 555-0199"
                          className="w-full bg-[#0c0c0e]/80 border border-gray-200 hover:border-zinc-750 focus:border-purple-500 rounded-lg py-2.5 px-3 text-xs text-white outline-none disabled:opacity-50"
                        />
                      </div>
                      {!smsSent && (
                        <button
                          type="button"
                          onClick={handleSendSms}
                          disabled={isSendingSms || !smsPhone}
                          className="bg-white hover:bg-zinc-100 text-zinc-950 text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          {isSendingSms ? "Sending..." : "Send SMS"}
                        </button>
                      )}
                    </div>

                    {smsSent && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-3"
                      >
                        <p className="text-[10px] text-gray-400 font-medium">Enter the 6-digit verification pin sent via SMS:</p>
                        <form onSubmit={handleVerifySms} className="flex gap-2 items-center">
                          <div className="flex gap-1">
                            {smsPin.map((val, idx) => (
                              <input
                                key={idx}
                                id={`sms-otp-pin-${idx}`}
                                type="text"
                                maxLength={1}
                                value={val}
                                onChange={(e) => {
                                  if (isNaN(Number(e.target.value))) return;
                                  const newPin = [...smsPin];
                                  newPin[idx] = e.target.value;
                                  setSmsPin(newPin);
                                  if (e.target.value !== "" && idx < 5) {
                                    document.getElementById(`sms-otp-pin-${idx + 1}`)?.focus();
                                  }
                                }}
                                className="w-8 h-10 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm font-bold text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                              />
                            ))}
                          </div>
                          <button
                            type="submit"
                            disabled={isVerifyingSms || smsPin.includes("")}
                            className="bg-purple-550 hover:bg-purple-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-4.5 py-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                          >
                            {isVerifyingSms ? "Verifying..." : "Verify SMS"}
                          </button>
                        </form>
                        <div className="text-[9px] font-mono text-zinc-550">
                          DEV NOTE - SMS CONFIRM CODE: <strong className="text-gray-500 font-bold">123456</strong>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Footer controls: Skip and Continue */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#E8E4D9]/80">
            <button
              onClick={() => handleSecurityContinue(true)}
              className="px-6 py-3.5 bg-white/60 hover:bg-gray-100/80 text-gray-500 hover:text-zinc-200 border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Skip For Now</span>
            </button>

            <button
              onClick={() => handleSecurityContinue(false)}
              disabled={!securitySaved}
              className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                securitySaved 
                  ? "bg-white text-zinc-950 hover:bg-zinc-100 cursor-pointer shadow-md hover:scale-[1.01]" 
                  : "bg-gray-100/40 text-zinc-600 border border-[#E8E4D9] cursor-not-allowed"
              }`}
            >
              <span>Save & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
