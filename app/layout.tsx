import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "MonkeyType — Next.js",
  description: "A modern typing test built with Next.js 16",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
