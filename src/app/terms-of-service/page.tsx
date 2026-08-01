import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsOfService() {
  return (
    <div className="bg-white min-h-screen text-zinc-900 font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-32">
        <h1 className="text-4xl font-bold mb-8 text-[#0f1117]">Terms of Service</h1>
        <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-2xl font-semibold text-[#0f1117] mt-8 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#0f1117] mt-8 mb-4">2. Acceptable Use</h2>
            <p>
              You agree to use set2send in compliance with all applicable platform rules, specifically including Meta's Terms of Service for Instagram and WhatsApp Business APIs. You must not use our platform to send spam, unsolicited promotional messages, or prohibited content.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#0f1117] mt-8 mb-4">3. Subscriptions and Payments</h2>
            <p>
              Fees are billed in advance on a recurring basis (monthly or annually). We reserve the right to change our subscription plans or adjust pricing for our service in any manner and at any time as we may determine in our sole discretion.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#0f1117] mt-8 mb-4">4. Account Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms, particularly those relating to platform spam rules.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
