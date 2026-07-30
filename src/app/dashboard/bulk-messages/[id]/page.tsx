"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "../../../../lib/api";
import { ArrowLeft, MessageCircle, Calendar, Users, RefreshCw } from "lucide-react";

export default function BulkMessageDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["whatsapp-campaign", id],
    queryFn: () => api.get(`/whatsapp/campaigns/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ["whatsapp-campaign-logs", id],
    queryFn: () => api.get(`/whatsapp/campaigns/${id}/logs`).then((res) => res.data),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f3ef]">
        <div className="text-[14px] text-[#888]">Loading campaign details...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f3ef]">
        <h2 className="text-[20px] font-semibold text-[#1a1a18] mb-4">Campaign not found</h2>
        <button 
          onClick={() => router.push("/dashboard/bulk-messages")}
          className="px-4 py-2 bg-white border border-[#d0cdc6] rounded-xl text-sm font-medium text-[#444] hover:bg-[#fafafa]"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f5f3ef]">
      <header className="flex items-center justify-between px-[24px] py-[16px] bg-white border-b border-[#e8e5de]">
        <div className="flex items-center gap-[12px]">
          <button 
            onClick={() => router.push("/dashboard/bulk-messages")}
            className="p-[6px] rounded-full hover:bg-[#f5f3ef] transition-colors"
          >
            <ArrowLeft className="w-[18px] h-[18px] text-[#444]" />
          </button>
          <div>
            <h1 className="text-[16px] font-semibold text-[#1a1a18]">{campaign.name}</h1>
            <p className="text-[12px] text-[#888] mt-[2px] capitalize">{campaign.messageType} Campaign</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-[10px] py-[4px] rounded-[6px] text-[12px] font-medium border ${
          campaign.status === 'completed' ? 'bg-[#f0fdf4] text-[#16a34a] border-[#86efac]' :
          campaign.status === 'running' ? 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]' :
          campaign.status === 'failed' ? 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]' :
          'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]'
        }`}>
          {campaign.status.toUpperCase()}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-[20px] md:px-[24px]">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[24px]">
          <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[20px]">
            <div className="flex items-center gap-[8px] text-[12px] font-medium text-[#888] mb-[8px]">
              <Users className="w-[14px] h-[14px]" /> Total Recipients
            </div>
            <div className="text-[28px] font-semibold text-[#1a1a18]">{campaign.totalRecipients}</div>
          </div>
          <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[20px]">
            <div className="flex items-center gap-[8px] text-[12px] font-medium text-[#888] mb-[8px]">
              <MessageCircle className="w-[14px] h-[14px]" /> Messages Sent
            </div>
            <div className="text-[28px] font-semibold text-[#16a34a]">{campaign.sentCount}</div>
          </div>
          <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[20px]">
            <div className="flex items-center gap-[8px] text-[12px] font-medium text-[#888] mb-[8px]">
              <RefreshCw className="w-[14px] h-[14px]" /> Failed
            </div>
            <div className="text-[28px] font-semibold text-[#dc2626]">{campaign.failedCount}</div>
          </div>
        </div>

        {/* Message Content */}
        <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[20px] mb-[24px]">
          <h2 className="text-[14px] font-semibold text-[#1a1a18] mb-[12px]">Message Content</h2>
          <div className="bg-[#fafaf8] border border-[#e8e5de] rounded-[8px] p-[16px] text-[13px] text-[#444] whitespace-pre-wrap">
            {campaign.messageType === 'template' ? (
              <div>
                <p className="font-medium mb-2">Template: <span className="text-[#2563eb]">{campaign.templateName}</span></p>
                <p className="text-xs text-[#888]">Variables mapped from CSV.</p>
              </div>
            ) : (
              campaign.messageContent || "No message content."
            )}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[20px]">
          <h2 className="text-[14px] font-semibold text-[#1a1a18] mb-[16px]">Delivery Logs</h2>
          
          {logsLoading ? (
            <div className="text-[13px] text-[#888] py-8 text-center">Loading logs...</div>
          ) : logs && logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e8e5de]">
                    <th className="px-[12px] py-[10px] text-[11px] font-semibold text-[#888] uppercase">Phone</th>
                    <th className="px-[12px] py-[10px] text-[11px] font-semibold text-[#888] uppercase">Status</th>
                    <th className="px-[12px] py-[10px] text-[11px] font-semibold text-[#888] uppercase">Details</th>
                    <th className="px-[12px] py-[10px] text-[11px] font-semibold text-[#888] uppercase text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={log.id} className="border-b border-[#f5f3ef] last:border-0 hover:bg-[#fafaf8]">
                      <td className="px-[12px] py-[10px] text-[12px] font-medium text-[#1a1a18]">{log.recipientPhone}</td>
                      <td className="px-[12px] py-[10px]">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          log.status === 'sent' || log.status === 'delivered' || log.status === 'read' ? 'bg-[#f0fdf4] text-[#16a34a]' :
                          'bg-[#fef2f2] text-[#dc2626]'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-[12px] py-[10px] text-[12px] text-[#666] max-w-[200px] truncate">
                        {log.errorMessage || "-"}
                      </td>
                      <td className="px-[12px] py-[10px] text-[11px] text-[#888] text-right">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-[13px] text-[#888] py-8 text-center">No logs available for this campaign yet.</div>
          )}
        </div>

      </div>
    </div>
  );
}
