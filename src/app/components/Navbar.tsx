"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

// Platform icons
export const InstagramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const MessengerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.31 14.793l-3.048-3.253-5.947 3.253 6.54-6.942 3.048 3.253 5.947-3.253-6.54 6.942z" />
  </svg>
);

export const TikTokIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.07-2.88-.54-4.08-1.37-.41-.29-.77-.62-1.09-.99v6.02c0 1.93-.53 3.89-1.74 5.37-1.46 1.86-3.88 2.94-6.26 2.82-2.55-.08-5.02-1.51-6.19-3.83-1.47-2.82-1.07-6.59 1.05-8.98 1.67-1.89 4.29-2.78 6.78-2.31v4.11c-1.53-.47-3.27-.05-4.36 1.06-1.12 1.15-1.39 3.05-.63 4.5.73 1.42 2.37 2.27 3.96 2.09 1.67-.14 3.12-1.44 3.29-3.11.05-.44.03-.89.03-1.33V.02z" />
  </svg>
);

export const AISparkIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m10.607 10.607l.707.707M10 8.5L8.5 10l-1.5-1.5L8.5 7L10 8.5zm7 5l-1 1-1-1 1-1 1 1z" />
  </svg>
);

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<"product" | "solutions" | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<"product" | "solutions" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, clearAuth } = useAuthStore();
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  // Check scroll position to style navbar dynamically
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";

  // Check route to determine layout styling (e.g. background and text color)
  const isProductPage = pathname.startsWith("/product/");
  const isSolutionsPage = pathname.startsWith("/solutions/");
  const isUsecasePage = pathname.startsWith("/use-cases/") || pathname.startsWith("/usecase/");
  const isSubPage = isProductPage || isSolutionsPage || isUsecasePage;

  // Specific path color themes
  const isInstagramPage = pathname === "/product/instagram";
  const isWhatsAppPage = pathname === "/product/whatsapp";
  const isMessengerPage = pathname === "/product/messenger";
  const isTikTokPage = pathname === "/product/tiktok";
  const isAiPage = pathname === "/product/set2send-ai";
  const isCreatorsPage = pathname === "/solutions/creators" || pathname === "/solutions/contentcreators";
  const isDarkNavbarPage = pathname === "/contact" || pathname === "/privacy-policy" || pathname === "/terms-of-service" || pathname === "/security-hub";
  const isLightPage = pathname === "/use-cases/collect-emails" || pathname === "/pricing" || pathname === "/usecase/email" || pathname === "/use-cases/follow-to-dm" || pathname === "/use-cases/request-to-follow" || pathname === "/use-cases/respond-to-comments" || (pathname.startsWith("/solutions/") && !isCreatorsPage);

  const navbarBgClass = scrolled
    ? isInstagramPage
      ? "bg-[#6E2CF4]/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white"
      : isWhatsAppPage
      ? "bg-[#0B8A5A]/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white"
      : isMessengerPage
      ? "bg-[#1877F2]/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white"
      : isTikTokPage
      ? "bg-black/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white"
      : isAiPage
      ? "bg-[#F97316]/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white"
      : isCreatorsPage
      ? "bg-black/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white"
      : isSolutionsPage
      ? "bg-[#F7F7F7]/95 backdrop-blur-md border-b border-zinc-200 shadow-md text-zinc-900"
      : "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-md text-zinc-900"
    : isDarkNavbarPage
    ? "bg-[#1A1A1A]/98 backdrop-blur-md border-b border-[#D4AF37]/30 text-white shadow-[0_4px_20px_rgba(212,175,55,0.1)]"
    : isLightPage
    ? "bg-white/40 backdrop-blur-md border-b border-zinc-200/50 text-zinc-900 shadow-sm"
    : isCreatorsPage
    ? "bg-transparent backdrop-blur-[12px] border-b border-white/10 text-white"
    : isProductPage
    ? "bg-transparent text-white"
    : isSubPage
    ? "bg-transparent text-white"
    : "bg-[#FAF9F6]/85 backdrop-blur-[12px] border-b border-[#C9A84C]/25 text-[#F2EDE4]"; // default royal hero style

  const headerClass = isHomePage
    ? `fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 rounded-full border transition-all duration-300 ${
        scrolled
          ? "bg-white/85 border-zinc-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md text-zinc-900 py-3"
          : "bg-black/20 border-white/10 shadow-2xl backdrop-blur-md text-white py-4"
      }`
    : `fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 ${navbarBgClass}`;

  const textLinkClass = isHomePage
    ? scrolled
      ? "text-zinc-700 hover:text-zinc-950 font-[family-name:var(--font-inter)] transition-all duration-200 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#C9A84C] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
      : "text-white/80 hover:text-white font-[family-name:var(--font-inter)] transition-all duration-200 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#C9A84C] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
    : isDarkNavbarPage && !scrolled
    ? "text-white/80 hover:text-[#D4AF37] font-[family-name:var(--font-inter)] transition-all duration-200 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#D4AF37] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
    : isLightPage && !scrolled
    ? "text-zinc-700 hover:text-zinc-900"
    : isCreatorsPage
    ? "text-white/90 hover:text-[#FF7A1A] transition-colors"
    : isSubPage && !scrolled
    ? "text-white/80 hover:text-white"
    : scrolled
    ? (isInstagramPage || isWhatsAppPage || isMessengerPage || isTikTokPage || isAiPage)
      ? "text-white/80 hover:text-white"
      : "text-zinc-700 hover:text-zinc-900"
    : "text-[#F2EDE4]/80 hover:text-[#F2EDE4] font-[family-name:var(--font-inter)] transition-all duration-200 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#C9A84C] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200";

  const logoColorClass = isHomePage
    ? scrolled
      ? "text-zinc-900"
      : "text-white"
    : isDarkNavbarPage && !scrolled
    ? "text-white"
    : isLightPage && !scrolled
    ? "text-zinc-900"
    : isSubPage && !scrolled
    ? "text-white"
    : scrolled
    ? (isInstagramPage || isWhatsAppPage || isMessengerPage || isTikTokPage || isAiPage || isCreatorsPage)
      ? "text-white"
      : "text-zinc-900"
    : "text-[#F2EDE4]";

  const buttonOutlineClass = isHomePage
    ? scrolled
      ? "border border-zinc-300 hover:border-[#E8E4D9] hover:bg-zinc-50 text-zinc-900"
      : "border border-[#C9A84C] bg-[#C9A84C]/10 text-white hover:bg-[#C9A84C] hover:text-[#0A0E1A] transition-all duration-200 ease-in"
    : isDarkNavbarPage && !scrolled
    ? "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-all duration-200 ease-in"
    : isLightPage && !scrolled
    ? "border-zinc-300 hover:border-[#E8E4D9] hover:bg-zinc-50 text-zinc-900"
    : isSubPage && !scrolled
    ? "border-white/30 hover:border-white hover:bg-white/10 text-white"
    : scrolled
    ? (isInstagramPage || isWhatsAppPage || isMessengerPage || isTikTokPage || isAiPage || isCreatorsPage)
      ? "border-white/30 hover:border-white hover:bg-white/10 text-white"
      : "border-zinc-300 hover:border-[#E8E4D9] hover:bg-zinc-50 text-zinc-900"
    : "border border-[#C9A84C] bg-transparent text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0E1A] transition-all duration-200 ease-in";

  const handleMouseEnter = (menu: "product" | "solutions") => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180); // 180ms delay to smooth cursor transition
  };

  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    };
  }, []);

  const productMenuItems = [
    {
      name: "Instagram",
      route: "/product/instagram",
      description: "Automate your Instagram Marketing",
      icon: <InstagramIcon className="w-6 h-6 text-white" />,
      iconBg: "bg-gradient-to-tr from-[#FFB703] via-[#FD1D1D] to-[#833AB4]",
    },
    {
      name: "WhatsApp",
      route: "/product/whatsapp",
      description: "Connect with your customers instantly",
      icon: <WhatsAppIcon className="w-5 h-5 text-white" />,
      iconBg: "bg-[#25D366]",
    },
    {
      name: "Set2Send AI",
      route: "/product/set2send-ai",
      description: "Smart Conversations Powered by Automation",
      icon: <AISparkIcon className="w-5 h-5 text-white" />,
      iconBg: "bg-gradient-to-tr from-[#F97316] to-[#EC4899]",
    },
  ];

  const solutionsMenuItems = {
    businessTypes: [
      { name: "For Creators", route: "/solutions/creators", desc: "Turn views into fans & buyers" },
      { name: "For eCommerce", route: "/solutions/ecommerce", desc: "Recover carts & sell catalog products" },
      { name: "For SM Marketers", route: "/solutions/marketers", desc: "Manage communities at scale" },
      { name: "For Brands", route: "/solutions/brands", desc: "Build stronger customer relationships" },
    ],
    useCases: [
      { name: "Collect Emails", route: "/use-cases/collect-emails", desc: "Generate list growth via DMs" },
      { name: "Request To Follow", route: "/use-cases/request-to-follow", desc: "Acquire followers automatically" },
      { name: "Respond To Comments", route: "/use-cases/respond-to-comments", desc: "Auto-reply to all video comments" },
      { name: "Follow To DM", route: "/use-cases/follow-to-dm", desc: "Deliver links to followers only" },
    ],
  };

  return (
    <>
      <header
        className={headerClass}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo & Lang Selector */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 font-sans font-black text-2xl tracking-tighter ${logoColorClass}`}
            >
              <span className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#C9A84C] text-[#C9A84C] flex items-center justify-center font-extrabold shadow-md">S</span>
              <span>set2send</span>
            </Link>
            
            {/* Lang Dropdown */}
            <div className={`hidden sm:flex items-center gap-1 text-[11px] font-bold opacity-80 cursor-pointer hover:opacity-100 uppercase tracking-wider ${logoColorClass}`}>
              <span>EN</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-extrabold uppercase tracking-widest">
            {/* PRODUCT Link */}
            <div
              className="relative py-2 cursor-pointer group"
              onMouseEnter={() => handleMouseEnter("product")}
              onMouseLeave={handleMouseLeave}
            >
              <span className={`flex items-center gap-1 ${textLinkClass}`}>
                Product
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </span>
            </div>

            {/* SOLUTIONS Link */}
            <div
              className="relative py-2 cursor-pointer group"
              onMouseEnter={() => handleMouseEnter("solutions")}
              onMouseLeave={handleMouseLeave}
            >
              <span className={`flex items-center gap-1 ${textLinkClass}`}>
                Solutions
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </span>
            </div>

            <Link href="/pricing" className={textLinkClass}>Pricing</Link>
            <Link href="/contact" className={textLinkClass}>Contacts</Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-[11px] px-5 py-2.5 font-extrabold rounded-full transition-all uppercase tracking-widest ${buttonOutlineClass}`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`text-[11px] font-extrabold transition-colors uppercase tracking-widest ${logoColorClass} opacity-80 hover:opacity-100`}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className={`text-[11px] px-5 py-2.5 font-extrabold rounded-full transition-all uppercase tracking-widest ${buttonOutlineClass}`}
                >
                  Get Started
                </Link>
                <Link
                  href="/signin"
                  className={`text-[11px] font-extrabold transition-colors uppercase tracking-widest ${logoColorClass} opacity-80 hover:opacity-100`}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger trigger */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg ${logoColorClass}`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menus */}
        <AnimatePresence>
          {/* PRODUCT MENU */}
          {activeMenu === "product" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={() => handleMouseEnter("product")}
              onMouseLeave={handleMouseLeave}
              className={`absolute top-full left-1/2 -translate-x-1/2 w-[90vw] max-w-5xl mt-3 z-50 rounded-[24px] border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden backdrop-blur-md transition-all duration-300 ${
                isHomePage && !scrolled
                  ? "bg-black/90 border-white/10 text-white"
                  : "bg-[#F5F5F5] border-zinc-200/85 text-zinc-900"
              }`}
            >
              <div className="p-8 grid grid-cols-3 gap-6">
                {productMenuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.route}
                    onClick={() => setActiveMenu(null)}
                    className="block group"
                  >
                    <div className={`rounded-2xl p-6 h-full flex flex-col items-center text-center transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md cursor-pointer border border-transparent ${
                      isHomePage && !scrolled
                        ? "bg-white/5 hover:bg-white/10 hover:border-white/10 text-white"
                        : "bg-[#EAEAEA]/40 hover:bg-white text-zinc-900 hover:border-zinc-200/50"
                    }`}>
                      <div className={`w-12 h-12 ${item.iconBg} rounded-full flex items-center justify-center shadow-md mb-4 shrink-0 transform group-hover:scale-110 transition-transform duration-350`}>
                        {item.icon}
                      </div>
                      <h4 className={`font-extrabold text-sm tracking-tight leading-snug ${
                        isHomePage && !scrolled ? "text-white" : "text-zinc-900"
                      }`}>
                        {item.name}
                      </h4>
                      <p className={`font-medium text-[11px] leading-relaxed mt-2 flex-grow ${
                        isHomePage && !scrolled ? "text-zinc-400" : "text-gray-400"
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* SOLUTIONS MENU */}
          {activeMenu === "solutions" && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={() => handleMouseEnter("solutions")}
              onMouseLeave={handleMouseLeave}
              className={`absolute top-full left-1/2 -translate-x-1/2 w-[80vw] max-w-5xl mt-3 z-50 rounded-[24px] border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] overflow-hidden backdrop-blur-md transition-all duration-300 ${
                isHomePage && !scrolled
                  ? "bg-black/90 border-white/10 text-white"
                  : "bg-[#F7F7F7] border-zinc-200/80 text-zinc-900"
              }`}
            >
              <div className="p-10 grid grid-cols-2 gap-12 text-left">
                {/* Left Column: Business Type */}
                <div className="flex flex-col gap-6">
                  <h5 className={`text-[10px] font-bold font-mono tracking-widest uppercase border-b pb-2 ${
                    isHomePage && !scrolled ? "text-zinc-500 border-white/10" : "text-gray-500 border-zinc-200 pb-2"
                  }`}>
                    BY BUSINESS TYPE
                  </h5>
                  <div className="flex flex-col gap-4">
                    {solutionsMenuItems.businessTypes.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.route}
                        onClick={() => setActiveMenu(null)}
                        className="group flex flex-col items-start cursor-pointer"
                      >
                        <span className={`font-black text-sm tracking-tight transition-transform duration-200 hover:translate-x-1.5 block ${
                          isHomePage && !scrolled ? "text-white hover:text-white" : "text-zinc-900 hover:text-zinc-950"
                        }`}>
                          {item.name}
                        </span>
                        <span className={`text-[10px] font-medium mt-0.5 ${
                          isHomePage && !scrolled ? "text-zinc-400" : "text-gray-400"
                        }`}>
                          {item.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right Column: Use Case */}
                <div className={`flex flex-col gap-6 border-l pl-12 ${
                  isHomePage && !scrolled ? "border-white/10" : "border-zinc-200/80"
                }`}>
                  <h5 className={`text-[10px] font-bold font-mono tracking-widest uppercase border-b pb-2 ${
                    isHomePage && !scrolled ? "text-zinc-500 border-white/10" : "text-gray-500 border-zinc-200 pb-2"
                  }`}>
                    BY USE CASE
                  </h5>
                  <div className="flex flex-col gap-4">
                    {solutionsMenuItems.useCases.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.route}
                        onClick={() => setActiveMenu(null)}
                        className="group flex flex-col items-start cursor-pointer"
                      >
                        <span className={`font-black text-sm tracking-tight transition-transform duration-200 hover:translate-x-1.5 block ${
                          isHomePage && !scrolled ? "text-white hover:text-white" : "text-zinc-900 hover:text-zinc-950"
                        }`}>
                          {item.name}
                        </span>
                        <span className={`text-[10px] font-medium mt-0.5 ${
                          isHomePage && !scrolled ? "text-zinc-400" : "text-gray-400"
                        }`}>
                          {item.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-zinc-950/98 backdrop-blur-xl flex flex-col pt-24 px-6 pb-8 text-white md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-lg font-bold tracking-wide text-left mb-8">
              
              {/* Mobile Product Accordion */}
              <div className="border-b border-zinc-800 pb-4">
                <button
                  onClick={() => setActiveMobileDropdown(activeMobileDropdown === "product" ? null : "product")}
                  className="flex items-center justify-between w-full text-zinc-200 hover:text-white uppercase tracking-wider text-sm font-extrabold"
                >
                  <span>Product</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${activeMobileDropdown === "product" ? "rotate-180" : ""}`} />
                </button>
                
                {activeMobileDropdown === "product" && (
                  <div className="flex flex-col gap-4 mt-4 pl-4 border-l border-zinc-800">
                    {productMenuItems.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.route}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                          {React.cloneElement(item.icon, { className: "w-4 h-4 text-white" })}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold leading-none">{item.name}</p>
                          <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Solutions Accordion */}
              <div className="border-b border-zinc-800 pb-4">
                <button
                  onClick={() => setActiveMobileDropdown(activeMobileDropdown === "solutions" ? null : "solutions")}
                  className="flex items-center justify-between w-full text-zinc-200 hover:text-white uppercase tracking-wider text-sm font-extrabold"
                >
                  <span>Solutions</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${activeMobileDropdown === "solutions" ? "rotate-180" : ""}`} />
                </button>
                
                {activeMobileDropdown === "solutions" && (
                  <div className="flex flex-col gap-6 mt-4 pl-4 border-l border-zinc-800 text-left">
                    <div>
                      <p className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase mb-2 font-mono">By Business Type</p>
                      <div className="flex flex-col gap-3">
                        {solutionsMenuItems.businessTypes.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.route}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-zinc-400 hover:text-white text-xs font-bold py-1"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase mb-2 font-mono">By Use Case</p>
                      <div className="flex flex-col gap-3">
                        {solutionsMenuItems.useCases.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.route}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-zinc-400 hover:text-white text-xs font-bold py-1"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-zinc-800 pb-4 text-zinc-200 hover:text-white uppercase tracking-wider text-sm font-extrabold">Pricing</Link>
              <Link href="/contact" className="border-b border-zinc-800 pb-4 text-zinc-200 hover:text-white uppercase tracking-wider text-sm font-extrabold">Contacts</Link>
            </div>

            {/* Mobile CTAs */}
            <div className="mt-auto flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold rounded-full uppercase tracking-wider text-xs shadow-md transition-all"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center py-4 bg-transparent border border-gray-300 hover:bg-gray-100/50 text-white font-extrabold rounded-full uppercase tracking-wider text-xs transition-all"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold rounded-full uppercase tracking-wider text-xs shadow-md transition-all"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-4 bg-transparent border border-gray-300 hover:bg-gray-100/50 text-white font-extrabold rounded-full uppercase tracking-wider text-xs transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
