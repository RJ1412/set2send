"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  Connection,
  Edge,
  Node,
  NodeProps,
} from "@xyflow/react";
const ReactFlow: any = ({ children }: any) => <div>{children}</div>;
const MiniMap: any = () => null;
const Controls: any = () => null;
const Background: any = () => null;
const Panel: any = ({ children }: any) => <div>{children}</div>;
const Handle: any = () => null;
const Position: any = { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' };
const useNodesState: any = (i: any) => [i, () => {}, () => {}];
const useEdgesState: any = (i: any) => [i, () => {}, () => {}];
const addEdge: any = (e: any, edges: any) => [...edges, e];

import {
  motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform, useAnimation, useScroll
} from "framer-motion";
import {
  Activity, AlertCircle, ArrowRight, ArrowRightCircle, BadgeCheck, BarChart2, Bot, Check, CheckCircle, CheckCircle2, ChevronDown, ChevronRight, Clock, Coins, Copy, Cpu, Database, DownloadCloud, ExternalLink, Eye, FileText, Filter, Fingerprint, Heart, HelpCircle, Kanban, Key, Layers, Link as LinkIcon, ListFilter, Lock, LogOut, Mail, Menu, MessageCircle, MessageSquare, Network, Phone, Play, Plus, PlusCircle, Quote, Save, Search, Send, Settings, Share2, Shield, ShieldCheck, Sliders, Sparkles, Star, Table, Target, Terminal, Trash2, TrendingUp, Unlock, User, UserPlus, Users, Video, Wallet, Webhook, X, Zap
} from "lucide-react";
import { create } from "zustand";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ==========================================
// 0. GATE INTRO & PARTICLES
// ==========================================

function AnimatedParticles() {
  const particles = Array.from({ length: 6 }).map((_, i) => {
    const duration = 8 + Math.random() * 6; // 8s to 14s
    const delay = Math.random() * 5; // stagger
    const left = 10 + Math.random() * 80; // 10% to 90%
    const top = 20 + Math.random() * 60; // 20% to 80%
    return { id: i, duration, delay, left, top };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes floatDust {
          0% { transform: translateY(0) translateX(0); opacity: 0.15; }
          50% { transform: translateY(-20px) translateX(15px); opacity: 0.3; }
          100% { transform: translateY(-40px) translateX(-15px); opacity: 0.15; }
        }
      `}} />
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-[2px] h-[2px] rounded-full bg-[#3B82F6]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `floatDust ${p.duration}s ease-in-out infinite alternate ${p.delay}s`
          }}
        />
      ))}
    </div>
  );
}

function GateIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState("init");

  useEffect(() => {
    // Only access sessionStorage and window on the client
    const hasSeenGate = typeof window !== 'undefined' ? sessionStorage.getItem("set2send_gate_seen") : null;
    const prefersReduced = typeof window !== 'undefined' ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

    if (hasSeenGate || prefersReduced) {
      onComplete();
    }
  }, [onComplete]);

  const handleEnter = () => {
    if (phase !== "init") return;
    setPhase("open");

    setTimeout(() => {
      setPhase("fade");
    }, 2200);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem("set2send_gate_seen", "true");
      }
      setPhase("done");
      onComplete();
    }, 2500);
  };

  if (phase === "done") return null;

  const isOpen = phase === "open" || phase === "fade";
  const isFade = phase === "fade";

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center transition-opacity duration-500 overflow-hidden"
      style={{ opacity: isFade ? 0 : 1, backgroundColor: "transparent" }}
    >
      {/* Left Gate */}
      <div
        className="absolute top-0 left-0 h-full bg-black/80 backdrop-blur-3xl z-10 border-r border-[#2563EB]/10"
        style={{
          width: "50%",
          transformOrigin: "left",
          transform: isOpen ? "translateX(-100%)" : "translateX(0)",
          transition: isOpen ? "transform 2s cubic-bezier(0.85, 0, 0.15, 1) 0.3s" : "none",
          boxShadow: "inset -40px 0 80px rgba(0,0,0,0.95)"
        }}
      >
        <div className="absolute right-0 top-0 w-[1px] h-full" style={{ background: "linear-gradient(to bottom, transparent 0%, #2563EB 20%, #2563EB 80%, transparent 100%)" }}></div>
        <div className="absolute inset-0 flex items-center justify-end pr-[60px]">
          <div className="flex flex-col items-center gap-[12px] opacity-70">
            <div className="w-[1px] h-[140px]" style={{ background: "linear-gradient(to bottom, transparent, #2563EB, transparent)" }}></div>
            <div className="w-[10px] h-[10px] bg-[#2563EB] transform rotate-45"></div>
            <div className="w-[80px] h-[1px]" style={{ background: "linear-gradient(to right, transparent, #2563EB, transparent)" }}></div>
            <div className="w-[10px] h-[10px] bg-[#2563EB] transform rotate-45"></div>
            <div className="w-[1px] h-[140px]" style={{ background: "linear-gradient(to bottom, transparent, #2563EB, transparent)" }}></div>
          </div>
        </div>
      </div>

      {/* Right Gate */}
      <div
        className="absolute top-0 right-0 h-full bg-black/80 backdrop-blur-3xl z-10 border-l border-[#2563EB]/10"
        style={{
          width: "50%",
          transformOrigin: "right",
          transform: isOpen ? "translateX(100%)" : "translateX(0)",
          transition: isOpen ? "transform 2s cubic-bezier(0.85, 0, 0.15, 1) 0.3s" : "none",
          boxShadow: "inset 40px 0 80px rgba(0,0,0,0.95)"
        }}
      >
        <div className="absolute left-0 top-0 w-[1px] h-full" style={{ background: "linear-gradient(to bottom, transparent 0%, #2563EB 20%, #2563EB 80%, transparent 100%)" }}></div>
        <div className="absolute inset-0 flex items-center justify-start pl-[60px]">
          <div className="flex flex-col items-center gap-[12px] opacity-70">
            <div className="w-[1px] h-[140px]" style={{ background: "linear-gradient(to bottom, transparent, #2563EB, transparent)" }}></div>
            <div className="w-[10px] h-[10px] bg-[#2563EB] transform rotate-45"></div>
            <div className="w-[80px] h-[1px]" style={{ background: "linear-gradient(to right, transparent, #2563EB, transparent)" }}></div>
            <div className="w-[10px] h-[10px] bg-[#2563EB] transform rotate-45"></div>
            <div className="w-[1px] h-[140px]" style={{ background: "linear-gradient(to bottom, transparent, #2563EB, transparent)" }}></div>
          </div>
        </div>
      </div>

      {/* Center Content */}
      <div
        className="relative z-30 text-center flex flex-col items-center gap-[20px] drop-shadow-2xl"
        style={{
          opacity: isOpen ? 0 : 1,
          transition: "opacity 0.3s ease-out",
          pointerEvents: isOpen ? "none" : "auto"
        }}
      >
        <div className="w-[72px] h-[72px] border border-[#475569] flex items-center justify-center relative animate-[pulse_2s_ease-in-out_infinite]">
          <div className="absolute inset-[6px] border border-[#2563EB]"></div>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="relative z-10">
            <path d="M16 4 L28 28 L4 28 Z" stroke="#2563EB" strokeWidth="0.8" fill="none" />
            <circle cx="16" cy="16" r="5" stroke="#2563EB" strokeWidth="0.8" fill="none" />
            <line x1="16" y1="4" x2="16" y2="11" stroke="#2563EB" strokeWidth="0.8" />
          </svg>
        </div>

        <div className="font-[family-name:var(--font-inter)] text-[22px] font-light tracking-[0.35em] text-[#F8FAFC] uppercase">
          set<span style={{ color: '#2563EB' }}>2</span>send
        </div>

        <div className="w-[120px] h-[1px]" style={{ background: "linear-gradient(to right, transparent, #2563EB, transparent)" }}></div>

        <div className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] text-[#2563EB] uppercase font-normal">
          Set all workflows.<br />Then send.
        </div>

        <button
          onClick={handleEnter}
          className="mt-[16px] px-[36px] py-[12px] bg-transparent border border-[#2563EB] text-[#2563EB] font-[family-name:var(--font-inter)] text-[11px] tracking-[0.25em] uppercase cursor-pointer relative overflow-hidden transition-colors duration-300 group focus:outline-none"
        >
          <div className="absolute inset-0 bg-[#2563EB] transform scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-x-100"></div>
          <span className="relative z-10 group-hover:text-[#020617] transition-colors duration-300">Enter the Chamber</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface ChatMessage {
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
}

export interface Contact {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  stage: "New Lead" | "Qualified" | "Interested" | "Booked" | "Won";
  leadScore: number;
  tags: string[];
  notes: string;
  source: string;
  lastActive: string;
  chatHistory: ChatMessage[];
}

export interface Campaign {
  id: string;
  name: string;
  channel: "Instagram" | "WhatsApp" | "Email";
  targetAudience: string;
  message: string;
  status: "Draft" | "Scheduled" | "Sent";
  scheduledTime: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
}

export interface AIAgent {
  id: string;
  name: string;
  prompt: string;
  knowledgeBase: string[];
  personality: number; // 0 (Professional) to 100 (Playful)
  creativity: number;
  goals: string;
  language: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  text: string;
  type: "info" | "success" | "warning" | "error" | "ai";
}

// Custom brand logos
const Instagram = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// ==========================================
// 2. CENTRAL STATE STORE (ZUSTAND)
// ==========================================

interface AppState {
  currentView: string;
  contacts: Contact[];
  campaigns: Campaign[];
  agents: AIAgent[];
  logs: ActivityLog[];
  notifications: Array<{ id: string; title: string; message: string; type: "success" | "info" | "warning" }>;
  integrations: Record<string, boolean>;
  team: Array<{ name: string; email: string; role: string; joined: string }>;
  apiKeys: Array<{ id: string; name: string; key: string; created: string }>;
  savedFlows: Record<string, { nodes: Node[]; edges: Edge[] }>;
  activeFlowId: string;

  // Actions
  navigate: (view: string) => void;
  addLog: (text: string, type: ActivityLog["type"]) => void;
  pushNotification: (title: string, message: string, type?: "success" | "info" | "warning") => void;
  dismissNotification: (id: string) => void;
  addContact: (contact: Omit<Contact, "id" | "lastActive" | "chatHistory"> & { chatHistory?: ChatMessage[] }) => void;
  updateContactStage: (id: string, stage: Contact["stage"]) => void;
  updateContactDetails: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addCampaign: (campaign: Omit<Campaign, "id" | "sentCount" | "openRate" | "clickRate">) => void;
  deleteCampaign: (id: string) => void;
  addAgent: (agent: Omit<AIAgent, "id">) => void;
  updateAgent: (id: string, updates: Partial<AIAgent>) => void;
  toggleIntegration: (id: string) => void;
  addTeamMember: (name: string, email: string, role: string) => void;
  deleteTeamMember: (email: string) => void;
  createApiKey: (name: string) => void;
  deleteApiKey: (id: string) => void;
  saveFlow: (flowId: string, nodes: Node[], edges: Edge[]) => void;
}

const initialContacts: Contact[] = [
  {
    id: "c1",
    name: "Alex Rivers",
    username: "alexrivers",
    email: "alex@rivers.co",
    phone: "+1 (555) 019-2834",
    stage: "Won",
    leadScore: 92,
    tags: ["Instagram DM", "Ebook Download"],
    notes: "Alex is highly interested in the Agency template plan. He needs SMTP integrations set up.",
    source: "Comment on Ebook Reel",
    lastActive: "10 mins ago",
    chatHistory: [
      { sender: "user", text: "Hey! Saw your reel. Can I get the free guide?", timestamp: "10:04 AM" },
      { sender: "bot", text: "Hey Alex! 🚀 Absolutely. First, what is your best business email so I can send the guide?", timestamp: "10:04 AM" },
      { sender: "user", text: "alex@rivers.co", timestamp: "10:05 AM" },
      { sender: "bot", text: "Perfect, sent! By the way, are you looking to automate leads for courses or client agencies?", timestamp: "10:05 AM" },
      { sender: "user", text: "Client agencies, we manage about 15 creators.", timestamp: "10:06 AM" },
      { sender: "bot", text: "Awesome! Set2Send handles multi-account workspaces. Let's schedule a call?", timestamp: "10:06 AM" },
    ],
  },
  {
    id: "c2",
    name: "Sarah Jenkins",
    username: "sarah_j",
    email: "sarah@jenkins.dev",
    phone: "+1 (555) 014-9821",
    stage: "Interested",
    leadScore: 78,
    tags: ["Comment Reply", "Warm Lead"],
    notes: "Offered the 14-day Pro Creator trial check check.",
    source: "DM Keyword 'AUTOMATE'",
    lastActive: "1 hr ago",
    chatHistory: [
      { sender: "user", text: "AUTOMATE", timestamp: "11:10 AM" },
      { sender: "bot", text: "Welcome Sarah! 🎉 What is the main channel you want to automate? Instagram, WhatsApp, or Email?", timestamp: "11:10 AM" },
      { sender: "user", text: "Instagram & WhatsApp", timestamp: "11:12 AM" },
      { sender: "bot", text: "Excellent choice. Here is the link to our template suite. Let me know what you think!", timestamp: "11:12 AM" },
    ],
  },
  {
    id: "c3",
    name: "Marcus Thorne",
    username: "m_thorne",
    email: "marcus@thorne.io",
    phone: "+1 (555) 017-3342",
    stage: "New Lead",
    leadScore: 45,
    tags: ["Ad Traffic"],
    notes: "Browsed template libraries, has not selected email opt-in.",
    source: "Meta Ad click",
    lastActive: "4 hrs ago",
    chatHistory: [
      { sender: "user", text: "How does the AI builder sync with CRM?", timestamp: "08:15 AM" },
      { sender: "bot", text: "Hello Marcus! The AI qualifier automatically logs details like email and scores into CRM. Try building a flow to see it in action!", timestamp: "08:16 AM" },
    ],
  },
  {
    id: "c4",
    name: "Elena Rostova",
    username: "elena_r",
    email: "elena@rostova.design",
    phone: "+1 (555) 012-7711",
    stage: "Booked",
    leadScore: 98,
    tags: ["Coaching Prospect"],
    notes: "Call scheduled with Sales Closer Agent for June 10.",
    source: "Story Tag RSVP",
    lastActive: "Yesterday",
    chatHistory: [
      { sender: "user", text: "Tagged you! RSVP me for the coaching masterclass.", timestamp: "Yesterday 04:30 PM" },
      { sender: "bot", text: "RSVP Confirmed Elena! 🌟 What is your email so we can send the Calendar calendar invite?", timestamp: "Yesterday 04:31 PM" },
      { sender: "user", text: "elena@rostova.design", timestamp: "Yesterday 04:32 PM" },
      { sender: "bot", text: "Sent! Let's book a strategy session. Click here to confirm a slot.", timestamp: "Yesterday 04:32 PM" },
    ],
  },
  {
    id: "c5",
    name: "David Kim",
    username: "davidk_sf",
    email: "david@kim.ventures",
    phone: "+1 (555) 018-4490",
    stage: "Qualified",
    leadScore: 84,
    tags: ["Stripe qualified"],
    notes: "Qualifying business scale: > $50k MRR.",
    source: "Comment on Scale Reel",
    lastActive: "3 days ago",
    chatHistory: [
      { sender: "user", text: "SCALE", timestamp: "3 days ago" },
      { sender: "bot", text: "Hey David! Let's qualify your setup. What is your current monthly revenue scale?", timestamp: "3 days ago" },
      { sender: "user", text: "Over $50k", timestamp: "3 days ago" },
      { sender: "bot", text: "Wow, perfect! Our custom Webhook pipelines fit enterprise volume. Here is a custom brochure link.", timestamp: "3 days ago" },
    ],
  },
];

const initialCampaigns: Campaign[] = [
  { id: "b1", name: "Set2Send Launch Promo", channel: "Instagram", targetAudience: "All Warm Leads (Score > 60)", message: "Hey {{username}}! Ready to automate comments? Reply 'RUSH' to grab our early bird discounts! 🚀", status: "Sent", scheduledTime: "2026-06-05 10:00", sentCount: 2840, openRate: 96.1, clickRate: 52.4 },
  { id: "b2", name: "WhatsApp Lead Follow-up", channel: "WhatsApp", targetAudience: "New Lead Segment", message: "Hi {{name}}, just following up on your templates check. Let me know if you need help starting!", status: "Scheduled", scheduledTime: "2026-06-12 09:00", sentCount: 0, openRate: 0, clickRate: 0 },
];

const initialAgents: AIAgent[] = [
  { id: "a1", name: "Set2Send Qualify Bot", prompt: "You are an automated lead qualifier for Set2Send AI. Your goal is to cheerfully collect the user's business email and main automated channel choice. Keep replies under 120 characters.", knowledgeBase: ["pricing_rules.txt", "webhook_guide.pdf"], personality: 75, creativity: 55, goals: "Collect email and channel choice", language: "English" },
  { id: "a2", name: "Sales Closer Bot", prompt: "You are a professional sales consultant. Answer template questions and offer calendar scheduling links for high value agency packages.", knowledgeBase: ["agency_packages.json"], personality: 40, creativity: 30, goals: "Drive Strategy strategies Strategy calls calls", language: "English" },
];

const initialLogs: ActivityLog[] = [
  { id: "l1", timestamp: "12:05:12 AM", text: "Instagram Comment Keyword 'RUSH' triggered for @alexrivers", type: "info" },
  { id: "l2", timestamp: "12:05:14 AM", text: "AI Agent 'Set2Send Qualify Bot' sent answer to @alexrivers", type: "ai" },
  { id: "l3", timestamp: "12:06:40 AM", text: "CRM Lead @alexrivers changed stage to 'Won'", type: "success" },
  { id: "l4", timestamp: "12:08:00 AM", text: "Webhook dispatched payload to CRM Hubspot endpoint", type: "success" },
];

const useAppStore = create<AppState>((set) => ({
  currentView: "landing",
  contacts: initialContacts,
  campaigns: initialCampaigns,
  agents: initialAgents,
  logs: initialLogs,
  notifications: [],
  integrations: { instagram: true, whatsapp: true, email: false, webhook: false },
  team: [
    { name: "Creator Owner", email: "owner@set2send.io", role: "Owner", joined: "Jan 2026" },
  ],
  apiKeys: [
    { id: "k1", name: "Live Production Key", key: "rr_live_89sdfa9823lkna9830248sd", created: "2026-05-10" },
  ],
  savedFlows: {
    "reply-funnel": {
      nodes: [
        { id: "n1", type: "trigger", position: { x: 50, y: 150 }, data: { label: "Instagram Comment", type: "instagram_comment", icon: "Instagram", config: { keyword: "RUSH" } } },
        { id: "n2", type: "action", position: { x: 350, y: 150 }, data: { label: "Send Instagram DM", type: "send_dm", icon: "MessageSquare", config: { message: "Hey there! Ready to convert comments? Let me know your business email." } } },
        { id: "n3", type: "action", position: { x: 650, y: 150 }, data: { label: "Run AI Bot", type: "ai_agent", icon: "Bot", config: { agentId: "a1" } } },
        { id: "n4", type: "action", position: { x: 950, y: 150 }, data: { label: "Condition Check", type: "condition", icon: "Sliders", config: { criteria: "Email is valid" } } },
        { id: "n5", type: "action", position: { x: 1250, y: 150 }, data: { label: "Send WhatsApp Follow-up", type: "send_whatsapp", icon: "Phone", config: { message: "Congrats! Here is your access link: https://set2send.io/redeem" } } },
      ],
      edges: [
        { id: "e1-2", source: "n1", target: "n2" },
        { id: "e2-3", source: "n2", target: "n3" },
        { id: "e3-4", source: "n3", target: "n4" },
        { id: "e4-5", source: "n4", target: "n5" },
      ],
    },
  },
  activeFlowId: "reply-funnel",

  navigate: (view) => set({ currentView: view }),

  addLog: (text, type) =>
    set((state) => ({
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          text,
          type,
        },
        ...state.logs.slice(0, 49),
      ],
    })),

  pushNotification: (title, message, type = "info") =>
    set((state) => {
      const id = `notif-${Date.now()}`;
      return {
        notifications: [...state.notifications, { id, title, message, type }],
      };
    }),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  addContact: (contact) =>
    set((state) => {
      const newContact: Contact = {
        ...contact,
        id: `contact-${Date.now()}`,
        lastActive: "Just now",
        chatHistory: [
          { sender: "system", text: "Contact created in CRM dashboard manually.", timestamp: new Date().toLocaleTimeString() },
        ],
      };
      state.addLog(`CRM Contact Added: ${newContact.name}`, "success");
      return { contacts: [newContact, ...state.contacts] };
    }),

  updateContactStage: (id, stage) =>
    set((state) => {
      const updated = state.contacts.map((c) =>
        c.id === id ? { ...c, stage, lastActive: "Just now" } : c
      );
      const contact = state.contacts.find((c) => c.id === id);
      if (contact) {
        state.addLog(`CRM Lead '${contact.name}' stage shifted to: ${stage}`, "info");
      }
      return { contacts: updated };
    }),

  updateContactDetails: (id, updates) =>
    set((state) => {
      const updated = state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates, lastActive: "Just now" } : c
      );
      return { contacts: updated };
    }),

  deleteContact: (id) =>
    set((state) => {
      const contact = state.contacts.find((c) => c.id === id);
      if (contact) {
        state.addLog(`CRM Contact removed: ${contact.name}`, "warning");
      }
      return { contacts: state.contacts.filter((c) => c.id !== id) };
    }),

  addCampaign: (campaign) =>
    set((state) => {
      const newCampaign: Campaign = {
        ...campaign,
        id: `camp-${Date.now()}`,
        sentCount: campaign.status === "Sent" ? 140 : 0,
        openRate: campaign.status === "Sent" ? 92.5 : 0,
        clickRate: campaign.status === "Sent" ? 44.8 : 0,
      };
      state.addLog(`Outbound Campaign '${campaign.name}' created`, "success");
      return { campaigns: [newCampaign, ...state.campaigns] };
    }),

  deleteCampaign: (id) =>
    set((state) => {
      const campaign = state.campaigns.find((c) => c.id === id);
      if (campaign) {
        state.addLog(`Campaign '${campaign.name}' deleted`, "warning");
      }
      return { campaigns: state.campaigns.filter((c) => c.id !== id) };
    }),

  addAgent: (agent) =>
    set((state) => {
      const newAgent: AIAgent = {
        ...agent,
        id: `agent-${Date.now()}`,
      };
      state.addLog(`AI Model '${agent.name}' initialized`, "success");
      return { agents: [...state.agents, newAgent] };
    }),

  updateAgent: (id, updates) =>
    set((state) => {
      const updated = state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a));
      return { agents: updated };
    }),

  toggleIntegration: (id) =>
    set((state) => {
      const val = !state.integrations[id];
      state.addLog(`Social API connection '${id}' ${val ? "Activated" : "Deactivated"}`, val ? "success" : "warning");
      return { integrations: { ...state.integrations, [id]: val } };
    }),

  addTeamMember: (name, email, role) =>
    set((state) => {
      state.addLog(`Invited manager: ${name} (${role})`, "info");
      return { team: [...state.team, { name, email, role, joined: "Pending Verification" }] };
    }),

  deleteTeamMember: (email) =>
    set((state) => {
      state.addLog(`Revoked manager access: ${email}`, "warning");
      return { team: state.team.filter((t) => t.email !== email) };
    }),

  createApiKey: (name) =>
    set((state) => {
      const keyStr = `rr_live_${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 14)}`;
      state.addLog(`API Key '${name}' generated`, "success");
      return { apiKeys: [...state.apiKeys, { id: `key-${Date.now()}`, name, key: keyStr, created: new Date().toISOString().split("T")[0] }] };
    }),

  deleteApiKey: (id) =>
    set((state) => {
      state.addLog(`API Token revoked`, "warning");
      return { apiKeys: state.apiKeys.filter((k) => k.id !== id) };
    }),

  saveFlow: (flowId, nodes, edges) =>
    set((state) => {
      state.addLog(`Automation builder flow saved: ${flowId}`, "success");
      return { savedFlows: { ...state.savedFlows, [flowId]: { nodes, edges } } };
    }),
}));

// ==========================================
// 3. REACT FLOW NODE DECLARATIONS
// ==========================================

const TriggerNode = ({ data, selected }: any) => {
  const getSub = () => {
    switch (data.type) {
      case "instagram_comment":
        return `Comment matches: "${data.config?.keyword || "RUSH"}"`;
      case "instagram_dm":
        return `DM contains: "${data.config?.keyword || "START"}"`;
      case "story_mention":
        return "Tagged in story post";
      case "keyword":
        return `Keyword matches: "${data.config?.keyword || "HELP"}"`;
      default:
        return "Activation Event";
    }
  };

  return (
    <div
      className={`relative px-4 py-3.5 rounded-xl border-2 shadow-2xl w-60 text-left transition-all duration-300 ${selected
        ? "border-violet-500 shadow-violet-500/20 bg-white"
        : "border-blue-500/50 hover:border-blue-400 bg-white/90"
        }`}
    >
      <div className="absolute -top-3 left-3 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-blue-600 text-white rounded-full border border-blue-400 flex items-center gap-1 shadow-md">
        <Zap size={9} className="fill-white" />
        Trigger
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <Instagram size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white truncate">{data.label}</h4>
          <p className="text-[10px] text-gray-500 truncate">{getSub()}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-blue-400" />
    </div>
  );
};

const ActionNode = ({ data, selected }: any) => {
  const getIcon = () => {
    switch (data.type) {
      case "send_dm":
        return <MessageSquare size={18} className="text-indigo-400" />;
      case "send_whatsapp":
        return <WhatsAppIcon size={18} className="text-emerald-400" />;
      case "send_email":
        return <Mail size={18} className="text-amber-400" />;
      case "add_tag":
        return <Zap size={18} className="text-cyan-400" />;
      case "wait":
        return <Clock size={18} className="text-yellow-400" />;
      case "condition":
        return <Sliders size={18} className="text-rose-400" />;
      case "ai_agent":
        return <Bot size={18} className="text-teal-400" />;
      case "webhook":
        return <Webhook size={18} className="text-blue-400" />;
      default:
        return <Sparkles size={18} className="text-indigo-400" />;
    }
  };

  const getBorderColor = () => {
    switch (data.type) {
      case "ai_agent":
        return selected ? "border-teal-500 shadow-teal-500/20" : "border-teal-500/40 hover:border-teal-400";
      case "condition":
        return selected ? "border-rose-500 shadow-rose-500/20" : "border-rose-500/40 hover:border-rose-400";
      case "wait":
        return selected ? "border-yellow-500 shadow-yellow-500/20" : "border-yellow-500/40 hover:border-yellow-400";
      default:
        return selected ? "border-indigo-500 shadow-indigo-500/20" : "border-indigo-500/40 hover:border-indigo-400";
    }
  };

  const getBadgeColor = () => {
    switch (data.type) {
      case "ai_agent":
        return "bg-teal-600 border-teal-400";
      case "condition":
        return "bg-rose-600 border-rose-400";
      case "wait":
        return "bg-yellow-600 border-yellow-400";
      default:
        return "bg-indigo-600 border-indigo-400";
    }
  };

  const getDescription = () => {
    switch (data.type) {
      case "send_dm":
        return data.config?.message ? `DM: "${data.config.message}"` : "Draft DM text...";
      case "send_whatsapp":
        return data.config?.message ? `WhatsApp: "${data.config.message}"` : "Draft WhatsApp...";
      case "send_email":
        return data.config?.subject ? `Email: "${data.config.subject}"` : "Compose email...";
      case "add_tag":
        return `Tag: "${data.config?.tag || "Qualified"}"`;
      case "wait":
        return `Wait ${data.config?.duration || 10} ${data.config?.unit || "minutes"}`;
      case "condition":
        return `Split: ${data.config?.criteria || "Stage is Won"}`;
      case "ai_agent":
        return `AI Bot: ${data.config?.agentId === "a1" ? "Qualify Bot" : "Closer Bot"}`;
      case "webhook":
        return `Webhook: ${data.config?.url ? data.config.url.substring(0, 18) + "..." : "Sync CRM"}`;
      default:
        return "Perform system task";
    }
  };

  return (
    <div
      className={`relative px-4 py-3.5 rounded-xl border-2 shadow-2xl w-60 text-left transition-all duration-300 bg-white ${getBorderColor()}`}
    >
      <div className={`absolute -top-3 left-3 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-white rounded-full border flex items-center gap-1 shadow-md ${getBadgeColor()}`}>
        <Sparkles size={9} className="fill-white" />
        {data.type === "ai_agent" ? "AI Agent" : data.type === "condition" ? "Condition" : "Action"}
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div className="p-2 rounded-lg bg-gray-100/80">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white truncate">{data.label}</h4>
          <p className="text-[10px] text-gray-500 truncate font-mono">{getDescription()}</p>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-zinc-400" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-indigo-400" />
    </div>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

// ==========================================
// 4. MAIN PAGE CONTAINER
// ==========================================

export default function Home() {
  const store = useAppStore();
  const [isMounted, setIsMounted] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");

  // Keyboard shortcut listener
  useEffect(() => {
    setIsMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Notifications auto-dismissal
  useEffect(() => {
    if (store.notifications.length > 0) {
      const timer = setTimeout(() => {
        store.dismissNotification(store.notifications[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [store.notifications, store]);

  // Command items matching search queries
  const filteredCommandItems = useMemo(() => {
    const items = [
      { category: "View", name: "Go to Overview Dashboard", action: () => store.navigate("dashboard") },
      { category: "View", name: "Go to Automation Builder", action: () => store.navigate("builder") },
      { category: "View", name: "Go to Kanban & CRM Grid", action: () => store.navigate("crm") },
      { category: "View", name: "Go to AI Agents Studio", action: () => store.navigate("agents") },
      { category: "View", name: "Go to Revenue Analytics", action: () => store.navigate("analytics") },
      { category: "View", name: "Go to Settings & Keys", action: () => store.navigate("settings") },
      { category: "View", name: "Back to Landing Site", action: () => store.navigate("landing") },
      {
        category: "Sync", name: "Force Sync CRM Leads", action: () => {
          store.addContact({ name: "Robby Chen", username: "robby_c", email: "robby@chen.im", phone: "+886 912 345 678", stage: "New Lead", leadScore: 68, tags: ["Sync Client"], notes: "Warm lead imported from webhook trigger.", source: "IG Story Comment" });
          store.pushNotification("Leads Synced", "Injected @robby_c into CRM pipeline stage.", "success");
        }
      },
    ];

    if (!commandQuery) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(commandQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(commandQuery.toLowerCase())
    );
  }, [commandQuery, store]);

  // Loading spinner for server state compilation sync
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col w-full"></div>
    );
  }

  const renderView = () => {
    switch (store.currentView) {
      case "landing":
        return <LandingView />;
      case "login":
        return <LoginView />;
      case "register":
        return <RegisterView />;
      case "forgot-password":
        return <ForgotPasswordView />;
      case "dashboard":
        return <DashboardHomeView />;
      case "builder":
        return <BuilderView />;
      case "crm":
        return <CrmView />;
      case "agents":
        return <AgentsView />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <LandingView />;
    }
  };

  const isAuthOrLanding = ["landing", "login", "register", "forgot-password"].includes(store.currentView);

  return (
    <div className={`flex flex-col min-h-screen antialiased font-sans transition-colors duration-300 ${isAuthOrLanding ? "bg-[#FAF9F6] text-[#1A1A1A]" : "bg-[#FAF9F6] text-[#1A1A1A]"
      }`}>
      {/* Notifications overlay */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {store.notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="p-4 rounded-xl border border-gray-200 bg-white/95 shadow-2xl flex gap-3 pointer-events-auto items-start"
            >
              <div className="p-1 rounded bg-indigo-500/10 text-indigo-400 mt-0.5">
                <Sparkles size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-semibold text-white">{notif.title}</h5>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
              </div>
              <button
                onClick={() => store.dismissNotification(notif.id)}
                className="text-gray-400 hover:text-gray-600 p-0.5 hover:bg-zinc-855 rounded transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cmd K Command Palette */}
      <AnimatePresence>
        {commandOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="w-full max-w-xl bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <Search className="text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search Set2Send pages & actions..."
                  className="flex-1 bg-transparent border-0 outline-none text-white placeholder-zinc-500 text-sm"
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  autoFocus
                />
                <kbd className="px-2 py-0.5 rounded bg-gray-100 text-[10px] text-gray-500 border border-gray-300 font-mono">ESC</kbd>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredCommandItems.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-sm">No matches found.</div>
                ) : (
                  filteredCommandItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action();
                        setCommandOpen(false);
                        setCommandQuery("");
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-100 flex items-center justify-between text-xs text-gray-600 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[9px] uppercase font-mono text-blue-400 font-bold border border-gray-300">{item.category}</span>
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight size={14} className="text-zinc-600" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main shell router */}
      {isAuthOrLanding ? (
        <main className="flex-1 flex flex-col">{renderView()}</main>
      ) : (
        <div className="flex flex-1 overflow-hidden min-h-screen">
          {/* Dashboard Sidebar */}
          <aside className="w-64 border-r border-gray-200 bg-[#0c0c0e] flex flex-col justify-between shrink-0 hidden md:flex">
            <div className="flex flex-col">
              {/* Brand Header */}
              <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/20">
                <button onClick={() => store.navigate("landing")} className="flex items-center gap-2 text-left group">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-700 transition-all">
                    <Zap size={16} className="fill-white text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-white group-hover:text-[#f97316] transition-colors">Set2Send AI</h3>
                    <p className="text-[10px] text-gray-400 font-mono">Telemetry console</p>
                  </div>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-4 flex flex-col gap-1">
                <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2 px-3 font-mono">Workspace</p>
                <SidebarLink view="dashboard" label="Dashboard" icon={<Activity size={15} />} active={store.currentView === "dashboard"} onClick={() => store.navigate("dashboard")} />
                <SidebarLink view="builder" label="Flow Builder" icon={<Layers size={15} />} active={store.currentView === "builder"} onClick={() => store.navigate("builder")} />
                <SidebarLink view="crm" label="CRM Kanban Grid" icon={<Kanban size={15} />} active={store.currentView === "crm"} onClick={() => store.navigate("crm")} />

                <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-5 mb-2 px-3 font-mono">AI Studio</p>
                <SidebarLink view="agents" label="AI Agents Config" icon={<Bot size={15} />} active={store.currentView === "agents"} onClick={() => store.navigate("agents")} />
                <SidebarLink view="analytics" label="Revenue Stats" icon={<TrendingUp size={15} />} active={store.currentView === "analytics"} onClick={() => store.navigate("analytics")} />

                <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-5 mb-2 px-3 font-mono">Management</p>
                <SidebarLink view="settings" label="Settings & Keys" icon={<Settings size={15} />} active={store.currentView === "settings"} onClick={() => store.navigate("settings")} />
              </nav>
            </div>

            {/* Profile Footer */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/45">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-400/25 flex items-center justify-center text-xs font-bold text-indigo-400">RR</div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">Pro Creator</h4>
                  <p className="text-[9px] text-gray-400 truncate font-mono">Active Plan</p>
                </div>
              </div>
              <button
                onClick={() => {
                  store.navigate("landing");
                  store.pushNotification("Logged Out", "Returned to main website.", "info");
                }}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="Log Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </aside>

          {/* Core Content Shell */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header Toolbar */}
            <header className="h-16 border-b border-gray-200 px-6 bg-[#FAF9F6]/80 backdrop-blur flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="md:hidden">
                  <MobileMenu />
                </div>
                <button
                  onClick={() => setCommandOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white/60 text-xs text-gray-500 w-52 text-left transition-all font-mono"
                >
                  <Search size={14} />
                  <span>Search... (Ctrl K)</span>
                </button>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-mono text-[9px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Instagram API LIVE</span>
                </div>
                <div className="h-4 w-px bg-gray-100 hidden sm:block"></div>
                <button
                  onClick={() => store.navigate("builder")}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Build Automation</span>
                </button>
              </div>
            </header>

            {/* Scrollable Layout Panel */}
            <main className="flex-1 overflow-y-auto bg-[#FAF9F6]">
              <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
                {renderView()}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar links helper
function SidebarLink({
  label,
  icon,
  active,
  onClick,
}: {
  view: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${active
        ? "bg-gray-100 text-white border border-zinc-750 shadow"
        : "text-gray-500 hover:text-zinc-200 hover:bg-white/40"
        }`}
    >
      <span className={active ? "text-indigo-400" : "text-gray-500"}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

// Mobile navigation dropdown menu
function MobileMenu() {
  const store = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500"
      >
        <Menu size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="relative w-64 bg-gray-50 border-r border-gray-200 p-6 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Set2Send AI</h3>
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <nav className="flex flex-col gap-1">
                  <SidebarLink view="dashboard" label="Dashboard" icon={<Activity size={15} />} active={store.currentView === "dashboard"} onClick={() => { store.navigate("dashboard"); setIsOpen(false); }} />
                  <SidebarLink view="builder" label="Flow Builder" icon={<Layers size={15} />} active={store.currentView === "builder"} onClick={() => { store.navigate("builder"); setIsOpen(false); }} />
                  <SidebarLink view="crm" label="CRM Grid" icon={<Kanban size={15} />} active={store.currentView === "crm"} onClick={() => { store.navigate("crm"); setIsOpen(false); }} />
                  <SidebarLink view="agents" label="AI Agents" icon={<Bot size={15} />} active={store.currentView === "agents"} onClick={() => { store.navigate("agents"); setIsOpen(false); }} />
                  <SidebarLink view="analytics" label="Analytics" icon={<TrendingUp size={15} />} active={store.currentView === "analytics"} onClick={() => { store.navigate("analytics"); setIsOpen(false); }} />
                  <SidebarLink view="settings" label="Settings" icon={<Settings size={15} />} active={store.currentView === "settings"} onClick={() => { store.navigate("settings"); setIsOpen(false); }} />
                </nav>
              </div>
              <button onClick={() => { store.navigate("landing"); setIsOpen(false); }} className="text-xs text-rose-400 font-semibold flex items-center gap-1 border-t border-gray-200 pt-4 mt-auto">
                <LogOut size={13} />
                <span>Return to Web</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PremiumMockup({ startAnimation = true }: { startAnimation?: boolean }) {
  const [step, setStep] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "-100px 0px" });

  useEffect(() => {
    if (!isInView || !startAnimation) {
      setStep(0);
      return;
    }

    let t: NodeJS.Timeout;
    if (step === 0) {
      t = setTimeout(() => setStep(1), 1200); // Trigger notification
    } else if (step === 1) {
      t = setTimeout(() => setStep(2), 1500); // Msg 1
    } else if (step === 2) {
      t = setTimeout(() => setStep(3), 1500); // User Typing "Done, Followed You"
    } else if (step === 3) {
      t = setTimeout(() => setStep(4), 1800); // User Sent "Done, Followed You"
    } else if (step === 4) {
      t = setTimeout(() => setStep(5), 1400); // Msg 2
    } else if (step === 5) {
      t = setTimeout(() => setStep(6), 1200); // Link card
    } else if (step === 6) {
      t = setTimeout(() => setStep(7), 1600); // Time divider (1 week later)
    } else if (step === 7) {
      t = setTimeout(() => setStep(8), 1500); // Msg 3
    } else if (step === 8) {
      t = setTimeout(() => setStep(9), 1800); // User Typing Email
    } else if (step === 9) {
      t = setTimeout(() => setStep(10), 1500); // User Sent Email
    } else if (step === 10) {
      t = setTimeout(() => setStep(11), 1500); // Msg 4
    } else if (step === 11) {
      t = setTimeout(() => setStep(12), 1500); // Lead badge
    } else if (step === 12) {
      t = setTimeout(() => setStep(13), 1000); // Metrics tooltips
    } else if (step === 13) {
      t = setTimeout(() => setStep(0), 6000); // Loop restart
    }
    return () => clearTimeout(t);
  }, [step, isInView, startAnimation]);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center w-full h-full lg:min-h-[500px] perspective-1000 pt-8 lg:pt-0">
      {/* 2 Concentric Glow Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-[rgba(37, 99, 235,0.15)] rounded-full animate-[pulse_4s_ease-in-out_infinite] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] border border-[rgba(37, 99, 235,0.05)] rounded-full animate-[pulse_6s_ease-in-out_infinite_1s] pointer-events-none"></div>

      {/* Ghost Vertical Label */}
      <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 rotate-90 origin-bottom-right z-10 pointer-events-none select-none font-[family-name:var(--font-inter)] text-[#475569] opacity-60 text-[9px] tracking-[0.5em] uppercase hidden xl:block">
        Live Automation Preview
      </div>

      {/* Floating Metrics Tooltips */}
      <AnimatePresence>
        {step >= 13 && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute top-[20%] -left-8 z-20 bg-[#0F172A] border border-[#475569] px-4 py-2 flex flex-col items-start shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              <span className="text-[#94A3B8] text-[9px] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-0.5">Speed</span>
              <span className="text-[#2563EB] text-[16px] font-[family-name:var(--font-inter)]">0.4s response</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="absolute bottom-[25%] -right-8 z-20 bg-[#0F172A] border border-[#475569] px-4 py-2 flex flex-col items-start shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              <span className="text-[#94A3B8] text-[9px] uppercase tracking-widest font-[family-name:var(--font-inter)] mb-0.5">Efficacy</span>
              <span className="text-[#60A5FA] text-[16px] font-[family-name:var(--font-inter)]">94% conversion</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Phone Hardware Shell */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-[280px] h-[550px] bg-[#1E293B] border border-[rgba(37, 99, 235,0.25)] rounded-[36px] p-[12px] shadow-[0_40px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(37, 99, 235,0.1)] z-10 box-content flex flex-col"
      >
        {/* Double-Corner Accents (L-brackets) */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#2563EB] z-20 m-[2px] rounded-tl-[42px]"></div>
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[#2563EB] z-20 m-[2px] rounded-tr-[42px]"></div>
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[#2563EB] z-20 m-[2px] rounded-bl-[42px]"></div>
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#2563EB] z-20 m-[2px] rounded-br-[42px]"></div>

        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[80px] h-[4px] bg-[rgba(37, 99, 235,0.2)] rounded-[2px] z-50"></div>

        {/* Inner Phone Screen */}
        <div className="w-full h-full bg-[#020617] rounded-[30px] overflow-hidden flex flex-col relative font-[family-name:var(--font-inter)] border border-white/5">
          {/* Top Header inside UI */}
          <div className="h-[70px] bg-[#0F172A] flex items-end px-4 pb-3 shrink-0 relative z-40 border-b border-[rgba(37, 99, 235,0.2)]">
            <div className="flex items-center gap-2 w-full justify-center">
              <div className="w-9 h-9 border border-[#2563EB] bg-[#020617] flex items-center justify-center rounded-full">
                <span className="font-[family-name:var(--font-inter)] text-[#2563EB] font-bold text-xl italic relative top-[1px]">S</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[#F8FAFC] text-[15px] font-bold leading-tight tracking-wide">set2send</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-pulse"></span>
                  <span className="text-[#94A3B8] text-[9px] font-medium uppercase tracking-[0.1em]">Intelligence Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-5 pb-8 flex flex-col justify-end gap-[12px] overflow-hidden relative z-30" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black)' }}>

            {/* Step 1: Trigger Notification */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mx-auto mt-2 mb-2 shrink-0"
                >
                  <div className="bg-[#0F172A] border border-[#475569] px-[14px] py-[8px] flex items-center gap-2 rounded-full shadow-lg">
                    <svg className="w-[14px] h-[14px] text-[#475569]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span className="text-[11px] text-[#94A3B8]">@maya.builds commented: 'DROP THE LINK 🔥'</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col justify-end gap-[12px] pb-2 px-1">
              {/* Step 2: Msg 1 */}
              <AnimatePresence>
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
                    className="self-start max-w-[88%] shrink-0"
                  >
                    <div className="bg-[#0F172A] border-l-[2px] border-[#2563EB] text-[#F8FAFC] text-[13px] leading-[1.6] px-[14px] py-[10px] rounded-[16px] rounded-tl-sm">
                      Signal intercepted. You're one step from the link, Maya. Follow me first and I'll deploy it to your DMs.
                    </div>
                    <div className="text-left text-[9px] text-[#475569] mt-1.5 ml-1 flex items-center gap-1 uppercase tracking-wider">
                      <Zap size={9} className="text-[#475569] fill-[#475569]" /> 0.0s latency
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3 & 4: User Reply */}
              <AnimatePresence>
                {step === 3 && (
                  <motion.div
                    key="typing-done"
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                    className="self-end shrink-0"
                  >
                    <div className="bg-[#020617] border border-[#475569] px-[14px] py-[10px] flex items-center gap-2 rounded-full">
                      <div className="text-[#475569] text-[13px] w-[140px] relative">
                        <motion.span
                          initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.2, ease: "linear", delay: 0.2 }}
                          className="overflow-hidden whitespace-nowrap inline-block text-[#60A5FA]"
                        >
                          Done, Followed You
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 1 }} animate={{ opacity: 0 }} className="absolute left-0 top-0 text-[#475569]" transition={{ delay: 0.2, duration: 0.01 }}
                        >
                          Typing...
                        </motion.span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                        className="bg-[#2563EB] text-[#020617] text-[11px] px-[12px] py-[4px] uppercase tracking-wider font-semibold rounded-full"
                      >
                        Send
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                {step >= 4 && (
                  <motion.div
                    key="sent-done"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                    className="self-end max-w-[88%] shrink-0"
                  >
                    <div className="bg-[rgba(37, 99, 235,0.1)] border border-[#2563EB] text-[#60A5FA] text-[13px] leading-[1.6] px-[14px] py-[10px] rounded-[16px] rounded-tr-sm">
                      Done, Followed You
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 5: Msg 2 */}
              <AnimatePresence>
                {step >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
                    className="self-start max-w-[88%] shrink-0"
                  >
                    <div className="bg-[#0F172A] border-l-[2px] border-[#2563EB] text-[#F8FAFC] text-[13px] leading-[1.6] px-[14px] py-[10px] rounded-[16px] rounded-tl-sm">
                      Authorization confirmed. Access your exclusive resources below.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 6: Link Card */}
              <AnimatePresence>
                {step >= 6 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                    className="self-start w-[85%] mt-1 shrink-0"
                  >
                    <div className="bg-[#0F172A] border border-[#475569] rounded-xl overflow-hidden group cursor-pointer hover:border-[#2563EB] transition-colors duration-300">
                      <div className="h-[100px] relative bg-[#020617] flex items-center justify-center overflow-hidden border-b border-[#475569]">
                        {/* Placeholder image representation */}
                        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-[#2563EB] to-transparent mix-blend-overlay"></div>
                        <span className="font-[family-name:var(--font-inter)] text-[#2563EB] text-4xl opacity-50 italic">S</span>
                      </div>
                      <div className="p-3 bg-[#0F172A]">
                        <h4 className="text-[#F8FAFC] text-[12px] font-semibold tracking-wide">The Intelligence Protocol</h4>
                        <p className="text-[#94A3B8] text-[10px] mt-1 truncate">set2send.com/protocol-access</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 7: Time Divider */}
              <AnimatePresence>
                {step >= 7 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex items-center justify-center relative py-2 shrink-0"
                  >
                    <div className="absolute w-full h-[1px] bg-white/10"></div>
                    <div className="bg-[#020617] px-3 relative z-10 text-[10px] italic text-[#94A3B8]/50 text-center uppercase tracking-widest font-semibold">
                      — 1 week later —
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 8: Msg 3 */}
              <AnimatePresence>
                {step >= 8 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
                    className="self-start max-w-[88%] shrink-0"
                  >
                    <div className="bg-[#0F172A] border-l-[2px] border-[#2563EB] text-[#F8FAFC] text-[13px] leading-[1.6] px-[14px] py-[10px] rounded-[16px] rounded-tl-sm">
                      Hey Maya 👋 Building something exclusive for my community. Want early access? Drop your email. 📩
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 9 & 10: Email Input (Typing -> Sent) */}
              <AnimatePresence>
                {step === 9 && (
                  <motion.div
                    key="typing-email"
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                    className="self-end shrink-0"
                  >
                    <div className="bg-[#020617] border border-[#475569] px-[14px] py-[10px] flex items-center gap-2 rounded-full">
                      <div className="text-[#475569] text-[13px] w-[130px] relative">
                        <motion.span
                          initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.2, ease: "linear", delay: 0.2 }}
                          className="overflow-hidden whitespace-nowrap inline-block text-[#60A5FA]"
                        >
                          maya@example.com
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 1 }} animate={{ opacity: 0 }} className="absolute left-0 top-0 text-[#475569]" transition={{ delay: 0.2, duration: 0.01 }}
                        >
                          Email...
                        </motion.span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                        className="bg-[#2563EB] text-[#020617] text-[11px] px-[12px] py-[4px] uppercase tracking-wider font-semibold rounded-full"
                      >
                        Send
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                {step >= 10 && (
                  <motion.div
                    key="sent-email"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                    className="self-end max-w-[88%] shrink-0"
                  >
                    <div className="bg-[rgba(37, 99, 235,0.1)] border border-[#2563EB] text-[#60A5FA] text-[13px] leading-[1.6] px-[14px] py-[10px] rounded-[16px] rounded-tr-sm">
                      maya@example.com
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 11: Msg 4 */}
              <AnimatePresence>
                {step >= 11 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
                    className="self-start max-w-[88%] shrink-0"
                  >
                    <div className="bg-[#0F172A] border-l-[2px] border-[#2563EB] text-[#F8FAFC] text-[13px] leading-[1.6] px-[14px] py-[10px] rounded-[16px] rounded-tl-sm">
                      You're in. ✅ Watch your inbox for something worth opening. 📬
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 12: Lead Badge */}
              <AnimatePresence>
                {step >= 12 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", damping: 15, stiffness: 250 }}
                    className="mx-auto mt-2 shrink-0 mb-1"
                  >
                    <div className="bg-[#0F172A] border border-[rgba(37, 99, 235,0.35)] rounded-full px-[14px] py-[6px] flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-[pulse_1.5s_infinite]"></span>
                      <span className="text-[#2563EB] text-[9px] uppercase tracking-[0.08em] font-medium">Lead captured → set2send CRM</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// 5. VIEW DEFINITIONS
// ==========================================

// 5.1 LANDING VIEW
// ==========================================
// CUSTOM STYLES FOR ROYAL AESTHETIC
// Background: #FAF9F6 (Cream/Ivory)
// Dark Text: #1A1A1A (Charcoal)
// Accent/Gold: #C5A880 (Champagne Gold)

const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#C5A880] font-medium">{children}</span>
);

const RippleButton = ({ onClick, children, className }: any) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      const timer = setTimeout(() => setIsRippling(false), 600);
      return () => clearTimeout(timer);
    } else {
      setIsRippling(false);
    }
  }, [coords]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
    if (onClick) onClick(e);
  };

  return (
    <button onClick={handleButtonClick} className={`${className} relative overflow-hidden`}>
      {isRippling && (
        <span
          className="ripple"
          style={{
            left: coords.x,
            top: coords.y,
            width: 20,
            height: 20,
          }}
        />
      )}
      {children}
    </button>
  );
};

// SECTION 1: HERO - Redesigned Cinematic Background Video Hero
const HeroSectionRedesigned = ({ store }: { store: any }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (prefersReducedMotion) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => { });
      }
    }
  }, [prefersReducedMotion]);

  const fadeUp = (delay: number) => ({
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const }
  } as const);

  const fade = (delay: number) => ({
    initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0 },
    animate: { opacity: 1 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 1.0, delay, ease: "easeOut" as const }
  } as const);

  const scaleIn = (delay: number) => ({
    initial: prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const }
  } as const);

  return (
    <section className="relative h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-black text-[#FAF9F6] w-full">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero_poster.png"
        className="absolute inset-0 w-full h-full object-cover z-0 gpu-accelerated"
      >
        <source src="https://res.cloudinary.com/dp2jtar7h/video/upload/v1782687650/merged-video_rllrms.mp4" type="video/mp4" />
      </video>

      {/* Overlays Layer 1, 2, 3 */}
      <div className="absolute inset-0 z-1 bg-black/42 pointer-events-none"></div>
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.25)_0%,_transparent_75%)] pointer-events-none"></div>
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,_rgba(201,152,36,0.08)_0%,_transparent_65%)] pointer-events-none"></div>

      {/* Layer 4: Animated grain texture */}
      {!prefersReducedMotion && <div className="grain-overlay pointer-events-none" />}

      {/* Hero Content */}
      <div className="relative z-3 w-full max-w-[850px] px-6 text-center flex flex-col items-center justify-center -mt-12 md:-mt-16">
        {/* Badge */}
        <motion.div
          {...fadeUp(0.5)}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#D4AF37]/30 bg-black/40 backdrop-blur-md mb-8 shadow-[0_4px_20px_rgba(212,175,55,0.05)] cursor-default hover:border-[#D4AF37]/65 transition-all duration-300"
        >
          <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
          <span className="text-[11px] font-extrabold tracking-[0.25em] text-[#D4AF37] uppercase">The Elite DM Infrastructure</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.8)}
          className="text-5xl md:text-[6.8rem] font-bold tracking-tight text-[#FAF9F6] leading-[0.95] drop-shadow-lg font-playfair flex flex-col gap-2 select-none"
        >
          <span className="font-extrabold tracking-tight">Automate.</span>
          <span className="italic font-normal gold-text-gradient py-1">Captivate.</span>
          <span className="font-bold tracking-tight">Scale.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          {...fade(1.0)}
          className="mt-8 text-lg md:text-[22px] text-white/92 max-w-[650px] leading-[1.8] font-medium tracking-wide drop-shadow select-none font-sans"
        >
          Transform every Instagram comment into a highly-qualified lead.
          Set2Send automatically gates your content, collects emails, and updates your CRM.
        </motion.p>

        {/* CTA Button */}
        <motion.div {...scaleIn(1.2)} className="mt-12 flex flex-col sm:flex-row items-center gap-6">
          <RippleButton
            onClick={() => store.navigate('register')}
            className="px-10 py-4.5 bg-black text-white hover:text-black font-extrabold text-sm tracking-widest uppercase rounded-full border border-white/10 hover:border-[#D4AF37] hover:bg-white cta-glow-effect transition-all duration-300 flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Deploy Engine <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </RippleButton>
        </motion.div>
      </div>
    </section>
  );
};

// SECTION 2: THE ARSENAL - Features (CRM, Leads, Follow Gate)
const ArsenalSectionV7 = () => {
  return (
    <section className="py-32 bg-[#F5F2EA] relative border-b border-[#E8E4D9]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1A1A1A] mb-6">The Royal Arsenal.</h2>
          <p className="text-2xl text-[#1A1A1A]/70 font-medium">Heavy-duty tools for serious creators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1: CRM & Leads */}
          <motion.div whileHover={{ y: -10 }} className="bg-[#FAF9F6] p-10 shadow-2xl border-t-[8px] border-[#1A1A1A] flex flex-col justify-between min-h-[350px]">
            <div>
              <div className="w-16 h-16 bg-[#1A1A1A] flex items-center justify-center mb-8">
                <Database className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-4">Integrated CRM</h3>
              <p className="text-[#1A1A1A]/70 text-lg leading-relaxed">
                Every DM conversation instantly creates a lead profile. Track engagers, analyze sentiment, and map your entire audience inside our native CRM.
              </p>
            </div>
          </motion.div>

          {/* Feature 2: Email Collection */}
          <motion.div whileHover={{ y: -10 }} className="bg-[#FAF9F6] p-10 shadow-2xl border-t-[8px] border-[#D4AF37] flex flex-col justify-between min-h-[350px] relative md:-mt-12">
            <div>
              <div className="w-16 h-16 bg-[#D4AF37] flex items-center justify-center mb-8">
                <Mail className="w-8 h-8 text-[#1A1A1A]" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-4">Email Harvest</h3>
              <p className="text-[#1A1A1A]/70 text-lg leading-relaxed">
                Before releasing the reward, the engine automatically asks for and validates their email address, syncing directly to your newsletter stack.
              </p>
            </div>
          </motion.div>

          {/* Feature 3: Follow Gate */}
          <motion.div whileHover={{ y: -10 }} className="bg-[#FAF9F6] p-10 shadow-2xl border-t-[8px] border-[#1A1A1A] flex flex-col justify-between min-h-[350px]">
            <div>
              <div className="w-16 h-16 bg-[#1A1A1A] flex items-center justify-center mb-8">
                <Lock className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-4">The Follow Gate</h3>
              <p className="text-[#1A1A1A]/70 text-lg leading-relaxed">
                Strict validation. The engine checks if the user follows you. If they don't, it politely requests a follow before sending the payload.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// SECTION 3: FLOW - The Intelligent Follow Gate & Harvest
const FlowSectionV8 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mapped up to 0.8. From 0.8 to 1.0, it stays at 4, creating a "freeze" effect.
  const stepIndex = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 1, 2, 3, 4, 4]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    return stepIndex.onChange((v) => setCurrentStep(Math.floor(v)));
  }, [stepIndex]);

  const steps = [
    { title: "Comment Trigger", desc: "A fan drops the magic keyword on your latest reel." },
    { title: "Follow Gate", desc: "The engine intercepts the comment and demands a follow before sending the payload." },
    { title: "DM Sent", desc: "Instantly verifies the follow status and autonomously delivers the reward." },
    { title: "Email Collection", desc: "Days later, the engine follows up automatically to ascend the audience into email leads." },
    { title: "Lead Gen & CRM", desc: "The user replies with their email, and the system generates a qualified lead." }
  ];

  // Calculate sliding offset to keep the latest messages in view
  const getChatOffset = (step: number) => {
    if (step === 0) return 0;
    if (step === 1) return -50;
    if (step === 2) return -180;
    if (step === 3) return -340;
    if (step === 4) return -480;
    return 0;
  };

  return (
    <section ref={containerRef} className="h-[600vh] bg-[#FAF9F6] relative border-b-8 border-[#1A1A1A]">
      <div className="sticky top-0 h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-8">

        <div className="max-w-7xl w-full mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">

          {/* Left Text Narrative */}
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 px-6 py-2 border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold text-xs uppercase tracking-widest mb-8">
              Chapter 0{currentStep + 1}
            </div>

            <AnimatePresence>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-[#1A1A1A] leading-[1.1] mb-8">
                  {steps[currentStep].title}
                </h2>
                <p className="text-2xl text-[#1A1A1A]/70 font-medium leading-relaxed max-w-lg">
                  {steps[currentStep].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Phone Storyboard (Light Shade Design) */}
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="relative w-[340px] h-[640px] bg-[#FFFFFF] rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-[12px] border-[#1A1A1A] overflow-hidden flex flex-col">

              {/* Royal Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1A1A1A] rounded-b-2xl z-50"></div>

              {/* Phone Header (Light Theme) */}
              <div className="w-full pt-12 pb-4 border-b border-[#E8E4D9] flex flex-col items-center justify-center z-10 bg-[#FFFFFF] shadow-sm relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[#E8E4D9] flex items-center justify-center bg-[#FAF9F6]">
                    <span className="font-serif italic text-[#1A1A1A] text-lg">S</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#1A1A1A] font-bold text-lg leading-tight tracking-wide">set2send</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[9px] font-bold text-[#1A1A1A]/50 uppercase tracking-widest">Intelligence Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Container with Slide-Up Animation */}
              <div className="flex-1 w-full relative p-4 overflow-hidden bg-[#FAF9F6]">
                <motion.div
                  className="flex flex-col gap-5 w-full absolute top-4 left-0 px-4"
                  animate={{ y: getChatOffset(currentStep) }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >

                  {/* Step 0: The Trigger */}
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4 w-full">
                    {/* The Trigger Box */}
                    <div className="w-full border border-[#1A1A1A]/10 rounded-2xl p-3 flex items-center gap-3 bg-white shadow-sm">
                      <div className="w-6 h-6 rounded-md bg-[#1A1A1A] flex items-center justify-center shrink-0">
                        <span className="text-white text-[10px]">IG</span>
                      </div>
                      <p className="text-[11px] text-[#1A1A1A]/80 font-medium">@maya.builds commented: 'BOOK'</p>
                    </div>
                  </motion.div>

                  {/* Step 1: Follow Gate */}
                  <AnimatePresence>
                    {currentStep >= 1 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4 w-full">
                        {/* The Gate Message */}
                        <div className="bg-[#1A1A1A] text-white p-4 rounded-2xl rounded-bl-sm self-start max-w-[90%] text-[13px] leading-relaxed shadow-md break-words">
                          Hey Maya! I noticed you commented 'BOOK' on the post, but you need to follow me in order to receive the DM link. 🔒
                        </div>

                        {/* User Follows */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="bg-white border border-[#1A1A1A]/10 text-[#1A1A1A] p-3 rounded-2xl rounded-tr-sm self-end max-w-[85%] text-[13px] font-medium shadow-sm break-words">
                          Done, followed!
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 2: Verification & DM Sent */}
                  <AnimatePresence>
                    {currentStep >= 2 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4 w-full">
                        {/* Typing Delay Simulation */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
                          className="self-start text-[#1A1A1A]/40 text-[10px] italic ml-2"
                        >
                          typing...
                        </motion.div>

                        {/* Payload Delivery */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex flex-col gap-3 w-full">
                          <div className="bg-[#1A1A1A] text-white p-4 rounded-2xl rounded-bl-sm self-start max-w-[90%] text-[13px] leading-relaxed shadow-md break-words">
                            Awesome! After verifying, here's your private link:
                          </div>
                          {/* Link Card */}
                          <div className="bg-white border border-[#1A1A1A]/10 rounded-2xl w-[90%] overflow-hidden flex flex-col shadow-md">
                            <div className="h-24 bg-[#E8E4D9] flex items-center justify-center border-b border-[#1A1A1A]/10">
                              <span className="font-serif italic text-[#1A1A1A] text-4xl opacity-50">S</span>
                            </div>
                            <div className="p-4 flex flex-col gap-1">
                              <span className="text-[#1A1A1A] font-bold text-[13px]">The Intelligence Protocol</span>
                              <span className="text-[#1A1A1A]/50 text-[11px]">set2send.com/protocol-access</span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 3: Email Collection */}
                  <AnimatePresence>
                    {currentStep >= 3 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4 w-full">
                        {/* 1 Week Later Divider */}
                        <div className="flex items-center gap-3 w-full justify-center my-2 opacity-60">
                          <div className="h-[1px] w-8 bg-[#1A1A1A]/20"></div>
                          <span className="text-[10px] font-bold text-[#1A1A1A]/60 tracking-widest uppercase">7 Days Later</span>
                          <div className="h-[1px] w-8 bg-[#1A1A1A]/20"></div>
                        </div>

                        {/* Harvest Message */}
                        <div className="bg-[#1A1A1A] text-white p-4 rounded-2xl rounded-bl-sm self-start max-w-[95%] text-[13px] leading-relaxed shadow-md break-words">
                          Hope you enjoyed the book! Drop your best email below to unlock the advanced guide. 📥
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 4: Lead Gen & CRM */}
                  <AnimatePresence>
                    {currentStep >= 4 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4 w-full pb-10">
                        {/* User Email */}
                        <div className="bg-white border border-[#1A1A1A]/10 text-[#1A1A1A] p-3 rounded-2xl rounded-tr-sm self-end max-w-[85%] text-[13px] font-medium shadow-sm break-words">
                          maya@example.com
                        </div>

                        {/* CRM Badges */}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="flex flex-col gap-2 mt-2 items-center">
                          <div className="border border-[#1A1A1A]/10 bg-white px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-[9px] font-bold text-[#1A1A1A] uppercase tracking-widest">Email Saved</span>
                          </div>
                          <div className="border border-[#1A1A1A]/10 bg-white px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-[9px] font-bold text-[#1A1A1A] uppercase tracking-widest">Lead Generated → CRM</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              </div>

              {/* Bottom Fade Gradient for Phone (Light Theme) */}
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#FAF9F6] to-transparent pointer-events-none"></div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// SECTION 5: TRUST - The Editorial Marquee
const TrustSectionV7 = () => {
  const reviews = [
    { name: "Alex Hormonzi", tag: "Author & Founder", text: "We gated our entire $100M lead magnet behind Set2Send. The follow gate is ruthless and mathematically perfect.", img: "https://i.pravatar.cc/150?img=11" },
    { name: "Sarah Jenkins", tag: "Creative Director", text: "The CRM integration saves my team 40 hours a week. It simply works.", img: "https://i.pravatar.cc/150?img=5" },
    { name: "David Choi", tag: "E-Com Scaling", text: "Collecting emails directly inside Instagram DMs before giving the discount code doubled our list.", img: "https://i.pravatar.cc/150?img=12" },
    { name: "Emma Watson", tag: "Global Brand", text: "An elegant, heavy-duty solution for serious audience architecture.", img: "https://i.pravatar.cc/150?img=9" },
  ];

  return (
    <section className="py-20 bg-[#1A1A1A] overflow-hidden relative border-t-8 border-[#D4AF37]">
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
          Architects of Scale.
        </h2>
        <p className="text-2xl text-white/60 font-medium">The infrastructure trusted by industry titans.</p>
      </div>

      <div className="flex w-full overflow-hidden pb-8 relative">
        {/* Soft edge masks */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#1A1A1A] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#1A1A1A] to-transparent z-10"></div>

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
          className="flex gap-8 w-max px-8"
        >
          {[...reviews, ...reviews].map((r, i) => (
            <div key={i} className="w-[400px] bg-[#222222] p-8 shadow-2xl border-l-[6px] border-[#D4AF37] flex-shrink-0 flex flex-col justify-between">
              <p className="text-lg text-white/90 mb-8 font-serif italic leading-relaxed">"{r.text}"</p>
              <div className="flex items-center gap-4">
                <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full grayscale border-2 border-[#D4AF37] object-cover" />
                <div>
                  <h4 className="text-lg font-bold text-white tracking-wide uppercase">{r.name}</h4>
                  <p className="text-xs font-medium text-[#D4AF37]">{r.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

function LandingView() {
  const store = useAppStore();

  return (
    <div className="font-[family-name:var(--font-inter)] text-[#1A1A1A] bg-[#FAF9F6]">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Navbar />
      </motion.div>

      <HeroSectionRedesigned store={store} />
      <ArsenalSectionV7 />
      <FlowSectionV8 />
      <TrustSectionV7 />

      <Footer />
    </div>
  );
}

function LoginView() {
  const store = useAppStore();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuth(data.user, data.token);
      store.pushNotification("Access Approved", "Welcome to the dashboard console.", "success");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
      store.pushNotification("Access Denied", err.response?.data?.error || "Invalid credentials", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <button onClick={() => store.navigate("landing")} className="flex items-center gap-1.5 font-bold text-gray-900 text-md mb-6">
            <Zap size={18} className="text-[#f97316] fill-[#f97316]" />
            <span>Set2Send AI</span>
          </button>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Log in to Set2Send</h2>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Telemetry qualifications console</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-xl">
          {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded border border-red-100">{error}</div>}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="you@domain.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Password</label>
              <button type="button" onClick={() => store.navigate("forgot-password")} className="text-[9px] text-indigo-600 font-semibold">Forgot?</button>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50">
            <Lock size={12} />
            <span>{loading ? "Authenticating..." : "Login to Console"}</span>
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-500 mt-6">
          New creator? <button onClick={() => store.navigate("register")} className="text-indigo-600 font-semibold hover:underline">Create account</button>
        </p>
      </div>
    </div>
  );
}

// 5.3 REGISTER VIEW
function RegisterView() {
  const store = useAppStore();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setAuth(data.user, data.token);
      store.pushNotification("Account Configured", "Your workspace setup is completed.", "success");
      store.addLog("Deployed Set2Send account", "success");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
      store.pushNotification("Registration Failed", err.response?.data?.error || "An error occurred", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <button onClick={() => store.navigate("landing")} className="flex items-center gap-1.5 font-bold text-gray-900 text-md mb-6">
            <Zap size={18} className="text-[#f97316] fill-[#f97316]" />
            <span>Set2Send AI</span>
          </button>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Create your account</h2>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Start converting comment triggers immediately</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-xl">
          {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded border border-red-100">{error}</div>}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Workspace Creator Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="e.g. John Doe" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="you@domain.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="Min 8 characters" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50">
            <User size={12} />
            <span>{loading ? "Deploying..." : "Deploy Workspace"}</span>
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-500 mt-6">
          Already have an account? <button onClick={() => store.navigate("login")} className="text-indigo-600 font-semibold hover:underline">Login</button>
        </p>
      </div>
    </div>
  );
}

// 5.4 FORGOT PASSWORD
function ForgotPasswordView() {
  const store = useAppStore();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      store.pushNotification("Link Dispatched", "Check your inbox for reset steps.", "success");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <button onClick={() => store.navigate("landing")} className="flex items-center gap-1.5 font-bold text-gray-900 text-md mb-6">
            <Zap size={18} className="text-[#f97316] fill-[#f97316]" />
            <span>Set2Send AI</span>
          </button>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recover credentials</h2>
        </div>

        {success ? (
          <div className="p-6 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-xl text-center">
             <div className="flex justify-center mb-2"><CheckCircle size={32} className="text-green-500" /></div>
             <p className="text-sm text-gray-900 font-semibold">Check your email</p>
             <p className="text-xs text-gray-500">We've sent a password reset link to {email}</p>
             <button onClick={() => store.navigate("login")} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs mt-4">Back to Login</button>
          </div>
        ) : (
          <form onSubmit={handleForgot} className="p-6 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-xl">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="you@domain.com" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-2 disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!success && (
          <p className="text-center text-[10px] text-gray-500 mt-6">
            Back to <button onClick={() => store.navigate("login")} className="text-indigo-600 font-semibold hover:underline">Login</button>
          </p>
        )}
      </div>
    </div>
  );
}

// 5.5 DASHBOARD HOME VIEW
function DashboardHomeView() {
  const store = useAppStore();

  const totalLeads = store.contacts.length;
  const messagesSent = store.contacts.reduce((acc, c) => acc + (c.leadScore * 2 + 15), 0);
  const revenueGenerated = store.contacts.filter((c) => c.stage === "Won").reduce((acc, c) => acc + c.leadScore * 120, 0);
  const conversionRate = Math.round((store.contacts.filter((c) => ["Won", "Booked"].includes(c.stage)).length / totalLeads) * 100);

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Overview Workspace</h1>
          <p className="text-xs text-gray-500 mt-0.5">Realtime conversion and outbound lead telemetry metrics.</p>
        </div>
        <button onClick={() => { store.pushNotification("Telemetry Updated", "Central variables refreshed.", "success"); }} className="px-3.5 py-1.5 bg-white border border-gray-200 hover:border-zinc-750 text-xs text-zinc-350 hover:text-white rounded-lg transition-all flex items-center gap-1.5 font-mono">
          <Activity size={14} className="text-indigo-400 animate-spin" />
          <span>Refresh stats</span>
        </button>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total CRM Leads" value={totalLeads} trend="+18.5% weekly" icon={<Users size={16} />} sub="Qualified client contacts" />
        <KpiCard title="Messages Sent" value={messagesSent} trend="+32.4% weekly" icon={<Send size={16} />} sub="Automated DM / WhatsApp responses" />
        <KpiCard title="Revenue Generated" value={`$${revenueGenerated.toLocaleString()}`} trend="+$8,400 monthly" icon={<Coins size={16} />} sub="Attributed Stripe payouts" />
        <KpiCard title="Conversion rate" value={`${conversionRate}%`} trend="+4.1% weekly" icon={<Sparkles size={16} />} sub="Leads Booked & Won" />
      </div>

      {/* SVG Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend SVG Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-gray-200 bg-white/20 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-xs">Revenue & Lead Source Trends</h3>
                <p className="text-[10px] text-gray-400 mt-0.5 font-mono">Channel attribution conversion tracking</p>
              </div>
              <div className="flex gap-2.5 text-[9px] font-mono uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-indigo-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>Revenue</span>
                <span className="flex items-center gap-1.5 text-blue-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Outbound Leads</span>
              </div>
            </div>

            <div className="h-44 mt-8 relative">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                {/* Horizontal Guide lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#1c1c22" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#1c1c22" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#1c1c22" strokeWidth="1" strokeDasharray="4" />

                {/* Indigo Line (Revenue) */}
                <path d="M0,130 Q100,60 200,90 T400,30 T500,10" fill="none" stroke="#6366f1" strokeWidth="3.5" className="wire-pulse" />
                {/* Purple Line (Leads) */}
                <path d="M0,110 Q100,100 200,50 T400,60 T500,20" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="4" />
              </svg>

              <div className="absolute inset-x-0 bottom-0 flex justify-between text-[9px] text-gray-400 font-mono pt-2 border-t border-[#E8E4D9]/60">
                <span>June 1</span>
                <span>June 2</span>
                <span>June 3</span>
                <span>June 4</span>
                <span>June 5 (Today)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Logs */}
        <div className="p-6 rounded-xl border border-gray-200 bg-white/20 flex flex-col justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Activity size={15} className="text-indigo-400" />
              <span>Realtime Workspace Activity Logs</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Automation activity triggers</p>

            <div className="mt-4 flex flex-col gap-3 max-h-[170px] overflow-y-auto pr-1">
              {store.logs.map((log) => (
                <div key={log.id} className="text-[11px] flex gap-2 border-b border-[#E8E4D9] pb-2 items-start leading-relaxed">
                  <span className="font-mono text-zinc-650 shrink-0">{log.timestamp}</span>
                  <div className="flex-1">
                    <p className="text-gray-600 font-semibold">{log.text}</p>
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${log.type === "success" ? "text-emerald-400" :
                      log.type === "ai" ? "text-teal-400" : "text-indigo-400"
                      }`}>{log.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => store.navigate("analytics")} className="w-full mt-4 py-2 border border-gray-200 hover:border-gray-300 bg-white/40 hover:bg-white text-[10px] font-bold text-gray-600 hover:text-white rounded-lg transition-all flex items-center justify-center gap-1">
            <span>Open Attribution Analytics</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  trend,
  icon,
  sub,
}: {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white/30 hover:border-gray-300 transition-all flex flex-col justify-between group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">{title}</span>
        <div className="p-2 rounded-lg bg-zinc-805 text-indigo-400 group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">{value}</h2>
        <div className="flex items-center justify-between mt-2 text-[9px]">
          <span className="text-zinc-550 font-mono">{sub}</span>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">{trend}</span>
        </div>
      </div>
    </div>
  );
}

// 5.6 FLOW BUILDER
function BuilderView() {
  const store = useAppStore();
  const flow = store.savedFlows[store.activeFlowId] || { nodes: [], edges: [] };

  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const nodeData = selectedNode?.data as any;

  const onConnect = (params: Connection) => setEdges((eds: any) => addEdge(params, eds));

  const handleSave = () => {
    store.saveFlow(store.activeFlowId, nodes, edges);
    store.pushNotification("Flow saved", "Your canvas was successfully committed.", "success");
  };

  const addNodeToCanvas = (type: "trigger" | "action", subType: string, label: string) => {
    const icon = type === "trigger" ? "Instagram" : "Sparkles";
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      position: { x: 150 + Math.random() * 80, y: 150 + Math.random() * 80 },
      data: {
        label,
        type: subType,
        icon,
        config: subType === "wait" ? { duration: 15, unit: "minutes" } : subType === "ai_agent" ? { agentId: "a1" } : {},
      },
    };
    setNodes((nds) => [...nds, newNode]);
    store.pushNotification("Node Added", `Spawned ${label} node onto the editor workspace.`, "info");
  };

  const deleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    if (selectedNode?.id === id) setSelectedNode(null);
    store.pushNotification("Node deleted", "Removed node from flow canvas.", "warning");
  };

  const updateNodeConfig = (updatedConfig: Record<string, any>) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? {
            ...n,
            data: {
              ...(n.data as any),
              config: {
                ...((n.data as any).config || {}),
                ...updatedConfig,
              },
            },
          }
          : n
      )
    );
    setSelectedNode((prev) =>
      prev
        ? {
          ...prev,
          data: {
            ...(prev.data as any),
            config: {
              ...((prev.data as any).config || {}),
              ...updatedConfig,
            },
          },
        }
        : null
    );
  };

  return (
    <div className="flex flex-col gap-6 h-[82vh] overflow-hidden -m-6 md:-m-8">
      {/* Top flow builder toolbar */}
      <div className="px-6 py-3 border-b border-gray-200 bg-[#0c0c0e] flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Layers size={15} className="text-[#f97316]" />
            <span>Set2Send Visual Builder Canvas</span>
          </h2>
          <p className="text-[10px] text-gray-400">Link activation triggers to lead qualifying responders</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              // Reset nodes to simple course launch template
              setNodes([
                { id: "n1", type: "trigger", position: { x: 50, y: 150 }, data: { label: "Instagram Comment", type: "instagram_comment", icon: "Instagram", config: { keyword: "RUSH" } } },
                { id: "n2", type: "action", position: { x: 320, y: 150 }, data: { label: "Run AI Bot Qualifier", type: "ai_agent", icon: "Bot", config: { agentId: "a1" } } },
                { id: "n3", type: "action", position: { x: 590, y: 150 }, data: { label: "Condition Check", type: "condition", icon: "Sliders", config: { criteria: "Email exists" } } },
                { id: "n4", type: "action", position: { x: 860, y: 240 }, data: { label: "Wait 1 Day Delay", type: "wait", icon: "Clock", config: { duration: 1, unit: "days" } } },
                { id: "n5", type: "action", position: { x: 860, y: 60 }, data: { label: "Send WhatsApp Coupon", type: "send_whatsapp", icon: "Phone", config: { message: "Here is your 50% discount coupon!" } } },
              ]);
              setEdges([
                { id: "e1-2", source: "n1", target: "n2" },
                { id: "e2-3", source: "n2", target: "n3" },
                { id: "e3-4", source: "n3", target: "n4", label: "False" },
                { id: "e3-5", source: "n3", target: "n5", label: "True" },
              ]);
              store.pushNotification("Template loaded", "Synchronized Set2Send template to canvas.", "success");
            }}
            className="px-3 py-1.5 border border-gray-200 hover:border-gray-300 bg-white text-xs font-semibold text-gray-600 hover:text-white rounded-lg transition-all"
          >
            Reset Template
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>Save flow</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 relative overflow-hidden bg-gray-50">
        {/* Left add-nodes toolbox drawer */}
        <div className="absolute top-4 left-4 z-10 w-44 bg-gray-50/95 border border-gray-200 p-4 rounded-xl flex flex-col gap-4 shadow-2xl">
          <div>
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Triggers</h4>
            <div className="flex flex-col gap-1.5 mt-2">
              <button onClick={() => addNodeToCanvas("trigger", "instagram_comment", "IG Comment")} className="text-[10px] text-left px-2 py-1.5 rounded bg-white border border-blue-500/20 text-purple-300 font-semibold hover:border-blue-500 transition-all flex items-center gap-1.5">
                <Instagram size={12} />
                <span>Instagram Comment</span>
              </button>
              <button onClick={() => addNodeToCanvas("trigger", "instagram_dm", "IG DM Received")} className="text-[10px] text-left px-2 py-1.5 rounded bg-white border border-blue-500/20 text-purple-300 font-semibold hover:border-blue-500 transition-all flex items-center gap-1.5">
                <MessageSquare size={12} />
                <span>Instagram DM</span>
              </button>
              <button onClick={() => addNodeToCanvas("trigger", "keyword", "Keyword DM Alert")} className="text-[10px] text-left px-2 py-1.5 rounded bg-white border border-blue-500/20 text-purple-300 font-semibold hover:border-blue-500 transition-all flex items-center gap-1.5">
                <Zap size={12} />
                <span>Keyword Trigger</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100/80"></div>

          <div>
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Actions</h4>
            <div className="flex flex-col gap-1.5 mt-2 max-h-[170px] overflow-y-auto pr-1">
              <button onClick={() => addNodeToCanvas("action", "send_dm", "Send DM Reply")} className="text-[10px] text-left px-2 py-1.5 rounded bg-white border border-indigo-500/20 text-indigo-300 font-semibold hover:border-indigo-500 transition-all flex items-center gap-1.5">
                <MessageSquare size={12} />
                <span>Send DM</span>
              </button>
              <button onClick={() => addNodeToCanvas("action", "send_whatsapp", "Send WhatsApp")} className="text-[10px] text-left px-2 py-1.5 rounded bg-white border border-indigo-500/20 text-indigo-300 font-semibold hover:border-indigo-500 transition-all flex items-center gap-1.5">
                <Phone size={12} />
                <span>Send WhatsApp</span>
              </button>
              <button onClick={() => addNodeToCanvas("action", "send_email", "Send Email")} className="text-[10px] text-left px-2 py-1.5 rounded bg-white border border-indigo-500/20 text-indigo-300 font-semibold hover:border-indigo-500 transition-all flex items-center gap-1.5">
                <Mail size={12} />
                <span>Send Email</span>
              </button>
              <button onClick={() => addNodeToCanvas("action", "ai_agent", "Run AI Qualifier")} className="text-[10px] text-left px-2 py-1.5 rounded bg-white border border-teal-500/20 text-fuchsia-300 font-semibold hover:border-teal-500 transition-all flex items-center gap-1.5">
                <Bot size={12} />
                <span>AI Agent Bot</span>
              </button>
              <button onClick={() => addNodeToCanvas("action", "wait", "Delay Timer")} className="text-[10px] text-left px-2 py-1.5 rounded bg-white border border-yellow-500/20 text-yellow-300 font-semibold hover:border-yellow-500 transition-all flex items-center gap-1.5">
                <Clock size={12} />
                <span>Wait delay</span>
              </button>
              <button onClick={() => addNodeToCanvas("action", "condition", "Condition Split")} className="text-[10px] text-left px-2 py-1.5 rounded bg-white border border-rose-500/20 text-rose-300 font-semibold hover:border-rose-500 transition-all flex items-center gap-1.5">
                <Sliders size={12} />
                <span>Condition</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_e, node) => setSelectedNode(node)}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#1f1f23" gap={16} />
            <Controls />
            <MiniMap style={{ background: "#0c0c0e", border: "1px solid #1f1f23" }} nodeColor={(n) => (n.type === "trigger" ? "#a855f7" : "#6366f1")} />
          </ReactFlow>
        </div>

        {/* Right properties configurator drawer */}
        {selectedNode && (
          <div className="w-80 border-l border-gray-200 bg-[#0c0c0e] p-6 flex flex-col justify-between shrink-0 h-full overflow-y-auto z-10">
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-[#E8E4D9] pb-3">
                <h3 className="font-bold text-white text-xs">Tweak Workflow Node</h3>
                <button onClick={() => setSelectedNode(null)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Node Title</label>
                  <input
                    type="text"
                    className="w-full mt-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-white focus:outline-none"
                    value={nodeData?.label || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNodes((nds) => nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...(n.data as any), label: val } } : n)));
                      setSelectedNode((prev) => (prev ? { ...prev, data: { ...(prev.data as any), label: val } } : null));
                    }}
                  />
                </div>

                {nodeData?.type === "instagram_comment" && (
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Comment Keyword Trigger</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-white focus:outline-none"
                      value={nodeData?.config?.keyword || ""}
                      onChange={(e) => updateNodeConfig({ keyword: e.target.value })}
                      placeholder="e.g. RUSH"
                    />
                  </div>
                )}

                {nodeData?.type === "send_dm" && (
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Outbound DM Message</label>
                    <textarea
                      rows={4}
                      className="w-full mt-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-white focus:outline-none"
                      value={nodeData?.config?.message || ""}
                      onChange={(e) => updateNodeConfig({ message: e.target.value })}
                      placeholder="Write qualifying welcome reply message..."
                    />
                  </div>
                )}

                {nodeData?.type === "wait" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Delay</label>
                      <input
                        type="number"
                        className="w-full mt-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-white focus:outline-none"
                        value={nodeData?.config?.duration || 15}
                        onChange={(e) => updateNodeConfig({ duration: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Unit</label>
                      <select
                        className="w-full mt-1.5 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-white focus:outline-none"
                        value={nodeData?.config?.unit || "minutes"}
                        onChange={(e) => updateNodeConfig({ unit: e.target.value })}
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                  </div>
                )}

                {nodeData?.type === "ai_agent" && (
                  <div>
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Model Agent Configuration</label>
                    <select
                      className="w-full mt-1.5 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-white focus:outline-none"
                      value={nodeData?.config?.agentId || "a1"}
                      onChange={(e) => updateNodeConfig({ agentId: e.target.value })}
                    >
                      {store.agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => deleteNode(selectedNode.id)}
              className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 size={12} />
              <span>Deregister Node</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 5.7 CRM KANBAN & TABLE GRID
function CrmView() {
  const store = useAppStore();
  const [layoutMode, setLayoutMode] = useState<"kanban" | "table">("kanban");
  const [search, setSearch] = useState("");
  const [activeLead, setActiveLead] = useState<Contact | null>(null);

  // New lead Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<Contact["stage"]>("New Lead");

  const filteredContacts = useMemo(() => {
    return store.contacts.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [store.contacts, search]);

  // Kanban Pipeline Stages
  const stages: Contact["stage"][] = ["New Lead", "Qualified", "Interested", "Booked", "Won"];

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    store.addContact({
      name,
      username,
      email,
      phone,
      stage,
      leadScore: Math.floor(Math.random() * 45) + 30,
      tags: ["Dashboard Input"],
      notes: "Lead registry manually created in CRM dashboard.",
      source: "Manual Registry",
    });
    setModalOpen(false);
    setName("");
    setUsername("");
    setEmail("");
    setPhone("");
    store.pushNotification("Lead Added", "Created CRM customer card successfully.", "success");
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Contacts CRM Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Qualify and follow up leads through Kanban stages.</p>
        </div>

        <div className="flex gap-2">
          {/* Layout toggle */}
          <div className="bg-white border border-gray-200 p-0.5 rounded-lg flex items-center">
            <button
              onClick={() => setLayoutMode("kanban")}
              className={`p-1.5 rounded-md transition-all ${layoutMode === "kanban" ? "bg-gray-100 text-white" : "text-gray-400 hover:text-zinc-350"}`}
              title="Kanban Board"
            >
              <Kanban size={14} />
            </button>
            <button
              onClick={() => setLayoutMode("table")}
              className={`p-1.5 rounded-md transition-all ${layoutMode === "table" ? "bg-gray-100 text-white" : "text-gray-400 hover:text-zinc-350"}`}
              title="Datatable List"
            >
              <Table size={14} />
            </button>
          </div>

          <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5">
            <Plus size={14} />
            <span>Add Lead Contact</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 bg-white/50 rounded-xl max-w-sm w-full mt-2 text-xs">
        <Search size={14} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search leads by name or @username..."
          className="bg-transparent border-0 outline-none w-full text-white placeholder-zinc-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {layoutMode === "kanban" ? (
        /* 5.7.1 CRM KANBAN BOARD */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start mt-4">
          {stages.map((stg) => {
            const stageLeads = filteredContacts.filter((c) => c.stage === stg);
            return (
              <div key={stg} className="p-3 bg-white/10 border border-gray-200/80 rounded-xl flex flex-col gap-3.5">
                {/* Column Title */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">{stg}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[10px] text-gray-500 font-bold border border-gray-200">{stageLeads.length}</span>
                </div>

                <div className="flex flex-col gap-3 min-h-[300px]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setActiveLead(lead)}
                      className="p-4 rounded-xl border border-gray-200 bg-[#0c0c0e] hover:border-gray-300 transition-all cursor-pointer shadow-sm group"
                    >
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{lead.name}</h4>
                      <p className="text-[9px] text-gray-400 font-mono mt-0.5">@{lead.username}</p>

                      <div className="flex justify-between items-center mt-4 text-[9px]">
                        <span className="text-gray-400 font-mono">{lead.source.substring(0, 15)}...</span>
                        <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${lead.leadScore > 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          lead.leadScore > 50 ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                            "bg-gray-100 text-gray-400 border border-gray-300"
                          }`}>{lead.leadScore} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 5.7.2 CRM TABLE LIST */
        <div className="border border-gray-200 rounded-xl overflow-hidden mt-4 bg-white/10 text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-[#0c0c0e] text-gray-500 font-semibold font-mono text-[10px] uppercase">
                <th className="p-4">Name</th>
                <th className="p-4">Instagram</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Stage</th>
                <th className="p-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setActiveLead(lead)}
                  className="border-b border-[#E8E4D9] hover:bg-white/25 transition-all cursor-pointer group"
                >
                  <td className="p-4 font-bold text-white group-hover:text-indigo-400 transition-colors">{lead.name}</td>
                  <td className="p-4 font-mono text-gray-500">@{lead.username}</td>
                  <td className="p-4 text-zinc-450">{lead.email}</td>
                  <td className="p-4 text-gray-400">{lead.phone}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 border border-indigo-400/20 text-indigo-400">{lead.stage}</span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-zinc-200">{lead.leadScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New lead Modal UI */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white text-sm">Create Lead Record</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Full Name</label>
                  <input type="text" required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-white focus:outline-none" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Instagram Username</label>
                  <input type="text" required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-white focus:outline-none" placeholder="e.g. johndoe_ig" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Email Address</label>
                  <input type="email" required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-white focus:outline-none" placeholder="john@doe.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Phone</label>
                  <input type="text" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-white focus:outline-none" placeholder="+1 555-1234" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Pipeline Stage</label>
                  <select className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-white focus:outline-none font-semibold" value={stage} onChange={(e) => setStage(e.target.value as Contact["stage"])}>
                    {stages.map((stg) => <option key={stg} value={stg}>{stg}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-4">
                  Create Lead Card
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CRM Contact Details Drawer */}
      <AnimatePresence>
        {activeLead && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="fixed inset-0 bg-black/55 backdrop-blur-xs" onClick={() => setActiveLead(null)}></div>
            <motion.div
              initial={{ x: 380 }}
              animate={{ x: 0 }}
              exit={{ x: 380 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-96 bg-[#0c0c0e] border-l border-gray-200 p-6 flex flex-col justify-between h-full overflow-y-auto"
            >
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-md font-bold text-white">{activeLead.name}</h2>
                    <p className="text-[9px] text-zinc-550 font-mono mt-0.5">@{activeLead.username}</p>
                  </div>
                  <button onClick={() => setActiveLead(null)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-white">
                    <X size={15} />
                  </button>
                </div>

                <div className="h-px bg-white"></div>

                <div className="flex flex-col gap-4 text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 font-mono tracking-widest">Pipeline Stage</span>
                    <select
                      className="w-full mt-1.5 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-white"
                      value={activeLead.stage}
                      onChange={(e) => {
                        const newStage = e.target.value as Contact["stage"];
                        store.updateContactStage(activeLead.id, newStage);
                        setActiveLead((prev) => prev ? { ...prev, stage: newStage } : null);
                      }}
                    >
                      {stages.map((stg) => <option key={stg} value={stg}>{stg}</option>)}
                    </select>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 font-mono tracking-widest">Lead Tags</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activeLead.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-[10px]">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 font-mono tracking-widest">Notes</span>
                    <textarea
                      rows={3}
                      className="w-full mt-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-white focus:outline-none"
                      value={activeLead.notes}
                      onChange={(e) => {
                        const noteText = e.target.value;
                        store.updateContactDetails(activeLead.id, { notes: noteText });
                        setActiveLead((prev) => prev ? { ...prev, notes: noteText } : null);
                      }}
                    />
                  </div>

                  {/* Conversation History Pane */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] uppercase font-bold text-gray-400 font-mono tracking-widest">Conversation History</span>
                    <div className="mt-2 flex flex-col gap-3 max-h-[200px] overflow-y-auto bg-gray-50/80 border border-[#E8E4D9] rounded-xl p-3.5 pr-2">
                      {activeLead.chatHistory.map((chat, idx) => (
                        <div key={idx} className={`flex flex-col max-w-[85%] ${chat.sender === "user" ? "self-end items-end" : "self-start items-start"}`}>
                          <div className={`p-2.5 rounded-xl text-[10px] leading-relaxed ${chat.sender === "user" ? "bg-indigo-600 text-white rounded-tr-none" :
                            chat.sender === "bot" ? "bg-white border border-gray-200 text-zinc-200 rounded-tl-none font-serif" :
                              "bg-gray-50 text-gray-400 font-mono text-[9px] border border-[#E8E4D9]"
                            }`}>
                            {chat.text}
                          </div>
                          <span className="text-[8px] text-zinc-600 font-mono mt-1">{chat.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { store.deleteContact(activeLead.id); setActiveLead(null); }}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 size={12} />
                <span>Delete CRM Record</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 5.8 AI AGENTS WITH PHONE CHAT PREVIEW
function AgentsView() {
  const store = useAppStore();
  const [selectedId, setSelectedId] = useState(store.agents[0]?.id || "");
  const [modalOpen, setModalOpen] = useState(false);

  // New Agent variables
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [goals, setGoals] = useState("");
  const [language, setLanguage] = useState("English");

  // Phone Chat Simulator Variables
  const [simMessages, setSimMessages] = useState<Array<{ sender: "user" | "bot" | "system"; text: string }>>([
    { sender: "system", text: "Phone Chat Simulator Online." },
    { sender: "bot", text: "Hey! 🚀 Set2Send Qualify Bot here. How can I help you scale today?" },
  ]);
  const [simInput, setSimInput] = useState("");
  const [typing, setTyping] = useState(false);

  const activeAgent = useMemo(() => {
    return store.agents.find((a) => a.id === selectedId) || store.agents[0];
  }, [store.agents, selectedId]);

  // Restart chat on agent swap
  useEffect(() => {
    if (activeAgent) {
      setSimMessages([
        { sender: "system", text: `Chat Simulator connected to: ${activeAgent.name}` },
        {
          sender: "bot", text: activeAgent.name === "Set2Send Qualify Bot"
            ? "Hey! 🚀 Set2Send Qualify Bot here. How can I help you scale today?"
            : "Hello! Professional close Closer Closer Closer Bot ready. Looking to book a consultation slot?"
        },
      ]);
    }
  }, [selectedId, activeAgent]);

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    store.addAgent({
      name,
      prompt,
      knowledgeBase: ["brand_basics.pdf"],
      personality: 50,
      creativity: 60,
      goals,
      language,
    });
    setModalOpen(false);
    setName("");
    setPrompt("");
    setGoals("");
    store.pushNotification("AI Agent Deployed", "Trained prompt model successfully.", "success");
  };

  const handleSimSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simInput.trim() || !activeAgent) return;

    const query = simInput;
    setSimMessages((prev) => [...prev, { sender: "user", text: query }]);
    setSimInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      let reply = "";
      const queryLower = query.toLowerCase();

      // Simple keyword simulated replies based on prompt guidelines
      if (activeAgent.name === "Set2Send Qualify Bot") {
        if (queryLower.includes("email") || queryLower.includes("@")) {
          reply = "Got it! Email noted. Which social channel do you manage the most? Instagram or TikTok?";
        } else if (queryLower.includes("price") || queryLower.includes("cost")) {
          reply = "We start free! Upgrades start at just $29/mo for coaching tools. What's your business niche?";
        } else {
          reply = "Awesome. Can you share your business email so we can send the templates over?";
        }
      } else {
        // Sales Closer Bot
        if (queryLower.includes("book") || queryLower.includes("call") || queryLower.includes("meet")) {
          reply = "Sure! Here is my live booking slots link: https://set2send.io/meet-closer. Confirm a slot!";
        } else {
          reply = "I recommend our Agency package. It supports multiple client pages and custom webhooks. Would you like to schedule a strategy call?";
        }
      }

      // Check tone adjustments
      if (activeAgent.personality > 70) {
        reply = "Hey! 🤩 " + reply + " ⚡✨";
      }

      // Translate simulation
      if (activeAgent.language === "Spanish") {
        reply = "¡Hola! " + (queryLower.includes("@") ? "Email registrado. ¿Qué canal usas más?" : "Ofrecemos automatización avanzada. ¿Quieres agendar una llamada?");
      } else if (activeAgent.language === "French") {
        reply = "Bonjour! " + (queryLower.includes("@") ? "Email enregistré. Quel canal utilisez-vous?" : "Nous proposons une automatisation avancée. Voulez-vous réserver un appel?");
      }

      setSimMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">AI Sales Agent Studio</h1>
          <p className="text-xs text-gray-500 mt-0.5">Tune agent prompts and test responses immediately inside the phone mockup simulator.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5">
          <Plus size={14} />
          <span>New AI Agent</span>
        </button>
      </div>

      {activeAgent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 items-start">
          {/* Left panel: Select Agent & Configurator parameters */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="p-4 bg-white/10 border border-gray-200/80 rounded-xl flex gap-3 overflow-x-auto">
              {store.agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedId(agent.id)}
                  className={`px-4 py-3 rounded-lg border text-left shrink-0 transition-all ${selectedId === agent.id ? "border-blue-500 bg-blue-500/5" : "border-gray-200 bg-white/10"
                    }`}
                >
                  <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
                  <p className="text-[9px] text-gray-400 font-mono mt-1 font-semibold">{agent.language} • {agent.knowledgeBase.length} docs</p>
                </button>
              ))}
            </div>

            {/* Configurator fields */}
            <div className="p-6 rounded-xl border border-gray-200 bg-white/20 flex flex-col gap-5 text-xs">
              <div className="flex justify-between items-center border-b border-[#E8E4D9] pb-3">
                <h3 className="font-bold text-white text-xs">{activeAgent.name} Tuning</h3>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] font-mono border border-blue-500/20">Active</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">System Prompts instructions</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-zinc-350 focus:outline-none"
                  value={activeAgent.prompt}
                  onChange={(e) => store.updateAgent(activeAgent.id, { prompt: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Target goals</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-white focus:outline-none font-semibold"
                  value={activeAgent.goals}
                  onChange={(e) => store.updateAgent(activeAgent.id, { goals: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Creative Temperature</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full accent-indigo-500"
                    value={activeAgent.creativity}
                    onChange={(e) => store.updateAgent(activeAgent.id, { creativity: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Tone Scale</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full accent-indigo-500"
                    value={activeAgent.personality}
                    onChange={(e) => store.updateAgent(activeAgent.id, { personality: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                    <span>Professional</span>
                    <span>Playful</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Language</label>
                  <select
                    className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-white font-semibold focus:outline-none"
                    value={activeAgent.language}
                    onChange={(e) => store.updateAgent(activeAgent.id, { language: e.target.value })}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Phone Chat simulator mockup */}
          <div className="flex justify-center">
            <div className="w-80 h-[480px] bg-gray-50 border-4 border-gray-200 rounded-[32px] overflow-hidden flex flex-col justify-between shadow-2xl relative">
              {/* Phone speaker notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-850 rounded-full z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>

              {/* Chat simulator header */}
              <div className="bg-[#0c0c0e] border-b border-[#E8E4D9] pt-7 pb-3 px-4 text-center flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-400/25 flex items-center justify-center text-indigo-400">
                  <Bot size={16} />
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5">{activeAgent.name}</h4>
                <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Online simulator</span>
              </div>

              {/* Chat message bubbles scroll window */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-gray-50 font-mono text-[9px] pr-2">
                {simMessages.map((msg, i) => (
                  <div key={i} className={`flex max-w-[85%] ${msg.sender === "user" ? "self-end" : msg.sender === "bot" ? "self-start" : "self-center text-center"}`}>
                    <div className={`p-2.5 rounded-xl leading-relaxed ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-none" :
                      msg.sender === "bot" ? "bg-white border border-zinc-850 text-zinc-200 rounded-tl-none font-serif text-[10px]" :
                        "bg-white/40 text-gray-400 border border-[#E8E4D9] text-[8px]"
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="self-start bg-white border border-zinc-850 text-gray-500 p-2 rounded-xl text-[10px] rounded-tl-none animate-pulse">Typing...</div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSimSend} className="p-3 border-t border-[#E8E4D9] bg-[#0c0c0e] flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a qualify question..."
                  className="flex-1 px-3 py-1.5 bg-gray-50 border border-zinc-850 rounded-lg text-[10px] text-white focus:outline-none"
                  value={simInput}
                  onChange={(e) => setSimInput(e.target.value)}
                />
                <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                  <Send size={12} />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-gray-400">No AI Agents active.</div>
      )}

      {/* New agent modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white text-sm">Deploy New Agent</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateAgent} className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Agent Name</label>
                  <input type="text" required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-white focus:outline-none" placeholder="e.g. Qualified Booker" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Instructions prompt</label>
                  <textarea rows={4} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-white focus:outline-none" placeholder="You are close closers qualifier bot..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Trained goals</label>
                  <input type="text" required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-white focus:outline-none" placeholder="Collect target niche and email" value={goals} onChange={(e) => setGoals(e.target.value)} />
                </div>
                <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-4">
                  Deploy AI Model
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 5.9 REVENUE ATTRIBUTION & SOURCES
function AnalyticsView() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-white">Revenue Attribution Dashboard</h1>
        <p className="text-xs text-gray-500 mt-0.5">Track Stripe attributed checkout values back to social entrypoints.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attribution Funnel */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-gray-200 bg-white/20">
          <h3 className="font-bold text-white text-xs">Attributed Pipeline Funnel</h3>
          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">Conversion drop-off telemetry</p>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center text-[10px] mb-1 font-semibold font-mono">
                <span className="text-gray-500">Total comments qualified</span>
                <span className="text-white">5,000 comment triggers (100%)</span>
              </div>
              <div className="h-6 w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative flex items-center px-3">
                <div className="h-full bg-indigo-500/20 absolute left-0 top-0 w-full"></div>
                <span className="text-[9px] font-bold text-indigo-400 relative z-10 font-mono">100% Volume</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] mb-1 font-semibold font-mono">
                <span className="text-gray-500">AI Qualification chats</span>
                <span className="text-white">3,800 active chats (76%)</span>
              </div>
              <div className="h-6 w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative flex items-center px-3">
                <div className="h-full bg-blue-500/20 absolute left-0 top-0 w-[76%]"></div>
                <span className="text-[9px] font-bold text-blue-400 relative z-10 font-mono">76% Conversion</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] mb-1 font-semibold font-mono">
                <span className="text-gray-500">Checkout slot redirects</span>
                <span className="text-white">1,520 clicks (30%)</span>
              </div>
              <div className="h-6 w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative flex items-center px-3">
                <div className="h-full bg-blue-500/20 absolute left-0 top-0 w-[30%]"></div>
                <span className="text-[9px] font-bold text-blue-400 relative z-10 font-mono">40% drop conversion</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] mb-1 font-semibold font-mono">
                <span className="text-gray-500">Paid purchases (Stripe checkouts)</span>
                <span className="text-white">600 purchases (12%)</span>
              </div>
              <div className="h-6 w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative flex items-center px-3">
                <div className="h-full bg-emerald-500/20 absolute left-0 top-0 w-[12%]"></div>
                <span className="text-[9px] font-bold text-emerald-400 relative z-10 font-mono">12% Net Conversion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Entry channels */}
        <div className="p-6 rounded-xl border border-gray-200 bg-white/20 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-xs">Top Attributed Lead Sources</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Entrypoints driving won sales</p>

            <div className="mt-5 flex flex-col gap-3.5 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-[#E8E4D9] pb-2">
                <div className="flex items-center gap-2">
                  <Instagram size={14} className="text-blue-400" />
                  <span className="text-gray-600 font-semibold">Comment auto DMs</span>
                </div>
                <span className="text-white font-bold">72%</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#E8E4D9] pb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-indigo-400" />
                  <span className="text-gray-600 font-semibold">Direct IG DM flow</span>
                </div>
                <span className="text-white font-bold">14%</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#E8E4D9] pb-2">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-400" />
                  <span className="text-gray-600 font-semibold">WhatsApp follow-ups</span>
                </div>
                <span className="text-white font-bold">10%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Webhook size={14} className="text-rose-400" />
                  <span className="text-gray-600 font-semibold">Inbound Webhooks</span>
                </div>
                <span className="text-white font-bold">4%</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-3 rounded-lg bg-gray-50/70 border border-zinc-850 text-[10px] text-zinc-550 leading-relaxed font-mono">
            Optimized Advice: Custom Instagram comment auto DMs convert at <span className="text-indigo-400 font-bold">4.2x higher</span> ratios than standard link-in-bio widgets.
          </div>
        </div>
      </div>
    </div>
  );
}

// 5.10 GLOBAL SETTINGS & API KEYS
function SettingsView() {
  const store = useAppStore();
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleGenKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc) return;
    store.createApiKey(desc);
    setDesc("");
    store.pushNotification("Key Generated", "Created security token successfully.", "success");
  };

  const handleTeamInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    store.addTeamMember(name, email, "Manager");
    setName("");
    setEmail("");
    store.pushNotification("Invite Sent", `Dispatched invite to ${email}`, "success");
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-white">Global Workspace Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage API keys, integrations connect toggles, and subscription billing details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* API Keys */}
          <div className="p-6 rounded-xl border border-gray-200 bg-white/20">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Key size={14} className="text-indigo-400" />
              <span>Developer API Keys</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Keys to route webhook events from external platforms.</p>

            <form onSubmit={handleGenKey} className="flex gap-2 mt-4 items-center">
              <input
                type="text"
                required
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-white focus:outline-none"
                placeholder="Description Name (e.g. HubSpot endpoint)"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <button type="submit" className="px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 text-xs text-white rounded-lg transition-all">
                Generate Key
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-2">
              {store.apiKeys.map((key) => (
                <div key={key.id} className="p-3 bg-gray-50 border border-[#E8E4D9] rounded-lg flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <h5 className="font-bold text-white truncate">{key.name}</h5>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5 select-all truncate">{key.key}</p>
                    <span className="text-[8px] text-zinc-600 font-mono mt-1 block">Created on {key.created}</span>
                  </div>
                  <button onClick={() => { store.deleteApiKey(key.id); store.pushNotification("Key Revoked", "Revoked security key access.", "warning"); }} className="text-gray-400 hover:text-rose-400 p-1.5 rounded hover:bg-white transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Invited Operators */}
          <div className="p-6 rounded-xl border border-gray-200 bg-white/20">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Users size={14} className="text-indigo-400" />
              <span>Teammate Operators</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Invite managers to build qualifying templates.</p>

            <form onSubmit={handleTeamInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 items-center">
              <input type="text" required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-white focus:outline-none" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-white focus:outline-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-lg transition-all shadow">
                Invite
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-2">
              {store.team.map((t) => (
                <div key={t.email} className="p-3 bg-gray-50 border border-[#E8E4D9] rounded-lg flex items-center justify-between text-xs gap-3">
                  <div className="min-w-0">
                    <h5 className="font-bold text-white truncate">{t.name}</h5>
                    <p className="text-[10px] text-gray-400 truncate">{t.email}</p>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-bold font-mono mt-1 inline-block uppercase tracking-wider">{t.role}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[9px] text-zinc-550 font-mono">{t.joined}</span>
                    {t.role !== "Owner" && (
                      <button onClick={() => store.deleteTeamMember(t.email)} className="text-gray-400 hover:text-rose-400 p-1 rounded hover:bg-white">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right integrations panel */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-xl border border-gray-200 bg-white/20">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <LinkIcon size={14} className="text-indigo-400" />
              <span>SaaS Integrations</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Toggle social connections</p>

            <div className="mt-4 flex flex-col gap-3">
              <IntegrationItem title="Instagram Graph API" desc="Comment triggers and direct message automation rules." active={store.integrations.instagram} onToggle={() => store.toggleIntegration("instagram")} />
              <IntegrationItem title="WhatsApp API node" desc="Outbound campaigns over Meta business numbers." active={store.integrations.whatsapp} onToggle={() => store.toggleIntegration("whatsapp")} />
              <IntegrationItem title="HubSpot Webhooks" desc="Forward qualified leads directly to your workspace." active={store.integrations.webhook} onToggle={() => store.toggleIntegration("webhook")} />
            </div>
          </div>

          {/* Billing subscription card */}
          <div className="p-5 bg-indigo-500/5 border border-indigo-500/30 rounded-xl flex flex-col gap-3.5">
            <div>
              <span className="text-[8px] font-bold bg-indigo-500/20 border border-indigo-400/20 text-indigo-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Active Subscription</span>
              <h4 className="text-white font-bold text-xs mt-3">Pro Creator Plan ($59/mo)</h4>
              <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Attributed leads: 1,520 / 8,000 monthly automated messages. Renews: June 20, 2026.</p>
            </div>
            <button onClick={() => { store.pushNotification("Stripe portal opened", "Redirecting to subscription panel.", "info"); }} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1">
              <span>Manage Stripe Billing</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationItem({
  title,
  desc,
  active,
  onToggle,
}: {
  title: string;
  desc: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="p-3 bg-gray-50 border border-[#E8E4D9] rounded-lg flex items-start justify-between text-xs gap-3">
      <div>
        <h5 className="font-bold text-white">{title}</h5>
        <p className="text-[9px] text-gray-400 mt-1 leading-normal">{desc}</p>
      </div>
      <button onClick={onToggle} className={`px-2 py-1 text-[9px] font-bold border rounded transition-all shrink-0 ${active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" : "bg-white text-gray-500 border-gray-200"
        }`}>
        {active ? "Connected" : "Connect"}
      </button>
    </div>
  );
}
