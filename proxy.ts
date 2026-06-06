import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Request Client Hint so the server can SSR the correct Ant Design theme.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Color-Scheme
 */
export const proxy = (_request: NextRequest) => {
  const response = NextResponse.next();
  response.headers.set("Accept-CH", "Sec-CH-Prefers-Color-Scheme");
  return response;
};
