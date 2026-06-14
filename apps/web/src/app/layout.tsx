import dynamic from "next/dynamic";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import AgentationClient from "../components/AgentationClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://griptix.in"),
  title: "Griptix - 3D Product Showcase by Mohit Malik",
  description: "Explore Griptix, the custom-crafted 3D sport shooting grip engineered for Olympic-level stability, ISSF compliance, and ergonomic perfection.",
  openGraph: {
    title: "Griptix - 3D Product Showcase by Mohit Malik",
    description: "Explore Griptix, the custom-crafted 3D sport shooting grip engineered for Olympic-level stability, ISSF compliance, and ergonomic perfection.",
    images: [
      {
        url: "/images/griptix-social.jpg",
        width: 1200,
        height: 630,
        alt: "Griptix 3D Product Showcase",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Griptix - 3D Product Showcase by Mohit Malik",
    description: "Explore Griptix, the custom-crafted 3D sport shooting grip engineered for Olympic-level stability, ISSF compliance, and ergonomic perfection.",
    images: ["/images/griptix-social.jpg"],
  },
  icons: {
    icon: "/images/logo.jpeg",
    apple: "/images/logo.jpeg",
  },
  other: {
    "msapplication-TileColor": "#D4B895",
  },
};

export const viewport: Viewport = {
  themeColor: "#D4B895",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display+SC:wght@400;700;900&family=Qwitcher+Grypen:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <AgentationClient />}
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
