import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // The site is fully prerendered, so it also runs as a pure static export for hosts with
  // no Next.js runtime (GitHub Pages, Cloudflare Pages, any static bucket):
  //   output: "export"
  // `npm run build` then emits ./out. Two caveats on that path:
  //   1. the OG image is written as `out/opengraph-image` with no extension, so hosts that
  //      guess content-type from the filename may serve it wrong and break link previews;
  //   2. on a project subpath (e.g. user.github.io/Portfolio) also set
  //      basePath: "/Portfolio" and assetPrefix: "/Portfolio".
};

export default nextConfig;
