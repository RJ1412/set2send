"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import api from "../../../lib/api";
import { Settings as SettingsIcon, Save, User, Shield, Bell } from "lucide-react";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    try {
      const payload: any = { name: formData.name };
      if (formData.password) payload.password = formData.password;
      
      const res = await api.patch("/users/profile", payload);
      setUser(res.data);
      setSuccessMsg("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f3ef]">
      <header className="flex items-center justify-between px-[24px] py-[16px] bg-white border-b border-[#e8e5de]">
        <div>
          <h1 className="text-[14px] font-medium text-[#1a1a18]">Account Settings</h1>
          <p className="text-[11.5px] text-[#888] mt-[1px]">Manage your personal profile and preferences.</p>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-[20px] md:px-[24px] max-w-[800px]">
        <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[24px] mb-[20px]">
          <div className="flex items-center gap-[8px] mb-[20px]">
            <User className="w-[18px] h-[18px] text-[#8b5cf6]" />
            <h2 className="text-[14px] font-semibold text-[#1a1a18]">Profile Information</h2>
          </div>
          
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-[16px]">
            <div>
              <label className="block text-[11px] font-medium text-[#888] mb-[6px] uppercase tracking-[0.5px]">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-[14px] py-[10px] rounded-[8px] border border-[#d0cdc6] text-[13px] bg-white outline-none focus:border-[#8b5cf6] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-medium text-[#888] mb-[6px] uppercase tracking-[0.5px]">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                disabled
                className="w-full px-[14px] py-[10px] rounded-[8px] border border-[#e8e5de] text-[13px] bg-[#fafaf8] text-[#888] outline-none cursor-not-allowed"
              />
              <p className="text-[10.5px] text-[#aaa] mt-[6px]">Email addresses cannot be changed directly.</p>
            </div>
            
            <div className="border-t border-[#e8e5de] pt-[16px] mt-[8px]">
              <div className="flex items-center gap-[8px] mb-[16px]">
                <Shield className="w-[16px] h-[16px] text-[#1a1a18]" />
                <h3 className="text-[13px] font-semibold text-[#1a1a18]">Security</h3>
              </div>
              <label className="block text-[11px] font-medium text-[#888] mb-[6px] uppercase tracking-[0.5px]">New Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full px-[14px] py-[10px] rounded-[8px] border border-[#d0cdc6] text-[13px] bg-white outline-none focus:border-[#8b5cf6] transition-colors"
              />
            </div>
            
            {successMsg && <div className="text-[12px] text-[#16a34a] font-medium p-[10px] bg-[#f0fdf4] rounded-[6px] border border-[#86efac]">{successMsg}</div>}
            
            <div className="flex justify-end mt-[10px]">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-[6px] px-[16px] py-[9px] rounded-[8px] text-[12px] font-semibold bg-[#8b5cf6] text-white hover:bg-[#7c3aed] transition-colors disabled:opacity-50"
              >
                <Save className="w-[14px] h-[14px]" /> {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-[12px] border border-[#e8e5de] p-[24px]">
          <div className="flex items-center gap-[8px] mb-[16px]">
            <Bell className="w-[18px] h-[18px] text-[#ea580c]" />
            <h2 className="text-[14px] font-semibold text-[#1a1a18]">Notifications & Alerts</h2>
          </div>
          <p className="text-[12px] text-[#888] mb-[20px]">Choose how you want to be notified about automation issues.</p>
          
          <div className="flex flex-col gap-[16px]">
            <label className="flex items-center justify-between p-[14px] border border-[#e8e5de] rounded-[8px] hover:border-[#d0cdc6] transition-colors cursor-pointer">
              <div>
                <div className="text-[13px] font-medium text-[#1a1a18]">Instagram Token Expiry</div>
                <div className="text-[11px] text-[#aaa] mt-[2px]">Get alerted when your Instagram connection needs re-authentication.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-[16px] h-[16px] accent-[#8b5cf6]" />
            </label>
            <label className="flex items-center justify-between p-[14px] border border-[#e8e5de] rounded-[8px] hover:border-[#d0cdc6] transition-colors cursor-pointer">
              <div>
                <div className="text-[13px] font-medium text-[#1a1a18]">WhatsApp Campaign Failures</div>
                <div className="text-[11px] text-[#aaa] mt-[2px]">Get alerted if a bulk broadcast fails to send to multiple recipients.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-[16px] h-[16px] accent-[#8b5cf6]" />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
