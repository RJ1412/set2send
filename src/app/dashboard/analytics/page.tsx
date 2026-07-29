"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Users, MessageSquare, MousePointerClick } from 'lucide-react';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState(30);

  const { data: currentPlan, isLoading: planLoading } = useQuery({
    queryKey: ["currentPlan"],
    queryFn: () => api.get("/billing/current-plan").then((res) => res.data),
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => api.get("/campaigns").then((res) => res.data),
  });

  const { data: flows, isLoading: flowsLoading } = useQuery({
    queryKey: ["flows"],
    queryFn: () => api.get("/flows").then((res) => res.data),
  });

  const isLoading = planLoading || campaignsLoading || flowsLoading;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">Analytics Overview</h1>
          <p className="mt-2 text-[#1A1A1A]/60 text-sm font-medium">Detailed insights into your automation performance.</p>
        </div>
        <select 
          value={dateRange}
          onChange={e => setDateRange(Number(e.target.value))}
          className="p-2.5 bg-white border border-[#E8E4D9] rounded-xl text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#D4AF37] transition-colors shadow-sm cursor-pointer"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#E8E4D9] border-t-[#D4AF37] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border border-[#E8E4D9] p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:border-[#D4AF37] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#FAF9F6] rounded-lg border border-[#E8E4D9]">
                  <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <span className="text-emerald-600 text-xs font-bold px-2 py-1 bg-emerald-50 rounded-md border border-emerald-100">+12%</span>
              </div>
              <p className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-1">Total DMs Sent</p>
              <h3 className="text-3xl font-black text-[#1A1A1A]">{currentPlan?.dms_used_this_month || 0}</h3>
            </div>

            <div className="bg-white border border-[#E8E4D9] p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:border-[#D4AF37] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#FAF9F6] rounded-lg border border-[#E8E4D9]">
                  <MousePointerClick className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <span className="text-emerald-600 text-xs font-bold px-2 py-1 bg-emerald-50 rounded-md border border-emerald-100">+4.5%</span>
              </div>
              <p className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-1">Open Rate</p>
              <h3 className="text-3xl font-black text-[#1A1A1A]">84.2%</h3>
            </div>

            <div className="bg-white border border-[#E8E4D9] p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:border-[#D4AF37] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#FAF9F6] rounded-lg border border-[#E8E4D9]">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <span className="text-emerald-600 text-xs font-bold px-2 py-1 bg-emerald-50 rounded-md border border-emerald-100">+22%</span>
              </div>
              <p className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-1">Leads Captured</p>
              <h3 className="text-3xl font-black text-[#1A1A1A]">342</h3>
            </div>

            <div className="bg-white border border-[#E8E4D9] p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:border-[#D4AF37] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#FAF9F6] rounded-lg border border-[#E8E4D9]">
                  <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <span className="text-emerald-600 text-xs font-bold px-2 py-1 bg-emerald-50 rounded-md border border-emerald-100">+1.5%</span>
              </div>
              <p className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-1">Conversion Rate</p>
              <h3 className="text-3xl font-black text-[#1A1A1A]">9.5%</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-[#E8E4D9] p-8 rounded-3xl shadow-sm">
              <h2 className="text-lg font-black text-[#1A1A1A] mb-6">Top Performing Campaigns</h2>
              {campaigns?.length === 0 ? (
                <div className="text-[#1A1A1A]/50 text-sm font-medium py-8 text-center">No campaigns data available.</div>
              ) : (
                <ul className="divide-y divide-[#E8E4D9]">
                  {campaigns?.slice(0, 5).map((c: any) => (
                    <li key={c.id} className="py-4 flex justify-between items-center">
                      <span className="font-bold text-[#1A1A1A]">{c.keyword}</span>
                      <span className="text-sm text-[#1A1A1A]/70 font-medium">{c.dms_sent} DMs</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white border border-[#E8E4D9] p-8 rounded-3xl shadow-sm">
              <h2 className="text-lg font-black text-[#1A1A1A] mb-6">Visual Flow Engagement</h2>
              {flows?.length === 0 ? (
                <div className="text-[#1A1A1A]/50 text-sm font-medium py-8 text-center">No visual flows data available.</div>
              ) : (
                <ul className="divide-y divide-[#E8E4D9]">
                  {flows?.slice(0, 5).map((f: any) => (
                    <li key={f.id} className="py-4 flex justify-between items-center">
                      <span className="font-bold text-[#1A1A1A]">{f.name || 'Untitled'}</span>
                      <span className="text-xs px-2 py-1 bg-[#FAF9F6] border border-[#E8E4D9] rounded-md font-bold uppercase tracking-wider text-[#1A1A1A]/70">{f.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
