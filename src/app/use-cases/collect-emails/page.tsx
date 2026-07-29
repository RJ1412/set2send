"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Database, 
  Sparkles, 
  MessageSquare, 
  Zap,
  ArrowRight,
  ChevronDown,
  XCircle,
  CheckCircle2
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SIMULATOR_DATA = {
  instagram_comment: {
    title: "Instagram Comment",
    steps: [
      { type: "user", label: "REEL COMMENT", text: "Send me the lead magnet! \"MAGNET\"", time: "Just now" },
      { type: "bot", label: "AUTOMATED DM", text: "Hi! Thanks for commenting. I'd love to send you the exclusive lead magnet.", time: "1s ago" },
      { type: "bot", label: "AUTOMATED DM", text: "What's the best email address to send the PDF to?", time: "1s ago" },
      { type: "user", label: "USER ENTERED", text: "sarah@growthmarketing.com", time: "Just now" },
      { type: "system", label: "CRM SYNC COMPLETE", text: "Email validated & lead synced to HubSpot.", time: "Just now" }
    ]
  },
  instagram_story: {
    title: "Instagram Story",
    steps: [
      { type: "user", label: "STORY REPLY", text: "I want to join the newsletter! \"SUBSCRIBE\"", time: "Just now" },
      { type: "bot", label: "AUTOMATED DM", text: "Hey there! Thanks for your interest in our weekly newsletter.", time: "1s ago" },
      { type: "bot", label: "AUTOMATED DM", text: "Please share your email below to complete your registration:", time: "1s ago" },
      { type: "user", label: "USER ENTERED", text: "alex.founder@startup.co", time: "Just now" },
      { type: "system", label: "CRM SYNC COMPLETE", text: "Email captured & added to Mailchimp.", time: "Just now" }
    ]
  },
  whatsapp_broadcast: {
    title: "WhatsApp Opt-in",
    steps: [
      { type: "user", label: "WHATSAPP MESSAGE", text: "Hi! I want to claim the free consultation. \"CLAIM\"", time: "Just now" },
      { type: "bot", label: "AUTOMATED CHAT", text: "Welcome! To reserve your consultation slot, we just need a few details.", time: "1s ago" },
      { type: "bot", label: "AUTOMATED CHAT", text: "First, what is your primary work email address?", time: "1s ago" },
      { type: "user", label: "USER ENTERED", text: "consult@enterprise.net", time: "Just now" },
      { type: "system", label: "CRM SYNC COMPLETE", text: "Opt-in confirmed. Synced to Salesforce.", time: "Just now" }
    ]
  }
};

const SIM_THEMES = {
  instagram_comment: {
    section: "bg-fuchsia-100",
    dividerFill: "fill-fuchsia-100",
    badgeBg: "bg-fuchsia-200",
    badgeText: "text-fuchsia-900",
    title: "text-fuchsia-950",
    subtitle: "text-fuchsia-800",
    btnActive: "bg-fuchsia-900 text-white shadow-xl shadow-fuchsia-900/20 scale-105",
    btnInactive: "bg-white/50 text-fuchsia-950 hover:bg-white",
    iconActive: "text-fuchsia-300",
    iconInactive: "text-fuchsia-600",
    phoneBorder: "border-fuchsia-900",
    phoneBg: "bg-fuchsia-50",
    phoneShadow: "shadow-[30px_30px_0px_rgba(112,26,117,0.2)]",
    chatUserBg: "bg-fuchsia-200 text-fuchsia-950",
    chatSysBg: "bg-fuchsia-900 text-white",
    chatPulse: "text-fuchsia-300"
  },
  instagram_story: {
    section: "bg-pink-100",
    dividerFill: "fill-pink-100",
    badgeBg: "bg-pink-200",
    badgeText: "text-pink-900",
    title: "text-pink-950",
    subtitle: "text-pink-800",
    btnActive: "bg-pink-900 text-white shadow-xl shadow-pink-900/20 scale-105",
    btnInactive: "bg-white/50 text-pink-950 hover:bg-white",
    iconActive: "text-pink-300",
    iconInactive: "text-pink-600",
    phoneBorder: "border-pink-900",
    phoneBg: "bg-pink-50",
    phoneShadow: "shadow-[30px_30px_0px_rgba(131,24,67,0.2)]",
    chatUserBg: "bg-pink-200 text-pink-950",
    chatSysBg: "bg-pink-900 text-white",
    chatPulse: "text-pink-300"
  },
  whatsapp_broadcast: {
    section: "bg-emerald-100",
    dividerFill: "fill-emerald-100",
    badgeBg: "bg-emerald-200",
    badgeText: "text-emerald-900",
    title: "text-emerald-950",
    subtitle: "text-emerald-800",
    btnActive: "bg-emerald-900 text-white shadow-xl shadow-emerald-900/20 scale-105",
    btnInactive: "bg-white/50 text-emerald-950 hover:bg-white",
    iconActive: "text-emerald-300",
    iconInactive: "text-emerald-600",
    phoneBorder: "border-emerald-900",
    phoneBg: "bg-emerald-50",
    phoneShadow: "shadow-[30px_30px_0px_rgba(6,78,59,0.2)]",
    chatUserBg: "bg-emerald-200 text-emerald-950",
    chatSysBg: "bg-emerald-900 text-white",
    chatPulse: "text-emerald-300"
  }
};

export default function CollectEmailsPage() {
  const [activeTab, setActiveTab] = useState<"instagram_comment" | "instagram_story" | "whatsapp_broadcast">("instagram_comment");
  const [demoStep, setDemoStep] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, [activeTab]);

  const currentSimData = SIMULATOR_DATA[activeTab];
  const theme = SIM_THEMES[activeTab];

  return (
    <div className="font-sans overflow-x-hidden selection:bg-black selection:text-white">
      <Navbar />

      {/* ==================================================
          1. HERO SECTION
          Color: Gradient Instagram vibe (Pink/Purple/Yellow pastel)
          Unique Element: Giant Animated Organic SVG Blob
          ================================================== */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-50 z-10">
        {/* Unique Element: Animated Blob Background */}
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
            borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-pink-300 to-purple-300 opacity-40 z-0 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left flex flex-col items-start pt-12 lg:pt-0">
            <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-purple-900 bg-purple-200/50 backdrop-blur-sm px-4 py-2 rounded-full uppercase mb-6 shadow-sm border border-purple-200">
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>Email Capture Reimagined</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05]">
              Turn social traffic <br />
              into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">high-value</span> list.
            </h1>

            <p className="text-slate-700 mt-6 text-lg max-w-xl leading-relaxed font-medium">
              Ditch the clunky landing pages. Capture, validate, and sync email addresses directly inside DMs with zero friction.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/auth/google" className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-black text-white font-bold text-sm uppercase tracking-widest rounded-full transition-all shadow-xl">
                Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* Visual: Floating UI Elements over the blob */}
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white max-w-sm w-full relative z-10">
              <div className="flex items-center gap-4 mb-4 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">New Lead Synced</h3>
                  <p className="text-xs font-mono text-slate-500">From Instagram DM</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="font-mono text-slate-900 font-bold">jordan.creator@gmail.com</p>
                <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded inline-flex">
                  <CheckCircle2 className="w-3 h-3" /> Validated
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Diagonal SVG Divider cutting to next section */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 transition-colors duration-500">
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120" className="block w-full h-[80px]">
            {/* Using the explicit fill class so Tailwind JIT detects it */}
            <path d="M1200 120L0 16.48V0h1200v120z" className={`transition-colors duration-500 ${theme.dividerFill}`}></path>
          </svg>
        </div>
      </section>

      {/* ==================================================
          2. SIMULATOR SECTION
          Color: Dynamic (Pink/Fuchsia/Emerald) based on App
          Unique Element: 3D Isometric Phone Tilt
          ================================================== */}
      <section className={`py-24 transition-colors duration-500 relative z-10 ${theme.section}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col gap-6 items-start text-left">
            <span className={`text-xs font-bold font-mono tracking-widest px-4 py-2 rounded-full uppercase transition-colors duration-500 ${theme.badgeBg} ${theme.badgeText}`}>
              Live Interaction
            </span>
            <h2 className={`text-4xl lg:text-6xl font-black tracking-tight leading-tight transition-colors duration-500 ${theme.title}`}>
              Experience the 1-click capture flow.
            </h2>
            <p className={`text-lg leading-relaxed max-w-lg font-medium transition-colors duration-500 ${theme.subtitle}`}>
              Select a channel to see exactly what your followers experience when they interact with your content.
            </p>

            <div className="flex flex-col gap-3 w-full max-w-md mt-6">
              {(Object.keys(SIMULATOR_DATA) as Array<keyof typeof SIMULATOR_DATA>).map((key) => {
                const isActive = activeTab === key;
                return (
                  <button 
                    key={key}
                    onClick={() => { setActiveTab(key); setDemoStep(0); }}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left ${isActive ? theme.btnActive : theme.btnInactive}`}
                  >
                    <MessageSquare className={`w-6 h-6 ${isActive ? theme.iconActive : theme.iconInactive}`} />
                    <h4 className="font-bold text-lg">{SIMULATOR_DATA[key].title}</h4>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center items-center relative z-10 perspective-1000">
            {/* Unique Element: 3D Isometric Phone */}
            <motion.div 
              initial={{ rotateX: 20, rotateY: -20, rotateZ: 5 }}
              whileHover={{ rotateX: 0, rotateY: 0, rotateZ: 0 }}
              transition={{ duration: 0.5 }}
              className={`relative w-full max-w-[320px] h-[600px] rounded-[40px] border-[12px] overflow-hidden flex flex-col justify-between p-1 transition-all duration-500 ${theme.phoneBorder} ${theme.phoneBg} ${theme.phoneShadow}`}
            >
              <div className={`flex justify-between items-center px-6 pt-5 text-[11px] font-bold z-10 pb-3 border-b transition-colors duration-500 ${theme.title} ${theme.phoneBg} ${theme.badgeBg.replace('bg-', 'border-')}`}>
                <span>9:41</span>
                <div className={`w-16 h-5 rounded-full flex items-center justify-center text-[8px] tracking-widest uppercase transition-colors duration-500 ${theme.badgeBg}`}>Live</div>
                <span className={`w-4 h-3 rounded-[2px] inline-block transition-colors duration-500 ${theme.title.replace('text-', 'bg-')}`}></span>
              </div>

              <div className="flex-1 flex flex-col justify-end px-4 py-6 gap-4 bg-white/80 relative overflow-y-auto">
                <AnimatePresence>
                  {currentSimData.steps.map((step, idx) => {
                    if (idx > demoStep) return null;
                    if (step.type === "user") {
                      return (
                        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`rounded-2xl rounded-tr-none p-3.5 self-end text-right max-w-[85%] shadow-sm transition-colors duration-500 ${theme.chatUserBg}`}>
                          <p className="text-[9px] font-bold mb-1 opacity-60 uppercase">{step.label}</p>
                          <span className="text-[13px] font-bold">{step.text}</span>
                        </motion.div>
                      );
                    } else if (step.type === "bot") {
                      return (
                        <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none p-3.5 self-start text-left max-w-[85%] shadow-sm">
                          <p className="text-[9px] font-bold mb-1 opacity-60 uppercase">{step.label}</p>
                          <span className="text-[13px] font-semibold">{step.text}</span>
                        </motion.div>
                      );
                    } else {
                      return (
                        <motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl p-4 self-center text-center w-full shadow-lg flex items-center justify-center gap-3 mt-4 transition-colors duration-500 ${theme.chatSysBg}`}>
                          <Database className={`w-5 h-5 animate-pulse ${theme.chatPulse}`} />
                          <div className="text-left">
                            <span className="text-[11px] font-black block">{step.label}</span>
                            <span className="text-[10px] opacity-80 block mt-0.5">{step.text}</span>
                          </div>
                        </motion.div>
                      );
                    }
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. COMPARISON SECTION
          Color: Solid Peach / Rose (bg-rose-100)
          Unique Element: Split Screen Vertical Layout (Vs.)
          ================================================== */}
      <section className="bg-rose-100 relative z-10 flex flex-col md:flex-row min-h-[80vh]">
        {/* Unique Element: 50/50 Split Screen Design */}
        
        {/* Left Side: Manual (Bad) */}
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-rose-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0,transparent_100%)]"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-md">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-rose-950 mb-4">Manual Funnel</h3>
            <p className="text-rose-800 text-lg font-medium mb-8">Users click your bio, wait for a site to load, get distracted, and leave.</p>
            
            <div className="bg-white/80 rounded-2xl p-6 text-left w-full max-w-sm mx-auto shadow-sm">
              <div className="text-rose-400 text-xs font-bold uppercase mb-2">Result</div>
              <div className="text-4xl font-black text-rose-600">90% Drop-off</div>
            </div>
          </div>
        </div>

        {/* Right Side: Automated (Good) */}
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center items-center text-center bg-rose-50 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-rose-600/30">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-rose-950 mb-4">Set2Send Automation</h3>
            <p className="text-rose-800 text-lg font-medium mb-8">Emails are requested and captured seamlessly inside the active chat window.</p>
            
            <div className="bg-white rounded-2xl p-6 text-left w-full max-w-sm mx-auto shadow-xl">
              <div className="text-rose-400 text-xs font-bold uppercase mb-2">Result</div>
              <div className="text-4xl font-black text-rose-600">100% Capture Rate</div>
            </div>
          </div>
        </div>

        {/* Vs Badge in absolute center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-rose-950 rounded-full flex items-center justify-center text-white font-black text-xl shadow-2xl z-20 border-4 border-rose-100 hidden md:flex">
          VS
        </div>
      </section>

      {/* ==================================================
          4. DIAGRAM SECTION
          Color: Solid White (bg-white)
          Unique Element: Animated Data Packets along SVG paths
          ================================================== */}
      <section className="py-32 bg-white text-center relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl sm:text-6xl font-black text-sky-950 tracking-tight mb-6">
            The Zero-Friction Pipeline
          </h2>
          <p className="text-sky-800 text-lg max-w-2xl mx-auto mb-20 font-medium">
            Watch your followers transform into verified CRM records without ever leaving their social app.
          </p>

          <div className="relative max-w-4xl mx-auto h-[400px]">
            {/* Unique Element: SVG Path with moving data packet (circles) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 400">
              {/* Connecting Lines */}
              <path id="pipelinePath1" d="M 150 200 C 250 200, 350 200, 400 200" fill="none" stroke="#bae6fd" strokeWidth="4" />
              <path id="pipelinePath2" d="M 400 200 C 500 200, 600 200, 650 200" fill="none" stroke="#bae6fd" strokeWidth="4" />
              
              {/* Animated Packets */}
              <circle r="6" fill="#0284c7">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 150 200 C 250 200, 350 200, 400 200" />
              </circle>
              <circle r="6" fill="#0284c7">
                <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M 400 200 C 500 200, 600 200, 650 200" />
              </circle>
            </svg>

            {/* Nodes */}
            <div className="absolute top-1/2 left-[10%] transform -translate-y-1/2 bg-white border-2 border-sky-200 p-6 rounded-3xl shadow-xl w-48 text-center z-10">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full mx-auto mb-4 flex items-center justify-center font-black text-xl">1</div>
              <h4 className="font-bold text-sky-950">Trigger</h4>
              <p className="text-xs text-sky-700 mt-2">User comments keyword</p>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-sky-300 p-8 rounded-3xl shadow-2xl w-56 text-center z-10 scale-110">
              <div className="w-12 h-12 bg-sky-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-black text-xl">2</div>
              <h4 className="font-black text-sky-950 text-lg">Validate</h4>
              <p className="text-xs text-sky-700 mt-2">Email captured & verified in DM</p>
            </div>

            <div className="absolute top-1/2 right-[10%] transform -translate-y-1/2 bg-sky-900 border-2 border-sky-800 p-6 rounded-3xl shadow-xl w-48 text-center z-10 text-white">
              <div className="w-12 h-12 bg-sky-800 text-sky-200 rounded-full mx-auto mb-4 flex items-center justify-center font-black text-xl">3</div>
              <h4 className="font-bold">CRM Sync</h4>
              <p className="text-xs text-sky-300 mt-2">Pushed to HubSpot</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. BENEFITS SECTION
          Color: Solid Lemon Yellow (bg-yellow-200)
          Unique Element: Expanding Accordion List
          ================================================== */}
      <section className="py-24 bg-yellow-200 relative z-10 border-t border-yellow-300">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl sm:text-6xl font-black text-yellow-950 text-center mb-16">
            Why this changes everything.
          </h2>

          {/* Unique Element: Accordion List */}
          <div className="flex flex-col gap-4">
            {[
              { id: 0, title: "Own your audience", desc: "Stop renting attention from algorithms. Convert followers into permanent CRM records that you own forever. No more worrying about account bans." },
              { id: 1, title: "+140% Conversion Lift", desc: "By keeping users inside their native social environment, opt-in conversions skyrocket compared to clunky landing pages." },
              { id: 2, title: "Pristine Data Quality", desc: "Set2Send strictly validates the email syntax in the chat before accepting it, guaranteeing clean CRM data with no fake emails." }
            ].map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg transition-all">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
                >
                  <h3 className="text-2xl font-black text-yellow-950">{item.title}</h3>
                  <motion.div animate={{ rotate: activeAccordion === item.id ? 180 : 0 }}>
                    <ChevronDown className="w-8 h-8 text-yellow-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeAccordion === item.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: "auto", opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-8"
                    >
                      <p className="text-yellow-800 text-lg font-medium border-t border-yellow-100 pt-6">
                        {item.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          6. CASE STUDIES
          Color: Solid Crisp White (bg-white)
          Unique Element: Horizontal Scrolling Carousel
          ================================================== */}
      <section className="py-32 bg-white relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900">
            Real lists built.
          </h2>
        </div>

        {/* Unique Element: Horizontal Scrolling Carousel */}
        <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-6 md:px-12 pb-12 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          <div className="min-w-[80vw] md:min-w-[500px] snap-center bg-slate-50 rounded-[40px] p-12 border border-slate-200 shrink-0 shadow-lg">
            <span className="bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-full uppercase text-xs">SaaS Founder</span>
            <h3 className="text-6xl font-black text-slate-900 mt-8 mb-2">+12,400</h3>
            <p className="text-slate-500 font-black uppercase tracking-widest mb-8">Emails in 30 Days</p>
            <p className="text-slate-700 text-lg font-medium">&quot;In-DM capture raised our conversion rates from 2% to 18%, feeding our HubSpot pipeline directly.&quot;</p>
          </div>

          <div className="min-w-[80vw] md:min-w-[500px] snap-center bg-slate-900 rounded-[40px] p-12 border border-slate-800 shrink-0 shadow-lg text-white">
            <span className="bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-full uppercase text-xs">E-com Brand</span>
            <h3 className="text-6xl font-black text-white mt-8 mb-2">+8,500</h3>
            <p className="text-slate-400 font-black uppercase tracking-widest mb-8">Mailchimp Leads</p>
            <p className="text-slate-300 text-lg font-medium">&quot;Automated WhatsApp flows captured thousands of emails instantly from organic story traffic.&quot;</p>
          </div>

          <div className="min-w-[80vw] md:min-w-[500px] snap-center bg-blue-600 rounded-[40px] p-12 border border-blue-500 shrink-0 shadow-lg text-white">
            <span className="bg-blue-700 text-blue-100 font-bold px-4 py-2 rounded-full uppercase text-xs">Course Creator</span>
            <h3 className="text-6xl font-black text-white mt-8 mb-2">4x Lift</h3>
            <p className="text-blue-200 font-black uppercase tracking-widest mb-8">In List Growth</p>
            <p className="text-blue-100 text-lg font-medium">&quot;We completely removed our link-in-bio and replaced it with Set2Send comment triggers.&quot;</p>
          </div>

        </div>
      </section>

      {/* ==================================================
          7. CTA SECTION
          Color: Solid Dark Indigo (bg-indigo-900)
          Unique Element: Expanding Canvas/Particle Hover Ripple (CSS simulation)
          ================================================== */}
      <section className="py-40 px-6 text-center bg-indigo-950 relative z-10 overflow-hidden group">
        
        {/* Unique Element: Expanding Hover Ripple Background */}
        <div className="absolute inset-0 bg-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0"></div>
        <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] bg-indigo-500/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-[20] transition-transform duration-[2s] z-0 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-8">
            Ready to grow?
          </h2>
          <p className="text-indigo-200 text-xl max-w-lg mx-auto mb-12 font-medium">
            Deploy a seamless lead generation sequence in under 3 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth/google" className="w-full sm:w-auto text-center px-12 py-6 bg-white hover:bg-indigo-50 text-indigo-950 font-black text-sm uppercase tracking-widest rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:scale-105">
              Start Capturing Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
