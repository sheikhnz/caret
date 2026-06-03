import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";

import { AntdProvider } from "@/ui/AntdProvider";

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
      <body>
        <AntdRegistry>
          <AntdProvider>{children}</AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
