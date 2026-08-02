"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";
import { 
  Bell,
  Send,
  Zap,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  MessageSquare,
  Image as ImageIcon,
  Key,
  GitBranch,
  Activity,
  Plus,
  UserPlus,
  Sparkles,
  Clock
} from "lucide-react";

export default function DashboardPage() {
  const { user: session } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: planStatus, isLoading: planLoading } = useQuery({
    queryKey: ["planStatus"],
    queryFn: () => api.get("/billing/current-plan").then((res) => res.data),
    enabled: !!session,
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => api.get("/campaigns").then((res) => res.data),
    enabled: !!session,
  });

  const { data: flows, isLoading: flowsLoading } = useQuery({
    queryKey: ["flows"],
    queryFn: () => api.get("/flows").then((res) => res.data),
    enabled: !!session,
  });

  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ["walletBalance"],
    queryFn: () => api.get("/wallet").then((res) => res.data),
    enabled: !!session,
  });

  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralStatus, setReferralStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [referralMsg, setReferralMsg] = useState("");

  useEffect(() => {
    if (mounted && session && session.google_id && !session.referred_by_code) {
      const dismissed = localStorage.getItem("referralPromptDismissed");
      if (!dismissed) {
        setShowReferralModal(true);
      }
    }
  }, [mounted, session]);

  const handleApplyReferral = async () => {
    if (!referralCode.trim()) return;
    setReferralStatus("loading");
    try {
      await api.post("/wallet/referral/apply", { code: referralCode.trim() });
      setReferralStatus("success");
      setReferralMsg("Referral code applied successfully!");
      setTimeout(() => {
        setShowReferralModal(false);
        // Refresh session if needed or just dismiss
        localStorage.setItem("referralPromptDismissed", "true");
      }, 1500);
    } catch (err: any) {
      setReferralStatus("error");
      setReferralMsg(err.response?.data?.message || "Invalid or expired referral code");
    }
  };

  const handleDismissReferral = () => {
    localStorage.setItem("referralPromptDismissed", "true");
    setShowReferralModal(false);
  };

  const currentDate = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });

  const activeCampaignsCount = campaigns?.filter((c: any) => c.status === "active").length || 0;
  
  const dmsUsed = planStatus?.dms_used_this_month || 0;

  const handleConnectInstagram = async () => {
    try {
      const { data } = await api.get("/instagram/connect");
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stagger = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  } as const;

  const InstagramIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f3ef]">
      
      {/* TOPBAR */}
      <header className="hidden md:flex items-center justify-between px-[24px] py-[16px] bg-white border-b border-[#e8e5de]">
        <div>
          <h1 className="text-[14px] font-medium text-[#1a1a18]">
            Good morning, {(session?.fullName || session?.name || "User").split(" ")[0]} <span className="text-[13px]">👋</span>
          </h1>
          <p className="text-[11.5px] text-[#888] mt-[1px]">
            {currentDate} · Here's your automation overview
          </p>
        </div>
        <div className="flex items-center gap-[8px]">
          <Link href="/dashboard/wallet" className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] text-[12px] font-medium cursor-pointer border border-[#d0cdc6] bg-[#fdf8ee] text-[#9a7b3a] hover:bg-[#faf4e5]">
             <span className="w-[14px] h-[14px] rounded-full bg-[#9A7B3A] text-white flex items-center justify-center text-[10px] font-bold">◎</span>
             {walletLoading ? "..." : (walletData?.balance || 0)} Coins
          </Link>
          <button className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] text-[12px] font-medium cursor-pointer border border-[#d0cdc6] bg-white text-[#444] hover:bg-[#fafafa]">
            <Bell className="w-[14px] h-[14px]" /> Alerts
          </button>
          {session?.ig_username ? (
            <div className="flex items-center gap-[6px] px-[13px] py-[7px] rounded-[8px] text-[12px] font-medium border border-[#e0ddd6] bg-white text-[#444]">
              <span className="w-[8px] h-[8px] rounded-full bg-green-500 mr-1"></span>
              @{session.ig_username}
            </div>
          ) : (
            <button 
              onClick={handleConnectInstagram}
              className="flex items-center gap-[6px] px-[13px] py-[7px] rounded-[8px] text-[12px] font-medium cursor-pointer border-none text-white hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
            >
              <InstagramIcon /> Connect Instagram
            </button>
          )}
        </div>
      </header>

      {/* REFERRAL MODAL */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl border border-zinc-200 p-6 w-full max-w-sm relative">
            <button onClick={handleDismissReferral} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700">✕</button>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Got a referral code?</h3>
            <p className="text-xs text-zinc-500 mb-4">You signed up with Google. If a friend referred you, enter their code now to claim your S2S coins bonus!</p>
            
            <input 
              type="text" 
              placeholder="e.g. S2S-ABCD-1234" 
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm mb-2 font-mono outline-none focus:border-[#9a7b3a]"
            />
            
            {referralStatus === "error" && <p className="text-xs text-red-500 mb-3">{referralMsg}</p>}
            {referralStatus === "success" && <p className="text-xs text-green-600 mb-3">{referralMsg}</p>}
            
            <button 
              onClick={handleApplyReferral}
              disabled={referralStatus === "loading" || !referralCode.trim()}
              className="w-full bg-[#9a7b3a] hover:bg-[#8a6b2a] text-white font-semibold py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {referralStatus === "loading" ? "Applying..." : "Apply Code"}
            </button>
            <button 
              onClick={handleDismissReferral}
              className="w-full mt-2 bg-transparent text-zinc-500 hover:text-zinc-700 font-medium py-2 rounded-lg text-sm transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-[20px] md:px-[24px] flex flex-col gap-[20px]">

        {/* PLATFORMS */}
        <motion.div {...stagger} transition={{ ...stagger.transition, delay: 0 }} className="flex gap-[8px] items-center flex-wrap">
          {session?.ig_username ? (
            <div className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[20px] text-[12px] font-medium border border-[#fbcfe8] bg-[#fdf2f8] text-[#db2777]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#db2777]"></span>
              Instagram <span className="text-[11px] text-[#db2777]">· connected as @{session.ig_username}</span>
            </div>
          ) : (
            <div 
              onClick={handleConnectInstagram}
              className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[20px] text-[12px] font-medium cursor-pointer border border-[#e0ddd6] bg-white text-[#555] hover:border-[#bbb] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all"
            >
              <span className="w-[7px] h-[7px] rounded-full bg-[#e91e8c]"></span>
              Instagram <span className="text-[11px] text-[#aaa]">· tap to connect</span>
            </div>
          )}
          <div className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[20px] text-[12px] font-medium border border-[#86efac] bg-[#f0fdf4] text-[#16a34a] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all">
            <span className="w-[7px] h-[7px] rounded-full bg-[#25d366]"></span>
            WhatsApp <span className="text-[11px] text-[#16a34a]">· connected</span> 
            <div className="relative w-[6px] h-[6px] rounded-full bg-[#22c55e] ml-[2px]">
               <div className="absolute inset-[-3px] rounded-full bg-[#22c55e] animate-ping opacity-75"></div>
            </div>
          </div>
          <div className="text-[11px] text-[#aaa] flex items-center gap-[5px] px-[12px] py-[7px] rounded-[20px] border border-dashed border-[#d8d5cf] bg-[#fafaf8]">
            <Clock className="w-[13px] h-[13px]" /> More platforms coming soon
          </div>
        </motion.div>

        {/* STATS GRID */}
        <motion.div {...stagger} transition={{ ...stagger.transition, delay: 0.08 }} className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
          
          <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[16px] md:px-[18px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#f97316] to-[#fb923c]"></div>
            <div className="text-[10.5px] font-medium text-[#888] uppercase tracking-[0.6px] mb-[8px] flex items-center gap-[5px]">
              <Send className="w-[13px] h-[13px]" /> DMs sent
            </div>
            <div className="text-[26px] font-semibold text-[#1a1a18] leading-none">
              {planLoading ? "..." : dmsUsed}
            </div>
            <Link href="/dashboard/billing" className="text-[11px] text-[#8b5cf6] mt-[8px] font-medium inline-flex items-center gap-[3px] hover:opacity-80">
              Upgrade for other premium features <ArrowRight className="w-[11px] h-[11px]" />
            </Link>
          </div>

          <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[16px] md:px-[18px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa]"></div>
            <div className="text-[10.5px] font-medium text-[#888] uppercase tracking-[0.6px] mb-[8px] flex items-center gap-[5px]">
              <Zap className="w-[13px] h-[13px]" /> Active campaigns
            </div>
            <div className="text-[26px] font-semibold text-[#1a1a18] leading-none">
              {campaignsLoading ? "..." : activeCampaignsCount}
            </div>
            <div className="text-[11px] text-[#aaa] mt-[5px]">
              {activeCampaignsCount === 0 ? "No campaigns running" : `${activeCampaignsCount} campaigns running`}
            </div>
            <Link href="/dashboard/campaigns/new" className="text-[11px] text-[#8b5cf6] mt-[8px] font-medium inline-flex items-center gap-[3px] hover:opacity-80">
              Create campaign <ArrowRight className="w-[11px] h-[11px]" />
            </Link>
          </div>

          <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[16px] md:px-[18px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#10b981] to-[#34d399]"></div>
            <div className="text-[10.5px] font-medium text-[#888] uppercase tracking-[0.6px] mb-[8px] flex items-center gap-[5px]">
              <ShieldCheck className="w-[13px] h-[13px]" /> Current plan
            </div>
            <div className="text-[20px] pt-[4px] font-semibold text-[#1a1a18] leading-none capitalize">
              {planLoading ? "..." : planStatus?.plan || "Free"}
            </div>
            <div className="text-[11px] text-[#aaa] mt-[5px]">
              Unlimited DMs · basic analytics
            </div>
            <Link href="/dashboard/billing" className="text-[11px] text-[#8b5cf6] mt-[8px] font-medium inline-flex items-center gap-[3px] hover:opacity-80">
              Upgrade to Pro <ArrowRight className="w-[11px] h-[11px]" />
            </Link>
          </div>

        </motion.div>

        {/* SETUP STRIP */}
        <motion.div {...stagger} transition={{ ...stagger.transition, delay: 0.16 }} className="bg-[#0f1117] rounded-[12px] p-[16px] md:px-[20px] flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
          <div>
            <div className="text-[10px] font-semibold text-[#f59e0b] uppercase tracking-[0.8px] mb-[4px]">Quick setup</div>
            <div className="text-[15px] font-semibold text-white">3 steps to your first automation</div>
            <div className="flex items-center gap-[12px] md:gap-[16px] mt-[10px] flex-wrap">
              <div className="flex items-center gap-[6px] text-[11.5px] text-[rgba(255,255,255,0.5)]">
                <div className="w-[18px] h-[18px] rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[10px] font-semibold text-[rgba(255,255,255,0.5)]">1</div>
                Connect Instagram
              </div>
              <span className="text-[rgba(255,255,255,0.2)] text-[12px]">›</span>
              <div className="flex items-center gap-[6px] text-[11.5px] text-[rgba(255,255,255,0.5)]">
                <div className="w-[18px] h-[18px] rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[10px] font-semibold text-[rgba(255,255,255,0.5)]">2</div>
                Create a flow
              </div>
              <span className="text-[rgba(255,255,255,0.2)] text-[12px]">›</span>
              <div className="flex items-center gap-[6px] text-[11.5px] text-[rgba(255,255,255,0.5)]">
                <div className="w-[18px] h-[18px] rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[10px] font-semibold text-[rgba(255,255,255,0.5)]">3</div>
                Launch campaign
              </div>
            </div>
          </div>
          <Link href="/dashboard/flows/new" className="flex items-center justify-center gap-[6px] px-[18px] py-[9px] rounded-[9px] text-[12.5px] font-semibold bg-[#f59e0b] text-[#1a1a18] hover:bg-[#fbbf24] transition-colors whitespace-nowrap">
            Get started <ArrowRight className="w-[14px] h-[14px]" />
          </Link>
        </motion.div>

        {/* FEATURE GRID */}
        <motion.div {...stagger} transition={{ ...stagger.transition, delay: 0.24 }} className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
          
          <Link href="/dashboard/bulk-messages" className="block bg-white rounded-[12px] border border-[#e8e5de] p-[16px] cursor-pointer hover:border-[#c4bfb8] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all relative">
            <div className="w-[36px] h-[36px] rounded-[10px] bg-[#fff7ed] text-[#ea580c] flex items-center justify-center mb-[12px]">
              <MessageCircle className="w-[18px] h-[18px]" />
            </div>
            <div className="text-[13px] font-semibold text-[#1a1a18] mb-[4px]">WhatsApp bulk messaging</div>
            <div className="text-[11.5px] text-[#888] leading-[1.5]">Send messages to thousands of contacts instantly with smart scheduling.</div>
            <div className="absolute top-[12px] right-[12px] text-[10px] font-semibold px-[7px] py-[3px] rounded-[20px] bg-[#f0fdf4] text-[#16a34a] border border-[#86efac]">Ready</div>
          </Link>

          <Link href="/dashboard/comment-replies" className="block bg-white rounded-[12px] border border-[#e8e5de] p-[16px] cursor-pointer hover:border-[#c4bfb8] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all relative">
            <div className="w-[36px] h-[36px] rounded-[10px] bg-[#f5f3ff] text-[#7c3aed] flex items-center justify-center mb-[12px]">
              <MessageSquare className="w-[18px] h-[18px]" />
            </div>
            <div className="text-[13px] font-semibold text-[#1a1a18] mb-[4px]">Comment auto-reply</div>
            <div className="text-[11.5px] text-[#888] leading-[1.5]">Auto-reply to Instagram comments when specific keywords are detected.</div>
            <div className="absolute top-[12px] right-[12px] text-[10px] font-semibold px-[7px] py-[3px] rounded-[20px] bg-[#f5f3ff] text-[#7c3aed] border border-[#c4b5fd]">Pro</div>
          </Link>

          <Link href="/dashboard/story-replies" className="block bg-white rounded-[12px] border border-[#e8e5de] p-[16px] cursor-pointer hover:border-[#c4bfb8] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all relative">
            <div className="w-[36px] h-[36px] rounded-[10px] bg-[#fdf2f8] text-[#db2777] flex items-center justify-center mb-[12px]">
              <ImageIcon className="w-[18px] h-[18px]" />
            </div>
            <div className="text-[13px] font-semibold text-[#1a1a18] mb-[4px]">Story reply automation</div>
            <div className="text-[11.5px] text-[#888] leading-[1.5]">Reply automatically when someone reacts to or replies to your story.</div>
            <div className="absolute top-[12px] right-[12px] text-[10px] font-semibold px-[7px] py-[3px] rounded-[20px] bg-[#f5f3ff] text-[#7c3aed] border border-[#c4b5fd]">Pro</div>
          </Link>

          <Link href="/dashboard/keywords" className="block bg-white rounded-[12px] border border-[#e8e5de] p-[16px] cursor-pointer hover:border-[#c4bfb8] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all relative">
            <div className="w-[36px] h-[36px] rounded-[10px] bg-[#eff6ff] text-[#2563eb] flex items-center justify-center mb-[12px]">
              <Key className="w-[18px] h-[18px]" />
            </div>
            <div className="text-[13px] font-semibold text-[#1a1a18] mb-[4px]">Keyword &rarr; DM trigger</div>
            <div className="text-[11.5px] text-[#888] leading-[1.5]">Send a DM automatically when a follower comments a specific word.</div>
            <div className="absolute top-[12px] right-[12px] text-[10px] font-semibold px-[7px] py-[3px] rounded-[20px] bg-[#f0fdf4] text-[#16a34a] border border-[#86efac]">New</div>
          </Link>

          <Link href="/dashboard/flows" className="block bg-white rounded-[12px] border border-[#e8e5de] p-[16px] cursor-pointer hover:border-[#c4bfb8] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all relative">
            <div className="w-[36px] h-[36px] rounded-[10px] bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center mb-[12px]">
              <GitBranch className="w-[18px] h-[18px]" />
            </div>
            <div className="text-[13px] font-semibold text-[#1a1a18] mb-[4px]">Visual flow builder</div>
            <div className="text-[11.5px] text-[#888] leading-[1.5]">Build complex automation sequences visually with drag-and-drop nodes.</div>
          </Link>

          <Link href="/dashboard/analytics" className="block bg-white rounded-[12px] border border-[#e8e5de] p-[16px] cursor-pointer hover:border-[#c4bfb8] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all relative">
            <div className="w-[36px] h-[36px] rounded-[10px] bg-[#fffbeb] text-[#d97706] flex items-center justify-center mb-[12px]">
              <Activity className="w-[18px] h-[18px]" />
            </div>
            <div className="text-[13px] font-semibold text-[#1a1a18] mb-[4px]">Analytics & insights</div>
            <div className="text-[11.5px] text-[#888] leading-[1.5]">Track message delivery, open rates, and conversion in one place.</div>
            <div className="absolute top-[12px] right-[12px] text-[10px] font-semibold px-[7px] py-[3px] rounded-[20px] bg-[#f5f3ff] text-[#7c3aed] border border-[#c4b5fd]">Pro</div>
          </Link>

        </motion.div>

        {/* BOTTOM GRID */}
        <motion.div {...stagger} transition={{ ...stagger.transition, delay: 0.32 }} className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
          
          <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[16px] flex flex-col">
            <div className="flex items-center justify-between mb-[14px]">
              <div className="flex items-center gap-[6px] text-[13px] font-semibold text-[#1a1a18]">
                <GitBranch className="w-[15px] h-[15px] text-[#8b5cf6]" /> Visual flows
              </div>
              <Link href="/dashboard/flows/new" className="flex items-center gap-[4px] text-[11px] font-medium text-[#8b5cf6] px-[10px] py-[5px] rounded-[7px] border border-[#e0d9fb] bg-[#f5f3ff] hover:bg-[#ede9fe] transition-colors">
                <Plus className="w-[11px] h-[11px]" /> New flow
              </Link>
            </div>
            
            {flowsLoading ? (
              <div className="flex-1 flex items-center justify-center p-[24px]">
                <div className="text-[12px] text-[#888]">Loading flows...</div>
              </div>
            ) : flows && flows.length > 0 ? (
              <div className="flex-1 flex flex-col gap-[8px]">
                {flows.slice(0, 4).map((f: any) => (
                  <Link href={`/dashboard/flows/${f.id}`} key={f.id} className="flex items-center justify-between p-[10px] rounded-[8px] border border-[#f0ede8] hover:border-[#8b5cf6] transition-colors">
                    <div>
                      <div className="text-[12px] font-semibold text-[#1a1a18]">{f.name}</div>
                      <div className="text-[11px] text-[#888] mt-[2px]">{f.status === 'live' ? 'Live' : 'Draft'}</div>
                    </div>
                    <ArrowRight className="w-[12px] h-[12px] text-[#ccc]" />
                  </Link>
                ))}
                {flows.length > 4 && (
                  <div className="text-center mt-[4px]">
                    <Link href="/dashboard/flows" className="text-[11px] text-[#8b5cf6] font-medium hover:underline">View all flows</Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-[24px] text-center">
                <div className="w-[44px] h-[44px] rounded-[12px] bg-[#f5f3ff] text-[#a78bfa] flex items-center justify-center mb-[10px]">
                  <GitBranch className="w-[22px] h-[22px]" />
                </div>
                <div className="text-[12.5px] font-semibold text-[#444] mb-[4px]">No flows yet</div>
                <div className="text-[11px] text-[#aaa] leading-[1.5] max-w-[240px]">
                  Build your first automation flow to trigger DMs, replies, and sequences automatically.
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[16px]">
            <div className="flex items-center justify-between mb-[14px]">
              <div className="flex items-center gap-[6px] text-[13px] font-semibold text-[#1a1a18]">
                <Key className="w-[15px] h-[15px] text-[#8b5cf6]" /> Keyword triggers
              </div>
              <Link href="/dashboard/campaigns/new" className="flex items-center gap-[4px] text-[11px] font-medium text-[#8b5cf6] px-[10px] py-[5px] rounded-[7px] border border-[#e0d9fb] bg-[#f5f3ff] hover:bg-[#ede9fe] transition-colors">
                <Plus className="w-[11px] h-[11px]" /> Add keyword
              </Link>
            </div>
            
            <div className="mb-[8px]">
              {campaignsLoading ? (
                <div className="py-[16px] text-center text-[12px] text-[#888]">Loading triggers...</div>
              ) : campaigns && campaigns.filter((c: any) => c.trigger_type === 'comment').length > 0 ? (
                <div className="flex flex-col">
                  {campaigns.filter((c: any) => c.trigger_type === 'comment').slice(0, 4).map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between py-[8px] border-b border-[#f0ede8] last:border-0">
                      <div>
                        <div className="inline-block text-[12px] font-semibold bg-[#eff6ff] text-[#2563eb] px-[9px] py-[3px] rounded-[6px]">
                          {c.keyword.toUpperCase()}
                        </div>
                        <div className="text-[11px] text-[#888] mt-[4px]">&rarr; {c.name || 'DM Automation'}</div>
                      </div>
                      <div 
                        onClick={async () => {
                          try {
                            const newStatus = c.status === "active" ? "paused" : "active";
                            await api.patch(`/campaigns/${c.id}`, { status: newStatus });
                            window.location.reload();
                          } catch (err) {}
                        }}
                        className={`w-[30px] h-[16px] rounded-[20px] relative cursor-pointer transition-colors ${c.status === "active" ? "bg-[#8b5cf6]" : "bg-[#e0ddd6]"}`}
                      >
                        <div className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white transition-all ${c.status === "active" ? "left-[16px]" : "left-[2px]"}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-[16px] text-center text-[12px] text-[#888]">No keyword triggers yet.</div>
              )}
            </div>
            {campaigns && campaigns.length > 0 ? (
              <div className="text-[11px] text-[#8b5cf6] text-center py-[4px]">
                <Link href="/dashboard/campaigns" className="hover:underline">Manage all triggers</Link>
              </div>
            ) : (
              <div className="text-[11px] text-[#bbb] text-center py-[4px]">
                Connect Instagram to activate
              </div>
            )}
          </div>

        </motion.div>

        {/* RECENT ACTIVITY */}
        <motion.div {...stagger} transition={{ ...stagger.transition, delay: 0.4 }} className="bg-white rounded-[12px] border border-[#e8e5de] p-[16px]">
          <div className="flex items-center justify-between mb-[14px]">
            <div className="flex items-center gap-[6px] text-[13px] font-semibold text-[#1a1a18]">
              <Activity className="w-[15px] h-[15px]" /> Recent activity
            </div>
          </div>

          {/* Account created — always shown */}
          <div className="flex items-start gap-[10px] py-[10px] border-b border-[#f0ede8]">
            <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0 bg-[#fff7ed] text-[#ea580c]">
              <UserPlus className="w-[14px] h-[14px]" />
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#1a1a18]">Account created</div>
              <div className="text-[11px] text-[#aaa] mt-[2px]">Welcome to Set2Send. Connect your first platform to get started.</div>
              <div className="inline-flex items-center text-[10px] px-[7px] py-[2px] rounded-[20px] font-medium mt-[4px] bg-[#fff7ed] text-[#ea580c]">Getting started</div>
            </div>
          </div>

          {/* Instagram — only if connected */}
          {session?.ig_username && (
            <div className="flex items-start gap-[10px] py-[10px] border-b border-[#f0ede8]">
              <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0 bg-[#fdf2f8] text-[#db2777]">
                <MessageSquare className="w-[14px] h-[14px]" />
              </div>
              <div>
                <div className="text-[12px] font-medium text-[#1a1a18]">Instagram connected</div>
                <div className="text-[11px] text-[#aaa] mt-[2px]">@{session.ig_username} is live and ready for automations.</div>
                <div className="inline-flex items-center text-[10px] px-[7px] py-[2px] rounded-[20px] font-medium mt-[4px] bg-[#fdf2f8] text-[#db2777]">Connected</div>
              </div>
            </div>
          )}

          {/* Plan info — always shown */}
          <div className="flex items-start gap-[10px] py-[10px]">
            <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0 bg-[#eff6ff] text-[#2563eb]">
              <Sparkles className="w-[14px] h-[14px]" />
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#1a1a18]">{planLoading ? "Loading plan..." : `${planStatus?.plan || "Free"} plan activated`}</div>
              <div className="text-[11px] text-[#aaa] mt-[2px]">{planLoading ? "" : "Unlimited DMs per month included. Upgrade anytime for more features."}</div>
              <div className="inline-flex items-center text-[10px] px-[7px] py-[2px] rounded-[20px] font-medium mt-[4px] bg-[#eff6ff] text-[#2563eb]">Plan</div>
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
