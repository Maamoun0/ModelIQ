import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ModelIQ — AI Models Intelligence Platform",
  description: "Compare, explore, and find the best AI model for your needs. Pricing, benchmarks, and side-by-side comparison for GPT-4, Claude, Gemini, Llama, and more.",
  keywords: "AI models, compare AI, GPT-4, Claude, Gemini, AI benchmarks, AI pricing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 72px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
