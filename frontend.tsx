"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  Zap,
  Settings,
  Layers,
  Users,
  Send,
  Activity,
  FileText,
  Search,
  Plus,
  Trash2,
  Play,
  Save,
  Share2,
  X,
  CheckCircle,
  AlertCircle,
  Filter,
  TrendingUp,
  Coins,
  MessageSquare,
  Mail,
  Phone,
  ArrowRight,
  Lock,
  User,
  Copy,
  PlusCircle,
  DownloadCloud,
  Check,
  ExternalLink,
  Clock,
  Sliders,
  HelpCircle,
  LogOut,
  Menu,
  Webhook,
  ChevronRight,
  ChevronDown,
  Database,
  Key,
  Cpu,
  Eye,
  Link as LinkIcon,
  Video,
  ListFilter,
  Kanban,
  Table,
} from "lucide-react";
import { create } from "zustand";

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
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
      { sender: "bot", text: "Awesome! ReplyRush handles multi-account workspaces. Let's schedule a call?", timestamp: "10:06 AM" },
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
  { id: "b1", name: "ReplyRush Launch Promo", channel: "Instagram", targetAudience: "All Warm Leads (Score > 60)", message: "Hey {{username}}! Ready to automate comments? Reply 'RUSH' to grab our early bird discounts! 🚀", status: "Sent", scheduledTime: "2026-06-05 10:00", sentCount: 2840, openRate: 96.1, clickRate: 52.4 },
  { id: "b2", name: "WhatsApp Lead Follow-up", channel: "WhatsApp", targetAudience: "New Lead Segment", message: "Hi {{name}}, just following up on your templates check. Let me know if you need help starting!", status: "Scheduled", scheduledTime: "2026-06-12 09:00", sentCount: 0, openRate: 0, clickRate: 0 },
];

const initialAgents: AIAgent[] = [
  { id: "a1", name: "ReplyRush Qualify Bot", prompt: "You are an automated lead qualifier for ReplyRush AI. Your goal is to cheerfully collect the user's business email and main automated channel choice. Keep replies under 120 characters.", knowledgeBase: ["pricing_rules.txt", "webhook_guide.pdf"], personality: 75, creativity: 55, goals: "Collect email and channel choice", language: "English" },
  { id: "a2", name: "Sales Closer Bot", prompt: "You are a professional sales consultant. Answer template questions and offer calendar scheduling links for high value agency packages.", knowledgeBase: ["agency_packages.json"], personality: 40, creativity: 30, goals: "Drive Strategy strategies Strategy calls calls", language: "English" },
];

const initialLogs: ActivityLog[] = [
  { id: "l1", timestamp: "12:05:12 AM", text: "Instagram Comment Keyword 'RUSH' triggered for @alexrivers", type: "info" },
  { id: "l2", timestamp: "12:05:14 AM", text: "AI Agent 'ReplyRush Qualify Bot' sent answer to @alexrivers", type: "ai" },
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
    { name: "Creator Owner", email: "owner@replyrush.ai", role: "Owner", joined: "Jan 2026" },
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
        { id: "n5", type: "action", position: { x: 1250, y: 150 }, data: { label: "Send WhatsApp Follow-up", type: "send_whatsapp", icon: "Phone", config: { message: "Congrats! Here is your access link: https://replyrush.ai/redeem" } } },
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
        ? "border-violet-500 shadow-violet-500/20 bg-zinc-900"
        : "border-purple-500/50 hover:border-purple-400 bg-zinc-900/90"
        }`}
    >
      <div className="absolute -top-3 left-3 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-purple-600 text-white rounded-full border border-purple-400 flex items-center gap-1 shadow-md">
        <Zap size={9} className="fill-white" />
        Trigger
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
          <Instagram size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white truncate">{data.label}</h4>
          <p className="text-[10px] text-zinc-400 truncate">{getSub()}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-purple-400" />
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
        return <Bot size={18} className="text-fuchsia-400" />;
      case "webhook":
        return <Webhook size={18} className="text-blue-400" />;
      default:
        return <Sparkles size={18} className="text-indigo-400" />;
    }
  };

  const getBorderColor = () => {
    switch (data.type) {
      case "ai_agent":
        return selected ? "border-fuchsia-500 shadow-fuchsia-500/20" : "border-fuchsia-500/40 hover:border-fuchsia-400";
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
        return "bg-fuchsia-600 border-fuchsia-400";
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
      className={`relative px-4 py-3.5 rounded-xl border-2 shadow-2xl w-60 text-left transition-all duration-300 bg-zinc-900 ${getBorderColor()}`}
    >
      <div className={`absolute -top-3 left-3 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-white rounded-full border flex items-center gap-1 shadow-md ${getBadgeColor()}`}>
        <Sparkles size={9} className="fill-white" />
        {data.type === "ai_agent" ? "AI Agent" : data.type === "condition" ? "Condition" : "Action"}
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div className="p-2 rounded-lg bg-zinc-800/80">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white truncate">{data.label}</h4>
          <p className="text-[10px] text-zinc-400 truncate font-mono">{getDescription()}</p>
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#030303] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-indigo-500 animate-spin"></div>
          <p className="text-xs text-zinc-500 font-mono tracking-widest animate-pulse">REPLYRUSH AI</p>
        </div>
      </div>
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
    <div className={`flex flex-col min-h-screen antialiased font-sans transition-colors duration-300 ${isAuthOrLanding ? "bg-[#09090b] text-zinc-100" : "bg-[#030303] text-zinc-100"
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
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/95 shadow-2xl flex gap-3 pointer-events-auto items-start"
            >
              <div className="p-1 rounded bg-indigo-500/10 text-indigo-400 mt-0.5">
                <Sparkles size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-semibold text-white">{notif.title}</h5>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{notif.message}</p>
              </div>
              <button
                onClick={() => store.dismissNotification(notif.id)}
                className="text-zinc-500 hover:text-zinc-350 p-0.5 hover:bg-zinc-855 rounded transition-colors"
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
              className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                <Search className="text-zinc-400" size={20} />
                <input
                  type="text"
                  placeholder="Search ReplyRush pages & actions..."
                  className="flex-1 bg-transparent border-0 outline-none text-white placeholder-zinc-500 text-sm"
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  autoFocus
                />
                <kbd className="px-2 py-0.5 rounded bg-zinc-805 text-[10px] text-zinc-400 border border-zinc-700 font-mono">ESC</kbd>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredCommandItems.length === 0 ? (
                  <div className="p-4 text-center text-zinc-500 text-sm">No matches found.</div>
                ) : (
                  filteredCommandItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action();
                        setCommandOpen(false);
                        setCommandQuery("");
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-zinc-800 flex items-center justify-between text-xs text-zinc-300 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] uppercase font-mono text-purple-400 font-bold border border-zinc-700">{item.category}</span>
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
          <aside className="w-64 border-r border-zinc-800 bg-[#0c0c0e] flex flex-col justify-between shrink-0 hidden md:flex">
            <div className="flex flex-col">
              {/* Brand Header */}
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/20">
                <button onClick={() => store.navigate("landing")} className="flex items-center gap-2 text-left group">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-700 transition-all">
                    <Zap size={16} className="fill-white text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-white group-hover:text-indigo-400 transition-colors">ReplyRush AI</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">Telemetry console</p>
                  </div>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-4 flex flex-col gap-1">
                <p className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mb-2 px-3 font-mono">Workspace</p>
                <SidebarLink view="dashboard" label="Dashboard" icon={<Activity size={15} />} active={store.currentView === "dashboard"} onClick={() => store.navigate("dashboard")} />
                <SidebarLink view="builder" label="Flow Builder" icon={<Layers size={15} />} active={store.currentView === "builder"} onClick={() => store.navigate("builder")} />
                <SidebarLink view="crm" label="CRM Kanban Grid" icon={<Kanban size={15} />} active={store.currentView === "crm"} onClick={() => store.navigate("crm")} />

                <p className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mt-5 mb-2 px-3 font-mono">AI Studio</p>
                <SidebarLink view="agents" label="AI Agents Config" icon={<Bot size={15} />} active={store.currentView === "agents"} onClick={() => store.navigate("agents")} />
                <SidebarLink view="analytics" label="Revenue Stats" icon={<TrendingUp size={15} />} active={store.currentView === "analytics"} onClick={() => store.navigate("analytics")} />

                <p className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mt-5 mb-2 px-3 font-mono">Management</p>
                <SidebarLink view="settings" label="Settings & Keys" icon={<Settings size={15} />} active={store.currentView === "settings"} onClick={() => store.navigate("settings")} />
              </nav>
            </div>

            {/* Profile Footer */}
            <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-950/45">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-400/25 flex items-center justify-center text-xs font-bold text-indigo-400">RR</div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">Pro Creator</h4>
                  <p className="text-[9px] text-zinc-550 truncate font-mono">Active Plan</p>
                </div>
              </div>
              <button
                onClick={() => {
                  store.navigate("landing");
                  store.pushNotification("Logged Out", "Returned to main website.", "info");
                }}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Log Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </aside>

          {/* Core Content Shell */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header Toolbar */}
            <header className="h-16 border-b border-zinc-800 px-6 bg-[#030303]/80 backdrop-blur flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="md:hidden">
                  <MobileMenu />
                </div>
                <button
                  onClick={() => setCommandOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-805 hover:border-zinc-700 bg-zinc-900/60 text-xs text-zinc-400 w-52 text-left transition-all font-mono"
                >
                  <Search size={14} />
                  <span>Search... (Ctrl K)</span>
                </button>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-mono text-[9px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Instagram API LIVE</span>
                </div>
                <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>
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
            <main className="flex-1 overflow-y-auto bg-[#040406]">
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
        ? "bg-zinc-800 text-white border border-zinc-750 shadow"
        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
        }`}
    >
      <span className={active ? "text-indigo-400" : "text-zinc-400"}>{icon}</span>
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
        className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400"
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
              className="relative w-64 bg-zinc-955 border-r border-zinc-800 p-6 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">ReplyRush AI</h3>
                  <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
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
              <button onClick={() => { store.navigate("landing"); setIsOpen(false); }} className="text-xs text-rose-400 font-semibold flex items-center gap-1 border-t border-zinc-800 pt-4 mt-auto">
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

const conversationPairs = [
  {
    bot: {
      text: "Hey 👋 Here's that ebook you requested!",
      button: "Grab Your Guide",
    },
    user: {
      text: "Do you have a website where I can see more?",
    },
  },
  {
    bot: {
      text: "Absolutely! Here's our website.",
    },
    user: {
      text: "Can I see pricing plans?",
    },
  },

];

// ==========================================
// 5. VIEW DEFINITIONS
// ==========================================

// 5.1 LANDING VIEW
function LandingView() {
  const store = useAppStore();
  const [activeStep, setActiveStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Interactive Hero Chat Simulator State
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [showBot, setShowBot] = useState(false);
  const [showUser, setShowUser] = useState(false);

  // Interactive Feature Slider Section
  const [activeFeatureSlide, setActiveFeatureSlide] = useState(0);
  const [phoneMessageStep, setPhoneMessageStep] = useState(0);

  const featureSlides = [
    {
      title: "Turn comments into conversations that sell",
      desc: '"How much is this?" or "Do you ship to Mars?" Instant reply. Boom — wallets open, money lands, and you didn\'t even blink.',
      bg: "bg-[#f4f210]", // yellow background
      textColor: "text-black",
      pillBg: "bg-black hover:bg-zinc-900 text-white",
      indicatorColor: "border-black",
      phoneBg: "bg-black",
      chatHistory: [
        { sender: "user", text: "Hey Eve!", timestamp: "Just now" },
        { sender: "bot", text: "Hey Eve! Ready to move your muscles?", button: "Can't wait", timestamp: "Just now" },
        { sender: "bot", text: "Oops, seems like you don...", timestamp: "Just now" },
      ],
      badge: "Convert audience into subscribers 2/2"
    },
    {
      title: "Get more out of every story post",
      desc: "Automatically DM followers who reply to your stories. Turn views into qualified leads, checkouts, or booked calls in seconds.",
      bg: "bg-[#0ce3e9]", // cyan background
      textColor: "text-black",
      pillBg: "bg-black hover:bg-zinc-900 text-white",
      indicatorColor: "border-black",
      phoneBg: "bg-black",
      chatHistory: [
        { sender: "user", text: "Love this outfit! 🔥", timestamp: "Just now" },
        { sender: "bot", text: "Thank you! Click below to shop the collection with 15% off.", button: "Shop Collection", timestamp: "Just now" },
        { sender: "bot", text: "Use code STYLE15 at checkout.", timestamp: "Just now" },
      ],
      badge: "Turn story replies into customers 1/2"
    },
    {
      title: "Re-engage leads who slip away",
      desc: "Follow up automatically with leads who didn't finish checkout or opt-in. Recover lost sales without sending a manual text.",
      bg: "bg-[#a855f7]", // purple background
      textColor: "text-white",
      pillBg: "bg-white hover:bg-zinc-100 text-black",
      indicatorColor: "border-white",
      phoneBg: "bg-zinc-950",
      chatHistory: [
        { sender: "bot", text: "Did you forget your Ebook guide? 📚", timestamp: "10m ago" },
        { sender: "user", text: "Oh, yes! I got distracted.", timestamp: "Just now" },
        { sender: "bot", text: "No worries! Click here to download it instantly.", button: "Download Guide", timestamp: "Just now" },
      ],
      badge: "Recover abandoned leads 1/2"
    }
  ];

  // Auto-animate chat bubbles inside slider phone frame
  useEffect(() => {
    setPhoneMessageStep(0);
    const t1 = setTimeout(() => setPhoneMessageStep(1), 1200);
    const t2 = setTimeout(() => setPhoneMessageStep(2), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeFeatureSlide]);

  // Auto rotate slides every 8 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveFeatureSlide((prev) => (prev + 1) % featureSlides.length);
    }, 8000);
    return () => clearInterval(slideInterval);
  }, []);


  // Auto-simulation Loop and store sync logic
  useEffect(() => {
    let userTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;
    let nextTimer: NodeJS.Timeout;

    const currentPair = conversationPairs[activePairIndex];
    const tempId = "lead-interactive";

    // 1. Immediately show the bot bubble
    setShowBot(true);

    // Sync to Zustand store: Append bot message
    useAppStore.setState((state) => {
      const contact = state.contacts.find((c) => c.id === tempId);
      const newBotMsg = {
        sender: "bot" as const,
        text: currentPair.bot.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      if (activePairIndex === 0 || !contact) {
        // Reset/Create contact on first pair
        const newContact: Contact = {
          id: tempId,
          name: "Sarah Jenkins (Interactive Lead)",
          username: "sarah_j_interactive",
          email: "sarah@jenkins.dev",
          phone: "+1 (555) 014-9821",
          stage: "New Lead",
          leadScore: 65,
          tags: ["Landing Chat", "Ebook Lead"],
          notes: "User interacted with the Hero Chat Simulator on the Landing Page.",
          source: "Hero Interactive Chat",
          lastActive: "Just now",
          chatHistory: [newBotMsg],
        };
        return {
          contacts: [newContact, ...state.contacts.filter((c) => c.id !== tempId)],
        };
      } else {
        // Append bot message to existing contact
        return {
          contacts: state.contacts.map((c) =>
            c.id === tempId
              ? {
                ...c,
                chatHistory: [...c.chatHistory, newBotMsg],
                lastActive: "Just now",
              }
              : c
          ),
        };
      }
    });

    useAppStore.getState().addLog(`Hero chat: Bot sent "${currentPair.bot.text}"`, "ai");

    // 2. After 1s, show the user bubble
    userTimer = setTimeout(() => {
      setShowUser(true);

      // Sync to Zustand store: Append user message
      useAppStore.setState((state) => {
        const contact = state.contacts.find((c) => c.id === tempId);
        if (contact) {
          const newUserMsg = {
            sender: "user" as const,
            text: currentPair.user.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          return {
            contacts: state.contacts.map((c) =>
              c.id === tempId
                ? {
                  ...c,
                  chatHistory: [...c.chatHistory, newUserMsg],
                  leadScore: Math.min(100, c.leadScore + 10),
                  stage: activePairIndex === 2 ? ("Qualified" as const) : c.stage,
                  lastActive: "Just now",
                }
                : c
            ),
          };
        }
        return {};
      });

      useAppStore.getState().addLog(`Hero chat: User replied "${currentPair.user.text}"`, "info");
    }, 1000);

    // 3. Hide both after 3s (so they are visible together for 2s)
    hideTimer = setTimeout(() => {
      setShowBot(false);
      setShowUser(false);

      // 4. Wait for exit animation (300ms) + 500ms empty area = 800ms, then trigger next index
      nextTimer = setTimeout(() => {
        setActivePairIndex((prev) => (prev + 1) % conversationPairs.length);
      }, 800);
    }, 3000);

    return () => {
      clearTimeout(userTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [activePairIndex, conversationPairs]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stepsInfo = [
    { title: "Step 1: Connect Instagram", desc: "One-click connect your creators page using secure official Meta graph keys. Ready in 30 seconds.", stat: "100% Meta Compliant" },
    { title: "Step 2: Build Automation", desc: "Build visual flow charts connecting trigger keywords to action steps. Standard nodes for DMs, split pings, and email captures.", stat: "Drag & Drop Canvas" },
    { title: "Step 3: Capture Leads", desc: "ReplyRush qualifies commented triggers, logs contact details directly to database, and rates customer lead scores.", stat: "+120% Leads Volume" },
    { title: "Step 4: Convert Leads", desc: "Trained AI agents guide conversation points, qualify target business budgets, and schedule strategy calls.", stat: "24/7 Autopilot Closers" },
    { title: "Step 5: Scale Revenue", desc: "Link custom checkouts to checkout redirects, tracking attribution metrics inside visual dashboards.", stat: "Avg. +38% Conversions" },
  ];

  return (
    <div className="bg-[#09090b] bg-gradient-to-b from-[#09090b] via-[#0f0c1b] to-[#09090b] text-zinc-100 min-h-screen flex flex-col selection:bg-purple-500 selection:text-white relative overflow-x-hidden">
      {/* Scroll-Reactive Backdrop Glows */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[25%] left-[-15%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[165px] pointer-events-none z-0"></div>
      <div className="absolute top-[55%] right-[-10%] w-[600px] h-[600px] bg-indigo-50/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Navbar Header */}
      <header className={`fixed top-0 left-0 w-full z-45 transition-all duration-300 ${scrolled ? "bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80 py-3 shadow-lg" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => store.navigate("landing")} className="flex items-center gap-1.5 font-sans font-black text-white text-2xl tracking-tight">
              Manychat
            </button>
            <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-300 cursor-pointer hover:text-white uppercase tracking-wider">
              <span>EN</span>
              <svg className="w-3 h-3 opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
              </svg>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[11px] font-extrabold text-zinc-300 hover:text-white uppercase tracking-widest">
            <a href="#features" className="hover:text-white transition-colors">Product</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Agencies</a>
            <a href="#pricing" className="hover:text-white transition-colors font-bold">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors font-bold">Resources</a>
          </nav>

          <div className="flex items-center gap-6">
            <button onClick={() => store.navigate("register")} className="text-[11px] px-5 py-2.5 bg-transparent hover:bg-zinc-800 text-white font-extrabold rounded-full border border-zinc-700 transition-all uppercase tracking-widest">
              Get Started
            </button>
            <button onClick={() => store.navigate("login")} className="text-[11px] text-zinc-300 hover:text-white font-extrabold transition-colors uppercase tracking-widest font-bold">
              Sign In
            </button>
          </div>
        </div>
      </header >

      {/* Hero Section */}
      < section className="relative min-h-[95vh] lg:min-h-[100vh] w-full flex items-center overflow-hidden pt-28 pb-32" >
        {/* Background Image with Dark Vignette */}
        < div className="absolute inset-0 z-0" >
          <img
            src="/creator_hero.png"
            alt="Creator Flow Hero"
            className="w-full h-full object-cover object-center lg:object-[center_35%]"
          />
          {/* Dark overlay to keep text highly legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/80 to-[#09090b]/40 md:from-[#09090b]/98 md:via-[#09090b]/85 md:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent h-full"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div >

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Subheadline, CTA, Badges */}
          <div className="lg:col-span-6 text-left flex flex-col items-start pt-12 lg:pt-0">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-sans font-black tracking-tight text-white leading-[0.9] flex flex-col">
              <span>Social smarter,</span>
              <span className="mt-1">not harder.</span>
            </h1>

            <p className="text-zinc-350 font-sans font-normal mt-6 text-sm md:text-base max-w-lg leading-relaxed">
              Sell more, engage better, and grow your audience with powerful automations for Instagram, WhatsApp, TikTok, and Messenger.
            </p>

            {/* Pink Button */}
            <div className="mt-8">
              <button
                onClick={() => store.navigate("register")}
                className="px-10 py-4 bg-[#e100ff] hover:bg-[#ff1aff] text-white font-sans font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-[1.03] shadow-[0_0_20px_rgba(225,0,255,0.15)]"
              >
                Get Started
              </button>
            </div>


          </div>

          {/* Right Column: Dynamic Overlay chat widgets */}
          <div className="lg:col-span-6 relative h-[380px] lg:h-[480px] w-full flex items-center justify-center lg:justify-start">

            {/* Conversation/Chat Bubbles */}
            <div className="absolute left-0 right-0 lg:-left-20 xl:-left-28 lg:right-auto bottom-4 z-20 flex flex-col gap-4 max-w-[480px] w-full items-start">
              <AnimatePresence mode="popLayout">
                {showBot && (
                  <motion.div
                    key={`bot-${activePairIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative w-full max-w-[440px]"
                  >
                    <div className="bg-[#7829e5] text-white rounded-[22px] rounded-bl-none px-5 py-4 shadow-2xl text-left border border-white/10 relative">
                      <p className="text-[13px] font-semibold leading-relaxed font-sans">
                        {conversationPairs[activePairIndex].bot.text}
                      </p>
                      {conversationPairs[activePairIndex].bot.button && (
                        <button
                          onClick={() => {
                            store.navigate("dashboard");
                            store.pushNotification("Access Approved", "Welcome to the dashboard console.", "success");
                          }}
                          className="mt-3 w-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-[12px] font-bold py-2.5 px-4 rounded-xl transition-all text-center tracking-wide shadow-sm"
                        >
                          {conversationPairs[activePairIndex].bot.button}
                        </button>
                      )}
                      {/* Tail pointer */}
                      <div className="absolute -left-2 bottom-0 w-3.5 h-4 overflow-hidden">
                        <div className="bg-[#7829e5] w-4 h-4 rotate-45 transform origin-bottom-right rounded-sm border-r border-b border-white/5"></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {showUser && (
                  <motion.div
                    key={`user-${activePairIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full max-w-[440px] flex items-end gap-3 self-start"
                  >
                    <div className="w-8.5 h-8.5 rounded-full overflow-hidden shrink-0 border-2 border-zinc-800 shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-[#27272a] text-white rounded-[22px] rounded-bl-none px-5 py-3.5 shadow-2xl text-left border border-white/5 relative">
                      <p className="text-[13px] font-semibold leading-relaxed font-sans">
                        {conversationPairs[activePairIndex].user.text}
                      </p>
                      {/* Tail pointer */}
                      <div className="absolute -left-2 bottom-0 w-3.5 h-4 overflow-hidden">
                        <div className="bg-[#27272a] w-4 h-4 rotate-45 transform origin-bottom-right rounded-sm border-r border-b border-white/5"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Badges in dark mode */}
        <div className="absolute bottom-0 left-0 right-0 z-30 w-full bg-[#09090b]/80 backdrop-blur-md border-t border-zinc-800/80 py-6 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-start gap-6">

            {/* Left: Badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 justify-start">
              {/* Meta Partner */}
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-zinc-300" viewBox="0 0 24 24" fill="currentColor">
                  {/* Meta Logo (Infinity Loop) */}
                  <path d="M16.48 7.37c-1.16 0-2.22.42-3.08 1.13a5.04 5.04 0 00-3.08-1.13c-2.48 0-4.5 1.74-4.5 3.88s2.02 3.88 4.5 3.88c1.16 0-2.22-.42 3.08-1.13.86.71 1.92 1.13 3.08 1.13 2.48 0 4.5-1.74 4.5-3.88s-2.02-3.88-4.5-3.88zm0 6.26c-1.4 0-2.54-1.07-2.54-2.38s1.14-2.38 2.54-2.38 2.54 1.07 2.54 2.38-1.14 2.38-2.54 2.38zm-8.96 0c-1.4 0-2.54-1.07-2.54-2.38s1.14-2.38 2.54-2.38 2.54 1.07 2.54 2.38-1.14 2.38-2.54 2.38z" />
                </svg>
                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm text-zinc-100 font-bold leading-tight">Meta Business</span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 leading-none">Partners</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-zinc-800 hidden sm:block"></div>

              {/* G2 Rating */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ff492c] text-white rounded-lg flex items-center justify-center font-sans font-black text-xs sm:text-sm">G2</div>
                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm text-zinc-100 font-bold leading-tight">4.6 / 5</span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 uppercase font-extrabold tracking-wider leading-none">Stars Rating</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-zinc-800 hidden sm:block"></div>

              {/* Indian Government Verified */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-8 h-8 text-[#b89742]"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Lotus Pedestal Base */}
                  <path
                    d="M16 52 C20 56, 44 56, 48 52 C44 49, 20 49, 16 52 Z"
                    fill="currentColor"
                    opacity="0.2"
                  />
                  <path
                    d="M12 46 H52 V50 H12 V46 Z"
                    fill="currentColor"
                  />
                  {/* Bell-shaped lotus details */}
                  <path
                    d="M20 50 C22 55, 26 58, 32 58 C38 58, 42 55, 44 50"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M26 50 C27 54, 30 56, 32 56 C34 56, 37 54, 38 50" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M32 50 V58" stroke="currentColor" strokeWidth="1.5" />

                  {/* Abacus with central Chakra */}
                  <circle cx="32" cy="48" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="32" cy="48" r="1" fill="currentColor" />
                  {/* Spokes */}
                  <path d="M32 44 V52 M28 48 H36 M29.2 45.2 L34.8 50.8 M29.2 50.8 L34.8 45.2" stroke="currentColor" strokeWidth="1" />

                  {/* Side Animals on Abacus */}
                  <path d="M18 48 C20 46, 22 46, 24 48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M40 48 C42 46, 44 46, 46 48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Three Lions */}
                  <path d="M28 32 V46 H36 V32" fill="currentColor" opacity="0.3" />
                  <line x1="29" y1="46" x2="29" y2="38" stroke="currentColor" strokeWidth="2" />
                  <line x1="35" y1="46" x2="35" y2="38" stroke="currentColor" strokeWidth="2" />

                  <path d="M20 36 V46 H25 V36" fill="currentColor" opacity="0.15" />
                  <line x1="22" y1="46" x2="22" y2="40" stroke="currentColor" strokeWidth="2" />

                  <path d="M39 36 V46 H44 V36" fill="currentColor" opacity="0.15" />
                  <line x1="42" y1="46" x2="42" y2="40" stroke="currentColor" strokeWidth="2" />

                  {/* Central Lion Face */}
                  <path
                    d="M25 24 C23 28, 24 34, 28 36 C30 37, 34 37, 36 36 C40 34, 41 28, 39 24 C37 20, 27 20, 25 24 Z"
                    fill="currentColor"
                  />
                  <path
                    d="M29 23 C29 22, 35 22, 35 23 C35 25, 29 25, 29 23 Z"
                    fill="white"
                  />
                  <circle cx="29" cy="27" r="1.5" fill="white" />
                  <circle cx="35" cy="27" r="1.5" fill="white" />
                  <path d="M31 29 H33 L32 31 Z" fill="white" />
                  <path d="M30 33 C31 34, 33 34, 34 33" stroke="white" strokeWidth="1" strokeLinecap="round" />

                  {/* Left Lion Face */}
                  <path
                    d="M17 26 C15 28, 17 33, 21 34 C23 34, 24 32, 24 28 C24 24, 19 23, 17 26 Z"
                    fill="currentColor"
                  />
                  <path d="M15.5 28 H18 V29.5 H15.5 Z" fill="white" />
                  <circle cx="19" cy="27" r="1" fill="white" />

                  {/* Right Lion Face */}
                  <path
                    d="M47 26 C49 28, 47 33, 43 34 C41 34, 40 32, 40 28 C40 24, 45 23, 47 26 Z"
                    fill="currentColor"
                  />
                  <path d="M48.5 28 H46 V29.5 H48.5 Z" fill="white" />
                  <circle cx="45" cy="27" r="1" fill="white" />
                </svg>
                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm text-zinc-100 font-bold leading-tight">Govt. of India</span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 uppercase font-extrabold tracking-wider leading-none">Verified</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section >

      {/* Social Proof metrics */}
      < section className="py-16 px-6 border-y border-zinc-800/80 bg-[#09090b]/40 backdrop-blur-sm text-center" >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white">10,000+</h2>
            <p className="text-[11px] text-zinc-400 uppercase font-mono tracking-widest mt-1">Creator accounts connected</p>
          </div>
          <div className="h-10 w-px bg-zinc-800 hidden md:block"></div>
          <div>
            <h2 className="text-3xl font-extrabold text-indigo-400">1.2M+</h2>
            <p className="text-[11px] text-zinc-400 uppercase font-mono tracking-widest mt-1">Leads compiled into CRM</p>
          </div>
          <div className="h-10 w-px bg-zinc-800 hidden md:block"></div>
          <div>
            <h2 className="text-3xl font-extrabold text-purple-400">50M+</h2>
            <p className="text-[11px] text-zinc-400 uppercase font-mono tracking-widest mt-1">Auto messages routed</p>
          </div>
        </div>
      </section >

      {/* Dynamic Slide Showcase Section */}
      <section className="bg-white text-black py-0 border-y border-zinc-200 overflow-hidden relative">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />

        {/* Creator review bar */}
        <div className="w-full bg-white border-b border-zinc-200/80 py-4 overflow-hidden select-none relative z-10 flex items-center">
          <div className="animate-marquee flex items-center gap-16 text-xs text-black font-semibold uppercase tracking-wider">
            {/* Group 1 */}
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-sm">❤️</span>
              <span className="font-extrabold text-zinc-900 tracking-tight lowercase first-letter:uppercase">'d by 1M+ creators, marketers & brands</span>
            </div>
            <div className="w-px h-4 bg-zinc-300"></div>
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                alt="Giovanni Begossi"
                className="w-2.5 h-6.5 rounded-full border border-teal-500 object-cover"
              />
              <span className="bg-teal-50 text-teal-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono border border-teal-100">Giovanni Begossi</span>
              <span className="bg-zinc-100 text-zinc-600 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">2M Followers</span>
              <span className="text-[10px] text-zinc-600 font-normal">"MY INSTAGRAM ACCOUNT GAINED OVER 1 MILLION FOLLOWERS IN LESS THAN A YEAR..."</span>
              <span className="text-teal-600 font-black ml-1 text-[10px] hover:underline cursor-pointer">Learn More →</span>
            </div>
            <div className="w-px h-4 bg-zinc-300"></div>
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                alt="Cassie Schoonover"
                className="w-2.5 h-6.5 rounded-full border border-yellow-500 object-cover"
              />
              <span className="bg-yellow-50 text-yellow-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono border border-yellow-100">Cassie Schoonover</span>
              <span className="bg-zinc-100 text-zinc-600 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">504K Followers</span>
              <span className="text-[10px] text-zinc-600 font-normal">"THIS IS A 10 OUT OF 10. THE FUNCTIONALITY, THE C..."</span>
              <span className="text-yellow-600 font-black ml-1 text-[10px] hover:underline cursor-pointer">Learn More →</span>
            </div>
            <div className="w-px h-4 bg-zinc-300"></div>

            {/* Group 2 (Duplicate for seamless loop) */}
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-sm">❤️</span>
              <span className="font-extrabold text-zinc-900 tracking-tight lowercase first-letter:uppercase">'d by 1M+ creators, marketers & brands</span>
            </div>
            <div className="w-px h-4 bg-zinc-300"></div>
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                alt="Giovanni Begossi"
                className="w-2.5 h-6.5 rounded-full border border-teal-500 object-cover"
              />
              <span className="bg-teal-50 text-teal-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono border border-teal-100">Giovanni Begossi</span>
              <span className="bg-zinc-100 text-zinc-600 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">2M Followers</span>
              <span className="text-[10px] text-zinc-600 font-normal">"MY INSTAGRAM ACCOUNT GAINED OVER 1 MILLION FOLLOWERS IN LESS THAN A YEAR..."</span>
              <span className="text-teal-600 font-black ml-1 text-[10px] hover:underline cursor-pointer">Learn More →</span>
            </div>
            <div className="w-px h-4 bg-zinc-300"></div>
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                alt="Cassie Schoonover"
                className="w-2.5 h-6.5 rounded-full border border-yellow-500 object-cover"
              />
              <span className="bg-yellow-50 text-yellow-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono border border-yellow-100">Cassie Schoonover</span>
              <span className="bg-zinc-100 text-zinc-600 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">504K Followers</span>
              <span className="text-[10px] text-zinc-600 font-normal">"THIS IS A 10 OUT OF 10. THE FUNCTIONALITY, THE C..."</span>
              <span className="text-yellow-600 font-black ml-1 text-[10px] hover:underline cursor-pointer">Learn More →</span>
            </div>
            <div className="w-px h-4 bg-zinc-300"></div>
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#ff5e00] flex items-center justify-center text-white text-xl font-bold mb-4 shadow-md">
            $
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-zinc-900 leading-tight max-w-3xl">
            Scale up your best conversations
          </h2>
        </div>

        {/* Slide Display Container */}
        <motion.div
          animate={{ backgroundColor: featureSlides[activeFeatureSlide].bg === "bg-[#f4f210]" ? "#f4f210" : featureSlides[activeFeatureSlide].bg === "bg-[#0ce3e9]" ? "#0ce3e9" : "#a855f7" }}
          transition={{ duration: 0.6 }}
          className="w-full min-h-[500px] flex items-center py-12 transition-all"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Details */}
            <div className="lg:col-span-6 flex flex-col justify-center items-start text-left">
              {/* Custom Slide Switcher Indicators */}
              <div className="flex items-center gap-1.5 mb-8">
                {featureSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFeatureSlide(idx)}
                    className="group py-2 relative focus:outline-none"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <div className={`h-[3px] w-6 transition-all duration-300 rounded-full ${activeFeatureSlide === idx
                      ? (featureSlides[activeFeatureSlide].textColor === "text-white" ? "bg-white" : "bg-black")
                      : (featureSlides[activeFeatureSlide].textColor === "text-white" ? "bg-white/30" : "bg-black/20")
                      }`} />
                  </button>
                ))}
              </div>

              {/* AnimatePresence for smooth slide text transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeatureSlide}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`${featureSlides[activeFeatureSlide].textColor} max-w-xl`}
                >
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight leading-none mb-6">
                    {featureSlides[activeFeatureSlide].title}
                  </h3>
                  <p className="text-base font-normal leading-relaxed opacity-90 mb-8 max-w-lg">
                    {featureSlides[activeFeatureSlide].desc}
                  </p>
                  <button
                    onClick={() => store.navigate("register")}
                    className={`px-8 py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-md transition-all duration-300 transform hover:scale-[1.03] ${featureSlides[activeFeatureSlide].pillBg
                      }`}
                  >
                    Get Started
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Phone Mockup */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end items-center w-full">
              <div className="relative w-full max-w-[290px] h-[550px] rounded-[36px] border-[10px] border-zinc-900 shadow-2xl bg-zinc-950 flex flex-col justify-between overflow-hidden">
                {/* Speaker/Camera notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-4 w-28 bg-zinc-900 rounded-b-xl z-20 flex items-center justify-center">
                  <div className="w-10 h-1 bg-zinc-800 rounded-full mb-1"></div>
                </div>

                {/* Simulated Screen */}
                <div className="flex-1 flex flex-col justify-between pt-8 pb-4 px-3.5 relative bg-zinc-950">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-[9px] font-semibold text-zinc-500 font-mono mb-2 px-1">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <span>5G</span>
                      <div className="w-4 h-2 rounded-sm border border-zinc-500 flex items-center justify-start p-0.5">
                        <div className="w-full h-full bg-zinc-500 rounded-2xs"></div>
                      </div>
                    </div>
                  </div>

                  {/* DM Header */}
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      E
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-[10px] font-bold text-white leading-none">Eve (Automation Demo)</h4>
                      <span className="text-[7px] text-zinc-500 leading-none">Instagram Live chat</span>
                    </div>
                  </div>

                  {/* Chat Message Thread */}
                  <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto mb-4 scrollbar-none justify-start">
                    <AnimatePresence mode="popLayout">
                      {/* Message 1 (User comment/DM) */}
                      {phoneMessageStep >= 0 && (
                        <motion.div
                          key={`msg-0-${activeFeatureSlide}`}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.25 }}
                          className="flex flex-col items-end self-end max-w-[85%]"
                        >
                          <div className="bg-[#2e2b38] text-white text-[10px] font-medium py-2.5 px-3.5 rounded-[16px] rounded-br-none text-right">
                            {featureSlides[activeFeatureSlide].chatHistory[0].text}
                          </div>
                        </motion.div>
                      )}

                      {/* Message 2 (Bot first reply with buttons) */}
                      {phoneMessageStep >= 1 && (
                        <motion.div
                          key={`msg-1-${activeFeatureSlide}`}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.25 }}
                          className="flex flex-col items-start self-start max-w-[85%]"
                        >
                          <div className="bg-[#7829e5] text-white text-[10px] font-medium py-2.5 px-3.5 rounded-[16px] rounded-bl-none text-left">
                            {featureSlides[activeFeatureSlide].chatHistory[1].text}
                          </div>
                          {featureSlides[activeFeatureSlide].chatHistory[1].button && (
                            <motion.button
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="mt-1.5 w-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-[9px] py-1.5 rounded-full border border-white/10 transition-colors"
                            >
                              {featureSlides[activeFeatureSlide].chatHistory[1].button}
                            </motion.button>
                          )}
                        </motion.div>
                      )}

                      {/* Message 3 (Bot second reply or follow-up) */}
                      {phoneMessageStep >= 2 && featureSlides[activeFeatureSlide].chatHistory[2] && (
                        <motion.div
                          key={`msg-2-${activeFeatureSlide}`}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.25 }}
                          className="flex flex-col items-start self-start max-w-[85%]"
                        >
                          <div className="bg-[#7829e5] text-white text-[10px] font-medium py-2.5 px-3.5 rounded-[16px] rounded-bl-none text-left">
                            {featureSlides[activeFeatureSlide].chatHistory[2].text}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Pink Badge Footer at bottom of frame */}
                  <motion.div
                    key={`badge-${activeFeatureSlide}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#ff00ff] text-white text-center py-2.5 px-3 rounded-xl font-sans font-bold text-[10px] uppercase tracking-wider shadow-md select-none mt-auto"
                  >
                    {featureSlides[activeFeatureSlide].badge}
                  </motion.div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </section >

      {/* Features Grid */}
      < section id="features" className="py-20 px-6 max-w-6xl mx-auto w-full" >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">Full Suite DM Funnel Infrastructure</h2>
          <p className="text-xs text-zinc-400 mt-2">Design, automate, and qualify user responses instantly from your creative content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon={<MessageSquare className="text-indigo-400" />} title="Comment to DM" desc="Instantly auto-reply to target comments on reels, posts, and IG videos. Send VIP discount links." />
          <FeatureCard icon={<Zap className="text-purple-400" />} title="Story Reply Automation" desc="Engage leads tagging your account in stories. Deliver confirmation calendars autonomously." />
          <FeatureCard icon={<Bot className="text-fuchsia-400" />} title="AI Sales Agents" desc="Converse with leads using smart agents trained on pricing PDFs and brand parameters." />
          <FeatureCard icon={<Phone className="text-emerald-400" />} title="WhatsApp Automation" desc="Send automated client messages over official business API nodes." />
          <FeatureCard icon={<Users className="text-blue-400" />} title="Lead CRM Hub" desc="Categorize leads in clean Kanban pipelines, tracking customer lead scores and notes." />
          <FeatureCard icon={<TrendingUp className="text-rose-400" />} title="Revenue Analytics" desc="Track conversion events back to specific content, attributes sales directly to DM flows." />
        </div>
      </section >

      {/* How it Works with interactive timeline step switcher */}
      < section id="how-it-works" className="py-20 px-6 border-t border-zinc-900 bg-[#09090b]/20" >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Interactive Integration Timeline</h2>
            <p className="text-xs text-zinc-400 mt-2">Click any timeline step to discover how leads traverse from social comments to final won sales.</p>
          </div>

          {/* Steps selector buttons */}
          <div className="flex justify-between items-center gap-1 border-b border-zinc-800 pb-4 overflow-x-auto">
            {stepsInfo.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg shrink-0 transition-all ${activeStep === idx
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-bold shadow-sm"
                  : "text-zinc-400 hover:text-white"
                  }`}
              >
                Step {idx + 1}
              </button>
            ))}
          </div>

          {/* Active Step Panel */}
          <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
            <div className="flex-1">
              <span className="text-[9px] font-bold uppercase font-mono tracking-widest text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded">{stepsInfo[activeStep].stat}</span>
              <h3 className="text-lg font-bold text-white mt-3">{stepsInfo[activeStep].title}</h3>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{stepsInfo[activeStep].desc}</p>
            </div>
            <div className="w-52 h-20 bg-zinc-955 border border-zinc-800 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-400 font-mono tracking-widest relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
              <span>REPLYRUSH AI</span>
            </div>
          </div>
        </div>
      </section >

      {/* Pricing Sections */}
      < section id="pricing" className="py-20 px-6 border-t border-zinc-900 bg-[#09090b]/40" >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">Flexible SaaS Pricing Plans</h2>
          <p className="text-xs text-zinc-400 mt-2">Scale automation as your followings qualify.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 text-left">
            <PricingCard title="Starter" price={0} desc="For new creators beginning automation." features={["1 active flow", "100 DMs/mo", "CRM pipeline view"]} />
            <PricingCard title="Growth" price={29} desc="For coaches capturing warm leads." features={["5 active flows", "1,500 DMs/mo", "SMTP email integration"]} />
            <PricingCard title="Pro" price={59} popular desc="For businesses driving serious conversions." features={["Unlimited flows", "8,000 DMs/mo", "Trained AI Agent configs", "WhatsApp API integrations"]} />
            <PricingCard title="Agency" price={129} desc="For managers running creator clients." features={["Multi-page workspace", "50,000 DMs/mo", "Dedicated vector vectors training", "Custom webhooks"]} />
          </div>
        </div>
      </section >

      {/* Testimonials */}
      < section className="py-20 px-6 border-t border-zinc-900 bg-[#09090b]/20 text-center" >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-10">Trusted by Creator Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <TestimonialCard name="Gavin Ross" role="Business Coach" quote="ReplyRush added $12k in Strategy calls strategies within 3 weeks of setup. The AI Qualifier bot qualifiers are insane." />
            <TestimonialCard name="Melinda Vance" role="SaaS Creator" quote="Automating story comment tags converted our reel commenters into paying leads on autopilot. Highly recommended." />
            <TestimonialCard name="Dmitri Lopez" role="Course Creator" quote="We manage 6 creator accounts. The single-page dashboard lets us swap flows in seconds. Five stars." />
          </div>
        </div>
      </section >

      {/* FAQAccordian accordion */}
      < section id="faq" className="py-20 px-6 border-t border-zinc-900 max-w-3xl mx-auto w-full bg-transparent" >
        <h2 className="text-2xl font-bold text-center text-white mb-10">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          <FaqAccordionItem q="How does the comment-to-DM trigger work?" a="When user comments a matching keyword on your Instagram reel or video post, our Meta routing detects the event and dispatches the customized qualifying DM flow instantly." />
          <FaqAccordionItem q="Is the WhatsApp connection officially supported?" a="Yes, we hook into Meta's official WhatsApp Business API nodes, ensuring your sender status remains verified." />
          <FaqAccordionItem q="Can I connect multiple AI Agents?" a="Pro and Agency plans support deployment of multiple agent prompts trained on distinct Vector FAQ documents." />
        </div>
      </section >

      {/* CTA Final */}
      < section className="py-20 px-6 border-t border-zinc-900 text-center relative overflow-hidden bg-gradient-to-b from-[#09090b] via-[#0c0a1a] to-[#09090b]" >
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl font-extrabold text-white">Stop Losing Leads in Your DMs.</h2>
          <p className="text-zinc-400 text-xs mt-3 max-w-md mx-auto">Convert conversations into structured revenue channels. Start free today.</p>
          <button onClick={() => store.navigate("register")} className="mt-8 px-6 py-3.5 bg-white text-zinc-950 font-extrabold rounded-xl hover:bg-zinc-100 transition-all text-xs flex items-center gap-2 mx-auto shadow-md">
            <span>Start Free</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section >

      {/* Footer */}
      < footer className="border-t border-zinc-900 py-10 px-6 bg-[#09090b] text-center text-xs text-zinc-400" >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Zap size={14} className="text-indigo-400" />
            <span>ReplyRush AI</span>
          </div>
          <span>© 2026 ReplyRush AI, Inc. Built with Next.js & Tailwind CSS. All rights reserved.</span>
        </div>
      </footer >
    </div >
  );
}

// Landing View Helper Components
function HeroFlowCard({
  step,
  title,
  desc,
  active,
  border,
  glow,
}: {
  step: string;
  title: string;
  desc: string;
  active?: boolean;
  border: string;
  glow: string;
}) {
  return (
    <div className={`p-4 rounded-xl bg-zinc-900 border ${border} ${glow} shadow-lg flex flex-col justify-between min-h-[120px] transition-all`}>
      <div>
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${active ? "bg-indigo-500/10 text-indigo-400" : "bg-zinc-800 text-zinc-500"}`}>Step {step}</span>
        <h4 className="text-xs font-bold text-white mt-2 truncate">{title}</h4>
      </div>
      <p className="text-[10px] text-zinc-500 truncate font-mono mt-2">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-850 hover:bg-zinc-900/50 transition-all group">
      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 w-fit group-hover:border-indigo-500/20 transition-all">
        {icon}
      </div>
      <h3 className="font-bold text-white mt-4 text-sm">{title}</h3>
      <p className="text-zinc-400 text-[11px] mt-2 leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  desc,
  features,
  popular,
}: {
  title: string;
  price: number;
  desc: string;
  features: string[];
  popular?: boolean;
}) {
  const store = useAppStore();

  return (
    <div className={`p-5 rounded-2xl border flex flex-col justify-between relative transition-all ${popular
      ? "border-indigo-500 bg-zinc-900/70 shadow-xl"
      : "border-zinc-900 bg-zinc-900/10 hover:border-zinc-855"
      }`}>
      {popular && (
        <span className="absolute -top-3 right-4 px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[8px] uppercase tracking-wider">Most Popular</span>
      )}
      <div>
        <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">{title}</h4>
        <p className="text-zinc-500 text-[10px] mt-1.5">{desc}</p>
        <div className="mt-4 flex items-baseline text-white">
          <span className="text-2xl font-extrabold">${price}</span>
          <span className="text-zinc-500 text-[10px] font-mono">/mo</span>
        </div>
        <div className="h-px bg-zinc-905 my-4"></div>
        <ul className="flex flex-col gap-2.5">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-[10px] text-zinc-300">
              <Check size={12} className="text-indigo-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={() => { store.navigate("register"); store.pushNotification("Plan Selected", `Redirecting to payment for ${title}.`, "success"); }} className={`mt-6 w-full py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${popular ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
        }`}>
        Select plan
      </button>
    </div>
  );
}

function TestimonialCard({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-900/20 hover:border-zinc-850 transition-all flex flex-col justify-between">
      <p className="text-zinc-400 text-xs italic font-serif leading-relaxed">"{quote}"</p>
      <div className="mt-4 flex items-center gap-3 border-t border-zinc-900 pt-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white text-[10px]">{name.substring(0, 2).toUpperCase()}</div>
        <div>
          <h4 className="text-xs font-bold text-white">{name}</h4>
          <span className="text-[10px] text-zinc-500 font-mono">{role}</span>
        </div>
      </div>
    </div>
  );
}

function FaqAccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-900 rounded-xl bg-zinc-900/10 overflow-hidden transition-all hover:border-zinc-850">
      <button onClick={() => setOpen((o) => !o)} className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-white">
        <span>{q}</span>
        {open ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-[10px] text-zinc-400 leading-relaxed border-t border-zinc-900/50 pt-2 font-mono">
          {a}
        </div>
      )}
    </div>
  );
}

// 5.2 LOGIN VIEW
function LoginView() {
  const store = useAppStore();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    store.navigate("dashboard");
    store.pushNotification("Access Approved", "Welcome to the dashboard console.", "success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <button onClick={() => store.navigate("landing")} className="flex items-center gap-1.5 font-bold text-white text-md mb-6">
            <Zap size={18} className="text-indigo-500 fill-indigo-500" />
            <span>ReplyRush AI</span>
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">Log in to ReplyRush</h2>
          <p className="text-[10px] text-zinc-500 font-mono mt-1">Telemetry qualifications console</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-xl flex flex-col gap-4 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Email Address</label>
            <input type="email" required className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none" placeholder="you@domain.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Password</label>
              <button type="button" onClick={() => store.navigate("forgot-password")} className="text-[9px] text-indigo-400 font-semibold">Forgot?</button>
            </div>
            <input type="password" required className="px-3 py-2 bg-zinc-955 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-1.5">
            <Lock size={12} />
            <span>Login to Console</span>
          </button>
        </form>

        <p className="text-center text-[10px] text-zinc-500 mt-6">
          New creator? <button onClick={() => store.navigate("register")} className="text-indigo-400 font-semibold hover:underline">Create account</button>
        </p>
      </div>
    </div>
  );
}

// 5.3 REGISTER VIEW
function RegisterView() {
  const store = useAppStore();
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    store.navigate("dashboard");
    store.pushNotification("Account Configured", "Your workspace setup is completed.", "success");
    store.addLog("Deployed ReplyRush account", "success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <button onClick={() => store.navigate("landing")} className="flex items-center gap-1.5 font-bold text-white text-md mb-6">
            <Zap size={18} className="text-indigo-500 fill-indigo-500" />
            <span>ReplyRush AI</span>
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">Create your account</h2>
          <p className="text-[10px] text-zinc-500 font-mono mt-1">Start converting comment triggers immediately</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-xl flex flex-col gap-4 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Workspace Creator Name</label>
            <input type="text" required className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none" placeholder="e.g. John Doe" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Email Address</label>
            <input type="email" required className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none" placeholder="you@domain.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Password</label>
            <input type="password" required className="px-3 py-2 bg-zinc-955 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none" placeholder="Min 8 characters" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-1.5">
            <User size={12} />
            <span>Deploy Workspace</span>
          </button>
        </form>

        <p className="text-center text-[10px] text-zinc-500 mt-6">
          Already have an account? <button onClick={() => store.navigate("login")} className="text-indigo-400 font-semibold hover:underline">Login</button>
        </p>
      </div>
    </div>
  );
}

// 5.4 FORGOT PASSWORD
function ForgotPasswordView() {
  const store = useAppStore();
  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    store.pushNotification("Link Dispatched", "Check your inbox for reset steps.", "success");
    store.navigate("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <button onClick={() => store.navigate("landing")} className="flex items-center gap-1.5 font-bold text-white text-md mb-6">
            <Zap size={18} className="text-indigo-500 fill-indigo-500" />
            <span>ReplyRush AI</span>
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">Recover credentials</h2>
        </div>

        <form onSubmit={handleForgot} className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-xl flex flex-col gap-4 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Email Address</label>
            <input type="email" required className="px-3 py-2 bg-zinc-955 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none" placeholder="you@domain.com" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-2">
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-[10px] text-zinc-500 mt-6">
          Back to <button onClick={() => store.navigate("login")} className="text-indigo-400 font-semibold hover:underline">Login</button>
        </p>
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
          <p className="text-xs text-zinc-400 mt-0.5">Realtime conversion and outbound lead telemetry metrics.</p>
        </div>
        <button onClick={() => { store.pushNotification("Telemetry Updated", "Central variables refreshed.", "success"); }} className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-805 hover:border-zinc-750 text-xs text-zinc-350 hover:text-white rounded-lg transition-all flex items-center gap-1.5 font-mono">
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
        <div className="lg:col-span-2 p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-xs">Revenue & Lead Source Trends</h3>
                <p className="text-[10px] text-zinc-550 mt-0.5 font-mono">Channel attribution conversion tracking</p>
              </div>
              <div className="flex gap-2.5 text-[9px] font-mono uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-indigo-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>Revenue</span>
                <span className="flex items-center gap-1.5 text-purple-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>Outbound Leads</span>
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

              <div className="absolute inset-x-0 bottom-0 flex justify-between text-[9px] text-zinc-555 font-mono pt-2 border-t border-zinc-900/60">
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
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 flex flex-col justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Activity size={15} className="text-indigo-400" />
              <span>Realtime Workspace Activity Logs</span>
            </h3>
            <p className="text-[10px] text-zinc-550 mt-0.5">Automation activity triggers</p>

            <div className="mt-4 flex flex-col gap-3 max-h-[170px] overflow-y-auto pr-1">
              {store.logs.map((log) => (
                <div key={log.id} className="text-[11px] flex gap-2 border-b border-zinc-900 pb-2 items-start leading-relaxed">
                  <span className="font-mono text-zinc-650 shrink-0">{log.timestamp}</span>
                  <div className="flex-1">
                    <p className="text-zinc-300 font-semibold">{log.text}</p>
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${log.type === "success" ? "text-emerald-400" :
                      log.type === "ai" ? "text-fuchsia-400" : "text-indigo-400"
                      }`}>{log.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => store.navigate("analytics")} className="w-full mt-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900 text-[10px] font-bold text-zinc-300 hover:text-white rounded-lg transition-all flex items-center justify-center gap-1">
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
    <div className="p-5 rounded-xl border border-zinc-805 bg-zinc-900/30 hover:border-zinc-700 transition-all flex flex-col justify-between group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">{title}</span>
        <div className="p-2 rounded-lg bg-zinc-805 text-indigo-400 group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">{value}</h2>
        <div className="flex items-center justify-between mt-2 text-[9px]">
          <span className="text-zinc-555 font-mono">{sub}</span>
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

  const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

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
      <div className="px-6 py-3 border-b border-zinc-800 bg-[#0c0c0e] flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Layers size={15} className="text-indigo-400" />
            <span>ReplyRush Visual Builder Canvas</span>
          </h2>
          <p className="text-[10px] text-zinc-550">Link activation triggers to lead qualifying responders</p>
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
              store.pushNotification("Template loaded", "Synchronized ReplyRush template to canvas.", "success");
            }}
            className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white rounded-lg transition-all"
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

      <div className="flex flex-1 relative overflow-hidden bg-zinc-950">
        {/* Left add-nodes toolbox drawer */}
        <div className="absolute top-4 left-4 z-10 w-44 bg-zinc-955/95 border border-zinc-800 p-4 rounded-xl flex flex-col gap-4 shadow-2xl">
          <div>
            <h4 className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Triggers</h4>
            <div className="flex flex-col gap-1.5 mt-2">
              <button onClick={() => addNodeToCanvas("trigger", "instagram_comment", "IG Comment")} className="text-[10px] text-left px-2 py-1.5 rounded bg-zinc-900 border border-purple-500/20 text-purple-300 font-semibold hover:border-purple-500 transition-all flex items-center gap-1.5">
                <Instagram size={12} />
                <span>Instagram Comment</span>
              </button>
              <button onClick={() => addNodeToCanvas("trigger", "instagram_dm", "IG DM Received")} className="text-[10px] text-left px-2 py-1.5 rounded bg-zinc-900 border border-purple-500/20 text-purple-300 font-semibold hover:border-purple-500 transition-all flex items-center gap-1.5">
                <MessageSquare size={12} />
                <span>Instagram DM</span>
              </button>
              <button onClick={() => addNodeToCanvas("trigger", "keyword", "Keyword DM Alert")} className="text-[10px] text-left px-2 py-1.5 rounded bg-zinc-900 border border-purple-500/20 text-purple-300 font-semibold hover:border-purple-500 transition-all flex items-center gap-1.5">
                <Zap size={12} />
                <span>Keyword Trigger</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-zinc-805/80"></div>

          <div>
            <h4 className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Actions</h4>
            <div className="flex flex-col gap-1.5 mt-2 max-h-[170px] overflow-y-auto pr-1">
              <button onClick={() => addNodeToCanvas("action", "send_dm", "Send DM Reply")} className="text-[10px] text-left px-2 py-1.5 rounded bg-zinc-900 border border-indigo-500/20 text-indigo-300 font-semibold hover:border-indigo-500 transition-all flex items-center gap-1.5">
                <MessageSquare size={12} />
                <span>Send DM</span>
              </button>
              <button onClick={() => addNodeToCanvas("action", "send_whatsapp", "Send WhatsApp")} className="text-[10px] text-left px-2 py-1.5 rounded bg-zinc-900 border border-indigo-500/20 text-indigo-300 font-semibold hover:border-indigo-500 transition-all flex items-center gap-1.5">
                <Phone size={12} />
                <span>Send WhatsApp</span>
              </button>
              <button onClick={() => addNodeToCanvas("action", "send_email", "Send Email")} className="text-[10px] text-left px-2 py-1.5 rounded bg-zinc-900 border border-indigo-500/20 text-indigo-300 font-semibold hover:border-indigo-500 transition-all flex items-center gap-1.5">
                <Mail size={12} />
                <span>Send Email</span>
              </button>
              <button onClick={() => addNodeToCanvas("action", "ai_agent", "Run AI Qualifier")} className="text-[10px] text-left px-2 py-1.5 rounded bg-zinc-900 border border-fuchsia-500/20 text-fuchsia-300 font-semibold hover:border-fuchsia-500 transition-all flex items-center gap-1.5">
                <Bot size={12} />
                <span>AI Agent Bot</span>
              </button>
              <button onClick={() => addNodeToCanvas("action", "wait", "Delay Timer")} className="text-[10px] text-left px-2 py-1.5 rounded bg-zinc-900 border border-yellow-500/20 text-yellow-300 font-semibold hover:border-yellow-500 transition-all flex items-center gap-1.5">
                <Clock size={12} />
                <span>Wait delay</span>
              </button>
              <button onClick={() => addNodeToCanvas("action", "condition", "Condition Split")} className="text-[10px] text-left px-2 py-1.5 rounded bg-zinc-900 border border-rose-500/20 text-rose-300 font-semibold hover:border-rose-500 transition-all flex items-center gap-1.5">
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
          <div className="w-80 border-l border-zinc-800 bg-[#0c0c0e] p-6 flex flex-col justify-between shrink-0 h-full overflow-y-auto z-10">
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <h3 className="font-bold text-white text-xs">Tweak Workflow Node</h3>
                <button onClick={() => setSelectedNode(null)} className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest font-mono">Node Title</label>
                  <input
                    type="text"
                    className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-lg text-xs font-semibold text-white focus:outline-none"
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
                    <label className="text-[9px] font-bold text-zinc-555 uppercase tracking-widest font-mono">Comment Keyword Trigger</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                      value={nodeData?.config?.keyword || ""}
                      onChange={(e) => updateNodeConfig({ keyword: e.target.value })}
                      placeholder="e.g. RUSH"
                    />
                  </div>
                )}

                {nodeData?.type === "send_dm" && (
                  <div>
                    <label className="text-[9px] font-bold text-zinc-555 uppercase tracking-widest font-mono">Outbound DM Message</label>
                    <textarea
                      rows={4}
                      className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none"
                      value={nodeData?.config?.message || ""}
                      onChange={(e) => updateNodeConfig({ message: e.target.value })}
                      placeholder="Write qualifying welcome reply message..."
                    />
                  </div>
                )}

                {nodeData?.type === "wait" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-zinc-555 uppercase tracking-widest font-mono">Delay</label>
                      <input
                        type="number"
                        className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none"
                        value={nodeData?.config?.duration || 15}
                        onChange={(e) => updateNodeConfig({ duration: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-zinc-555 uppercase tracking-widest font-mono">Unit</label>
                      <select
                        className="w-full mt-1.5 px-2 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none"
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
                    <label className="text-[9px] font-bold text-zinc-555 uppercase tracking-widest font-mono">Model Agent Configuration</label>
                    <select
                      className="w-full mt-1.5 px-2 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none"
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
          <p className="text-xs text-zinc-400 mt-0.5">Qualify and follow up leads through Kanban stages.</p>
        </div>

        <div className="flex gap-2">
          {/* Layout toggle */}
          <div className="bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg flex items-center">
            <button
              onClick={() => setLayoutMode("kanban")}
              className={`p-1.5 rounded-md transition-all ${layoutMode === "kanban" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-350"}`}
              title="Kanban Board"
            >
              <Kanban size={14} />
            </button>
            <button
              onClick={() => setLayoutMode("table")}
              className={`p-1.5 rounded-md transition-all ${layoutMode === "table" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-350"}`}
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
      <div className="flex items-center gap-3 px-3 py-2 border border-zinc-805 bg-zinc-900/50 rounded-xl max-w-sm w-full mt-2 text-xs">
        <Search size={14} className="text-zinc-505" />
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
              <div key={stg} className="p-3 bg-zinc-900/10 border border-zinc-800/80 rounded-xl flex flex-col gap-3.5">
                {/* Column Title */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">{stg}</span>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-[10px] text-zinc-400 font-bold border border-zinc-808">{stageLeads.length}</span>
                </div>

                <div className="flex flex-col gap-3 min-h-[300px]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setActiveLead(lead)}
                      className="p-4 rounded-xl border border-zinc-808 bg-[#0c0c0e] hover:border-zinc-700 transition-all cursor-pointer shadow-sm group"
                    >
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{lead.name}</h4>
                      <p className="text-[9px] text-zinc-550 font-mono mt-0.5">@{lead.username}</p>

                      <div className="flex justify-between items-center mt-4 text-[9px]">
                        <span className="text-zinc-555 font-mono">{lead.source.substring(0, 15)}...</span>
                        <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${lead.leadScore > 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          lead.leadScore > 50 ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                            "bg-zinc-800 text-zinc-555 border border-zinc-700"
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
        <div className="border border-zinc-808 rounded-xl overflow-hidden mt-4 bg-zinc-900/10 text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-808 bg-[#0c0c0e] text-zinc-400 font-semibold font-mono text-[10px] uppercase">
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
                  className="border-b border-zinc-900 hover:bg-zinc-900/25 transition-all cursor-pointer group"
                >
                  <td className="p-4 font-bold text-white group-hover:text-indigo-400 transition-colors">{lead.name}</td>
                  <td className="p-4 font-mono text-zinc-400">@{lead.username}</td>
                  <td className="p-4 text-zinc-450">{lead.email}</td>
                  <td className="p-4 text-zinc-500">{lead.phone}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 border border-indigo-400/20 text-indigo-400">{lead.stage}</span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-zinc-205">{lead.leadScore}</td>
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
              className="w-full max-w-md bg-zinc-900 border border-zinc-805 rounded-xl overflow-hidden shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white text-sm">Create Lead Record</h3>
                <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Full Name</label>
                  <input type="text" required className="px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-lg text-white focus:outline-none" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Instagram Username</label>
                  <input type="text" required className="px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-lg text-white focus:outline-none" placeholder="e.g. johndoe_ig" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Email Address</label>
                  <input type="email" required className="px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-lg text-white focus:outline-none" placeholder="john@doe.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Phone</label>
                  <input type="text" className="px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-lg text-white focus:outline-none" placeholder="+1 555-1234" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Pipeline Stage</label>
                  <select className="w-full px-2 py-2 bg-zinc-950 border border-zinc-805 rounded-lg text-white focus:outline-none font-semibold" value={stage} onChange={(e) => setStage(e.target.value as Contact["stage"])}>
                    {stages.map((stg) => <option key={stg} value={stg}>{stg}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-4">
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
              className="relative w-96 bg-[#0c0c0e] border-l border-zinc-805 p-6 flex flex-col justify-between h-full overflow-y-auto"
            >
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-md font-bold text-white">{activeLead.name}</h2>
                    <p className="text-[9px] text-zinc-555 font-mono mt-0.5">@{activeLead.username}</p>
                  </div>
                  <button onClick={() => setActiveLead(null)} className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white">
                    <X size={15} />
                  </button>
                </div>

                <div className="h-px bg-zinc-900"></div>

                <div className="flex flex-col gap-4 text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-zinc-555 font-mono tracking-widest">Pipeline Stage</span>
                    <select
                      className="w-full mt-1.5 px-2 py-2 bg-zinc-955 border border-zinc-800 rounded-lg text-xs text-white"
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
                    <span className="text-[9px] uppercase font-bold text-zinc-555 font-mono tracking-widest">Lead Tags</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activeLead.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-[10px]">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold text-zinc-555 font-mono tracking-widest">Notes</span>
                    <textarea
                      rows={3}
                      className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none"
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
                    <span className="text-[9px] uppercase font-bold text-zinc-555 font-mono tracking-widest">Conversation History</span>
                    <div className="mt-2 flex flex-col gap-3 max-h-[200px] overflow-y-auto bg-zinc-950/80 border border-zinc-900 rounded-xl p-3.5 pr-2">
                      {activeLead.chatHistory.map((chat, idx) => (
                        <div key={idx} className={`flex flex-col max-w-[85%] ${chat.sender === "user" ? "self-end items-end" : "self-start items-start"}`}>
                          <div className={`p-2.5 rounded-xl text-[10px] leading-relaxed ${chat.sender === "user" ? "bg-indigo-600 text-white rounded-tr-none" :
                            chat.sender === "bot" ? "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none font-serif text-[10px]" :
                              "bg-zinc-950 text-zinc-555 font-mono text-[9px] border border-zinc-900"
                            }`}>
                            {chat.text}
                          </div>
                          <span className="text-[8px] text-zinc-650 font-mono mt-1">{chat.timestamp}</span>
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
    { sender: "bot", text: "Hey! 🚀 ReplyRush Qualify Bot here. How can I help you scale today?" },
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
          sender: "bot", text: activeAgent.name === "ReplyRush Qualify Bot"
            ? "Hey! 🚀 ReplyRush Qualify Bot here. How can I help you scale today?"
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
      if (activeAgent.name === "ReplyRush Qualify Bot") {
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
          reply = "Sure! Here is my live booking slots link: https://replyrush.ai/meet-closer. Confirm a slot!";
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
          <p className="text-xs text-zinc-400 mt-0.5">Tune agent prompts and test responses immediately inside the phone mockup simulator.</p>
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
            <div className="p-4 bg-zinc-900/10 border border-zinc-800/80 rounded-xl flex gap-3 overflow-x-auto">
              {store.agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedId(agent.id)}
                  className={`px-4 py-3 rounded-lg border text-left shrink-0 transition-all ${selectedId === agent.id ? "border-purple-500 bg-purple-500/5" : "border-zinc-800 bg-zinc-900/10"
                    }`}
                >
                  <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
                  <p className="text-[9px] text-zinc-550 font-mono mt-1 font-semibold">{agent.language} • {agent.knowledgeBase.length} docs</p>
                </button>
              ))}
            </div>

            {/* Configurator fields */}
            <div className="p-6 rounded-xl border border-zinc-805 bg-zinc-900/20 flex flex-col gap-5 text-xs">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <h3 className="font-bold text-white text-xs">{activeAgent.name} settings</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Edit prompt guidelines and temperature scales</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-zinc-555 uppercase tracking-widest font-mono">System Prompts instructions</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 bg-zinc-955 border border-zinc-800 rounded-lg font-mono text-zinc-350 focus:outline-none"
                  value={activeAgent.prompt}
                  onChange={(e) => store.updateAgent(activeAgent.id, { prompt: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-zinc-555 uppercase tracking-widest font-mono">Target goals</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-zinc-955 border border-zinc-800 rounded-lg text-white focus:outline-none font-semibold"
                  value={activeAgent.goals}
                  onChange={(e) => store.updateAgent(activeAgent.id, { goals: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-555 uppercase tracking-widest font-mono">Creative Temperature</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full accent-indigo-500"
                    value={activeAgent.creativity}
                    onChange={(e) => store.updateAgent(activeAgent.id, { creativity: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between text-[9px] text-zinc-650 font-mono">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-555 uppercase tracking-widest font-mono">Tone Scale</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full accent-indigo-500"
                    value={activeAgent.personality}
                    onChange={(e) => store.updateAgent(activeAgent.id, { personality: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between text-[9px] text-zinc-650 font-mono">
                    <span>Professional</span>
                    <span>Playful</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-zinc-555 uppercase tracking-widest font-mono">Language</label>
                  <select
                    className="px-2 py-2 bg-zinc-955 border border-zinc-800 rounded-lg text-white font-semibold focus:outline-none"
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
            <div className="w-80 h-[480px] bg-zinc-955 border-4 border-zinc-800 rounded-[32px] overflow-hidden flex flex-col justify-between shadow-2xl relative">
              {/* Phone speaker notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-855 rounded-full z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-zinc-900 rounded-full"></div>
              </div>

              {/* Chat simulator header */}
              <div className="bg-[#0c0c0e] border-b border-zinc-900 pt-7 pb-3 px-4 text-center flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-400/25 flex items-center justify-center text-indigo-400">
                  <Bot size={16} />
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5">{activeAgent.name}</h4>
                <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Online simulator</span>
              </div>

              {/* Chat message bubbles scroll window */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-zinc-955 font-mono text-[9px] pr-2">
                {simMessages.map((msg, i) => (
                  <div key={i} className={`flex max-w-[85%] ${msg.sender === "user" ? "self-end" : msg.sender === "bot" ? "self-start" : "self-center text-center"}`}>
                    <div className={`p-2.5 rounded-xl leading-relaxed ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-none" :
                      msg.sender === "bot" ? "bg-zinc-900 border border-zinc-850 text-zinc-200 rounded-tl-none font-serif text-[10px]" :
                        "bg-zinc-900/40 text-zinc-555 border border-zinc-900 text-[8px]"
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="self-start bg-zinc-900 border border-zinc-850 text-zinc-400 p-2 rounded-xl text-[10px] rounded-tl-none animate-pulse">Typing...</div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSimSend} className="p-3 border-t border-zinc-900 bg-[#0c0c0e] flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a qualify question..."
                  className="flex-1 px-3 py-1.5 bg-zinc-955 border border-zinc-850 rounded-lg text-[10px] text-white focus:outline-none"
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
        <div className="p-12 text-center text-zinc-500">No AI Agents active.</div>
      )}

      {/* New agent modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-zinc-905 border border-zinc-808 rounded-xl overflow-hidden shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white text-sm">Deploy New Agent</h3>
                <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateAgent} className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Agent Name</label>
                  <input type="text" required className="px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-lg text-white focus:outline-none" placeholder="e.g. Qualified Booker" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Instructions prompt</label>
                  <textarea rows={4} required className="px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-lg text-white focus:outline-none" placeholder="You are close closers qualifier bot..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Trained goals</label>
                  <input type="text" required className="px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-lg text-white focus:outline-none" placeholder="Collect target niche and email" value={goals} onChange={(e) => setGoals(e.target.value)} />
                </div>
                <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-4">
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
        <p className="text-xs text-zinc-400 mt-0.5">Track Stripe attributed checkout values back to social entrypoints.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attribution Funnel */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-zinc-808 bg-zinc-900/20">
          <h3 className="font-bold text-white text-xs">Attributed Pipeline Funnel</h3>
          <p className="text-[10px] text-zinc-555 mt-0.5 font-mono">Conversion drop-off telemetry</p>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center text-[10px] mb-1 font-semibold font-mono">
                <span className="text-zinc-400">Total comments qualified</span>
                <span className="text-white">5,000 comment triggers (100%)</span>
              </div>
              <div className="h-6 w-full bg-zinc-955 border border-zinc-800 rounded-lg overflow-hidden relative flex items-center px-3">
                <div className="h-full bg-indigo-500/20 absolute left-0 top-0 w-full"></div>
                <span className="text-[9px] font-bold text-indigo-400 relative z-10 font-mono">100% Volume</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] mb-1 font-semibold font-mono">
                <span className="text-zinc-400">AI Qualification chats</span>
                <span className="text-white">3,800 active chats (76%)</span>
              </div>
              <div className="h-6 w-full bg-zinc-955 border border-zinc-800 rounded-lg overflow-hidden relative flex items-center px-3">
                <div className="h-full bg-purple-500/20 absolute left-0 top-0 w-[76%]"></div>
                <span className="text-[9px] font-bold text-purple-400 relative z-10 font-mono">76% Conversion</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] mb-1 font-semibold font-mono">
                <span className="text-zinc-400">Checkout slot redirects</span>
                <span className="text-white">1,520 clicks (30%)</span>
              </div>
              <div className="h-6 w-full bg-zinc-955 border border-zinc-800 rounded-lg overflow-hidden relative flex items-center px-3">
                <div className="h-full bg-blue-500/20 absolute left-0 top-0 w-[30%]"></div>
                <span className="text-[9px] font-bold text-blue-400 relative z-10 font-mono">40% drop conversion</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] mb-1 font-semibold font-mono">
                <span className="text-zinc-400">Paid purchases (Stripe checkouts)</span>
                <span className="text-white">600 purchases (12%)</span>
              </div>
              <div className="h-6 w-full bg-zinc-955 border border-zinc-800 rounded-lg overflow-hidden relative flex items-center px-3">
                <div className="h-full bg-emerald-500/20 absolute left-0 top-0 w-[12%]"></div>
                <span className="text-[9px] font-bold text-emerald-400 relative z-10 font-mono">12% Net Conversion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Entry channels */}
        <div className="p-6 rounded-xl border border-zinc-808 bg-zinc-900/20 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-xs">Top Attributed Lead Sources</h3>
            <p className="text-[10px] text-zinc-555 mt-0.5">Entrypoints driving won sales</p>

            <div className="mt-5 flex flex-col gap-3.5 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <Instagram size={14} className="text-purple-400" />
                  <span className="text-zinc-300 font-semibold">Comment auto DMs</span>
                </div>
                <span className="text-white font-bold">72%</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-indigo-400" />
                  <span className="text-zinc-300 font-semibold">Direct IG DM flow</span>
                </div>
                <span className="text-white font-bold">14%</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-400" />
                  <span className="text-zinc-300 font-semibold">WhatsApp follow-ups</span>
                </div>
                <span className="text-white font-bold">10%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Webhook size={14} className="text-rose-400" />
                  <span className="text-zinc-300 font-semibold">Inbound Webhooks</span>
                </div>
                <span className="text-white font-bold">4%</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-3 rounded-lg bg-zinc-950/70 border border-zinc-855 text-[10px] text-zinc-650 leading-relaxed font-mono">
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
        <p className="text-xs text-zinc-400 mt-0.5">Manage API keys, integrations connect toggles, and subscription billing details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* API Keys */}
          <div className="p-6 rounded-xl border border-zinc-850 bg-zinc-900/20">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Key size={14} className="text-indigo-400" />
              <span>Developer API Keys</span>
            </h3>
            <p className="text-[10px] text-zinc-555 mt-0.5">Keys to route webhook events from external platforms.</p>

            <form onSubmit={handleGenKey} className="flex gap-2 mt-4 items-center">
              <input
                type="text"
                required
                className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-white focus:outline-none"
                placeholder="Description Name (e.g. HubSpot endpoint)"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <button type="submit" className="px-3.5 py-2 bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-xs text-white rounded-lg transition-all">
                Generate Key
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-2">
              {store.apiKeys.map((key) => (
                <div key={key.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <h5 className="font-bold text-white truncate">{key.name}</h5>
                    <p className="text-[10px] text-zinc-450 font-mono mt-0.5 select-all truncate">{key.key}</p>
                    <span className="text-[8px] text-zinc-650 font-mono mt-1 block">Created on {key.created}</span>
                  </div>
                  <button onClick={() => { store.deleteApiKey(key.id); store.pushNotification("Key Revoked", "Revoked security key access.", "warning"); }} className="text-zinc-500 hover:text-rose-400 p-1.5 rounded hover:bg-zinc-905 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Invited Operators */}
          <div className="p-6 rounded-xl border border-zinc-850 bg-zinc-900/20">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Users size={14} className="text-indigo-400" />
              <span>Teammate Operators</span>
            </h3>
            <p className="text-[10px] text-zinc-555 mt-0.5">Invite managers to build qualifying templates.</p>

            <form onSubmit={handleTeamInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 items-center">
              <input type="text" required className="px-3 py-2 bg-zinc-955 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" required className="px-3 py-2 bg-zinc-955 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-lg transition-all shadow">
                Invite
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-2">
              {store.team.map((t) => (
                <div key={t.email} className="p-3 bg-zinc-950 border border-zinc-905 rounded-lg flex items-center justify-between text-xs gap-3">
                  <div className="min-w-0">
                    <h5 className="font-bold text-white truncate">{t.name}</h5>
                    <p className="text-[10px] text-zinc-500 truncate">{t.email}</p>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-bold font-mono mt-1 inline-block uppercase tracking-wider">{t.role}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[9px] text-zinc-550 font-mono">{t.joined}</span>
                    {t.role !== "Owner" && (
                      <button onClick={() => store.deleteTeamMember(t.email)} className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-zinc-905">
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
          <div className="p-6 rounded-xl border border-zinc-850 bg-zinc-900/20">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <LinkIcon size={14} className="text-indigo-400" />
              <span>SaaS Integrations</span>
            </h3>
            <p className="text-[10px] text-zinc-555 mt-0.5">Toggle social connections</p>

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
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">Attributed leads: 1,520 / 8,000 monthly automated messages. Renews: June 20, 2026.</p>
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
    <div className="p-3 bg-zinc-950 border border-zinc-905 rounded-lg flex items-start justify-between text-xs gap-3">
      <div>
        <h5 className="font-bold text-white">{title}</h5>
        <p className="text-[9px] text-zinc-550 mt-1 leading-normal">{desc}</p>
      </div>
      <button onClick={onToggle} className={`px-2 py-1 text-[9px] font-bold border rounded transition-all shrink-0 ${active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" : "bg-zinc-900 text-zinc-400 border-zinc-808"
        }`}>
        {active ? "Connected" : "Connect"}
      </button>
    </div>
  );
}
