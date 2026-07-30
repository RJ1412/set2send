"use client";

import { useState } from "react";
import { Download, Filter, Search, UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";

export default function ContactsCRMPage() {
  const [search, setSearch] = useState("");

  const { data: contactsData, isLoading: loading } = useQuery({
    queryKey: ["crm-leads"],
    queryFn: () => api.get("/crm/leads").then((res) => res.data),
  });

  const contacts = Array.isArray(contactsData) ? contactsData : [];
  
  const filteredContacts = contacts.filter((c: any) => 
    c.username?.toLowerCase().includes(search.toLowerCase()) ||
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">Contacts CRM</h1>
          <p className="mt-2 text-sm text-[#1A1A1A]/60 font-medium">Manage your leads, tags, and engagement scores.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-[#E8E4D9] rounded-xl hover:bg-[#FAF9F6] transition-colors flex items-center gap-2 text-sm font-bold text-[#1A1A1A] shadow-sm">
            <Download size={16} className="text-[#D4AF37]" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E8E4D9] shadow-sm rounded-3xl overflow-hidden flex flex-col">
        
        <div className="p-5 border-b border-[#E8E4D9] flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-[#FAF9F6]">
          <button className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#E8E4D9] rounded-xl text-xs font-bold hover:bg-[#FAF9F6] text-[#1A1A1A] transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Filter size={14} /> Add Filter
          </button>
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
            <input 
              type="text" 
              placeholder="Search contacts by username..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E4D9] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#1A1A1A]/30 shadow-sm" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1A1A1A]/70">
            <thead className="bg-[#FAF9F6] text-[#1A1A1A]/50 text-[10px] uppercase tracking-wider font-mono border-b border-[#E8E4D9]">
              <tr>
                <th className="p-5 font-bold w-12 text-center">
                  <input type="checkbox" className="rounded border-[#E8E4D9] bg-white text-[#D4AF37] focus:ring-[#D4AF37]/50 cursor-pointer w-4 h-4 accent-[#D4AF37]" />
                </th>
                <th className="p-5 font-bold">Username</th>
                <th className="p-5 font-bold">Source</th>
                <th className="p-5 font-bold">Tags</th>
                <th className="p-5 font-bold">Score</th>
                <th className="p-5 font-bold">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4D9]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#1A1A1A]/50 font-medium">
                    Loading contacts...
                  </td>
                </tr>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((c: any) => (
                  <tr key={c.id} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer group">
                    <td className="p-5 text-center">
                      <input type="checkbox" className="rounded border-[#E8E4D9] bg-white text-[#D4AF37] focus:ring-[#D4AF37]/50 cursor-pointer w-4 h-4 accent-[#D4AF37]" />
                    </td>
                    <td className="p-5 font-bold text-[#1A1A1A] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#E8E4D9] flex items-center justify-center text-[#D4AF37] shrink-0">
                        <UserCheck size={14} />
                      </div>
                      @{c.username || c.name || "user"}
                    </td>
                    <td className="p-5 font-medium text-[#1A1A1A]/70">{c.source || "Unknown"}</td>
                    <td className="p-5 flex flex-wrap gap-2">
                      {c.tags?.map((t: any) => (
                        <span key={t.id || t} className="px-2.5 py-1 bg-[#FAF9F6] text-[#1A1A1A] border border-[#E8E4D9] rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
                          {t.name || t}
                        </span>
                      ))}
                      {(!c.tags || c.tags.length === 0) && (
                        <span className="text-xs text-[#1A1A1A]/30">No tags</span>
                      )}
                    </td>
                    <td className="p-5 text-emerald-600 font-black font-mono">{c.score || 0}</td>
                    <td className="p-5 text-[#1A1A1A]/50 font-medium text-xs">
                      {c.last_active ? new Date(c.last_active).toLocaleDateString() : (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#1A1A1A]/50 font-medium">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
