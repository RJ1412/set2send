"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  MapPin, 
  Globe, 
  Phone, 
  Building, 
  Briefcase, 
  Camera, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

// Standard countries
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" }
];

// Standard timezones
const timezones = [
  { value: "EST", label: "Eastern Standard Time (EST)" },
  { value: "CST", label: "Central Standard Time (CST)" },
  { value: "PST", label: "Pacific Standard Time (PST)" },
  { value: "GMT", label: "Greenwich Mean Time (GMT)" },
  { value: "CET", label: "Central European Time (CET)" },
  { value: "IST", label: "Indian Standard Time (IST)" },
  { value: "AEST", label: "Australian Eastern Time (AEST)" }
];

const industries = [
  { id: "creator", label: "Creator / Influencer" },
  { id: "agency", label: "Agency (Marketing/SM)" },
  { id: "ecommerce", label: "E-commerce Shop" },
  { id: "brand", label: "Brand / Enterprise" },
  { id: "marketing", label: "Marketing Consultant" },
  { id: "other", label: "Other Business" }
];

export default function ProfileSetupPage() {
  const router = useRouter();

  // Session user profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("prefer_not");
  const [customGender, setCustomGender] = useState("");
  const [country, setCountry] = useState("US");
  const [timezone, setTimezone] = useState("EST");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("creator");

  // Avatar Upload simulation
  const [avatar, setAvatar] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Status Loaders
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successOverlay, setSuccessOverlay] = useState(false);

  // Sync display name automatically
  useEffect(() => {
    if (firstName || lastName) {
      setDisplayName(`${firstName} ${lastName}`.trim());
    }
  }, [firstName, lastName]);

  // Load session metadata on load
  useEffect(() => {
    const sessionStr = localStorage.getItem("active_session");
    if (!sessionStr) {
      router.push("/signin");
      return;
    }
    
    try {
      const session = JSON.parse(sessionStr);
      if (session) {
        if (session.onboardingCompleted || session.onboarding_completed) {
          router.push("/dashboard");
          return;
        }
        if (session.name) {
          const parts = session.name.split(" ");
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
          setDisplayName(session.name);
        }
        if (session.image) {
          setAvatar(session.image);
        }
      }
    } catch (e) {
      router.push("/signin");
    }
  }, [router]);

  // Simulated avatar photo upload handler
  const handleUploadPhoto = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      // Select a premium demo unsplash portrait
      const demoAvatars = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
      ];
      const randomIdx = Math.floor(Math.random() * demoAvatars.length);
      setAvatar(demoAvatars[randomIdx]);
    }, 1500);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!firstName || !lastName || !displayName) {
      setErrorMsg("Names and display tags are required.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const sessionStr = localStorage.getItem("active_session");
      if (!sessionStr) {
        router.push("/signin");
        return;
      }

      const session = JSON.parse(sessionStr);
      const updatedSession = {
        ...session,
        name: displayName,
        firstName,
        lastName,
        image: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8b5cf6&color=fff`,
        gender: gender === "custom" ? customGender : gender,
        country,
        timezone,
        phone: phoneNumber || null,
        company: companyName || null,
        industry: selectedIndustry,
        profileStepCompleted: true
      };

      // Save active session
      localStorage.setItem("active_session", JSON.stringify(updatedSession));

      // Update user db record
      const usersList = JSON.parse(localStorage.getItem("users_db") || "[]");
      const userIdx = usersList.findIndex((u: any) => u.email === session.email);
      if (userIdx >= 0) {
        usersList[userIdx] = { ...usersList[userIdx], ...updatedSession };
        localStorage.setItem("users_db", JSON.stringify(usersList));
      }

      setIsLoading(false);
      setSuccessOverlay(true);

      setTimeout(() => {
        router.push("/onboarding/security");
      }, 1500);

    }, 1200);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col md:grid md:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* Background glow filters */}
      <div className="absolute top-[5%] left-[20%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <AnimatePresence>
        {successOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-450 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <ShieldCheck className="w-10 h-10 animate-bounce" />
            </motion.div>
            <motion.h2
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-black text-white"
            >
              Profile Configured!
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-xs sm:text-sm mt-2 font-medium"
            >
              Redirecting you to account security configuration...
            </motion.p>
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

        {/* Progress Timeline */}
        <div className="my-auto py-8 relative z-10 w-full flex flex-col items-start gap-8">
          <div>
            <span className="text-[9px] font-mono font-bold text-[#f97316] uppercase tracking-widest border border-[#f97316]/20 bg-[#f97316]/10 px-2.5 py-1 rounded-full">STEP 3 OF 8</span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight mt-4">
              Tell us about yourself
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
              We personalize your dashboard widgets, notification triggers, and default vectors based on your location and industry focus.
            </p>
          </div>

          {/* Stepper nodes */}
          <div className="flex flex-col gap-4 text-xs font-mono font-bold text-gray-400">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>1. REGISTRATION</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-[10px]">✓</span>
              <span>2. EMAIL VERIFICATION</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-[10px] animate-pulse">3</span>
              <span>3. PROFILE SETUP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px]">4</span>
              <span>4. ACCOUNT SECURITY</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-white/50 tracking-wider relative z-10 select-none hidden md:block">
          PROFILE PROVISIONING GATE
        </div>
      </div>

      {/* RIGHT SIDE: PROFILE FORM */}
      <div className="col-span-12 md:col-span-8 flex items-center justify-center p-6 sm:p-12 bg-[#FAF9F6] z-10 overflow-y-auto">
        <div className="w-full max-w-[580px] my-auto">
          
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6 text-left">
            
            {/* Avatar Row */}
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/30 border border-zinc-850">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center relative group shrink-0">
                {avatar ? (
                  <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7 text-zinc-650" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xs font-black text-white">Profile Photo</h4>
                <p className="text-[10px] text-gray-400 mt-1">Upload a portrait to represent your account console.</p>
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  disabled={isUploading}
                  className="mt-2 text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isUploading ? "Uploading Mockup..." : "Simulate Photo Upload"}</span>
                </button>
              </div>
            </div>

            {/* Names Input Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Julia"
                  className="w-full bg-[#0c0c0e]/80 border border-zinc-850 hover:border-gray-200 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Creative"
                  className="w-full bg-[#0c0c0e]/80 border border-zinc-855 hover:border-gray-200 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white outline-none transition-colors"
                />
              </div>
            </div>

            {/* Display name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Julia Creative"
                className="w-full bg-[#0c0c0e]/80 border border-zinc-850 hover:border-gray-200 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white outline-none transition-colors"
              />
            </div>

            {/* Gender and Custom Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#0c0c0e]/80 border border-zinc-850 focus:border-purple-500 rounded-xl py-3 px-3 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="prefer_not">Prefer Not To Say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non_binary">Non-Binary</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {gender === "custom" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-1.5"
                >
                  <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">Specify Custom Gender</label>
                  <input
                    type="text"
                    required
                    value={customGender}
                    onChange={(e) => setCustomGender(e.target.value)}
                    placeholder="Enter gender category"
                    className="w-full bg-[#0c0c0e]/80 border border-zinc-850 hover:border-gray-200 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white outline-none transition-colors"
                  />
                </motion.div>
              )}
            </div>

            {/* Country and Timezone Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3"/><span>Country</span></label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#0c0c0e]/80 border border-zinc-850 focus:border-purple-500 rounded-xl py-3 px-3 text-xs text-white outline-none cursor-pointer"
                >
                  {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Globe className="w-3 h-3"/><span>Timezone</span></label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-[#0c0c0e]/80 border border-zinc-850 focus:border-purple-500 rounded-xl py-3 px-3 text-xs text-white outline-none cursor-pointer"
                >
                  {timezones.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            {/* Optional Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Phone className="w-3 h-3"/><span>Phone Number (Optional)</span></label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +1 555-0199"
                  className="w-full bg-[#0c0c0e]/80 border border-zinc-850 hover:border-gray-200 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Building className="w-3 h-3"/><span>Company Name (Optional)</span></label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Creative Agencies"
                  className="w-full bg-[#0c0c0e]/80 border border-zinc-855 hover:border-gray-200 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white outline-none transition-colors"
                />
              </div>
            </div>

            {/* Industry selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Briefcase className="w-3 h-3"/><span>Industry Category</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setSelectedIndustry(ind.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer text-center transition-all ${
                      selectedIndustry === ind.id
                        ? "bg-purple-950/20 border-purple-500/40 text-white shadow-sm"
                        : "bg-white/20 border-zinc-850 hover:border-gray-200 text-zinc-450"
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Continue trigger */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-white hover:bg-zinc-100 text-zinc-950 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}
