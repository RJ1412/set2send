"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  ChevronRight, 
  HelpCircle,
  Building,
  Sparkles,
  MessageCircle,
  Eye,
  Star
} from "lucide-react";

// Inline Instagram Icon to prevent import failure
const InstagramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const MetaIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.924 16.48c-1.393.208-3.08.312-4.924.312-1.844 0-3.531-.104-4.924-.312-2.18-.328-4.076-1.502-4.076-3.791 0-2.316 1.896-3.504 4.076-3.832 1.393-.208 3.08-.312 4.924-.312 1.844 0 3.531.104 4.924.312 2.18.328 4.076 1.516 4.076 3.832 0 2.29-1.896 3.463-4.076 3.791M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2" />
  </svg>
);

const goals = [
  { id: "leads", title: "Generate Leads", desc: "Acquire contact details automatically from DMs and comments.", icon: "🎯" },
  { id: "emails", title: "Collect Emails", desc: "Build newsletter subscribers by exchanging PDFs or guides.", icon: "✉️" },
  { id: "followers", title: "Grow Followers", desc: "Boost follower counts with follow-to-unlock triggers.", icon: "📈" },
  { id: "sales", title: "Sell Products", desc: "Send checkout and discount coupon codes directly in chats.", icon: "🛍️" },
  { id: "support", title: "Customer Support", desc: "Answer FAQs automatically with interactive help menus.", icon: "🤖" }
];

const templates = [
  { 
    id: "comment_to_dm", 
    title: "Comment to DM", 
    desc: "When users comment a keyword (e.g., 'EBOOK'), immediately send them a direct message with a resource link.", 
    preview: {
      userAction: "Comments 'GROWTH' on your reel",
      botResponse: "Hey! Here's your link to the Guide: set2send.com/guide-pdf 🚀 Let me know if you need anything else!"
    }
  },
  { 
    id: "story_reply", 
    title: "Story Reply Funnel", 
    desc: "Trigger conversations when users reply to your stories. High engagement booster.", 
    preview: {
      userAction: "Replies to your Instagram Story",
      botResponse: "Thanks for checking my story! Here is the discount code I promised: CODE20 (20% OFF) 🎉"
    }
  },
  { 
    id: "keyword_trigger", 
    title: "Keyword Trigger Magnet", 
    desc: "Start automated pipelines when direct messages contain specific predefined words.", 
    preview: {
      userAction: "DMs you the word 'START'",
      botResponse: "Welcome to the automation flow! What is your preferred email address so we can register your account?"
    }
  },
  { 
    id: "follow_to_unlock", 
    title: "Follow to Unlock", 
    desc: "Require users to follow your account to unlock private access to links or media guides.", 
    preview: {
      userAction: "Follows your profile and requests guide",
      botResponse: "Verification success! Thanks for the follow. Here is your secret link: set2send.com/members-vault 🔑"
    }
  }
];

export default function InstagramOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Step 1: Connect Account
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<any>(null);

  // Step 2: Goal Selection
  const [selectedGoal, setSelectedGoal] = useState("leads");

  // Step 3: Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState("comment_to_dm");

  // Step 4: Workspace Name & Finish
  const [workspaceName, setWorkspaceName] = useState("Creator Workspace");
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishStatus, setFinishStatus] = useState("");

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectedAccount({
        username: "set2send_creator",
        name: "Set2Send Creator Account",
        followers: "12.4K",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
      });
    }, 1800);
  };

  const handleFinish = () => {
    setIsFinishing(true);
    
    // Simulate pipeline building
    setFinishStatus("Creating workspace metadata...");
    
    setTimeout(() => {
      setFinishStatus("Provisioning secure API webhooks...");
    }, 800);

    setTimeout(() => {
      setFinishStatus("Saving automation defaults...");
    }, 1600);

    setTimeout(() => {
      // Create session in local storage
      const sessionUser = JSON.parse(localStorage.getItem("active_session") || "{}");
      const updatedSession = {
        ...sessionUser,
        name: sessionUser.name || "Set2Send Demo",
        email: sessionUser.email || "demo@set2send.com",
        workspace: workspaceName,
        channel: "instagram",
        channelUsername: connectedAccount?.username || "set2send_creator",
        goal: selectedGoal,
        template: selectedTemplate
      };

      localStorage.setItem("active_session", JSON.stringify(updatedSession));

      // Append to users list if needed
      const users = JSON.parse(localStorage.getItem("users_db") || "[]");
      const existsIdx = users.findIndex((u: any) => u.email === updatedSession.email);
      if (existsIdx >= 0) {
        users[existsIdx] = { ...users[existsIdx], ...updatedSession };
      } else {
        users.push(updatedSession);
      }
      localStorage.setItem("users_db", JSON.stringify(users));

      setFinishStatus("Redirecting to dashboard...");
      
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

  // Find active template preview
  const activeTemplatePreview = templates.find(t => t.id === selectedTemplate)?.preview;

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col justify-between overflow-x-hidden font-sans relative">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-purple-900/10 via-pink-900/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      {/* Finishing loading screen */}
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
              className="w-16 h-16 rounded-full border-4 border-[#f97316]/20 border-t-[#f97316] mb-8"
            ></motion.div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">Initializing Workspace</h2>
            <p className="text-gray-500 text-xs sm:text-sm font-mono mt-3 uppercase tracking-wider">{finishStatus}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <div className="w-full border-b border-[#E8E4D9]/80 bg-gray-50/20 backdrop-blur-md sticky top-0 z-45">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/onboarding/channel-selection" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white font-semibold transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Select Channel</span>
          </Link>
          
          {/* Channel Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 flex items-center justify-center text-white text-xs shadow-md">
              <InstagramIcon className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-white">Instagram Setup</span>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px] uppercase font-bold tracking-widest">
            <span>Step {step} / 4</span>
          </div>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="w-full bg-white h-1 relative overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500"
            initial={{ width: "25%" }}
            animate={{ width: `${step * 25}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Form Content Container */}
      <div className="flex-grow max-w-5xl w-full mx-auto px-6 py-10 sm:py-16 flex items-center justify-center z-10 relative">
        <div className="w-full max-w-[680px]">
          <AnimatePresence>
            
            {/* STEP 1: CONNECT OAUTH */}
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
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Connect Instagram</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3 max-w-md mx-auto">Authorize Set2Send to manage comments and message automation for your Instagram account.</p>
                </div>

                <div className="bg-white/40 border border-gray-200/80 p-8 sm:p-10 rounded-3xl backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

                  {!isConnected ? (
                    <div className="flex flex-col items-center gap-6 py-4">
                      {/* Connection Graphic */}
                      <div className="flex items-center gap-4.5">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 shadow-md flex items-center justify-center font-extrabold text-[#f97316] text-3xl select-none">
                          S
                        </div>
                        <div className="h-0.5 w-12 border-t-2 border-dashed border-zinc-850"></div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 text-white shadow-lg flex items-center justify-center">
                          <InstagramIcon className="w-8 h-8" />
                        </div>
                      </div>

                      <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className={`w-full max-w-sm py-4 px-6 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3.5 cursor-pointer hover:scale-[1.01] ${
                          isConnecting ? "opacity-60 cursor-wait" : ""
                        }`}
                      >
                        {isConnecting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <MetaIcon className="w-4.5 h-4.5" />
                        )}
                        <span>{isConnecting ? "Requesting Meta Token..." : "Connect with Meta"}</span>
                      </button>
                      
                      <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">By clicking connect, you consent to Meta Business integration rules and grant permissions for messaging APIs.</p>
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
                          alt="Instagram Profile" 
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
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Choose your Goal</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">We will tailor your workspace dashboards and telemetry logs to fit this specific pipeline target.</p>
                </div>

                {/* Goals Selection list */}
                <div className="flex flex-col gap-3">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGoal(g.id)}
                      className={`w-full p-5 rounded-2xl text-left transition-all border flex items-start gap-4.5 cursor-pointer ${
                        selectedGoal === g.id
                          ? "bg-purple-950/20 border-purple-500/40 shadow-md shadow-purple-500/5"
                          : "bg-white/30 border-zinc-850 hover:border-gray-200"
                      }`}
                    >
                      <div className="text-2xl mt-0.5 select-none">{g.icon}</div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-white">{g.title}</h4>
                          {selectedGoal === g.id && (
                            <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-zinc-950">
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

            {/* STEP 3: AUTOMATION TEMPLATE SELECTOR */}
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
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Start with a pre-configured automation script. You can edit every node later inside the visual editor.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Templates Selector Left Side */}
                  <div className="md:col-span-6 flex flex-col gap-3">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                          selectedTemplate === t.id
                            ? "bg-purple-950/20 border-purple-500/40 shadow-sm"
                            : "bg-white/30 border-zinc-850 hover:border-gray-200"
                        }`}
                      >
                        <h4 className="text-xs font-black uppercase tracking-wider text-white">{t.title}</h4>
                        <p className="text-zinc-405 text-[10px] mt-1 leading-relaxed font-medium line-clamp-2">{t.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Template Visual Chat Simulation Preview Panel */}
                  <div className="md:col-span-6 bg-[#FAF9F6] border border-zinc-850 rounded-2xl overflow-hidden shadow-inner flex flex-col h-[280px]">
                    <div className="bg-white/50 border-b border-zinc-850 py-2.5 px-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 flex items-center justify-center text-white text-[8px] font-sans">
                          I
                        </div>
                        <span className="text-[10px] font-extrabold text-white font-mono tracking-wide">CHAT SIMULATION</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono">LIVE PREVIEW</span>
                    </div>

                    <div className="p-4.5 flex-grow flex flex-col gap-4 overflow-y-auto text-xs">
                      
                      {/* User Comment/Action */}
                      {activeTemplatePreview && (
                        <div className="flex items-start gap-2.5 max-w-[85%] self-start">
                          <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
                            alt="User" 
                            className="w-6 h-6 rounded-full object-cover border border-gray-200 mt-0.5"
                          />
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none py-2 px-3 text-gray-600 font-medium">
                            <div className="text-[9px] text-[#f97316] font-extrabold mb-0.5">USER</div>
                            <span>{activeTemplatePreview.userAction}</span>
                          </div>
                        </div>
                      )}

                      {/* Bot Response */}
                      {activeTemplatePreview && (
                        <div className="flex items-start gap-2.5 max-w-[85%] self-end flex-row-reverse">
                          <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 text-[#f97316] font-bold text-[10px] flex items-center justify-center mt-0.5">
                            S
                          </div>
                          <div className="bg-purple-950/30 border border-purple-500/20 rounded-2xl rounded-tr-none py-2 px-3 text-zinc-200 font-medium text-right">
                            <div className="text-[9px] text-purple-400 font-extrabold mb-0.5">SET2SEND BOT</div>
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
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Name your workspace to organize your team parameters, reports, and billing scopes.</p>
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
                      placeholder="e.g. Acme Marketing, Content Team"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm font-medium focus:outline-none focus:border-purple-500/50 transition-colors"
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
                        <span>Connected to Instagram: <strong className="text-zinc-200">@{connectedAccount?.username}</strong></span>
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
                    className="px-8 py-3.5 bg-[#f97316] hover:bg-[#e0650d] text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] shadow-[#f97316]/10"
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

      {/* Footer support panel */}
      <div className="py-6 border-t border-[#E8E4D9] text-center text-[10px] text-zinc-600 font-semibold tracking-wide bg-gray-50/20 backdrop-blur-md">
        <span>Need assistance? Reach our onboarding advisors at </span>
        <a href="#" className="text-[#f97316] hover:underline">support@set2send.com</a>
      </div>

    </div>
  );
}
