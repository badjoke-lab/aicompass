import "./globals.css";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AI Model Scoreboard",
  description:
    "Independent AI model rankings focused on transparent evidence, open metrics, and meaningful deltas."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-slate-100">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
