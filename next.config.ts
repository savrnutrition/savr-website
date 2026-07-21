import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // frame-ancestors 'self' only — NOT a full CSP (script-src etc. are
          // deliberately left unset). Sanity's Presentation tool embeds the
          // live site in an iframe from /studio on this same origin, so a
          // blanket X-Frame-Options: DENY/SAMEORIGIN-everywhere or a strict
          // CSP would break that; this permits same-origin framing only and
          // blocks any other site from framing this one.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
