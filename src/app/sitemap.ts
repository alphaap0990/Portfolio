import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { siteUrl } from "@/data/site";

// Required for `output: "export"` (static hosts such as GitHub / Cloudflare Pages);
// a no-op for the default server build, where this is already static.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...articles.map((a) => ({ url: `${siteUrl}/deep-dives/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
