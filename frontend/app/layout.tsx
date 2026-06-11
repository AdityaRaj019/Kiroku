import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Noto_Sans_JP, Plus_Jakarta_Sans } from "next/font/google";
import { HydrationGuard } from "@/components/guards/HydrationGuard";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kiroku — Your Manga Tracker",
  description:
    "Track your manga reading progress, discover new series, and never lose your place again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${notoSansJP.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0C]">
        <HydrationGuard>
          <QueryProvider>{children}</QueryProvider>
        </HydrationGuard>
      </body>
    </html>
  );
}

