import type { Metadata } from "next";

import { AppProviders } from "@/providers";
import { ThemeStyle } from "@/ui/ThemeStyle";

import "./globals.css";

export const metadata: Metadata = {
  title: "Typing Practice",
  description: "A minimal typing speed test with live stats and results.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeStyle />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
