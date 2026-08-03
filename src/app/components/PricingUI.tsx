"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────
interface AddonState { [key: string]: boolean }
interface WaVols { auth: number; mkt: number; util: number; intl: number }

interface PricingUIProps {
  /**
   * When defined, the CTA triggers a checkout instead of navigating to /signup.
   * Called with the selected plan key & billing period.
   */
  onCheckout?: (params: {
    plan: string;
    billing: string;
    addons: string[];
    extra_ig: number;
    extra_wa: number;
    wa_usage_estimate: number;
    use_coins: boolean;
  }) => void;
  /** Live coin balance for logged-in users */
  coinBalance?: number;
  /** Current plan key for logged-in users */
  currentPlanKey?: string;
  isLoading?: boolean;
}

// ─── Static Data ─────────────────────────────────────────────────────────────
const PLANS: Record<string, { name: string; price: number; igIncl: number; waIncl: number; waAccess: boolean; features: string[] }> = {
  free:    { name: "Starter",  price: 0,    igIncl: 1, waIncl: 0, waAccess: false, features: ["ctd","smr"] },
  creator: { name: "Creator",  price: 299,  igIncl: 1, waIncl: 1, waAccess: false, features: ["ctd","smr","cpr","fg","ec","an"] },
  growth:  { name: "Growth",   price: 699,  igIncl: 2, waIncl: 2, waAccess: true,  features: ["ctd","smr","cpr","fg","ec","crm","an","ai"] },
  biz:     { name: "Business", price: 1999, igIncl: 5, waIncl: 5, waAccess: true,  features: ["ctd","smr","cpr","fg","ec","crm","an","ai"] },
};

const ADDONS = [
  { key: "cpr", name: "Comment public reply", desc: "Auto-reply publicly on posts & reels",     price: 69  },
  { key: "fg",  name: "Follow-gate",          desc: "Only DM users who follow your account",     price: 99  },
  { key: "ec",  name: "Email collection",     desc: "Capture emails via DM flow · CSV export",  price: 79  },
  { key: "crm", name: "CRM & contacts",       desc: "Tag, segment & track unlimited contacts",  price: 99  },
  { key: "an",  name: "Analytics dashboard",  desc: "Top posts, DM rates, funnel metrics",       price: 69  },
  { key: "ai",  name: "AI suggestions",       desc: "Smart keyword & timing recommendations",    price: 49  },
  { key: "wa",  name: "WA bulk access",       desc: "Unlock WhatsApp bulk for ₹149/mo",          price: 149 },
];

const WA_TYPES: Record<string, { label: string; metaRate: number; yourRate: number }> = {
  auth: { label: "Authentication",     metaRate: 0.1150, yourRate: 0.14  },
  mkt:  { label: "Marketing",          metaRate: 0.8631, yourRate: 0.94  },
  util: { label: "Utility",            metaRate: 0.1150, yourRate: 0.14  },
  intl: { label: "Auth International", metaRate: 2.4971, yourRate: 3.40  },
};

const EXTRA_IG = 99, EXTRA_WA = 49;
const PLAN_RANK: Record<string, number> = { free: 0, creator: 1, growth: 2, biz: 3 };
const COIN_REDEEM_MIN = 1000;
const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");

export default function PricingUI({ onCheckout, coinBalance = 0, currentPlanKey, isLoading }: PricingUIProps) {
  const router = useRouter();
  const [billing, setBillingState] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState("creator");
  const [ig, setIg] = useState(1);
  const [wa, setWa] = useState(1);
  const [addons, setAddons] = useState<AddonState>(() => {
    const a: AddonState = {};
    ADDONS.forEach(ad => a[ad.key] = false);
    return a;
  });
  const [waVols, setWaVols] = useState<WaVols>({ auth: 0, mkt: 0, util: 0, intl: 0 });
  const [useCoins, setUseCoins] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  // ─── Computed helpers ──────────────────────────────────────────────────
  const disc = useCallback((p: number) => billing === "annual" ? Math.round(p * 0.8) : p, [billing]);
  const plan = PLANS[selectedPlan];
  const waEnabled = plan.waAccess || addons["wa"];
  const waBase = waEnabled ? (plan.waAccess ? plan.waIncl : 1) : 0;

  const calcWaEst = () => {
    let t = 0;
    Object.entries(WA_TYPES).forEach(([k, wt]) => { t += (waVols[k as keyof WaVols] || 0) * wt.yourRate; });
    return Math.ceil(t);
  };

  const calcSub = () => {
    let t = disc(plan.price);
    if (selectedPlan === "biz" && billing === "annual") {
      t = Math.round(t * 0.9); // 10% extra discount
    }
    t += Math.max(0, ig - plan.igIncl) * disc(EXTRA_IG);
    t += waEnabled ? Math.max(0, wa - waBase) * disc(EXTRA_WA) : 0;
    ADDONS.forEach(a => {
      if (!plan.features.includes(a.key) && addons[a.key]) t += disc(a.price);
    });
    return t;
  };

  const sub = calcSub();
  const est = calcWaEst();
  const grand = sub + est;
  const coinsApplied = useCoins ? Math.min(coinBalance, Math.floor(grand)) : 0;
  const netTotal = grand - coinsApplied;
  const coinPct = Math.min(100, Math.round((coinBalance / COIN_REDEEM_MIN) * 100));

  // ─── Actions ───────────────────────────────────────────────────────────
  const handleSelectPlan = (key: string) => {
    if (currentPlanKey && PLAN_RANK[key] < PLAN_RANK[currentPlanKey]) return;
    setSelectedPlan(key);
    const p = PLANS[key];
    setIg(p.igIncl);
    setWa(p.waAccess ? p.waIncl : 0);
    setAddons(prev => { const a: AddonState = {}; ADDONS.forEach(ad => a[ad.key] = false); return a; });
  };

  const handleToggleAddon = (key: string) => {
    if (plan.features.includes(key)) return;
    if (key === "wa" && plan.waAccess) return;
    setAddons(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === "wa") setWa(next["wa"] ? 1 : 0);
      return next;
    });
  };

  const handleCta = () => {
    if (currentPlanKey === selectedPlan || (currentPlanKey && PLAN_RANK[selectedPlan] < PLAN_RANK[currentPlanKey])) return;
    if (onCheckout) {
      const addonKeys = ADDONS.filter(a => addons[a.key]).map(a => a.key);
      onCheckout({ plan: selectedPlan, billing, addons: addonKeys, extra_ig: ig - plan.igIncl, extra_wa: wa - waBase, wa_usage_estimate: est, use_coins: useCoins });
    } else {
      const params = new URLSearchParams({ plan: selectedPlan, billing, ig: String(ig), wa: String(wa) });
      ADDONS.forEach(a => { if (addons[a.key]) params.append("addon", a.key); });
      router.push("/signup?" + params.toString());
    }
  };

  // ─── Render helpers ────────────────────────────────────────────────────
  const planChipClass: Record<string, string> = {
    free:    "bg-[#EEF8F3] text-[#2A7D4F] border border-[#A8D8BE]",
    creator: "bg-[#EEF3FB] text-[#2B5FA0] border border-[#A8C0E4]",
    growth:  "bg-[#FDF8EE] text-[#9A7B3A] border border-[#E8D5A0]",
    biz:     "bg-[#FEF4EC] text-[#C2601A] border border-[#F0C099]",
  };
  const planChipLabel: Record<string, string> = {
    free: "Free", creator: "Most popular", growth: "Pro", biz: "Agency"
  };

  const planFeatureList: Record<string, string[]> = {
    free:    ["Comment-to-DM (2,000/mo)", "Story reply (100/mo)", "1 Instagram account", "Basic CRM (50 contacts)"],
    creator: ["Comment-to-DM (unlimited)", "Story reply (unlimited)", "Comment public reply", "Follow-gate", "Email collection", "Top post analytics", "1 IG + 1 WA account", "WhatsApp (500 texts/mo)"],
    growth:  ["Comment-to-DM (unlimited)", "All story & comment triggers", "Follow-gate + custom flows", "CRM (unlimited contacts)", "Email collect + CSV export", "Full analytics dashboard", "2 IG + 2 WA accounts", "WhatsApp (2,000 texts/mo)"],
    biz:     ["Unlimited IG DMs", "All features unlocked", "5 IG + 5 WA accounts", "Unlimited CRM", "AI suggestions", "Priority support", "White-label (coming soon)", "WhatsApp (5,000 texts/mo)"],
  };
  const planFeaturesOff: Record<string, string[]> = {
    free:    ["Comment public reply", "Follow-gate", "WhatsApp bulk", "Email collection"],
    creator: ["CRM & contacts"],
    growth:  [],
    biz:     [],
  };

  return (
    <div style={{ background: "#F7F5F0", color: "#1A1714", fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .pricing-plan-card { background: #FFFFFF; border: 1.5px solid #E4DDD0; border-radius: 12px; padding: 20px 18px; cursor: pointer; transition: border-color .2s, box-shadow .2s, transform .15s; position: relative; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
        .pricing-plan-card:hover { border-color: #E8D5A0; box-shadow: 0 2px 8px rgba(0,0,0,.08); transform: translateY(-1px); }
        .pricing-plan-card.selected { border-color: #9A7B3A; box-shadow: 0 0 0 3px rgba(154,123,58,.1), 0 2px 8px rgba(0,0,0,.08); }
        .pricing-sm-tog { width: 34px; height: 18px; background: #E4DDD0; border-radius: 9px; position: relative; cursor: pointer; flex-shrink: 0; transition: background .2s; }
        .pricing-sm-tog.on { background: #9A7B3A; }
        .pricing-sm-tog-thumb { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .2s; box-shadow: 0 1px 2px rgba(0,0,0,.2); }
        .pricing-sm-tog.on .pricing-sm-tog-thumb { transform: translateX(16px); }
        .pricing-cnt-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid #E4DDD0; background: #F0EDE6; color: #6B6560; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; user-select: none; line-height: 1; }
        .pricing-cnt-btn:hover { border-color: #E8D5A0; color: #9A7B3A; background: #FDF8EE; }
        .pricing-cnt-btn.disabled { opacity: .3; cursor: not-allowed; pointer-events: none; }
        .pricing-sp-btn { width: 26px; height: 26px; border-radius: 50%; border: 1px solid #E4DDD0; background: #fff; color: #6B6560; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; transition: all .15s; user-select: none; }
        .pricing-sp-btn:hover { border-color: #E8D5A0; color: #9A7B3A; background: #FDF8EE; }
        .pricing-sp-input { width: 70px; height: 28px; border: 1px solid #E4DDD0; border-radius: 7px; background: #fff; color: #1A1714; font-size: 13px; font-weight: 600; text-align: center; outline: none; font-family: 'Inter', sans-serif; }
        .pricing-sp-input:focus { border-color: #E8D5A0; }
      `}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>

        {/* Billing Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "28px 0 24px" }}>
          <span style={{ fontSize: 13, color: billing === "monthly" ? "#1A1714" : "#6B6560", fontWeight: billing === "monthly" ? 600 : 500, cursor: "pointer" }}
            onClick={() => setBillingState("monthly")}>Monthly</span>
          <div style={{ width: 42, height: 22, background: billing === "annual" ? "#9A7B3A" : "#E4DDD0", borderRadius: 11, position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}
            onClick={() => setBillingState(billing === "monthly" ? "annual" : "monthly")}>
            <div style={{ position: "absolute", top: 3, left: billing === "annual" ? 23 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .22s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
          </div>
          <span style={{ fontSize: 13, color: billing === "annual" ? "#1A1714" : "#6B6560", fontWeight: billing === "annual" ? 600 : 500, cursor: "pointer" }}
            onClick={() => setBillingState("annual")}>Annual</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#2A7D4F", background: "#EEF8F3", padding: "2px 9px", borderRadius: 20, border: "1px solid #A8D8BE" }}>Save 20%</span>
        </div>

        {/* Coins Banner */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", background: "linear-gradient(90deg, #FDF8EE, #FFFFFF)", border: "1px solid #E8D5A0", borderRadius: 10, padding: "14px 18px", margin: "0 0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 220 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#9A7B3A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>◎</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>S2S Coins — earn, spend, or cash out</div>
              <div style={{ fontSize: 12, color: "#6B6560", marginTop: 1 }}>Refer a friend — you both earn coins (<b style={{ color: "#9A7B3A" }}>1 coin = ₹1</b>) when they subscribe. Spend coins on any plan, add-on or WhatsApp usage, or redeem as real cash once you cross <b style={{ color: "#9A7B3A" }}>1,000 coins</b>.</div>
            </div>
          </div>
          <button onClick={() => router.push(onCheckout ? "/dashboard/wallet" : "/signup")}
            style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", background: "#9A7B3A", padding: "9px 16px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap", border: "none", fontFamily: "Inter, sans-serif" }}>
            {onCheckout ? "My Wallet" : "Get your referral link"}
          </button>
        </div>

        {/* Step 1: Plan Cards */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#B0AB9E", marginBottom: 16 }}>Step 1 — Choose your base plan</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 8 }}>
          {(["free","creator","growth","biz"] as const).map(key => (
            <div key={key} className={`pricing-plan-card${selectedPlan === key ? " selected" : ""}`} onClick={() => handleSelectPlan(key)}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, display: "inline-block", marginBottom: 12, width: "fit-content" }} className={planChipClass[key]}>
                {planChipLabel[key]}
              </span>
              <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 2 }}>{PLANS[key].name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 3 }}>
                <span style={{ fontSize: 28, fontWeight: 600, color: selectedPlan === key ? "#9A7B3A" : "#1A1714", fontVariantNumeric: "tabular-nums", transition: "color .2s" }}>
                  ₹{fmt(disc(PLANS[key].price))}
                </span>
                <span style={{ fontSize: 12.5, color: "#6B6560" }}>/mo</span>
              </div>
              <div style={{ fontSize: 11.5, color: "#6B6560", marginBottom: 14 }}>
                {key === "free" && "Test before you commit"}
                {key === "creator" && "Solo creators & small brands"}
                {key === "growth" && "D2C brands scaling fast"}
                {key === "biz" && "Agencies, multiple clients"}
              </div>
              <div style={{ height: 1, background: "#EDE9E2", margin: "0 0 12px" }} />
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6, flex: 1, padding: 0, margin: 0 }}>
                {planFeatureList[key].map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12, color: "#1A1714", lineHeight: 1.4 }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, background: "#EEF8F3", color: "#2A7D4F", border: "1px solid #A8D8BE" }}>✓</span>
                    {f}
                  </li>
                ))}
                {(planFeaturesOff[key] || []).map((f, i) => (
                  <li key={`off-${i}`} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12, color: "#B0AB9E", lineHeight: 1.4 }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, background: "#F0EDE6", border: "1px solid #E4DDD0" }}>–</span>
                    {f}
                  </li>
                ))}
              </ul>
              {selectedPlan === key && <div style={{ position: "absolute", top: 12, right: 12, fontSize: 10, fontWeight: 700, color: "#9A7B3A", letterSpacing: ".05em", textTransform: "uppercase" }}>Selected ✓</div>}
            </div>
          ))}
        </div>

        {/* Trust note */}
        <div style={{ background: "#FDF8EE", border: "1px solid #E8D5A0", borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 8 }}>
          {[
            { title: "Upgrade or downgrade anytime", body: "Move between plans whenever your usage changes — no lock-in, no penalty, pro-rated instantly." },
            { title: "WhatsApp, billed transparently", body: "Every message type has a fixed per-message rate shown below. You only pay for what you actually send." },
            { title: "Built for the Indian market", body: "INR pricing, GST-ready invoices, and local payment methods — no currency conversion surprises." },
          ].map((item, i) => (
            <div key={i} style={{ fontSize: 12, color: "#6B6560", lineHeight: 1.5 }}>
              <strong style={{ color: "#1A1714", display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>{item.title}</strong>
              {item.body}
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "#E4DDD0", margin: "28px 0 24px" }} />

        {/* Step 2: Add extras */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#B0AB9E", marginBottom: 16 }}>Step 2 — Add extras (optional)</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start", paddingBottom: 60 }}>

          {/* Left Panel */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E4DDD0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>

            {/* Accounts section */}
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #EDE9E2" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#B0AB9E", marginBottom: 14 }}>Connected accounts</div>
              {/* IG */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #EDE9E2", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>Instagram accounts</div>
                  <div style={{ fontSize: 11.5, color: "#6B6560", marginTop: 1 }}>{plan.igIncl} included · extras at ₹{fmt(disc(EXTRA_IG))}/mo each</div>
                  {ig > plan.igIncl && <div style={{ fontSize: 11, color: "#9A7B3A", marginTop: 1 }}>+₹{fmt((ig - plan.igIncl) * disc(EXTRA_IG))}/mo</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button className={`pricing-cnt-btn${ig <= plan.igIncl ? " disabled" : ""}`} onClick={() => ig > plan.igIncl && setIg(ig - 1)}>−</button>
                  <span style={{ fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{ig}</span>
                  <button className="pricing-cnt-btn" onClick={() => setIg(Math.min(20, ig + 1))}>+</button>
                </div>
              </div>
              {/* WA */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>WhatsApp numbers</div>
                  <div style={{ fontSize: 11.5, color: "#6B6560", marginTop: 1 }}>
                    {waEnabled ? `${waBase} included · extras at ₹${fmt(disc(EXTRA_WA))}/mo each` : "Not in this plan — add WA bulk below"}
                  </div>
                  {waEnabled && wa > waBase && <div style={{ fontSize: 11, color: "#9A7B3A", marginTop: 1 }}>+₹{fmt((wa - waBase) * disc(EXTRA_WA))}/mo</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button className={`pricing-cnt-btn${!waEnabled || wa <= waBase ? " disabled" : ""}`} onClick={() => waEnabled && wa > waBase && setWa(wa - 1)}>−</button>
                  <span style={{ fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{waEnabled ? wa : "—"}</span>
                  <button className={`pricing-cnt-btn${!waEnabled ? " disabled" : ""}`} onClick={() => waEnabled && setWa(Math.min(20, wa + 1))}>+</button>
                </div>
              </div>
            </div>

            {/* Feature addons */}
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #EDE9E2" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#B0AB9E", marginBottom: 14 }}>Feature add-ons</div>
              {ADDONS.filter(a => a.key !== "wa").map(a => {
                const inPlan = plan.features.includes(a.key);
                const isOn = addons[a.key];
                return (
                  <div key={a.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #EDE9E2" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: inPlan || isOn ? "#1A1714" : "#6B6560" }}>{a.name}</div>
                      <div style={{ fontSize: 11.5, color: "#B0AB9E", marginTop: 1 }}>{a.desc}</div>
                    </div>
                    {inPlan ? (
                      <span style={{ fontSize: 10.5, color: "#2A7D4F", background: "#EEF8F3", padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap", border: "1px solid #A8D8BE", fontWeight: 500 }}>In plan</span>
                    ) : (
                      <>
                        <span style={{ fontSize: 12, color: isOn ? "#9A7B3A" : "#B0AB9E", whiteSpace: "nowrap", flexShrink: 0 }}>+₹{fmt(disc(a.price))}/mo</span>
                        <div className={`pricing-sm-tog${isOn ? " on" : ""}`} onClick={() => handleToggleAddon(a.key)}>
                          <div className="pricing-sm-tog-thumb" />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* WA Bulk */}
            <div style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#B0AB9E", marginBottom: 14 }}>WhatsApp bulk messaging</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #EDE9E2" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>WA bulk send</div>
                  <div style={{ fontSize: 11.5, color: "#B0AB9E" }}>Usage-based · billed monthly for exactly what you send</div>
                </div>
                {plan.waAccess ? (
                  <span style={{ fontSize: 10.5, color: "#2A7D4F", background: "#EEF8F3", padding: "2px 9px", borderRadius: 20, border: "1px solid #A8D8BE", fontWeight: 500 }}>Included in plan</span>
                ) : (
                  <>
                    <span style={{ fontSize: 12, color: addons["wa"] ? "#9A7B3A" : "#B0AB9E" }}>+₹{fmt(disc(149))}/mo</span>
                    <div className={`pricing-sm-tog${addons["wa"] ? " on" : ""}`} onClick={() => handleToggleAddon("wa")}>
                      <div className="pricing-sm-tog-thumb" />
                    </div>
                  </>
                )}
              </div>
              {waEnabled && (
                <div style={{ background: "#F0EDE6", borderRadius: 10, padding: "14px 16px", marginTop: 10 }}>
                  {(["auth","mkt","util","intl"] as const).map((t, idx) => (
                    <React.Fragment key={t}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{WA_TYPES[t].label}{t === "mkt" && <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", background: "#EEF3FB", color: "#2B5FA0", border: "1px solid #A8C0E4", padding: "1px 7px", borderRadius: 20, marginLeft: 6 }}>most used</span>}</div>
                          <div style={{ fontSize: 11, color: "#6B6560", marginTop: 2 }}>₹{WA_TYPES[t].metaRate.toFixed(4)} Meta · <span style={{ color: "#9A7B3A", fontWeight: 600 }}>₹{WA_TYPES[t].yourRate}/credit</span></div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button className="pricing-sp-btn" onClick={() => setWaVols(prev => ({ ...prev, [t]: Math.max(0, (prev[t] || 0) - (t === "intl" ? 50 : 100)) }))}>−</button>
                          <input className="pricing-sp-input" type="number" value={waVols[t]} min={0}
                            onChange={e => setWaVols(prev => ({ ...prev, [t]: Math.max(0, parseInt(e.target.value) || 0) }))} />
                          <button className="pricing-sp-btn" onClick={() => setWaVols(prev => ({ ...prev, [t]: (prev[t] || 0) + (t === "intl" ? 50 : 100) }))}>+</button>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, minWidth: 44, textAlign: "right" }}>₹{fmt(waVols[t] * WA_TYPES[t].yourRate)}</div>
                      </div>
                      {idx < 3 && <div style={{ height: 1, background: "#EDE9E2" }} />}
                    </React.Fragment>
                  ))}
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E4DDD0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Est. monthly WhatsApp usage</div>
                      <div style={{ fontSize: 11, color: "#2A7D4F", fontWeight: 500, marginTop: 3 }}>Added straight to your monthly total</div>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#9A7B3A" }}>₹{fmt(est)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary Bill */}
          <div style={{ position: "sticky", top: 20 }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E4DDD0", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
              <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #EDE9E2", background: "#F0EDE6" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#B0AB9E", marginBottom: 4 }}>Your bill</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{plan.name} plan</div>
              </div>

              {/* Line items */}
              <div style={{ padding: "4px 18px" }}>
                {(() => {
                  const rows: { label: string; value: string; cls?: string }[] = [];
                  if (disc(plan.price) === 0) rows.push({ label: plan.name + " plan", value: "Free", cls: "green" });
                  else rows.push({ label: plan.name + " plan", value: `₹${fmt(disc(plan.price))}/mo` });
                  if (billing === "annual" && plan.price > 0) rows.push({ label: "Annual discount (−20%)", value: "", cls: "green" });
                  const exIG = Math.max(0, ig - plan.igIncl);
                  if (exIG > 0) rows.push({ label: `+${exIG} extra IG account${exIG > 1 ? "s" : ""}`, value: `+₹${fmt(exIG * disc(EXTRA_IG))}/mo`, cls: "gold" });
                  const exWA = waEnabled ? Math.max(0, wa - waBase) : 0;
                  if (exWA > 0) rows.push({ label: `+${exWA} extra WA number${exWA > 1 ? "s" : ""}`, value: `+₹${fmt(exWA * disc(EXTRA_WA))}/mo`, cls: "gold" });
                  ADDONS.forEach(a => {
                    if (a.key !== "wa" && !plan.features.includes(a.key) && addons[a.key]) rows.push({ label: a.name, value: `+₹${fmt(disc(a.price))}/mo`, cls: "gold" });
                  });
                  if (!plan.waAccess && addons["wa"]) rows.push({ label: "WA bulk access", value: `+₹${fmt(disc(149))}/mo`, cls: "gold" });
                  if (est > 0) rows.push({ label: "WhatsApp usage (billed as sent)", value: `+₹${fmt(est)}/mo`, cls: "gold" });
                  if (coinsApplied > 0) rows.push({ label: "◎ S2S Coins applied", value: `−₹${fmt(coinsApplied)}`, cls: "green" });
                  return rows.map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 0", borderBottom: "1px solid #EDE9E2", fontSize: 13, gap: 6 }}>
                      <span style={{ color: "#6B6560", display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#B0AB9E", flexShrink: 0 }} />
                        {r.label}
                      </span>
                      <span style={{ fontWeight: 600, whiteSpace: "nowrap", color: r.cls === "green" ? "#2A7D4F" : r.cls === "gold" ? "#9A7B3A" : "#1A1714" }}>{r.value}</span>
                    </div>
                  ));
                })()}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 18px", borderTop: "1px solid #E4DDD0", borderBottom: "1px solid #EDE9E2", background: "#F0EDE6", fontSize: 12.5 }}>
                <span style={{ color: "#6B6560", fontWeight: 500 }}>Subscription / mo</span>
                <span style={{ fontWeight: 600, color: "#1A1714" }}>₹{fmt(sub)}</span>
              </div>

              {/* Coins Wallet */}
              <div style={{ padding: "12px 18px", borderBottom: "1px solid #EDE9E2" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#6B6560", display: "flex", alignItems: "center", gap: 6 }}>◎ S2S Coins balance</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#9A7B3A" }}>{fmt(coinBalance)} coins</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: "#1A1714" }}>Apply coins to this bill</span>
                  <div className={`pricing-sm-tog${useCoins ? " on" : ""}`} onClick={() => setUseCoins(!useCoins)}>
                    <div className="pricing-sm-tog-thumb" />
                  </div>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: "#EDE9E2", marginTop: 9, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#9A7B3A", borderRadius: 3, width: `${coinPct}%`, transition: "width .3s" }} />
                </div>
                <div style={{ fontSize: 10.5, color: "#B0AB9E", marginTop: 5 }}>
                  {coinBalance >= COIN_REDEEM_MIN
                    ? <><b style={{ color: "#2A7D4F" }}>Eligible for cash redemption</b> — withdraw anytime from your wallet</>
                    : <><b style={{ color: "#2A7D4F" }}>{fmt(COIN_REDEEM_MIN - coinBalance)} more coins</b> to unlock cash redemption (1,000 coin minimum)</>}
                </div>
              </div>

              {/* WhatsApp breakdown */}
              {waEnabled && est > 0 && (
                <div style={{ padding: "12px 18px", borderBottom: "1px solid #EDE9E2" }}>
                  <div style={{ fontSize: 11.5, color: "#6B6560", marginBottom: 8, fontWeight: 500 }}>WhatsApp usage — billed exactly for what you typed above</div>
                  {(["auth","mkt","util","intl"] as const).filter(t => waVols[t] > 0).map(t => (
                    <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 12.5, padding: "5px 0", borderBottom: "1px solid #EDE9E2" }}>
                      <span style={{ color: "#6B6560" }}>{WA_TYPES[t].label} · {fmt(waVols[t])} msgs</span>
                      <span style={{ fontWeight: 600 }}>₹{fmt(Math.ceil(waVols[t] * WA_TYPES[t].yourRate))}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 12.5, padding: "7px 0", marginTop: 4, paddingTop: 7, borderTop: "1px solid #E4DDD0" }}>
                    <span style={{ fontWeight: 600, color: "#1A1714" }}>Added to your total</span>
                    <span style={{ fontWeight: 600, color: "#9A7B3A" }}>₹{fmt(est)}/mo</span>
                  </div>
                </div>
              )}

              {/* Grand total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderTop: "1px solid #E4DDD0" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Total / month</div>
                  {(est > 0 || coinsApplied > 0) && (
                    <div style={{ fontSize: 11, color: "#B0AB9E", marginTop: 1 }}>
                      {est > 0 && `₹${fmt(sub)}/mo sub + ₹${fmt(est)}/mo WA usage`}
                      {coinsApplied > 0 && ` · ${fmt(coinsApplied)} coins applied`}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.02em" }}>₹{fmt(netTotal)}</div>
              </div>

              {/* CTA */}
              <div style={{ padding: "12px 18px 16px" }}>
                <button onClick={handleCta} disabled={currentPlanKey === selectedPlan || Boolean(currentPlanKey && PLAN_RANK[selectedPlan] < PLAN_RANK[currentPlanKey]) || isLoading}
                  style={{ width: "100%", padding: 12, borderRadius: 10, background: currentPlanKey === selectedPlan ? "#B0AB9E" : "#9A7B3A", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: currentPlanKey === selectedPlan ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", transition: "background .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#B8942E")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#9A7B3A")}>
                  {currentPlanKey === selectedPlan
                    ? "Current Plan"
                    : currentPlanKey && PLAN_RANK[selectedPlan] < PLAN_RANK[currentPlanKey]
                    ? "Choose a higher plan"
                    : isLoading
                    ? "Processing…"
                    : plan.price === 0
                    ? "Get started free"
                    : onCheckout
                    ? `Upgrade to ${plan.name}`
                    : `Start ${plan.name} plan`}
                </button>
                <div style={{ textAlign: "center", fontSize: 11, color: "#B0AB9E", marginTop: 7 }}>Free plan available · upgrade or cancel anytime</div>
              </div>

              {/* How it's calculated */}
              <div style={{ borderTop: "1px solid #EDE9E2" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", cursor: "pointer", fontSize: 12, color: "#B0AB9E" }}
                  onClick={() => setCalcOpen(!calcOpen)}>
                  <span>How this is calculated</span>
                  <span>{calcOpen ? "▴" : "▾"}</span>
                </div>
                {calcOpen && (
                  <div style={{ fontSize: 12, color: "#B0AB9E", lineHeight: 1.65, padding: "0 18px 14px" }}>
                    The subscription line covers your plan + any feature add-ons + extra accounts, billed monthly or annually. WhatsApp usage is billed at the per-message rate for exactly what you type into the boxes above, and is added straight into the total — no separate credit purchase step. Annual billing gives 20% off subscriptions only; WhatsApp usage is always the same rate either way.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div style={{ height: 1, background: "#E4DDD0", margin: "0 0 24px" }} />
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#B0AB9E", marginBottom: 16 }} id="compare">Compare all plans</p>
        <div style={{ overflowX: "auto", paddingBottom: 40 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680, background: "#FFFFFF", border: "1px solid #E4DDD0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <thead>
              <tr>
                <th style={{ padding: "16px 14px", textAlign: "left", background: "#F0EDE6", fontSize: 13.5, fontWeight: 600, borderBottom: "1px solid #EDE9E2", minWidth: 220 }}>Feature</th>
                {[{ key: "free", name: "Starter", price: "Free" }, { key: "creator", name: "Creator", price: "₹299/mo" }, { key: "growth", name: "Growth", price: "₹699/mo" }, { key: "biz", name: "Business", price: "₹1,999/mo" }].map(p => (
                  <th key={p.key} style={{ padding: "16px 14px", textAlign: "center", background: p.key === "creator" ? "#FDF8EE" : "#F0EDE6", fontSize: 13.5, fontWeight: 600, borderBottom: p.key === "creator" ? "2px solid #E8D5A0" : "1px solid #EDE9E2", color: p.key === "creator" ? "#9A7B3A" : "#1A1714" }}>
                    {p.name}<span style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B6560", marginTop: 2 }}>{p.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { group: "Instagram automation", rows: [
                  { label: "Comment-to-DM replies", desc: "Automatically send a DM when someone comments on your post.", free: "2,000/mo", creator: "Unlimited", growth: "Unlimited", biz: "Unlimited" },
                  { label: "Story reply automation", desc: "Send automatic replies when people reply to your stories.", free: "100/mo", creator: "Unlimited", growth: "Unlimited", biz: "Unlimited" },
                  { label: "Comment public reply", desc: "Automatically reply to the public comment itself before sending a DM.", free: "–", creator: "✓", growth: "✓", biz: "✓" },
                  { label: "Follow-gate (DM only followers)", desc: "Require users to follow your account before they receive the DM.", free: "–", creator: "✓", growth: "✓", biz: "✓" },
                  { label: "Custom flow builder", desc: "Build advanced conversational workflows and branching logic.", free: "–", creator: "–", growth: "✓", biz: "✓" },
                  { label: "Instagram accounts included", desc: "Number of Instagram profiles you can connect to your account.", free: "1", creator: "1", growth: "2", biz: "5" },
                ]},
                { group: "Contacts & data", rows: [
                  { label: "Email collection + CSV export", desc: "Ask for and capture emails directly in DMs, then download as CSV.", free: "–", creator: "✓", growth: "✓", biz: "✓" },
                  { label: "CRM & contact tagging", desc: "Manage your audience with tags and see their full chat history.", free: "–", creator: "Basic (50 contacts)", growth: "Unlimited", biz: "Unlimited" },
                  { label: "Analytics dashboard", desc: "View detailed charts on message volume, top posts, and conversion rates.", free: "–", creator: "Top posts only", growth: "Full dashboard", biz: "Full dashboard" },
                  { label: "AI keyword & timing suggestions", desc: "Get smart recommendations on the best keywords to use and when to post.", free: "–", creator: "–", growth: "✓", biz: "✓" },
                ]},
                { group: "WhatsApp", rows: [
                  { label: "WhatsApp bulk messaging", desc: "Send mass promotional or utility updates via WhatsApp API.", free: "–", creator: "Add-on (+₹149/mo)", growth: "✓ Included", biz: "✓ Included, discounted" },
                  { label: "WhatsApp numbers included", desc: "Number of WhatsApp phone numbers you can connect.", free: "0", creator: "1 (with add-on)", growth: "2", biz: "5" },
                  { label: "Pay-as-you-go message pricing", desc: "Pay only for the exact number of messages you successfully send.", free: "–", creator: "✓", growth: "✓", biz: "✓" },
                ]},
                { group: "Support & extras", rows: [
                  { label: "Extra Instagram account", desc: "Add more Instagram profiles beyond your plan's limit.", free: "–", creator: "₹99/mo each", growth: "₹99/mo each", biz: "₹99/mo each" },
                  { label: "Extra WhatsApp number", desc: "Add more WhatsApp numbers beyond your plan's limit.", free: "–", creator: "₹49/mo each", growth: "₹49/mo each", biz: "₹49/mo each" },
                  { label: "Support", desc: "How quickly and through which channel you receive customer service.", free: "Community", creator: "Email", growth: "Priority email", biz: "Priority + white-glove" },
                  { label: "White-label branding", desc: "Remove our branding and use your own logo for your clients.", free: "–", creator: "–", growth: "–", biz: "Coming soon" },
                ]},
              ].map(section => (
                <React.Fragment key={section.group}>
                  <tr>
                    <td colSpan={5} style={{ textAlign: "left", background: "#F0EDE6", fontSize: 10.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#B0AB9E", padding: "9px 14px" }}>{section.group}</td>
                  </tr>
                  {section.rows.map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: "11px 14px", textAlign: "left", fontSize: 12.5, borderBottom: "1px solid #EDE9E2", color: "#6B6560", fontWeight: 500 }}>
                        <div className="group flex items-center gap-1.5 cursor-help w-max relative">
                          {row.label}
                          <div className="w-3.5 h-3.5 rounded-full border border-[#B0AB9E] text-[#B0AB9E] flex items-center justify-center text-[9px] font-bold">?</div>
                          <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 w-48 p-2.5 bg-[#1A1714] text-white text-[11px] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-normal font-normal leading-relaxed text-left">
                            {row.desc}
                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1A1714] rotate-45"></div>
                          </div>
                        </div>
                      </td>
                      {(["free", "creator", "growth", "biz"] as const).map(k => {
                        const val = row[k];
                        const isHi = k === "creator";
                        const isYes = val === "✓" || (typeof val === "string" && val.startsWith("✓"));
                        const isNo = val === "–";
                        return (
                          <td key={k} style={{ padding: "11px 14px", textAlign: "center", fontSize: 12.5, borderBottom: "1px solid #EDE9E2", background: isHi ? "#FDF8EE" : "transparent", color: isYes ? "#2A7D4F" : isNo ? "#B0AB9E" : "#1A1714", fontWeight: isYes ? 700 : 400 }}>{val}</td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
