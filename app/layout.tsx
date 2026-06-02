import type { Metadata } from "next";

import { Roboto_Mono } from "next/font/google";

import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "monkeytype",
  description: "A typing speed test",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={robotoMono.variable}>
      <body>{children}</body>
    </html>
  );
}
