import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * One honest compromise, called out rather than hidden: `script-src` still
 * allows `'unsafe-inline'`. Next injects inline bootstrap and flight-data
 * scripts on every page, and the only way to lock those down is a per-request
 * nonce — which requires generating the nonce in proxy.ts and therefore makes
 * every page dynamic, giving up static generation for the whole marketing site.
 * That trade isn't worth it while the site holds no scriptable user input; the
 * moment it does (rich text, an embed field, anything rendered as HTML), this
 * is the first thing to revisit.
 *
 * Everything else is genuinely restrictive, and the four directives that stop
 * the attacks this app can actually face — clickjacking a signed-in assessor,
 * exfiltrating a report to another origin, hijacking a form post, rewriting
 * relative URLs — are all fully enforced.
 */
const CSP = [
  "default-src 'self'",
  // 'unsafe-eval' is not granted; see the note above on 'unsafe-inline'.
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  // Tailwind and next/font emit inline styles.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  // The Anthropic API is called server-side only, so it needs no allowance here.
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  // Two years, preloadable. Vercel terminates TLS, so this is safe to assert.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Redundant with frame-ancestors above, kept for browsers that honour only this.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // Isolates this origin from cross-origin window handles.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // Assessment and lead data must never be cached by a shared proxy, and
        // must not sit in a browser's back/forward cache after sign-out.
        source: "/(admin|assessor)/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate, private" }],
      },
    ];
  },
};

export default nextConfig;
