import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

// Required for `output: "export"` (static hosts such as GitHub / Cloudflare Pages);
// a no-op for the default server build, where this is already static.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
