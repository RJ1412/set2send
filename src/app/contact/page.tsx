"use client";

import React from "react";
import { Mail, MessageCircle, HelpCircle, Bug, Handshake } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const InstagramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function ContactPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans text-[#1A1A1A] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-[#1A1A1A] tracking-tight mb-4">
            Get in touch.
          </h1>
          <p className="text-[#1A1A1A]/70 text-sm md:text-base max-w-xl mx-auto font-medium">
            Whether you have a question about features, pricing, or need technical support, our team is here to help. We typically respond within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* General Support */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-[#D4AF37]/20"></div>
            <div className="w-12 h-12 bg-[#2a2a2a] border border-[#444] text-[#D4AF37] rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white relative z-10">Technical Support</h3>
            <p className="text-gray-400 text-sm mb-6 relative z-10">
              Need help with setup or experiencing issues? Reach out to our technical team directly.
            </p>
            <a href="mailto:rjishere1412@gmail.com" className="inline-flex items-center gap-2 font-bold text-sm text-[#D4AF37] hover:text-[#F3E5AB] transition-colors relative z-10">
              rjishere1412@gmail.com
            </a>
          </div>

          {/* Account & Billing */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-[#D4AF37]/20"></div>
            <div className="w-12 h-12 bg-[#2a2a2a] border border-[#444] text-[#D4AF37] rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white relative z-10">General Inquiries</h3>
            <p className="text-gray-400 text-sm mb-6 relative z-10">
              Questions about our plans, enterprise options, or custom requirements?
            </p>
            <a href="mailto:ujjwalmehta187@gmail.com" className="inline-flex items-center gap-2 font-bold text-sm text-[#D4AF37] hover:text-[#F3E5AB] transition-colors relative z-10">
              ujjwalmehta187@gmail.com
            </a>
          </div>

          {/* Instagram */}
          <div className="bg-gradient-to-br from-[#1A1A1A] via-[#2A1525] to-[#3B1515] border border-[#833AB4]/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 md:col-span-2 relative overflow-hidden group hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#F56040]/20 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:opacity-100 opacity-60"></div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-tr from-[#FFB703] via-[#FD1D1D] to-[#833AB4] text-white rounded-xl flex items-center justify-center shadow-lg">
                    <InstagramIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Follow us on Instagram</h3>
                </div>
                <p className="text-gray-300 text-sm max-w-md">
                  Stay updated with our latest features, tips, and community highlights. Join thousands of creators automating their growth.
                </p>
              </div>
              <a 
                href="https://www.instagram.com/set2send/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white hover:bg-gray-100 text-[#1A1A1A] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_14px_rgba(253,29,29,0.3)] hover:shadow-[0_6px_20px_rgba(253,29,29,0.4)] inline-flex items-center gap-2 whitespace-nowrap"
              >
                @set2send
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif font-black text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E8E4D9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-[#D4AF37]">
              <div className="w-10 h-10 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-4 border border-[#E8E4D9]">
                <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-[#1A1A1A]">Need help with setup?</h4>
              <p className="text-[#1A1A1A]/70 text-xs leading-relaxed mb-4">
                Our documentation covers most use cases, but if you're stuck, our tech team is ready to assist you.
              </p>
              <a href="mailto:rjishere1412@gmail.com" className="text-xs font-bold text-[#D4AF37] hover:text-[#1A1A1A] transition-colors">Contact Tech Support →</a>
            </div>
            
            <div className="bg-white border border-[#E8E4D9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-[#D4AF37]">
              <div className="w-10 h-10 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-4 border border-[#E8E4D9]">
                <Handshake className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-[#1A1A1A]">Partnership inquiries?</h4>
              <p className="text-[#1A1A1A]/70 text-xs leading-relaxed mb-4">
                Looking to partner with Set2Send or integrate our services? We'd love to chat.
              </p>
              <a href="mailto:ujjwalmehta187@gmail.com" className="text-xs font-bold text-[#D4AF37] hover:text-[#1A1A1A] transition-colors">Email Partnerships →</a>
            </div>

            <div className="bg-white border border-[#E8E4D9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-[#D4AF37]">
              <div className="w-10 h-10 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-4 border border-[#E8E4D9]">
                <Bug className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-[#1A1A1A]">Bug reports?</h4>
              <p className="text-[#1A1A1A]/70 text-xs leading-relaxed mb-4">
                Found something that isn't working right? Let us know so we can fix it immediately.
              </p>
              <a href="mailto:rjishere1412@gmail.com" className="text-xs font-bold text-[#D4AF37] hover:text-[#1A1A1A] transition-colors">Report a Bug →</a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
