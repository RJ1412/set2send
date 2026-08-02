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
    <div style={{ fontFamily: "var(--font-sans)", background: "#F4F1EA", borderRadius: "12px", overflow: "hidden", display: "flex", minHeight: "700px" }}>
      <h2 className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Redesigned S2S coins wallet page with balance, stats, ways to earn, redemption tiers, transactions and referrals</h2>

      <div style={{ flex: 1, padding: "28px 32px", minWidth: 0, overflowY: "auto" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26px", fontWeight: 700, color: "#1A1A1E", margin: "0 0 20px" }}>S2S coins wallet</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "16px", marginBottom: "16px" }}>

          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #E4E1D6", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "0.05em", color: "#8A897F", marginBottom: "10px" }}>YOUR BALANCE</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "32px", fontWeight: 500, color: "#1A1A1E" }}>{balance.toLocaleString()} <span style={{ fontSize: "14px", color: "#8A897F", fontWeight: 400 }}>coins</span></div>
              </div>
              <div style={{ position: "relative", width: "64px", height: "64px" }}>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="27" fill="none" stroke="#EFEBDD" strokeWidth="6" />
                  <circle cx="32" cy="32" r="27" fill="none" stroke="#D4A72C" strokeWidth="6" strokeDasharray="169.6" strokeDashoffset={`${169.6 - (169.6 * Math.min(100, (balance / redemptionMinimum) * 100)) / 100}`} strokeLinecap="round" transform="rotate(-90 32 32)" />
                </svg>
                <i className="ti ti-coin" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "20px", color: "#D4A72C" }} aria-hidden="true"></i>
              </div>
            </div>
            <div style={{ margin: "16px 0 6px", height: "6px", background: "#EFEBDD", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${Math.min(100, (balance / redemptionMinimum) * 100)}%`, height: "100%", background: "#D4A72C" }}></div>
            </div>
            <div style={{ fontSize: "12.5px", color: "#8A897F", marginBottom: "16px" }}>
              {redemptionMinimum - balance > 0
                ? `${(redemptionMinimum - balance).toLocaleString()} more coins to unlock cash redemption`
                : "You are eligible for cash redemption!"}
            </div>
            
            {!showRedeemForm ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => setShowRedeemForm(true)}
                  disabled={!canRedeem}
                  style={{ flex: 1, background: canRedeem ? "#1A1A1E" : "#EDEAE0", color: canRedeem ? "#fff" : "#9C9B90", border: "none", borderRadius: "8px", padding: "10px", fontSize: "13.5px", fontWeight: 500, cursor: canRedeem ? "pointer" : "not-allowed" }}
                >
                  Redeem as cash
                </button>
              </div>
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
                  <button type="button" onClick={() => setShowRedeemForm(false)} className="flex-1 bg-gray-100 p-2 rounded text-sm font-bold text-black">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div style={{ background: "#FBF3DF", borderRadius: "12px", border: "0.5px solid #EAD9A8", padding: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.05em", color: "#8A7A3E", marginBottom: "8px" }}>REFER AND EARN</div>
            <div style={{ fontSize: "13.5px", color: "#5A4E24", lineHeight: 1.5, marginBottom: "14px" }}>Get <span style={{ color: "#B8860B", fontWeight: 500 }}>100 coins</span> for every friend who subscribes to a paid plan. They get 100 too.</div>
            <div style={{ fontSize: "11px", letterSpacing: "0.05em", color: "#8A7A3E", marginBottom: "6px" }}>YOUR REFERRAL CODE</div>
            <div style={{ background: "#fff", border: "0.5px solid #EAD9A8", borderRadius: "8px", padding: "10px", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "15px", fontWeight: 500, color: "#1A1A1E", marginBottom: "10px" }}>{referralCode}</div>
            <button onClick={copyLink} style={{ width: "100%", background: "#D4A72C", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "13.5px", fontWeight: 500, cursor: "pointer" }}><i className="ti ti-copy" style={{ fontSize: "14px", verticalAlign: "-2px", marginRight: "5px" }} aria-hidden="true"></i>Copy referral link</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "12px", marginBottom: "16px" }}>
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #E4E1D6", padding: "14px 16px" }}>
            <div style={{ fontSize: "12px", color: "#8A897F", marginBottom: "6px" }}>Lifetime earned</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "19px", fontWeight: 500, color: "#1A1A1E" }}>{lifetimeEarned.toLocaleString()}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #E4E1D6", padding: "14px 16px" }}>
            <div style={{ fontSize: "12px", color: "#8A897F", marginBottom: "6px" }}>Cash redeemed</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "19px", fontWeight: 500, color: "#1A1A1E" }}>₹{cashRedeemed.toLocaleString()}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #E4E1D6", padding: "14px 16px" }}>
            <div style={{ fontSize: "12px", color: "#8A897F", marginBottom: "6px" }}>Active referrals</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "19px", fontWeight: 500, color: "#1A1A1E" }}>{activeReferrals.toLocaleString()}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #E4E1D6", padding: "14px 16px" }}>
            <div style={{ fontSize: "12px", color: "#8A897F", marginBottom: "6px" }}>Next reward at</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "19px", fontWeight: 500, color: "#1A1A1E" }}>{redemptionMinimum.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #E4E1D6", padding: "18px 20px", marginBottom: "16px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 700, color: "#1A1A1E", marginBottom: "14px" }}>Ways to earn coins</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "12px" }}>
            <div style={{ border: "0.5px solid #E4E1D6", borderRadius: "10px", padding: "12px" }}>
              <i className="ti ti-user-plus" style={{ fontSize: "18px", color: "#D4A72C" }} aria-hidden="true"></i>
              <div style={{ fontSize: "12.5px", color: "#1A1A1E", margin: "8px 0 2px" }}>Refer a friend</div>
              <div style={{ fontSize: "12px", color: "#8A897F" }}>+100 coins</div>
            </div>
            <div style={{ border: "0.5px solid #E4E1D6", borderRadius: "10px", padding: "12px" }}>
              <i className="ti ti-speakerphone" style={{ fontSize: "18px", color: "#D4A72C" }} aria-hidden="true"></i>
              <div style={{ fontSize: "12.5px", color: "#1A1A1E", margin: "8px 0 2px" }}>First campaign live</div>
              <div style={{ fontSize: "12px", color: "#8A897F" }}>+50 coins</div>
            </div>
            <div style={{ border: "0.5px solid #E4E1D6", borderRadius: "10px", padding: "12px" }}>
              <i className="ti ti-git-branch" style={{ fontSize: "18px", color: "#D4A72C" }} aria-hidden="true"></i>
              <div style={{ fontSize: "12.5px", color: "#1A1A1E", margin: "8px 0 2px" }}>Build a visual flow</div>
              <div style={{ fontSize: "12px", color: "#8A897F" }}>+75 coins</div>
            </div>
            <div style={{ border: "0.5px solid #E4E1D6", borderRadius: "10px", padding: "12px" }}>
              <i className="ti ti-calendar-check" style={{ fontSize: "18px", color: "#D4A72C" }} aria-hidden="true"></i>
              <div style={{ fontSize: "12.5px", color: "#1A1A1E", margin: "8px 0 2px" }}>Stay active monthly</div>
              <div style={{ fontSize: "12px", color: "#8A897F" }}>+25 coins</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #E4E1D6", padding: "18px 20px", marginBottom: "16px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 700, color: "#1A1A1E", marginBottom: "16px" }}>Redemption tiers</div>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#D4A72C" }}></div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#1A1A1E", marginTop: "8px" }}>1,000</div>
              <div style={{ fontSize: "11px", color: "#8A897F" }}>Cash unlock</div>
            </div>
            <div style={{ height: "2px", background: "#EFEBDD", flex: 1, marginBottom: "32px" }}></div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#EFEBDD", border: "2px solid #D4A72C" }}></div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#1A1A1E", marginTop: "8px" }}>2,500</div>
              <div style={{ fontSize: "11px", color: "#8A897F" }}>Priority support</div>
            </div>
            <div style={{ height: "2px", background: "#EFEBDD", flex: 1, marginBottom: "32px" }}></div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#EFEBDD", border: "2px solid #D4A72C" }}></div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#1A1A1E", marginTop: "8px" }}>5,000</div>
              <div style={{ fontSize: "11px", color: "#8A897F" }}>1 month free</div>
            </div>
            <div style={{ height: "2px", background: "#EFEBDD", flex: 1, marginBottom: "32px" }}></div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#EFEBDD", border: "2px solid #D4A72C" }}></div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#1A1A1E", marginTop: "8px" }}>10,000</div>
              <div style={{ fontSize: "11px", color: "#8A897F" }}>Premium badge</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #E4E1D6", padding: "20px" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 700, color: "#1A1A1E", marginBottom: "14px" }}>Transaction history</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", textAlign: "center" }}>
              {ledger.length === 0 ? (
                <>
                  <i className="ti ti-receipt" style={{ fontSize: "26px", color: "#C9C6B8" }} aria-hidden="true"></i>
                  <div style={{ fontSize: "13.5px", color: "#1A1A1E", marginTop: "10px" }}>No transactions yet</div>
                  <div style={{ fontSize: "12px", color: "#8A897F", marginTop: "3px", maxWidth: "220px" }}>Coin activity from referrals and rewards will show up here.</div>
                </>
              ) : (
                <div style={{ width: "100%", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {ledger.slice(0, 5).map((entry: any) => (
                    <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 500 }}>{entry.reason.replace(/_/g, " ").toUpperCase()}</div>
                        <div style={{ fontSize: "11px", color: "#8A897F" }}>{new Date(entry.created_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: entry.delta > 0 ? "#2A7D4F" : "#1A1A1E" }}>
                        {entry.delta > 0 ? "+" : ""}{entry.delta}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: "12px", border: "0.5px solid #E4E1D6", padding: "20px" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 700, color: "#1A1A1E", marginBottom: "14px" }}>Your referrals</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", textAlign: "center" }}>
              {referrals.length === 0 ? (
                <>
                  <i className="ti ti-users-group" style={{ fontSize: "26px", color: "#C9C6B8" }} aria-hidden="true"></i>
                  <div style={{ fontSize: "13.5px", color: "#1A1A1E", marginTop: "10px" }}>You haven't referred anyone yet</div>
                  <button onClick={copyLink} style={{ marginTop: "12px", background: "#1A1A1E", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12.5px", fontWeight: 500, cursor: "pointer" }}>Invite a friend ↗</button>
                </>
              ) : (
                <div style={{ width: "100%", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {referrals.slice(0, 5).map((ref: any) => (
                    <div key={ref.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 500 }}>{ref.name || ref.id}</div>
                        <div style={{ fontSize: "11px", color: "#8A897F" }}>{new Date(ref.created_at || ref.date).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: "10px", padding: "4px 8px", borderRadius: "12px", background: ref.status === "rewarded" ? "#EEF8F3" : "#F8F4EE", color: ref.status === "rewarded" ? "#2A7D4F" : "#D4A72C", fontWeight: 600, textTransform: "uppercase" }}>
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
    </div>
  );
}
