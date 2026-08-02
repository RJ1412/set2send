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
      const responseRazorpayKey = data.razorpayKey;

      if (invoice.total_paise === 0) {
        alert("Order created successfully! Total: ₹0 (covered by coins). Order ID: " + orderId);
        return;
      }

      // Open Razorpay checkout
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || responseRazorpayKey;
      if (!razorpayKey) {
        alert("Payment gateway is not configured. Please contact support.");
        return;
      }

      if (typeof window === "undefined" || !(window as any).Razorpay) {
        alert("Payment gateway is loading. Please try again in a moment.");
        return;
      }

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
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Verify payment signature on backend
          try {
            const { data: verifyData } = await api.post("/billing/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyData.success) {
              alert("Payment successful! Your plan has been activated.");
              window.location.reload();
            }
          } catch (verifyErr: any) {
            alert(
              verifyErr.response?.data?.error ||
                "Payment was received but verification failed. Please contact support."
            );
          }
        },
        modal: {
          ondismiss: () => {
            // User closed the Razorpay modal without completing payment
            setCheckoutLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        const errorDesc =
          response.error?.description || "Payment failed. Please try again.";
        const errorCode = response.error?.code || "";
        alert(`Payment failed: ${errorDesc}${errorCode ? ` (${errorCode})` : ""}`);
        setCheckoutLoading(false);
      });

      rzp.open();
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
