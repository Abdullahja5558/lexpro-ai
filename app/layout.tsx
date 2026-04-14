import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Viewport Settings: Mobile par zoom issues rokne ke liye
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 2. Full SEO Metadata Object
export const metadata: Metadata = {
  title: {
    default: "Lex Pro | AI Legal Advisor Pakistan",
    template: "%s | Lex Pro",
  },
  description: "Explore Pakistan's legal system with Lex Pro. AI-powered insights into PPC, CrPC, and the Constitution of Pakistan.",
  keywords: [ "" ,"lex pro ai","lex pro ai","Lex pro ai","Pakistan Law", "Legal AI", "PPC Pakistan", "CrPC", "Constitution of Pakistan", "Lex Pro", "Legal Advisor AI"],
  authors: [{ name: "Abdullah Javed" }],
  creator: "Abdullah Javed",
  
  // OpenGraph (WhatsApp/Facebook Preview)
  openGraph: {
    title: "Lex Pro | Advanced Legal AI for Pakistan",
    description: "Get instant answers about Pakistani laws and legal procedures.",
    url: "https://your-lex-pro-link.vercel.app", // Yahan apna actual link daalna
    siteName: "Lex Pro",
    locale: "en_PK",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Lex Pro | AI Legal Advisor",
    description: "The most advanced AI interface for the Constitution of Pakistan.",
  },

  // Robots (Google ko batane ke liye kya index karna hai)
  robots: {
    index: true,
    follow: true,
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
      suppressHydrationWarning={true}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}