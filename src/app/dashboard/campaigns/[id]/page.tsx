"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, MessageCircle, Clock, Activity, CheckCircle2, XCircle, Trash2, Download } from "lucide-react";

export default function CampaignDetails() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => api.get(`/campaigns/${id}`).then((res) => res.data),
  });

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ["campaignLogs", id],
    queryFn: () => api.get(`/campaigns/${id}/logs`).then((res) => res.data),
    refetchInterval: 5000, 
  });

  const { data: emails } = useQuery({
    queryKey: ["campaignEmails", id],
    queryFn: () => api.get(`/campaigns/${id}/emails`).then((res) => res.data),
    enabled: !!campaign?.collect_email,
  });

  const downloadCSV = () => {
    if (!emails || emails.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Username,Email\n"
      + emails.map((e: any) => `${new Date(e.created_at).toISOString()},${e.commenter_username},${e.email}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `emails_${campaign.keyword}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/campaigns/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      router.push("/dashboard");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  if (campaignLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 bg-[#FAF9F6]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Loading campaign details...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12 text-gray-500 bg-[#FAF9F6] min-h-screen">
        Campaign not found.
        <br />
        <button onClick={() => router.push("/dashboard")} className="text-purple-400 hover:underline mt-4 inline-block font-semibold">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] min-h-screen font-sans relative overflow-x-hidden pt-8 px-6">
      <div className="max-w-5xl mx-auto space-y-8 pb-12 relative z-10">
        <button onClick={() => router.push('/dashboard')} className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              Campaign Details
              <span className={`text-xs font-bold px-3 py-1 rounded-full border tracking-wide uppercase ${campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-gray-500 border-zinc-500/20'}`}>
                {campaign.status}
              </span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Trigger Keyword: <span className="text-purple-400 font-mono font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{campaign.keyword}</span></p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-gray-200 shadow-xl backdrop-blur-md">
            <div className="text-center px-2">
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{campaign.dms_sent}</p>
              <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Total DMs Sent</p>
            </div>
            <div className="w-px h-10 bg-gray-100"></div>
            <div className="text-center px-2">
              <p className="text-xl font-bold text-white">{campaign.ig_media_id === "ALL_POSTS" ? "All Posts" : "Specific Post"}</p>
              <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Target</p>
            </div>
            {campaign.require_follow && (
              <>
                <div className="w-px h-10 bg-gray-100"></div>
                <div className="text-center px-2">
                  <p className="text-xl font-bold text-white">{campaign.follow_gate_count || 0}</p>
                  <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">New Followers</p>
                </div>
              </>
            )}
            {campaign.follow_up_time_hours && (
              <>
                <div className="w-px h-10 bg-gray-100"></div>
                <div className="text-center px-2">
                  <p className="text-xl font-bold text-white">{campaign.follow_ups_sent || 0}</p>
                  <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Follow-ups</p>
                </div>
              </>
            )}
            <div className="w-px h-10 bg-gray-100"></div>
            <div className="text-center flex justify-center px-2">
               <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="text-red-400 hover:text-red-300 transition-colors p-2.5 rounded-xl hover:bg-red-500/10 disabled:opacity-50 cursor-pointer"
                  title="Delete Campaign"
               >
                  <Trash2 className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/40 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>
              <h3 className="text-lg font-black text-white mb-4">DM Template</h3>
              <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 leading-relaxed font-mono whitespace-pre-wrap">
                {campaign.dm_template}
              </div>
              
              <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Match Type</span>
                  <span className="text-gray-600 font-bold">{campaign.fuzzy_match ? "Fuzzy Match" : "Exact Match"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Created At</span>
                  <span className="text-gray-600 font-bold">{new Date(campaign.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {campaign.collect_email && (
              <div className="bg-white/40 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
                 <h3 className="text-lg font-black text-white mb-4 flex items-center justify-between">
                   Collected Emails
                   <button onClick={downloadCSV} className="text-[10px] font-mono font-bold uppercase tracking-wider bg-gray-100 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition cursor-pointer">
                     <Download className="w-3 h-3" /> Export
                   </button>
                 </h3>
                 <div className="text-4xl font-black text-purple-400 mb-2">{emails?.length || 0}</div>
                 <p className="text-xs text-gray-400 font-medium">Emails captured in DM replies.</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/40 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/40">
                <h3 className="text-lg font-black text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-pink-400" /> Recent Activity Log
                </h3>
              </div>
              <div className="p-0">
                {logsLoading ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <span className="text-gray-500 text-sm font-medium">Loading activity...</span>
                  </div>
                ) : !logs || logs.length === 0 ? (
                  <div className="p-16 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8 text-zinc-600" />
                    </div>
                    <p className="text-white font-bold text-lg">No activity yet</p>
                    <p className="text-gray-400 text-sm mt-1 max-w-sm">When someone comments, you'll see the logs here in real-time.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-zinc-800/50 max-h-[600px] overflow-y-auto">
                    {logs.map((log: any) => (
                      <li key={log.id} className="p-6 hover:bg-gray-100/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              log.dm_status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' : 
                              log.dm_status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {log.dm_status === 'sent' ? <CheckCircle2 className="w-4 h-4" /> : 
                               log.dm_status === 'failed' ? <XCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">@{log.commenter_username}</span> commented:
                              </p>
                              <p className="text-sm text-gray-500 mt-1 italic">"{log.comment_text}"</p>
                              {log.error_message && (
                                <p className="text-[10px] font-mono text-red-400 mt-2 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 inline-block font-bold">
                                  Error: {log.error_message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 font-mono font-bold whitespace-nowrap">
                            {new Date(log.commented_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
