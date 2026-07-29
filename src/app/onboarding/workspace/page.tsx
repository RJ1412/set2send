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
  Building,
  Users,
  Globe,
  Terminal,
  Sparkles
} from "lucide-react";

export default function WorkspaceSetupPage() {
  const router = useRouter();

  // Workspace forms
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [teamName, setTeamName] = useState("Marketing Team");
  const [workspaceSlug, setWorkspaceSlug] = useState("my-workspace");
  const [workspaceId, setWorkspaceId] = useState("");

  // Loaders / Session
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishStatus, setFinishStatus] = useState("");

  // Generate unique workspace ID on mount
  useEffect(() => {
    const randomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    const wspId = `wsp_${randomHex()}${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}`;
    setWorkspaceId(wspId);

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
        if (parsed.email === "demo@set2send.com") {
          router.push("/signin");
          return;
        }
      }
      setSessionUser(parsed);
      if (parsed.company) {
        setWorkspaceName(`${parsed.company} Space`);
        setWorkspaceSlug(parsed.company.toLowerCase().replace(/[^a-z0-9]/g, "-"));
      } else if (parsed.name) {
        setWorkspaceName(`${parsed.name.split(" ")[0]}'s Space`);
        setWorkspaceSlug(`${parsed.name.split(" ")[0].toLowerCase()}-space`);
      }
    } catch (e) {
      router.push("/signin");
    }
  }, [router]);

  // Sync workspace slug on name edit
  const handleNameChange = (val: string) => {
    setWorkspaceName(val);
    setWorkspaceSlug(val.toLowerCase().replace(/[^a-z0-9]/g, "-"));
  };

  const handleLaunchWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFinishing(true);

    // Simulated provisioning script status
    setFinishStatus("Creating workspace schema...");
    
    setTimeout(() => {
      setFinishStatus("Allocating API webhook listeners...");
    }, 700);

    setTimeout(() => {
      setFinishStatus("Compiling initial flow blueprints...");
    }, 1450);

    setTimeout(() => {
      setFinishStatus("Indexing vector telemetry databases...");
    }, 2100);

    setTimeout(() => {
      // Complete workspace
      const updatedSession = {
        ...sessionUser,
        workspaceName,
        teamName,
        workspaceUrl: `set2send.com/workspaces/${workspaceSlug}`,
        workspaceId,
        onboardingCompleted: true,
        onboarding_completed: true
      };

      localStorage.setItem("active_session", JSON.stringify(updatedSession));

      // Update user database
      const usersList = JSON.parse(localStorage.getItem("users_db") || "[]");
      const userIdx = usersList.findIndex((u: any) => u.email === sessionUser.email);
      if (userIdx >= 0) {
        usersList[userIdx] = { ...usersList[userIdx], ...updatedSession };
        localStorage.setItem("users_db", JSON.stringify(usersList));
      }

      setFinishStatus("Launching Set2Send console...");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }, 2800);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-purple-900/10 via-zinc-900/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      {/* Provisioning overlay loading screen */}
      <AnimatePresence>
        {isFinishing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 mb-8"
            ></motion.div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">Provisioning Workspace</h2>
            <p className="text-gray-500 text-xs sm:text-sm font-mono mt-3 uppercase tracking-wider">{finishStatus}</p>
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
            <span className="text-[9px] font-mono font-bold text-[#f97316] uppercase tracking-widest border border-[#f97316]/20 bg-[#f97316]/10 px-2.5 py-1 rounded-full">STEP 8 OF 8</span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight mt-4">
              Initialize Workspace
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
              Create your secure sandbox. Your custom endpoint pathing and unique Workspace ID parameters are registered for API webhook dispatches.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-xs font-mono font-bold text-gray-400 text-left">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>5. CHANNEL SELECTION</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>6. BUSINESS GOAL</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>7. TEMPLATE SELECTION</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-[10px] animate-pulse">8</span>
              <span>8. WORKSPACE CREATION</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-white/50 tracking-wider relative z-10 select-none hidden md:block">
          SECURE SANDBOX INITIALIZER
        </div>
      </div>

      {/* RIGHT SIDE: WORKSPACE SETUP FORM */}
      <div className="col-span-12 md:col-span-8 flex items-center justify-center p-6 sm:p-12 bg-[#FAF9F6] z-10 overflow-y-auto">
        <div className="w-full max-w-[520px] my-auto">
          
          <div className="text-left mb-8">
            <h3 className="text-2xl font-black text-white">Workspace Settings</h3>
            <p className="text-gray-400 text-xs mt-1.5 font-medium">Configure properties for your organization sandbox.</p>
          </div>

          <form onSubmit={handleLaunchWorkspace} className="flex flex-col gap-5 text-left text-xs font-semibold">
            
            {/* Workspace Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                <span>Workspace Name</span>
              </label>
              <input
                type="text"
                required
                value={workspaceName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My Workspace"
                className="w-full bg-[#0c0c0e]/80 border border-zinc-850 hover:border-gray-200 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white outline-none transition-colors"
              />
            </div>

            {/* Team Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span>Team Name</span>
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Marketing Team"
                className="w-full bg-[#0c0c0e]/80 border border-zinc-850 hover:border-gray-200 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white outline-none transition-colors"
              />
            </div>

            {/* Custom Slug URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span>Workspace URL</span>
              </label>
              <div className="flex items-center">
                <span className="bg-[#0c0c0e]/80 border border-zinc-850 border-r-0 rounded-l-xl py-3 px-3.5 text-xs text-gray-400 select-none">
                  set2send.com/workspaces/
                </span>
                <input
                  type="text"
                  required
                  value={workspaceSlug}
                  onChange={(e) => setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"))}
                  placeholder="slug-name"
                  className="flex-grow bg-[#0c0c0e]/80 border border-zinc-850 focus:border-purple-500 rounded-r-xl py-3 px-3 text-xs text-white outline-none transition-colors"
                />
              </div>
            </div>

            {/* Auto Generated Workspace ID */}
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-gray-50 border border-zinc-850/60 font-mono mt-2">
              <div className="text-[9px] text-[#f97316] font-bold uppercase tracking-wider flex items-center gap-1">
                <Terminal className="w-3 h-3 text-[#f97316]/80" />
                <span>WORKSPACE ID (GENERATED)</span>
              </div>
              <div className="text-gray-600 font-bold text-xs select-all">
                {workspaceId || "wsp_allocating..."}
              </div>
            </div>

            {/* Final Launch Button */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#E8E4D9]/80">
              <Link
                href="/onboarding/templates"
                className="px-6 py-3.5 bg-white/60 hover:bg-gray-100/80 text-gray-500 hover:text-zinc-200 border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Link>

              <button
                type="submit"
                className="px-8 py-3.5 bg-[#f97316] hover:bg-[#e0650d] text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] shadow-[#f97316]/10"
              >
                <span>Launch Workspace</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}
