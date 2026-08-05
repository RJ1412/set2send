import type { Metadata } from "next";
import Script from "next/script";
import Providers from "./Providers";
import "./globals.css";
import "@xyflow/react/dist/style.css";

export const metadata: Metadata = {
  title: "Set2Send — Premium Chat Automation Platform",
  description: "Set2Send automates marketing conversations on Instagram, WhatsApp, Messenger, and TikTok to scale audience and grow revenue.",
  metadataBase: new URL("https://www.set2send.com"),
  openGraph: {
    title: "Set2Send — Premium Chat Automation Platform",
    description: "Set2Send automates marketing conversations on Instagram, WhatsApp, Messenger, and TikTok to scale audience and grow revenue.",
    url: "https://www.set2send.com",
    siteName: "Set2Send",
    images: [
      {
        url: "/hero_poster.png",
        width: 1200,
        height: 630,
        alt: "Set2Send - Chat Automation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Set2Send — Premium Chat Automation Platform",
    description: "Set2Send automates marketing conversations on Instagram, WhatsApp, Messenger, and TikTok to scale audience and grow revenue.",
    images: ["/hero_poster.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className="h-full antialiased"
      >
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=JetBrains+Mono:wght@400&family=Manrope:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap" rel="stylesheet" />
        </head>
        <body className="min-h-full flex flex-col font-sans">
          <Providers>
            {children}
          </Providers>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />
        </body>
      </html>
  );
}

