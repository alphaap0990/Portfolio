import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Required for `output: "export"` (static hosts such as GitHub / Cloudflare Pages);
// a no-op for the default server build, where this is already static.
export const dynamic = "force-static";

// Generated at build time: no binary asset to maintain.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07080a",
          backgroundImage: "radial-gradient(900px 400px at 50% -10%, rgba(86,217,195,0.16), transparent)",
          color: "#edeff1",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              border: "1px solid rgba(86,217,195,0.5)",
              background: "rgba(86,217,195,0.12)",
              color: "#56d9c3",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            AP
          </div>
          <div style={{ fontSize: 30, color: "#a0a7b0" }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>
            AI/ML Engineer building production-grade AI systems.
          </div>
          <div style={{ fontSize: 28, color: "#56d9c3" }}>{site.stackLine}</div>
        </div>
      </div>
    ),
    size,
  );
}
