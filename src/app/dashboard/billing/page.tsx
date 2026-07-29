"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";
import { CheckCircle2 } from "lucide-react";

const plans = [
  { name: "Starter", price: 299, dms: 5000, id: "starter" },
  { name: "Growth", price: 999, dms: "Unlimited", id: "growth" },
  { name: "Agency", price: 2999, dms: "Unlimited + Multi-Account", id: "agency" },
];

export default function BillingPage() {
  const { data: currentPlan, isLoading } = useQuery({
    queryKey: ["currentPlan"],
    queryFn: () => api.get("/billing/current-plan").then((res) => res.data),
  });

  const handleSubscribe = async (planId: string) => {
    try {
      const { data } = await api.post("/billing/create-subscription", { plan: planId });
      alert(`Razorpay Checkout triggered for Subscription ID: ${data.subscriptionId}`);
    } catch (err: any) {
      alert(err.response?.data?.error || "Error initiating billing");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full font-sans">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#1A1A1A] tracking-tight mb-3">Billing & Subscriptions</h1>
        <p className="text-[#1A1A1A]/60 font-medium">Simple, transparent pricing. Upgrade anytime.</p>
      </div>

      <div className="bg-white border border-[#E8E4D9] shadow-sm rounded-3xl p-8 mb-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
          <h3 className="text-[10px] font-mono font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-2">Current Plan</h3>
          <p className="text-3xl font-black text-[#1A1A1A] uppercase flex items-center justify-center md:justify-start">
            {isLoading ? "..." : currentPlan?.plan || "Free"}
            <span className="ml-4 inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 tracking-wider">
              ACTIVE
            </span>
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-center md:items-end">
          <p className="text-[10px] font-mono font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-2">Monthly DM Usage</p>
          <div className="flex items-baseline text-3xl font-black text-[#1A1A1A]">
            {isLoading ? "..." : currentPlan?.dms_used_this_month || 0}
            <span className="mx-3 text-[#1A1A1A]/30 font-light">/</span>
            <span className="text-[#D4AF37]">{isLoading ? "..." : currentPlan?.dms_limit || 1000}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = currentPlan?.plan === plan.id;
          const isGrowth = plan.id === "growth";
          
          return (
            <div key={plan.id} className={`relative flex flex-col p-8 rounded-3xl bg-white border ${isGrowth ? 'border-[#D4AF37] shadow-lg' : 'border-[#E8E4D9] shadow-sm'} hover:-translate-y-1 hover:border-[#D4AF37] transition-all duration-300 overflow-hidden group`}>
              
              {isGrowth && (
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#D4AF37]"></div>
              )}
              
              <div className="mb-8">
                {isGrowth && <span className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider mb-6 inline-block">Most Popular</span>}
                <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black tracking-tighter text-[#1A1A1A]">₹{plan.price}</span>
                  <span className="ml-2 text-sm font-bold text-[#1A1A1A]/40 uppercase">/mo</span>
                </div>
              </div>
              
              <ul className="mb-10 space-y-5 flex-1">
                <li className="flex items-start">
                  <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-[#D4AF37] mt-0.5" />
                  <span className="ml-3 text-sm text-[#1A1A1A]/70 font-semibold">{plan.dms} DMs / month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-[#D4AF37] mt-0.5" />
                  <span className="ml-3 text-sm text-[#1A1A1A]/70 font-semibold">Instant WhatsApp Alerts</span>
                </li>
                {isGrowth && (
                   <li className="flex items-start">
                     <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-[#D4AF37] mt-0.5" />
                     <span className="ml-3 text-sm text-[#1A1A1A]/70 font-semibold">Priority Support</span>
                   </li>
                )}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent}
                className={`mt-auto w-full py-3.5 px-6 rounded-xl font-bold transition-all duration-300 text-sm flex items-center justify-center border ${
                  isCurrent
                    ? 'bg-[#FAF9F6] text-[#1A1A1A]/40 border-[#E8E4D9] cursor-not-allowed'
                    : isGrowth 
                      ? 'bg-[#1A1A1A] text-white hover:bg-[#333333] border-transparent shadow-md' 
                      : 'bg-white text-[#1A1A1A] hover:bg-[#FAF9F6] border-[#E8E4D9]'
                }`}
              >
                {isCurrent ? "Current Plan" : "Upgrade to " + plan.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
