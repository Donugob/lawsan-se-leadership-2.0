import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/components/providers/ToasterProvider";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://llc.lawsan-se.com.ng"),
  title: {
    default: "Lawsan SE Leadership Conference 2.0",
    template: "%s | Lawsan SE 2.0"
  },
  description: "Emerging Lawyers, Emerging Realities. Join the premier gathering of future legal leaders in South East Nigeria at Godfrey Okoye University, Enugu.",
  keywords: ["Lawsan SE", "Leadership Conference 2.0", "Godfrey Okoye University", "Enugu Law Students", "Nigerian Law Students"],
  authors: [{ name: "Lawsan SE" }],
  creator: "Lawsan SE",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://llc.lawsan-se.com.ng",
    title: "Lawsan SE Leadership Conference 2.0 | Excellence in Motion",
    description: "Emerging Lawyers, Emerging Realities. Register now for the premier legal leadership event in Enugu.",
    siteName: "Lawsan SE 2.0",
    images: [
      {
        url: "https://i.postimg.cc/R0dd7Hkt/8017b435-46e1-481f-bcdc-ac8dac50ecf0.jpg",
        width: 1200,
        height: 630,
        alt: "Lawsan SE Leadership Conference 2.0 Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lawsan SE Leadership Conference 2.0",
    description: "Emerging Lawyers, Emerging Realities. June 6th, 2026.",
    images: ["https://i.postimg.cc/R0dd7Hkt/8017b435-46e1-481f-bcdc-ac8dac50ecf0.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${outfit.variable} antialiased`}
      >
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
