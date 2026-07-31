"use client";

import PricingUI from "../components/PricingUI";

export default function PricingClient() {
  return (
    <main style={{ paddingTop: 72 }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "52px 24px 40px", borderBottom: "1px solid #EDE9E2", background: "#F7F5F0" }}>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#9A7B3A", marginBottom: 24, display: "block" }}>set2send</span>
        <h1 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 400, lineHeight: 1.2, color: "#1A1714", marginBottom: 10, letterSpacing: "-.02em" }}>
          Pay for what you <strong style={{ fontWeight: 600 }}>actually use</strong>
        </h1>
        <p style={{ color: "#6B6560", fontSize: 14.5, maxWidth: 400, margin: "0 auto 20px" }}>
          Pick a base plan, layer on exactly what you need. WhatsApp is always pay-as-you-go — never a flat surprise bill.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 6, fontSize: 12, color: "#B0AB9E" }}>
          {["No setup fee", "Cancel anytime", "Free plan, no card needed", "GST invoice", "Earn coins, redeem as cash"].map(item => (
            <span key={item} style={{ background: "#F0EDE6", border: "1px solid #E4DDD0", borderRadius: 20, padding: "4px 12px", color: "#6B6560", display: "flex", alignItems: "center", gap: 5 }}>
              ✓ <strong style={{ color: "#1A1714" }}>{item}</strong>
            </span>
          ))}
        </div>
      </div>
      <PricingUI />
    </main>
  );
}
