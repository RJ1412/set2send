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
          <div className="bg-white border border-[#E8E4D9] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1A1A1A] text-[#D4AF37] rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Technical Support</h3>
            <p className="text-[#1A1A1A]/60 text-sm mb-6">
              Need help with setup or experiencing issues? Reach out to our technical team directly.
            </p>
            <a href="mailto:rjishere1412@gmail.com" className="inline-flex items-center gap-2 font-bold text-sm text-[#1A1A1A] hover:text-[#D4AF37] transition-colors">
              rjishere1412@gmail.com
            </a>
          </div>

          {/* Account & Billing */}
          <div className="bg-white border border-[#E8E4D9] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1A1A1A] text-[#D4AF37] rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">General Inquiries</h3>
            <p className="text-[#1A1A1A]/60 text-sm mb-6">
              Questions about our plans, enterprise options, or custom requirements?
            </p>
            <a href="mailto:ujjwalmehta187@gmail.com" className="inline-flex items-center gap-2 font-bold text-sm text-[#1A1A1A] hover:text-[#D4AF37] transition-colors">
              ujjwalmehta187@gmail.com
            </a>
          </div>

          {/* Instagram */}
          <div className="bg-white border border-[#E8E4D9] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-tr from-[#FFB703] via-[#FD1D1D] to-[#833AB4] text-white rounded-xl flex items-center justify-center">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Follow us on Instagram</h3>
                </div>
                <p className="text-[#1A1A1A]/60 text-sm">
                  Stay updated with our latest features, tips, and community highlights.
                </p>
              </div>
              <a 
                href="https://www.instagram.com/set2send/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2 whitespace-nowrap"
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
            <div className="bg-[#FAF9F6] border border-[#E8E4D9] rounded-2xl p-6">
              <HelpCircle className="w-6 h-6 text-[#D4AF37] mb-4" />
              <h4 className="font-bold text-sm mb-2">Need help with setup?</h4>
              <p className="text-[#1A1A1A]/70 text-xs leading-relaxed mb-4">
                Our documentation covers most use cases, but if you're stuck, our tech team is ready to assist you.
              </p>
              <a href="mailto:rjishere1412@gmail.com" className="text-xs font-bold hover:text-[#D4AF37] underline decoration-[#D4AF37]/30 underline-offset-4">Contact Tech Support</a>
            </div>
            
            <div className="bg-[#FAF9F6] border border-[#E8E4D9] rounded-2xl p-6">
              <Handshake className="w-6 h-6 text-[#D4AF37] mb-4" />
              <h4 className="font-bold text-sm mb-2">Partnership inquiries?</h4>
              <p className="text-[#1A1A1A]/70 text-xs leading-relaxed mb-4">
                Looking to partner with Set2Send or integrate our services? We'd love to chat.
              </p>
              <a href="mailto:ujjwalmehta187@gmail.com" className="text-xs font-bold hover:text-[#D4AF37] underline decoration-[#D4AF37]/30 underline-offset-4">Email Partnerships</a>
            </div>

            <div className="bg-[#FAF9F6] border border-[#E8E4D9] rounded-2xl p-6">
              <Bug className="w-6 h-6 text-[#D4AF37] mb-4" />
              <h4 className="font-bold text-sm mb-2">Bug reports?</h4>
              <p className="text-[#1A1A1A]/70 text-xs leading-relaxed mb-4">
                Found something that isn't working right? Let us know so we can fix it immediately.
              </p>
              <a href="mailto:rjishere1412@gmail.com" className="text-xs font-bold hover:text-[#D4AF37] underline decoration-[#D4AF37]/30 underline-offset-4">Report a Bug</a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
