"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";

export default function WalletPage() {
  const queryClient = useQueryClient();
  const [bankDetails, setBankDetails] = useState({
    account_number: "",
    ifsc: "",
    account_name: "",
    bank_name: ""
  });
  const [showRedeemForm, setShowRedeemForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => api.get("/wallet").then((res) => res.data),
    refetchInterval: 10000,
  });

  const redeemMutation = useMutation({
    mutationFn: (details: any) => api.post("/wallet/redeem", { bankDetails: details }),
    onSuccess: () => {
      alert("Redemption request submitted successfully.");
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setShowRedeemForm(false);
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Failed to redeem coins.");
    }
  });

  if (isLoading) return <div className="p-6">Loading wallet...</div>;
  if (error) return <div className="p-6 text-red-500">Failed to load wallet</div>;

  const { balance, ledger, referralCode, referrals } = data;
  const redemptionMinimum = data.redemptionMinimum ?? 3000;
  const canRedeem = balance >= redemptionMinimum;
  const lifetimeEarned = ledger.filter((entry: any) => entry.delta > 0).reduce((sum: number, entry: any) => sum + entry.delta, 0);
  const cashRedeemed = ledger.filter((entry: any) => entry.reason === "redeemed_cash").reduce((sum: number, entry: any) => sum + Math.abs(entry.delta), 0);
  const activeReferrals = referrals.filter((ref: any) => ref.status === "rewarded").length;

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    redeemMutation.mutate(bankDetails);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    alert("Referral link copied!");
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-black mb-8">S2S Coins Wallet</h1>

      <div className="grid sm:grid-cols-2 gap-8 mb-8">
        {/* Balance Card */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">Your Balance</h2>
          <div className="text-4xl font-black text-[#D4AF37] mb-4">
            â—Ž {balance.toLocaleString()}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div
              className="bg-[#D4AF37] h-2 rounded-full"
              style={{ width: `${Math.min(100, (balance / redemptionMinimum) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            {redemptionMinimum - balance > 0
              ? `${redemptionMinimum - balance} more coins to unlock cash redemption`
              : "You are eligible for cash redemption!"}
          </p>

          {!showRedeemForm ? (
            <button
              onClick={() => setShowRedeemForm(true)}
              disabled={!canRedeem}
              className={`w-full py-3 rounded-xl font-bold text-sm ${
                canRedeem
                  ? "bg-[#1A1A1A] text-white hover:bg-black"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Redeem as Cash
            </button>
          ) : (
            <form onSubmit={handleRedeemSubmit} className="space-y-3 mt-4 border-t pt-4">
              <h3 className="text-sm font-bold">Bank Details</h3>
              <input
                type="text" required placeholder="Account Name"
                value={bankDetails.account_name}
                onChange={e => setBankDetails({...bankDetails, account_name: e.target.value})}
                className="w-full p-2 text-sm border rounded"
              />
              <input
                type="text" required placeholder="Account Number"
                value={bankDetails.account_number}
                onChange={e => setBankDetails({...bankDetails, account_number: e.target.value})}
                className="w-full p-2 text-sm border rounded"
              />
              <input
                type="text" required placeholder="IFSC Code"
                value={bankDetails.ifsc}
                onChange={e => setBankDetails({...bankDetails, ifsc: e.target.value})}
                className="w-full p-2 text-sm border rounded"
              />
              <input
                type="text" required placeholder="Bank Name"
                value={bankDetails.bank_name}
                onChange={e => setBankDetails({...bankDetails, bank_name: e.target.value})}
                className="w-full p-2 text-sm border rounded"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={redeemMutation.isPending} className="flex-1 bg-black text-white p-2 rounded text-sm font-bold">
                  {redeemMutation.isPending ? "Submitting..." : "Submit"}
                </button>
                <button type="button" onClick={() => setShowRedeemForm(false)} className="flex-1 bg-gray-100 p-2 rounded text-sm font-bold">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Refer & Earn */}
        <div className="bg-[#FDF8EE] border border-[#E8D5A0] rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">Refer & Earn</h2>
          <p className="text-sm text-gray-700 mb-6">
            Get <strong className="text-[#D4AF37]">â—Ž500</strong> for every friend who subscribes to a paid plan. They get â—Ž500 too!
          </p>

          <div className="mb-4">
            <div className="text-xs font-bold text-gray-500 mb-1">YOUR REFERRAL CODE</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white border border-[#E8D5A0] p-3 rounded-lg text-lg font-bold text-center">
                {referralCode}
              </code>
            </div>
          </div>

          <button
            onClick={copyLink}
            className="w-full py-3 bg-[#D4AF37] hover:bg-[#B8942E] text-white rounded-xl font-bold text-sm transition-colors"
          >
            Copy Referral Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          ["Lifetime earned", lifetimeEarned.toLocaleString()],
          ["Cash redeemed", `?${cashRedeemed.toLocaleString()}`],
          ["Active referrals", activeReferrals.toLocaleString()],
          ["Cash unlock", `${redemptionMinimum.toLocaleString()} coins`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#e4e1d6] bg-white p-4">
            <p className="text-[11px] text-[#8a897f]">{label}</p>
            <p className="mt-1 text-lg font-bold text-[#1a1a1e]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        {/* Ledger History */}
        <div>
          <h2 className="text-lg font-black mb-4">Transaction History</h2>
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            {ledger.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No transactions yet.</div>
            ) : (
              <div className="divide-y">
                {ledger.map((entry: any) => (
                  <div key={entry.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-gray-800">
                        {entry.reason.replace(/_/g, " ").toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`font-black ${entry.delta > 0 ? "text-green-600" : "text-gray-800"}`}>
                      {entry.delta > 0 ? "+" : ""}{entry.delta}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Referrals List */}
        <div>
          <h2 className="text-lg font-black mb-4">Your Referrals</h2>
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            {referrals.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">You haven't referred anyone yet.</div>
            ) : (
              <div className="divide-y">
                {referrals.map((ref: any) => (
                  <div key={ref.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-gray-800">{ref.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(ref.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                        ref.status === "rewarded" ? "bg-green-100 text-green-700" :
                        ref.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {ref.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



