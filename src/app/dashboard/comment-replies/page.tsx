"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { MessageSquare, Plus, Play, Square, MoreVertical, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function CommentRepliesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => api.get("/campaigns").then((res) => res.data),
  });

  const toggleStatus = useMutation({
    mutationFn: (data: { id: string; status: string }) => 
      api.patch(`/campaigns/${data.id}`, { status: data.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });

  const filteredCampaigns = campaigns?.filter((c: any) => 
    c.trigger_type === 'comment' &&
    c.keyword.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f5f3ef]">
      <header className="flex items-center justify-between px-[24px] py-[16px] bg-white border-b border-[#e8e5de]">
        <div>
          <h1 className="text-[14px] font-medium text-[#1a1a18]">Comment Auto-replies</h1>
          <p className="text-[11.5px] text-[#888] mt-[1px]">Automatically DM followers when they comment on your posts.</p>
        </div>
        <Link 
          href="/dashboard/campaigns/new?type=comment"
          className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[8px] text-[12px] font-medium bg-[#8b5cf6] text-white hover:bg-[#7c3aed] transition-colors"
        >
          <Plus className="w-[14px] h-[14px]" /> New Auto-reply
        </Link>
      </header>
      
      <div className="flex-1 overflow-y-auto p-[20px] md:px-[24px]">
        <div className="bg-white rounded-[12px] border border-[#e8e5de] overflow-hidden flex flex-col">
          
          <div className="px-[20px] py-[14px] border-b border-[#e8e5de] flex items-center justify-between bg-[#fafaf8]">
             <div className="relative w-full max-w-[280px]">
               <Search className="w-[14px] h-[14px] absolute left-[12px] top-1/2 -translate-y-1/2 text-[#aaa]" />
               <input 
                 type="text" 
                 placeholder="Search by keyword..." 
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
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Trigger Keyword</th>
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Match Type</th>
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Status</th>
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">DMs Sent</th>
                  <th className="px-[20px] py-[12px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-[20px] py-[40px] text-center text-[13px] text-[#888]">Loading auto-replies...</td>
                  </tr>
                ) : filteredCampaigns?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-[20px] py-[40px] text-center text-[13px] text-[#888]">
                      No comment replies found. <Link href="/dashboard/campaigns/new?type=comment" className="text-[#8b5cf6] hover:underline">Create one</Link>.
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
                          <div className="w-[32px] h-[32px] rounded-[8px] bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center">
                            <MessageSquare className="w-[14px] h-[14px]" />
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-[#1a1a18]">
                              "{campaign.keyword}"
                            </div>
                            <div className="text-[11px] text-[#aaa] mt-[2px] truncate max-w-[200px]">
                              {campaign.dm_template}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-[20px] py-[14px]">
                        <span className="text-[12px] text-[#666]">
                          {campaign.fuzzy_match ? 'Fuzzy (Contains)' : 'Exact match'}
                        </span>
                      </td>
                      <td className="px-[20px] py-[14px]">
                        <button 
                          onClick={() => toggleStatus.mutate({ id: campaign.id, status: campaign.status === 'active' ? 'paused' : 'active' })}
                          className={`inline-flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] text-[11px] font-semibold transition-colors ${
                            campaign.status === 'active' 
                            ? 'bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] hover:bg-[#dbeafe]' 
                            : 'bg-[#f3f4f6] text-[#4b5563] border border-[#e5e7eb] hover:bg-[#e5e7eb]'
                          }`}
                        >
                          {campaign.status === 'active' ? <Play className="w-[10px] h-[10px]" /> : <Square className="w-[10px] h-[10px]" />}
                          {campaign.status === 'active' ? 'Active' : 'Paused'}
                        </button>
                      </td>
                      <td className="px-[20px] py-[14px] text-[13px] font-medium text-[#1a1a18]">
                        {campaign.dms_sent}
                      </td>
                      <td className="px-[20px] py-[14px] text-right">
                        <Link href={`/dashboard/campaigns/${campaign.id}`} className="p-[6px] text-[#888] hover:text-[#1a1a18] hover:bg-[#e8e5de] rounded-[6px] transition-colors inline-block">
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
