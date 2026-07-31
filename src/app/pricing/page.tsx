import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PricingPage from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing — set2send",
  description: "set2send pricing: Instagram automation and WhatsApp bulk messaging plans for Indian creators, D2C brands and agencies. Start free, pay only for what you use.",
};

export default function Page() {
  return (
    <>
      <Navbar />
      <PricingPage />
      <Footer />
    </>
  );
}
