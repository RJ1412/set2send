"use client";

import React, { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Play, 
  Database, 
  Send, 
  Users, 
  ShieldCheck,
  Mail,
  Clock,
  AlertCircle,
  Cpu,
  Inbox,
  RefreshCw,
  BarChart3,
  Edit3,
  Layers,
  Settings,
  Target,
  ArrowDown,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ============================================================================
// 1. DATA CONFIGS FOR OTHER USE CASES (KEEP RETRO-COMPATIBILITY)
// ============================================================================
const USECASE_DATA: Record<
  string,
  {
    heroTitle: string;
    heroSub: string;
    demoTitle: string;
    chatMessages: Array<{ sender: "bot" | "user"; text: string; button?: string }>;
    benefits: Array<{ title: string; desc: string }>;
    workflowSteps: Array<{ title: string; icon: React.ReactNode; desc: string }>;
    examples: Array<{ trigger: string; target: string; outcome: string }>;
    testimonials: Array<{ quote: string; client: string; stats: string }>;
  }
> = {
  "collect-emails": {
    heroTitle: "Collect emails inside social DMs",
    heroSub: "Nurture your contact lists by qualifying and capturing audience email addresses automatically.",
    demoTitle: "Email Capture Flow",
    chatMessages: [
      { sender: "bot", text: "Hey! Ready to get the early bird SaaS template pack?" },
      { sender: "bot", text: "Please enter your best business email address below." },
      { sender: "user", text: "hello@set2send.com" },
      { sender: "bot", text: "Got it! Deployed template. Check your inbox." },
    ],
    benefits: [
      { title: "Qualify in DMs", desc: "Validate email structures in real-time before exporting contacts." },
      { title: "CRM Sync", desc: "Bridge captured contact parameters directly to HubSpot or Mailchimp." },
      { title: "Safe compliance", desc: "Build opt-in pathways that respect GDPR compliance regulations." },
    ],
    workflowSteps: [
      { title: "User Comments", icon: <MessageSquare className="w-5 h-5" />, desc: " Shopper triggers comments or DMs a keyword like 'GROW'." },
      { title: "Ask & Validate", icon: <Sparkles className="w-5 h-5" />, desc: "Set2Send asks for email and validates syntax automatically." },
      { title: "Sync Contacts", icon: <Database className="w-5 h-5" />, desc: "Logs validated emails directly into your linked CRM lists." },
    ],
    examples: [
      { trigger: "Reel Comment: 'LAUNCH'", target: "Agency templates PDF", outcome: "240 new email leads captured in 48 hours." },
      { trigger: "Story Tag: 'JOIN'", target: "Webinar access registration", outcome: "1,200 emails logged to CRM database." },
    ],
    testimonials: [
      {
        quote: "\"WE CAPTURED 1,200 LEADS IN 4 DAYS FROM A SINGLE REELS COMMENT CAMPAIGN FOR MY MASTERCLASS.\"",
        client: "Sarah Miller (Cosmetics Brand Founder)",
        stats: "+120% Lead Growth",
      },
    ],
  },
  "request-to-follow": {
    heroTitle: "Acquire followers automatically",
    heroSub: "Verify user follow status before unlocking discount parameters or digital downloads.",
    demoTitle: "Follow Verification Flow",
    chatMessages: [
      { sender: "bot", text: "Hi there! I saw you requested our early access download folder." },
      { sender: "bot", text: "The link is only available to my followers. Please follow me first!" },
      { sender: "user", text: "I follow you", button: "Verify Follow State" },
      { sender: "bot", text: "Checked! Done. Here is your download link: files.zip" },
    ],
    benefits: [
      { title: "Organic Growth", desc: "Convert viral video view traffic into organic profile followers." },
      { title: "Filter Spammers", desc: "Ensure actual users engage your page, keeping analytics clean." },
      { title: "Meta Compliance", desc: "Safely verify follow status using official Meta API keys." },
    ],
    workflowSteps: [
      { title: "User comments", icon: <MessageSquare className="w-5 h-5" />, desc: "Shopper comments on post requesting download." },
      { title: "Verify status", icon: <ShieldCheck className="w-5 h-5" />, desc: "Set2Send checks follower state on Meta server nodes." },
      { title: "Unlock folders", icon: <Sparkles className="w-5 h-5" />, desc: "Fires download links instantly upon verification." },
    ],
    examples: [
      { trigger: "Comment: 'FILES'", target: "Lightroom preset assets", outcome: "Gained 4,500 Instagram followers in 1 week." },
      { trigger: "Comment: 'VIP'", target: "Store checkout access key", outcome: "+30% follow rate from reel viewers." },
    ],
    testimonials: [
      {
        quote: "\"WE GREW OUR INSTAGRAM FOLLOWING BY 50,000 IN THREE MONTHS BY GATING MENU DISCOUNT LINKS.\"",
        client: "Chef Ramirez (Star Cafe Owner)",
        stats: "50,000 New Followers",
      },
    ],
  },
  "respond-to-comments": {
    heroTitle: "Respond to comments automatically",
    heroSub: "Never let a video comment sit idle. Respond instantly with automated posts and DMs.",
    demoTitle: "Comment Responder Flow",
    chatMessages: [
      { sender: "user", text: "Is this package still available?" },
      { sender: "bot", text: "Yes, we have 4 templates left! Deployed order link below." },
      { sender: "bot", text: "Let me know if you need sizing guides." },
      { sender: "user", text: "Sizing guides", button: "Get Guide" },
    ],
    benefits: [
      { title: "Instant Timing", desc: "Never lose hot shopper interest. Auto-respond in under 2 seconds." },
      { title: "Meta SEO Boost", desc: "Replying instantly boosts video engagement parameters on Meta feeds." },
      { title: "Multi-Keyword", desc: "Configure custom flows for multiple separate keyword queries." },
    ],
    workflowSteps: [
      { title: "Reel Comment", icon: <MessageSquare className="w-5 h-5" />, desc: "Viewer comments on reel matching target triggers." },
      { title: "Post Response", icon: <Users className="w-5 h-5" />, desc: "Set2Send automatically post-replies '@user Check DM!'." },
      { title: "Inbox Delivery", icon: <Sparkles className="w-5 h-5" />, desc: "Triggers a DM inside their inbox with product listings." },
    ],
    examples: [
      { trigger: "Comment: 'PRICE'", target: "Price catalog details", outcome: "Auto-replied to 8,000 comments in 24 hours." },
      { trigger: "Comment: 'DEMO'", target: "Booking calendar card", outcome: "Strategy call bookings increased by 45%." },
    ],
    testimonials: [
      {
        quote: "\"ATTRACTED 4X MORE DMs BY REPLYING TO POST COMMENTS IN UNDER 2 SECONDS.\"",
        client: "Brock Johnson (Insta Coach)",
        stats: "4x Inbound DMs",
      },
    ],
  },
  "follow-to-dm": {
    heroTitle: "Deliver links to followers in DMs",
    heroSub: "Send private discount codes and download links directly to follower inboxes.",
    demoTitle: "Welcome DM Flow",
    chatMessages: [
      { sender: "bot", text: "Hey! Thanks for following Set2Send. 🚀" },
      { sender: "bot", text: "As a welcome gift, here is your 15% discount code: FANS15" },
      { sender: "bot", text: "Click below to shop our collections." },
      { sender: "user", text: "Shop Boutique", button: "Open Shop" },
    ],
    benefits: [
      { title: "Inbox Protection", desc: "Protect files from public copy links. Keep downloads inside DMs." },
      { title: "Personalized greetings", desc: "Automate custom greeting cards that address shoppers by name." },
      { title: "High click rates", desc: "Inbox link cards convert 35% higher than profile bio link tags." },
    ],
    workflowSteps: [
      { title: "Follow Event", icon: <Users className="w-5 h-5" />, desc: "A user follows your creator or business profile page." },
      { title: "Trigger Welcome", icon: <Sparkles className="w-5 h-5" />, desc: "Set2Send triggers welcome DM containing active links." },
      { title: "Complete Order", icon: <ArrowRight className="w-5 h-5" />, desc: "Shopper opens checkout card, scaling shop conversion rates." },
    ],
    examples: [
      { trigger: "Profile Follow", target: "Appreciation gift discount", outcome: "40% conversion of followers to store visits." },
      { trigger: "Profile Follow", target: "Free ebook access link", outcome: "Captured 1,800 new emails via welcome DMs." },
    ],
    testimonials: [
      {
        quote: "\"STORY REPLIES ARE GREAT, BUT FOLLOW-TO-DM TRIGGERS CONVERTED 30% MORE FANS INTO EMAIL LEADS.\"",
        client: "Vanessa Lau (Course Creator)",
        stats: "+30% Lead Conversion",
      },
    ],
  },
};

// ============================================================================
// 2. HELPER SUB-COMPONENTS FOR REDESIGNED EMAIL LANDING PAGE
// ============================================================================

// Animated Counter Component
const Counter = ({ value, duration = 1.5, suffix = "" }: { value: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    if (start === end) return;
    const totalMiliseconds = duration * 1000;
    const stepTime = Math.max(Math.floor(totalMiliseconds / end), 12);
    const timer = setInterval(() => {
      start += Math.ceil(end / 80);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, duration, inView]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Testimonials Data for Email Automation
const EMAIL_TESTIMONIALS = [
  {
    name: "Alex Sterling",
    company: "SaaS Analytics Co.",
    review: "Our welcome flows deliver key instructions within seconds of signup. Conversion rates grew by 42% on week one.",
    metric: "+42% Conversion Rate",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Sarah Jenkins",
    company: "Luxe Apparel",
    review: "Set2Send's abandoned cart recovery sequences recovered over $18,000 in sales inside the first month. Simple setup, massive ROI.",
    metric: "$18,500 Recovered / Mo",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Marcus Brody",
    company: "Agency Scale",
    review: "Drafting drip campaigns takes us minutes instead of days now. The visual builder interface is clean and super fast.",
    metric: "80% Time Saved",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Elena Rostova",
    company: "Creative Hub",
    review: "Our newsletter subscription rate doubled within two weeks. Delivering verification links instantly solves subscriber drops.",
    metric: "2x Subscriber Opt-ins",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Liam O'Connor",
    company: "Course Academy",
    review: "Nurturing email signups automatically runs 24/7. My courses sell out while I focus on curriculum creation.",
    metric: "3.5x Course Sales",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Chloe Chen",
    company: "Eco Retailers",
    review: "Smart segmentation automatically classifies hot leads, ensuring we only deliver highly targeted offer templates.",
    metric: "+68% Email Open Rate",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=150&auto=format&fit=crop"
  }
];

// ============================================================================
// 3. MAIN RENDER ROUTER COMPONENT
// ============================================================================
export default function UsecasePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const resolvedParams = use(params);
  const type = resolvedParams.type;

  // Retrieve usecase data or fallback to collect-emails
  const data = USECASE_DATA[type] || USECASE_DATA["collect-emails"];
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < data.chatMessages.length - 1 ? prev + 1 : 0));
    }, 2800);
    return () => clearInterval(timer);
  }, [data.chatMessages.length]);

  // If the selected use case is 'email', render the completely redesigned landing page
  if (type === "email") {
    return <EmailUsecasePage />;
  }

  // Fallback default look (original dark templates for collect-emails, follow-to-dm, etc.)
  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col selection:bg-orange-500 selection:text-white relative overflow-x-hidden">

      {/* Background Glows */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] left-[-15%] w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[165px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Shared Navbar */}
      <Navbar />

      {/* ==================================================
          HERO SECTION
          ================================================== */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Hero Details */}
          <div className="lg:col-span-7 text-left flex flex-col items-start pt-12 lg:pt-0">
            <span className="text-[10px] font-bold font-mono tracking-widest text-[#f97316] bg-[#f97316]/10 px-3 py-1 rounded-full uppercase mb-6 border border-[#f97316]/25">
              use case study
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[0.95] font-sans"
            >
              {data.heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-gray-600 font-sans font-normal mt-6 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed"
            >
              {data.heroSub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto text-center px-10 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-sans font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-[1.03] shadow-lg shadow-[#f97316]/15"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Right Hero: Interactive Demo Simulator */}
          <div className="lg:col-span-5 relative flex flex-col justify-end items-center lg:items-end w-full">
            <div className="w-full max-w-[360px] bg-white/90 border border-gray-200 rounded-[28px] p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">

              {/* Simulator Header */}
              <div className="flex items-center gap-2 border-b border-gray-200 pb-3.5 mb-4 text-left">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wider">
                  {data.demoTitle}
                </span>
              </div>

              {/* Chat Thread */}
              <div className="flex flex-col gap-3.5 min-h-[180px] justify-start text-xs font-semibold">
                <AnimatePresence>
                  {data.chatMessages.map((msg, idx) => {
                    if (idx > activeStep) return null;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={`px-4 py-2.5 rounded-2xl relative border ${msg.sender === "user"
                            ? "bg-gray-100 text-[#1A1A1A] rounded-br-none max-w-[80%] self-end text-right border-gray-300/50"
                            : "bg-[#f97316] text-white rounded-bl-none max-w-[80%] self-start text-left border-orange-400/20 shadow-md"
                          }`}
                      >
                        <p>{msg.text}</p>

                        {msg.button && idx === activeStep && (
                          <button
                            onClick={() => setActiveStep((p) => p + 1)}
                            className="mt-2 w-full py-1.5 bg-white text-zinc-950 hover:bg-zinc-100 font-bold rounded-xl text-[9px] uppercase tracking-wider shadow cursor-pointer transition-colors"
                          >
                            {msg.button}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          BENEFITS GRID SECTION
          ================================================== */}
      <section className="py-24 border-t border-[#E8E4D9] max-w-7xl mx-auto px-6 md:px-12 w-full text-center">
        <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full">
          platform benefits
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mt-4 mb-16 max-w-2xl mx-auto">
          Built for conversion and list scale
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.benefits.map((ben, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-[#E8E4D9] bg-white/10 hover:border-zinc-850 hover:bg-white/30 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#f97316]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mt-4">{ben.title}</h3>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">{ben.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          WORKFLOW VISUALIZATION
          ================================================== */}
      <section className="py-24 border-t border-[#E8E4D9] bg-gray-50/20 max-w-6xl mx-auto px-6 md:px-12 w-full text-center">
        <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full">
          flow sequence
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mt-4 mb-16 max-w-2xl mx-auto">
          How the automation workflow executes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-gray-100 hidden md:block"></div>

          {data.workflowSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#f97316] shadow-lg mb-6">
                {step.icon}
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">{step.title}</h3>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          REAL EXAMPLES TABLE
          ================================================== */}
      <section className="py-24 border-t border-[#E8E4D9] max-w-5xl mx-auto px-6 md:px-12 w-full text-center">
        <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full">
          use cases
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mt-4 mb-16 max-w-2xl mx-auto">
          Real creator campaign outcomes
        </h2>

        <div className="w-full overflow-x-auto rounded-2xl border border-[#E8E4D9] bg-white/20 backdrop-blur">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-850 font-bold font-mono uppercase text-[9px] tracking-wider text-gray-400 bg-gray-50/40">
                <th className="p-4">Trigger Action</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Measured Outcome</th>
              </tr>
            </thead>
            <tbody>
              {data.examples.map((item, idx) => (
                <tr key={idx} className="border-b border-zinc-850/60 hover:bg-zinc-850/20 transition-all font-medium">
                  <td className="p-4 text-white font-bold">{item.trigger}</td>
                  <td className="p-4 text-gray-600">{item.target}</td>
                  <td className="p-4 text-emerald-400 font-bold">{item.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================================================
          TESTIMONIALS SECTION
          ================================================== */}
      <section className="py-24 border-t border-[#E8E4D9] bg-gray-50/25 text-center">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          {data.testimonials.map((test, idx) => (
            <div key={idx} className="flex flex-col items-center gap-6">
              <span className="text-4xl text-[#f97316]">“</span>
              <p className="text-xl sm:text-2xl font-extrabold italic leading-relaxed text-white max-w-2xl">
                {test.quote}
              </p>
              <div className="mt-4 flex flex-col items-center">
                <h4 className="text-sm font-bold text-white">{test.client}</h4>
                <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#f97316] bg-[#f97316]/10 px-2.5 py-0.5 rounded mt-2.5 border border-[#f97316]/20">
                  {test.stats}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          PRICING CTA SECTION
          ================================================== */}
      <section className="py-28 px-6 border-t border-[#E8E4D9] text-center relative overflow-hidden bg-gradient-to-b from-[#09090b] via-zinc-950/20 to-[#09090b]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
            Scale your list opt-ins today
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Connect your channels to Set2Send and deploy this conversion sequence in 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
            <Link 
              href="/signup"
              className="w-full sm:w-auto text-center px-10 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}

// ============================================================================
// 4. REDESIGNED EMAIL AUTOMATION LANDING PAGE COMPONENT (LIGHT SAAS THEME)
// ============================================================================
function EmailUsecasePage() {
  const [activeManualStep, setActiveManualStep] = useState(0);

  // Auto-tick the manual comparison script
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveManualStep((prev) => (prev < 3 ? prev + 1 : 0));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#F5F5F5] text-zinc-850 min-h-screen flex flex-col selection:bg-indigo-600 selection:text-white relative overflow-x-hidden font-sans">
      
      {/* Dynamic inline styles for testimonial marquee scroll */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes testimonial-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .testimonial-marquee-container {
            display: flex;
            width: max-content;
            animation: testimonial-marquee 35s linear infinite;
          }
          .testimonial-marquee-container:hover {
            animation-play-state: paused;
          }
        `
      }} />

      {/* Clean Global Navbar */}
      <Navbar />

      {/* ==================================================
          SECTION 1: HERO SECTION
          ================================================== */}
      <section className="relative min-h-[92vh] flex items-center pt-32 pb-24 overflow-hidden bg-gradient-to-b from-white via-[#F5F5F5] to-[#F5F5F5] z-10">
        
        {/* Soft layout background mesh decor */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.012)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-6 text-left flex flex-col items-start pt-12 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-[10px] font-bold font-mono tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Email Marketing Automation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[74px] font-black tracking-tight text-zinc-950 leading-[0.95] font-sans"
            >
              Automate Every Email. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-650 to-pink-600">
                Convert More Customers.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-650 font-sans font-medium mt-6 text-base md:text-lg max-w-lg leading-relaxed"
            >
              Build email workflows that welcome, nurture, engage, and convert your audience automatically.
            </motion.p>

            {/* CTA controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto text-center px-10 py-4 bg-gray-50 hover:bg-gray-100 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-[1.03] shadow-md shadow-zinc-950/10"
              >
                Start Free
              </Link>
              <button
                onClick={() => {
                  document.getElementById("workflow-illustration")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto text-center px-10 py-4 bg-white border border-zinc-250 hover:bg-zinc-50 text-zinc-900 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Social Proof metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-12 flex items-center gap-3 border-t border-zinc-200/80 pt-6 w-full"
            >
              <div className="flex -space-x-2.5">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=60&auto=format&fit=crop"
                ].map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="user badge"
                    className="w-7.5 h-7.5 rounded-full object-cover border-2 border-[#F5F5F5]"
                  />
                ))}
              </div>
              <p className="text-[11px] font-bold text-gray-400 font-mono tracking-wider uppercase">
                Trusted by 50,000+ businesses worldwide
              </p>
            </motion.div>
          </div>

          {/* Right Hero Column: Giant Stacked Card Visual & Floating Elements */}
          <div className="lg:col-span-6 relative w-full h-[520px] flex items-center justify-center pt-8">
            
            {/* Soft decorative background spotlight */}
            <div className="absolute w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 rounded-full blur-[80px] opacity-70 pointer-events-none"></div>

            {/* Floating UI Element 1: Email Sent */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
              className="absolute top-8 left-[-16px] bg-white border border-zinc-200 shadow-lg p-3 px-4 rounded-xl flex items-center gap-3 z-30 select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                <Check className="w-4.5 h-4.5" />
              </div>
              <div className="text-left font-mono">
                <p className="text-[8px] text-gray-500 font-bold leading-none uppercase">TRANSMISSION</p>
                <p className="text-[10px] font-extrabold text-zinc-850 mt-0.5">✓ Email Sent</p>
              </div>
            </motion.div>

            {/* Floating UI Element 2: Open Rate */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/3 right-[-24px] bg-white border border-zinc-200 shadow-xl p-3 px-4 rounded-xl flex items-center gap-3 z-30 select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="text-left font-mono">
                <p className="text-[8px] text-gray-500 font-bold leading-none uppercase">METRIC SCALE</p>
                <p className="text-[10px] font-extrabold text-indigo-650 mt-0.5">✓ Open Rate +42%</p>
              </div>
            </motion.div>

            {/* Floating UI Element 3: Click Rate */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-16 left-[-32px] bg-white border border-zinc-200 shadow-xl p-3 px-4 rounded-xl flex items-center gap-3 z-30 select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div className="text-left font-mono">
                <p className="text-[8px] text-gray-500 font-bold leading-none uppercase">CLICKS VERIFIED</p>
                <p className="text-[10px] font-extrabold text-purple-650 mt-0.5">✓ Click Rate +31%</p>
              </div>
            </motion.div>

            {/* Floating UI Element 4: Revenue */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-6 right-8 bg-gray-50 text-white shadow-2xl p-3.5 px-4 rounded-xl flex items-center gap-3.5 z-35 select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/10">
                <Database className="w-4.5 h-4.5" />
              </div>
              <div className="text-left font-mono">
                <p className="text-[7px] text-gray-500 font-bold leading-none uppercase">CAMPAIGN ROI</p>
                <p className="text-[10px] font-extrabold text-white mt-0.5">✓ Revenue Generated</p>
              </div>
            </motion.div>

            {/* Floating UI Element 5: Subscriber Joined */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/2 left-6 bg-white border border-zinc-200 shadow-xl p-3 px-4 rounded-xl flex items-center gap-3.5 z-30 select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-650 flex items-center justify-center shadow-inner">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div className="text-left font-mono">
                <p className="text-[8px] text-gray-500 font-bold leading-none uppercase">CRM SYNC</p>
                <p className="text-[10px] font-extrabold text-pink-650 mt-0.5">✓ Subscriber Joined</p>
              </div>
            </motion.div>

            {/* Stacked Cards Visual */}
            <div className="relative w-[340px] h-[400px] flex items-center justify-center">
              
              {/* Backmost Deck Base (Main Dashboard Card) */}
              <div className="absolute w-[320px] h-[350px] bg-white border border-zinc-200 rounded-[28px] shadow-2xl z-0 transform -translate-y-2 p-6 text-left flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <span className="text-[9px] font-mono text-gray-500 font-bold uppercase tracking-widest">Email Control Deck</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full"></span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-xl flex items-center justify-center mb-3">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-black text-zinc-950">Email Automation Dashboard</h4>
                  <p className="text-[10px] text-gray-500 max-w-[180px] mt-1 leading-normal">Interactive campaigns and workflows active.</p>
                </div>
              </div>

              {/* Card 5: Newsletter Automation */}
              <motion.div
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 40 }}
                className="absolute w-[280px] bg-white border border-zinc-200 rounded-2xl p-4 shadow-xl z-5 transform rotate-6 translate-x-12 translate-y-8 text-left border-l-4 border-l-orange-500 cursor-pointer"
              >
                <span className="text-[8px] font-mono font-bold text-orange-500 uppercase">WEEKLY NEWS</span>
                <h5 className="text-[11px] font-extrabold text-zinc-900 mt-0.5">Newsletter Automation</h5>
                <p className="text-[9px] text-gray-500 mt-1 leading-snug">Distribute curated content and logs automatically to active subscribers.</p>
              </motion.div>

              {/* Card 4: Abandoned Cart Recovery */}
              <motion.div
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 40 }}
                className="absolute w-[280px] bg-white border border-zinc-200 rounded-2xl p-4 shadow-xl z-10 transform -rotate-4 -translate-x-10 translate-y-16 text-left border-l-4 border-l-emerald-500 cursor-pointer"
              >
                <span className="text-[8px] font-mono font-bold text-emerald-500 uppercase">CART RECOVERY</span>
                <h5 className="text-[11px] font-extrabold text-zinc-900 mt-0.5">Abandoned Cart Recovery</h5>
                <p className="text-[9px] text-gray-500 mt-1 leading-snug">Fires a checkout nudge with a coupon link when checkout is abandoned.</p>
              </motion.div>

              {/* Card 3: Product Launch Campaign */}
              <motion.div
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 40 }}
                className="absolute w-[280px] bg-white border border-zinc-200 rounded-2xl p-4 shadow-xl z-15 transform rotate-3 translate-x-6 -translate-y-10 text-left border-l-4 border-l-pink-500 cursor-pointer"
              >
                <span className="text-[8px] font-mono font-bold text-pink-500 uppercase">PROMOTIONS</span>
                <h5 className="text-[11px] font-extrabold text-zinc-900 mt-0.5">Product Launch Campaign</h5>
                <p className="text-[9px] text-gray-500 mt-1 leading-snug">Sequences that automatically trigger product feature emails weekly.</p>
              </motion.div>

              {/* Card 2: Lead Nurturing Sequence */}
              <motion.div
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 40 }}
                className="absolute w-[280px] bg-white border border-zinc-200 rounded-2xl p-4 shadow-xl z-20 transform -rotate-8 -translate-x-6 -translate-y-4 text-left border-l-4 border-l-purple-500 cursor-pointer"
              >
                <span className="text-[8px] font-mono font-bold text-purple-500 uppercase">NURTURING SEQUENCE</span>
                <h5 className="text-[11px] font-extrabold text-zinc-900 mt-0.5">Lead Nurturing Sequence</h5>
                <p className="text-[9px] text-gray-500 mt-1 leading-snug">Deliver helpful guides and case logs over a multi-day delay timeline.</p>
              </motion.div>

              {/* Card 1: Welcome Email */}
              <motion.div
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 40 }}
                className="absolute w-[280px] bg-white border border-zinc-200 rounded-2xl p-4 shadow-2xl z-25 transform rotate-2 -translate-y-14 text-left border-l-4 border-l-indigo-600 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono font-bold text-indigo-650 uppercase">WELCOME FLOW</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                </div>
                <h5 className="text-[11px] font-extrabold text-zinc-900 mt-0.5">Welcome Email Setup</h5>
                <p className="text-[9px] text-gray-500 mt-1 leading-snug">Fires instantly when new visitors sign up. Deliver links and discount keys.</p>
              </motion.div>

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 2: STILL SENDING EMAILS MANUALLY?
          ================================================== */}
      <section className="py-24 bg-white text-center border-y border-zinc-200/80 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none font-sans">
              Still Sending Emails Manually?
            </h2>
            <p className="text-zinc-550 text-sm sm:text-base max-w-md mt-1">
              Forgetting to follow up with leads means leaving customers on the table.
            </p>
          </motion.div>

          {/* Sequential Conversation Flowchart mock */}
          <div className="mt-16 max-w-lg mx-auto bg-[#F9F9FB] border border-zinc-200 rounded-[28px] p-8 shadow-xl relative overflow-hidden text-left">
            
            <div className="flex items-center justify-between border-b border-zinc-250/60 pb-3 mb-6">
              <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">Workflow Simulation</span>
              <Clock className="w-4 h-4 text-zinc-350 animate-spin" style={{ animationDuration: "12s" }} />
            </div>

            <div className="flex flex-col gap-5 text-xs font-semibold relative">
              
              {/* Vertical connecting line */}
              <div className="absolute left-[18px] top-6 bottom-6 w-[2px] bg-zinc-200"></div>

              {/* Step 1: Business Owner */}
              <div className="flex items-start gap-4.5 relative z-10">
                <div className="w-9 h-9 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-650 shrink-0 font-bold text-sm">🧔</div>
                <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex-1">
                  <p className="text-[8px] font-mono text-red-500 font-bold leading-none mb-1 uppercase tracking-wider">Business Owner</p>
                  <span className="text-zinc-750 text-[11px] leading-relaxed">"I keep forgetting to follow up with leads manually."</span>
                </div>
              </div>

              {/* Step 2: System Trigger (Set2Send Automation) */}
              {activeManualStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4.5 relative z-10"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-650 shrink-0 font-bold text-sm">⚙️</div>
                  <div className="bg-indigo-650 text-white rounded-2xl p-4 shadow-md flex-1">
                    <p className="text-[8px] font-mono text-indigo-300 font-bold leading-none mb-1.5 uppercase tracking-wider">Set2Send Automation</p>
                    <span className="text-[11px] font-medium leading-relaxed block">"Welcome! Here's your free guide."</span>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Lead Response */}
              {activeManualStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4.5 relative z-10"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-650 shrink-0 font-bold text-sm">👩</div>
                  <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex-1">
                    <p className="text-[8px] font-mono text-emerald-500 font-bold leading-none mb-1 uppercase tracking-wider">Lead (Prospect)</p>
                    <span className="text-zinc-750 text-[11px] leading-relaxed">"Wow, thanks! This is exactly what I was looking for."</span>
                  </div>
                </motion.div>
              )}

              {/* Step 4: System sync (Lead added) */}
              {activeManualStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4.5 relative z-10"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner"><Database className="w-4 h-4" /></div>
                  <div className="bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-2xl p-4 shadow-lg flex-1">
                    <p className="text-[8px] font-mono text-emerald-400 font-bold leading-none mb-1 uppercase tracking-wider">System Pipeline</p>
                    <span className="text-[11px] font-black text-white">Lead Added To Nurture Campaign</span>
                  </div>
                </motion.div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 3: YEAH. THAT'S EXACTLY WHY WE BUILT SET2SEND.
          ================================================== */}
      <section id="workflow-illustration" className="py-24 bg-[#F5F5F5] text-center relative z-10 border-b border-zinc-200/60">
        <div className="max-w-6xl mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600 shadow-sm">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none font-sans">
              Yeah. That's Exactly Why We Built Set2Send.
            </h2>
            <p className="text-gray-400 text-sm max-w-md mt-1 leading-relaxed">
              Design multi-step email campaigns that deliver the right message at the right moment automatically.
            </p>
          </motion.div>

          {/* Automated Flowchart node illustration */}
          <div className="mt-16 bg-white border border-zinc-200 rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Grid background inside canvas */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.012)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10 items-stretch">
              
              {[
                { title: "Visitor signs up", desc: "User registers email details via signup form widgets.", step: "01", border: "border-l-indigo-650" },
                { title: "Welcome email sent", desc: "System fires an instant welcome email code or link.", step: "02", border: "border-l-purple-500" },
                { title: "Educational sequence", desc: "Fires helpful tutorials or articles over a 3-day delay.", step: "03", border: "border-l-pink-500" },
                { title: "Offer email", desc: "Delivers coupon codes or targeted checkout pitches.", step: "04", border: "border-l-orange-500" },
                { title: "Conversion", desc: "Lead converts to paying shopper. Order logs confirmed.", step: "05", border: "border-l-emerald-500" },
                { title: "Customer onboarding", desc: "Initial usage steps sent automatically to support client.", step: "06", border: "border-l-indigo-500" }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className={`bg-[#F9F9FB] border border-zinc-200/80 p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between min-h-[160px] border-l-4 ${step.border} hover:scale-[1.02] hover:shadow-md transition-all`}
                >
                  <div>
                    <span className="text-[9px] font-mono font-bold text-gray-500 block tracking-widest">{step.step} / STEP</span>
                    <h4 className="font-extrabold text-xs text-zinc-900 mt-2.5">{step.title}</h4>
                    <p className="text-gray-400 text-[10px] leading-relaxed mt-2">{step.desc}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                </motion.div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 4: BECAUSE AUTOMATION WORKS.
          ================================================== */}
      <section className="py-24 bg-white text-center border-b border-zinc-200/60 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none font-sans">
              Because Automation Works.
            </h2>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed mt-1">
              See the direct impact of automated customer journeys on email performance metrics.
            </p>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 text-left">
            
            {/* Stat 1 */}
            <div className="bg-[#F9F9FB] border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[160px] border-b-4 border-b-indigo-600">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shadow-inner"><Mail className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-3xl font-black text-zinc-950 tracking-tight mt-4">
                  <Counter value={40} suffix="%" />
                </h3>
                <p className="text-gray-400 font-bold text-[10px] font-mono uppercase tracking-wider mt-1">Higher Open Rates</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-[#F9F9FB] border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[160px] border-b-4 border-b-purple-600">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-650 shadow-inner"><Target className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-3xl font-black text-zinc-950 tracking-tight mt-4">
                  <Counter value={3} suffix="x" />
                </h3>
                <p className="text-gray-400 font-bold text-[10px] font-mono uppercase tracking-wider mt-1">More Conversions</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-[#F9F9FB] border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[160px] border-b-4 border-b-pink-500">
              <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-650 shadow-inner"><Clock className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="text-3xl font-black text-zinc-950 tracking-tight mt-4">
                  <Counter value={80} suffix="%" />
                </h3>
                <p className="text-gray-400 font-bold text-[10px] font-mono uppercase tracking-wider mt-1">Less Manual Work</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-[#F9F9FB] border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[160px] border-b-4 border-b-emerald-500">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner"><RefreshCw className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: "12s" }} /></div>
              <div>
                <h3 className="text-3xl font-black text-zinc-950 tracking-tight mt-4">24/7</h3>
                <p className="text-gray-400 font-bold text-[10px] font-mono uppercase tracking-wider mt-1">Customer Engagement</p>
              </div>
            </div>

          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/signup"
              className="px-10 py-4 bg-gray-50 hover:bg-gray-100 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-[1.03]"
            >
              Start Free
            </Link>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 5: SPLIT LAYOUT (Protect Relationship)
          ================================================== */}
      <section className="py-24 bg-[#F5F5F5] border-b border-zinc-200/60 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side: Large stacked campaign image visual mockup */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            
            {/* Visual spotlight backdrop */}
            <div className="absolute w-72 h-72 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none"></div>

            {/* Mock stacked campaign cards */}
            <div className="w-full max-w-[420px] h-[340px] bg-white border border-zinc-200 rounded-[28px] shadow-2xl p-6 text-left flex flex-col justify-between relative overflow-hidden">
              
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-zinc-250 to-transparent"></div>
              
              <div className="flex justify-between items-center border-b border-zinc-150 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-650"></span>
                  <span className="text-[9px] font-mono text-gray-500 font-bold uppercase tracking-wider">Drip campaign logs</span>
                </div>
                <span className="text-[9px] font-mono text-gray-400 font-bold">ACTIVE</span>
              </div>

              <div className="flex-grow flex flex-col justify-center gap-3">
                <div className="p-3 bg-[#F9F9FB] border border-zinc-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 font-bold text-xs">A</div>
                    <span className="text-xs font-bold text-zinc-850">Smart Segmentation setup</span>
                  </div>
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-600 font-bold font-mono px-2 py-0.5 rounded border border-indigo-500/15">READY</span>
                </div>

                <div className="p-3 bg-[#F9F9FB] border border-zinc-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-650 font-bold text-xs">B</div>
                    <span className="text-xs font-bold text-zinc-850">Personalized Campaigns variables</span>
                  </div>
                  <span className="text-[9px] bg-purple-500/10 text-purple-600 font-bold font-mono px-2 py-0.5 rounded border border-purple-500/15">READY</span>
                </div>

                <div className="p-3 bg-[#F9F9FB] border border-zinc-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">C</div>
                    <span className="text-xs font-bold text-zinc-850">Subscriber Verification filters</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-600 font-bold font-mono px-2 py-0.5 rounded border border-emerald-500/15">VERIFIED</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>Verification rate: 99.8%</span>
                <Check className="w-4 h-4 text-emerald-500" />
              </div>
            </div>

          </div>

          {/* Right Side: Copy & Checklist */}
          <div className="lg:col-span-6 text-left flex flex-col items-start">
            <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase">
              AUDIENCE RELATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-tight mt-6">
              Protect Your Audience Relationship
            </h2>
            <p className="text-zinc-650 text-sm leading-relaxed mt-4 max-w-lg">
              Deliver highly relevant content to subscribers who opt-in. Keep lists clean and optimize deliverability logs easily.
            </p>

            {/* Checklist items */}
            <div className="flex flex-col gap-3 mt-8 w-full max-w-md text-xs font-bold">
              {[
                { title: "Smart Segmentation", desc: "Automatically partition subscribers based on signup channels." },
                { title: "Personalized Campaigns", desc: "Address customers by name and pass dynamic variables into scripts." },
                { title: "GDPR Ready Paths", desc: "Build explicit opt-in checkboxes and privacy pathways easily." },
                { title: "Secure Delivery Servers", desc: "High reputation sender nodes preventing spam filter triggers." },
                { title: "Subscriber Verification", desc: "Double opt-in verification hooks validating correct inbox entries." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 bg-white border border-zinc-200/80 rounded-xl shadow-sm">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
                    <Check className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-zinc-900 font-extrabold text-sm leading-none">{item.title}</h4>
                    <p className="text-gray-400 text-[10px] font-medium leading-normal mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/signup"
                className="px-10 py-4 bg-gray-50 hover:bg-gray-100 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-[1.03]"
              >
                Get Started Now
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 6: ALTERNATING LAYOUT (Grow While You Sleep)
          ================================================== */}
      <section className="py-24 bg-white border-b border-zinc-200/60 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4 mb-16"
          >
            <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
              REVENUE AUTOMATION
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none font-sans">
              Grow While You Sleep
            </h2>
            <p className="text-gray-400 text-sm max-w-md mt-1 leading-relaxed">
              Design a complete visual automated funnel that qualifies leads and generates sales repeatedly.
            </p>
          </motion.div>

          {/* Funnel visual mapping flowchart */}
          <div className="bg-[#F9F9FB] border border-zinc-250/60 rounded-[32px] p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10 items-center">
              
              {/* Node 1 */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm text-left min-h-[150px] flex flex-col justify-between border-l-4 border-l-indigo-600">
                <div>
                  <h4 className="font-black text-sm text-zinc-900">1. Lead Magnet</h4>
                  <p className="text-gray-400 text-[10px] leading-relaxed mt-2">Subscriber opts-in to receive a free guide, asset, or coupon code.</p>
                </div>
                <div className="text-[8px] font-mono text-indigo-600 font-bold uppercase tracking-wider mt-4">Stage: Signup</div>
              </div>

              {/* Connector Arrow */}
              <div className="hidden lg:flex justify-center text-indigo-400">
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Node 2 */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm text-left min-h-[150px] flex flex-col justify-between border-l-4 border-l-purple-500">
                <div>
                  <h4 className="font-black text-sm text-zinc-900">2. Email Sequence</h4>
                  <p className="text-gray-400 text-[10px] leading-relaxed mt-2">Drips onboarding emails and case logs to the user inbox.</p>
                </div>
                <div className="text-[8px] font-mono text-purple-600 font-bold uppercase tracking-wider mt-4">Stage: Nurture</div>
              </div>

              {/* Connector Arrow */}
              <div className="hidden lg:flex justify-center text-purple-400">
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Node 3 */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm text-left min-h-[150px] flex flex-col justify-between border-l-4 border-l-pink-500">
                <div>
                  <h4 className="font-black text-sm text-zinc-900">3. Engagement</h4>
                  <p className="text-gray-400 text-[10px] leading-relaxed mt-2">System monitors clicks and tag triggers to customize messaging.</p>
                </div>
                <div className="text-[8px] font-mono text-pink-600 font-bold uppercase tracking-wider mt-4">Stage: Score</div>
              </div>

              {/* Connector Arrow */}
              <div className="hidden lg:flex justify-center text-pink-400">
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Node 4 */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm text-left min-h-[150px] flex flex-col justify-between border-l-4 border-l-orange-500">
                <div>
                  <h4 className="font-black text-sm text-zinc-900">4. Sales</h4>
                  <p className="text-gray-400 text-[10px] leading-relaxed mt-2">User receives high-intent pitch email and executes checkout purchase.</p>
                </div>
                <div className="text-[8px] font-mono text-orange-500 font-bold uppercase tracking-wider mt-4">Stage: Convert</div>
              </div>

              {/* Connector Arrow */}
              <div className="hidden lg:flex justify-center text-orange-400">
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Node 5 */}
              <div className="bg-gray-50 border border-zinc-850 p-6 rounded-2xl shadow-xl text-left min-h-[150px] flex flex-col justify-between text-white border-l-4 border-l-emerald-500">
                <div>
                  <h4 className="font-black text-sm text-white">5. Repeat Customer</h4>
                  <p className="text-gray-500 text-[10px] leading-relaxed mt-2">Post-purchase logs funnel user into retention newsletter loops.</p>
                </div>
                <div className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider mt-4">Stage: Retain</div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 7: TESTIMONIALS CAROUSEL
          ================================================== */}
      <section className="py-24 bg-[#F5F5F5] overflow-hidden border-b border-zinc-200/60 relative z-10 select-none">
        <div className="max-w-6xl mx-auto px-6 text-center mb-16">
          <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
            CLIENT FEEDBACK
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none mt-5">
            Loved By Growing Businesses
          </h2>
        </div>

        {/* Scrolling testimonial marquee container */}
        <div className="w-full flex items-center relative overflow-hidden py-4">
          <div className="testimonial-marquee-container gap-6">
            {[...EMAIL_TESTIMONIALS, ...EMAIL_TESTIMONIALS].map((test, idx) => (
              <div
                key={idx}
                className="bg-white border border-zinc-200 rounded-2xl p-6 w-[340px] flex flex-col justify-between shadow-sm shrink-0 text-left cursor-pointer hover:border-indigo-400 transition-all duration-200"
              >
                <p className="text-xs font-bold italic leading-relaxed text-zinc-700">
                  "{test.review}"
                </p>
                <div className="mt-5 flex items-center gap-3.5 border-t border-zinc-100 pt-4">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-9 h-9 rounded-full object-cover border border-zinc-200"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-zinc-900 leading-tight">{test.name}</h4>
                    <span className="text-[9px] text-gray-500 font-bold font-mono uppercase tracking-wider">{test.company}</span>
                  </div>
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-650 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider shrink-0">{test.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 8: AUTOMATE IN 3 EASY STEPS
          ================================================== */}
      <section className="py-24 bg-white border-b border-zinc-200/60 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4 mb-16"
          >
            <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
              SIMPLE ONBOARDING
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none font-sans">
              Automate In 3 Easy Steps
            </h2>
            <p className="text-zinc-550 text-sm max-w-md mt-1 leading-relaxed">
              Connect your domain, customize your message sequences, and launch in minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            
            {/* Step 1 Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#F9F9FB] border border-zinc-200 rounded-[24px] p-6 shadow-sm flex flex-col justify-between min-h-[320px] hover:shadow-md transition-shadow"
            >
              <div>
                <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-mono font-bold text-xs">01</span>
                <h3 className="text-base font-black text-zinc-900 mt-4">Choose Trigger Action</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">Determine when your automation flow should initiate. Select target user activities easily.</p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-3.5 flex flex-wrap gap-2 text-[9px] font-mono font-bold text-zinc-650 mt-6 select-none">
                <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-1 rounded">New Signup</span>
                <span className="bg-zinc-50 border border-zinc-150 text-gray-400 px-2.5 py-1 rounded">Form Submission</span>
                <span className="bg-zinc-50 border border-zinc-150 text-gray-400 px-2.5 py-1 rounded">Purchase</span>
                <span className="bg-zinc-50 border border-zinc-150 text-gray-400 px-2.5 py-1 rounded">Tag Added</span>
              </div>
            </motion.div>

            {/* Step 2 Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-[#F9F9FB] border border-zinc-200 rounded-[24px] p-6 shadow-sm flex flex-col justify-between min-h-[320px] hover:shadow-md transition-shadow"
            >
              <div>
                <span className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-mono font-bold text-xs">02</span>
                <h3 className="text-base font-black text-zinc-900 mt-4">Customize Email Sequence</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">Build and structure emails with dynamic parameters using our drag-and-drop workflow visual builder.</p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col gap-2.5 text-[9px] font-mono font-bold text-zinc-650 mt-6 select-none">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
                  <span className="text-gray-500">BUILDER CANVAS</span>
                  <span className="text-purple-600 uppercase text-[8px]">editing...</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50/50 border border-purple-100/60 p-1.5 rounded text-[9px]">
                  <div className="w-4 h-4 bg-purple-600 rounded text-white flex items-center justify-center font-bold">1</div>
                  <span>Trigger: Lead Signup</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-150 p-1.5 rounded text-[9px]">
                  <div className="w-4 h-4 bg-zinc-400 rounded text-white flex items-center justify-center font-bold">2</div>
                  <span>Action: Send Welcome Email</span>
                </div>
              </div>
            </motion.div>

            {/* Step 3 Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-[#F9F9FB] border border-zinc-200 rounded-[24px] p-6 shadow-sm flex flex-col justify-between min-h-[320px] hover:shadow-md transition-shadow"
            >
              <div>
                <span className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-650 font-mono font-bold text-xs">03</span>
                <h3 className="text-base font-black text-zinc-900 mt-4">Launch Automation</h3>
                <p className="text-zinc-550 text-xs mt-2 leading-relaxed">Turn on your campaign. Emails send automatically as target triggers occur, updating your logs.</p>
              </div>
              <div className="bg-gray-50 text-white rounded-xl p-3 flex flex-col gap-2.5 text-[9px] font-mono font-bold mt-6 select-none border border-[#E8E4D9]">
                <div className="flex items-center justify-between border-b border-[#E8E4D9] pb-1.5">
                  <span>LIVE CONSOLE</span>
                  <span className="text-emerald-400 animate-pulse uppercase text-[8px]">running</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span>Total Emails Dispatched</span>
                  <span className="font-extrabold text-indigo-400">14,250</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span>Delivery Success Rate</span>
                  <span className="font-extrabold text-emerald-400">99.9%</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 9: FEATURE GRID
          ================================================== */}
      <section className="py-24 bg-[#F5F5F5] border-b border-zinc-200/60 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4 mb-16"
          >
            <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
              PLATFORM WIDGETS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none font-sans">
              Everything You Need For Email Marketing
            </h2>
          </motion.div>

          {/* Grid of 12 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-left">
            
            {[
              { title: "Email Campaigns", desc: "Build newsletters and one-off announcements easily.", icon: <Mail className="w-5 h-5" /> },
              { title: "Automation Builder", desc: "Visual canvas connecting triggers to multiple delays.", icon: <Cpu className="w-5 h-5" /> },
              { title: "Email Templates", desc: "Pre-made styled templates that compile on all layouts.", icon: <Layers className="w-5 h-5" /> },
              { title: "Audience Segmentation", desc: "Divide contact list records based on purchase tags.", icon: <Users className="w-5 h-5" /> },
              { title: "A/B Testing", desc: "Test multiple email copies and titles dynamically.", icon: <Target className="w-5 h-5" /> },
              { title: "Analytics Reports", desc: "Deep analytics tracking delivery, clicks, and revenue.", icon: <BarChart3 className="w-5 h-5" /> },
              { title: "Landing Pages Builder", desc: "Create high-converting landing sites to capture logs.", icon: <Edit3 className="w-5 h-5" /> },
              { title: "Opt-in Forms", desc: "Sleek signup widgets matching your custom website theme.", icon: <Inbox className="w-5 h-5" /> },
              { title: "Lead Scoring", desc: "Analyze prospect engagement patterns automatically.", icon: <TrendingUp className="w-5 h-5" /> },
              { title: "CRM Synchronize", desc: "Instant sync pipelines exporting emails to databases.", icon: <Database className="w-5 h-5" /> },
              { title: "Lead Tagging", desc: "Apply segment tags automatically as actions happen.", icon: <Sparkles className="w-5 h-5" /> },
              { title: "Custom Workflows", desc: "Configure complex delay workflows with absolute flexibility.", icon: <Settings className="w-5 h-5" /> }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:scale-[1.03] hover:shadow-md hover:border-indigo-500/35 transition-all flex flex-col justify-between min-h-[170px]"
              >
                <div className="w-9 h-9 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-indigo-650 shadow-inner">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 mt-4">{feature.title}</h4>
                  <p className="text-gray-400 text-[10px] leading-relaxed mt-1.5">{feature.desc}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 10: RESULTS SHOWCASE (Analytics Dashboard)
          ================================================== */}
      <section className="py-24 bg-white border-b border-zinc-200/60 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4 mb-16"
          >
            <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
              CAMPAIGN METRICS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none font-sans">
              See Your Growth In Real Time
            </h2>
            <p className="text-gray-400 text-sm max-w-md mt-1 leading-relaxed">
              Track subscribers, open rates, and revenue generation inside a clean console widget.
            </p>
          </motion.div>

          {/* Premium Analytics Dashboard Visual */}
          <div className="bg-[#F9F9FB] border border-zinc-250/60 rounded-[32px] p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto text-left relative overflow-hidden">
            
            {/* Header console decorations */}
            <div className="flex justify-between items-center border-b border-zinc-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                <span className="text-[9px] font-mono text-zinc-550 font-bold ml-2">Console: /analytics/email-performance</span>
              </div>
              <div className="text-[8px] font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Live feeds active</div>
            </div>

            {/* Dashboard stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              
              {/* Stat card */}
              <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm text-left">
                <p className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-wider">SUBSCRIBERS</p>
                <h4 className="text-lg font-black text-zinc-900 mt-1">24,580</h4>
                <span className="text-[8px] text-emerald-600 font-bold font-mono block mt-0.5">↑ 14% this month</span>
              </div>

              {/* Stat card */}
              <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm text-left">
                <p className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-wider">REVENUE</p>
                <h4 className="text-lg font-black text-zinc-900 mt-1">$48,250</h4>
                <span className="text-[8px] text-emerald-600 font-bold font-mono block mt-0.5">↑ 22% this week</span>
              </div>

              {/* Stat card */}
              <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm text-left">
                <p className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-wider">OPEN RATE</p>
                <h4 className="text-lg font-black text-zinc-900 mt-1">44.8%</h4>
                <span className="text-[8px] text-emerald-600 font-bold font-mono block mt-0.5">↑ 5.2% average</span>
              </div>

              {/* Stat card */}
              <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm text-left">
                <p className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-wider">CLICK RATE</p>
                <h4 className="text-lg font-black text-zinc-900 mt-1">12.4%</h4>
                <span className="text-[8px] text-emerald-600 font-bold font-mono block mt-0.5">↑ 2.1% average</span>
              </div>

              {/* Stat card */}
              <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm text-left">
                <p className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-wider">CONVERSION</p>
                <h4 className="text-lg font-black text-zinc-900 mt-1">4.6%</h4>
                <span className="text-[8px] text-emerald-600 font-bold font-mono block mt-0.5">↑ 1.4% change</span>
              </div>

            </div>

            {/* Simulated Chart visual using animated SVGs */}
            <div className="mt-8 bg-white border border-zinc-200 rounded-2xl p-5 shadow-md">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3.5 mb-4 text-[10px] text-gray-500 font-mono">
                <span className="font-bold">SUBSCRIBER GROWTH TIMELINE</span>
                <span className="text-gray-400 font-normal">Last 30 Days</span>
              </div>
              
              <div className="h-44 w-full relative flex items-end">
                {/* SVG path chart */}
                <svg className="w-full h-full text-indigo-100 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill Area */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                    d="M0 30 L5 28 L15 22 L25 25 L35 18 L45 20 L55 12 L65 15 L75 8 L85 10 L100 2 L100 30 Z"
                    fill="url(#chart-grad)"
                    stroke="none"
                  />
                  
                  {/* Chart line */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                    d="M0 30 L5 28 L15 22 L25 25 L35 18 L45 20 L55 12 L65 15 L75 8 L85 10 L100 2"
                    fill="none"
                    stroke="rgb(99, 102, 241)"
                    strokeWidth="0.8"
                  />
                </svg>

                {/* Y-axis tags */}
                <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-450 uppercase tracking-widest bg-zinc-50 border border-zinc-150 p-1 rounded font-bold">25k subscribers</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 11: COMPARISON TABLE
          ================================================== */}
      <section className="py-24 bg-[#F5F5F5] border-b border-zinc-200/60 text-center relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest bg-zinc-200 px-3.5 py-1.5 rounded-full border border-zinc-250">
            PLATFORM COMPARISONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight leading-none mt-5 mb-16 max-w-2xl mx-auto">
            Why Businesses Choose Set2Send
          </h2>

          <div className="w-full overflow-x-auto rounded-3xl border border-zinc-200 bg-white shadow-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-150 font-bold font-mono uppercase text-[9px] tracking-widest text-gray-400 bg-[#F9F9FB]">
                  <th className="p-5">Metric Parameter</th>
                  <th className="p-5 border-l border-zinc-150 text-red-500">Manual Email Marketing</th>
                  <th className="p-5 border-l border-zinc-150 text-indigo-650 bg-indigo-50/20">Set2Send Automation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: "Time Required", manual: "15+ hours weekly copy-pasting campaigns", set2send: "Under 10 minutes setup once and runs autonomously" },
                  { metric: "Follow-Ups Timing", manual: "Delayed 4-24 hours depending on workflow", set2send: "Fires instantly in 1.5 seconds at peak interest" },
                  { metric: "Personalization level", manual: "Basic first name fields or generic tags", set2send: "Dynamic script variables matching user actions" },
                  { metric: "Scaling Potential", manual: "Limited by workforce manual processing caps", set2send: "Infinite concurrent captures handled by API servers" },
                  { metric: "Analytics Logging", manual: "Manual sheet copies prone to log errors", set2send: "Direct HubSpot, Mailchimp, and CRM exports" },
                  { metric: "Revenue Growth", manual: "Average bio click conversions hover at 1.5%", set2send: "Direct opt-in conversions scale to 20-30%" }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-zinc-150/70 hover:bg-zinc-50/50 transition-all font-medium">
                    <td className="p-5 font-extrabold text-zinc-900 text-[11px]">{row.metric}</td>
                    <td className="p-5 border-l border-zinc-150 text-gray-400">{row.manual}</td>
                    <td className="p-5 border-l border-zinc-150 text-zinc-950 bg-indigo-50/5 font-semibold">
                      <div className="flex gap-2 items-start">
                        <div className="w-4.5 h-4.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{row.set2send}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ==================================================
          FINAL CTA SECTION
          ================================================== */}
      <section className="py-28 px-6 text-center relative overflow-hidden bg-white z-10">
        
        {/* Soft grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.012)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto bg-gray-50 rounded-[40px] p-12 text-white relative shadow-2xl overflow-hidden">
          
          {/* Glass spotlight decor overlay */}
          <div className="absolute top-[-25%] right-[-10%] w-[320px] h-[320px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Start Sending Smarter Emails Today
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed opacity-90">
              Build powerful email automations in minutes and convert more customers automatically.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
              <Link 
                href="/signup"
                className="w-full sm:w-auto text-center px-10 py-4 bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                Start Free
              </Link>
              <button 
                onClick={() => {
                  document.getElementById("workflow-illustration")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all cursor-pointer"
              >
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Global Footer */}
      <Footer />

    </div>
  );
}
