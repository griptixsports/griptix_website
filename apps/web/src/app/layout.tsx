import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design Academy",
  description: "Elevate your design skills with top curated courses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
