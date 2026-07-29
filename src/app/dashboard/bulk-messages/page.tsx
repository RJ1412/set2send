"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { MessageCircle, Plus, Search, MoreVertical, Play, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function BulkMessagesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["whatsapp-campaigns"],
    queryFn: () => api.get("/whatsapp/campaigns").then((res) => res.data),
  });

  const sendCampaign = useMutation({
    mutationFn: (id: string) => api.post(`/whatsapp/campaigns/${id}/send`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-campaigns"] });
      alert("Campaign dispatch started!");
    },
  });

  const filteredCampaigns = campaigns?.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f3ef]">
      <header className="flex items-center justify-between px-[24px] py-[16px] bg-white border-b border-[#e8e5de]">
        <div>
          <h1 className="text-[14px] font-medium text-[#1a1a18]">WhatsApp Bulk Messages</h1>
          <p className="text-[11.5px] text-[#888] mt-[1px]">Send template or freeform messages to your CSV contacts.</p>
        </div>
        <Link 
          href="/dashboard/bulk-messages/new"
          className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[8px] text-[12px] font-medium bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors"
        >
          <Plus className="w-[14px] h-[14px]" /> New Broadcast
        </Link>
      </header>
      
      <div className="flex-1 overflow-y-auto p-[20px] md:px-[24px]">
        <div className="bg-white rounded-[12px] border border-[#e8e5de] overflow-hidden flex flex-col">
          
          <div className="px-[20px] py-[14px] border-b border-[#e8e5de] flex items-center justify-between bg-[#fafaf8]">
             <div className="relative w-full max-w-[280px]">
               <Search className="w-[14px] h-[14px] absolute left-[12px] top-1/2 -translate-y-1/2 text-[#aaa]" />
               <input 
                 type="text" 
                 placeholder="Search broadcasts..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-[34px] pr-[12px] py-[8px] rounded-[8px] border border-[#d0cdc6] text-[12px] bg-white outline-none focus:border-[#8b5cf6] transition-colors"
               />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e8e5de]">
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Campaign Name</th>
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Type</th>
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Status</th>
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Progress</th>
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Date</th>
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-[20px] py-[40px] text-center text-[13px] text-[#888]">Loading broadcasts...</td>
                  </tr>
                ) : filteredCampaigns?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-[20px] py-[40px] text-center text-[13px] text-[#888]">
                      No broadcasts found. <Link href="/dashboard/bulk-messages/new" className="text-[#16a34a] hover:underline">Create a new broadcast</Link>.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns?.map((campaign: any, index: number) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={campaign.id} 
                      className="border-b border-[#f5f3ef] hover:bg-[#fafaf8] transition-colors"
                    >
                      <td className="px-[20px] py-[14px]">
                        <div className="flex items-center gap-[10px]">
                          <div className="w-[32px] h-[32px] rounded-[8px] bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center">
                            <MessageCircle className="w-[14px] h-[14px]" />
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-[#1a1a18]">
                              {campaign.name}
                            </div>
                            <div className="text-[11px] text-[#aaa] mt-[2px]">
                              {campaign.totalRecipients} recipients
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-[20px] py-[14px]">
                        <span className="text-[12px] text-[#666] capitalize">
                          {campaign.messageType}
                        </span>
                      </td>
                      <td className="px-[20px] py-[14px]">
                        <span className={`inline-flex items-center px-[8px] py-[3px] rounded-[6px] text-[11px] font-medium border ${
                          campaign.status === 'completed' ? 'bg-[#f0fdf4] text-[#16a34a] border-[#86efac]' :
                          campaign.status === 'running' ? 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]' :
                          campaign.status === 'failed' ? 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]' :
                          'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]'
                        }`}>
                          {campaign.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-[20px] py-[14px]">
                        <div className="text-[12px] font-medium text-[#1a1a18]">
                          {campaign.sentCount} / {campaign.totalRecipients} sent
                        </div>
                        {campaign.failedCount > 0 && (
                          <div className="text-[11px] text-[#dc2626] mt-[2px]">
                            {campaign.failedCount} failed
                          </div>
                        )}
                      </td>
                      <td className="px-[20px] py-[14px] text-[12px] text-[#888]">
                        <div className="flex items-center gap-[4px]">
                          <Calendar className="w-[12px] h-[12px]" />
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-[20px] py-[14px] text-right">
                        {campaign.status === 'draft' && (
                          <button 
                            onClick={() => sendCampaign.mutate(campaign.id)}
                            className="p-[6px] text-[#2563eb] hover:bg-[#eff6ff] rounded-[6px] transition-colors inline-block mr-[8px]"
                            title="Send Campaign"
                          >
                            <Play className="w-[14px] h-[14px]" />
                          </button>
                        )}
                        <Link href={`/dashboard/bulk-messages/${campaign.id}`} className="p-[6px] text-[#888] hover:text-[#1a1a18] hover:bg-[#e8e5de] rounded-[6px] transition-colors inline-block">
                          <MoreVertical className="w-[14px] h-[14px]" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
