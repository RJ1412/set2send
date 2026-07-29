"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  Heart, 
  Activity, 
  BadgeAlert,
  Coins,
  Cpu,
  Check
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Mock comments database for interactive simulator
const MOCK_COMMENTS = [
  { text: "How much is shipping?", type: "Shipping", reply: "Free worldwide shipping on orders above $50! 📦 DM sent with our checkout link." },
  { text: "What is the price?", type: "Price", reply: "Our startup pack is currently 40% off at $29. 💸 Check your DM for the discount code." },
  { text: "Is this still available?", type: "Availability", reply: "Yes! 5 packages left in this batch. ⚡ Click the link in your DM to reserve yours." }
];

export default function RespondToCommentsPage() {
  // Simulator State
  const [commentsList, setCommentsList] = useState<Array<{ text: string; sender: string; reply?: string }>>([
    { text: "Does this work for TikTok?", sender: "@marcus.creative", reply: "Yes! Set2Send fully integrates with TikTok comment DMs. 🚀 Check your inbox." },
    { text: "Price?", sender: "@danielle_ecom", reply: "Check your inbox! Sent our current 40% off pricing details. 💸" }
  ]);
  const [customCommentText, setCustomCommentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Video loop state (Comment stream -> AI -> DM -> Sale)
  const [pipelineScene, setPipelineScene] = useState(0);

  // Auto scroll the pipeline visual loop
  useEffect(() => {
    const timer = setInterval(() => {
      setPipelineScene((prev) => (prev < 3 ? prev + 1 : 0));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handlePredefinedComment = (text: string, reply: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setCommentsList((prev) => [
        ...prev,
        { text, sender: "@visitor.demo" },
        { text: reply, sender: "Set2Send Bot (Automated)" }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCustomCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommentText.trim()) return;
    
    const text = customCommentText;
    setCustomCommentText("");
    setIsTyping(true);
    
    setTimeout(() => {
      // Simple smart parsing for reply keyword
      let parsedReply = "Thanks for commenting! 🚀 Check your DMs for details.";
      const lower = text.toLowerCase();
      if (lower.includes("price") || lower.includes("cost") || lower.includes("much")) {
        parsedReply = "Our pack is currently 40% off at $29! 💸 DM sent with the code.";
      } else if (lower.includes("ship") || lower.includes("delivery")) {
        parsedReply = "Free shipping is available for all orders over $50! 📦 Check your inbox.";
      } else if (lower.includes("stock") || lower.includes("avail")) {
        parsedReply = "Yes! Still in stock. ⚡ DM sent to grab yours.";
      }

      setCommentsList((prev) => [
        ...prev,
        { text, sender: "@visitor.demo" },
        { text: parsedReply, sender: "Set2Send Bot (Automated)" }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col selection:bg-sky-200 selection:text-slate-900 relative overflow-x-hidden font-sans">
      
      {/* 
        We use a custom wrapper for Navbar/Footer if needed, 
        but since they might be dark themed, we let them handle their own colors. 
        If they inherit background, they might look weird, but we will leave them untouched. 
      */}
      <Navbar />

      {/* ==================================================
          1. HERO SECTION (Light Sky Blue)
          ================================================== */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden z-10 bg-sky-50">
        
        {/* Soft floating shapes */}
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-white/40 rounded-full blur-[80px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute top-[40%] right-[15%] w-24 h-24 bg-sky-300 rounded-[30px] rotate-12 opacity-20 pointer-events-none"></div>
        <div className="absolute top-[20%] right-[45%] w-16 h-16 bg-blue-400 rounded-full opacity-20 pointer-events-none blur-sm"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 text-left flex flex-col items-start z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm mb-6 border border-sky-100"
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest">
                Automated Comment DMs
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-[76px] font-black tracking-tight text-slate-900 leading-[1.05]"
            >
              Turn comments into <span className="text-sky-500 underline decoration-sky-300 underline-offset-8">conversations.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 mt-6 text-lg max-w-xl leading-relaxed"
            >
              Instantly reply to customer questions about pricing, shipping, or stock right in the comments feed, and trigger a conversion DM in their inbox.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/auth/google"
                className="w-full sm:w-auto text-center px-10 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-full transition-transform hover:-translate-y-1 shadow-lg shadow-sky-500/30"
              >
                Start Automating Free
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Clean Phone UI Mockup */}
          <div className="lg:col-span-6 relative w-full h-[550px] flex items-center justify-center">
            
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-[320px] h-[640px] bg-white border-[8px] border-slate-100 rounded-[50px] shadow-2xl flex flex-col overflow-hidden z-20"
            >
              {/* Header */}
              <div className="h-20 bg-slate-50 flex items-end justify-center pb-4 border-b border-slate-100">
                <span className="font-bold text-slate-800">Latest Comments</span>
              </div>

              {/* Feed */}
              <div className="flex-1 p-5 flex flex-col gap-5 bg-white">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                  <div>
                    <span className="font-bold text-sm block">@sarah_styles</span>
                    <span className="text-sm text-slate-600">Is the summer dress still in stock?</span>
                  </div>
                </div>

                {/* AI Reply */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="ml-10 bg-sky-50 p-3 rounded-2xl rounded-tl-sm border border-sky-100 relative"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                    <Sparkles size={8} className="text-white" />
                  </div>
                  <span className="font-bold text-xs text-sky-700 block mb-1">Set2Send Bot</span>
                  <span className="text-xs text-slate-700">Yes! Check your DM for a direct link to reserve yours. 👗</span>
                </motion.div>

                <div className="flex gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full bg-orange-200 shrink-0"></div>
                  <div>
                    <span className="font-bold text-sm block">@mark_daily</span>
                    <span className="text-sm text-slate-600">How much is shipping to Canada?</span>
                  </div>
                </div>

                 {/* AI Reply */}
                 <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.5 }}
                  className="ml-10 bg-sky-50 p-3 rounded-2xl rounded-tl-sm border border-sky-100 relative"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                    <Sparkles size={8} className="text-white" />
                  </div>
                  <span className="font-bold text-xs text-sky-700 block mb-1">Set2Send Bot</span>
                  <span className="text-xs text-slate-700">Shipping is free over $50! Sent details to your inbox. 📦</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating UI Elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -right-6 top-1/4 bg-white p-4 rounded-2xl shadow-xl z-30 border border-slate-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Check size={20} />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Status</span>
                <span className="block text-sm font-bold text-slate-800">Auto-Replied</span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ==================================================
          2. INTERACTIVE DEMO SECTION (Soft Orange)
          ================================================== */}
      <section className="py-24 bg-orange-50 relative z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/40 rounded-bl-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left info */}
          <div className="text-left flex flex-col items-start z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Test the AI responder.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mt-4 max-w-md">
              Select a common visitor query below or type your own. Watch our simulated bot analyze and reply in real-time.
            </p>

            <div className="mt-10 flex flex-col gap-4 w-full max-w-sm">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Select query:</span>
              <div className="flex flex-wrap gap-3">
                {MOCK_COMMENTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePredefinedComment(item.text, item.reply)}
                    disabled={isTyping}
                    className="px-5 py-3 bg-white hover:bg-orange-100 text-slate-800 rounded-full text-sm font-bold shadow-sm transition-colors border border-orange-200/50"
                  >
                    {item.type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live feed simulation screen */}
          <div className="w-full bg-white rounded-[40px] p-8 shadow-2xl relative z-10 border border-orange-100 flex flex-col h-[500px]">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <span className="text-sm font-bold text-slate-800">Live Simulation</span>
              <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full uppercase tracking-widest">Online</span>
            </div>

            {/* Feed window */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 mb-4 scrollbar-thin">
              <AnimatePresence>
                {commentsList.map((comment, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                      comment.sender.includes("Bot")
                        ? "bg-orange-50 text-slate-800 self-start rounded-tl-sm border border-orange-100"
                        : "bg-slate-100 text-slate-800 self-end rounded-tr-sm"
                    }`}
                  >
                    <span className="font-bold text-[11px] opacity-60 block mb-1">
                      {comment.sender}
                    </span>
                    <span>{comment.text}</span>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-orange-50 p-4 rounded-2xl self-start rounded-tl-sm flex gap-1 items-center"
                  >
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Form */}
            <form onSubmit={handleCustomCommentSubmit} className="flex gap-3 pt-4 border-t border-slate-100">
              <input
                type="text"
                value={customCommentText}
                onChange={(e) => setCustomCommentText(e.target.value)}
                placeholder="Type a custom comment..."
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-orange-400 focus:bg-white rounded-full px-6 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isTyping}
                className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 shrink-0 shadow-lg shadow-orange-500/30"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>

          </div>

        </div>
      </section>

      {/* ==================================================
          3. PROBLEM SECTION (Soft Rose)
          ================================================== */}
      <section className="py-24 bg-rose-50 text-center relative z-10 overflow-hidden">
        {/* Abstract squiggles */}
        <svg className="absolute top-10 left-10 text-rose-200 w-32 h-32" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98.1,-18,97.6,-2.8C97.1,12.4,89.4,27.3,79.5,40.1C69.6,52.9,57.5,63.6,43.6,71.3C29.7,79,14.8,83.7,-0.7,84.9C-16.2,86.1,-32.4,83.8,-45.5,75.3C-58.6,66.8,-68.6,52.1,-75.7,36.5C-82.8,20.9,-87,4.4,-84.9,-11C-82.8,-26.4,-74.4,-40.7,-63.3,-51.7C-52.2,-62.7,-38.4,-70.4,-24.1,-75.2C-9.8,-80,4.8,-81.9,18.8,-80.6C32.8,-79.3,46.2,-74.8,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-rose-100 flex items-center justify-center text-rose-500 shadow-sm rotate-3">
              <BadgeAlert className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Unanswered comments <br/><span className="text-rose-500">cost you sales.</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mt-2">
              Leaving user comments unanswered is like leaving shoppers stranded at the checkout counter.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            <div className="bg-white p-8 rounded-[30px] shadow-xl border border-rose-100 rotate-[-1deg] transform transition-transform hover:rotate-0">
              <h4 className="text-sm font-black text-rose-500 uppercase tracking-widest mb-4">The Wait Game</h4>
              <p className="text-slate-700 text-base leading-relaxed">
                Shoppers comment "Price?" or "Size M?" under video reels. 15 hours pass without replies. High interest fades rapidly, and the potential buyer is lost to competitor feeds forever.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[30px] shadow-xl border border-rose-100 rotate-[1deg] transform transition-transform hover:rotate-0">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Algorithm Penalty</h4>
              <p className="text-slate-700 text-base leading-relaxed">
                Social platforms favor posts with high comment velocities. If your comment feed is silent or you reply manually days later, your organic reach and exploration scores plummet.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          4. SOLUTION SECTION (Light Emerald)
          ================================================== */}
      <section className="py-24 bg-emerald-50 text-center relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Instant answers. <span className="text-emerald-600">Instant sales.</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mt-2">
              Our automated system handles everything under 2 seconds.
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 relative text-left">
            
            {/* Connecting line for desktop */}
            <div className="absolute top-1/2 left-[15%] right-[15%] h-1 border-t-2 border-dashed border-emerald-200 hidden md:block -z-10"></div>

            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100 flex flex-col">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl mb-6">1</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Semantic Parsing</h4>
              <p className="text-slate-600 leading-relaxed">
                AI reads the comment context in milliseconds, understanding exactly what the user is asking for.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100 flex flex-col md:-translate-y-8">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl mb-6">2</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Public Reply</h4>
              <p className="text-slate-600 leading-relaxed">
                Triggers a public, personalized reply tagging the user to boost algorithmic engagement safely.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100 flex flex-col">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl mb-6">3</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Private DM</h4>
              <p className="text-slate-600 leading-relaxed">
                Simultaneously fires a private message into their inbox containing the precise checkout link or requested info.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          5. BENEFITS SECTION (Light Purple)
          ================================================== */}
      <section className="py-24 bg-purple-50 relative z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="text-left relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Scale engagement <br/><span className="text-purple-600">safely & smartly.</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mt-6 mb-10 max-w-md">
              100% compliant with platform policies. Maximize your visibility without risking your account status.
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-purple-500 shrink-0 border border-purple-100">
                  <Activity size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Algorithmic Boost</h4>
                  <p className="text-slate-600">Double your comment velocity. Faster replies signal high-quality content to feeds, pushing videos further.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-purple-500 shrink-0 border border-purple-100">
                  <Cpu size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Smart Context Triggers</h4>
                  <p className="text-slate-600">Our AI doesn't just look for exact match keywords. It understands context, synonyms, and variations perfectly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] flex items-center justify-center">
            {/* Visual Abstract representation of growth */}
            <div className="w-full max-w-sm h-full bg-white rounded-[40px] shadow-2xl border border-purple-100 p-8 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute top-8 left-8">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-1">Engagement</span>
                <span className="text-4xl font-black text-purple-600">+450%</span>
              </div>
              
              {/* Bar charts */}
              <div className="flex items-end justify-between h-48 gap-3 mt-auto">
                <motion.div initial={{ height: 0 }} whileInView={{ height: "40%" }} viewport={{ once: true }} transition={{ duration: 1 }} className="w-full bg-slate-100 rounded-t-xl"></motion.div>
                <motion.div initial={{ height: 0 }} whileInView={{ height: "55%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1 }} className="w-full bg-slate-200 rounded-t-xl"></motion.div>
                <motion.div initial={{ height: 0 }} whileInView={{ height: "70%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="w-full bg-purple-200 rounded-t-xl"></motion.div>
                <motion.div initial={{ height: 0 }} whileInView={{ height: "100%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="w-full bg-purple-500 rounded-t-xl relative">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg whitespace-nowrap">
                    Set2Send Active
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          6. ANIMATED PIPELINE (Warm Amber)
          ================================================== */}
      <section className="py-24 bg-amber-50 text-center relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            The Conversion Pipeline
          </h2>
          <p className="text-slate-600 text-lg mb-16 max-w-2xl mx-auto">
            See how a single comment flows through the Set2Send engine.
          </p>

          <div className="w-full bg-white rounded-[40px] p-8 shadow-xl border border-amber-100 flex flex-col items-center min-h-[300px] justify-center relative">
            
            <AnimatePresence>
                
              {pipelineScene === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-6">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">1. Comment Dropped</h3>
                  <p className="text-slate-600 mt-2">A user asks "Where can I buy this?"</p>
                </motion.div>
              )}

              {pipelineScene === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mb-6 animate-spin" style={{ animationDuration: "3s" }}>
                    <Cpu size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">2. AI Processes Context</h3>
                  <p className="text-slate-600 mt-2">Routing to the "Purchase Link" flow.</p>
                </motion.div>
              )}

              {pipelineScene === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center text-center">
                  <div className="w-64 bg-slate-900 text-white rounded-2xl p-4 shadow-lg text-left mb-6">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-2">Direct Message</span>
                    <span className="text-sm font-bold">Here is your link to purchase: [Store URL]</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">3. DM Sent Instantly</h3>
                  <p className="text-slate-600 mt-2">Delivered to their inbox in 1.8 seconds.</p>
                </motion.div>
              )}

              {pipelineScene === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-inner">
                    <Coins size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">4. Revenue Captured</h3>
                  <p className="text-slate-600 mt-2">Frictionless transition from social to storefront.</p>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Pagination dots */}
            <div className="absolute bottom-6 flex gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${pipelineScene === idx ? "bg-amber-500" : "bg-slate-200"}`}></div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          7. CASE STUDIES (Light Blue-Grey)
          ================================================== */}
      <section className="py-24 bg-slate-50 text-center relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-16">
            Real Creators. Real Revenue.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
            
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-blue-100 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Brock Johnson</h4>
                  <p className="text-slate-500 text-sm">Fitness Influencer</p>
                </div>
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-2">4x DMs</h3>
              <p className="text-blue-600 font-bold text-sm mb-6 uppercase tracking-widest">Growth in 30 days</p>
              <p className="text-slate-600 leading-relaxed italic">
                "Before Set2Send, my team took 24 hours to reply. Now it happens instantly. My conversion rates quadrupled because we strike while the interest is high."
              </p>
            </div>

            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-indigo-100 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Course Launch Group</h4>
                  <p className="text-slate-500 text-sm">Digital Products</p>
                </div>
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-2">8k Replies</h3>
              <p className="text-indigo-600 font-bold text-sm mb-6 uppercase tracking-widest">Handled per day</p>
              <p className="text-slate-600 leading-relaxed italic">
                "We saved $4,000/mo on VA costs by using Set2Send to manage our launch comment traffic. It handled thousands of DMs without breaking a sweat."
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          8. CTA SECTION (Vibrant Light Gradient)
          ================================================== */}
      <section className="py-32 px-6 text-center relative z-10 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
        <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-xl border border-white rounded-[40px] p-16 shadow-2xl flex flex-col items-center">
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            Stop losing leads.
          </h2>
          <p className="text-slate-600 text-lg max-w-lg mb-10">
            Connect your socials in seconds and set up your first comment responder sequence in under 3 minutes.
          </p>

          <Link 
            href="/auth/google"
            className="px-12 py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-widest rounded-full shadow-xl transition-transform hover:-translate-y-1"
          >
            Start Free Trial
          </Link>
          <span className="text-slate-500 text-xs mt-4 font-bold uppercase tracking-widest">No credit card required</span>

        </div>
      </section>

      <Footer />

    </div>
  );
}
