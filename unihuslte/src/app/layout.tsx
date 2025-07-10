import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniHuslte - The Student Marketplace for Nigeria",
  description: "Buy and sell products and services in your university. The student-powered marketplace for Nigeria.",
  keywords: "student marketplace, university, Nigeria, buy, sell, textbooks, electronics, services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navigation />
        <main className="mobile-bottom-padding">
          {children}
        </main>
      </body>
    </html>
  );
}
