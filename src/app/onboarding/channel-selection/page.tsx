"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

// Inline Premium Brand SVGs to prevent dependency failure
const InstagramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const MessengerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.31 14.793l-3.048-3.253-5.947 3.253 6.54-6.942 3.048 3.253 5.947-3.253-6.54 6.942z" />
  </svg>
);

const TikTokIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.07-2.88-.54-4.08-1.37-.41-.29-.77-.62-1.09-.99v6.02c0 1.93-.53 3.89-1.74 5.37-1.46 1.86-3.88 2.94-6.26 2.82-2.55-.08-5.02-1.51-6.19-3.83-1.47-2.82-1.07-6.59 1.05-8.98 1.67-1.89 4.29-2.78 6.78-2.31v4.11c-1.53-.47-3.27-.05-4.36 1.06-1.12 1.15-1.39 3.05-.63 4.5.73 1.42 2.37 2.27 3.96 2.09 1.67-.14 3.12-1.44 3.29-3.11.05-.44.03-.89.03-1.33V.02z" />
  </svg>
);

const TelegramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.61l-1.91 9c-.14.65-.53.81-1.08.5l-2.91-2.15-1.4 1.35c-.15.15-.28.28-.58.28l.2-2.94 5.35-4.83c.23-.21-.05-.32-.35-.12L10.02 12.5l-2.85-.89c-.62-.2-.63-.62.13-.92l11.13-4.29c.52-.19.97.12.83.71z" />
  </svg>
);

const channels = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Automate DMs, comments, stories, and growth loops.",
    icon: <InstagramIcon className="w-6 h-6" />,
    color: "from-pink-500 via-purple-600 to-indigo-500",
    borderHover: "hover:border-pink-500/50",
    shadow: "shadow-pink-500/10",
    link: "/onboarding/instagram"
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Auto-reply to comments and DM requests instantly.",
    icon: <TikTokIcon className="w-6 h-6" />,
    color: "from-cyan-400 via-zinc-800 to-rose-500",
    borderHover: "hover:border-cyan-500/50",
    shadow: "shadow-cyan-500/10",
    link: "/onboarding/tiktok"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Connect with high-intent users on the world's standard app.",
    icon: <WhatsAppIcon className="w-6 h-6" />,
    color: "from-emerald-400 to-teal-600",
    borderHover: "hover:border-emerald-500/50",
    shadow: "shadow-emerald-500/10",
    link: "/onboarding/whatsapp"
  },
  {
    id: "messenger",
    name: "Messenger",
    description: "Scale Page comments and inbox messenger automation.",
    icon: <MessengerIcon className="w-6 h-6" />,
    color: "from-blue-500 via-indigo-500 to-purple-500",
    borderHover: "hover:border-blue-500/50",
    shadow: "shadow-blue-500/10",
    link: "/onboarding/messenger"
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Deploy customer support and community notification bots.",
    icon: <TelegramIcon className="w-6 h-6" />,
    color: "from-sky-400 to-blue-600",
    borderHover: "hover:border-sky-500/50",
    shadow: "shadow-sky-500/10",
    link: "/onboarding/telegram"
  }
];

export default function ChannelSelectionPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("active_session");
    if (!session) {
      router.push("/signin");
      return;
    }
    try {
      const parsed = JSON.parse(session);
      if (parsed) {
        if (parsed.onboardingCompleted || parsed.onboarding_completed) {
          router.push("/dashboard");
          return;
        }
        if (!parsed.profileStepCompleted) {
          router.push("/onboarding/profile");
          return;
        }
      }
      setIsChecking(false);
    } catch (e) {
      localStorage.removeItem("active_session");
      router.push("/signin");
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-purple-550 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* Background glow effects */}
      <div className="absolute top-[5%] left-[20%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[90px] pointer-events-none"></div>

      {/* ==================================================
          LEFT SIDE: SPLIT ILLUSTRATION
          ================================================== */}
      <div className="col-span-12 md:col-span-5 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-8 sm:p-12 flex flex-col justify-between items-start text-left relative overflow-hidden min-h-[35vh] md:min-h-screen border-r border-[#E8E4D9] z-10">
        
        {/* Soft background glow filters */}
        <div className="absolute top-[15%] right-[-10%] w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[-20%] w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Brand Header */}
        <Link
          href="/"
          className="flex items-center gap-2 font-sans font-black text-white text-2xl tracking-tighter relative z-10 select-none"
        >
          <span className="w-8 h-8 rounded-lg bg-gray-50 text-[#f97316] flex items-center justify-center font-extrabold shadow-md">S</span>
          <span>set2send</span>
        </Link>

        {/* Central Rocket Onboarding Illustration */}
        <div className="my-auto py-8 relative z-10 w-full flex flex-col items-start gap-8">
          
          <div className="relative w-full h-48 flex items-center justify-center">
            
            {/* Launchpad ring */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 25,
                ease: "linear",
              }}
              className="absolute w-36 h-36 rounded-full border border-dashed border-purple-500/20 flex items-center justify-center"
            >
              <div className="w-28 h-28 rounded-full border border-gray-200 bg-gray-50/20"></div>
            </motion.div>

            {/* Glowing flame launch trail */}
            <motion.div
              animate={{
                y: [0, -4, 4, 0],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className="absolute w-12 h-24 bg-gradient-to-t from-transparent via-amber-500/25 to-pink-500/30 blur-md rounded-full -bottom-4 z-0"
            ></motion.div>

            {/* Rocket Icon Graphic */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
              }}
              className="z-10 bg-white/90 border border-gray-200 p-5 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] text-center flex flex-col items-center justify-center"
            >
              <span className="text-4xl">🚀</span>
              <div className="flex gap-1.5 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">ONBOARDING ACTIVE</span>
              </div>
            </motion.div>

            {/* Floating Connection Nodes */}
            <motion.div
              animate={{ x: [0, 8, 0], y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-4 right-16 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>

            <motion.div
              animate={{ x: [0, -6, 0], y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-8 left-16 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold"
            >
              +API
            </motion.div>

          </div>

          <div className="max-w-md">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Where would you like to start?
            </h2>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed font-medium">
              Select your primary marketing and outreach channel. Don't worry, you can easily connect additional channels to your Set2Send workspace anytime later.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] font-mono text-white/40 tracking-wider relative z-10 select-none hidden md:block">
          SET2SEND PROVISIONING ENGINE v2.4
        </div>

      </div>

      {/* ==================================================
          RIGHT SIDE: CHANNEL SELECTORS LIST
          ================================================== */}
      <div className="col-span-12 md:col-span-7 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 bg-[#FAF9F6] z-10 relative">
        
        {/* Sign In top alternative redirect */}
        <div className="absolute top-6 right-8 text-xs font-semibold text-gray-500 z-20">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#f97316] hover:underline font-bold">
            Sign In
          </Link>
        </div>

        <div className="w-full max-w-[540px] flex flex-col gap-8 my-auto">
          
          <div className="text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">Choose a Channel</h3>
            <p className="text-gray-400 text-xs mt-1.5 font-medium">Click on a platform below to begin your custom setup flow</p>
          </div>

          {/* Cards Grid */}
          <div className="flex flex-col gap-4">
            {channels.map((ch, idx) => (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                whileHover={{ y: -2, scale: 1.01 }}
                className="w-full"
              >
                <Link
                  href={ch.link}
                  className={`block p-5 rounded-2xl bg-white/40 border border-gray-200/80 hover:border-gray-300/85 transition-all shadow-md hover:shadow-lg hover:${ch.shadow} backdrop-blur-md cursor-pointer group`}
                >
                  <div className="flex items-center gap-5 justify-between">
                    
                    {/* Left Icon + Text */}
                    <div className="flex items-center gap-4.5">
                      
                      {/* Gradient-bg brand icon wrapper */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${ch.color} flex items-center justify-center text-white shadow-md transform group-hover:scale-105 transition-transform duration-300`}>
                        {ch.icon}
                      </div>

                      <div className="text-left">
                        <h4 className="text-sm font-black text-white group-hover:text-white/95 transition-colors">
                          {ch.name}
                        </h4>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed font-medium">
                          {ch.description}
                        </p>
                      </div>

                    </div>

                    {/* Right Arrow Indicator */}
                    <div className="w-8 h-8 rounded-full bg-gray-100/40 border border-gray-200 text-gray-400 flex items-center justify-center shrink-0 group-hover:bg-[#f97316] group-hover:text-zinc-950 group-hover:border-transparent transition-all duration-300">
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Security details indicator */}
          <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-medium justify-center select-none mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
            <span>All authentication procedures run via secure encrypted OAuth 2.0 gates.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
