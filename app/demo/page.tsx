import type { Metadata } from "next";

import { PgDemo } from "@/views/pg-demo";

export const metadata: Metadata = {
  title: "Playground demo — Typing Practice",
  description: "Demo page with extra content around the typing playground.",
};

export default function DemoPage() {
  return <PgDemo />;
}
