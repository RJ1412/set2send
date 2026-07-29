"use client";

import React, { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, MessageSquare, Play, Send } from "lucide-react";
import Navbar, {
  InstagramIcon,
  WhatsAppIcon,
  MessengerIcon,
  TikTokIcon,
  AISparkIcon,
} from "../../components/Navbar";
import Footer from "../../components/Footer";

// Configurations for each platform
const PLATFORM_DATA: Record<
  string,
  {
    gradient: string;
    accentColor: string;
    pillBg: string;
    icon: React.ReactElement<any>;
    title: string;
    heroSubtitle: string;
    heroImage: string;
    heroBadgeBg: string;
    checklistTitle: string;
    checklistItems: string[];
    chatMessages: Array<{
      sender: "bot" | "user";
      text: string;
      button?: string;
    }>;
    testimonials: Array<{
      name: string;
      followers: string;
      avatar: string;
      review: string;
    }>;
    autopilotTitle: string;
    autopilotSub: string;
    postMockupTitle: string;
    postMockupSub: string;
    postMockupUser: string;
    postComments: Array<{
      user: string;
      comment: string;
      reply: string;
    }>;
    flowSteps: string[];
    benefits: Array<{ title: string; desc: string }>;
    useCases: Array<{ title: string; desc: string }>;
  }
> = {
  instagram: {
    gradient: "from-[#6E2CF4] to-[#8A3FFC]",
    accentColor: "#8A3FFC",
    pillBg: "bg-purple-600 text-white",
    icon: <InstagramIcon className="w-8 h-8 text-white" />,
    title: "Your Instagram just got smarter",
    heroSubtitle: "Send links, answer questions, collect leads, and close sales automatically.",
    heroImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    heroBadgeBg: "bg-purple-950/40 border border-purple-500/20",
    checklistTitle: "Automatically:",
    checklistItems: ["Reply to DMs", "Get Followers", "Reply to Comments", "Send Links"],
    chatMessages: [
      { sender: "bot", text: "Hi there!" },
      { sender: "bot", text: "I saw your comment about wanting my secret link." },
      { sender: "bot", text: "The link is only available to my followers, so please make sure to follow me first!" },
      { sender: "user", text: "I follow you", button: "Confirm Follow" },
      { sender: "bot", text: "Done! Here is your download link: guide.pdf" },
    ],
    testimonials: [
      {
        name: "Konstantinos Synodinos",
        followers: "950K Followers",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        review: "\"FOR CREATORS ABOVE 10K FOLLOWERS, set2send IS A MUST.\"",
      },
      {
        name: "Hannah Stewart",
        followers: "792K Followers",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
        review: "\"I REACHED OVER 1.6M ACCOUNTS WITHIN JUST A WEEK OF DEPLOYMENT.\"",
      },
      {
        name: "Brock Johnson",
        followers: "1.2M Followers",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
        review: "\"set2send IS HOW WE AUTOMATICALLY CONVERT COMMENTS INTO VIP LEADS.\"",
      },
      {
        name: "Vanessa Lau",
        followers: "650K Followers",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
        review: "\"WE RECOVER HUNDREDS OF ABANDONED CART REDIRECTS EVERY SINGLE MONTH.\"",
      },
    ],
    autopilotTitle: "Put Instagram growth on autopilot",
    autopilotSub: "Manage DMs and comments without spending hours online.",
    postMockupTitle: "Turn comments into conversations that sell",
    postMockupSub: "Automatically send DMs when people comment.",
    postMockupUser: "fitness.star",
    postComments: [
      { user: "Jessica Peel", comment: "I'll be watching 👀", reply: "Check your DM" },
      { user: "Noa Baumbakh", comment: "Can't wait for it 😍", reply: "Let's get it started" },
      { user: "Mila Carpenter", comment: "Love it 🥰", reply: "You are in!" },
    ],
    flowSteps: ["Comment", "DM", "Lead", "Sale"],
    benefits: [
      { title: "Instant DM Funnels", desc: "Never keep clients waiting. Respond in under 3 seconds automatically." },
      { title: "Story Reply Leads", desc: "Turn simple story interactions and mentions into qualified sales calls." },
      { title: "Stripe Integrations", desc: "Share custom checkout links directly in message cards securely." },
      { title: "Targeted Broadcasts", desc: "Re-engage leads who opted in with custom newsletter updates." },
      { title: "Attribution Stats", desc: "Trace revenue gains directly to specific posts and comment campaigns." },
      { title: "Safe & Compliant", desc: "100% official Meta API integration protects your Instagram credentials." },
    ],
    useCases: [
      { title: "Course Creators", desc: "Deliver free masterclass guides automatically when creators comment 'GROW'." },
      { title: "E-commerce Brands", desc: "Deliver promo discount codes inside DMs, reducing checkout friction." },
      { title: "Local Agencies", desc: "Auto-qualify client budgets and distribute Calendly strategy call links." },
    ],
  },
  whatsapp: {
    gradient: "from-[#0B8A5A] to-[#059669]",
    accentColor: "#059669",
    pillBg: "bg-emerald-600 text-white",
    icon: <WhatsAppIcon className="w-8 h-8 text-white" />,
    title: "Your WhatsApp just got smarter",
    heroSubtitle: "Connect with customers instantly, deliver digital catalogs, and collect payments on autopilot.",
    heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    heroBadgeBg: "bg-[#064e3b]/40 border border-emerald-500/20",
    checklistTitle: "Instantly:",
    checklistItems: ["Auto-Reply to Queries", "Share Catalogs", "Automate Bookings", "Confirm Checkouts"],
    chatMessages: [
      { sender: "bot", text: "Welcome to Star Cafe! ☕️ Want to see today's special menu?" },
      { sender: "bot", text: "Click below to open our digital shop." },
      { sender: "bot", text: "Check out our fresh morning pastries." },
      { sender: "user", text: "Order Pastry", button: "Confirm Order" },
      { sender: "bot", text: "Done! Your order is being prepped. Reciept #1041 sent." },
    ],
    testimonials: [
      {
        name: "Chef Ramirez",
        followers: "Cafe Owner",
        avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=150&auto=format&fit=crop",
        review: "\"CATALOG ORDERS ON WHATSAPP INCREASED OUR DELIVERY SALES BY 40%.\"",
      },
      {
        name: "Sophia Chen",
        followers: "Boutique CEO",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
        review: "\"AUTOMATIC BOOKING CONFIRMATION SAVED OUR TEAM 15 HOURS OF ADMIN TIME A WEEK.\"",
      },
    ],
    autopilotTitle: "Put WhatsApp business on autopilot",
    autopilotSub: "Deliver catalog checkouts and support flows 24/7.",
    postMockupTitle: "Turn WhatsApp chats into sales catalogs",
    postMockupSub: "Send products and receive payment parameters instantly.",
    postMockupUser: "star.cafe.delivery",
    postComments: [
      { user: "David Thorne", comment: "Can I order online?", reply: "Check WhatsApp catalog" },
      { user: "Elena Smith", comment: "What is open now?", reply: "Morning special active" },
      { user: "Ray Jenkins", comment: "Delivery rates?", reply: "Calculated in chat" },
    ],
    flowSteps: ["Catalog", "Add Cart", "Checkout", "Paid"],
    benefits: [
      { title: "Official API Access", desc: "No phone bans. Secure official WhatsApp enterprise connections." },
      { title: "Broadcast Campaigns", desc: "Send WhatsApp broadcasts with 98% open rates directly." },
      { title: "Interactive Catalogs", desc: "List products, prices, and checkout links directly inside DMs." },
      { title: "Zapier Pipelines", desc: "Push WhatsApp phone numbers straight into Hubspot or ActiveCampaign." },
      { title: "Stripe & PayPal Cards", desc: "Collect payments seamlessly inside the chat threads." },
      { title: "Multi-Agent Support", desc: "Let multiple customer support agents manage one WhatsApp number." },
    ],
    useCases: [
      { title: "Delivery Services", desc: "Automate delivery orders, catalog selection, and payment confirmations." },
      { title: "Medical Bookings", desc: "Automate calendar appointments and send patient confirmation links." },
      { title: "Real Estate Brokers", desc: "Deliver property brochures automatically based on buyer criteria tags." },
    ],
  },
  messenger: {
    gradient: "from-[#1877F2] to-[#3B82F6]",
    accentColor: "#3B82F6",
    pillBg: "bg-blue-600 text-white",
    icon: <MessengerIcon className="w-8 h-8 text-white" />,
    title: "Your Messenger just got smarter",
    heroSubtitle: "Qualify Facebook ad leads, capture contacts, and automate customer support inside DMs.",
    heroImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    heroBadgeBg: "bg-blue-950/40 border border-blue-500/20",
    checklistTitle: "Automatically:",
    checklistItems: ["Reply to Ad Clicks", "Capture Email & Phone", "Qualify Lead Budget", "Distribute PDFs"],
    chatMessages: [
      { sender: "bot", text: "Hey! Thanks for clicking our Facebook ad. 🚀" },
      { sender: "bot", text: "Ready to download the free scaling templates PDF?" },
      { sender: "bot", text: "Please confirm your email address below." },
      { sender: "user", text: "hello@myagency.com", button: "Confirm Email" },
      { sender: "bot", text: "Done! Templates sent. Check your inbox." },
    ],
    testimonials: [
      {
        name: "Larry Kim",
        followers: "Ad Agency Founder",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
        review: "\"MESSENGER AUTOMATIONS CUT OUR CPL IN HALF AND DOUBLED QUALIFIED LEADS.\"",
      },
      {
        name: "Amanda Ross",
        followers: "E-com Director",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=150&auto=format&fit=crop",
        review: "\"OUR ADS CONVERT 3X BETTER WHEN LINKED DIRECTLY TO A MESSENGER FUNNEL.\"",
      },
    ],
    autopilotTitle: "Put Messenger lead capture on autopilot",
    autopilotSub: "Answer questions and capture data without high manual ad spend.",
    postMockupTitle: "Convert ad clicks into conversational leads",
    postMockupSub: "Automatically launch structured message funnels.",
    postMockupUser: "saas.growth.agency",
    postComments: [
      { user: "Kate Rivers", comment: "Send me details", reply: "DM sent" },
      { user: "John Miller", comment: "Is there a template?", reply: "Yes! Check your inbox" },
      { user: "Sam Patel", comment: "Pricing information?", reply: "Details sent to DM" },
    ],
    flowSteps: ["Ad Click", "DM", "Capture", "Synced"],
    benefits: [
      { title: "Instant Lead Capture", desc: "Capture names, email, and phone numbers with single-click buttons." },
      { title: "Facebook Ad Sync", desc: "Trigger Messenger automations immediately when users click 'Send Message'." },
      { title: "Smart Lead Scoring", desc: "Score leads based on replies to qualify budgets automatically." },
      { title: "Live Chat Handover", desc: "Seamlessly notify support agents to takeover when hot leads ask for help." },
      { title: "Attribution Analytics", desc: "Match closed sales directly back to specific ad creative sets." },
      { title: "CRM Databases", desc: "Push contacts directly into Salesforce, Hubspot, or Zoho CRM." },
    ],
    useCases: [
      { title: "Lead Generation", desc: "Distribute whitepapers and capture business emails inside ad threads." },
      { title: "Webinar RSVPs", desc: "Capture sign-ups and broadcast calendar alerts automatically." },
      { title: "Customer FAQs", desc: "Resolve 80% of support questions instantly using guided buttons." },
    ],
  },
  tiktok: {
    gradient: "from-[#000000] to-[#EC4899]",
    accentColor: "#EC4899",
    pillBg: "bg-pink-600 text-white",
    icon: <TikTokIcon className="w-8 h-8 text-white" />,
    title: "Your TikTok just got smarter",
    heroSubtitle: "Turn TikTok video views and profile clicks into sales. Automate comment responses instantly.",
    heroImage: "https://images.unsplash.com/photo-1557263503-0ee97ebd559e?q=80&w=600&auto=format&fit=crop",
    heroBadgeBg: "bg-pink-950/40 border border-pink-500/20",
    checklistTitle: "Automatically:",
    checklistItems: ["Reply to Video Comments", "Direct Traffic to Bio", "Distribute Coupons", "Capture Fans"],
    chatMessages: [
      { sender: "bot", text: "Hey TikTok fan! 🎬 Appreciate the comment on my video." },
      { sender: "bot", text: "Want to lock in a 20% off coupon code?" },
      { sender: "bot", text: "Confirm below to reveal the code." },
      { sender: "user", text: "Give coupon", button: "Get Coupon" },
      { sender: "bot", text: "Done! Use code TIKTOK20. Checkout link: checkout.com" },
    ],
    testimonials: [
      {
        name: "Jaden Styles",
        followers: "2.4M Followers",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop",
        review: "\"COMMENT TRIGGERS DRIVE 10X MORE TRAFFIC TO MY SHOPIFY BIO LINK.\"",
      },
      {
        name: "Sarah Miller",
        followers: "Brand Founder",
        avatar: "https://images.unsplash.com/photo-1558203728-00f45181dd84?q=80&w=150&auto=format&fit=crop",
        review: "\"TIKTOK VIEWS TURNED INTO BUYERS WHEN WE AUTOMATED BIO-LINK PROMO DMs.\"",
      },
    ],
    autopilotTitle: "Put TikTok growth on autopilot",
    autopilotSub: "Convert viral views into cash flow without manual messaging.",
    postMockupTitle: "Turn video comments into promo links",
    postMockupSub: "Automatically DM commenters discount parameters.",
    postMockupUser: "creator.hub",
    postComments: [
      { user: "Leo Myers", comment: "Link in bio?", reply: "Sent to DM" },
      { user: "Maya Ortiz", comment: "Where is this from?", reply: "Details in chat!" },
      { user: "Zack Fox", comment: "Is there a discount?", reply: "Check your inbox!" },
    ],
    flowSteps: ["Comment", "DM Inbox", "Promo", "Order"],
    benefits: [
      { title: "Viral Conversion", desc: "Never lose a comment lead. DM followers instant checkout links." },
      { title: "Bio Link Menus", desc: "Direct traffic to customized landing links inside TikTok app." },
      { title: "Discount Automations", desc: "Reward video commenters with unique, single-use promo codes." },
      { title: "CRM Sync", desc: "Collect fan emails and push directly to Mailchimp or Klaviyo." },
      { title: "Interactive Menus", desc: "Display products and buttons inside DMs." },
      { title: "TikTok Compliant", desc: "Uses official TikTok Graph API nodes to maintain safety." },
    ],
    useCases: [
      { title: "Shopify Creators", desc: "Automatically DM Shopify store collection links to video commenters." },
      { title: "Musicians & Bands", desc: "Distribute ticket pre-sale codes when fans comment 'MUSIC'." },
      { title: "Influencer Agencies", desc: "Auto-respond to brand partnership inquiries inside TikTok DMs." },
    ],
  },
  "set2send-ai": {
    gradient: "from-[#F97316] to-[#EC4899]",
    accentColor: "#F97316",
    pillBg: "bg-orange-600 text-white",
    icon: <AISparkIcon className="w-8 h-8 text-white" />,
    title: "Your conversations just got smarter with AI",
    heroSubtitle: "Deploy hyper-realistic AI agents to qualify budgets, handle FAQs, and book sales.",
    heroImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    heroBadgeBg: "bg-orange-950/40 border border-orange-500/20",
    checklistTitle: "Automatically:",
    checklistItems: ["Handle Complex FAQs", "Qualify Lead Budgets", "Schedule Strategy Calls", "Sync CRM Records"],
    chatMessages: [
      { sender: "bot", text: "Hi! How can I help you scale today?" },
      { sender: "user", text: "Do you offer custom SLA plans?" },
      { sender: "bot", text: "Yes! Our enterprise plan includes dedicated SLA terms and priority nodes." },
      { sender: "user", text: "Schedule 15m demo call", button: "Confirm Demo" },
      { sender: "bot", text: "Done! Demo call confirmed. Calendar invite dispatched to your email." },
    ],
    testimonials: [
      {
        name: "Alex Rivers",
        followers: "Agency Owner",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop",
        review: "\"AI AGENT CLOSED 14 CALENDAR SLOTS OVERNIGHT BY HANDLING INBOUND DMs.\"",
      },
      {
        name: "David Kim",
        followers: "SaaS Founder",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop",
        review: "\"HAVING A CUSTOM-TRAINED AI AGENT RESOLVE FAQs BEFORE BOOKING CALLS IS GAME-CHANGING.\"",
      },
    ],
    autopilotTitle: "Put customer acquisition on AI autopilot",
    autopilotSub: "Answer questions and qualify client accounts 24/7 without delays.",
    postMockupTitle: "Deploy smart context-aware AI closers",
    postMockupSub: "Pre-train agents with your company pricing PDFs.",
    postMockupUser: "ai.agent.console",
    postComments: [
      { user: "Toby Vance", comment: "Pricing package?", reply: "Consulting AI DM active" },
      { user: "Lucy Gray", comment: "Does this sync CRM?", reply: "CRM Qualifier DM active" },
      { user: "Mark Wood", comment: "Can we test it?", reply: "Check your inbox!" },
    ],
    flowSteps: ["Context", "Vector Search", "Qualified", "Synced"],
    benefits: [
      { title: "Context-Aware Chat", desc: "Deploy natural AI conversational models trained on your business documents." },
      { title: "Document Training", desc: "Upload PDFs, Notion pages, or website URLs in one click." },
      { title: "Budget Qualification", desc: "Qualify client budgets and tag leads inside CRM dynamically." },
      { title: "Attribution Logging", desc: "Identify which ad vectors generated high quality conversations." },
      { title: "Multi-lingual Support", desc: "Converse with leads in 95+ languages automatically." },
      { title: "CRM Integrations", desc: "Push verified leads instantly into Hubspot, Salesforce, or Zoho." },
    ],
    useCases: [
      { title: "SaaS Teams", desc: "Qualify enterprise budgets and sync with outbound SDR sales teams." },
      { title: "High Ticket Coaches", desc: "Converse with students, answer coaching syllabus FAQs, and book spots." },
      { title: "Agencies", desc: "Deploy client qualifiers that review marketing goals inside Instagram DMs." },
    ],
  },
};

export default function PlatformProductPage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const resolvedParams = use(params);
  const platform = resolvedParams.platform;

  // Retrieve platform data or fallback to instagram
  const data = PLATFORM_DATA[platform] || PLATFORM_DATA.instagram;

  // Showcase state timeline machine
  const [showcaseStep, setShowcaseStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showcaseStep === 0) {
      timer = setTimeout(() => setShowcaseStep(1), 1000);
    } else if (showcaseStep === 1) {
      timer = setTimeout(() => setShowcaseStep(2), 1500);
    } else if (showcaseStep === 2) {
      timer = setTimeout(() => setShowcaseStep(3), 1500);
    } else if (showcaseStep === 3) {
      // simulate delay before user click
      timer = setTimeout(() => setShowcaseStep(4), 1800);
    } else if (showcaseStep === 4) {
      // user clicked, load bot response
      timer = setTimeout(() => setShowcaseStep(5), 800);
    } else if (showcaseStep === 5) {
      // pause and restart
      timer = setTimeout(() => setShowcaseStep(0), 4000);
    }

    return () => clearTimeout(timer);
  }, [showcaseStep]);

  // Section scroll-animation handlers
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen flex flex-col selection:bg-purple-500 selection:text-white relative overflow-x-hidden">

      {/* Dynamic Background Backdrop Glows */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[35%] left-[-15%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[165px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-indigo-50/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Styled Marquee keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee-scroll 25s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `
      }} />

      {/* Shared Navbar */}
      <Navbar />

      {/* ==================================================
          SECTION 1 — HERO
          ================================================== */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden bg-[linear-gradient(135deg,#09090B_0%,#111827_45%,#1E1B4B_100%)]">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

        {/* Diagonal Dynamic Gradient backdrop (subtle glow for dark theme) */}
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${data.gradient} opacity-20 z-0`}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">

            {/* Dynamic visual tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-extrabold shadow-sm ${data.heroBadgeBg} text-white mb-6`}
            >
              {React.cloneElement(data.icon, { className: "w-3.5 h-3.5" })}
              <span>{platform} automation</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[0.95] max-w-2xl font-sans"
            >
              {data.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#B6BCC8] font-sans font-normal mt-6 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed"
            >
              {data.heroSubtitle}
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/auth/google"
                className="w-full sm:w-auto text-center px-10 py-4 bg-white text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-full hover:scale-[1.03] transition-transform shadow-lg cursor-pointer"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Right Hero Content: Badges & Brand image mockup */}
          <div className="lg:col-span-5 relative flex flex-col justify-end items-center lg:items-end w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)] border border-white/10 group aspect-[4/5]"
            >
              <img
                src={data.heroImage}
                alt={`${platform} Marketing Creator`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

              {/* Overlay badges inside photo frame */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4 text-xs font-bold text-white text-left font-mono">
                {/* Meta Badge */}
                <div className="bg-black/55 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-white/5">
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.48 7.37c-1.16 0-2.22.42-3.08 1.13a5.04 5.04 0 00-3.08-1.13c-2.48 0-4.5 1.74-4.5 3.88s2.02 3.88 4.5 3.88c1.16 0-2.22-.42 3.08-1.13.86.71 1.92 1.13 3.08 1.13 2.48 0 4.5-1.74 4.5-3.88s-2.02-3.88-4.5-3.88zm0 6.26c-1.4 0-2.54-1.07-2.54-2.38s1.14-2.38 2.54-2.38 2.54 1.07 2.54 2.38-1.14 2.38-2.54 2.38zm-8.96 0c-1.4 0-2.54-1.07-2.54-2.38s1.14-2.38 2.54-2.38 2.54 1.07 2.54 2.38-1.14 2.38-2.54 2.38z" />
                  </svg>
                  <div>
                    <p className="text-[10px] leading-tight">Meta Business</p>
                    <p className="text-[9px] text-gray-500 leading-none">Partner</p>
                  </div>
                </div>

                {/* TikTok Badge */}
                <div className="bg-black/55 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-white/5">
                  <TikTokIcon className="w-4 h-4 text-pink-500" />
                  <div>
                    <p className="text-[10px] leading-tight">TikTok Marketing</p>
                    <p className="text-[9px] text-gray-500 leading-none">Partner</p>
                  </div>
                </div>

                {/* G2 rating */}
                <div className="bg-black/55 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-white/5">
                  <div className="w-5 h-5 bg-[#ff492c] text-white rounded font-sans font-black flex items-center justify-center text-[10px]">G2</div>
                  <div>
                    <p className="text-[10px] leading-tight">4.6 / 5 Stars</p>
                    <p className="text-[9px] text-gray-500 leading-none">SaaS Rating</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 2 — FEATURE SHOWCASE
          ================================================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full relative">
        <div className="absolute top-10 left-10 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white border border-[#E8DFD3] rounded-[36px] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-md"
        >
          {/* Checklist on Left */}
          <div className="lg:col-span-5 text-left flex flex-col justify-center items-start">
            <span className="text-[10px] font-semibold font-mono text-[#7A7A7A] uppercase tracking-[0.18em] mb-4">
              interactive demo
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[800] text-[#181818] tracking-tight leading-none mb-6">
              {data.checklistTitle}
            </h2>

            {/* Checklist elements staggered */}
            <div className="flex flex-col gap-4 w-full">
              {data.checklistItems.map((item, idx) => {
                // Determine step visibility
                // Step 1: index 0
                // Step 2: index 1
                // Step 3: index 2
                // Step 5: index 3
                const isStepVisible =
                  idx === 0
                    ? showcaseStep >= 1
                    : idx === 1
                      ? showcaseStep >= 2
                      : idx === 2
                        ? showcaseStep >= 3
                        : showcaseStep >= 5;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 transition-all duration-300"
                    style={{
                      opacity: isStepVisible ? 1 : 0.25,
                      transform: isStepVisible ? "translateX(0)" : "translateX(-10px)",
                    }}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#E9FBF3] border border-[#BCEFD6] flex items-center justify-center text-[#14B86A] shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5" strokeWidth={3.5} />
                    </div>
                    <span className="text-base sm:text-lg font-semibold text-[#2B2B2B]">
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Creator & Chat overlay on Right */}
          <div className="lg:col-span-7 flex justify-center items-center w-full">
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-50">

              {/* Creator Background */}
              <img
                src={data.heroImage}
                alt="Creator Profile Showcase"
                className="w-full h-full object-cover object-center scale-105"
              />
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Chat Overlays Container */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end gap-3.5">
                <AnimatePresence>

                  {/* Bubble 1 */}
                  {showcaseStep >= 1 && (
                    <motion.div
                      key="bubble-1"
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="bg-[#6E2CF4] text-white rounded-2xl rounded-bl-none px-4 py-3 shadow-xl max-w-[80%] self-start text-left text-xs font-semibold leading-relaxed relative border border-white/15"
                    >
                      {data.chatMessages[0].text}
                    </motion.div>
                  )}

                  {/* Bubble 2 */}
                  {showcaseStep >= 2 && (
                    <motion.div
                      key="bubble-2"
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="bg-[#6E2CF4] text-white rounded-2xl rounded-bl-none px-4 py-3 shadow-xl max-w-[80%] self-start text-left text-xs font-semibold leading-relaxed relative border border-white/15"
                    >
                      {data.chatMessages[1].text}
                    </motion.div>
                  )}

                  {/* Bubble 3 */}
                  {showcaseStep >= 3 && (
                    <motion.div
                      key="bubble-3"
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="bg-[#6E2CF4] text-white rounded-2xl rounded-bl-none px-4 py-3 shadow-xl max-w-[80%] self-start text-left text-xs font-semibold leading-relaxed relative border border-white/15 flex flex-col gap-2.5 items-start"
                    >
                      <p>{data.chatMessages[2].text}</p>

                      {/* Interactive Button overlay */}
                      {data.chatMessages[3] && (
                        <button
                          onClick={() => setShowcaseStep(5)}
                          className={`w-full text-center py-2 px-4 bg-white hover:bg-zinc-150 text-zinc-950 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all shadow border border-zinc-200/80 cursor-pointer ${showcaseStep >= 4 ? "scale-[0.97] opacity-65 bg-zinc-100" : ""
                            }`}
                        >
                          {showcaseStep >= 4 ? "Sending follow..." : data.chatMessages[3].button}
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* Bubble 4 (User reply) */}
                  {showcaseStep === 4 && (
                    <motion.div
                      key="bubble-4"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-gray-100 text-white rounded-2xl rounded-br-none px-4 py-2.5 shadow-xl max-w-[70%] self-end text-right text-xs font-semibold leading-normal relative border border-white/5"
                    >
                      {data.chatMessages[3]?.text}
                    </motion.div>
                  )}

                  {/* Bubble 5 (Bot final reply) */}
                  {showcaseStep >= 5 && (
                    <motion.div
                      key="bubble-5"
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="bg-white text-white rounded-2xl rounded-bl-none px-4 py-3 shadow-xl max-w-[80%] self-start text-left text-xs font-semibold leading-relaxed border border-gray-200 flex items-center gap-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                      {/* Small avatar */}
                      <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center font-bold text-[10px] text-white shrink-0 border border-purple-400">Done</div>
                      <span className="flex-1">{data.chatMessages[4].text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================================================
          SECTION 3 — TESTIMONIAL MARQUEE
          ================================================== */}
      <section className="py-16 bg-white text-zinc-900 overflow-hidden relative select-none">

        {/* Title bar */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest">social proof</span>
            <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight leading-none mt-2">
              Loved by creator businesses
            </h3>
          </div>
          <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider hidden md:block">
            ← Pause on Hover →
          </span>
        </div>

        {/* Scrolling track */}
        <div className="w-full flex overflow-hidden py-4 border-y border-zinc-200">
          <div className="marquee-track flex items-center gap-8">

            {/* Render items twice for infinite seam */}
            {[...data.testimonials, ...data.testimonials].map((test, idx) => (
              <div
                key={idx}
                className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 w-[360px] flex flex-col justify-between shadow-sm shrink-0"
              >
                <p className="text-sm font-extrabold italic leading-relaxed text-zinc-900 text-left">
                  {test.review}
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-zinc-200/50 pt-4">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-300"
                  />
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-zinc-900 leading-tight">{test.name}</h4>
                    <span className="text-[9px] text-gray-500 font-bold font-mono uppercase tracking-wider">{test.followers}</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 4 — AUTOPILOT SECTION
          ================================================== */}
      <section className="w-full py-28 px-6 bg-[#FDFBF7] text-center relative border-b border-[#E7DED2]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,152,36,0.04)_0%,transparent_70%)] pointer-events-none z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#C99724]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto flex flex-col items-center gap-6 relative z-10"
        >
          {/* Redesigned Glowing Icon */}
          <div className="w-16 h-16 rounded-full bg-[#FFF5DD] border border-[#E7C978] flex items-center justify-center shadow-sm relative">
            {React.cloneElement(data.icon, { className: "w-8 h-8 text-[#C99724]" })}
          </div>

          <h2 className="text-[48px] sm:text-[60px] lg:text-[72px] font-black text-[#1A1A1A] tracking-[-2px] leading-[1.05] max-w-2xl font-playfair">
            {data.autopilotTitle}
          </h2>

          <p className="text-[#555555] text-xl leading-[1.8] max-w-[700px] font-sans font-medium mt-2">
            {data.autopilotSub}
          </p>

          <Link
            href="/auth/google"
            className="mt-4 px-10 py-4 bg-[#181818] hover:bg-[#C99724] text-white hover:text-[#181818] rounded-full shadow-lg transition-all duration-300 ease-out font-bold text-xs uppercase tracking-widest"
          >
            Start Free
          </Link>
        </motion.div>
      </section>

      {/* ==================================================
          SECTION 5 — COMMENTS TO SALES
          ================================================== */}
      <section className="py-24 bg-[#FFF8EF] relative border-b border-[#E7DED2]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,152,36,0.03)_0%,transparent_60%)] pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">

          {/* Left Text */}
          <div className="lg:col-span-5 text-left flex flex-col items-start">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFF5DD] border border-[#E7C978] text-[#B8860B] text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
              conversion funnel
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#1A1A1A] tracking-tight leading-[1.05] max-w-md font-playfair mb-6">
              {data.postMockupTitle}
            </h2>
            <p className="text-[#555555] text-base leading-relaxed max-w-md font-medium mb-8">
              {data.postMockupSub}
            </p>

            {/* Visual flow markers */}
            <div className="mb-8 flex items-center gap-4 bg-white border border-[#E7DED2] rounded-2xl p-4 w-full max-w-md shadow-sm">
              {data.flowSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-mono font-bold text-[#8A8A8A] uppercase">Step {idx + 1}</span>
                    <span className="text-xs font-extrabold text-[#1A1A1A] mt-1 uppercase tracking-wider">{step}</span>
                  </div>
                  {idx < data.flowSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-[#C99724]" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <Link
              href="/auth/google"
              className="px-10 py-4 bg-[#181818] hover:bg-[#C99724] text-white hover:text-[#181818] rounded-full shadow-md transition-all duration-300 ease-out font-bold text-xs uppercase tracking-widest"
            >
              Get Started
            </Link>
          </div>

          {/* Right Post Mockup */}
          <div className="lg:col-span-7 flex justify-center items-center w-full">
            <div className="w-full max-w-[460px] rounded-[24px] border border-[#E7DED2] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.05)] p-6 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] hover:border-[#C99724] hover:scale-[1.02] transition-all duration-300">

              {/* Profile Bar */}
              <div className="flex items-center gap-3 border-b border-[#E7DED2] pb-4 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#FFF5DD] border border-[#E7C978] flex items-center justify-center font-bold text-xs uppercase tracking-wider text-[#B8860B]">FS</div>
                <div className="text-left flex-1">
                  <h4 className="text-xs font-bold text-[#1A1A1A] leading-none">@{data.postMockupUser}</h4>
                  <p className="text-[9px] text-[#8A8A8A] leading-none mt-1 uppercase font-mono">Live Post Feed</p>
                </div>
              </div>

              {/* Dynamic Comments List */}
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto scrollbar-none pr-1">
                {data.postComments.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2 text-xs leading-normal">
                    {/* User comment */}
                    <div className="flex gap-2.5 items-start">
                      <div className="w-6 h-6 rounded-full bg-[#FDFBF7] border border-[#E7DED2] flex items-center justify-center text-[9px] font-bold text-[#555555] font-mono shrink-0 uppercase">{item.user.substring(0, 2)}</div>
                      <div className="text-left bg-[#FDFBF7] border border-[#E7DED2] px-3.5 py-2.5 rounded-2xl rounded-tl-none flex-1">
                        <span className="font-bold text-[#1A1A1A] block">@{item.user}</span>
                        <span className="text-[#555555] mt-0.5 block">{item.comment}</span>
                      </div>
                    </div>

                    {/* Bot reply */}
                    <motion.div
                      initial={{ opacity: 0, x: 15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.4 }}
                      className="flex gap-2.5 items-start pl-8"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FFF5DD] border border-[#E7C978] flex items-center justify-center text-[9px] font-bold text-[#B8860B] shrink-0">B</div>
                      <div className="text-left bg-[#FFF8EF] border border-[#E7C978] px-3.5 py-2.5 rounded-2xl rounded-tl-none flex-1">
                        <span className="font-bold text-[#B8860B] block">@{data.postMockupUser} <span className="text-[8px] bg-[#FFF5DD] border border-[#E7C978] px-1.5 py-0.5 rounded text-[#B8860B] ml-1.5 uppercase font-mono tracking-wider font-extrabold">Auto</span></span>
                        <span className="text-[#4F4F4F] mt-0.5 block">@{item.user} {item.reply}</span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 6 — CTA SECTION
          ================================================== */}
      <section className="py-28 px-6 border-t border-[#E7DED2] text-center relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] to-[#FFF6EA]">
        {/* Glow grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(232,223,211,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(232,223,211,0.15)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(201,152,36,0.05)_0%,transparent_70%)] pointer-events-none z-0"></div>

        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-[48px] sm:text-[60px] lg:text-[72px] font-black text-[#1A1A1A] tracking-[-2px] leading-[1.05] max-w-2xl font-playfair">
            Unlock 24/7 Conversations
          </h2>
          <p className="text-[#555555] text-sm sm:text-base max-w-md mx-auto leading-relaxed font-medium mb-4">
            Connect your page and start converting commenter triggers in under 2 minutes. No credit card required.
          </p>
          <Link 
            href="/auth/google"
            className="px-10 py-4 bg-[#181818] hover:bg-[#C99724] text-white hover:text-[#181818] rounded-full shadow-md transition-all duration-300 ease-out font-bold text-xs uppercase tracking-widest text-center"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}
