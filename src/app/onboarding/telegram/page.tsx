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
  Lock,
  Terminal,
  HelpCircle
} from "lucide-react";

// Inline Telegram Icon
const TelegramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.61l-1.91 9c-.14.65-.53.81-1.08.5l-2.91-2.15-1.4 1.35c-.15.15-.28.28-.58.28l.2-2.94 5.35-4.83c.23-.21-.05-.32-.35-.12L10.02 12.5l-2.85-.89c-.62-.2-.63-.62.13-.92l11.13-4.29c.52-.19.97.12.83.71z" />
  </svg>
);

const goals = [
  { id: "support", title: "Support Helpdesk", desc: "Automate responses to community questions inside a dedicated support bot.", icon: "🤖" },
  { id: "broadcast", title: "Announcements & Broadcasts", desc: "Send manual or triggered broadcasts to all bot subscribers.", icon: "📣" },
  { id: "leads", title: "Collect Leads", desc: "Trigger opt-in captures and record client data inside telemetry logs.", icon: "🎯" }
];

const templates = [
  { 
    id: "keyboard_commands", 
    title: "Command Responder Flow", 
    desc: "Listen for default commands like /start or /help and show custom interactive keyboards.", 
    preview: {
      userAction: "Sends command: /start",
      botResponse: "Welcome to our channel! 🤖 What would you like to explore? Click a command button: [About Us] [Get Pricing] [Support]"
    }
  },
  { 
    id: "welcome_funnel", 
    title: "Welcome Greeting Flow", 
    desc: "Greet new subscribers and collect their emails automatically.", 
    preview: {
      userAction: "DMs your bot for the first time",
      botResponse: "Thanks for starting a conversation! Send me your email address so we can synchronize your billing profile."
    }
  }
];

export default function TelegramOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Step 1 & 2: Token Entry
  const [botToken, setBotToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedBotInfo, setVerifiedBotInfo] = useState<any>(null);

  // Step 3: Goals & Templates
  const [selectedGoal, setSelectedGoal] = useState("support");
  const [selectedTemplate, setSelectedTemplate] = useState("keyboard_commands");

  // Step 4: Workspace Name & launch
  const [workspaceName, setWorkspaceName] = useState("Telegram Bot Hub");
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishStatus, setFinishStatus] = useState("");

  const handleVerifyToken = () => {
    // Basic Telegram token format validation: digits:alphanumeric characters
    const tokenRegex = /^\d+:[A-Za-z0-9_-]+$/;
    if (!tokenRegex.test(botToken.trim())) {
      setTokenError("Invalid Token format. Ensure format is: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ");
      return;
    }
    
    setTokenError("");
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setVerifiedBotInfo({
        username: "Set2SendHelpBot",
        name: "Set2Send Support Agent"
      });
    }, 1800);
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setFinishStatus("Creating workspace settings...");
    
    setTimeout(() => {
      setFinishStatus("Configuring Telegram bot webhook hooks...");
    }, 800);

    setTimeout(() => {
      setFinishStatus("Verifying Bot API access logs...");
    }, 1650);

    setTimeout(() => {
      const sessionUser = JSON.parse(localStorage.getItem("active_session") || "{}");
      const updatedSession = {
        ...sessionUser,
        name: sessionUser.name || "Set2Send Demo",
        email: sessionUser.email || "demo@set2send.com",
        workspace: workspaceName,
        channel: "telegram",
        channelUsername: verifiedBotInfo?.username || "set2send_bot",
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
    }, 2400);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const activeTemplatePreview = templates.find(t => t.id === selectedTemplate)?.preview;

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col justify-between overflow-x-hidden font-sans relative">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-sky-950/15 via-zinc-900/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

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
              className="w-16 h-16 rounded-full border-4 border-sky-500/20 border-t-sky-500 mb-8"
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
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-white text-xs shadow-md">
              <TelegramIcon className="w-4 h-4 text-sky-450" />
            </div>
            <span className="text-xs font-black text-white">Telegram Setup</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px] uppercase font-bold tracking-widest">
            <span>Step {step} / 3</span>
          </div>
        </div>

        <div className="w-full bg-white h-1 relative overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-sky-400 to-blue-600"
            initial={{ width: "33%" }}
            animate={{ width: `${step * 33.33}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow max-w-5xl w-full mx-auto px-6 py-10 sm:py-16 flex items-center justify-center z-10 relative">
        <div className="w-full max-w-[680px]">
          <AnimatePresence>
            
            {/* STEP 1: TOKEN CONFIG */}
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
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Connect Bot API</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3 max-w-md mx-auto">Input the HTTP Bot API Token. Set2Send will securely monitor messages using standard Telegram webhooks.</p>
                </div>

                <div className="bg-white/40 border border-gray-200/80 p-8 sm:p-10 rounded-3xl backdrop-blur-md text-left flex flex-col gap-6">
                  
                  {!isVerified ? (
                    <div className="flex flex-col gap-5">
                      
                      {/* Token Form */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Telegram Bot Token</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                          value={botToken}
                          onChange={(e) => setBotToken(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm font-mono focus:outline-none focus:border-sky-500/50 transition-colors"
                        />
                        {tokenError && (
                          <div className="text-rose-400 text-[10px] font-semibold mt-1 flex items-center gap-1">
                            <span>⚠️</span>
                            <span>{tokenError}</span>
                          </div>
                        )}
                      </div>

                      {/* BotFather Helper Banner */}
                      <div className="p-4 rounded-xl bg-gray-50/60 border border-zinc-850 text-gray-500 text-xs flex gap-3">
                        <HelpCircle className="w-5 h-5 text-sky-450 shrink-0 mt-0.5" />
                        <div className="leading-relaxed">
                          <div className="font-extrabold text-white mb-0.5">How to generate a bot API token?</div>
                          Open Telegram and start a chat with <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline hover:text-sky-300 font-bold">@BotFather</a>. Send the message <code className="bg-white px-1 py-0.5 border border-gray-200 rounded font-mono text-[10px] font-bold text-zinc-200">/newbot</code> and follow instructions to register name. Copy-paste the resulting HTTP API token here.
                        </div>
                      </div>

                      <button
                        onClick={handleVerifyToken}
                        disabled={isVerifying || !botToken}
                        className="w-full py-4 px-6 bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3.5 cursor-pointer hover:scale-[1.01]"
                      >
                        {isVerifying ? (
                          <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <TelegramIcon className="w-4.5 h-4.5" />
                        )}
                        <span>{isVerifying ? "Verifying Token..." : "Connect Bot API"}</span>
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-6 py-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Check className="w-7 h-7" />
                      </div>

                      <div className="bg-gray-50/60 border border-zinc-850 p-4.5 rounded-2xl flex items-center gap-4 w-full max-w-sm text-left">
                        <div className="w-11 h-11 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-450 text-xl flex items-center justify-center font-sans">
                          🤖
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white">{verifiedBotInfo?.name}</h4>
                          <p className="text-gray-400 text-[10px] mt-0.5 font-medium">@{verifiedBotInfo?.username}</p>
                        </div>
                        <div className="ml-auto text-emerald-450 font-semibold text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          <span>Verified</span>
                        </div>
                      </div>

                      <button
                        onClick={() => { setIsVerified(false); setVerifiedBotInfo(null); setBotToken(""); }}
                        className="text-gray-400 hover:text-zinc-350 text-[10px] font-bold uppercase tracking-wider underline cursor-pointer"
                      >
                        Use a Different Bot Token
                      </button>
                    </motion.div>
                  )}

                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={nextStep}
                    disabled={!isVerified}
                    className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                      isVerified 
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

            {/* STEP 2: GOALS AND TEMPLATES */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Goal & Templates</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Select the core objective and chatbot structure for incoming telegram commands.</p>
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
                                ? "bg-sky-955/20 border-sky-500/30 text-white"
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
                      <label className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">Startup Command Flow</label>
                      <div className="flex flex-col gap-2">
                        {templates.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTemplate(t.id)}
                            className={`p-3.5 rounded-xl text-left border text-xs font-semibold cursor-pointer transition-all ${
                              selectedTemplate === t.id
                                ? "bg-sky-955/20 border-sky-500/30 text-white"
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
                        <div className="w-5 h-5 rounded-full bg-sky-550/10 border border-sky-500/20 flex items-center justify-center text-sky-450 text-[8px] font-sans">
                          T
                        </div>
                        <span className="text-[10px] font-extrabold text-white font-mono tracking-wide">TELEGRAM BOT SIMULATION</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono">LIVE PREVIEW</span>
                    </div>

                    <div className="p-4.5 flex-grow flex flex-col gap-4 overflow-y-auto text-xs">
                      {activeTemplatePreview && (
                        <div className="flex items-start gap-2.5 max-w-[85%] self-start">
                          <div className="w-6 h-6 rounded-full bg-zinc-85" />
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none py-2 px-3 text-gray-600 font-medium">
                            <div className="text-[9px] text-[#f97316] font-extrabold mb-0.5">SUBSCRIBER</div>
                            <span>{activeTemplatePreview.userAction}</span>
                          </div>
                        </div>
                      )}

                      {activeTemplatePreview && (
                        <div className="flex items-start gap-2.5 max-w-[85%] self-end flex-row-reverse">
                          <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 text-[#f97316] font-bold text-[10px] flex items-center justify-center mt-0.5">
                            S
                          </div>
                          <div className="bg-sky-955/20 border border-sky-550/20 rounded-2xl rounded-tr-none py-2 px-3 text-zinc-200 font-medium text-right">
                            <div className="text-[9px] text-sky-400 font-extrabold mb-0.5">BOT AGENT</div>
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
                    className="px-8 py-3.5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: WORKSPACE CREATION */}
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
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Create Workspace</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Name your workspace to organize your team parameters and billing scopes.</p>
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
                      placeholder="e.g. Telegram Channel Hub"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm font-medium focus:outline-none focus:border-sky-500/50 transition-colors"
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
                        <span>Connected Telegram Bot: <strong className="text-zinc-200">@{verifiedBotInfo?.username}</strong></span>
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

      <div className="py-6 border-t border-[#E8E4D9] text-center text-[10px] text-zinc-650 font-semibold tracking-wide bg-gray-50/20 backdrop-blur-md">
        <span>Need assistance? Reach our onboarding advisors at </span>
        <a href="#" className="text-[#f97316] hover:underline">support@set2send.com</a>
      </div>

    </div>
  );
}
