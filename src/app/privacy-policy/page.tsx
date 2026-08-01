import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen text-zinc-900 font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-32">
        <h1 className="text-4xl font-bold mb-8 text-[#0f1117]">Privacy Policy</h1>
        <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-2xl font-semibold text-[#0f1117] mt-8 mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, subscribe to our services, request customer support, or otherwise communicate with us. This includes your name, email address, password, and Instagram/WhatsApp account details needed for automation.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#0f1117] mt-8 mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our automation services. This includes processing transactions, sending technical notices and support messages, and analyzing usage trends to enhance user experience.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#0f1117] mt-8 mb-4">3. Data Sharing and Meta Integration</h2>
            <p>
              To provide our core services, we integrate with Meta's APIs (Instagram and WhatsApp). Data is processed in accordance with Meta's developer terms. We do not sell your personal information or your audience's data to third parties.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[#0f1117] mt-8 mb-4">4. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@set2send.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
