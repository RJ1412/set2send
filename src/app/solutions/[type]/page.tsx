"use client";

import React, { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, MessageSquare, Zap, ChevronLeft, ChevronRight, User, TrendingUp, Mouse, Play } from "lucide-react";
import Navbar, { TikTokIcon } from "../../components/Navbar";
import Footer from "../../components/Footer";

// Solutions data config
const SOLUTIONS_DATA: Record<
  string,
  {
    heroTitle: string;
    heroSub: string;
    heroBgImage: string;
    chatUserMsg: string;
    chatBotMsg: string;
    chatButtonText: string;
    socialMarquee: Array<{ name: string; followers: string; review: string; img: string }>;
    valueHeading: string;
    interactionTitle: string;
    interactionText: string;
    interactionBg: string;
    interactionMockTitle: string;
    storyUserMsg: string;
    storyBotMsg: string;
    featureCards: Array<{ title: string; desc: string }>;
    timelineSteps: Array<{ title: string; desc: string }>;
    successStories: Array<{
      client: string;
      metrics: string;
      revenue: string;
      before: string;
      after: string;
      img: string;
    }>;
  }
> = {
  creators: {
    heroTitle: "Effortless engagement, big results",
    heroSub: "Turn views into followers and followers into customers with intelligent automation.",
    heroBgImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Awesome! Need this.",
    chatBotMsg: "Hi there! Here's the registration link.",
    chatButtonText: "Get The Link",
    socialMarquee: [
      {
        name: "Jenna Kutcher",
        followers: "1M Followers",
        review: "\"THIS IS A MUST-HAVE FOR CREATORS AND ENTREPRENEURS. SERIOUSLY A GAME-CHANGER!\"",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      },
      {
        name: "Konstantinos Synodinos",
        followers: "950K Followers",
        review: "\"FOR CREATORS ABOVE 10K FOLLOWERS, set2send IS A MUST.\"",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      },
      {
        name: "Brock Johnson",
        followers: "1.2M Followers",
        review: "\"set2send IS HOW WE AUTOMATICALLY CONVERT COMMENTS INTO VIP LEADS.\"",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Grow faster, engage better, convert more",
    interactionTitle: "Get more action from every interaction",
    interactionText: "Capture every signal from comments, DMs, stories, and follows.",
    interactionBg: "from-[#f97316] to-[#ec4899]",
    interactionMockTitle: "Auto-reply on every story",
    storyUserMsg: "Hey, please send me the coupon! I'm so interested 😍",
    storyBotMsg: "Hey! Thanks for replying. Here is your checkout discount code: SAVE20",
    featureCards: [
      { title: "Auto DM", desc: "Instantly respond to inbound questions with custom link parameters." },
      { title: "Comment Automation", desc: "Reply automatically to post comments and send promo DMs instantly." },
      { title: "Story Automation", desc: "Engage followers who mention or reply to your stories on autopilot." },
      { title: "Lead Collection", desc: "Qualify audience profiles, capture email logs, and export to CRM." },
    ],
    timelineSteps: [
      { title: "Step 1: User interacts", desc: "A follower comments 'YES' on your reel or replies to your story." },
      { title: "Step 2: Automation triggers", desc: "Set2Send detects the comment and dispatches the customized DM funnel." },
      { title: "Step 3: Lead converts", desc: "The user registers email, receives a checkout link, and closes the order." },
    ],
    successStories: [
      {
        client: "Vanessa Lau (Course Creator)",
        metrics: "+38% Conversion Gain",
        revenue: "$45,000 Revenue Added",
        before: "DMs pile up unread. Distributing masterclass links takes 15 hours a week.",
        after: "Instant comment triggers handle lead delivery 24/7. 100% of links delivered in 2s.",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop",
      },
      {
        client: "Brock Johnson (Insta Coach)",
        metrics: "+120% Email Subscribers",
        revenue: "2,400 New Leads / Mo",
        before: "Profile link in bio receives minimal click rates from video views.",
        after: "Comment-to-DM capture logs email addresses directly inside messaging boxes.",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  ecommerce: {
    heroTitle: "Convert browsers into buyers",
    heroSub: "Recover abandoned checkouts, suggest matched items, and scale revenue automatically.",
    heroBgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Do you have this in size M?",
    chatBotMsg: "Yes! Here is the size M product link with a 10% coupon.",
    chatButtonText: "Shop Product M",
    socialMarquee: [
      {
        name: "EcoStyle Wear",
        followers: "eCom Brand",
        review: "\"ABANDONED CHECKOUT RECOVERY CONVERTED 24% OF LOST CARTS BACK TO PAID CLIENTS.\"",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      },
      {
        name: "Star Brew Coffee",
        followers: "Daily Deliveries",
        review: "\"WHATSAPP DMs ALLOWED CLIENTS TO BUY DRINKS AND RESERVATIONS DIRECTLY IN-CHAT.\"",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Close checkouts, upsell lists, retain clients",
    interactionTitle: "Turn abandoned carts into revenue",
    interactionText: "Instantly trigger reminder DMs when shoppers leave checkout.",
    interactionBg: "from-[#059669] to-[#10b981]",
    interactionMockTitle: "Checkout recovery in action",
    storyUserMsg: "I forgot my cart! Is it still saved?",
    storyBotMsg: "Yes, we reserved your style cart! Click below to complete checkout with free shipping.",
    featureCards: [
      { title: "Cart Recovery", desc: "Automate checkout reminders inside Instagram & WhatsApp DMs." },
      { title: "Product Catalogs", desc: "Display product images, sizes, and checkout parameters." },
      { title: "Instant Upselling", desc: "Suggest matched items immediately after a checkout confirms." },
      { title: "Order Syncing", desc: "Pass order logs automatically to Shopify, WooCommerce, or Stripe." },
    ],
    timelineSteps: [
      { title: "Step 1: Shopper exits cart", desc: "Shopper abandons Shopify checkout cart after entering phone details." },
      { title: "Step 2: Automate follow-up", desc: "Set2Send dispatches a checkout link inside WhatsApp 30 minutes later." },
      { title: "Step 3: Conversion confirms", desc: "The user completes the payment, and inventory updates automatically." },
    ],
    successStories: [
      {
        client: "EcoWear Boutique",
        metrics: "+24% Recovered Sales",
        revenue: "$18,500 Saved / Mo",
        before: "Emails recovering carts are sent but ignored with 15% open rates.",
        after: "WhatsApp cart alerts achieve 98% open rates and recover orders instantly.",
        img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  marketers: {
    heroTitle: "Manage communities at scale",
    heroSub: "Automate social campaigns, track leads, and tag audience profiles on autopilot.",
    heroBgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Register me for the webinar!",
    chatBotMsg: "Confirmed! What is your best business email?",
    chatButtonText: "Register Webinar",
    socialMarquee: [
      {
        name: "Media Growth Inc",
        followers: "Agency client",
        review: "\"AUTOMATING LEAD SEGMENTATION DOUBLED OUR TARGET CAMPAIGN Attributions.\"",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Target segments, track clicks, grow lists",
    interactionTitle: "Capture qualified ad leads",
    interactionText: "Qualify user interest parameters before dispatching sales links.",
    interactionBg: "from-[#1d4ed8] to-[#3b82f6]",
    interactionMockTitle: "Webinar opt-in sequence",
    storyUserMsg: "Info please!",
    storyBotMsg: "Registering you for SaaS masterclass! Confirm your email below.",
    featureCards: [
      { title: "Campaign Workflows", desc: "Build visual flow charts connecting trigger comments to DMs." },
      { title: "Audience Tagging", desc: "Segment clients automatically based on budget choices." },
      { title: "Ad Campaign Sync", desc: "Launch conversation funnels when users click Meta ad buttons." },
      { title: "Analytics Log", desc: "Track conversion parameters back to creative content posts." },
    ],
    timelineSteps: [
      { title: "Step 1: User comments", desc: "Follower comments a keyword on your promotional post." },
      { title: "Step 2: Qualify parameters", desc: "DM funnel asks context questions to analyze lead target score." },
      { title: "Step 3: Sync CRM database", desc: "Export details directly to HubSpot or active email lists." },
    ],
    successStories: [
      {
        client: "Growth Hackers Media",
        metrics: "+140% Lead Generation",
        revenue: "3,500 emails captured",
        before: "Manual DM responses take 2 days, losing hot interest lead periods.",
        after: "Instant ad-to-DM triggers qualify and log emails in 10 seconds.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  agencies: {
    heroTitle: "Scale client results without scaling workload",
    heroSub: "Deploy premade templates, monitor attributions, and manage client portals from one console.",
    heroBgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Client account setup is ready.",
    chatBotMsg: "Nice! Importing agency workflow templates now.",
    chatButtonText: "Deploy Template",
    socialMarquee: [
      {
        name: "Vortex Media Agency",
        followers: "15 Clients Connected",
        review: "\"WE CAN SERVICE TRIPLE THE CREATOR CLIENT LIST VOLUME WITH THE TEMPLATE ENGINE.\"",
        img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Consolidate management, report ROI, copy funnels",
    interactionTitle: "Unified Agency Client Dashboards",
    interactionText: "Deploy tested DM automations across multiple client channels in seconds.",
    interactionBg: "from-[#7c3aed] to-[#8b5cf6]",
    interactionMockTitle: "Unified Client workspace",
    storyUserMsg: "Do you have pricing guides?",
    storyBotMsg: "Here is client brochure PDF! DM me if you need strategy slot bookings.",
    featureCards: [
      { title: "Client Portals", desc: "Switch client workspaces and configurations from one control panel." },
      { title: "Template Duplication", desc: "Duplicate validated high-performing DM structures in one click." },
      { title: "Attribution Reports", desc: "Build client ROI reports illustrating lead source attributions." },
      { title: "Shared Permissions", desc: "Assign team roles, builder edit permissions, and login keys." },
    ],
    timelineSteps: [
      { title: "Step 1: Build base template", desc: "Create a comment-to-lead flow once for your main workspace." },
      { title: "Step 2: Copy to client workspaces", desc: "Distribute the automation structure to all client connected accounts." },
      { title: "Step 3: Sync conversion data", desc: "Consolidate ROI dashboards, illustrating client attribution analytics." },
    ],
    successStories: [
      {
        client: "Vortex Marketing Group",
        metrics: "10x ROI for Clients",
        revenue: "15 accounts managed",
        before: "Managing client DM comments manually requires hiring 5 virtual assistants.",
        after: "Templates handle 95% of creator inbound queries, saving $6,000/mo.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  brands: {
    heroTitle: "Build stronger customer relationships",
    heroSub: "Scale brand loyalty and automate omnichannel support inside secure Meta verified pipelines.",
    heroBgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Where is my order #551?",
    chatBotMsg: "Checking order #551... Deployed! It is out for delivery today.",
    chatButtonText: "Track Order #551",
    socialMarquee: [
      {
        name: "Luxe Glow Cosmetics",
        followers: "Retail Brand",
        review: "\"PERSONALIZED BRAND BROADCASTS SECURED +30% VIP SIGN-UP RATES.\"",
        img: "https://images.unsplash.com/photo-1558203728-00f45181dd84?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Nurture loyalty, automate broadcasts, secure data",
    interactionTitle: "Enterprise Compliance Chat",
    interactionText: "Nurture client relationships inside verified, compliant messaging tunnels.",
    interactionBg: "from-[#b45309] to-[#d97706]",
    interactionMockTitle: "Omnichannel customer care",
    storyUserMsg: "How do I return?",
    storyBotMsg: "Check order status below, or click live agent to transfer.",
    featureCards: [
      { title: "Verified Sender Status", desc: "Secure official WhatsApp Green Badge business profiles." },
      { title: "VIP Broadcasting", desc: "Distribute discount parameters to opt-in shopper segments." },
      { title: "Omnichannel Sync", desc: "Unify support histories across SMS, WhatsApp, and social DMs." },
      { title: "Custom Webhooks", desc: "Bridge messaging logs straight to Oracle, Salesforce, or SAP databases." },
    ],
    timelineSteps: [
      { title: "Step 1: Shopper opts-in", desc: "Shopper scans QR code or clicks custom link to subscribe to VIP club." },
      { title: "Step 2: Automate nurture", desc: "Send personalized support broadcasts regarding catalog updates." },
      { title: "Step 3: Sync custom systems", desc: "Store conversation tags inside secure enterprise databases." },
    ],
    successStories: [
      {
        client: "Luxe Cosmetics Global",
        metrics: "+35% Retention Lift",
        revenue: "50,000+ chats / mo",
        before: "Customer support queues are backlogged for days, hurting retention.",
        after: "AI workflows handle 80% of support queries, maintaining high feedback scores.",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  saas: {
    heroTitle: "Scale SaaS product growth",
    heroSub: "Capture high-intent leads from social comments, qualify budget profiles, and book demos on autopilot.",
    heroBgImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "I need a custom demo.",
    chatBotMsg: "Awesome! What is your team size and monthly budget?",
    chatButtonText: "Book Strategy Call",
    socialMarquee: [
      {
        name: "Flow Analytics",
        followers: "B2B SaaS",
        review: "\"AUTOMATED COMMENT TRIGGERS INCREASED DEMO BOOKINGS BY 54% ON THE FIRST MONTH.\"",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Qualify developers, log leads, schedule meetings",
    interactionTitle: "Secure qualified SaaS leads",
    interactionText: "Instantly reply to comments with demo reservation links.",
    interactionBg: "from-[#4338ca] to-[#6366f1]",
    interactionMockTitle: "Demo qualification loop",
    storyUserMsg: "Can I try the sandbox?",
    storyBotMsg: "Yes, here is your sandbox access link! Register your business email below.",
    featureCards: [
      { title: "CRM Lead Sync", desc: "Instantly export qualified leads to HubSpot, Salesforce, or custom DBs." },
      { title: "Budget Profiling", desc: "Segment inbound accounts automatically by team size and budget constraints." },
      { title: "Demo Bookings", desc: "Integrate with Calendly or Cal.com directly inside user messaging folders." },
      { title: "Product Analytics", desc: "Track channel attributions back to monthly recurring revenue metrics." },
    ],
    timelineSteps: [
      { title: "Step 1: User requests trial", desc: "User comments 'TRIAL' or tags your SaaS platform product page." },
      { title: "Step 2: Interactive qualification", desc: "Set2Send triggers a context menu asking about their team requirements." },
      { title: "Step 3: Instant sandbox setup", desc: "Delivers direct sandbox credentials and schedules a demo call." },
    ],
    successStories: [
      {
        client: "Flow Analytics Inc.",
        metrics: "+54% Strategy Bookings",
        revenue: "$32,000 MRR Added",
        before: "Inbound social leads are ignored because salespeople only monitor emails.",
        after: "Comment-to-DM qualifiers book meetings directly into account executive calendars.",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  coaches: {
    heroTitle: "Scale your coaching enrollment",
    heroSub: "Turn reel comments and story replies into high-ticket application bookings and course sales automatically.",
    heroBgImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "I want to join the mastermind!",
    chatBotMsg: "Amazing! Check out our brochure and apply for slot reviews below.",
    chatButtonText: "Apply For Mastermind",
    socialMarquee: [
      {
        name: "Elevate Coach",
        followers: "500K Audience",
        review: "\"CONVERTING REEL COMMENTS TO DM APPLICATIONS SAVED 20 HOURS OF MANUAL outreach WEEKLY.\"",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Close mastermind applications, sell programs",
    interactionTitle: "High-Ticket Application Funnels",
    interactionText: "Deliver curriculum resources and application forms instantly upon user comments.",
    interactionBg: "from-[#be185d] to-[#db2777]",
    interactionMockTitle: "Coaching application sequence",
    storyUserMsg: "How much is the boot camp?",
    storyBotMsg: "Here are details! Fill out this 1-min form to qualify for a free coach slot strategy call.",
    featureCards: [
      { title: "Application Gates", desc: "Qualify student parameters before giving out strategy scheduling slots." },
      { title: "Resource Delivery", desc: "Send coaching pdf guides, checklists, or videos straight to user DMs." },
      { title: "Calendar Integrations", desc: "Book consultation calls directly inside social messaging boxes." },
      { title: "Student Logging", desc: "Log applicant profiles into active email databases for auto-nurtures." },
    ],
    timelineSteps: [
      { title: "Step 1: Student comments", desc: "Viewers comment 'COACH' on your educational video content." },
      { title: "Step 2: Qualify parameters", desc: "Deliver course guides and ask contextual questions to score student fits." },
      { title: "Step 3: Book advisory call", desc: "Deliver booking slot links to qualified applicants instantly." },
    ],
    successStories: [
      {
        client: "Vanessa Lau Coaching",
        metrics: "+68% Coaching Enrollees",
        revenue: "220+ application logs",
        before: "Potential students drop off because scheduling links are buried in bio tags.",
        after: "Interactive comment-to-DM triggers scale qualified applicant registries.",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  realestate: {
    heroTitle: "Automate property inquiries",
    heroSub: "Deliver walkthrough videos, pricing logs, and slot booking links to prospective buyers 24/7.",
    heroBgImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Send pricing for the villa.",
    chatBotMsg: "Sure! Here is the pricing brochure PDF and a video tour link.",
    chatButtonText: "View Villa Details",
    socialMarquee: [
      {
        name: "Lux Living Realtors",
        followers: "Premium Agency",
        review: "\"SENDING LISTING LINKS INSTANTLY VIA DMs LED TO A 3X INCREASE IN PROPERTY VIEWINGS.\"",
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Distribute brochure lists, schedule walkthrough tours",
    interactionTitle: "Instant Property Walkthroughs",
    interactionText: "Dispatch virtual video tours and listing pricing details automatically.",
    interactionBg: "from-[#0369a1] to-[#0284c7]",
    interactionMockTitle: "Property listing automation",
    storyUserMsg: "Is the townhouse still available?",
    storyBotMsg: "Yes, we are hosting tours this Saturday! Click below to save your viewing spot.",
    featureCards: [
      { title: "Automated Tours", desc: "Send high-quality virtual tours and listing files directly to buyers." },
      { title: "Showcase Scheduling", desc: "Schedule property viewings and open house bookings instantly." },
      { title: "Buyer Qualification", desc: "Ask budget and location targets before listing recommendations." },
      { title: "CRM Sync", desc: "Send contact leads to real estate CRM platforms (e.g. Follow Up Boss)." },
    ],
    timelineSteps: [
      { title: "Step 1: Buyer comments", desc: "Prospect comments 'VILLA' on a property showcase listing reel." },
      { title: "Step 2: Instant info dispatch", desc: "Set2Send dispatches pricing lists, specs, and a video walkthrough." },
      { title: "Step 3: Schedule viewing", desc: "The prospect selects a viewing slot on the booking calendar." },
    ],
    successStories: [
      {
        client: "Lux Living Properties",
        metrics: "+150% Showing Bookings",
        revenue: "42 Qualified Leads / Mo",
        before: "Brokers miss leads because comment notifications are buried under personal updates.",
        after: "Instant triggers qualify buying targets and distribute listing details automatically.",
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  restaurants: {
    heroTitle: "Drive reservations and orders",
    heroSub: "Automate menu distribution, online bookings, and discount code deliveries directly inside inboxes.",
    heroBgImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Send menu details!",
    chatBotMsg: "Here is our summer menu and a 10% coupon for your next reservation.",
    chatButtonText: "Book Your Table",
    socialMarquee: [
      {
        name: "Bistro Gourmet",
        followers: "Daily Diners",
        review: "\"WHATSAPP RESERVATIONS HAS HELPED US CONVERT VIRAL FOOD REELS INTO TABLE BOOKINGS.\"",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Automate bookings, distribute specials, retain diners",
    interactionTitle: "Instant Dining Bookings",
    interactionText: "Deliver reservation links and specials sheets upon comment triggers.",
    interactionBg: "from-[#c2410c] to-[#ea580c]",
    interactionMockTitle: "Bistro reservation flow",
    storyUserMsg: "Are you open on July 4th?",
    storyBotMsg: "Yes, we are open 11 AM - 10 PM! Check our table availability below.",
    featureCards: [
      { title: "Menu Delivery", desc: "Send interactive PDF menus and daily specials boards instantly." },
      { title: "Table Reservations", desc: "Sync with OpenTable or Resy directly inside customer chat folders." },
      { title: "Loyalty Coupons", desc: "Automate discount codes for local customers who follow or tag you." },
      { title: "Catering Inquiries", desc: "Qualify group sizes and budget scopes for event catering requests." },
    ],
    timelineSteps: [
      { title: "Step 1: Customer comments", desc: "A foodie comments 'MENU' on your viral dessert showcase reel." },
      { title: "Step 2: Menu & Promo", desc: "Set2Send dispatches your food catalog and a reservation coupon." },
      { title: "Step 3: Dining confirmed", desc: "Prospect books a table online, logging details to client CRM lists." },
    ],
    successStories: [
      {
        client: "Bistro Gourmet",
        metrics: "+45% Tables Reserved",
        revenue: "850+ new diners / mo",
        before: "Reel viewers ask for reservation options in comments but receive no response.",
        after: "Interactive menus and automated booking portals capture dining reservations instantly.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  healthcare: {
    heroTitle: "Nurture patient bookings",
    heroSub: "Answer medical FAQs, send booking portals, and qualify consult inquiries securely.",
    heroBgImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "How do I book an appointment?",
    chatBotMsg: "Hello! Here is our treatment list and patient scheduling portal.",
    chatButtonText: "Book Appointment",
    socialMarquee: [
      {
        name: "Aura Dental Care",
        followers: "Private Clinic",
        review: "\"AUTOMATED FAQ REPLIES HAS REDUCED CLINIC INBOUND CALL BACKLOGS BY 40%.\"",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Answer patient FAQs, coordinate clinic schedules",
    interactionTitle: "Secure Patient Intake",
    interactionText: "Nurture clinic leads with scheduling portals and general service details.",
    interactionBg: "from-[#0d9488] to-[#14b8a6]",
    interactionMockTitle: "Patient inquiry flow",
    storyUserMsg: "Do you offer teeth whitening?",
    storyBotMsg: "Yes, whitening details are inside this pricing brochure! Book a consult slot below.",
    featureCards: [
      { title: "FAQ Automation", desc: "Resolve routine clinical inquiries regarding pricing and hours instantly." },
      { title: "Booking Portals", desc: "Connect patients to Zocdoc or booking pages directly from chats." },
      { title: "Secure Intake", desc: "Route details safely through compliance-ready communication pathways." },
      { title: "Review Campaigns", desc: "Request patient review listings automatically following treatment checkouts." },
    ],
    timelineSteps: [
      { title: "Step 1: Patient asks details", desc: "Prospect comments 'WHITENING' on a cosmetic dentistry transformation post." },
      { title: "Step 2: Nurture & Price", desc: "Send whitening treatment catalog details and pricing guides." },
      { title: "Step 3: Consult scheduled", desc: "Patient registers appointment details inside clinical systems." },
    ],
    successStories: [
      {
        client: "Aura Dental Clinic",
        metrics: "+60% Booking Intake",
        revenue: "85 consults scheduled",
        before: "Front desk staff spend 3 hours daily answering routine Instagram comments.",
        after: "Set2Send handles patient FAQs, directing bookings automatically to clinic portals.",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  influencers: {
    heroTitle: "Monetize your social reach",
    heroSub: "Deliver sponsor media kits, affiliate product catalogs, and private group signups instantly via DMs.",
    heroBgImage: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Where did you get that jacket?",
    chatBotMsg: "Here is the affiliate link for the jacket and a 15% discount code!",
    chatButtonText: "Shop Affiliate Link",
    socialMarquee: [
      {
        name: "Chloe Vance",
        followers: "800K Followers",
        review: "\"AUTOMATED AFFILIATE LINKS MULTIPLIED MY COMMISSIONS BY 4X IN JUST 30 DAYS.\"",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Scale commissions, distribute sponsor portfolios",
    interactionTitle: "Instant Affiliate Dispatch",
    interactionText: "Deliver product purchase links instantly upon comment keyword matches.",
    interactionBg: "from-[#a21caf] to-[#c084fc]",
    interactionMockTitle: "Affiliate link generator",
    storyUserMsg: "I need your makeup routine!",
    storyBotMsg: "Here is my full cosmetics list and purchase links! Click below to shop.",
    featureCards: [
      { title: "Affiliate Link Dispatch", desc: "Send reward/commission shop links directly to commenter folders." },
      { title: "Sponsor Media Kits", desc: "Send brand deal guides and media decks to inbound marketing scouts." },
      { title: "Channel Opt-ins", desc: "Grow subscribers for newsletters, Telegram groups, or Discord hubs." },
      { title: "Story Engagement", desc: "Auto-reply to story reactions and tags to boost visibility indexes." },
    ],
    timelineSteps: [
      { title: "Step 1: Fan comments", desc: "Follower comments 'OUTFIT' on a fashion preview reel." },
      { title: "Step 2: Instant shop list", desc: "Set2Send dispatches direct affiliate store link lists." },
      { title: "Step 3: Commission recorded", desc: "Diner checks out on target site, recording influencer commissions." },
    ],
    successStories: [
      {
        client: "Chloe Vance (Lifestyle)",
        metrics: "4x Affiliate Income",
        revenue: "+2,800 link clicks",
        before: "Failing to capture commission link clicks because 'link in bio' has poor CTR.",
        after: "Delivering custom shopping links inside fan DMs converts interest instantly.",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  education: {
    heroTitle: "Automate academy enrollments",
    heroSub: "Capture student details, distribute course syllabuses, and qualify course interest instantly.",
    heroBgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Send course details!",
    chatBotMsg: "Sure! Here is the full coding syllabus PDF and a coupon for 20% off.",
    chatButtonText: "Enroll In Course",
    socialMarquee: [
      {
        name: "Code Academy",
        followers: "Online Platform",
        review: "\"DISTRIBUTING SYLLABUSES VIA AUTOMATED DMs TRIPLED OUR BOOTCAMP SIGNUP RATE.\"",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Acquire students, register enrollments, share resources",
    interactionTitle: "Instant Class Onboarding",
    interactionText: "Deliver curriculum portfolios and onboarding details automatically.",
    interactionBg: "from-[#1d4ed8] to-[#2563eb]",
    interactionMockTitle: "Course registration flow",
    storyUserMsg: "When does the cohort start?",
    storyBotMsg: "Cohort starts next Monday! Click below to verify pricing and save your seat.",
    featureCards: [
      { title: "Syllabus Delivery", desc: "Automate educational brochure and catalog distribution." },
      { title: "Student Qualification", desc: "Verify applicant background details before schedule links." },
      { title: "Cohort Opt-ins", desc: "Register students directly into ActiveCampaign or academy databases." },
      { title: "Resource Triggers", desc: "Deliver course presets, assets, or worksheets upon comment matches." },
    ],
    timelineSteps: [
      { title: "Step 1: Student comments", desc: "Diner comments 'SYLLABUS' on your course launch announcement video." },
      { title: "Step 2: Curriculum package", desc: "Set2Send dispatches program details and student pricing options." },
      { title: "Step 3: Registration logs", desc: "Student checks out and logs info directly into school systems." },
    ],
    successStories: [
      {
        client: "Code Academy Global",
        metrics: "3x Student Enrollment",
        revenue: "450+ enrollees / mo",
        before: "Student queries regarding startup schedules require hiring manual moderators.",
        after: "Academy schedules are distributed automatically, driving immediate class enrollments.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  consultants: {
    heroTitle: "Book high-value clients",
    heroSub: "Qualify budget profiles, check consulting availability, and book consultation slots instantly.",
    heroBgImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "I need consultation details.",
    chatBotMsg: "Great! Let's verify details first. What is your advisory budget range?",
    chatButtonText: "Book Consulting Slot",
    socialMarquee: [
      {
        name: "Apex Advisory",
        followers: "B2B Partners",
        review: "\"COMMENT QUALIFIERS ENSURED WE ONLY TALK TO QUALIFIED ENTERPRISE LEADS.\"",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Filter leads, book consultations, distribute strategies",
    interactionTitle: "Qualified Advisory Intake",
    interactionText: "Ask qualification check queries before scheduling partner calls.",
    interactionBg: "from-[#475569] to-[#64748b]",
    interactionMockTitle: "Consulting intake loop",
    storyUserMsg: "Do you have case studies?",
    storyBotMsg: "Yes, here is our strategy deck! Book your advisory review below.",
    featureCards: [
      { title: "Intake Screening", desc: "Filter client budget levels automatically before giving calendars." },
      { title: "Schedules Booking", desc: "Integrate directly with booking calendars inside follower chats." },
      { title: "Brochure Distribution", desc: "Send strategy decks and consulting options on autopilot." },
      { title: "CRM Syncing", desc: "Send qualified advisor leads to Salesforce or custom dashboards." },
    ],
    timelineSteps: [
      { title: "Step 1: Partner comments", desc: "Prospect comments 'STRATEGY' on a case study video post." },
      { title: "Step 2: Qualification check", desc: "Set2Send asks target questions to analyze advisor lead scores." },
      { title: "Step 3: Call booked", desc: "Prospect books a consultation session, syncs details to team databases." },
    ],
    successStories: [
      {
        client: "Apex Consulting",
        metrics: "+85% Qualified Leads",
        revenue: "35 strategy calls booked",
        before: "Consultants spend hours talking to low-budget leads who cannot afford fees.",
        after: "DM qualification checks screen budget targets before releasing schedules.",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  finance: {
    heroTitle: "Nurture client lead funnels",
    heroSub: "Send portfolio brochures, qualify investment budget profiles, and schedule advisory sessions.",
    heroBgImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Send details on wealth management.",
    chatBotMsg: "Certainly! Here is our financial planning overview brochure.",
    chatButtonText: "Book Portfolio Review",
    socialMarquee: [
      {
        name: "Sterling Partners",
        followers: "Wealth Advisors",
        review: "\"AUTOMATING FINANCIAL BROCHURE DISPATCH INCREASED BOOKED REVIEW SESSIONS BY 75%.\"",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Share wealth decks, filter investment levels",
    interactionTitle: "Wealth Advisory Bookings",
    interactionText: "Send financial portfolios and qualify prospective investor profiles.",
    interactionBg: "from-[#111827] to-[#1f2937]",
    interactionMockTitle: "Investor qualification sequence",
    storyUserMsg: "Do you have tax guides?",
    storyBotMsg: "Yes, whitening tax guides are ready! Click below to coordinate a consultation.",
    featureCards: [
      { title: "Brochure Distribution", desc: "Send portfolio files and wealth reports directly to prospective clients." },
      { title: "Client Screening", desc: "Analyze prospect asset sizes and advisory needs inside DM conversations." },
      { title: "Secure Routing", desc: "Maintain verified, secure networks for sharing initial clinical details." },
      { title: "CRM Sync", desc: "Route financial leads directly to wealth management databases." },
    ],
    timelineSteps: [
      { title: "Step 1: Prospect comments", desc: "Client comments 'WEALTH' on a retirement planning post." },
      { title: "Step 2: Nurture & Guide", desc: "Set2Send sends a financial guide and asset qualification check." },
      { title: "Step 3: Call scheduled", desc: "Advisory session booked, syncing prospect profile to active files." },
    ],
    successStories: [
      {
        client: "Sterling Wealth Partners",
        metrics: "+75% Client Consults",
        revenue: "120+ asset inquiries",
        before: "Manual follow-ups lose client interest because of slow response times.",
        after: "Interactive financial guides are distributed immediately, driving portfolio bookings.",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  fitness: {
    heroTitle: "Pack your training schedule",
    heroSub: "Automate training plan trials, membership signups, and booking links inside social DMs.",
    heroBgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "I want the free training plan!",
    chatBotMsg: "Here is your 7-day training plan PDF! Register below to join the academy.",
    chatButtonText: "Start Training Plan",
    socialMarquee: [
      {
        name: "Forge Fit Gym",
        followers: "Local Brand",
        review: "\"AUTOMATED TRIAL PLAN DELIVERY HAS GENERATED +120 GYM MEMBER SIGNUPS / MO.\"",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Distribute training plans, book trial workouts",
    interactionTitle: "Workout Trial Signups",
    interactionText: "Deliver membership offers and schedule trial workouts instantly.",
    interactionBg: "from-[#dc2626] to-[#b91c1c]",
    interactionMockTitle: "Gym membership intake",
    storyUserMsg: "What are gym hours?",
    storyBotMsg: "We are open 5 AM - 11 PM! Claim your free day pass code below.",
    featureCards: [
      { title: "Workout Distribution", desc: "Send trial worksheets and training guides automatically." },
      { title: "Diner Bookings", desc: "Schedule gym tours or personal coach trial sessions instantly." },
      { title: "Promo Passwords", desc: "Distribute discount passcodes to followers to build loyalty." },
      { title: "Member Logging", desc: "Capture user emails and sync them to active newsletter databases." },
    ],
    timelineSteps: [
      { title: "Step 1: User comments", desc: "Follower comments 'WORKOUT' on a transformation showcase reel." },
      { title: "Step 2: Trial guide dispatch", desc: "Set2Send dispatches training plans and a free gym day pass." },
      { title: "Step 3: Member checks out", desc: "Prospect registers a personal coach consultation session online." },
    ],
    successStories: [
      {
        client: "Forge Fitness Group",
        metrics: "+120 Gym Signups / Mo",
        revenue: "350+ free pass opt-ins",
        before: "Local leads view reels but drop off because signing up requires calling the front desk.",
        after: "Interactive passes and automated scheduling portals drive direct workout trials.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
  local: {
    heroTitle: "Bring foot traffic to your shop",
    heroSub: "Automate local discount code triggers, store location guides, and catalog lists.",
    heroBgImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
    chatUserMsg: "Send coupon details!",
    chatBotMsg: "Here is your 15% local discount code and our store address map details.",
    chatButtonText: "Get Coupon Map",
    socialMarquee: [
      {
        name: "Eco Home Goods",
        followers: "Retail Shop",
        review: "\"SENDING LOCATION AND discount CODES INCREASED FOOT TRAFFIC BY 35%.\"",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      },
    ],
    valueHeading: "Drive local store visits, share discounts",
    interactionTitle: "Local Shop Incentives",
    interactionText: "Deliver shop maps and custom coupon codes to local commenters.",
    interactionBg: "from-[#0891b2] to-[#06b6d4]",
    interactionMockTitle: "Local discount system",
    storyUserMsg: "Are you open on Sunday?",
    storyBotMsg: "Yes, Sunday hours are 10 AM - 6 PM! Claim your shopping pass details below.",
    featureCards: [
      { title: "Map Distribution", desc: "Send store address details and Google Maps links directly." },
      { title: "Coupon Campaigns", desc: "Distribute bar codes or discount promo codes automatically." },
      { title: "VIP Notifications", desc: "Nurture customer segments regarding local seasonal sales." },
      { title: "Review Intake", desc: "Request local business reviews after checkout completions." },
    ],
    timelineSteps: [
      { title: "Step 1: Customer comments", desc: "Customer comments 'SHOP' on a local collection showcase reel." },
      { title: "Step 2: Maps & Pass", desc: "Set2Send dispatches the store location map and shopping pass." },
      { title: "Step 3: Store visit", desc: "Diner checks out at the physical location, verifying local tags." },
    ],
    successStories: [
      {
        client: "Eco Living Goods",
        metrics: "+35% In-Store Visits",
        revenue: "220+ monthly passes claimed",
        before: "Local comments asking for directions or hours require manual replies.",
        after: "Interactive passes and map cards are dispatched instantly, driving walk-ins.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop",
      },
    ],
  },
};

const CreatorsHeroSection = () => {
  const [creatorChatStep, setCreatorChatStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCreatorChatStep((prev) => (prev < 5 ? prev + 1 : 0));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center pt-32 pb-24 overflow-hidden bg-black border-b border-[#E8DFD3]">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dp2jtar7h/image/upload/v1782676768/Gemini_Generated_Image_s04si5s04si5s04s_mvugsg.png')" }}
      />
      {/* Premium Dark Overlay */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.75))' }} />

      {/* Effects: Grid texture, Particles */}
      <div className="absolute inset-0 z-[4] bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />



      <div className="relative z-[10] max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#FF7A1A] text-[#FF7A1A] text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm">
              SET2SEND FOR CREATORS
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-[76px] font-[800] tracking-tight text-white leading-[1.05] mb-6 font-sans"
          >
            Effortless<br />engagement,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A1A] to-[#FFA043]">
              big results.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-medium text-[20px] md:text-[22px] max-w-[620px] mb-10"
            style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.7 }}
          >
            Turn every comment, DM, and follower into loyal customers using AI-powered conversations built specifically for creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/auth/google"
              className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-[#FF7A1A] text-white hover:bg-[#e66a12] hover:-translate-y-1 font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 ease-out shadow-[0_10px_30px_rgba(255,122,26,0.3)]"
            >
              Get Started
            </Link>
            <button
              onClick={() => {
                document.getElementById("solutions-marquee")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-white/5 backdrop-blur-md border border-white text-white hover:border-[#FF7A1A] hover:bg-[#FF7A1A]/10 font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 ease-out"
            >
              <Play className="w-4 h-4 fill-white" /> WATCH DEMO
            </button>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end w-full">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-[420px] rounded-[20px] p-7 relative overflow-hidden z-10"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            {/* Top Label */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A1A] animate-pulse shadow-[0_0_10px_rgba(255,122,26,0.8)]"></span>
              <span className="text-[10px] font-bold font-mono text-white/70 uppercase tracking-widest">LIVE CREATOR DEMO</span>
            </div>

            {/* Chat Thread */}
            <div className="flex flex-col gap-4 min-h-[220px] font-sans">
              <AnimatePresence>
                {creatorChatStep >= 0 && (
                  <motion.div
                    key="msg1"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-white/10 text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] self-end text-sm shadow-sm border border-white/5"
                  >
                    Need the download link!
                  </motion.div>
                )}
                {creatorChatStep === 1 && (
                  <motion.div
                    key="msgTyping"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#6E2CF4] text-white px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] self-start text-sm shadow-md flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </motion.div>
                )}
                {creatorChatStep >= 2 && (
                  <motion.div
                    key="msg2"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-[#6E2CF4] text-white px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] self-start text-sm shadow-md"
                  >
                    Absolutely! Here's your instant access.
                  </motion.div>
                )}
                {creatorChatStep >= 3 && (
                  <motion.div
                    key="msg3"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="self-start w-full max-w-[85%]"
                  >
                    <button className="w-full bg-[#FF7A1A] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl shadow-[0_5px_15px_rgba(255,122,26,0.3)] border border-[#FF7A1A]/50 hover:bg-[#e66a12] transition-colors">
                      Get The Link
                    </button>
                  </motion.div>
                )}
                {creatorChatStep >= 4 && (
                  <motion.div
                    key="msg4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="self-center mt-2 flex flex-col gap-2 w-full text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-white/80">
                      <Check className="w-3.5 h-3.5 text-[#14B86A]" /> Email Captured
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-white/80">
                      <Check className="w-3.5 h-3.5 text-[#14B86A]" /> Lead Saved
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-white/80">
                      <Check className="w-3.5 h-3.5 text-[#14B86A]" /> DM Delivered
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Floating Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-3 mt-6 z-10 justify-center w-full max-w-[420px]"
          >
            <div
              className="px-3 py-2 rounded-[16px] flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
            >
              <div className="w-4 h-4 bg-gradient-to-tr from-yellow-400 to-pink-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">I</div>
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Instagram Creator</span>
            </div>
            <div
              className="px-3 py-2 rounded-[16px] flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
            >
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">M</div>
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Meta Partner</span>
            </div>
            <div
              className="px-3 py-2 rounded-[16px] flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF7A1A]" />
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">AI Powered</span>
            </div>
            <div
              className="px-3 py-2 rounded-[16px] flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
            >
              <span className="text-[10px] font-black text-[#FF7A1A]">4.9★</span>
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Rating</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default function SolutionsPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const resolvedParams = use(params);
  const type = resolvedParams.type;

  // Normalise the parameter for matching
  let resolvedType = type.toLowerCase().replace(/-/g, "");
  if (resolvedType === "marketing") resolvedType = "marketers";
  if (resolvedType === "realestate") resolvedType = "realestate";
  if (resolvedType === "localbusinesses" || resolvedType === "localbusiness") resolvedType = "local";
  if (resolvedType === "contentcreators") resolvedType = "creators";

  // Retrieve solutions data or fallback to creators
  const data = SOLUTIONS_DATA[resolvedType] || SOLUTIONS_DATA.creators;

  // Showcase variables
  const [chatStep, setChatStep] = useState(0);
  const [activeStorySlide, setActiveStorySlide] = useState(0);
  const [caseStudyIndex, setCaseStudyIndex] = useState(0);

  // Chat simulator animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setChatStep((prev) => (prev < 2 ? prev + 1 : 0));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Story mock timeline animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStorySlide((prev) => (prev < 1 ? prev + 1 : 0));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#FAF8F4] text-[#555555] min-h-screen flex flex-col selection:bg-[#C99724] selection:text-white relative overflow-x-hidden font-sans">

      {/* Elegant Visual Elements: Soft background spots & subtle radial gradients */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(201,152,36,0.06)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute top-[25%] left-[-15%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(201,152,36,0.05)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute bottom-[15%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(201,152,36,0.06)_0%,transparent_70%)] pointer-events-none z-0"></div>

      {/* Shared Navbar */}
      <Navbar />

      {/* ==================================================
          SECTION 1 — HERO SECTION
          ================================================== */}
      {resolvedType === "creators" ? (
        <CreatorsHeroSection />
      ) : resolvedType === "ecommerce" ? (
        <section className="relative min-h-[100vh] flex items-center pt-32 pb-24 overflow-hidden bg-[#050812] border-b border-white/10">
          {/* Background & Overlay */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
            style={{ backgroundImage: "url('https://res.cloudinary.com/dp2jtar7h/image/upload/v1782678183/Gemini_Generated_Image_oemoxroemoxroemo_tamkwl.png')" }}
          />
          <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 text-left flex flex-col items-start pt-12 lg:pt-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-[#4DB8FF]" /> set2send solutions
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight text-white leading-[0.95] font-playfair mb-6"
              >
                {data.heroTitle}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white/80 font-sans font-medium text-base md:text-lg max-w-[680px] leading-[1.8] mb-8"
              >
                {data.heroSub}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <Link href="/auth/google" className="w-full sm:w-auto text-center px-10 py-4 bg-white text-black hover:bg-[#4DB8FF] hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md">
                  Get Started
                </Link>
                <button onClick={() => { document.getElementById("solutions-marquee")?.scrollIntoView({ behavior: "smooth" }); }} className="w-full sm:w-auto text-center px-10 py-4 bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300">
                  Explore Solution
                </button>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end gap-10 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full max-w-[380px] rounded-[24px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden z-10"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-2 border-b border-white/10 pb-3.5 mb-4 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4DB8FF] animate-pulse"></span>
                  <span className="text-[10px] font-bold font-mono text-white/70 uppercase tracking-wider">Live Simulator Feed</span>
                </div>
                <div className="flex flex-col gap-3.5 min-h-[145px] justify-start text-xs font-semibold">
                  <AnimatePresence>
                    {chatStep >= 0 && (
                      <motion.div
                        key={`user-${chatStep}`}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-white/10 text-white px-4 py-2.5 rounded-2xl rounded-br-none max-w-[80%] self-end text-right border border-white/5"
                      >
                        {data.chatUserMsg}
                      </motion.div>
                    )}
                    {chatStep >= 1 && (
                      <motion.div
                        key={`bot-${chatStep}`}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-white/90 text-[#181818] px-4 py-3 rounded-2xl rounded-bl-none max-w-[80%] self-start text-left shadow-sm flex flex-col gap-2 items-start"
                      >
                        <p>{data.chatBotMsg}</p>
                        {chatStep >= 2 && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full py-2 bg-[#181818] hover:bg-[#4DB8FF] text-white font-bold rounded-xl text-[9px] uppercase tracking-wider shadow transition-colors duration-300"
                          >
                            {data.chatButtonText}
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 text-xs font-bold font-mono items-center justify-center lg:justify-end z-10"
              >
                <div className="px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm text-white" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <svg className="w-4 h-4 text-[#4DB8FF]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.48 7.37c-1.16 0-2.22.42-3.08 1.13a5.04 5.04 0 00-3.08-1.13c-2.48 0-4.5 1.74-4.5 3.88s2.02 3.88 4.5 3.88c1.16 0-2.22-.42 3.08-1.13.86.71 1.92 1.13 3.08 1.13 2.48 0 4.5-1.74 4.5-3.88s-2.02-3.88-4.5-3.88z" />
                  </svg>
                  <span>Meta Partner</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm text-white" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <TikTokIcon className="w-3.5 h-3.5 text-white" />
                  <span>TikTok Partner</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm text-white" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="w-5 h-5 bg-[#4DB8FF] text-white rounded font-black flex items-center justify-center text-[10px]">G2</span>
                  <span>4.6 Rating</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ) : ["marketers", "agencies", "brands", "enterprise", "business", "realestate", "local"].includes(resolvedType) ? (
        <section className="relative min-h-[100vh] flex items-center pt-32 pb-24 overflow-hidden bg-[#0A0D18] border-b border-white/10">
          {/* Background & Overlay */}
          <div
            className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat ${resolvedType === "agencies" ? "" : "md:bg-fixed"}`}
            style={{
              backgroundImage: resolvedType === "agencies"
                ? "url('https://res.cloudinary.com/dp2jtar7h/image/upload/v1782680388/Gemini_Generated_Image_b0ldfpb0ldfpb0ld_u3h3fo.png')"
                : resolvedType === "brands"
                  ? "url('https://res.cloudinary.com/dp2jtar7h/image/upload/v1782679888/Gemini_Generated_Image_gzy8pigzy8pigzy8_kygkhf.png')"
                  : "url('https://res.cloudinary.com/dp2jtar7h/image/upload/v1782680936/Gemini_Generated_Image_6u6bfl6u6bfl6u6b_xsdds5.png')"
            }}
          />
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: resolvedType === "agencies"
                ? "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.30) 100%)"
                : "linear-gradient(180deg, rgba(5,8,18,0.75) 0%, rgba(5,8,18,0.55) 35%, rgba(5,8,18,0.70) 100%)"
            }}
          />
          {/* Particles / Lights */}
          <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden hidden md:block">
            <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-[pulse_4s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[20%] right-[15%] w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] animate-[pulse_5s_ease-in-out_infinite_alternate]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 text-left flex flex-col items-start pt-12 lg:pt-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#00E5FF] text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-[#00E5FF]" /> set2send solutions
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight text-white leading-[0.95] font-playfair mb-6"
              >
                {data.heroTitle}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white/80 font-sans font-medium text-base md:text-lg max-w-[680px] leading-[1.8] mb-8"
              >
                {data.heroSub}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <Link href="/auth/google" className="w-full sm:w-auto text-center px-10 py-4 bg-[#00E5FF] text-[#0A0D18] hover:bg-white hover:text-[#0A0D18] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md">
                  Get Started
                </Link>
                <button onClick={() => { document.getElementById("solutions-marquee")?.scrollIntoView({ behavior: "smooth" }); }} className="w-full sm:w-auto text-center px-10 py-4 bg-transparent border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 hover:border-[#00E5FF] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300">
                  Explore Solution
                </button>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end gap-10 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full max-w-[380px] rounded-[24px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden z-10"
                style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-2 border-b border-white/10 pb-3.5 mb-4 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
                  <span className="text-[10px] font-bold font-mono text-white/70 uppercase tracking-wider">Live Simulator Feed</span>
                </div>
                <div className="flex flex-col gap-3.5 min-h-[145px] justify-start text-xs font-semibold">
                  <AnimatePresence>
                    {chatStep >= 0 && (
                      <motion.div
                        key={`user-${chatStep}`}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-white/10 text-white px-4 py-2.5 rounded-2xl rounded-br-none max-w-[80%] self-end text-right border border-white/5"
                      >
                        {data.chatUserMsg}
                      </motion.div>
                    )}
                    {chatStep >= 1 && (
                      <motion.div
                        key={`bot-${chatStep}`}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-[#0A0D18]/90 text-white px-4 py-3 rounded-2xl rounded-bl-none max-w-[80%] self-start text-left shadow-sm border border-white/10 flex flex-col gap-2 items-start"
                      >
                        <p>{data.chatBotMsg}</p>
                        {chatStep >= 2 && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full py-2 bg-white hover:bg-[#00E5FF] text-[#0A0D18] font-bold rounded-xl text-[9px] uppercase tracking-wider shadow transition-colors duration-300"
                          >
                            {data.chatButtonText}
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 text-xs font-bold font-mono items-center justify-center lg:justify-end z-10"
              >
                <div className="px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm text-white" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <svg className="w-4 h-4 text-[#00E5FF]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.48 7.37c-1.16 0-2.22.42-3.08 1.13a5.04 5.04 0 00-3.08-1.13c-2.48 0-4.5 1.74-4.5 3.88s2.02 3.88 4.5 3.88c1.16 0-2.22-.42 3.08-1.13.86.71 1.92 1.13 3.08 1.13 2.48 0 4.5-1.74 4.5-3.88s-2.02-3.88-4.5-3.88z" />
                  </svg>
                  <span>Meta Partner</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm text-white" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <TikTokIcon className="w-3.5 h-3.5 text-white" />
                  <span>TikTok Partner</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm text-white" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="w-5 h-5 bg-[#00E5FF] text-[#0A0D18] rounded font-black flex items-center justify-center text-[10px]">G2</span>
                  <span>4.6 Rating</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden bg-[#FAF8F4] border-b border-[#E8DFD3]">
          {/* Soft layout background mesh decor */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(232,223,211,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(232,223,211,0.25)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column: Heading, sub, CTA */}
            <div className="lg:col-span-7 text-left flex flex-col items-start pt-12 lg:pt-0">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFF8EA] border border-[#E8D39D] text-[#B8860B] text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-[#C99724]" /> set2send solutions
              </span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight text-[#181818] leading-[0.95] font-playfair mb-6"
              >
                {data.heroTitle}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[#6F6F6F] font-sans font-medium text-base md:text-lg max-w-[680px] leading-[1.8] mb-8"
              >
                {data.heroSub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <Link
                  href="/auth/google"
                  className="w-full sm:w-auto text-center px-10 py-4 bg-[#181818] text-white hover:bg-[#C99724] hover:text-[#181818] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 ease-out shadow-md"
                >
                  Get Started
                </Link>
                <button
                  onClick={() => {
                    document.getElementById("solutions-marquee")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto text-center px-10 py-4 bg-transparent border border-[#C99724] text-[#C99724] hover:bg-[#FFF8EA] hover:text-[#B8860B] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 ease-out"
                >
                  Explore Solution
                </button>
              </motion.div>
            </div>

            {/* Right Column: Floating chat card & Partner badges */}
            <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end gap-10 w-full">
              {/* Soft decorative background spotlight */}
              <div className="absolute w-72 h-72 bg-gradient-to-tr from-[#C99724]/10 to-[#FFF8EA] rounded-full blur-[80px] opacity-70 pointer-events-none"></div>

              {/* Redesigned Floating Chat Automation Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full max-w-[380px] bg-white border border-[#E8DFD3] rounded-[24px] p-6 shadow-[0_12px_35px_rgba(0,0,0,0.05)] relative overflow-hidden z-10"
              >
                {/* Dynamic tag header */}
                <div className="flex items-center gap-2 border-b border-[#E8DFD3] pb-3.5 mb-4 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C99724] animate-pulse"></span>
                  <span className="text-[10px] font-bold font-mono text-[#777777] uppercase tracking-wider">Live Simulator Feed</span>
                </div>

                {/* Chat Thread */}
                <div className="flex flex-col gap-3.5 min-h-[145px] justify-start text-xs font-semibold">
                  <AnimatePresence>
                    {/* User Message */}
                    {chatStep >= 0 && (
                      <motion.div
                        key={`user-${chatStep}`}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-[#F7F4EF] text-[#181818] px-4 py-2.5 rounded-2xl rounded-br-none max-w-[80%] self-end text-right border border-[#E8DFD3]/40"
                      >
                        {data.chatUserMsg}
                      </motion.div>
                    )}

                    {/* Bot Message */}
                    {chatStep >= 1 && (
                      <motion.div
                        key={`bot-${chatStep}`}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-white border border-[#E8DFD3] text-[#555555] px-4 py-3 rounded-2xl rounded-bl-none max-w-[80%] self-start text-left shadow-sm flex flex-col gap-2 items-start"
                      >
                        <p className="text-[#181818]">{data.chatBotMsg}</p>

                        {chatStep >= 2 && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full py-2 bg-[#181818] hover:bg-[#C99724] text-white hover:text-[#181818] font-bold rounded-xl text-[9px] uppercase tracking-wider shadow transition-colors duration-300"
                          >
                            {data.chatButtonText}
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Badges footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 text-xs font-bold text-[#6F6F6F] font-mono items-center justify-center lg:justify-end z-10"
              >
                <div className="bg-white border border-[#E8DFD3] px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4 text-[#C99724]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.48 7.37c-1.16 0-2.22.42-3.08 1.13a5.04 5.04 0 00-3.08-1.13c-2.48 0-4.5 1.74-4.5 3.88s2.02 3.88 4.5 3.88c1.16 0-2.22-.42 3.08-1.13.86.71 1.92 1.13 3.08 1.13 2.48 0 4.5-1.74 4.5-3.88s-2.02-3.88-4.5-3.88z" />
                  </svg>
                  <span>Meta Partner</span>
                </div>
                <div className="bg-white border border-[#E8DFD3] px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                  <TikTokIcon className="w-3.5 h-3.5 text-[#C99724]" />
                  <span>TikTok Partner</span>
                </div>
                <div className="bg-white border border-[#E8DFD3] px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                  <span className="w-5 h-5 bg-[#C99724] text-[#181818] rounded font-black flex items-center justify-center text-[10px]">G2</span>
                  <span>4.6 Rating</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================
          SECTION 2 — SOCIAL PROOF MARQUEE
          ================================================== */}
      <section id="solutions-marquee" className="py-16 bg-white text-zinc-900 overflow-hidden relative select-none z-10 border-b border-[#E8DFD3]">
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes solutionMarquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .solution-marquee-container {
              display: flex;
              width: max-content;
              animation: solutionMarquee 25s linear infinite;
            }
            .solution-marquee-container:hover {
              animation-play-state: paused;
            }
          `
        }} />

        <div className="solution-marquee-container flex items-center gap-8">
          {[...data.socialMarquee, ...data.socialMarquee].map((test, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F4] border border-[#E8DFD3] rounded-[24px] p-6 w-[340px] flex flex-col justify-between shadow-[0_8px_20px_rgba(0,0,0,0.02)] shrink-0 text-left hover:border-[#C99724] transition-all duration-300"
            >
              <p className="text-xs font-bold leading-relaxed text-[#555555] italic">
                {test.review}
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-[#E8DFD3]/40 pt-3.5">
                <img
                  src={test.img}
                  alt={test.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#E8DFD3]"
                />
                <div>
                  <h4 className="text-xs font-black text-[#181818] leading-tight">{test.name}</h4>
                  <span className="text-[9px] text-[#C99724] font-bold font-mono uppercase tracking-wider">{test.followers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          SECTION 3 — VALUE PROPOSITION
          ================================================== */}
      <section className="py-28 px-6 bg-[#F7F4EF] text-zinc-950 text-center relative z-10 border-b border-[#E8DFD3]">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-5"
          >
            <div className="w-14 h-14 rounded-full bg-[#FFF8EA] flex items-center justify-center text-[#C99724]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-black tracking-tight leading-tight text-[#181818] max-w-3xl">
              {data.valueHeading}
            </h2>
            <div className="w-20 h-0.5 bg-[#C99724] mt-2"></div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================
          SECTION 4 — INTERACTION AUTOMATION
          ================================================== */}
      <section className={`bg-gradient-to-br ${data.interactionBg || 'from-[#09090B] to-[#1E1B4B]'} text-white py-24 px-6 relative overflow-hidden z-10 border-b border-white/5`}>
        {/* Subtle dot mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          {/* Left details */}
          <div className="lg:col-span-6 text-left flex flex-col items-start">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm backdrop-blur-md">
              Story Automation
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] max-w-lg font-playfair mb-6">
              {data.interactionTitle}
            </h2>
            <p className="text-[#B6BCC8] text-base leading-relaxed max-w-md font-medium mb-8">
              {data.interactionText}
            </p>

            <Link
              href="/auth/google"
              className="px-10 py-4 bg-white text-zinc-950 hover:bg-zinc-200 hover:scale-[1.02] font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 ease-out shadow-[0_5px_20px_rgba(255,255,255,0.15)]"
            >
              Get Started
            </Link>
          </div>

          {/* Right Phone Mockup */}
          <div className="lg:col-span-6 flex justify-center items-center w-full">
            {/* Phone Container */}
            <div 
              style={{ background: '#121212' }}
              className="w-full max-w-[310px] h-[560px] rounded-[42px] shadow-[0_25px_60px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between pb-4 group border-[10px] border-[#181818]"
            >
              {/* Speaker camera notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-[#181818] border-transparent rounded-b-xl z-20 flex items-center justify-center border-b">
                <div className="w-8 h-1 bg-white/20 rounded-full mb-1"></div>
              </div>

              {/* Status bar */}
              <div className="flex justify-between items-center px-6 pt-6 text-[8px] font-bold text-white/50 font-mono select-none">
                <span>9:41</span>
                <span>5G</span>
              </div>

              {/* Instagram Story Image content mock */}
              <div className="flex-1 px-4 mt-2 flex flex-col justify-between relative">
                {/* Story Image container */}
                <div className="w-full h-[220px] rounded-2xl overflow-hidden relative shadow-lg border border-white/10 shrink-0 bg-black/40">
                  <img
                    src={data.heroBgImage}
                    alt="Story backdrop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>

                  {/* Story profile header */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 shadow-sm backdrop-blur-md"></div>
                    <span className="text-[8px] font-black text-white shadow-sm">solutions.feed</span>
                  </div>
                </div>

                {/* Simulated DM Auto-reply sequence */}
                <div className="flex-grow flex flex-col gap-2 justify-start py-4 overflow-y-auto scrollbar-none text-[10px] font-semibold">
                  <AnimatePresence>
                    {activeStorySlide >= 0 && (
                      <motion.div
                        key="story-msg"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="bg-white/10 text-white rounded-xl rounded-br-none p-3 shadow-lg border border-white/10 max-w-[85%] self-end text-right backdrop-blur-md"
                      >
                        <p className="text-[7px] text-white/50 text-left font-mono leading-none mb-1">REPLIED TO STORY</p>
                        <span>{data.storyUserMsg}</span>
                      </motion.div>
                    )}

                    {activeStorySlide >= 1 && (
                      <motion.div
                        key="story-reply"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="bg-white/5 text-[#B6BCC8] rounded-xl rounded-bl-none p-3 shadow-lg border border-white/10 max-w-[85%] self-start text-left backdrop-blur-md"
                      >
                        <p className="text-[7px] text-white/60 leading-none mb-1 uppercase font-mono">AUTOMATED RESPONSE</p>
                        <span>{data.storyBotMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Auto-reply footer badge */}
                <div className="bg-[#FF00FF] text-white text-center py-2.5 px-3 rounded-xl font-sans font-bold text-[9px] uppercase tracking-wider shadow-lg">
                  {data.interactionMockTitle} 1/2
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 5 — FEATURE GRID
          ================================================== */}
      <section className="py-28 px-6 bg-[#FAF8F4] w-full text-center border-b border-[#E8DFD3] z-10">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFF8EA] border border-[#E8D39D] text-[#B8860B] text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
          platform features
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#181818] tracking-tight leading-none mt-4 mb-16 max-w-2xl mx-auto font-playfair">
          Full suite DM conversion toolkit
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {data.featureCards.map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, translateY: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-8 rounded-[24px] border border-[#E8DFD3] bg-white hover:border-[#C99724] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] transition-all duration-300 text-left flex flex-col justify-between min-h-[220px]"
            >
              <div className="w-14 h-14 rounded-full bg-[#FFF8EA] flex items-center justify-center text-[#C99724] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="mt-6">
                <h3 className="font-extrabold text-[#181818] font-playfair text-base">{feat.title}</h3>
                <p className="text-[#555555] text-xs mt-2.5 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================================================
          SECTION 6 — HOW IT WORKS
          ================================================== */}
      <section className="py-28 px-6 max-w-7xl mx-auto w-full text-center z-10 bg-white border-b border-[#E8DFD3]">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFF8EA] border border-[#E8D39D] text-[#B8860B] text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
          system map
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#181818] tracking-tight leading-none mt-4 mb-16 max-w-2xl mx-auto font-playfair">
          Conversations to conversions in 3 steps
        </h2>

        {/* Timeline process wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-[#E8DFD3] hidden md:block z-0"></div>

          {data.timelineSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center relative z-10 text-center">
              {/* Number circle sphere */}
              <div className="w-14 h-14 rounded-full bg-white border border-[#E8DFD3] flex items-center justify-center text-[#B8860B] text-sm font-black shadow-sm mb-6 relative">
                <div className="absolute inset-0.5 rounded-full border border-[#E8D39D]/30 bg-[#FFF8EA]"></div>
                <span className="relative z-10">{idx + 1}</span>
              </div>
              <h3 className="text-base font-extrabold text-[#181818] uppercase tracking-wider font-playfair">{step.title}</h3>
              <p className="text-[#555555] text-xs mt-3 max-w-xs leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          SECTION 7 — SUCCESS STORIES
          ================================================== */}
      <section className="py-28 px-6 bg-[#F7F4EF] text-center z-10 border-b border-[#E8DFD3]">
        <div className="max-w-6xl mx-auto">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFF8EA] border border-[#E8D39D] text-[#B8860B] text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
            case studies
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#181818] tracking-tight leading-none mt-4 mb-16 max-w-2xl mx-auto font-playfair">
            Real outcomes from automated workflows
          </h2>

          {/* Success Stories Carousel */}
          <div className="flex flex-col items-center">
            <AnimatePresence>
              {data.successStories.map((story, idx) => {
                if (idx !== caseStudyIndex) return null;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-[#E8DFD3] rounded-[32px] p-6 sm:p-10 text-left shadow-[0_12px_35px_rgba(0,0,0,0.05)]"
                  >
                    {/* Left Column: Creator Image */}
                    <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
                      <img
                        src={story.img}
                        alt={story.client}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#181818]/40 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="text-[10px] bg-[#FFF8EA] border border-[#E8D39D] text-[#B8860B] font-bold font-mono uppercase px-3 py-1 rounded-full shadow-sm">
                          {story.metrics}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Case Details */}
                    <div className="lg:col-span-7 flex flex-col items-start gap-4">
                      <div className="flex items-center gap-1.5 font-bold text-[#C99724] text-[10px] uppercase font-mono tracking-widest">
                        <User size={13} />
                        <span>{story.client}</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-[#181818] tracking-tight font-playfair">
                        {story.revenue}
                      </h3>

                      {/* Before / After comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 w-full">
                        <div className="p-5 bg-[#FAF8F4] border border-[#E8DFD3] rounded-2xl">
                          <p className="text-[9px] font-bold text-[#777777] uppercase tracking-widest font-mono">BEFORE AUTOMATION</p>
                          <p className="text-[#6F6F6F] text-xs mt-2.5 leading-relaxed font-medium">{story.before}</p>
                        </div>
                        <div className="p-5 bg-[#FFF8EA] border border-[#E8D39D] rounded-2xl">
                          <p className="text-[9px] font-bold text-[#B8860B] uppercase tracking-widest font-mono">AFTER SET2SEND</p>
                          <p className="text-[#1E9E6A] text-xs mt-2.5 leading-relaxed font-bold">{story.after}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Carousel navigation controls */}
            {data.successStories.length > 1 && (
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={() => setCaseStudyIndex((prev) => (prev > 0 ? prev - 1 : data.successStories.length - 1))}
                  className="w-10 h-10 rounded-full border border-[#E8DFD3] bg-white hover:bg-[#FAF8F4] text-[#181818] hover:text-[#C99724] flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[10px] font-bold font-mono tracking-widest text-[#777777] uppercase">
                  {caseStudyIndex + 1} / {data.successStories.length}
                </span>
                <button
                  onClick={() => setCaseStudyIndex((prev) => (prev < data.successStories.length - 1 ? prev + 1 : 0))}
                  className="w-10 h-10 rounded-full border border-[#E8DFD3] bg-white hover:bg-[#FAF8F4] text-[#181818] hover:text-[#C99724] flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 8 — FINAL CTA
          ================================================== */}
      <section className="py-28 px-6 border-t border-[#E8DFD3] text-center relative overflow-hidden bg-white z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(232,223,211,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(232,223,211,0.15)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-4xl sm:text-5xl font-black text-[#181818] tracking-tight leading-none font-playfair">
            Ready to automate your growth?
          </h2>
          <p className="text-[#6F6F6F] text-sm sm:text-base max-w-md mx-auto leading-relaxed font-medium">
            Configure your Set2Send custom qualifiers and convert commenter traffic in 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full sm:w-auto">
            <Link
              href="/auth/google"
              className="w-full sm:w-auto text-center px-10 py-4 bg-[#181818] text-white hover:bg-[#C99724] hover:text-[#181818] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 ease-out shadow-md"
            >
              Start Free
            </Link>
            <button className="w-full sm:w-auto px-10 py-4 bg-transparent border border-[#C99724] text-[#C99724] hover:bg-[#FFF8EA] hover:text-[#B8860B] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 ease-out">
              Book Demo
            </button>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}
