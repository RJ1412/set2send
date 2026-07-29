# 🚀 Instagram & WhatsApp Automation CRM Platform

## 📌 Project Overview
This project is a comprehensive **Full-Stack SaaS platform** designed for creators, marketers, and businesses to automate their social media engagements, manage leads, and drive conversions. The core functionality revolves around connecting to Instagram and WhatsApp to create automated workflows (Flows), run campaigns based on user interactions (e.g., commenting on a post), and funnel users into a sophisticated CRM.

It acts as a complete growth engine, turning comments, story mentions, and DMs into actionable leads, collecting emails, gating content based on follows, and providing deep analytics.

---

## 🛠️ Technical Architecture & Stack

The application follows a decoupled client-server architecture with background workers for high scalability.

### **Frontend (Next.js + React)**
- **Framework:** Next.js 16 (App Router) with React 19.
- **State Management:** Zustand (for global states like Auth and Flow building).
- **Styling:** Tailwind CSS & Framer Motion (for smooth animations).
- **Visual Builder:** `@xyflow/react` (React Flow) for the drag-and-drop automation builder.
- **Data Visualization:** Recharts for analytics dashboards.

### **Backend (Node.js + Express.js)**
- **Framework:** Node.js with Express.
- **Database ORM:** Prisma (currently using SQLite, easily translatable to PostgreSQL).
- **Queue System:** BullMQ + Redis (Handles thousands of automated DMs and background tasks without blocking the main server thread).
- **Authentication:** JWT for session management, Google OAuth, and Meta Graph API integration.
- **Payments:** Razorpay integration for SaaS subscriptions.

---

## ✨ Core Features & Implementation Details

### 1. 🤖 Visual Automation Builder (Flows)
- **Feature:** A drag-and-drop canvas where users can build complex "If This Then That" sequences.
- **Implementation:** Built using `React Flow` on the frontend. The backend stores the flow nodes and edges in the `Flow` model as JSON strings. When a trigger occurs (like a specific Instagram keyword), the backend traverses the node graph to determine the sequence of actions (e.g., Send DM -> Wait 1 Hour -> Send WhatsApp message).

### 2. 💬 Instagram Automation (Campaigns)
- **Feature:** Automatically reply to comments, story mentions, and send automated DMs based on specific trigger keywords.
- **Implementation:** Integrates heavily with the **Meta Graph API via Webhooks**. 
  - The Express backend receives real-time webhook payloads from Meta when someone comments.
  - The `commentPollerWorker.js` and `dmWorker.js` (powered by BullMQ) process the webhook, check if the comment matches any active `Campaign` keywords (supporting fuzzy matching), and queue a DM to be sent.

### 3. 🔒 Follow Gates & Scarcity Gates
- **Feature:** Forces users to follow the Instagram account before they receive the automated DM link, and limits the number of successful redemptions.
- **Implementation:** 
  - **Follow Gate:** The system checks the user's follower status via the Graph API. If they aren't following, it sends a fallback message ("Please follow to get the link"). A `silentRecheckWorker.js` continuously polls to see if they eventually followed, and automatically delivers the link once they do.
  - **Scarcity Gate:** The `Campaign` model tracks `dms_sent`. If it exceeds the `limit_count`, it automatically sends a "Sold Out" message instead of the reward.

### 4. 📇 Integrated CRM & Lead Management
- **Feature:** Converts every interaction into a rich lead profile with tags, notes, activity history, and lead scoring (Cold/Warm/Hot).
- **Implementation:** The `Lead`, `LeadActivity`, and `LeadTag` Prisma models track the user journey. Every time a user interacts (comments, clicks a link in a DM, or replies), the backend updates their lead score and logs the activity, giving the business owner a timeline of the user's engagement.

### 5. 📧 Email Collection in DMs
- **Feature:** Automatically asks for and extracts email addresses directly within Instagram DMs before delivering the final link.
- **Implementation:** The bot prompts the user for their email. When the user replies, the system uses RegEx (or AI fallback) to extract the email, saves it to the `CollectedEmail` model, and automatically fires the final sequence delivering the promised content.

### 6. 📱 WhatsApp Broadcast Campaigns
- **Feature:** Allows users to send mass WhatsApp template messages to leads collected in the CRM.
- **Implementation:** Connects to the WhatsApp Business API. Users can select a template, map variables (e.g., `{{1}}` to the Lead's First Name), and the backend processes the broadcast asynchronously using background workers to adhere to Meta's rate limits.

### 7. 📊 Real-time Analytics & Tracking
- **Feature:** Dashboards showing funnel metrics (Comments -> DMs Sent -> Link Clicks -> Emails Captured).
- **Implementation:** A custom link tracking system (e.g., `/r/tracking_id`) intercepts link clicks in DMs, logs an `AnalyticsEvent`, increments the campaign counters, and then redirects the user to the final destination. A cron job generates daily `AnalyticsSnapshot` records for historical charting.

---

## 🎤 Interview Script: How to Explain This Project

If an interviewer asks you: *"Walk me through the most complex project you've built recently."*, use this script:

> "I recently developed a **Full-Stack Social Media Automation and CRM platform**, specifically tailored for Instagram and WhatsApp. The goal of the platform was to help creators and businesses turn their social media engagement—like post comments and story replies—into actual sales leads automatically.
> 
> The core of the application is an event-driven architecture. I built the frontend using **Next.js** and **React Flow**, allowing users to visually build drag-and-drop automation sequences—similar to Zapier or ManyChat. 
> 
> The real complexity, however, lived in the backend. I built a **Node.js/Express** server utilizing **Prisma ORM**. Because interacting with the Meta Graph API requires strict rate-limit handling and real-time webhook processing, I couldn't just process everything synchronously. If a viral reel got 1,000 comments in a minute, the server would crash. To solve this, I implemented a robust message queue system using **BullMQ and Redis**. 
> 
> When Meta sends a webhook about a new comment, the Express server instantly acknowledges it and pushes a job to Redis. My background worker processes (like the `dmWorker`) then pick up these jobs, check the user's follower status, and send out the automated DM. I even built advanced features like 'Follow Gates' where a separate background worker silently polls the API to see if a user followed the account later, and automatically delivers the promised link once they do.
> 
> Finally, every single interaction is logged into a custom-built CRM, complete with lead scoring, tagging, and funnel analytics. It was a massive learning experience in distributed systems, webhook security, and building scalable background task processors."

### 💡 Expected Follow-up Questions & How to Answer:

**Q: Why did you use Redis and BullMQ instead of just normal async functions?**
*A: "If the Node.js server restarted or crashed, any pending async timeouts would be lost. Redis provides persistence, and BullMQ gives me automatic retries, rate-limiting (crucial for Meta's API), and concurrency control so I don't overwhelm the API."*

**Q: How do you handle the Next.js and Express separation? Why not just use Next.js API routes?**
*A: "Next.js API routes are essentially serverless functions. Serverless functions spin down after execution, which makes them terrible for long-running background workers that need to constantly poll queues. Having a dedicated Express server allowed me to keep persistent BullMQ workers alive 24/7 while still enjoying Next.js for the highly interactive React frontend."*
