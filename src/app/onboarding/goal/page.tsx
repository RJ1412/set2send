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
  AlertCircle,
  Target,
  Sparkles
} from "lucide-react";

const goals = [
  { id: "leads", title: "Generate Leads", desc: "Qualify inquiries and collect contact data in DMs.", icon: "🎯", color: "from-purple-500/20 to-pink-500/20" },
  { id: "emails", title: "Collect Emails", desc: "Build newsletter subscribers by distributing resource PDFs.", icon: "✉️", color: "from-blue-500/20 to-indigo-500/20" },
  { id: "followers", title: "Grow Followers", desc: "Boost follow metrics using Follow-to-Unlock vaults.", icon: "📈", color: "from-emerald-500/20 to-teal-500/20" },
  { id: "sales", title: "Increase Sales", desc: "Distribute discount codes and catalog checkout URLs.", icon: "🛍️", color: "from-amber-500/20 to-orange-500/20" },
  { id: "support", title: "Customer Support", desc: "Answer repetitious support FAQs instantly with bots.", icon: "🤖", color: "from-sky-500/20 to-blue-500/20" },
  { id: "appointments", title: "Book Appointments", desc: "Sync calendar scheduling invite links in chats.", icon: "📅", color: "from-rose-500/20 to-red-500/20" }
];

export default function GoalSetupPage() {
  const router = useRouter();

  // Selected goal
  const [selectedGoal, setSelectedGoal] = useState("leads");
  
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
      }
      setSessionUser(parsed);
      if (parsed.goal) {
        setSelectedGoal(parsed.goal);
      }
    } catch (e) {
      router.push("/signin");
    }
  }, [router]);

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const updatedSession = {
        ...sessionUser,
        goal: selectedGoal,
        goalStepCompleted: true
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
        router.push("/onboarding/templates");
      }, 1500);

    }, 1000);
  };

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
              Business Goal Selected!
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-xs sm:text-sm mt-2 font-medium"
            >
              Matching campaign automation templates...
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

        {/* Progress details */}
        <div className="my-auto py-8 relative z-10 w-full flex flex-col items-start gap-8">
          <div>
            <span className="text-[9px] font-mono font-bold text-[#f97316] uppercase tracking-widest border border-[#f97316]/20 bg-[#f97316]/10 px-2.5 py-1 rounded-full">STEP 6 OF 8</span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight mt-4">
              What do you want to achieve?
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
              We personalize your dashboard KPIs, vector indexes, and quick launch triggers based on your objective.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-xs font-mono font-bold text-gray-400 text-left">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>3. PROFILE SETUP</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>4. ACCOUNT SECURITY</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>5. CHANNEL SELECTION</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-[10px] animate-pulse">6</span>
              <span>6. BUSINESS GOAL</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-white/50 tracking-wider relative z-10 select-none hidden md:block">
          GOAL TARGET ROUTER
        </div>
      </div>

      {/* RIGHT SIDE: GRID OF OBJECTIVE CARDS */}
      <div className="col-span-12 md:col-span-8 flex items-center justify-center p-6 sm:p-12 bg-[#FAF9F6] z-10 overflow-y-auto">
        <div className="w-full max-w-[620px] my-auto">
          
          <div className="text-left mb-8 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-white">Select Objective</h3>
              <p className="text-gray-400 text-xs mt-1.5 font-medium">Click on a card category below to configure target parameters.</p>
            </div>
            <Target className="w-8 h-8 text-purple-400 hidden sm:block animate-pulse" />
          </div>

          <form onSubmit={handleGoalSubmit} className="flex flex-col gap-6">
            
            {/* Grid list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGoal(g.id)}
                  className={`p-5 rounded-2xl text-left border flex flex-col gap-3 transition-all cursor-pointer relative group overflow-hidden ${
                    selectedGoal === g.id
                      ? "bg-purple-955/5 border-purple-500/40 shadow-lg"
                      : "bg-white/30 border-zinc-850 hover:border-gray-200 hover:scale-[1.01]"
                  }`}
                >
                  {/* Decorative background glow on active */}
                  {selectedGoal === g.id && (
                    <div className="absolute right-0 bottom-0 w-20 h-20 bg-gradient-to-tr from-purple-500/5 to-pink-500/10 rounded-full blur-xl pointer-events-none"></div>
                  )}

                  <div className="flex justify-between items-center w-full">
                    <span className="text-3xl select-none">{g.icon}</span>
                    {selectedGoal === g.id && (
                      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-zinc-950 shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white font-sans uppercase tracking-wider">{g.title}</h4>
                    <p className="text-gray-500 text-[10px] leading-relaxed mt-1 font-medium">{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#E8E4D9]/80">
              <Link
                href="/onboarding/channel-selection"
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
