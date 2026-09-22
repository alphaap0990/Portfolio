import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { isPlaceholder, site, siteUrl } from "@/data/site";
import { MotionProvider } from "@/components/ui/Reveal";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const sameAs = [site.links.linkedin, site.links.github].filter((l) => !isPlaceholder(l));

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  email: `mailto:${site.email}`,
  ...(isPlaceholder(site.url) ? {} : { url: site.url }),
  ...(sameAs.length ? { sameAs } : {}),
  worksFor: { "@type": "Organization", name: "UnitedHealthcare" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Purdue University Northwest" },
    { "@type": "CollegeOrUniversity", name: "Gokaraju Rangaraju Institute of Engineering and Technology" },
  ],
  knowsAbout: [
    "Generative AI",
    "Large language models",
    "Retrieval-augmented generation",
    "Machine learning",
    "MLOps",
    "Natural language processing",
    "AWS",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <noscript>
          {/* Without JS the scroll-reveal never fires, so keep everything visible. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-fg"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
