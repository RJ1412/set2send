"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Users, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Check, 
  Bell, 
  Ticket, 
  AlertCircle, 
  Database, 
  Cpu, 
  Award,
  Zap,
  Send,
  Heart,
  TrendingUp,
  Link as LinkIcon,
  MessageCircle,
  Code
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function FollowToDMPage() {
  // Demo interactive states
  const [isFollowed, setIsFollowed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showDM, setShowDM] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Workflow Explainer state
  const [rewardScene, setRewardScene] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRewardScene((prev) => (prev < 2 ? prev + 1 : 0));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  
  const simulatorRef = useRef<HTMLDivElement>(null);
  const isSimulatorInView = useInView(simulatorRef, { margin: "-100px" });

  useEffect(() => {
    let active = true;
    let currentTimer: NodeJS.Timeout;

    const runLoop = async () => {
      while (active && isSimulatorInView) {
        // Reset
        setIsFollowed(false);
        setShowNotification(false);
        setShowDM(false);
        setShowCoupon(false);
        
        await new Promise(resolve => { currentTimer = setTimeout(resolve, 1000); });
        if (!active || !isSimulatorInView) break;
        
        // Trigger
        setIsFollowed(true);
        await new Promise(resolve => { currentTimer = setTimeout(resolve, 1200); });
        if (!active || !isSimulatorInView) break;
        
        setShowNotification(true);
        await new Promise(resolve => { currentTimer = setTimeout(resolve, 1600); });
        if (!active || !isSimulatorInView) break;
        
        setShowDM(true);
        await new Promise(resolve => { currentTimer = setTimeout(resolve, 1400); });
        if (!active || !isSimulatorInView) break;
        
        setShowCoupon(true);
        
        // Hold result
        await new Promise(resolve => { currentTimer = setTimeout(resolve, 3500); });
      }
    };

    if (isSimulatorInView) {
      runLoop();
    } else {
      // If user scrolls away, reset it so it starts fresh next time
      setIsFollowed(false);
      setShowNotification(false);
      setShowDM(false);
      setShowCoupon(false);
    }

    return () => {
      active = false;
      clearTimeout(currentTimer);
    };
  }, [isSimulatorInView]);


  const handleInteractiveFollow = () => {
    if (isFollowed) return;
    setIsFollowed(true);
    
    setTimeout(() => setShowNotification(true), 1200);
    setTimeout(() => setShowDM(true), 2800);
    setTimeout(() => setShowCoupon(true), 4200);
  };

  const handleResetDemo = () => {
    setIsResetting(true);
    setIsFollowed(false);
    setShowNotification(false);
    setShowDM(false);
    setShowCoupon(false);
    setTimeout(() => setIsResetting(false), 300);
  };


  return (
    <div className="bg-[#f1f5f9] min-h-screen flex flex-col font-sans font-normal overflow-x-hidden">
      
      {/* Global Navbar sits on top with its own styling (transparent or whatever it defines) */}
      <Navbar />

      {/* ==================================================
          1. HERO SECTION (Mid-tone Slate: #1E2028)
          ================================================== */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden z-10 bg-[#f8fafc] text-slate-900">
        
        {/* Distinction from Navbar: subtle inner shadow at top */}
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#bae6fd] to-transparent pointer-events-none opacity-50 z-20"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-6 text-left flex flex-col items-start pt-12 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 bg-black/5 border border-black/10 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <span className="text-[11px] font-medium font-mono tracking-widest text-slate-700 uppercase">
                Automated Direct Messaging
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight leading-[1.05]"
            >
              Welcome fans with <br />
              <span className="text-indigo-600 font-black">
                instant DMs.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 mt-6 text-base md:text-lg max-w-xl leading-relaxed"
            >
              Automatically send customized welcome messages, exclusive offers, and VIP links the moment someone follows your profile. Turn passive audiences into engaged customers instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/auth/google"
                className="w-full sm:w-auto text-center px-10 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm rounded-full transition-colors shadow-lg shadow-indigo-500/20"
              >
                Start Free Trial
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Hero SVG Flow Animation */}
          <div className="lg:col-span-6 relative w-full h-[500px] flex items-center justify-center hidden sm:flex">
            
            <svg className="absolute w-full h-[400px] z-0" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="heroFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" /> {/* indigo-400 */}
                  <stop offset="100%" stopColor="#a78bfa" /> {/* violet-400 */}
                </linearGradient>
              </defs>

              <path d="M 80,200 C 180,200 220,100 300,200 C 380,300 420,200 520,200" 
                    fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" strokeDasharray="6 6" />
              
              <motion.path 
                d="M 80,200 C 180,200 220,100 300,200 C 380,300 420,200 520,200" 
                fill="none" stroke="url(#heroFlowGrad)" strokeWidth="3" 
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.5 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            {/* Nodes */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute left-[8%] top-[40%] bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-4 z-10 flex flex-col items-center gap-2 shadow-2xl"
            >
              <div className="bg-indigo-500/20 p-2 rounded-full border border-indigo-500/30">
                <Users className="text-indigo-600 w-5 h-5" />
              </div>
              <span className="text-slate-800 font-medium text-xs">Follower</span>
            </motion.div>

            <motion.div 
              animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute left-[41%] top-[38%] bg-[#f8fafc] border border-indigo-500/30 rounded-2xl p-5 z-10 shadow-[0_0_30px_rgba(99,102,241,0.2)] flex flex-col items-center gap-3"
            >
              <Heart className="text-rose-500 w-6 h-6" fill="currentColor" />
              <div className="text-[10px] text-slate-600 font-medium uppercase tracking-widest text-center">
                Processing
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeInOut" }}
              className="absolute right-[8%] top-[40%] bg-black/5 backdrop-blur-xl border border-black/10 rounded-2xl p-4 z-10 flex flex-col items-center gap-2 shadow-2xl"
            >
              <div className="bg-violet-500/20 p-2 rounded-full border border-violet-500/30">
                <MessageSquare className="text-violet-600 w-5 h-5" />
              </div>
              <span className="text-slate-800 font-medium text-xs">Inbox</span>
            </motion.div>

            <motion.div 
              animate={{ x: [0, 100, 220, 340, 440], y: [0, -60, 0, 60, 0], opacity: [0, 1, 1, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-[13%] top-[48%] w-2 h-2 bg-indigo-200 rounded-full z-20 shadow-[0_0_10px_rgba(199,210,254,0.8)]"
            />
          </div>

        </div>
      </section>

      {/* ==================================================
          2. INTERACTIVE DEMO (Mid-tone Navy: #19202E)
          ================================================== */}
      <section className="py-24 bg-[#c7d2fe] relative z-10 text-slate-900 border-t border-black/5">
        
        {/* Blend Element */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#bae6fd] to-transparent z-0 pointer-events-none"></div>

        <div ref={simulatorRef} className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          
          <div className="lg:col-span-6 text-left flex flex-col items-start relative">
            
            {/* Animated floating data packets from button to phone */}
            <AnimatePresence>
              {isFollowed && !showNotification && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: 1, x: [0, 200, 400], y: [0, -50, 50] }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute bottom-16 left-32 w-4 h-4 bg-sky-400 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.8)] z-50 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <span className="text-[10px] font-medium font-mono tracking-widest text-sky-600 border border-sky-400/30 bg-sky-400/10 px-3 py-1 rounded-full uppercase">
              Interactive Demo
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mt-6">
              See the workflow in action
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mt-4 max-w-lg">
              Click the "Follow" button. Watch a simulated data packet fly from the trigger to the device, processing the webhook and unlocking a custom welcome offer.
            </p>

            <div className="mt-8 w-full max-w-sm flex flex-col gap-3 relative">
              <button
                onClick={handleInteractiveFollow}
                disabled={isFollowed || isResetting}
                className={`w-full py-4 rounded-xl text-center text-sm font-semibold transition-all ${
                  isFollowed
                    ? "bg-black/5 text-slate-500 cursor-not-allowed border border-black/10"
                    : "bg-sky-500 hover:bg-sky-400 text-white cursor-pointer shadow-lg shadow-sky-500/20"
                }`}
              >
                {isFollowed ? "Event Triggered" : "Follow Profile"}
              </button>
              
              {isFollowed && (
                <button
                  onClick={handleResetDemo}
                  className="text-slate-500 hover:text-slate-700 font-mono text-[10px] uppercase underline cursor-pointer text-center"
                >
                  Reset simulation
                </button>
              )}
            </div>
          </div>

          {/* Right Mobile Simulator */}
          <div className="lg:col-span-6 flex justify-center items-center w-full relative">
            <div className="relative w-full max-w-[310px] h-[570px] rounded-[48px] border-[6px] border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col justify-between">
              
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-200 rounded-b-2xl z-40 flex items-center justify-center">
                <div className="w-12 h-1 bg-[#404c66] rounded-full mb-1"></div>
              </div>

              <div className="flex justify-between items-center px-6 pt-5 text-[10px] font-medium text-slate-500 select-none relative z-10 bg-white">
                <span>9:41</span>
                <span>5G</span>
              </div>

              <div className="flex-1 px-4 py-4 relative flex flex-col justify-end gap-3.5 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:1rem_1rem] pointer-events-none"></div>

                <AnimatePresence>
                  {showNotification && (
                    <motion.div
                      key="notification"
                      initial={{ opacity: 0, y: -40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40 }}
                      className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-black/5 rounded-2xl p-4 shadow-xl flex items-center gap-3 z-30"
                    >
                      <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0 border border-sky-500/30">
                        <Bell className="w-4 h-4 text-sky-600" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="text-[10px] font-semibold text-slate-800 block mb-0.5">Notification</span>
                        <span className="text-[11px] text-slate-600">@set2send sent you a message!</span>
                      </div>
                    </motion.div>
                  )}

                  {showDM && (
                    <motion.div
                      key="dm-message"
                      initial={{ opacity: 0, y: 15, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="bg-slate-50 text-slate-800 rounded-2xl rounded-bl-sm p-4 shadow-lg border border-black/5 max-w-[85%] self-start text-left relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-400"></div>
                      <p className="text-[9px] text-slate-600 font-semibold mb-1 uppercase tracking-wide">Automated Greeting</p>
                      <span className="text-xs font-normal leading-relaxed">Hi there! Thanks for following. As a welcome gift, here is your exclusive code:</span>
                    </motion.div>
                  )}

                  {showCoupon && (
                    <motion.div
                      key="coupon"
                      initial={{ opacity: 0, scale: 0.93 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#f0f9ff] border border-black/10 rounded-2xl p-5 w-full text-center flex flex-col gap-3 shadow-lg relative overflow-hidden"
                    >
                      <div className="flex justify-between items-center border-b border-black/5 pb-3">
                        <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest">Offer</span>
                        <span className="text-[9px] bg-sky-500/10 text-sky-600 border border-sky-500/20 font-medium px-2 py-0.5 rounded uppercase">Active</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">Take 15% off your first order</h4>
                      <div className="bg-white border border-black/5 py-2 px-3 rounded-lg text-sm font-mono font-medium text-sky-600 select-all tracking-widest">
                        WELCOME15
                      </div>
                    </motion.div>
                  )}

                  {!isFollowed && !isResetting && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-28 flex flex-col items-center justify-center text-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-black/5">
                        <ArrowRight className="w-4 h-4 text-slate-500 transform rotate-90" />
                      </div>
                      <p className="text-slate-500 text-[10px] font-medium">Awaiting interaction</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full flex justify-center py-3 bg-white border-t border-black/5 relative z-10">
                <div className="w-32 h-1 bg-zinc-700 rounded-full"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          3. PROBLEM SECTION (Mid-tone Aubergine: #251B29)
          ================================================== */}
      <section className="py-24 bg-[#f5d0fe] text-center relative z-10 text-slate-900 border-t border-black/5">
        
        {/* Blend Element */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#c7d2fe] to-transparent z-0 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-fuchsia-300">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              The leaky funnel of bio links
            </h2>
            <p className="text-slate-600 text-base max-w-xl mt-2 leading-relaxed">
              Relying purely on a link-in-bio creates massive drop-off. Compare the passive approach vs active direct messaging.
            </p>
          </motion.div>

          {/* Unique Animated Element: Leaky Funnel vs Direct Connection */}
          <div className="mt-12 w-full h-[250px] bg-black/5 backdrop-blur-md border border-black/10 rounded-3xl flex items-center justify-center relative overflow-hidden">
             
             {/* Left side: Bio Link (Leaky) */}
             <div className="absolute left-[15%] flex flex-col items-center">
                <div className="text-xs text-slate-500 font-mono mb-4 uppercase tracking-widest">Bio Link</div>
                <div className="w-20 h-32 border-x-2 border-b-2 border-gray-300/50 rounded-b-xl relative flex justify-center">
                   {/* Falling elements that fade/drop out */}
                   <motion.div animate={{ y: [0, 80], opacity: [1, 0], x: [0, -30] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-0 w-3 h-3 bg-zinc-600 rounded-full" />
                   <motion.div animate={{ y: [0, 90], opacity: [1, 0], x: [0, 30] }} transition={{ repeat: Infinity, duration: 2, delay: 0.8 }} className="absolute top-0 w-3 h-3 bg-zinc-600 rounded-full" />
                   <motion.div animate={{ y: [0, 120], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1.5 }} className="absolute top-0 w-3 h-3 bg-zinc-600 rounded-full" />
                   <div className="absolute bottom-[-10px] w-6 h-6 bg-gray-100 border border-gray-300 rounded text-[8px] flex items-center justify-center text-slate-500">2%</div>
                </div>
             </div>

             {/* Center Divider */}
             <div className="h-full w-px bg-black/5"></div>

             {/* Right side: DM (Direct) */}
             <div className="absolute right-[15%] flex flex-col items-center">
                <div className="text-xs text-fuchsia-300 font-mono mb-4 uppercase tracking-widest">Instant DM</div>
                <div className="w-20 h-32 border-x-2 border-b-2 border-fuchsia-500/30 rounded-b-xl relative flex justify-center bg-fuchsia-500/5">
                   {/* Falling elements that successfully land */}
                   <motion.div animate={{ y: [0, 110], opacity: [0, 1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute top-0 w-3 h-3 bg-fuchsia-400 rounded-full shadow-[0_0_8px_#e879f9]" />
                   <motion.div animate={{ y: [0, 110], opacity: [0, 1, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} className="absolute top-0 w-3 h-3 bg-fuchsia-400 rounded-full shadow-[0_0_8px_#e879f9]" />
                   <motion.div animate={{ y: [0, 110], opacity: [0, 1, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 1 }} className="absolute top-0 w-3 h-3 bg-fuchsia-400 rounded-full shadow-[0_0_8px_#e879f9]" />
                   <div className="absolute bottom-[-10px] w-8 h-6 bg-fuchsia-900 border border-fuchsia-500/50 rounded text-[9px] flex items-center justify-center text-fuchsia-200 font-bold shadow-lg shadow-fuchsia-900/50">98%</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. SOLUTION SECTION (Mid-tone Teal: #162628)
          ================================================== */}
      <section className="py-24 bg-[#d9f99d] text-center relative z-10 text-slate-900 border-t border-black/5">
        
        {/* Blend Element */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#f5d0fe] to-transparent z-0 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 shadow-sm">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-teal-950">
              Your 24/7 Fan Engagement Tool
            </h2>
            <p className="text-teal-800/80 font-medium text-base max-w-xl mt-2 leading-relaxed">
              Focus on creating amazing content while Set2Send automatically greets, engages, and converts your new followers into loyal fans.
            </p>
          </motion.div>

          {/* Unique Animated Element: Community Core */}
          <div className="mt-16 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-12 relative overflow-hidden text-left flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl">
            
            <div className="w-full md:w-1/3 flex justify-center relative h-[200px] items-center">
               <div className="absolute w-32 h-32 border border-teal-400/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
               <div className="absolute w-24 h-24 border border-teal-400/50 rounded-full animate-[spin_7s_linear_reverse_infinite]"></div>
               <div className="w-16 h-16 bg-gradient-to-tr from-teal-400 to-sky-400 rounded-full flex items-center justify-center border border-white shadow-[0_0_30px_rgba(45,212,191,0.6)] animate-bounce">
                  <Sparkles className="w-8 h-8 text-white" />
               </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-6">
              
              <div className="flex items-start gap-4 p-4 hover:bg-white/50 rounded-2xl transition-colors cursor-default border border-transparent hover:border-white/50">
                <div className="mt-1 w-8 h-8 rounded-full bg-teal-400 text-white flex items-center justify-center shadow-md shrink-0 font-bold">1</div>
                <div>
                  <h4 className="text-lg font-bold text-teal-950">Instant Fan Welcome</h4>
                  <p className="text-teal-800/80 font-medium text-sm mt-1 leading-relaxed">Every new follower is instantly greeted with a warm, personalized welcome message the exact moment they hit follow.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 hover:bg-white/50 rounded-2xl transition-colors cursor-default border border-transparent hover:border-white/50">
                <div className="mt-1 w-8 h-8 rounded-full bg-teal-400 text-white flex items-center justify-center shadow-md shrink-0 font-bold">2</div>
                <div>
                  <h4 className="text-lg font-bold text-teal-950">Drive Traffic & Sales</h4>
                  <p className="text-teal-800/80 font-medium text-sm mt-1 leading-relaxed">Automatically deliver your exclusive links, promotional codes, or lead magnets directly to their inbox without lifting a finger.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 hover:bg-white/50 rounded-2xl transition-colors cursor-default border border-transparent hover:border-white/50">
                <div className="mt-1 w-8 h-8 rounded-full bg-teal-400 text-white flex items-center justify-center shadow-md shrink-0 font-bold">3</div>
                <div>
                  <h4 className="text-lg font-bold text-teal-950">Build Deeper Relationships</h4>
                  <p className="text-teal-800/80 font-medium text-sm mt-1 leading-relaxed">Turn passive scrollers into highly engaged community members without spending countless hours manually replying to DMs.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          5. BENEFITS SECTION (Mid-tone Espresso: #28201B)
          ================================================== */}
      <section className="py-24 bg-[#fde68a] relative z-10 text-slate-900 border-t border-black/5">
        
        {/* Blend Element */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#d9f99d] to-transparent z-0 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="mb-12">
            
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mt-2 text-emerald-900">
              Creator Success Flow
            </h2>
            <p className="text-emerald-800/80 text-base leading-relaxed mt-4 mb-8 font-medium">
              See how easily you can welcome your newest followers with personalized messages, exclusive offers, and instant joy—no tech skills required!
            </p>

            <div className="flex flex-col gap-3 w-full">
              <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${rewardScene === 0 ? "bg-white/60 border border-white/60 text-emerald-900 shadow-xl scale-105" : "bg-white/10 border border-transparent text-emerald-800/60"}`}>
                <div className="bg-emerald-400 text-white p-2 rounded-full shadow-sm"><Users className="w-4 h-4" /></div>
                <span className="text-sm font-bold">1. New Follower Arrives 🎉</span>
              </div>
              <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${rewardScene === 1 ? "bg-white/60 border border-white/60 text-emerald-900 shadow-xl scale-105" : "bg-white/10 border border-transparent text-emerald-800/60"}`}>
                <div className="bg-sky-400 text-white p-2 rounded-full shadow-sm"><Sparkles className="w-4 h-4" /></div>
                <span className="text-sm font-bold">2. Crafting Welcome Magic ✨</span>
              </div>
              <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${rewardScene === 2 ? "bg-white/60 border border-white/60 text-emerald-900 shadow-xl scale-105" : "bg-white/10 border border-transparent text-emerald-800/60"}`}>
                <div className="bg-pink-400 text-white p-2 rounded-full shadow-sm"><Send className="w-4 h-4" /></div>
                <span className="text-sm font-bold">3. Joy Delivered to Inbox! 💌</span>
              </div>
            </div>

          </div>

          {/* Right execution pipeline representation (Data Stream) */}
          
          <div className="lg:col-span-7 flex justify-center items-center w-full">
            <div className="w-full max-w-[500px] h-[340px] bg-white/40 border border-white/60 rounded-[32px] p-8 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-xl">
              
              {/* Decorative background elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300/40 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-300/40 rounded-full blur-2xl pointer-events-none"></div>

              <AnimatePresence>
                
                {rewardScene === 0 && (
                  <motion.div
                    key="log0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="flex flex-col items-center justify-center gap-4 w-full"
                  >
                    <div className="w-20 h-20 bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                      <Users className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-emerald-900">Yay! A New Follower!</h3>
                    <p className="text-emerald-800/80 text-sm font-semibold">Preparing the welcome sequence...</p>
                  </motion.div>
                )}

                {rewardScene === 1 && (
                  <motion.div
                    key="log1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="flex flex-col items-center justify-center gap-4 w-full"
                  >
                    <div className="w-20 h-20 bg-sky-400 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-sky-900">Customizing Message...</h3>
                    <div className="bg-white/80 p-4 rounded-2xl border border-white shadow-sm mt-2 max-w-xs relative">
                      <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/80 border-t border-l border-white rotate-45"></div>
                      <p className="text-sky-900 text-sm font-medium relative z-10">"Hi there! As a welcome gift, here is 15% off..."</p>
                    </div>
                  </motion.div>
                )}

                {rewardScene === 2 && (
                  <motion.div
                    key="log2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="flex flex-col items-center justify-center gap-4 w-full"
                  >
                    <div className="w-20 h-20 bg-pink-400 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                      <Send className="w-10 h-10 ml-1" />
                    </div>
                    <h3 className="text-2xl font-black text-pink-900">Message Delivered! 💌</h3>
                    <p className="text-pink-800/80 text-sm font-semibold">Your follower is now a happy customer.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          7. CTA SECTION
          ================================================== */}
      <section className="py-28 px-6 text-center relative bg-[#f8fafc] text-slate-900 border-t border-black/5 z-10">
        <div className="max-w-4xl mx-auto bg-black/5 border border-black/10 shadow-2xl rounded-3xl p-12 sm:p-16 relative overflow-hidden">
          
          {/* Subtle glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]"></div>

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Start automating your welcome messages
            </h2>
            <p className="text-slate-600 text-base max-w-md mx-auto leading-relaxed">
              Connect your accounts to Set2Send and deploy your first follow-to-dm sequence in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 w-full">
              <Link 
                href="/auth/google"
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm rounded-full transition-colors shadow-lg"
              >
                Get Started
              </Link>
              <button className="w-full sm:w-auto px-8 py-3.5 bg-black/5 border border-black/10 text-slate-700 font-semibold text-sm rounded-full transition-colors hover:bg-white/10">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
