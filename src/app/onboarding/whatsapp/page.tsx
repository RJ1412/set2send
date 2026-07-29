"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Building,
  Sparkles,
  Phone,
  Lock,
  MessageSquare
} from "lucide-react";

// Inline WhatsApp Icon
const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const MetaIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.924 16.48c-1.393.208-3.08.312-4.924.312-1.844 0-3.531-.104-4.924-.312-2.18-.328-4.076-1.502-4.076-3.791 0-2.316 1.896-3.504 4.076-3.832 1.393-.208 3.08-.312 4.924-.312 1.844 0 3.531.104 4.924.312 2.18.328 4.076 1.516 4.076 3.832 0 2.29-1.896 3.463-4.076 3.791M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2" />
  </svg>
);

const goals = [
  { id: "sales", title: "Automate Sales", desc: "Share catalogues & coupon codes to finalize orders directly.", icon: "🛍️" },
  { id: "support", title: "Instant Help Desk", desc: "Solve repetitive customer queries automatically.", icon: "🤖" },
  { id: "leads", title: "Collect Leads", desc: "Trigger opt-in funnels and gather client emails.", icon: "🎯" }
];

const templates = [
  { 
    id: "faq_desk", 
    title: "FAQ Support Desk", 
    desc: "Provides quick action buttons for users to get information about pricing, hours, or products.", 
    preview: {
      userAction: "Clicks button 'Pricing Info'",
      botResponse: "Our plans start at $19/mo. You can view all options here: set2send.com/pricing 💳"
    }
  },
  { 
    id: "catalog_funnel", 
    title: "Product Catalog Flow", 
    desc: "Present product lists and capture purchase intent via custom interactive response chips.", 
    preview: {
      userAction: "Sends message: 'Show Products'",
      botResponse: "Here are our top selections! Click 'View Catalog' to browse models in your chat window. 🛒"
    }
  }
];

export default function WhatsAppOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Step 1: Link Account
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedProfile, setConnectedProfile] = useState<any>(null);

  // Step 2: SMS Verification
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Step 3: Goals & Templates
  const [selectedGoal, setSelectedGoal] = useState("sales");
  const [selectedTemplate, setSelectedTemplate] = useState("faq_desk");

  // Step 4: Workspace Name & launch
  const [workspaceName, setWorkspaceName] = useState("WhatsApp Business");
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishStatus, setFinishStatus] = useState("");

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectedProfile({
        businessName: "Set2Send Commerce Hub",
        wabaId: "WABA-902-811-209",
        metaApp: "Set2Send Integration App"
      });
    }, 1700);
  };

  const handleSendCode = () => {
    if (!phoneNumber) return;
    setIsSendingCode(true);
    setTimeout(() => {
      setIsSendingCode(false);
      setCodeSent(true);
    }, 1200);
  };

  const handleVerifyCode = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Autofocus next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setFinishStatus("Creating workspace parameters...");
    
    setTimeout(() => {
      setFinishStatus("Registering WhatsApp webhook nodes...");
    }, 850);

    setTimeout(() => {
      setFinishStatus("Authenticating WhatsApp API token...");
    }, 1700);

    setTimeout(() => {
      const sessionUser = JSON.parse(localStorage.getItem("active_session") || "{}");
      const updatedSession = {
        ...sessionUser,
        name: sessionUser.name || "Set2Send Demo",
        email: sessionUser.email || "demo@set2send.com",
        workspace: workspaceName,
        channel: "whatsapp",
        channelUsername: phoneNumber || "waba_commerce",
        goal: selectedGoal,
        template: selectedTemplate
      };

      localStorage.setItem("active_session", JSON.stringify(updatedSession));

      const users = JSON.parse(localStorage.getItem("users_db") || "[]");
      const existsIdx = users.findIndex((u: any) => u.email === updatedSession.email);
      if (existsIdx >= 0) {
        users[existsIdx] = { ...users[existsIdx], ...updatedSession };
      } else {
        users.push(updatedSession);
      }
      localStorage.setItem("users_db", JSON.stringify(users));

      setFinishStatus("Provisioning completed! Redirecting...");
      
      setTimeout(() => {
        router.push("/onboarding/goal");
      }, 500);
    }, 2500);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const activeTemplatePreview = templates.find(t => t.id === selectedTemplate)?.preview;

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col justify-between overflow-x-hidden font-sans relative">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-emerald-950/15 via-zinc-900/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <AnimatePresence>
        {isFinishing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 mb-8"
            ></motion.div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">Initializing Workspace</h2>
            <p className="text-gray-500 text-xs sm:text-sm font-mono mt-3 uppercase tracking-wider">{finishStatus}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="w-full border-b border-[#E8E4D9]/80 bg-gray-50/20 backdrop-blur-md sticky top-0 z-45">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/onboarding/channel-selection" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white font-semibold transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Select Channel</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-white text-xs shadow-md">
              <WhatsAppIcon className="w-4 h-4 text-emerald-450" />
            </div>
            <span className="text-xs font-black text-white">WhatsApp Setup</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px] uppercase font-bold tracking-widest">
            <span>Step {step} / 4</span>
          </div>
        </div>

        <div className="w-full bg-white h-1 relative overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-400 to-teal-600"
            initial={{ width: "25%" }}
            animate={{ width: `${step * 25}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow max-w-5xl w-full mx-auto px-6 py-10 sm:py-16 flex items-center justify-center z-10 relative">
        <div className="w-full max-w-[680px]">
          <AnimatePresence>
            
            {/* STEP 1: LINK PROFILE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8 text-center"
              >
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">WhatsApp Business</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3 max-w-md mx-auto">Connect your Meta Business Manager containing the active WhatsApp Business Account (WABA).</p>
                </div>

                <div className="bg-white/40 border border-gray-200/80 p-8 sm:p-10 rounded-3xl backdrop-blur-md relative overflow-hidden">
                  {!isConnected ? (
                    <div className="flex flex-col items-center gap-6 py-4">
                      <div className="flex items-center gap-4.5">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 shadow-md flex items-center justify-center font-extrabold text-[#f97316] text-3xl select-none">
                          S
                        </div>
                        <div className="h-0.5 w-12 border-t-2 border-dashed border-zinc-850"></div>
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-white shadow-lg flex items-center justify-center">
                          <WhatsAppIcon className="w-8 h-8 text-emerald-450" />
                        </div>
                      </div>

                      <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className={`w-full max-w-sm py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3.5 cursor-pointer hover:scale-[1.01] ${
                          isConnecting ? "opacity-60 cursor-wait" : ""
                        }`}
                      >
                        {isConnecting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <MetaIcon className="w-4.5 h-4.5" />
                        )}
                        <span>{isConnecting ? "Connecting to Meta..." : "Link WABA via Facebook"}</span>
                      </button>
                      
                      <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">Required permissions: Manage WhatsApp business profile, read logs, edit custom quick buttons.</p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-6 py-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                        <Check className="w-7 h-7" />
                      </div>

                      <div className="bg-gray-50/60 border border-zinc-850 p-5 rounded-2xl w-full max-w-sm text-left flex flex-col gap-2.5">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-black text-white">{connectedProfile?.businessName}</h4>
                          <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold bg-emerald-950/20">CONNECTED</span>
                        </div>
                        <div className="text-zinc-550 text-[10px] font-mono flex flex-col gap-1">
                          <span>ACCOUNT ID: {connectedProfile?.wabaId}</span>
                          <span>SCOPE: {connectedProfile?.metaApp}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => { setConnectedProfile(null); setIsConnected(false); }}
                        className="text-gray-400 hover:text-zinc-350 text-[10px] font-bold uppercase tracking-wider underline cursor-pointer"
                      >
                        Change Business Account
                      </button>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={nextStep}
                    disabled={!isConnected}
                    className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                      isConnected 
                        ? "bg-white text-zinc-950 hover:bg-zinc-100 cursor-pointer shadow-md hover:scale-[1.01]" 
                        : "bg-gray-100/40 text-zinc-650 border border-[#E8E4D9] cursor-not-allowed"
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PHONE NUMBER AND SMS VERIFICATION */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8 text-center"
              >
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Verify Number</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Register your WhatsApp Business phone number. We will send an SMS pin configuration to trigger API status.</p>
                </div>

                <div className="bg-white/40 border border-gray-200/80 p-8 sm:p-10 rounded-3xl backdrop-blur-md text-left flex flex-col gap-6">
                  
                  {/* Phone input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone Number</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. +1 555-0199"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={codeSent || isVerified}
                        className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                      />
                      {!codeSent && (
                        <button
                          onClick={handleSendCode}
                          disabled={!phoneNumber || isSendingCode}
                          className="bg-emerald-550 hover:bg-emerald-600 text-zinc-950 font-bold px-5 py-3.5 text-xs rounded-xl uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isSendingCode ? "Sending..." : "Send Pin"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SMS Input boxes */}
                  {codeSent && !isVerified && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4.5"
                    >
                      <div className="text-xs text-gray-500 font-medium">Enter the 6-digit confirmation PIN code sent to your phone:</div>
                      
                      <div className="flex gap-2.5 justify-between max-w-sm">
                        {verificationCode.map((val, idx) => (
                          <input
                            key={idx}
                            id={`code-${idx}`}
                            type="text"
                            maxLength={1}
                            value={val}
                            onChange={(e) => handleCodeChange(idx, e.target.value)}
                            className="w-12 h-14 bg-gray-50 border border-gray-200 focus:border-emerald-500/50 rounded-xl text-center text-lg font-bold text-white focus:outline-none transition-colors"
                          />
                        ))}
                      </div>

                      <div className="flex gap-4 items-center">
                        <button
                          onClick={handleVerifyCode}
                          disabled={isVerifying || verificationCode.includes("")}
                          className="bg-white hover:bg-zinc-100 text-zinc-950 font-bold px-6 py-3.5 text-xs rounded-xl uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isVerifying ? "Verifying Pin..." : "Verify Code"}
                        </button>
                        <button
                          onClick={() => { setCodeSent(false); setVerificationCode(["", "", "", "", "", ""]); }}
                          className="text-gray-400 hover:text-zinc-350 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Resend Code
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Verified Checkmark banner */}
                  {isVerified && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-950/15 border border-emerald-500/20 p-4.5 rounded-2xl flex items-center gap-3.5 text-emerald-400"
                    >
                      <Check className="w-5 h-5 shrink-0" />
                      <div className="text-xs font-semibold">Number Verified! Your WhatsApp API connectivity has been activated on Set2Send server nodes.</div>
                    </motion.div>
                  )}

                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#E8E4D9]/80">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3.5 bg-white/60 hover:bg-gray-100 text-zinc-350 border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={!isVerified}
                    className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                      isVerified 
                        ? "bg-white text-zinc-950 hover:bg-zinc-100 cursor-pointer shadow-md" 
                        : "bg-gray-100/40 text-zinc-600 border border-[#E8E4D9] cursor-not-allowed"
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: GOALS AND TEMPLATES */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Goal & Templates</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Select the core objective and chatbot structure for incoming messages.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  <div className="md:col-span-6 flex flex-col gap-5">
                    
                    {/* Goal Selection */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">Objective</label>
                      <div className="flex flex-col gap-2">
                        {goals.map((g) => (
                          <button
                            key={g.id}
                            onClick={() => setSelectedGoal(g.id)}
                            className={`p-3.5 rounded-xl text-left border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2.5 ${
                              selectedGoal === g.id
                                ? "bg-emerald-950/10 border-emerald-500/30 text-white"
                                : "bg-white/20 border-zinc-850 hover:border-gray-200 text-gray-500"
                            }`}
                          >
                            <span>{g.icon}</span>
                            <span>{g.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Template Selection */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">Startup Flow</label>
                      <div className="flex flex-col gap-2">
                        {templates.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTemplate(t.id)}
                            className={`p-3.5 rounded-xl text-left border text-xs font-semibold cursor-pointer transition-all ${
                              selectedTemplate === t.id
                                ? "bg-emerald-950/10 border-emerald-500/30 text-white"
                                : "bg-white/20 border-zinc-850 hover:border-gray-200 text-gray-500"
                            }`}
                          >
                            <div>{t.title}</div>
                            <div className="text-[9px] text-gray-400 mt-0.5 leading-normal font-medium">{t.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Chat Sim */}
                  <div className="md:col-span-6 bg-[#FAF9F6] border border-zinc-850 rounded-2xl overflow-hidden shadow-inner flex flex-col h-[280px]">
                    <div className="bg-white/50 border-b border-zinc-850 py-2.5 px-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450 text-[8px] font-sans">
                          W
                        </div>
                        <span className="text-[10px] font-extrabold text-white font-mono tracking-wide">WHATSAPP SIMULATOR</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono">LIVE PREVIEW</span>
                    </div>

                    <div className="p-4.5 flex-grow flex flex-col gap-4 overflow-y-auto text-xs">
                      {activeTemplatePreview && (
                        <div className="flex items-start gap-2.5 max-w-[85%] self-start">
                          <div className="w-6 h-6 rounded-full bg-zinc-850 text-gray-500 font-bold text-[10px] flex items-center justify-center mt-0.5">
                            U
                          </div>
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none py-2 px-3 text-gray-600 font-medium">
                            <div className="text-[9px] text-[#f97316] font-extrabold mb-0.5">CUSTOMER</div>
                            <span>{activeTemplatePreview.userAction}</span>
                          </div>
                        </div>
                      )}

                      {activeTemplatePreview && (
                        <div className="flex items-start gap-2.5 max-w-[85%] self-end flex-row-reverse">
                          <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 text-[#f97316] font-bold text-[10px] flex items-center justify-center mt-0.5">
                            S
                          </div>
                          <div className="bg-emerald-950/20 border border-emerald-550/20 rounded-2xl rounded-tr-none py-2 px-3 text-zinc-200 font-medium text-right">
                            <div className="text-[9px] text-emerald-450 font-extrabold mb-0.5">BUSINESS BOT</div>
                            <span>{activeTemplatePreview.botResponse}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#E8E4D9]/80">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3.5 bg-white/60 hover:bg-gray-100 text-zinc-350 border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={nextStep}
                    className="px-8 py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: WORKSPACE CREATION */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Create Workspace</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Name your workspace to organize your team parameters and telemetry logs.</p>
                </div>

                <div className="bg-white/40 border border-gray-200/80 p-8 sm:p-10 rounded-3xl backdrop-blur-md text-left flex flex-col gap-6">
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="workspace-name" className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" />
                      <span>Workspace Name</span>
                    </label>
                    <input
                      id="workspace-name"
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      placeholder="e.g. WhatsApp Commerce"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>

                  <div className="bg-gray-50/40 border border-zinc-850 p-4.5 rounded-2xl flex flex-col gap-3">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#f97316] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Provisioning Specs</span>
                    </h4>
                    
                    <ul className="text-xs text-gray-500 font-medium flex flex-col gap-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-450 shrink-0" />
                        <span>Connected Number: <strong className="text-zinc-200">{phoneNumber}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-450 shrink-0" />
                        <span>Core Objective: <strong className="text-zinc-200">{goals.find(g=>g.id === selectedGoal)?.title}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-450 shrink-0" />
                        <span>Initial Flow: <strong className="text-zinc-200">{templates.find(t=>t.id === selectedTemplate)?.title}</strong></span>
                      </li>
                    </ul>
                  </div>

                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#E8E4D9]/80">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3.5 bg-white/60 hover:bg-gray-100 text-zinc-350 border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleFinish}
                    className="px-8 py-3.5 bg-[#f97316] hover:bg-[#e0650d] text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Launch Workspace</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <div className="py-6 border-t border-[#E8E4D9] text-center text-[10px] text-zinc-600 font-semibold tracking-wide bg-gray-50/20 backdrop-blur-md">
        <span>Need assistance? Reach our onboarding advisors at </span>
        <a href="#" className="text-[#f97316] hover:underline">support@set2send.com</a>
      </div>

    </div>
  );
}
