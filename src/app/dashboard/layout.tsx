"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard,
  Users,
  GitBranch,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Image as ImageIcon,
  Key,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Coins,
  Share2,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: session, isAuthenticated, clearAuth } = useAuthStore();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: wallet } = useQuery({
    queryKey: ["walletBalance"],
    queryFn: () => api.get("/wallet").then((res) => res.data),
    enabled: Boolean(session),
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (!isAuthenticated || !session) {
      router.push("/signin");
      return;
    }
    setIsCheckingSession(false);
  }, [router, isAuthenticated, session]);

  if (isCheckingSession || !session) {
    return (
      <div className="bg-[#f5f3ef] min-h-screen flex items-center justify-center font-sans">
        <div className="w-10 h-10 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const navItemsMain = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "CRM & Inbox", href: "/dashboard/crm", icon: Users },
    { name: "Visual flows", href: "/dashboard/flows", icon: GitBranch },
    { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  ];

  const navItemsAutomation = [
    { name: "Bulk messages", href: "/dashboard/bulk-messages", icon: MessageCircle },
    { name: "Comment replies", href: "/dashboard/comment-replies", icon: MessageSquare },
    { name: "Story replies", href: "/dashboard/story-replies", icon: ImageIcon },
    { name: "Keyword triggers", href: "/dashboard/keywords", icon: Key },
  ];

  const navItemsAccount = [
    { name: "Connected Accounts", href: "/dashboard/accounts", icon: Share2 },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Coins & Wallet", href: "/dashboard/wallet", icon: Coins },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const renderNavGroup = (title: string, items: typeof navItemsMain) => (
    <div className="mb-2">
      <div className="text-[10px] font-medium text-[rgba(255,255,255,0.25)] px-[16px] pt-[12px] pb-[4px] tracking-[0.8px] uppercase">
        {title}
      </div>
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link 
            key={item.name}
            href={item.href} 
            className={`flex items-center gap-[9px] px-[16px] py-[8px] mx-[8px] rounded-[8px] text-[12.5px] transition-all duration-150 ${
              isActive 
                ? "bg-[rgba(255,255,255,0.1)] text-white" 
                : "text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.85)]"
            }`}
          >
            <Icon className="w-[15px] h-[15px] shrink-0" strokeWidth={isActive ? 2.5 : 2} />
            {item.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="bg-[#f5f3ef] min-h-screen font-sans text-[#1a1a18] p-0 md:p-4 flex flex-col md:flex-row h-screen">
      
      <div className="flex-1 w-full h-full flex flex-col md:flex-row bg-[#f5f3ef] overflow-hidden md:border md:border-[#e0ddd6] md:rounded-[16px] relative z-10">
        
        {/* MOBILE SIDEBAR OVERLAY */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* SIDEBAR NAVIGATION */}
        <motion.aside
          className={`fixed md:relative inset-y-0 left-0 w-[210px] bg-[#0f1117] flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center gap-[8px] px-[16px] pb-[16px] pt-[18px] border-b border-[rgba(255,255,255,0.08)] mb-[8px]">
            <Link href="/dashboard" className="flex items-center gap-[8px]">
              <div className="w-[28px] h-[28px] bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] rounded-[7px] flex items-center justify-center font-bold text-white text-[13px] shrink-0">
                S
              </div>
              <span className="font-semibold text-[13px] text-white tracking-[0.3px]">
                set2send
              </span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-white/50 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col overflow-y-auto">
            {renderNavGroup("Main", navItemsMain)}
            {renderNavGroup("Automation", navItemsAutomation)}
            {renderNavGroup("Account", navItemsAccount)}
          </nav>

          <div className="mt-auto px-[16px] pt-[12px] pb-[16px] border-t border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center shrink-0 text-white font-bold text-[10px]">
                {(session?.fullName || session?.name || "U").substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-[rgba(255,255,255,0.7)] truncate">{session?.fullName || session?.name}</div>
                <div className="text-[10px] text-[rgba(255,255,255,0.35)] truncate">{session?.email}</div>
              </div>
              <button
                onClick={() => {
                  clearAuth();
                  router.push("/");
                }}
                className="ml-auto text-[rgba(255,255,255,0.5)] hover:text-white p-1 rounded-md hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </motion.aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f5f3ef] h-full overflow-hidden">
          {/* MOBILE HEADER ONLY (Since desktop topbar is in page.tsx) */}
          <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#e8e5de]">
            <button onClick={() => setIsSidebarOpen(true)} className="text-[#1a1a18]">
              <Menu size={24} />
            </button>
            <div className="w-[24px] h-[24px] bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] rounded-[6px] flex items-center justify-center font-bold text-white text-[11px] shrink-0">
              S
            </div>
            <Link href="/dashboard/wallet" className="inline-flex items-center gap-1 rounded-md border border-[#e8d5a0] bg-[#fdf8ee] px-2 py-1 text-[11px] font-semibold text-[#9a7b3a]">
              <Coins size={13} /> {wallet?.balance ?? 0}
            </Link>
          </header>

          {/* Dynamic Page Content */}
          {children}

        </main>
      </div>
    </div>
  );
}

