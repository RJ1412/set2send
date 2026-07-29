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
  Flag,
  Settings
} from "lucide-react";

// Inline Messenger Icon
const MessengerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.31 14.793l-3.048-3.253-5.947 3.253 6.54-6.942 3.048 3.253 5.947-3.253-6.54 6.942z" />
  </svg>
);

const MetaIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.924 16.48c-1.393.208-3.08.312-4.924.312-1.844 0-3.531-.104-4.924-.312-2.18-.328-4.076-1.502-4.076-3.791 0-2.316 1.896-3.504 4.076-3.832 1.393-.208 3.08-.312 4.924-.312 1.844 0 3.531.104 4.924.312 2.18.328 4.076 1.516 4.076 3.832 0 2.29-1.896 3.463-4.076 3.791M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2" />
  </svg>
);

const facebookPages = [
  { id: "page_1", name: "Set2Send Agency", category: "Marketing & Tech", fans: "15.2K" },
  { id: "page_2", name: "Alex Rivers Creator", category: "Creator / Public Figure", fans: "4.8K" },
  { id: "page_3", name: "Modern Commerce Shop", category: "Retail / eCommerce", fans: "29.1K" }
];

const permissionToggles = [
  { id: "read_inbox", label: "Read Page inbox and threads", desc: "Allows analyzing messages to generate responses.", required: true },
  { id: "manage_comments", label: "Access and reply to Page comments", desc: "Required to support comment-to-DM triggers.", required: true },
  { id: "send_messages", label: "Send messages as Facebook Page", desc: "Allows chatbot to reply to customer inquiries.", required: true },
  { id: "view_analytics", label: "Access Page insights & metrics", desc: "Allows building dashboard telemetry graphs.", required: false }
];

const goals = [
  { id: "leads", title: "Generate Leads", desc: "Gather phone/emails via direct question flow nodes.", icon: "🎯" },
  { id: "support", title: "Customer Support", desc: "Reply to FAQs with multi-choice action chips.", icon: "🤖" },
  { id: "community", title: "Welcome Sequence", desc: "Engage fans instantly when they open a chat.", icon: "👋" }
];

const templates = [
  { 
    id: "comments_dm", 
    title: "Comments to DM Auto-Reply", 
    desc: "Post a public reply to comment and open a DM containing the requested link.", 
    preview: {
      userAction: "Comments 'INFO' on Page post",
      botResponse: "Check your messages! 💬 Sending you the onboarding document."
    }
  },
  { 
    id: "welcome_greeting", 
    title: "Welcome Funnel", 
    desc: "Provides interactive buttons immediately when a customer clicks 'Get Started'.", 
    preview: {
      userAction: "Clicks 'Get Started' button in chat",
      botResponse: "Hi there! How can we assist you today? 🌟 Choose a topic: [Pricing] [About Us] [Contact Support]"
    }
  }
];

export default function MessengerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Step 1: Connect Meta Account & Pick Page
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPage, setSelectedPage] = useState("page_1");

  // Step 2: Grant permissions
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    read_inbox: true,
    manage_comments: true,
    send_messages: true,
    view_analytics: false
  });
  const [isGranting, setIsGranting] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Step 3: Goal & Template
  const [selectedGoal, setSelectedGoal] = useState("leads");
  const [selectedTemplate, setSelectedTemplate] = useState("comments_dm");

  // Step 4: Workspace launch
  const [workspaceName, setWorkspaceName] = useState("FB Messenger Hub");
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishStatus, setFinishStatus] = useState("");

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 1500);
  };

  const handleTogglePerm = (id: string, isRequired: boolean) => {
    if (isRequired) return; // Cannot toggle required permissions
    setPermissions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGrantPermissions = () => {
    setIsGranting(true);
    setTimeout(() => {
      setIsGranting(false);
      setPermissionsGranted(true);
    }, 1300);
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setFinishStatus("Creating workspace settings...");
    
    setTimeout(() => {
      setFinishStatus("Registering Messenger webhook sockets...");
    }, 800);

    setTimeout(() => {
      setFinishStatus("Linking Meta access credentials...");
    }, 1600);

    setTimeout(() => {
      const sessionUser = JSON.parse(localStorage.getItem("active_session") || "{}");
      const pageName = facebookPages.find(p => p.id === selectedPage)?.name || "Messenger Page";
      const updatedSession = {
        ...sessionUser,
        name: sessionUser.name || "Set2Send Demo",
        email: sessionUser.email || "demo@set2send.com",
        workspace: workspaceName,
        channel: "messenger",
        channelUsername: pageName,
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
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const activeTemplatePreview = templates.find(t => t.id === selectedTemplate)?.preview;

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col justify-between overflow-x-hidden font-sans relative">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-blue-950/15 via-zinc-900/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

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
              className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 mb-8"
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
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-white text-xs shadow-md">
              <MessengerIcon className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-xs font-black text-white">Messenger Setup</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px] uppercase font-bold tracking-widest">
            <span>Step {step} / 4</span>
          </div>
        </div>

        <div className="w-full bg-white h-1 relative overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
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
            
            {/* STEP 1: CHOOSE FACEBOOK PAGE */}
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
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Select Page</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3 max-w-md mx-auto">Authenticate your Facebook profile and choose the page you want to automate.</p>
                </div>

                <div className="bg-white/40 border border-gray-200/80 p-8 sm:p-10 rounded-3xl backdrop-blur-md relative overflow-hidden">
                  {!isConnected ? (
                    <div className="flex flex-col items-center gap-6 py-4">
                      <div className="flex items-center gap-4.5">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 shadow-md flex items-center justify-center font-extrabold text-[#f97316] text-3xl select-none">
                          S
                        </div>
                        <div className="h-0.5 w-12 border-t-2 border-dashed border-zinc-850"></div>
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-white shadow-lg flex items-center justify-center">
                          <MessengerIcon className="w-8 h-8 text-blue-400" />
                        </div>
                      </div>

                      <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className={`w-full max-w-sm py-4 px-6 bg-[#1877F2] hover:bg-[#166fe5] text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3.5 cursor-pointer hover:scale-[1.01] ${
                          isConnecting ? "opacity-60 cursor-wait" : ""
                        }`}
                      >
                        {isConnecting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <MetaIcon className="w-4.5 h-4.5" />
                        )}
                        <span>{isConnecting ? "Logging in to Meta..." : "Log In with Facebook"}</span>
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-left flex flex-col gap-4"
                    >
                      <div className="text-xs font-bold text-gray-500 flex items-center gap-2">
                        <Flag className="w-4 h-4" />
                        <span>SELECT FACEBOOK PAGE</span>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        {facebookPages.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPage(p.id)}
                            className={`p-4 rounded-xl text-left border flex items-center gap-4 cursor-pointer transition-all ${
                              selectedPage === p.id
                                ? "bg-blue-950/20 border-blue-500/40 shadow-sm"
                                : "bg-gray-50/40 border-zinc-850 hover:border-gray-200"
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm">
                              📄
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-sm font-black text-white">{p.name}</h4>
                              <p className="text-zinc-550 text-[10px] mt-0.5 font-medium">{p.category} • {p.fans} fans</p>
                            </div>
                            {selectedPage === p.id && (
                              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-zinc-950">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => { setIsConnected(false); }}
                        className="text-gray-400 hover:text-zinc-350 text-[10px] font-bold uppercase tracking-wider underline cursor-pointer mt-2"
                      >
                        Change Facebook Account
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

            {/* STEP 2: META PERMISSIONS CHECKLIST */}
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
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">Meta Permissions</h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Grant Meta Graph API consents so Set2Send can monitor inboxes and post comment replies.</p>
                </div>

                <div className="bg-white/40 border border-gray-200/80 p-8 sm:p-10 rounded-3xl backdrop-blur-md text-left flex flex-col gap-6">
                  
                  {!permissionsGranted ? (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-3">
                        {permissionToggles.map((p) => (
                          <div key={p.id} className="p-4 rounded-xl bg-gray-50/40 border border-zinc-850 flex items-start justify-between gap-4">
                            <div className="text-left">
                              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                                {p.label}
                                {p.required && (
                                  <span className="text-[8px] font-mono font-extrabold uppercase border border-red-500/30 text-red-400 bg-red-950/20 px-1.5 py-0.5 rounded">REQUIRED</span>
                                )}
                              </h4>
                              <p className="text-gray-400 text-[10px] leading-relaxed mt-1 font-medium">{p.desc}</p>
                            </div>
                            
                            <button
                              onClick={() => handleTogglePerm(p.id, p.required)}
                              disabled={p.required}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-250 cursor-pointer ${
                                permissions[p.id] ? "bg-blue-500" : "bg-gray-100"
                              } ${p.required ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-gray-50 transition-transform duration-250 ${
                                permissions[p.id] ? "translate-x-4" : "translate-x-0"
                              }`}></div>
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleGrantPermissions}
                        disabled={isGranting}
                        className="w-full py-4 px-6 bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3.5 cursor-pointer hover:scale-[1.01]"
                      >
                        {isGranting ? (
                          <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Lock className="w-4.5 h-4.5" />
                        )}
                        <span>{isGranting ? "Approving Permissions..." : "Approve and Grant access"}</span>
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

                      <div className="bg-emerald-950/15 border border-emerald-500/20 p-4.5 rounded-2xl flex items-center gap-3.5 text-emerald-400 max-w-sm text-center">
                        <div className="text-xs font-semibold">Permissions validated! Meta tokens generated are secured under AES-256 vault configurations.</div>
                      </div>

                      <button
                        onClick={() => { setPermissionsGranted(false); }}
                        className="text-zinc-550 hover:text-gray-500 text-[10px] font-bold uppercase tracking-wider underline cursor-pointer"
                      >
                        Adjust Permissions
                      </button>
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
                    disabled={!permissionsGranted}
                    className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                      permissionsGranted 
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
                  <p className="text-gray-400 text-xs sm:text-sm mt-3">Pick your core automation goal and select a quick-launch page script.</p>
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
                                ? "bg-blue-955/20 border-blue-500/30 text-white"
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
                      <label className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">Initial Template</label>
                      <div className="flex flex-col gap-2">
                        {templates.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTemplate(t.id)}
                            className={`p-3.5 rounded-xl text-left border text-xs font-semibold cursor-pointer transition-all ${
                              selectedTemplate === t.id
                                ? "bg-blue-955/20 border-blue-500/30 text-white"
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
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-450 text-[8px] font-sans">
                          M
                        </div>
                        <span className="text-[10px] font-extrabold text-white font-mono tracking-wide">MESSENGER SIMULATION</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono">LIVE PREVIEW</span>
                    </div>

                    <div className="p-4.5 flex-grow flex flex-col gap-4 overflow-y-auto text-xs">
                      {activeTemplatePreview && (
                        <div className="flex items-start gap-2.5 max-w-[85%] self-start">
                          <div className="w-6 h-6 rounded-full bg-zinc-85" />
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
                          <div className="bg-blue-955/20 border border-blue-550/20 rounded-2xl rounded-tr-none py-2 px-3 text-zinc-200 font-medium text-right">
                            <div className="text-[9px] text-blue-400 font-extrabold mb-0.5">PAGE BOT</div>
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
                      placeholder="e.g. Agency Portal"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A1A] text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-colors"
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
                        <span>Connected Facebook Page: <strong className="text-zinc-200">{facebookPages.find(p=>p.id === selectedPage)?.name}</strong></span>
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
