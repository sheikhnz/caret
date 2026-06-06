import { headers } from "next/headers";

/** Server-side OS theme hint — Chrome/Edge send Sec-CH-Prefers-Color-Scheme. */
export const getInitialIsDark = async (): Promise<boolean> => {
  const headerStore = await headers();
  return headerStore.get("sec-ch-prefers-color-scheme") === "dark";
};
