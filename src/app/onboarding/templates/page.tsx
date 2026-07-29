"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  MessageCircle,
  Play
} from "lucide-react";

// Full list of templates
const allTemplates = [
  { 
    id: "comment_to_dm", 
    title: "Comment to DM Funnel", 
    desc: "When users comment a keyword (e.g. 'DEAL') on reels/videos, automatically DM them a signup link.", 
    goals: ["leads", "emails"],
    preview: {
      userAction: "Comments 'GROWTH' on your post",
      botResponse: "Awesome! Here is your private download link for the PDF Guide: set2send.com/guide-vault 🚀"
    }
  },
  { 
    id: "lead_magnet", 
    title: "Lead Magnet Capture", 
    desc: "Exchanges a gated resource for subscriber emails directly in messages. High conversion funnel.", 
    goals: ["leads", "emails"],
    preview: {
      userAction: "DMs you request for Guide",
      botResponse: "Sure! What is your email address so I can send the materials directly to your inbox? ✉️"
    }
  },
  { 
    id: "follow_to_unlock", 
    title: "Follow-to-Unlock", 
    desc: "Verifies if the user is a follower before delivering a special gated coupon or link code.", 
    goals: ["followers"],
    preview: {
      userAction: "Requests access to member link",
      botResponse: "Verification check: verified follower! Thanks for the support. Here is your key: key-90112 🔑"
    }
  },
  { 
    id: "product_recommend", 
    title: "Product Recommendation", 
    desc: "Presents product categories in chats and shares direct store purchase links with checkout code triggers.", 
    goals: ["sales"],
    preview: {
      userAction: "Sends message: 'Show catalogs'",
      botResponse: "Select a collection category: [New Arrivals] [Sale 30% OFF] [Top Sellers] 🛍️"
    }
  },
  { 
    id: "faq_support", 
    title: "FAQ Helpdesk Desk", 
    desc: "Replies immediately to repetitive queries (hours, shipping, locations) using buttons.", 
    goals: ["support"],
    preview: {
      userAction: "Clicks button: 'Shipping Status'",
      botResponse: "Standard orders ship in 2-4 days. Track details on your dashboard: set2send.com/tracking 📦"
    }
  },
  { 
    id: "calendar_booking", 
    title: "Calendar Booking Funnel", 
    desc: "Share booking parameters and link Cal.com or Calendly slots dynamically to schedule calls.", 
    goals: ["appointments"],
    preview: {
      userAction: "Sends message: 'Book a call'",
      botResponse: "I would love to arrange a consulting call! Pick an open slot here: set2send.com/book-call 📅"
    }
  }
];

export default function TemplateSetupPage() {
  const router = useRouter();

  // Selected template
  const [selectedTemplate, setSelectedTemplate] = useState("comment_to_dm");
  const [recommended, setRecommended] = useState<typeof allTemplates>([]);
  
  // Loaders / Session
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successOverlay, setSuccessOverlay] = useState(false);

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
        if (parsed.email === "demo@set2send.com") {
          router.push("/signin");
          return;
        }
      }
      setSessionUser(parsed);
      
      // Filter recommendations based on goal
      const userGoal = parsed.goal || "leads";
      const filtered = allTemplates.filter(t => t.goals.includes(userGoal));
      
      // Fallback if none matched
      if (filtered.length === 0) {
        const fallbackTemplate = allTemplates.find(t => t.id === `${userGoal}_funnel` || t.id === `${userGoal}_desk` || t.id === `faq_support` || t.id === `${userGoal}_recommend` || t.id === `product_recommend` || t.id === `calendar_booking`);
        const showTemplates = fallbackTemplate ? [fallbackTemplate] : allTemplates.slice(0, 2);
        setRecommended(showTemplates);
        setSelectedTemplate(showTemplates[0].id);
      } else {
        setRecommended(filtered);
        setSelectedTemplate(filtered[0].id);
      }
    } catch (e) {
      router.push("/signin");
    }
  }, [router]);

  const handleTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const updatedSession = {
        ...sessionUser,
        template: selectedTemplate,
        templateStepCompleted: true
      };

      localStorage.setItem("active_session", JSON.stringify(updatedSession));

      // Update user database
      const usersList = JSON.parse(localStorage.getItem("users_db") || "[]");
      const userIdx = usersList.findIndex((u: any) => u.email === sessionUser.email);
      if (userIdx >= 0) {
        usersList[userIdx] = { ...usersList[userIdx], ...updatedSession };
        localStorage.setItem("users_db", JSON.stringify(usersList));
      }

      setIsLoading(false);
      setSuccessOverlay(true);

      setTimeout(() => {
        router.push("/onboarding/workspace");
      }, 1500);

    }, 1000);
  };

  const activePreview = allTemplates.find(t => t.id === selectedTemplate)?.preview;

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* Background glow filters */}
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
              Template Selected!
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-xs sm:text-sm mt-2 font-medium"
            >
              Opening workspace setup properties...
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

        {/* Progress Timeline */}
        <div className="my-auto py-8 relative z-10 w-full flex flex-col items-start gap-8">
          <div>
            <span className="text-[9px] font-mono font-bold text-[#f97316] uppercase tracking-widest border border-[#f97316]/20 bg-[#f97316]/10 px-2.5 py-1 rounded-full">STEP 7 OF 8</span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight mt-4">
              Select startup Template
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
              We recommend optimized flow blueprints that match your goal. Every script node is fully customizable inside the visual canvas.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-xs font-mono font-bold text-gray-400 text-left">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>4. ACCOUNT SECURITY</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>5. CHANNEL SELECTION</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>6. BUSINESS GOAL</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-[10px] animate-pulse">7</span>
              <span>7. TEMPLATE SELECTION</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-white/50 tracking-wider relative z-10 select-none hidden md:block">
          FLOW CONFIGURATION MATRIX
        </div>
      </div>

      {/* RIGHT SIDE: OPTIONS AND CHAT SIMULATION */}
      <div className="col-span-12 md:col-span-8 flex items-center justify-center p-6 sm:p-12 bg-[#FAF9F6] z-10 overflow-y-auto">
        <div className="w-full max-w-[640px] my-auto">
          
          <div className="text-left mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-white">Blueprints For You</h3>
              <p className="text-gray-400 text-xs mt-1.5 font-medium">Recommended based on your target objective: <strong className="text-purple-400 capitalize">{sessionUser?.goal || "Leads"}</strong></p>
            </div>
            <Sparkles className="w-7 h-7 text-purple-400 hidden sm:block animate-pulse" />
          </div>

          <form onSubmit={handleTemplateSubmit} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
              
              {/* Recommended Templates List */}
              <div className="md:col-span-6 flex flex-col gap-3.5">
                {recommended.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-4 rounded-2xl text-left border transition-all flex flex-col gap-1 cursor-pointer ${
                      selectedTemplate === t.id
                        ? "bg-purple-955/5 border-purple-500/40 shadow-sm"
                        : "bg-white/30 border-zinc-850 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <h4 className="text-xs font-black text-white font-sans uppercase tracking-wider">{t.title}</h4>
                      {selectedTemplate === t.id && (
                        <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-zinc-950">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-500 text-[10px] leading-relaxed mt-1 font-medium">{t.desc}</p>
                  </button>
                ))}
              </div>

              {/* Chat simulation preview */}
              <div className="md:col-span-6 bg-[#FAF9F6] border border-zinc-850 rounded-2xl overflow-hidden shadow-inner flex flex-col h-[280px]">
                <div className="bg-white/50 border-b border-zinc-850 py-2.5 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] font-extrabold text-white font-mono tracking-wide">CHAT ब्लू-प्रिंट PREVIEW</span>
                  </div>
                  <span className="text-[8px] text-zinc-550 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>LIVE SIM</span>
                  </span>
                </div>

                <div className="p-4.5 flex-grow flex flex-col gap-4 overflow-y-auto text-xs font-medium">
                  
                  {/* Subscriber comment or trigger message */}
                  {activePreview && (
                    <div className="flex items-start gap-2.5 max-w-[85%] self-start">
                      <div className="w-6 h-6 rounded-full bg-zinc-850 border border-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                        U
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none py-2.5 px-3 text-gray-600">
                        <div className="text-[8px] text-[#f97316] font-extrabold mb-0.5 tracking-wider uppercase">SUBSCRIBER</div>
                        <span>{activePreview.userAction}</span>
                      </div>
                    </div>
                  )}

                  {/* Automated bot responder output */}
                  {activePreview && (
                    <div className="flex items-start gap-2.5 max-w-[85%] self-end flex-row-reverse">
                      <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 text-[#f97316] font-bold text-[9px] flex items-center justify-center shrink-0">
                        S
                      </div>
                      <div className="bg-purple-955/20 border border-purple-500/20 rounded-2xl rounded-tr-none py-2.5 px-3 text-zinc-200 text-right">
                        <div className="text-[8px] text-purple-400 font-extrabold mb-0.5 tracking-wider uppercase">SET2SEND BOT</div>
                        <span>{activePreview.botResponse}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#E8E4D9]/80">
              <Link
                href="/onboarding/goal"
                className="px-6 py-3.5 bg-white/60 hover:bg-gray-100/80 text-gray-500 hover:text-zinc-200 border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.01]"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}
