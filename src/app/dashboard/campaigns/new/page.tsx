"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ChevronLeft, Check, Sparkles, MessageSquare, AtSign, Settings2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateCampaign() {
  const [keyword, setKeyword] = useState("");
  const [triggerType, setTriggerType] = useState("comment"); // comment, story_mention, story_reply
  const [dmTemplate, setDmTemplate] = useState("Hi! Here is the link you requested: {{link}}");
  const [publicReplyEnabled, setPublicReplyEnabled] = useState(false);
  const [publicReplyText, setPublicReplyText] = useState("Check your DMs! 📩");
  const [fuzzyMatch, setFuzzyMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState("all");
  const [postUrl, setPostUrl] = useState("");
  
  // Attachments
  const [attachmentType, setAttachmentType] = useState("none");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  
  // Advanced Features
  const [requireFollow, setRequireFollow] = useState(false);
  const [followMessage, setFollowMessage] = useState("Hey! Follow me first and I'll send you the link.");
  
  const [collectEmail, setCollectEmail] = useState(false);
  const [emailPromptMessage, setEmailPromptMessage] = useState("Want me to send you more resources like this? Drop your email!");
  
  const [followUpEnabled, setFollowUpEnabled] = useState(false);
  const [followUpMessage, setFollowUpMessage] = useState("Hey! Just checking — did you get a chance to look at the link?");
  const [followUpTime, setFollowUpTime] = useState(24);
  
  const [retriggerMode, setRetriggerMode] = useState("never");
  const [retriggerDays, setRetriggerDays] = useState(7);
  const [returningDmTemplate, setReturningDmTemplate] = useState("Welcome back! Here is the link again: {{link}}");

  const [limitEnabled, setLimitEnabled] = useState(false);
  const [limitCount, setLimitCount] = useState(100);
  const [limitReachedMessage, setLimitReachedMessage] = useState("Sorry! This offer is now closed. Follow us for the next drop.");

  const router = useRouter();

  const extractMediaId = (url: string) => {
    if (!url) return "ALL_POSTS";
    if (!url.includes("instagram.com")) return url.trim(); 
    
    // Check for story URL
    const storyMatch = url.match(/\/stories\/[^\/]+\/([^\/\?]+)/);
    if (storyMatch) return storyMatch[1];

    // Check for post/reel URL
    const postMatch = url.match(/\/p\/([^\/\?]+)/) || url.match(/\/reel\/([^\/\?]+)/);
    return postMatch ? postMatch[1] : url; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const accountsRes = await api.get("/instagram");
      const accounts = accountsRes.data;
      
      if (!accounts || accounts.length === 0) {
        alert("Please connect an Instagram account on the Dashboard first!");
        setLoading(false);
        return;
      }
      
      const instagram_account_id = accounts[0].id;
      
      await api.post("/campaigns", {
        instagram_account_id,
        trigger_type: triggerType,
        keyword: triggerType === "story_mention" ? "STORY_MENTION" : keyword,
        fuzzy_match: fuzzyMatch,
        dm_template: dmTemplate,
        public_reply_enabled: publicReplyEnabled,
        public_reply_text: publicReplyEnabled ? publicReplyText : null,
        ig_media_id: (triggerType === "story_mention" || triggerType === "story_reply" || postType === "all") ? "ALL_POSTS" : extractMediaId(postUrl),
        ig_media_url: postType === "all" ? "" : postUrl,
        require_follow: requireFollow,
        follow_message: requireFollow ? followMessage : null,
        collect_email: collectEmail,
        email_prompt_message: collectEmail ? emailPromptMessage : null,
        follow_up_message: followUpEnabled ? followUpMessage : null,
        follow_up_time_hours: followUpEnabled ? followUpTime : null,
        retrigger_mode: retriggerMode,
        retrigger_days: retriggerMode === "after_days" ? retriggerDays : null,
        returning_dm_template: (retriggerMode !== "never" && returningDmTemplate) ? returningDmTemplate : null,
        limit_enabled: limitEnabled,
        limit_count: limitEnabled ? limitCount : null,
        limit_reached_message: limitEnabled ? limitReachedMessage : null,
        attachment_type: attachmentType === "none" ? null : attachmentType,
        attachment_url: attachmentType === "none" ? null : attachmentUrl,
        link_title: linkTitle || null,
        link_url: linkUrl || null,
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f3ef] font-sans pb-[60px] h-full">
      
      {/* Header */}
      <header className="bg-white border-b border-[#e8e5de] px-[24px] py-[16px] sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] border border-[#e0ddd6] bg-white text-[#555] hover:bg-[#fafafa] transition-colors"
          >
            <ChevronLeft className="w-[16px] h-[16px]" />
          </button>
          <div>
            <h1 className="text-[15px] font-semibold text-[#1a1a18] leading-tight">Create Automation</h1>
            <div className="text-[11.5px] text-[#888] mt-[2px]">Set up keyword triggers and DM templates</div>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-[16px] py-[8px] bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-[12.5px] font-medium rounded-[8px] transition-colors flex items-center gap-[6px] disabled:opacity-70"
        >
          {loading ? (
            <div className="w-[14px] h-[14px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Sparkles className="w-[13px] h-[13px]" />
          )}
          {loading ? "Publishing..." : "Publish Live"}
        </button>
      </header>

      <div className="max-w-[1000px] mx-auto mt-[32px] px-[20px] md:px-[40px]">
        
        <form onSubmit={handleSubmit} className="space-y-[24px]">
          
          {/* Main Config Card */}
          <div className="bg-white border border-[#e8e5de] rounded-[16px] shadow-sm overflow-hidden">
            <div className="px-[24px] py-[20px] border-b border-[#f0ede8]">
              <h2 className="text-[14px] font-semibold text-[#1a1a18]">Trigger Configuration</h2>
              <p className="text-[12px] text-[#888] mt-[4px]">Define how this automation will be activated.</p>
            </div>
            
            <div className="p-[24px] space-y-[24px]">
              
              {/* Trigger Type */}
              <div>
                <label className="text-[12px] font-semibold text-[#1a1a18] mb-[10px] block">Event Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
                  <div 
                    onClick={() => setTriggerType("comment")}
                    className={`p-[16px] rounded-[12px] border cursor-pointer transition-all flex items-start gap-[12px] ${triggerType === "comment" ? "bg-[#f5f3ff] border-[#8b5cf6]" : "bg-white border-[#e0ddd6] hover:border-[#ccc]"}`}
                  >
                    <div className={`w-[20px] h-[20px] rounded-[6px] flex items-center justify-center shrink-0 mt-[2px] ${triggerType === "comment" ? "bg-[#8b5cf6] text-white" : "bg-[#f0ede8] text-[#888]"}`}>
                      <MessageSquare className="w-[11px] h-[11px]" />
                    </div>
                    <div>
                      <div className={`text-[13px] font-semibold ${triggerType === "comment" ? "text-[#8b5cf6]" : "text-[#444]"}`}>Post Comment</div>
                      <div className="text-[11.5px] text-[#888] mt-[2px]">Trigger when someone comments on your post</div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => {
                      setTriggerType("story_mention");
                      if (dmTemplate === "Hi! Here is the link you requested: {{link}}") {
                        setDmTemplate("Thank you so much for mentioning me! I really appreciate it! 💖");
                      }
                    }}
                    className={`p-[16px] rounded-[12px] border cursor-pointer transition-all flex items-start gap-[12px] ${triggerType === "story_mention" ? "bg-[#f5f3ff] border-[#8b5cf6]" : "bg-white border-[#e0ddd6] hover:border-[#ccc]"}`}
                  >
                    <div className={`w-[20px] h-[20px] rounded-[6px] flex items-center justify-center shrink-0 mt-[2px] ${triggerType === "story_mention" ? "bg-[#8b5cf6] text-white" : "bg-[#f0ede8] text-[#888]"}`}>
                      <AtSign className="w-[11px] h-[11px]" />
                    </div>
                    <div>
                      <div className={`text-[13px] font-semibold ${triggerType === "story_mention" ? "text-[#8b5cf6]" : "text-[#444]"}`}>Story Mention</div>
                      <div className="text-[11.5px] text-[#888] mt-[2px]">Trigger when someone tags you in a story</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setTriggerType("story_reply")}
                    className={`p-[16px] rounded-[12px] border cursor-pointer transition-all flex items-start gap-[12px] ${triggerType === "story_reply" ? "bg-[#f5f3ff] border-[#8b5cf6]" : "bg-white border-[#e0ddd6] hover:border-[#ccc]"}`}
                  >
                    <div className={`w-[20px] h-[20px] rounded-[6px] flex items-center justify-center shrink-0 mt-[2px] ${triggerType === "story_reply" ? "bg-[#8b5cf6] text-white" : "bg-[#f0ede8] text-[#888]"}`}>
                      <MessageSquare className="w-[11px] h-[11px]" />
                    </div>
                    <div>
                      <div className={`text-[13px] font-semibold ${triggerType === "story_reply" ? "text-[#8b5cf6]" : "text-[#444]"}`}>Story Reply</div>
                      <div className="text-[11.5px] text-[#888] mt-[2px]">Trigger when someone replies to your story</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Post / Story */}
              {(triggerType === "comment" || triggerType === "story_reply") && (
                <div>
                  <label className="text-[12px] font-semibold text-[#1a1a18] mb-[10px] block">
                    {triggerType === "comment" ? "Target Post" : "Target Story"}
                  </label>
                  <div className="flex gap-[12px] mb-[12px]">
                    <button type="button" onClick={() => setPostType("all")} className={`px-[16px] py-[8px] rounded-[8px] text-[12px] font-medium border transition-colors ${postType === "all" ? "bg-[#1a1a18] text-white border-[#1a1a18]" : "bg-white text-[#555] border-[#e0ddd6] hover:bg-[#fafaf8]"}`}>
                      {triggerType === "comment" ? "All Posts" : "All Stories"}
                    </button>
                    <button type="button" onClick={() => setPostType("specific")} className={`px-[16px] py-[8px] rounded-[8px] text-[12px] font-medium border transition-colors ${postType === "specific" ? "bg-[#1a1a18] text-white border-[#1a1a18]" : "bg-white text-[#555] border-[#e0ddd6] hover:bg-[#fafaf8]"}`}>
                      {triggerType === "comment" ? "Specific Post" : "Specific Story"}
                    </button>
                  </div>
                  
                  {postType === "specific" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-[12px]">
                      <input
                        type="text"
                        required
                        value={postUrl}
                        onChange={(e) => setPostUrl(e.target.value)}
                        placeholder={triggerType === "comment" ? "Paste Instagram Post URL (e.g. instagram.com/p/12345)" : "Paste Instagram Story URL (e.g. instagram.com/stories/zuck/12345)"}
                        className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] placeholder-[#aaa] focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all"
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {/* Trigger Keyword */}
              {(triggerType === "comment" || triggerType === "story_reply") && (
                <div>
                  <label className="text-[12px] font-semibold text-[#1a1a18] mb-[10px] block">Trigger Keyword</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g. BOOK"
                      className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] font-mono text-[#1a1a18] placeholder-[#aaa] focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all"
                    />
                  </div>
                  
                  <label className="flex items-center gap-[8px] mt-[12px] cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={fuzzyMatch}
                        onChange={(e) => setFuzzyMatch(e.target.checked)}
                        className="peer appearance-none w-[16px] h-[16px] rounded-[4px] border border-[#d0cdc6] bg-white checked:bg-[#8b5cf6] checked:border-[#8b5cf6] cursor-pointer transition-colors"
                      />
                      <Check className="w-[10px] h-[10px] text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                    </div>
                    <span className="text-[12px] text-[#555] group-hover:text-[#1a1a18] transition-colors">
                      Fuzzy Match <span className="text-[#888]">(trigger if keyword is in a sentence)</span>
                    </span>
                  </label>
                </div>
              )}

              {/* Message Template */}
              <div>
                <label className="text-[12px] font-semibold text-[#1a1a18] mb-[10px] block">Direct Message Template</label>
                <textarea
                  required
                  rows={4}
                  value={dmTemplate}
                  onChange={(e) => setDmTemplate(e.target.value)}
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] placeholder-[#aaa] focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all resize-none"
                />
                <p className="mt-[6px] text-[11px] text-[#888]">This message will be sent to the user's DM. Variables like {'{{link}}'} will be replaced.</p>
              </div>

              {/* Attachments */}
              <div className="bg-[#fafaf8] border border-[#e8e5de] p-[16px] rounded-[12px]">
                <label className="text-[13px] font-semibold text-[#1a1a18] mb-[12px] block">Rich Attachments (Optional)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  <div>
                    <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Attachment Type</label>
                    <select value={attachmentType} onChange={(e) => setAttachmentType(e.target.value)} className="w-full px-[14px] py-[8px] bg-white border border-[#e0ddd6] rounded-[10px] text-[12px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all">
                      <option value="none">None</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  {attachmentType !== "none" && (
                    <div>
                      <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Media URL</label>
                      <input type="url" value={attachmentUrl} onChange={(e) => setAttachmentUrl(e.target.value)} placeholder={`Enter ${attachmentType} URL`} className="w-full px-[14px] py-[8px] bg-white border border-[#e0ddd6] rounded-[10px] text-[12px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all" />
                    </div>
                  )}
                </div>
                
                <div className="mt-[16px] pt-[16px] border-t border-[#e8e5de]">
                  <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Call-to-Action Link</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    <div>
                      <input type="text" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Link Title (e.g. Get Started)" className="w-full px-[14px] py-[8px] bg-white border border-[#e0ddd6] rounded-[10px] text-[12px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all" />
                    </div>
                    <div>
                      <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="Target URL (e.g. https://...)" className="w-full px-[14px] py-[8px] bg-white border border-[#e0ddd6] rounded-[10px] text-[12px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Comment Reply */}
              {triggerType === "comment" && (
                <div className="bg-[#fafaf8] border border-[#e8e5de] rounded-[12px] overflow-hidden">
                  <label className="flex items-center gap-[12px] p-[16px] cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" checked={publicReplyEnabled} onChange={() => setPublicReplyEnabled(!publicReplyEnabled)} className="peer appearance-none w-[18px] h-[18px] rounded-[5px] border border-[#d0cdc6] bg-white checked:bg-[#8b5cf6] checked:border-[#8b5cf6] cursor-pointer transition-colors" />
                      <Check className="w-[12px] h-[12px] text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#1a1a18]">Public Comment Reply</div>
                      <div className="text-[11.5px] text-[#888]">Automatically reply to their comment on your post.</div>
                    </div>
                  </label>
                  {publicReplyEnabled && (
                    <div className="px-[16px] pb-[16px] pt-0">
                      <div className="pl-[30px]">
                        <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Public Reply Message</label>
                        <textarea rows={2} value={publicReplyText} onChange={(e) => setPublicReplyText(e.target.value)} className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all resize-none" />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-white border border-[#e8e5de] rounded-[16px] shadow-sm overflow-hidden">
            <div className="px-[24px] py-[20px] border-b border-[#f0ede8] flex items-center gap-[8px]">
              <Settings2 className="w-[16px] h-[16px] text-[#8b5cf6]" />
              <h2 className="text-[14px] font-semibold text-[#1a1a18]">Advanced Settings</h2>
            </div>
            
            <div className="p-[24px] space-y-[16px]">
              
              {/* Follow Gate */}
              <div className="bg-[#fafaf8] border border-[#e8e5de] rounded-[12px] overflow-hidden">
                <label className="flex items-center gap-[12px] p-[16px] cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={requireFollow} onChange={() => setRequireFollow(!requireFollow)} className="peer appearance-none w-[18px] h-[18px] rounded-[5px] border border-[#d0cdc6] bg-white checked:bg-[#8b5cf6] checked:border-[#8b5cf6] cursor-pointer transition-colors" />
                    <Check className="w-[12px] h-[12px] text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1a1a18]">Follow Gate (Follow for Link)</div>
                    <div className="text-[11.5px] text-[#888]">Force users to follow you before they get the DM.</div>
                  </div>
                </label>
                {requireFollow && (
                  <div className="px-[16px] pb-[16px] pt-0">
                    <div className="pl-[30px]">
                      <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Follow Prompt Message</label>
                      <textarea rows={2} value={followMessage} onChange={(e) => setFollowMessage(e.target.value)} className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all resize-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Email Collection */}
              <div className="bg-[#fafaf8] border border-[#e8e5de] rounded-[12px] overflow-hidden">
                <label className="flex items-center gap-[12px] p-[16px] cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={collectEmail} onChange={() => setCollectEmail(!collectEmail)} className="peer appearance-none w-[18px] h-[18px] rounded-[5px] border border-[#d0cdc6] bg-white checked:bg-[#8b5cf6] checked:border-[#8b5cf6] cursor-pointer transition-colors" />
                    <Check className="w-[12px] h-[12px] text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1a1a18]">Collect Emails in DM</div>
                    <div className="text-[11.5px] text-[#888]">Automatically ask for their email right after sending the link.</div>
                  </div>
                </label>
                {collectEmail && (
                  <div className="px-[16px] pb-[16px] pt-0">
                    <div className="pl-[30px]">
                      <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Email Prompt Message</label>
                      <textarea rows={2} value={emailPromptMessage} onChange={(e) => setEmailPromptMessage(e.target.value)} className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all resize-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Follow-up */}
              <div className="bg-[#fafaf8] border border-[#e8e5de] rounded-[12px] overflow-hidden">
                <label className="flex items-center gap-[12px] p-[16px] cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={followUpEnabled} onChange={() => setFollowUpEnabled(!followUpEnabled)} className="peer appearance-none w-[18px] h-[18px] rounded-[5px] border border-[#d0cdc6] bg-white checked:bg-[#8b5cf6] checked:border-[#8b5cf6] cursor-pointer transition-colors" />
                    <Check className="w-[12px] h-[12px] text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1a1a18]">Smart Follow-up</div>
                    <div className="text-[11.5px] text-[#888]">Send a second DM if they haven't clicked your link.</div>
                  </div>
                </label>
                {followUpEnabled && (
                  <div className="px-[16px] pb-[16px] pt-0">
                    <div className="pl-[30px] space-y-[12px]">
                      <div>
                        <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Wait Time (Hours)</label>
                        <input type="number" min="1" max="168" value={followUpTime} onChange={(e) => setFollowUpTime(parseInt(e.target.value))} className="w-full px-[14px] py-[8px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Follow-up Message</label>
                        <textarea rows={2} value={followUpMessage} onChange={(e) => setFollowUpMessage(e.target.value)} className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all resize-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Scarcity Gate */}
              <div className="bg-[#fafaf8] border border-[#e8e5de] rounded-[12px] overflow-hidden">
                <label className="flex items-center gap-[12px] p-[16px] cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={limitEnabled} onChange={() => setLimitEnabled(!limitEnabled)} className="peer appearance-none w-[18px] h-[18px] rounded-[5px] border border-[#d0cdc6] bg-white checked:bg-[#f97316] checked:border-[#f97316] cursor-pointer transition-colors" />
                    <Check className="w-[12px] h-[12px] text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1a1a18] flex items-center gap-[6px]">
                      <ShieldAlert className="w-[14px] h-[14px] text-[#f97316]" /> Limited Stock / Scarcity Gate
                    </div>
                    <div className="text-[11.5px] text-[#888]">Stop sending the resource after X people claim it.</div>
                  </div>
                </label>
                {limitEnabled && (
                  <div className="px-[16px] pb-[16px] pt-0">
                    <div className="pl-[30px] space-y-[12px]">
                      <div>
                        <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Maximum Recipients</label>
                        <input type="number" min="1" value={limitCount} onChange={(e) => setLimitCount(parseInt(e.target.value))} className="w-full px-[14px] py-[8px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:border-[#f97316] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Limit Reached Message</label>
                        <textarea rows={2} value={limitReachedMessage} onChange={(e) => setLimitReachedMessage(e.target.value)} className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:border-[#f97316] outline-none transition-all resize-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Retrigger Mode */}
              <div className="bg-[#fafaf8] border border-[#e8e5de] p-[16px] rounded-[12px]">
                <label className="text-[13px] font-semibold text-[#1a1a18] mb-[12px] block">Smart Re-trigger (Returning users)</label>
                <select value={retriggerMode} onChange={(e) => setRetriggerMode(e.target.value)} className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all">
                  <option value="never">Never resend to the same person</option>
                  <option value="always">Always resend every time they comment</option>
                  <option value="after_days">Resend only after X days</option>
                </select>
                
                {retriggerMode === "after_days" && (
                  <div className="mt-[12px]">
                    <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Days to wait before resending</label>
                    <input type="number" min="1" value={retriggerDays} onChange={(e) => setRetriggerDays(parseInt(e.target.value))} className="w-full px-[14px] py-[8px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all" />
                  </div>
                )}
                
                {retriggerMode !== "never" && (
                  <div className="mt-[12px]">
                    <label className="text-[11px] font-semibold text-[#1a1a18] mb-[6px] block">Different Message for Returning Users?</label>
                    <textarea rows={2} value={returningDmTemplate} onChange={(e) => setReturningDmTemplate(e.target.value)} placeholder="Leave blank to use default template" className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:border-[#8b5cf6] outline-none transition-all resize-none" />
                  </div>
                )}
              </div>

            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
}
