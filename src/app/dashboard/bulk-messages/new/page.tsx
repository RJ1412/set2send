"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ChevronLeft, AlertCircle, CheckCircle2, Upload, X, Loader2, MessageCircle, FileText } from "lucide-react";

export default function NewBulkMessageWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [messageType, setMessageType] = useState("template");
  const [templateName, setTemplateName] = useState("");
  const [templateParams, setTemplateParams] = useState<string[]>([]);
  const [freeformBody, setFreeformBody] = useState("");
  
  // CSV State
  const [validContacts, setValidContacts] = useState<any[]>([]);
  const [invalidContacts, setInvalidContacts] = useState<any[]>([]);
  const [showInvalid, setShowInvalid] = useState(false);

  const { data: templates, isLoading: templatesLoading, error: templatesError } = useQuery({
    queryKey: ["whatsappTemplates"],
    queryFn: async () => {
      const res = await api.get("/whatsapp/templates");
      return res.data;
    },
    enabled: messageType === "template",
  });

  const handleAddVariable = () => {
    setTemplateParams([...templateParams, ""]);
  };

  const handleVariableChange = (index: number, val: string) => {
    const newParams = [...templateParams];
    newParams[index] = val;
    setTemplateParams(newParams);
  };

  const removeVariable = (index: number) => {
    const newParams = [...templateParams];
    newParams.splice(index, 1);
    setTemplateParams(newParams);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/whatsapp/parse-csv", formData);
      setValidContacts(res.data.valid || []);
      setInvalidContacts(res.data.invalid || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to parse CSV");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,name,phone\nJohn Doe,1234567890\nJane Smith,+1987654321";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "whatsapp_contacts_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLaunch = async () => {
    setLoading(true);
    setError(null);
    try {
      const createRes = await api.post("/whatsapp/campaigns", {
        name,
        messageType,
        templateName: messageType === "template" ? templateName : undefined,
        templateParams: messageType === "template" ? templateParams : undefined,
        freeformBody: messageType === "freeform" ? freeformBody : undefined,
        contacts: validContacts,
      });

      const campaignId = createRes.data.id;
      // Start the campaign immediately just like dmzy
      await api.post(`/whatsapp/campaigns/${campaignId}/send`);
      router.push("/dashboard/bulk-messages");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to launch campaign");
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-[14px] py-[10px] rounded-[8px] border border-[#d0cdc6] text-[13px] bg-white outline-none focus:border-[#8b5cf6] transition-colors";

  return (
    <div className="flex flex-col h-full bg-[#f5f3ef]">
      <header className="flex items-center gap-[16px] px-[24px] py-[16px] bg-white border-b border-[#e8e5de]">
        <Link href="/dashboard/bulk-messages" className="p-[6px] rounded-[8px] text-[#888] hover:bg-[#f5f3ef] hover:text-[#1a1a18] transition-colors">
          <ChevronLeft className="w-[18px] h-[18px]" />
        </Link>
        <div>
          <h1 className="text-[14px] font-medium text-[#1a1a18]">Create Broadcast</h1>
          <p className="text-[11.5px] text-[#888] mt-[1px]">Build and launch a bulk WhatsApp campaign in 3 steps.</p>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-[20px] md:px-[24px]">
        <div className="max-w-[700px] mx-auto space-y-[24px]">
          
          {/* Stepper Navigation */}
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {[1, 2, 3].map((s, i) => (
                <li key={s} className={`relative ${i !== 2 ? "pr-[30px] sm:pr-[80px]" : ""}`}>
                  <div className="flex items-center">
                    <div
                      className={`h-[36px] w-[36px] rounded-full flex items-center justify-center font-bold text-[13px] transition-colors ${
                        step >= s 
                          ? "bg-[#8b5cf6] text-white shadow-sm border border-[#7c3aed]" 
                          : "bg-white border border-[#d0cdc6] text-[#888]"
                      }`}
                    >
                      {s}
                    </div>
                    {i !== 2 && (
                      <div
                        className={`absolute top-[18px] left-[40px] -ml-[1px] h-[2px] w-full sm:w-[80px] transition-colors ${
                          step > s ? "bg-[#8b5cf6]" : "bg-[#d0cdc6]"
                        }`}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[24px] shadow-sm">
            
            {/* STEP 1: CONFIGURATION */}
            {step === 1 && (
              <div className="space-y-[24px]">
                <div>
                  <h2 className="text-[16px] font-semibold text-[#1a1a18] mb-[4px]">Step 1: Configuration</h2>
                  <p className="text-[12px] text-[#888]">Name your broadcast and configure the message content.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#888] mb-[6px] uppercase tracking-[0.5px]">Campaign Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClasses}
                    placeholder="e.g. Summer Promo 2026"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#888] mb-[6px] uppercase tracking-[0.5px]">Message Type</label>
                  <div className="flex flex-col sm:flex-row gap-[16px]">
                    <label className={`flex-1 flex items-start gap-[12px] p-[16px] rounded-[10px] border cursor-pointer transition-colors ${messageType === "template" ? "border-[#8b5cf6] bg-[#f5f3ff]" : "border-[#e8e5de] hover:border-[#d0cdc6]"}`}>
                      <div className={`mt-[2px] w-[16px] h-[16px] rounded-full border flex items-center justify-center ${messageType === "template" ? "border-[#8b5cf6]" : "border-[#ccc]"}`}>
                        {messageType === "template" && <div className="w-[8px] h-[8px] rounded-full bg-[#8b5cf6]" />}
                      </div>
                      <input type="radio" className="hidden" checked={messageType === "template"} onChange={() => setMessageType("template")} />
                      <div>
                        <div className={`text-[13px] font-semibold ${messageType === "template" ? "text-[#8b5cf6]" : "text-[#1a1a18]"}`}>Template Message</div>
                        <div className="text-[11px] text-[#888] mt-[2px]">Use a pre-approved Meta template (Best for bulk).</div>
                      </div>
                    </label>

                    <label className={`flex-1 flex items-start gap-[12px] p-[16px] rounded-[10px] border cursor-pointer transition-colors ${messageType === "freeform" ? "border-[#8b5cf6] bg-[#f5f3ff]" : "border-[#e8e5de] hover:border-[#d0cdc6]"}`}>
                      <div className={`mt-[2px] w-[16px] h-[16px] rounded-full border flex items-center justify-center ${messageType === "freeform" ? "border-[#8b5cf6]" : "border-[#ccc]"}`}>
                        {messageType === "freeform" && <div className="w-[8px] h-[8px] rounded-full bg-[#8b5cf6]" />}
                      </div>
                      <input type="radio" className="hidden" checked={messageType === "freeform"} onChange={() => setMessageType("freeform")} />
                      <div>
                        <div className={`text-[13px] font-semibold ${messageType === "freeform" ? "text-[#8b5cf6]" : "text-[#1a1a18]"}`}>Free-form Message</div>
                        <div className="text-[11px] text-[#888] mt-[2px]">Write a custom message directly.</div>
                      </div>
                    </label>
                  </div>
                </div>

                {messageType === "template" ? (
                  <div className="p-[20px] rounded-[10px] bg-[#fafaf8] border border-[#e8e5de] space-y-[16px]">
                    <div>
                      <label className="block text-[11px] font-medium text-[#888] mb-[6px] uppercase tracking-[0.5px]">Select Template</label>
                      {templatesLoading ? (
                        <div className="text-[#888] text-[12px] flex items-center gap-[8px]">
                          <Loader2 className="w-[14px] h-[14px] animate-spin"/> Fetching approved templates from Meta...
                        </div>
                      ) : templatesError ? (
                        <div className="text-[#dc2626] text-[12px] bg-[#fef2f2] p-[12px] rounded-[8px] border border-[#fecaca]">
                          {(templatesError as any).response?.data?.error || "Failed to fetch templates. Please check your credentials."}
                        </div>
                      ) : (
                        <select
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          className={inputClasses}
                        >
                          <option value="">Choose an approved template...</option>
                          {templates?.map((t: any) => (
                            <option key={t.name} value={t.name}>{t.name} ({t.language})</option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#888] mb-[6px] uppercase tracking-[0.5px]">Dynamic Variables (Optional)</label>
                      {templateParams.map((param, idx) => (
                        <div key={idx} className="flex items-center gap-[12px] mb-[12px]">
                          <span className="text-[#888] text-[12px] font-mono bg-white px-[8px] py-[4px] border border-[#e8e5de] rounded-[6px]">{`{{${idx + 1}}}`}</span>
                          <input
                            type="text"
                            value={param}
                            onChange={(e) => handleVariableChange(idx, e.target.value)}
                            className={inputClasses}
                            placeholder="e.g. John"
                          />
                          <button onClick={() => removeVariable(idx)} className="p-[6px] text-[#888] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded-[6px] transition-colors">
                            <X className="w-[14px] h-[14px]" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleAddVariable}
                        className="text-[12px] font-medium text-[#8b5cf6] hover:text-[#7c3aed] transition-colors"
                      >
                        + Add Variable
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-[16px]">
                    <div className="bg-[#fffbeb] border-l-[4px] border-[#f59e0b] p-[16px] rounded-r-[8px]">
                      <div className="flex gap-[12px]">
                        <AlertCircle className="h-[18px] w-[18px] text-[#f59e0b] shrink-0 mt-[2px]" />
                        <p className="text-[12px] text-[#b45309] leading-relaxed">
                          <strong>24-Hour Window Rule:</strong> Free-form messages will only be delivered to recipients who have messaged your WhatsApp Business number within the last 24 hours. For cold or bulk outreach, always use Template messages.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#888] mb-[6px] uppercase tracking-[0.5px]">Message Body</label>
                      <textarea
                        rows={4}
                        maxLength={1024}
                        value={freeformBody}
                        onChange={(e) => setFreeformBody(e.target.value)}
                        className={`${inputClasses} resize-none`}
                        placeholder="Hello, how can we help you today?"
                      />
                      <p className="mt-[6px] text-[11px] text-[#aaa] text-right">{freeformBody.length}/1024</p>
                    </div>
                  </div>
                )}

                <div className="pt-[16px] border-t border-[#e8e5de] flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!name || (messageType === "template" ? !templateName : !freeformBody)}
                    className="px-[18px] py-[10px] bg-[#8b5cf6] text-white text-[12px] font-semibold rounded-[8px] hover:bg-[#7c3aed] disabled:opacity-50 transition-colors"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: AUDIENCE UPLOAD */}
            {step === 2 && (
              <div className="space-y-[24px]">
                <div>
                  <h2 className="text-[16px] font-semibold text-[#1a1a18] mb-[4px]">Step 2: Upload Audience</h2>
                  <p className="text-[12px] text-[#888]">Upload a CSV file containing your contact names and phone numbers.</p>
                </div>

                <div className="border-[2px] border-dashed border-[#d0cdc6] rounded-[16px] p-[40px] text-center hover:bg-[#fafaf8] hover:border-[#8b5cf6] transition-colors relative group bg-[#fbfbfb]">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-[56px] h-[56px] bg-[#f5f3ff] rounded-full flex items-center justify-center mx-auto text-[#8b5cf6] group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-[24px] h-[24px]" />
                  </div>
                  <h3 className="mt-[16px] text-[14px] font-semibold text-[#1a1a18]">Click to upload CSV</h3>
                  <p className="mt-[4px] text-[12px] text-[#888]">Format: <code>Name,Phone</code> (Include country code)</p>
                </div>

                <div className="text-center">
                  <button onClick={downloadTemplate} className="text-[12px] font-medium text-[#8b5cf6] hover:underline">
                    Download sample CSV template
                  </button>
                </div>

                {loading && <p className="text-center text-[13px] text-[#888]">Parsing CSV...</p>}
                {error && <p className="text-center text-[13px] text-[#dc2626] font-medium">{error}</p>}

                {validContacts.length > 0 && (
                  <div className="bg-[#f0fdf4] border border-[#86efac] p-[16px] rounded-[10px] flex items-center gap-[12px]">
                    <CheckCircle2 className="w-[18px] h-[18px] text-[#16a34a]" />
                    <span className="text-[13px] text-[#16a34a] font-medium">{validContacts.length} valid contacts parsed and ready!</span>
                  </div>
                )}

                {invalidContacts.length > 0 && (
                  <div className="bg-[#fef2f2] border border-[#fecaca] p-[16px] rounded-[10px]">
                    <button
                      onClick={() => setShowInvalid(!showInvalid)}
                      className="text-[#dc2626] text-[13px] font-medium flex items-center justify-between w-full"
                    >
                      <span className="flex items-center gap-[8px]">
                        <AlertCircle className="w-[16px] h-[16px]" /> 
                        {invalidContacts.length} invalid rows found
                      </span>
                      <span className="text-[11px] border border-[#fca5a5] px-[8px] py-[4px] rounded-full hover:bg-[#fee2e2] transition-colors">{showInvalid ? "Hide" : "Review Issues"}</span>
                    </button>
                    {showInvalid && (
                      <div className="mt-[12px] max-h-[160px] overflow-y-auto text-[12px] text-[#991b1b] bg-white border border-[#fecaca] rounded-[8px] p-[12px]">
                        <ul className="list-disc pl-[20px] space-y-[4px]">
                          {invalidContacts.map((inv, idx) => (
                            <li key={idx}>Row {inv.row}: <strong>{inv.phone}</strong> - {inv.reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {validContacts.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-medium text-[#888] mb-[8px] uppercase tracking-[0.5px]">Valid Contacts Preview (First 5)</h4>
                    <div className="border border-[#e8e5de] rounded-[10px] overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-[#fafaf8] border-b border-[#e8e5de]">
                          <tr>
                            <th className="px-[16px] py-[10px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Name</th>
                            <th className="px-[16px] py-[10px] text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Phone Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validContacts.slice(0, 5).map((c, i) => (
                            <tr key={i} className="border-b border-[#f5f3ef] hover:bg-[#fafaf8]">
                              <td className="px-[16px] py-[10px] text-[13px] font-medium text-[#1a1a18]">{c.name || "-"}</td>
                              <td className="px-[16px] py-[10px] text-[13px] text-[#666] font-mono">{c.phone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="pt-[16px] border-t border-[#e8e5de] flex gap-[12px]">
                  <button
                    onClick={() => setStep(1)}
                    className="px-[18px] py-[10px] border border-[#e8e5de] bg-white text-[#1a1a18] text-[12px] font-semibold rounded-[8px] hover:bg-[#fafaf8] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={validContacts.length === 0}
                    className="px-[18px] py-[10px] bg-[#8b5cf6] text-white text-[12px] font-semibold rounded-[8px] hover:bg-[#7c3aed] disabled:opacity-50 transition-colors"
                  >
                    Review Campaign
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & LAUNCH */}
            {step === 3 && (
              <div className="space-y-[24px]">
                <div>
                  <h2 className="text-[16px] font-semibold text-[#1a1a18] mb-[4px]">Step 3: Review & Launch</h2>
                  <p className="text-[12px] text-[#888]">Verify your broadcast settings before sending.</p>
                </div>

                <div className="bg-[#fafaf8] border border-[#e8e5de] rounded-[12px] p-[24px] space-y-[20px]">
                  <div>
                    <h3 className="text-[11px] font-medium text-[#888] uppercase tracking-[0.5px]">Campaign Name</h3>
                    <p className="mt-[4px] text-[18px] font-bold text-[#1a1a18]">{name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-[24px]">
                    <div>
                      <h3 className="text-[11px] font-medium text-[#888] uppercase tracking-[0.5px]">Message Type</h3>
                      <p className="mt-[4px] text-[14px] font-medium text-[#1a1a18] capitalize flex items-center gap-[6px]">
                        {messageType === 'template' ? <FileText className="w-[14px] h-[14px] text-[#8b5cf6]" /> : <MessageCircle className="w-[14px] h-[14px] text-[#8b5cf6]" />}
                        {messageType}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-[11px] font-medium text-[#888] uppercase tracking-[0.5px]">Total Recipients</h3>
                      <p className="mt-[4px] text-[14px] font-bold text-[#16a34a]">{validContacts.length} contacts</p>
                    </div>
                  </div>
                  
                  <div className="pt-[16px] border-t border-[#e8e5de]">
                    <h3 className="text-[11px] font-medium text-[#888] uppercase tracking-[0.5px] mb-[8px]">Message Content Review</h3>
                    <div className="bg-white border border-[#e8e5de] rounded-[8px] p-[16px] text-[13px] text-[#1a1a18]">
                      {messageType === "template" ? (
                        <div>
                          <span className="font-semibold text-[#888]">Selected Template:</span> 
                          <div className="mt-[4px] font-medium text-[#1a1a18] bg-[#f5f3ff] inline-block px-[8px] py-[4px] rounded-[6px] border border-[#ddd6fe] text-[#7c3aed]">
                            {templateName}
                          </div>
                          
                          {templateParams.length > 0 && (
                            <div className="mt-[12px]">
                              <span className="font-semibold text-[#888]">Variables Mapped:</span>
                              <div className="flex flex-wrap gap-[8px] mt-[6px]">
                                {templateParams.map((p, i) => (
                                  <span key={i} className="px-[8px] py-[4px] bg-[#fafaf8] border border-[#e8e5de] rounded-[6px] text-[12px] font-mono">
                                    <span className="text-[#888] mr-[4px]">{"{{"}{i+1}{"}}"}</span> {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">{freeformBody}</p>
                      )}
                    </div>
                  </div>
                </div>

                {error && <div className="bg-[#fef2f2] border border-[#fecaca] p-[12px] rounded-[8px] text-[13px] text-[#dc2626] font-medium flex items-center gap-[8px]">
                  <AlertCircle className="w-[16px] h-[16px]" /> {error}
                </div>}

                <div className="pt-[16px] border-t border-[#e8e5de] flex gap-[12px]">
                  <button
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="px-[18px] py-[10px] border border-[#e8e5de] bg-white text-[#1a1a18] text-[12px] font-semibold rounded-[8px] hover:bg-[#fafaf8] transition-colors disabled:opacity-50"
                  >
                    Back to Upload
                  </button>
                  <button
                    onClick={handleLaunch}
                    disabled={loading}
                    className="px-[18px] py-[10px] bg-[#16a34a] text-white text-[13px] font-bold rounded-[8px] shadow-sm hover:bg-[#15803d] disabled:opacity-50 flex items-center gap-[8px] transition-colors"
                  >
                    {loading ? <Loader2 className="w-[16px] h-[16px] animate-spin" /> : "🚀"} 
                    {loading ? "Launching Broadcast..." : "Launch Broadcast Now"}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
