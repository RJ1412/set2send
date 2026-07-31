"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../../lib/api";
import PricingUI from "../../components/PricingUI";

export default function BillingPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { data: currentPlan, isLoading: planLoading } = useQuery({
    queryKey: ["currentPlan"],
    queryFn: () => api.get("/billing/current-plan").then((res) => res.data),
  });

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => api.get("/wallet").then((res) => res.data),
  });

  const handleCheckout = async (params: {
    plan: string;
    billing: string;
    addons: string[];
    extra_ig: number;
    extra_wa: number;
    wa_usage_estimate: number;
    use_coins: boolean;
  }) => {
    if (params.plan === "free") {
      alert("You are already on the free plan!");
      return;
    }
    setCheckoutLoading(true);
    try {
      const { data } = await api.post("/billing/create-order", {
        plan: params.plan,
        billing: params.billing,
        addons: params.addons,
        extra_ig: params.extra_ig,
        extra_wa: params.extra_wa,
        wa_usage_estimate: params.wa_usage_estimate,
        use_coins: params.use_coins,
      });

      const invoice = data.invoice;
      const orderId = data.orderId;

      if (invoice.total_paise === 0) {
        alert("Order created successfully! Total: ₹0 (covered by coins). Order ID: " + orderId);
        return;
      }

      // Open Razorpay checkout if configured
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (razorpayKey && typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: razorpayKey,
          amount: invoice.total_paise,
          currency: "INR",
          name: "set2send",
          description: `${params.plan} plan — ${params.billing}`,
          order_id: orderId,
          notes: {
            user_id: currentPlan?.user_id,
            plan_key: params.plan,
          },
          theme: { color: "#9A7B3A" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        alert(`Order created! ID: ${orderId}\nAmount: ₹${invoice.total}\n\nIntegrate Razorpay SDK to complete payment.`);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Error creating order. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Current Plan Banner */}
      {!planLoading && currentPlan && (
        <div style={{ background: "#fff", borderBottom: "1px solid #E4DDD0", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "#EEF8F3", border: "1px solid #A8D8BE", borderRadius: 8, padding: "4px 12px" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#2A7D4F" }}>Active</span>
            </div>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{currentPlan.plan || "Free"} Plan</span>
              <span style={{ fontSize: 12, color: "#6B6560", marginLeft: 8 }}>· {currentPlan.dms_used_this_month || 0} DMs sent this month</span>
            </div>
          </div>
          {!walletLoading && wallet && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "#9A7B3A", fontWeight: 600 }}>◎ {wallet.balance} coins</span>
            </div>
          )}
        </div>
      )}

      <PricingUI
        onCheckout={handleCheckout}
        coinBalance={wallet?.balance || 0}
        currentPlanKey={currentPlan?.plan_key || currentPlan?.plan || "free"}
        isLoading={checkoutLoading}
      />
    </div>
  );
}
