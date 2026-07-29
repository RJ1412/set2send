"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  MessageCircle, 
  Lock, 
  Unlock, 
  UserPlus, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2,
  Heart,
  BarChart,
  Send
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Data Structure from Reference
const S = [
  { c: '#6C63FF', ca: 'rgba(108,99,255,0.16)', cb: 'rgba(108,99,255,0.45)', fg: 'rgba(108,99,255,0.26)', gr: 'linear-gradient(90deg,#6C63FF,#a89fff)', gt: 'gate fire.', pt: '"LINK" comment received', ps: 'Trigger matched — engine active', bar: 73, stat: '98.4%', cta: 'linear-gradient(135deg,#6C63FF 0%,#8b83ff 100%)' },
  { c: '#FF6B35', ca: 'rgba(255,107,53,0.14)', cb: 'rgba(255,107,53,0.45)', fg: 'rgba(255,107,53,0.26)', gr: 'linear-gradient(90deg,#FF6B35,#ffb38a)', gt: 'gate fires.', pt: 'Follow gate deployed', ps: 'DM sent: "Follow to unlock"', bar: 55, stat: '99.1%', cta: 'linear-gradient(135deg,#FF6B35 0%,#ff9060 100%)' },
  { c: '#00B89C', ca: 'rgba(0,184,156,0.14)', cb: 'rgba(0,184,156,0.45)', fg: 'rgba(0,184,156,0.26)', gr: 'linear-gradient(90deg,#00B89C,#5fffec)', gt: 'gate checks.', pt: 'Follow confirmed', ps: 'Meta API verified in 0.3s', bar: 88, stat: '97.8%', cta: 'linear-gradient(135deg,#00B89C 0%,#00dbb5 100%)' },
  { c: '#22C55E', ca: 'rgba(34,197,94,0.14)', cb: 'rgba(34,197,94,0.45)', fg: 'rgba(34,197,94,0.26)', gr: 'linear-gradient(90deg,#22C55E,#86efac)', gt: 'gate delivers.', pt: 'Reward delivered', ps: 'DM sent to @user123', bar: 95, stat: '98.9%', cta: 'linear-gradient(135deg,#22C55E 0%,#4ade80 100%)' }
];

export default function RequestToFollowPage() {
  const [cur, setCur] = useState(0);
  const [triggerCount, setTriggerCount] = useState(1847);
  const [flash, setFlash] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;
    const auto = setInterval(() => {
      setCur(prev => (prev < 3 ? prev + 1 : 0));
      setFlash(f => f + 1); // trigger screen flash effect
    }, 2800);
    return () => clearInterval(auto);
  }, [isInView]);

  useEffect(() => {
    const auto = setInterval(() => {
      setTriggerCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2200);
    return () => clearInterval(auto);
  }, []);

  const go = (i: number) => {
    setCur(i);
    setFlash(f => f + 1);
  };

  const s = S[cur];

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans selection:bg-violet-200 selection:text-violet-900">
      
      {/* Inject custom CSS for the complex reference animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .wrap { width:100%; background:#F4F3FF; min-height:1000px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; }
        .stage { width:1100px; height:750px; position:relative; perspective:1200px; perspective-origin:50% 58%; transform: scale(1.05); }
        .floor { position:absolute; bottom:0; left:0; right:0; height:240px; background: linear-gradient(rgba(108,99,255,0.07) 1px,transparent 1px), linear-gradient(90deg,rgba(108,99,255,0.07) 1px,transparent 1px); background-size:40px 40px; transform:rotateX(80deg); transform-origin:bottom center; transition: opacity 0.8s; }
        .ambient { position:absolute; width:450px; height:450px; border-radius:50%; top:50px; left:50%; transform:translateX(-20%); background:radial-gradient(circle,rgba(108,99,255,0.13) 0%,transparent 65%); pointer-events:none; transition:background 0.9s ease; }
        .phone-scene { position:absolute; bottom:110px; left:50%; transform:translateX(-50%); transform-style:preserve-3d; animation:idle 6s ease-in-out infinite; }
        @keyframes idle { 0%,100%{transform:translateX(-50%) rotateX(52deg) rotateZ(-16deg) translateY(0)} 50%{transform:translateX(-50%) rotateX(52deg) rotateZ(-16deg) translateY(-10px)} }
        .phone { width:180px; height:320px; background:linear-gradient(160deg,#fff 0%,#eeeeff 100%); border-radius:32px; border:1px solid rgba(108,99,255,0.15); box-shadow:0 0 0 1px #fff,0 35px 85px rgba(108,99,255,0.2),0 10px 25px rgba(0,0,0,0.07),inset 0 1px 0 #fff; position:relative; overflow:hidden; }
        .phone-notch { width:50px; height:6px; background:rgba(108,99,255,0.1); border-radius:4px; margin:14px auto 0; }
        .phone-screen-inner { margin:12px 10px 10px; background:#f9f9ff; border-radius:20px; height:270px; overflow:hidden; display:flex; flex-direction:column; padding:12px; gap:8px; position:relative; border:0.5px solid rgba(108,99,255,0.1); transition: border-color 0.5s; }
        .ps-label { font-size:9px; font-weight:700; letter-spacing:0.1em; color:rgba(108,99,255,0.45); text-align:center; margin-bottom:2px; }
        .ps-card { background:rgba(108,99,255,0.08); border:1px solid rgba(108,99,255,0.2); border-radius:12px; padding:10px; transition:all 0.6s ease; }
        .ps-card-title { font-size:10px; font-weight:700; color:#1a1a2e; }
        .ps-card-sub { font-size:8px; color:#888; margin-top:3px; }
        .screen-flash { position:absolute; inset:0; border-radius:20px; opacity:0; pointer-events:none; background:rgba(108,99,255,0.08); transition: opacity 0.35s; }
        .floor-glow { position:absolute; bottom:80px; left:50%; transform:translateX(-50%); width:220px; height:60px; border-radius:50%; background:radial-gradient(ellipse,rgba(108,99,255,0.28) 0%,transparent 70%); filter:blur(15px); transition:background 0.8s ease; pointer-events:none; }
        .beam-wrap { position:absolute; bottom:390px; left:50%; transform:translateX(-50%); pointer-events:none; }
        .beam-cone { position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:300px; height:280px; clip-path:polygon(40% 100%,60% 100%,100% 0%,0% 0%); background:linear-gradient(0deg,rgba(108,99,255,0.18) 0%,rgba(108,99,255,0.04) 75%,transparent 100%); transition:background 0.8s ease; animation:flicker 3.5s ease-in-out infinite; }
        @keyframes flicker { 0%,100%{opacity:1} 45%{opacity:0.8} 50%{opacity:1} 78%{opacity:0.88} }
        .beam-center { position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:3px; height:260px; background:linear-gradient(0deg,rgba(108,99,255,0.5) 0%,rgba(108,99,255,0.03) 100%); transition:background 0.8s ease; }
        .beam-scan { position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:240px; height:3px; background:linear-gradient(90deg,transparent,rgba(108,99,255,0.45),transparent); animation:scanup 2.8s ease-in-out infinite; transition:background 0.8s ease; }
        @keyframes scanup { 0%{bottom:0;opacity:1} 80%{opacity:0.5} 100%{bottom:260px;opacity:0} }
        .holo-stack { position:absolute; bottom:400px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column-reverse; gap:14px; align-items:center; pointer-events:none; }
        .holo-msg { background:rgba(255,255,255,0.88); border:1px solid rgba(108,99,255,0.2); border-radius:20px; padding:14px 20px; display:flex; align-items:center; gap:14px; min-width:300px; max-width:350px; box-shadow:0 4px 22px rgba(108,99,255,0.1),inset 0 1px 0 #fff; opacity:0; transform:translateY(24px) scale(0.93); transition:opacity 0.6s cubic-bezier(.16,1,.3,1),transform 0.6s cubic-bezier(.16,1,.3,1),box-shadow 0.5s ease,border-color 0.5s ease; }
        .holo-msg.visible { opacity:1; transform:translateY(0) scale(1); animation:bob 4s ease-in-out infinite; }
        .holo-msg.past { opacity:0.28; transform:translateY(-4px) scale(0.95); animation:none; }
        .holo-msg:nth-child(2) { animation-delay:0.4s; }
        .holo-msg:nth-child(3) { animation-delay:0.8s; }
        @keyframes bob { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-7px) scale(1)} }
        .msg-icon { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; background:rgba(108,99,255,0.1); color:#6C63FF; transition:all 0.5s; }
        .msg-body { flex:1; }
        .msg-title { font-size:14px; font-weight:700; color:#0a0a1a; line-height:1.3; }
        .msg-sub { font-size:12px; color:#999; margin-top:2px; }
        .msg-tag { font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px; background:rgba(108,99,255,0.1); color:#6C63FF; flex-shrink:0; border:0.5px solid rgba(108,99,255,0.18); transition:all 0.5s; }
        .particles { position:absolute; bottom:130px; left:50%; transform:translateX(-50%); width:160px; height:300px; pointer-events:none; }
        .particle { position:absolute; width:4px; height:4px; border-radius:50%; background:#6C63FF; opacity:0; animation:rise linear infinite; transition:background 0.8s; }
        @keyframes rise { 0%{opacity:0;transform:translateY(0) translateX(0) scale(1)} 15%{opacity:0.5} 85%{opacity:0.3} 100%{opacity:0;transform:translateY(-300px) translateX(var(--drift)) scale(0.2)} }
        .left-panel { position:absolute; left:0; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:8px; width:280px; }
        .badge-pill { display:inline-flex; align-items:center; gap:6px; background:#fff; border:0.5px solid rgba(108,99,255,0.25); border-radius:20px; padding:6px 12px; font-size:10px; font-weight:700; letter-spacing:0.08em; color:#6C63FF; margin-bottom:12px; box-shadow:0 1px 4px rgba(108,99,255,0.1); transition: border-color 0.5s, color 0.5s, box-shadow 0.5s; }
        .pdot { width:6px; height:6px; border-radius:50%; background:#6C63FF; animation:pdotPulse 1.4s ease-in-out infinite; transition:background 0.6s; }
        @keyframes pdotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        .hl { font-size:42px; font-weight:900; line-height:1.1; color:#0a0a1a; margin-bottom:12px; }
        .grad { display:block; background:linear-gradient(90deg,#6C63FF,#a89fff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; transition:background 0.8s; }
        .sub-txt { font-size:13px; color:#777; line-height:1.6; max-width:240px; margin-bottom:24px; }
        .step-item { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:12px; cursor:pointer; transition:all 0.4s; border:1px solid transparent; }
        .step-item.active { background:rgba(108,99,255,0.07); border-color:rgba(108,99,255,0.2); }
        .step-bar { width:4px; height:28px; background:rgba(0,0,0,0.08); flex-shrink:0; transition:background 0.6s; border-radius:0; }
        .step-item.active .step-bar { background:#6C63FF; }
        .step-item.done .step-bar { background:#22C55E; }
        .step-num { font-size:11px; font-weight:700; color:#ccc; font-family:monospace; transition:color 0.4s; }
        .step-item.active .step-num { color:#6C63FF; }
        .step-item.done .step-num { color:#22C55E; }
        .step-name { font-size:14px; font-weight:600; color:#bbb; transition:color 0.4s; flex:1; }
        .step-item.active .step-name { color:#0a0a1a; }
        .step-item.done .step-name { color:#888; }
        .si-ic { font-size:16px; color:#ddd; transition:color 0.4s; margin-left:auto; }
        .step-item.active .si-ic { color:#6C63FF; }
        .step-item.done .si-ic { color:#22C55E; }
        .ctrl-row { display:flex; gap:8px; margin-top:16px; }
        .btn { flex:1; padding:10px; border-radius:10px; border:0.5px solid rgba(0,0,0,0.12); background:#fff; color:#555; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.05); }
        .btn:hover { background:#f5f5ff; }
        .btn.p { background:#6C63FF; border-color:#6C63FF; color:#fff; box-shadow:0 2px 8px rgba(108,99,255,0.3); transition: background 0.6s, border-color 0.6s; }
        .btn.p:hover { opacity: 0.9; }
        .right-panel { position:absolute; right:0; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:12px; width:260px; }
        .rp-title { font-size:11px; font-weight:700; letter-spacing:0.07em; color:rgba(108,99,255,0.6); margin-bottom:4px; text-transform:uppercase; transition: color 0.6s; }
        .stat-card { background:#fff; border:0.5px solid rgba(108,99,255,0.12); border-radius:16px; padding:14px 16px; box-shadow:0 2px 8px rgba(108,99,255,0.07); transition:border-color 0.5s,box-shadow 0.5s; }
        .stat-card:hover { box-shadow:0 4px 16px rgba(108,99,255,0.13); }
        .stat-top { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
        .stat-icon { width:32px; height:32px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; background:rgba(108,99,255,0.1); color:#6C63FF; transition:all 0.5s; }
        .stat-label { font-size:12px; color:#999; font-weight:500; }
        .stat-val { font-size:32px; font-weight:900; color:#0a0a1a; line-height:1; transition:color 0.5s; }
        .stat-sub { font-size:11px; color:#bbb; margin-top:4px; }
        .live-feed { background:#fff; border:0.5px solid rgba(108,99,255,0.12); border-radius:16px; padding:14px 16px; box-shadow:0 2px 8px rgba(108,99,255,0.07); transition: border-color 0.5s; }
        .feed-header { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
        .feed-dot { width:6px; height:6px; border-radius:50%; background:#22C55E; animation:pdotPulse 1.2s ease-in-out infinite; flex-shrink:0; }
        .feed-label { font-size:10px; font-weight:700; color:#22C55E; letter-spacing:0.06em; }
        .feed-row { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:0.5px solid rgba(0,0,0,0.05); }
        .feed-row:last-child { border-bottom:none; padding-bottom:0; }
        .feed-avatar { width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; flex-shrink:0; background:rgba(108,99,255,0.12); color:#6C63FF; transition:all 0.5s; }
        .feed-text { flex:1; }
        .feed-user { font-size:12px; font-weight:600; color:#0a0a1a; }
        .feed-action { font-size:11px; color:#aaa; }
        .feed-time { font-size:10px; color:#ccc; flex-shrink:0; }
        .feed-status { width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; flex-shrink:0; }
        .cta-card { background:linear-gradient(135deg,#6C63FF 0%,#8b83ff 100%); border-radius:16px; padding:16px; transition:background 0.8s; cursor:pointer; }
        .cta-card:hover { opacity:0.92; }
        .cta-title { font-size:14px; font-weight:800; color:#fff; margin-bottom:6px; }
        .cta-sub { font-size:11px; color:rgba(255,255,255,0.7); margin-bottom:12px; line-height:1.4; }
        .cta-btn { background:rgba(255,255,255,0.2); border:0.5px solid rgba(255,255,255,0.35); border-radius:8px; padding:8px 14px; font-size:11px; font-weight:700; color:#fff; display:inline-block; cursor:pointer; }
        .trigger-count { background:#fff; border:0.5px solid rgba(108,99,255,0.12); border-radius:16px; padding:14px 16px; box-shadow:0 2px 8px rgba(108,99,255,0.07); transition: border-color 0.5s; }
        .tc-label { font-size:12px; color:#999; font-weight:500; margin-bottom:8px; }
        .tc-bar-wrap { height:6px; background:rgba(108,99,255,0.1); border-radius:3px; overflow:hidden; margin-bottom:6px; }
        .tc-bar { height:100%; border-radius:3px; background:#6C63FF; transition:width 0.8s ease,background 0.6s; }
        .tc-nums { display:flex; justify-content:space-between; font-size:10px; color:#bbb; }
      `}} />

      <div className="bg-violet-50">
        <Navbar />
      </div>

      {/* ==================================================
          1. HERO SECTION (Soft Violet)
          ================================================== */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden z-10 bg-violet-50">
        <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-violet-200/50 rounded-full blur-[100px] mix-blend-multiply opacity-70 pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-fuchsia-200/50 rounded-full blur-[120px] mix-blend-multiply opacity-70 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-left flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-violet-100 shadow-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-bold text-violet-800 tracking-wide uppercase">Request to Follow</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-violet-950 leading-[1.05]"
            >
              Turn <span className="text-violet-600">comments</span> <br/>
              into followers.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-violet-900/70 text-lg md:text-xl mt-6 max-w-lg leading-relaxed font-medium"
            >
              If they want the link, they have to follow you first. Automatically hold back DM links until the user hits the follow button.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10"
            >
              <Link
                href="/auth/google"
                className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full shadow-xl shadow-violet-600/20 transition-all hover:-translate-y-1 flex items-center gap-3"
              >
                Setup Auto-Follow Gate <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <div className="relative w-full h-[500px] flex items-center justify-center perspective-1000">
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-10 left-10 bg-white p-5 rounded-2xl shadow-xl shadow-violet-900/5 border border-violet-100 z-10 w-64"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-violet-600" />
                </div>
                <div className="text-sm font-bold text-violet-950">@random_user</div>
              </div>
              <p className="text-sm text-violet-800/80 font-medium">&quot;Send me the link please!&quot;</p>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10], scale: [0.98, 1.02, 0.98] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white p-6 rounded-3xl shadow-2xl shadow-violet-600/30 z-20 w-72 backdrop-blur-md"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">Follow to Unlock</h3>
                <p className="text-xs text-white/80">You must follow @creator to receive the link in your DMs.</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-10 right-4 bg-white p-5 rounded-2xl shadow-xl shadow-violet-900/5 border border-violet-100 z-30 w-64"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-sm font-bold text-green-950">System</div>
              </div>
              <p className="text-sm text-green-800/80 font-medium">Link delivered to DMs! 🎁</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================
          2. WATCH THE GATE IN ACTION (Hologram Light Reference)
          ================================================== */}
      <div 
        ref={sectionRef}
        className="wrap" 
        style={{ transition: 'background-color 0.8s', backgroundColor: cur === 0 ? '#F4F3FF' : cur === 1 ? '#FFF5F0' : cur === 2 ? '#EFFFFC' : '#F0FDF4' }}
      >
        <div className="stage">
          
          <div className="ambient" style={{ background: `radial-gradient(circle,${s.c}1a 0%,transparent 65%)` }}></div>
          <div className="floor" style={{ backgroundImage: `linear-gradient(${s.c}12 1px, transparent 1px), linear-gradient(90deg, ${s.c}12 1px, transparent 1px)` }}></div>
          <div className="floor-glow" style={{ background: `radial-gradient(ellipse,${s.fg} 0%,transparent 70%)` }}></div>

          {/* LEFT PANEL */}
          <div className="left-panel">
            <div className="badge-pill" style={{ borderColor: `${s.c}40`, color: s.c, boxShadow: `0 1px 4px ${s.c}1a` }}>
              <span className="pdot" style={{ backgroundColor: s.c }}></span>LIVE ENGINE
            </div>
            <div className="hl">Watch the<br/><span className="grad" style={{ background: s.gr, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.gt}</span></div>
            <div className="sub-txt">Zero clicks. Zero delays. Fully automated — in real time.</div>
            
            {[
              { text: "Comment detected", icon: <MessageCircle className="w-3.5 h-3.5" /> },
              { text: "Gate deployed", icon: <Lock className="w-3.5 h-3.5" /> },
              { text: "Follow verified", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
              { text: "Reward delivered", icon: <Send className="w-3.5 h-3.5" /> }
            ].map((step, idx) => {
              const isActive = idx === cur;
              const isDone = idx < cur;
              return (
                <div key={idx} className={`step-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`} onClick={(e) => { e.stopPropagation(); go(idx); }} style={{ backgroundColor: isActive ? `${s.c}0d` : '', borderColor: isActive ? `${s.c}28` : '' }}>
                  <div className="step-bar" style={{ backgroundColor: isActive ? s.c : isDone ? '#22C55E' : '' }}></div>
                  <span className="step-num" style={{ color: isActive ? s.c : isDone ? '#22C55E' : '' }}>0{idx + 1}</span>
                  <span className="step-name" style={{ color: isActive ? '#0a0a1a' : isDone ? '#888' : '' }}>{step.text}</span>
                  <span className="si-ic" style={{ color: isActive ? s.c : isDone ? '#22C55E' : '' }}>{step.icon}</span>
                </div>
              );
            })}
          </div>

          {/* PHONE */}
          <div className="phone-scene">
            <div className="phone">
              <div className="phone-notch"></div>
              <div className="phone-screen-inner" style={{ borderColor: `${s.c}1a` }}>
                <div className="ps-label">AUTOMATION ENGAGED</div>
                <div className="ps-card" style={{ backgroundColor: `${s.c}12`, borderColor: `${s.c}30` }}>
                  <div className="ps-card-title">{s.pt}</div>
                  <div className="ps-card-sub">{s.ps}</div>
                </div>
                {/* Screen flash effect */}
                <div className="screen-flash" key={flash} style={{ backgroundColor: `${s.c}12`, animation: flash ? 'flash 0.35s ease-out' : 'none' }}></div>
                <style dangerouslySetInnerHTML={{__html: `@keyframes flash { 0% {opacity:1} 100% {opacity:0} }`}} />
              </div>
            </div>
          </div>

          {/* BEAM */}
          <div className="beam-wrap">
            <div className="beam-cone" style={{ background: `linear-gradient(0deg,${s.ca} 0%,${s.c}06 75%,transparent 100%)` }}></div>
            <div className="beam-center" style={{ background: `linear-gradient(0deg,${s.cb} 0%,${s.c}08 100%)` }}></div>
            <div className="beam-scan" style={{ background: `linear-gradient(90deg,transparent,${s.c}66,transparent)` }}></div>
          </div>

          {/* HOLO MESSAGES */}
          <div className="holo-stack">
            {[
              { user: "@user123: \"LINK\"", sub: "Comment trigger matched", tag: "NEW", icon: <MessageCircle className="w-4 h-4" /> },
              { user: "Follow to unlock", sub: "Gate DM sent automatically", tag: "GATE", icon: <Lock className="w-4 h-4" /> },
              { user: "Follow confirmed", sub: "Meta API verified in 0.3s", tag: "OK", icon: <CheckCircle2 className="w-4 h-4" /> },
              { user: "DM sent: your free guide", sub: "Reward delivered to inbox", tag: "SENT", icon: <Send className="w-4 h-4" /> }
            ].map((msg, idx) => {
              const isActive = idx === cur;
              const isPast = idx < cur;
              return (
                <div key={idx} className={`holo-msg ${isActive ? 'visible' : ''} ${isPast ? 'past' : ''}`} style={{ borderColor: isActive ? `${s.c}44` : isPast ? 'rgba(34,197,94,0.18)' : '', boxShadow: isActive ? `0 6px 30px ${s.c}18,inset 0 1px 0 #fff` : '' }}>
                  <div className="msg-icon" style={{ backgroundColor: isActive ? `${s.c}15` : '', color: isActive ? s.c : '' }}>{msg.icon}</div>
                  <div className="msg-body">
                    <div className="msg-title">{msg.user}</div>
                    <div className="msg-sub">{msg.sub}</div>
                  </div>
                  <div className="msg-tag" style={{ backgroundColor: isActive ? `${s.c}10` : '', color: isActive ? s.c : '', borderColor: isActive ? `${s.c}22` : '' }}>{msg.tag}</div>
                </div>
              );
            })}
          </div>

          {/* PARTICLES */}
          <div className="particles">
             {[...Array(13)].map((_, i) => (
               <div 
                 key={i} 
                 className="particle" 
                 style={{
                   left: `${8 + (((i * 17) % 10) / 10) * 94}px`,
                   bottom: `${(((i * 7) % 10) / 10) * 22}px`,
                   animationDuration: `${2.3 + (((i * 13) % 10) / 10) * 2.2}s`,
                   animationDelay: `${(((i * 19) % 10) / 10) * 3.2}s`,
                   backgroundColor: s.c
                 }}
               ></div>
             ))}
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <div className="rp-title" style={{ color: `${s.c}99` }}>Live Stats</div>

            <div className="stat-card" style={{ borderColor: `${s.c}1e` }}>
              <div className="stat-top">
                <div className="stat-icon" style={{ backgroundColor: `${s.c}15`, color: s.c }}><BarChart className="w-3.5 h-3.5" /></div>
                <div className="stat-label">DM Delivery Rate</div>
              </div>
              <div className="stat-val" style={{ color: s.c }}>{s.stat}</div>
              <div className="stat-sub">Last 30 days</div>
            </div>

            <div className="trigger-count" style={{ borderColor: `${s.c}1e` }}>
              <div className="tc-label">Triggers today</div>
              <div className="tc-bar-wrap">
                <div className="tc-bar" style={{ width: `${s.bar}%`, backgroundColor: s.c }}></div>
              </div>
              <div className="tc-nums"><span>{triggerCount.toLocaleString()}</span><span>2,500 cap</span></div>
            </div>

            <div className="live-feed" style={{ borderColor: `${s.c}1e` }}>
              <div className="feed-header">
                <div className="feed-dot"></div>
                <div className="feed-label">LIVE TRIGGERS</div>
              </div>
              
              {[
                { initials: 'AK', user: '@akash_23', action: 'commented "LINK"', time: '0s', status: '✓', sBg: 'rgba(34,197,94,0.1)', sCol: '#22C55E' },
                { initials: 'PR', user: '@priya_r', action: 'DM delivered', time: '2s', status: '✓', sBg: 'rgba(34,197,94,0.1)', sCol: '#22C55E' },
                { initials: 'MK', user: '@mk_creator', action: 'gate triggered', time: '5s', status: '⟳', sBg: 'rgba(255,107,53,0.1)', sCol: '#FF6B35' },
              ].map((feed, idx) => (
                <div key={idx} className="feed-row">
                  <div className="feed-avatar" style={{ backgroundColor: `${s.c}15`, color: s.c }}>{feed.initials}</div>
                  <div className="feed-text">
                    <div className="feed-user">{feed.user}</div>
                    <div className="feed-action">{feed.action}</div>
                  </div>
                  <div className="feed-time">{feed.time}</div>
                  <div className="feed-status" style={{ backgroundColor: feed.sBg, color: feed.sCol }}>{feed.status}</div>
                </div>
              ))}
            </div>

            <div className="cta-card" style={{ background: s.cta }}>
              <div className="cta-title">Set up your gate</div>
              <div className="cta-sub">Start automating DMs in under 5 minutes.</div>
              <div className="cta-btn">Get started ↗</div>
            </div>
          </div>

        </div>
      </div>

      {/* ==================================================
          3. PROBLEM VS SOLUTION (Soft Amber/Cream)
          ================================================== */}
      <section className="py-32 bg-amber-50 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <ShieldAlert className="w-10 h-10 text-amber-600 mb-6" />
            <h2 className="text-4xl md:text-5xl font-black text-amber-950 tracking-tight leading-tight max-w-2xl">
              Stop letting viewers take your value and leave.
            </h2>
            <p className="text-amber-900/70 text-lg mt-6 max-w-xl font-medium">
              Giving away resources without a follow gate means 80% of users will download your hard work without ever subscribing to your content.
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border border-rose-100 p-8 rounded-3xl shadow-lg shadow-rose-900/5 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[100px] z-0"></div>
              <div className="relative z-10">
                <span className="text-xs font-black font-mono text-rose-500 uppercase tracking-widest block mb-4">Without Follow Gate</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">The Link Scraper</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Users see your viral reel, comment to get the link, download your template, and immediately scroll away. Zero audience growth.
                </p>
                <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span> 10,000 Views = 0 New Followers
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border border-amber-100 p-8 rounded-3xl shadow-xl shadow-amber-900/10 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] z-0"></div>
              <div className="relative z-10">
                <span className="text-xs font-black font-mono text-amber-600 uppercase tracking-widest block mb-4">With Follow Gate</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">The Loyal Follower</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Users comment. Our bot says &quot;Follow first!&quot;. They tap follow, get the link, and now they see your content forever.
                </p>
                <div className="bg-amber-50 text-amber-800 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span> 10,000 Views = 2,500 New Followers
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ==================================================
          4. WORKFLOW SECTION (Soft Lavender/Indigo)
          ================================================== */}
      <section className="py-32 bg-indigo-50 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative">
          
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-indigo-950 tracking-tight">How the magic happens</h2>
            <p className="text-indigo-800/70 text-lg mt-4 font-medium">A seamless, automated sequence verified directly via API.</p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-indigo-200/50 transform -translate-y-1/2 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              
              <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-xl shadow-indigo-900/5 border border-indigo-100 relative group hover:-translate-y-2 transition-transform">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner rotate-3 group-hover:rotate-0 transition-transform">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-indigo-950 mb-2">1. They Comment</h3>
                <p className="text-indigo-800/70 text-sm leading-relaxed font-medium">
                  A viewer comments your trigger word (e.g., &quot;GUIDE&quot;) on your reel or post.
                </p>
              </div>

              <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-xl shadow-indigo-900/5 border border-indigo-100 relative group hover:-translate-y-2 transition-transform">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner -rotate-3 group-hover:rotate-0 transition-transform">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-indigo-950 mb-2">2. We Request Follow</h3>
                <p className="text-indigo-800/70 text-sm leading-relaxed font-medium">
                  We check their status instantly. If they don&apos;t follow, we auto-reply asking them to.
                </p>
              </div>

              <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-xl shadow-indigo-900/5 border border-indigo-100 relative group hover:-translate-y-2 transition-transform">
                <div className="w-16 h-16 bg-fuchsia-100 text-fuchsia-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner rotate-3 group-hover:rotate-0 transition-transform">
                  <Unlock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-indigo-950 mb-2">3. Link Delivered</h3>
                <p className="text-indigo-800/70 text-sm leading-relaxed font-medium">
                  The second they hit follow, the secure link drops directly into their DMs.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          5. CTA SECTION (Soft Pink)
          ================================================== */}
      <section className="py-32 bg-pink-50 relative z-10 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,207,232,0.5)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center mb-8 shadow-inner shadow-pink-300"
          >
            <Heart className="w-10 h-10 text-pink-600 fill-pink-600" />
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-pink-950 tracking-tight leading-tight">
            Stop losing followers.
          </h2>
          <p className="text-pink-900/70 text-xl mt-6 mb-12 max-w-xl font-medium">
            Setup your first Follow-Gate in under 2 minutes. Connect your Instagram, create the flow, and watch your audience grow.
          </p>

          <Link
            href="/auth/google"
            className="group relative px-10 py-5 bg-pink-600 text-white font-black text-lg rounded-full shadow-2xl shadow-pink-600/30 overflow-hidden transition-transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative flex items-center gap-3">
              Start Free Trial <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          
          <span className="text-pink-800/50 font-bold text-sm mt-6">No credit card required for setup.</span>
        </div>
      </section>

      <div className="bg-pink-50">
        <Footer />
      </div>

    </div>
  );
}
