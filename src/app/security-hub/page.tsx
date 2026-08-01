import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShieldCheck, Lock, Server } from "lucide-react";

export default function SecurityHub() {
  return (
    <div className="bg-white min-h-screen text-zinc-900 font-sans">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-[#0f1117]">Security Hub</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Enterprise-grade security built into every layer of our platform. We keep your data safe so you can focus on growing your business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 border border-zinc-200 rounded-xl bg-zinc-50">
            <div className="w-12 h-12 bg-[#EEF8F3] text-[#2A7D4F] rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Data Encryption</h3>
            <p className="text-sm text-zinc-600">
              All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Your credentials and customer data are always secure.
            </p>
          </div>
          <div className="p-6 border border-zinc-200 rounded-xl bg-zinc-50">
            <div className="w-12 h-12 bg-[#EEF3FB] text-[#2B5FA0] rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Platform Compliance</h3>
            <p className="text-sm text-zinc-600">
              We strictly adhere to Meta's API guidelines and maintain full compliance with GDPR and CCPA privacy standards for customer data handling.
            </p>
          </div>
          <div className="p-6 border border-zinc-200 rounded-xl bg-zinc-50">
            <div className="w-12 h-12 bg-[#FDF8EE] text-[#9A7B3A] rounded-lg flex items-center justify-center mb-4">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Reliable Infrastructure</h3>
            <p className="text-sm text-zinc-600">
              Our infrastructure is hosted on AWS with 99.99% uptime guarantees, automated daily backups, and multi-region redundancy.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
