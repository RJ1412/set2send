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
  MessageCircle,
  Video
} from "lucide-react";

// Inline TikTok Icon
const TikTokIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.07-2.88-.54-4.08-1.37-.41-.29-.77-.62-1.09-.99v6.02c0 1.93-.53 3.89-1.74 5.37-1.46 1.86-3.88 2.94-6.26 2.82-2.55-.08-5.02-1.51-6.19-3.83-1.47-2.82-1.07-6.59 1.05-8.98 1.67-1.89 4.29-2.78 6.78-2.31v4.11c-1.53-.47-3.27-.05-4.36 1.06-1.12 1.15-1.39 3.05-.63 4.5.73 1.42 2.37 2.27 3.96 2.09 1.67-.14 3.12-1.44 3.29-3.11.05-.44.03-.89.03-1.33V.02z" />
  </svg>
);

const goals = [
  { id: "leads", title: "Acquire Leads", desc: "Collect phone numbers & emails from viewers of viral videos.", icon: "🎯" },
  { id: "followers", title: "Grow Community", desc: "Build account followers through automated interaction cycles.", icon: "📈" },
  { id: "views", title: "Drive Video Views", desc: "Increase loop interactions to trigger TikTok algorithmic pushes.", icon: "🔥" },
  { id: "support", title: "Instant DM Support", desc: "Manage inbound help queries via interactive DM reply chains.", icon: "🤖" }
];

const templates = [
  { 
    id: "comment_reply", 
    title: "Comment Auto-Response", 
    desc: "When users comment a specific trigger word, reply to their comment and ping their inbox with a download link.", 
    preview: {
      userAction: "Comments 'WANT' on your TikTok video",
      botResponse: "Replying to comment: Check your inbox! 📬 Direct messaged you the signup code. Enjoy!"
    }
  },
  { 
    id: "dm_keyword", 
    title: "Inbound DM Funnel", 
    desc: "Deploy interactive menus whenever a user opens a DM chat with your TikTok channel.", 
    preview: {
      userAction: "DMs you the word 'DEAL'",
      botResponse: "Thanks for reaching out! Click here to redeem your 15% discount coupon: set2send.com/tiktok15 🎟️"
    }
  }
];

export default function TikTokOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Step 1: Connect Account
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<any>(null);

  // Step 2: Goal Selection
  const [selectedGoal, setSelectedGoal] = useState("leads");

  // Step 3: Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState("comment_reply");

  // Step 4: Workspace Name & Finish
  const [workspaceName, setWorkspaceName] = useState("TikTok Creator Hub");
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishStatus, setFinishStatus] = useState("");

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectedAccount({
        username: "set2send_tiktok",
        name: "TikTok Creator Account",
        followers: "89.5K",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
      });
    }, 1800);
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setFinishStatus("Creating workspace metadata...");
    
    setTimeout(() => {
      setFinishStatus("Provisioning TikTok webhook listeners...");
    }, 800);

    setTimeout(() => {
      setFinishStatus("Linking authorization grants...");
    }, 1650);

    setTimeout(() => {
      const sessionUser = JSON.parse(localStorage.getItem("active_session") || "{}");
      const updatedSession = {
        ...sessionUser,
        name: sessionUser.name || "Set2Send Demo",
        email: sessionUser.email || "demo@set2send.com",
        workspace: workspaceName,
        channel: "tiktok",
        channelUsername: connectedAccount?.username || "set2send_tiktok",
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

      setFinishStatus("Success! Launching dashboard...");
      
      setTimeout(() => {
        router.push("/onboarding/goal");
      }, 500);
    }, 2400);
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
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-cyan-900/10 via-rose-900/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

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
              className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 mb-8"
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
            <div className="w-7 h-7 rounded-lg bg-black border border-gray-200 flex items-center justify-center text-white text-xs shadow-md">
              <TikTokIcon className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-white">TikTok Setup</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px] uppercase font-bold tracking-widest">
            <span>Step {step} / 4</span>
          </div>
        </div>

        <div className="w-full bg-white h-1 relative overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-400 via-zinc-800 to-rose-500"
            initial={{ width: "25%" }}
            animate={{ width: `${step * 25}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-5xl w-full mx-auto px-6 py-10 sm:py-16 flex items-center justify-center z-10 relative">
        <div className="w-full max-w-[680px]">
          <AnimatePresence>
            
            {/* STEP 1: CONNECT TIKTOK */}
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
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Connect TikTok</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3 max-w-md mx-auto">Authorize Set2Send to access your video comments and manage direct messages.</p>
                </div>

                <div className="bg-white/40 border border-gray-200/80 p-8 sm:p-10 rounded-3xl backdrop-blur-md relative overflow-hidden">
                  {!isConnected ? (
                    <div className="flex flex-col items-center gap-6 py-4">
                      <div className="flex items-center gap-4.5">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 shadow-md flex items-center justify-center font-extrabold text-[#f97316] text-3xl select-none">
                          S
                        </div>
                        <div className="h-0.5 w-12 border-t-2 border-dashed border-zinc-850"></div>
                        <div className="w-16 h-16 rounded-2xl bg-black border border-zinc-855 text-white shadow-lg flex items-center justify-center">
                          <TikTokIcon className="w-7 h-7" />
                        </div>
                      </div>

                      <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className={`w-full max-w-sm py-4 px-6 bg-white hover:bg-zinc-150 text-zinc-950 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3.5 cursor-pointer hover:scale-[1.01] ${
                          isConnecting ? "opacity-60 cursor-wait" : ""
                        }`}
                      >
                        {isConnecting ? (
                          <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <TikTokIcon className="w-4.5 h-4.5" />
                        )}
                        <span>{isConnecting ? "Requesting TikTok Authorization..." : "Authorize TikTok Account"}</span>
                      </button>
                      
                      <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">OAuth connection guarantees safe token handling according to TikTok Dev Portal rules.</p>
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
                        <img 
                          src={connectedAccount?.image} 
                          alt="TikTok Profile" 
                          className="w-11 h-11 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <h4 className="text-sm font-black text-white">@{connectedAccount?.username}</h4>
                          <p className="text-gray-400 text-[10px] mt-0.5 font-medium">{connectedAccount?.name} • {connectedAccount?.followers} followers</p>
                        </div>
                        <div className="ml-auto text-emerald-450 font-semibold text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Linked</span>
                        </div>
                      </div>

                      <button
                        onClick={() => { setConnectedAccount(null); setIsConnected(false); }}
                        className="text-gray-400 hover:text-zinc-350 text-[10px] font-bold uppercase tracking-wider underline cursor-pointer"
                      >
                        Disconnect Account
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
                        : "bg-gray-100/40 text-zinc-600 border border-[#E8E4D9] cursor-not-allowed"
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: GOAL SELECTION */}
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
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Determine Objective</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Which KPI matters most to you for TikTok automation?</p>
                </div>

                <div className="flex flex-col gap-3">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGoal(g.id)}
                      className={`w-full p-5 rounded-2xl text-left transition-all border flex items-start gap-4.5 cursor-pointer ${
                        selectedGoal === g.id
                          ? "bg-cyan-950/10 border-cyan-500/30 shadow-md"
                          : "bg-white/30 border-zinc-850 hover:border-gray-200"
                      }`}
                    >
                      <div className="text-2xl mt-0.5 select-none">{g.icon}</div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-white">{g.title}</h4>
                          {selectedGoal === g.id && (
                            <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-zinc-950">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed font-medium">{g.desc}</p>
                      </div>
                    </button>
                  ))}
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
                    className="px-8 py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.01]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: TEMPLATES */}
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
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Select a Template</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Jumpstart interactions with an optimized comment-to-inbox trigger setup.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  <div className="md:col-span-6 flex flex-col gap-3">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                          selectedTemplate === t.id
                            ? "bg-cyan-955/10 border-cyan-500/30 shadow-sm"
                            : "bg-white/30 border-zinc-850 hover:border-gray-200"
                        }`}
                      >
                        <h4 className="text-xs font-black uppercase tracking-wider text-white">{t.title}</h4>
                        <p className="text-zinc-405 text-[10px] mt-1 leading-relaxed font-medium line-clamp-2">{t.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Visual Chat Sim */}
                  <div className="md:col-span-6 bg-[#FAF9F6] border border-zinc-850 rounded-2xl overflow-hidden shadow-inner flex flex-col h-[280px]">
                    <div className="bg-white/50 border-b border-zinc-850 py-2.5 px-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-white text-[8px] font-sans">
                          T
                        </div>
                        <span className="text-[10px] font-extrabold text-white font-mono tracking-wide">TIKTOK CHAT SIMULATION</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono">LIVE PREVIEW</span>
                    </div>

                    <div className="p-4.5 flex-grow flex flex-col gap-4 overflow-y-auto text-xs">
                      {activeTemplatePreview && (
                        <div className="flex items-start gap-2.5 max-w-[85%] self-start">
                          <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
                            alt="User" 
                            className="w-6 h-6 rounded-full object-cover border border-gray-200 mt-0.5"
                          />
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none py-2 px-3 text-gray-600 font-medium">
                            <div className="text-[9px] text-[#f97316] font-extrabold mb-0.5">VIEWER</div>
                            <span>{activeTemplatePreview.userAction}</span>
                          </div>
                        </div>
                      )}

                      {activeTemplatePreview && (
                        <div className="flex items-start gap-2.5 max-w-[85%] self-end flex-row-reverse">
                          <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 text-[#f97316] font-bold text-[10px] flex items-center justify-center mt-0.5">
                            S
                          </div>
                          <div className="bg-cyan-950/20 border border-cyan-550/20 rounded-2xl rounded-tr-none py-2 px-3 text-zinc-200 font-medium text-right">
                            <div className="text-[9px] text-cyan-400 font-extrabold mb-0.5">SET2SEND BOT</div>
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
                    className="px-8 py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.01]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: WORKSPACE SETUP */}
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
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Name your workspace to organize team settings and reports.</p>
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
                      placeholder="e.g. TikTok Marketing Team"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm font-medium focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>

                  <div className="bg-gray-50/40 border border-zinc-850 p-4.5 rounded-2xl flex flex-col gap-3">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#f97316] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Workspace Details</span>
                    </h4>
                    <ul className="text-xs text-gray-500 font-medium flex flex-col gap-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-450 shrink-0" />
                        <span>Connected TikTok: <strong className="text-zinc-200">@{connectedAccount?.username}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-450 shrink-0" />
                        <span>Target Objective: <strong className="text-zinc-200">{goals.find(g=>g.id === selectedGoal)?.title}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-450 shrink-0" />
                        <span>Core Template: <strong className="text-zinc-200">{templates.find(t=>t.id === selectedTemplate)?.title}</strong></span>
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
                    className="px-8 py-3.5 bg-[#f97316] hover:bg-[#e0650d] text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.01]"
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
