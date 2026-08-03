"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";
import { MessageCircle, Plus, AlertCircle, Trash2, CheckCircle2 } from "lucide-react";

const InstagramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function AccountsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // State for WhatsApp connection modal
  const [showWaModal, setShowWaModal] = useState(false);
  const [waPhoneId, setWaPhoneId] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [waError, setWaError] = useState("");

  const { data: planStatus, isLoading: planLoading } = useQuery({
    queryKey: ["planStatus"],
    queryFn: () => api.get("/billing/current-plan").then((res) => res.data),
    enabled: !!user,
  });

  const { data: igAccounts, isLoading: igLoading } = useQuery({
    queryKey: ["igAccounts"],
    queryFn: () => api.get("/instagram").then((res) => res.data),
    enabled: !!user,
  });

  const { data: waAccounts, isLoading: waLoading } = useQuery({
    queryKey: ["waAccounts"],
    queryFn: () => api.get("/whatsapp/accounts").then((res) => res.data),
    enabled: !!user,
  });

  const connectWaMutation = useMutation({
    mutationFn: (data: { wa_phone_number_id: string; wa_phone_number: string }) => 
      api.post("/whatsapp/connect", data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waAccounts"] });
      setShowWaModal(false);
      setWaPhoneId("");
      setWaPhone("");
      setWaError("");
    },
    onError: (error: any) => {
      setWaError(error.response?.data?.error || "Failed to connect WhatsApp account");
    }
  });

  const disconnectIgMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/instagram/${id}/disconnect`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["igAccounts"] });
    }
  });

  const disconnectWaMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/whatsapp/${id}/disconnect`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waAccounts"] });
    }
  });

  const handleConnectInstagram = async () => {
    try {
      const { data } = await api.get("/instagram/connect");
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to initiate connection");
    }
  };

  const handleConnectWhatsapp = () => {
    setWaError("");
    setShowWaModal(true);
  };

  const submitWaConnection = () => {
    if (!waPhoneId || !waPhone) {
      setWaError("Both Phone Number ID and Phone Number are required.");
      return;
    }
    connectWaMutation.mutate({ wa_phone_number_id: waPhoneId, wa_phone_number: waPhone });
  };

  if (planLoading || igLoading || waLoading) {
    return <div className="p-8 text-center text-[#888]">Loading accounts...</div>;
  }

  const igLimit = planStatus?.ig_accounts_included || 1;
  const waLimit = planStatus?.wa_accounts_included || 0;

  const igCurrent = igAccounts?.length || 0;
  const waCurrent = waAccounts?.length || 0;

  const igLimitReached = igCurrent >= igLimit;
  const waLimitReached = waCurrent >= waLimit;

  return (
    <div className="flex flex-col h-full bg-[#f5f3ef]">
      <header className="flex items-center justify-between px-[24px] py-[16px] bg-white border-b border-[#e8e5de]">
        <div>
          <h1 className="text-[14px] font-medium text-[#1a1a18]">Connected Accounts</h1>
          <p className="text-[11.5px] text-[#888] mt-[1px]">Manage your Instagram and WhatsApp connections.</p>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-[20px] md:px-[24px] max-w-[900px]">
        
        {/* INSTAGRAM SECTION */}
        <section className="mb-[32px]">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[32px] h-[32px] rounded-[10px] bg-[#fdf2f8] text-[#db2777] flex items-center justify-center">
                <InstagramIcon className="w-[16px] h-[16px]" />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-[#1a1a18]">Instagram Accounts</h2>
                <p className="text-[11px] text-[#888]">Used for Comment-to-DM, Story replies, and Follow-gate.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium text-[#1a1a18]">{igCurrent} / {igLimit} Connected</div>
              <div className="w-[120px] h-[4px] bg-[#e8e5de] rounded-full mt-[4px] overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${igLimitReached ? "bg-[#ea580c]" : "bg-[#db2777]"}`} 
                  style={{ width: `${Math.min(100, (igCurrent / igLimit) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {igAccounts?.map((acc: any) => (
              <div key={acc.id} className="bg-white border border-[#e8e5de] rounded-[12px] p-[16px] flex items-center justify-between">
                <div className="flex items-center gap-[12px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-tr from-[#fd1d1d] to-[#833ab4] flex items-center justify-center text-white font-bold text-[16px]">
                    {acc.ig_username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1a1a18]">@{acc.ig_username}</div>
                    <div className="flex items-center gap-[4px] text-[11px] text-[#16a34a] mt-[2px] font-medium">
                      <CheckCircle2 className="w-[12px] h-[12px]" /> Active
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { if (confirm("Disconnect this account? Automations will stop.")) disconnectIgMutation.mutate(acc.id) }}
                  className="text-[#aaa] hover:text-[#ef4444] p-[8px] rounded-[8px] hover:bg-[#fef2f2] transition-colors"
                >
                  <Trash2 className="w-[16px] h-[16px]" />
                </button>
              </div>
            ))}
            
            <div 
              onClick={igLimitReached ? undefined : handleConnectInstagram}
              className={`border-2 border-dashed rounded-[12px] p-[16px] flex flex-col items-center justify-center min-h-[85px] transition-all
                ${igLimitReached 
                  ? "border-[#e8e5de] bg-[#fafaf8] opacity-60 cursor-not-allowed" 
                  : "border-[#d0cdc6] bg-white hover:border-[#db2777] hover:bg-[#fdf2f8] cursor-pointer"}`}
            >
              {igLimitReached ? (
                <>
                  <AlertCircle className="w-[20px] h-[20px] text-[#ea580c] mb-[6px]" />
                  <div className="text-[12.5px] font-semibold text-[#1a1a18]">Limit Reached</div>
                  <div className="text-[11px] text-[#888] text-center max-w-[200px] mt-[2px]">Upgrade plan or buy add-ons to connect more.</div>
                </>
              ) : (
                <>
                  <Plus className="w-[20px] h-[20px] text-[#db2777] mb-[6px]" />
                  <div className="text-[12.5px] font-semibold text-[#db2777]">Connect Instagram</div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* WHATSAPP SECTION */}
        <section>
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[32px] h-[32px] rounded-[10px] bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center">
                <MessageCircle className="w-[16px] h-[16px]" />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-[#1a1a18]">WhatsApp Accounts</h2>
                <p className="text-[11px] text-[#888]">Used for bulk messaging and post-purchase flows.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium text-[#1a1a18]">{waCurrent} / {waLimit} Connected</div>
              <div className="w-[120px] h-[4px] bg-[#e8e5de] rounded-full mt-[4px] overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${waLimitReached ? "bg-[#ea580c]" : "bg-[#16a34a]"}`} 
                  style={{ width: `${waLimit > 0 ? Math.min(100, (waCurrent / waLimit) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {waAccounts?.map((acc: any) => (
              <div key={acc.id} className="bg-white border border-[#e8e5de] rounded-[12px] p-[16px] flex items-center justify-between">
                <div className="flex items-center gap-[12px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#25d366] flex items-center justify-center text-white font-bold text-[16px]">
                    WA
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1a1a18]">+{acc.wa_phone_number}</div>
                    <div className="flex items-center gap-[4px] text-[11px] text-[#16a34a] mt-[2px] font-medium">
                      <CheckCircle2 className="w-[12px] h-[12px]" /> Active
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { if (confirm("Disconnect this WhatsApp number?")) disconnectWaMutation.mutate(acc.id) }}
                  className="text-[#aaa] hover:text-[#ef4444] p-[8px] rounded-[8px] hover:bg-[#fef2f2] transition-colors"
                >
                  <Trash2 className="w-[16px] h-[16px]" />
                </button>
              </div>
            ))}
            
            <div 
              onClick={waLimitReached ? undefined : handleConnectWhatsapp}
              className={`border-2 border-dashed rounded-[12px] p-[16px] flex flex-col items-center justify-center min-h-[85px] transition-all
                ${waLimitReached 
                  ? "border-[#e8e5de] bg-[#fafaf8] opacity-60 cursor-not-allowed" 
                  : "border-[#d0cdc6] bg-white hover:border-[#16a34a] hover:bg-[#f0fdf4] cursor-pointer"}`}
            >
              {waLimitReached ? (
                <>
                  <AlertCircle className="w-[20px] h-[20px] text-[#ea580c] mb-[6px]" />
                  <div className="text-[12.5px] font-semibold text-[#1a1a18]">Limit Reached</div>
                  <div className="text-[11px] text-[#888] text-center max-w-[200px] mt-[2px]">Upgrade plan or buy add-ons to connect more.</div>
                </>
              ) : (
                <>
                  <Plus className="w-[20px] h-[20px] text-[#16a34a] mb-[6px]" />
                  <div className="text-[12.5px] font-semibold text-[#16a34a]">Connect WhatsApp</div>
                </>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* WHATSAPP CONNECTION MODAL */}
      {showWaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#e8e5de] p-6 w-full max-w-sm relative">
            <button onClick={() => setShowWaModal(false)} className="absolute top-4 right-4 text-[#888] hover:text-[#1a1a18]">✕</button>
            <h3 className="text-[15px] font-bold text-[#1a1a18] mb-2 flex items-center gap-[6px]">
              <MessageCircle className="w-[18px] h-[18px] text-[#16a34a]" /> Connect WhatsApp
            </h3>
            <p className="text-[12px] text-[#6b6560] mb-5">Enter your Meta Cloud API details to link this number.</p>
            
            <div className="flex flex-col gap-[12px] mb-[20px]">
              <div>
                <label className="block text-[11px] font-medium text-[#888] mb-[4px] uppercase tracking-[0.5px]">Phone Number ID</label>
                <input 
                  type="text" 
                  value={waPhoneId}
                  onChange={(e) => setWaPhoneId(e.target.value)}
                  placeholder="e.g. 102345678901234"
                  className="w-full px-[12px] py-[8px] border border-[#d0cdc6] rounded-[8px] text-[13px] outline-none focus:border-[#16a34a]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#888] mb-[4px] uppercase tracking-[0.5px]">Phone Number (with country code)</label>
                <input 
                  type="text" 
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 919876543210"
                  className="w-full px-[12px] py-[8px] border border-[#d0cdc6] rounded-[8px] text-[13px] outline-none focus:border-[#16a34a]"
                />
              </div>
            </div>
            
            {waError && <div className="p-[10px] bg-[#fef2f2] border border-[#fca5a5] rounded-[8px] text-[12px] text-[#ef4444] font-medium mb-[16px]">{waError}</div>}
            
            <button 
              onClick={submitWaConnection}
              disabled={connectWaMutation.isPending}
              className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-[10px] rounded-[8px] text-[13px] transition-colors disabled:opacity-50"
            >
              {connectWaMutation.isPending ? "Connecting..." : "Connect Account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
