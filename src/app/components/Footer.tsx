"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f1117] border-t border-white/5 text-gray-500 py-16 px-6 relative overflow-hidden z-10">
      {/* Background glow overlay */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 relative z-10">

        {/* Brand column */}
        <div className="col-span-2 text-left flex flex-col items-start gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-sans font-black text-white text-2xl tracking-tighter"
          >
            <span className="w-8 h-8 rounded-lg bg-white text-[#e2ff3c] flex items-center justify-center font-extrabold shadow-md">S</span>
            <span>set2send</span>
          </Link>
          <p className="text-gray-400 font-sans font-normal text-xs max-w-xs leading-relaxed">
            set2send automates conversational marketing on Instagram, WhatsApp, Messenger, and TikTok to scale your audience and grow revenue.
          </p>

          <div className="flex items-center gap-3 mt-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">Meta API Online</span>
          </div>
        </div>

        {/* Channels */}
        <div className="text-left">
          <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono mb-4">Channels</h4>
          <div className="flex flex-col gap-2.5 text-xs font-medium">
            <Link href="/product/instagram" className="text-gray-400 hover:text-[#e2ff3c] transition-colors">Instagram</Link>
            <Link href="/product/whatsapp" className="text-gray-400 hover:text-[#e2ff3c] transition-colors">WhatsApp</Link>
            <Link href="/product/messenger" className="text-gray-400 hover:text-[#e2ff3c] transition-colors">Facebook Messenger</Link>
            <Link href="/product/tiktok" className="text-gray-400 hover:text-[#e2ff3c] transition-colors">TikTok Marketing</Link>
            <Link href="/product/set2send-ai" className="text-gray-400 hover:text-[#e2ff3c] transition-colors">Set2Send AI Spark</Link>
          </div>
        </div>

        {/* Platform Features */}
        <div className="text-left">
          <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono mb-4">Features</h4>
          <div className="flex flex-col gap-2.5 text-xs font-medium">
            <Link href="/dashboard/comment-replies" className="text-gray-400 hover:text-[#e2ff3c] transition-colors">Comment Auto-Reply</Link>
            <Link href="/dashboard/story-replies" className="text-gray-400 hover:text-[#e2ff3c] transition-colors">Story Automations</Link>
            <Link href="/dashboard/flows" className="text-gray-400 hover:text-[#e2ff3c] transition-colors">Visual Flow Canvas</Link>
            <Link href="/dashboard/crm" className="text-gray-400 hover:text-[#e2ff3c] transition-colors">Lead Scoring & CRM</Link>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-mono">
        <span>© 2026 set2send. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-gray-300 transition-colors">Security Hub</Link>
        </div>
      </div>
    </footer>
  );
}
