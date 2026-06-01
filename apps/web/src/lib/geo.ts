import { headers } from "next/headers";

/**
 * Detect the visitor's country code from request headers.
 *
 * Works on:
 *  - Vercel (x-vercel-ip-country)
 *  - Cloudflare (cf-ipcountry)
 *  - Netlify (x-country)
 *  - Custom reverse proxies (x-country-code)
 *  - Cloudflare also sends x-forwarded-country on some setups
 *
 * Returns "US" as a safe default because the most-used crisis line
 * (988) is US-specific.
 */
export async function getUserCountry(): Promise<string> {
  try {
    const h = await headers();
    return (
      h.get("x-vercel-ip-country") ??
      h.get("cf-ipcountry") ??
      h.get("x-country") ??
      h.get("x-country-code") ??
      h.get("x-forwarded-country") ??
      "US"
    ).toUpperCase();
  } catch {
    return "US";
  }
}
