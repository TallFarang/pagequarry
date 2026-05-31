import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Libre_Baskerville,
  Manrope,
  Public_Sans,
  Source_Serif_4,
  Space_Grotesk,
} from "next/font/google";

import { StructuredData } from "@/components/site/structured-data";
import { SiteChrome } from "@/components/site/site-chrome";
import { buildSiteStructuredData } from "@/lib/content/metadata";
import { siteConfig } from "@/site/config";
import { activeSiteTheme } from "@/site/theme-runtime";

import "./globals.css";

const bodyFont = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-site-skeleton-body",
});

const displayFont = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-site-skeleton-display",
});

const utilityFont = IBM_Plex_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-site-skeleton-utility",
  weight: ["400", "500", "600"],
});

const editorialSerifFont = Source_Serif_4({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-site-skeleton-editorial-serif",
});

const editorialBodyFont = Libre_Baskerville({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-site-skeleton-editorial-body",
  weight: ["400", "700"],
});

const studioFont = Public_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-site-skeleton-studio",
});

export const metadata: Metadata = {
  applicationName: siteConfig.manifest.name,
  authors: [{ name: siteConfig.metadata.defaultAuthor }],
  description: siteConfig.identity.description,
  icons: {
    apple: siteConfig.manifest.icons.apple.src,
    icon: siteConfig.manifest.icons.icon.src,
    shortcut: siteConfig.manifest.icons.icon.src,
  },
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(siteConfig.identity.siteUrl),
  openGraph: {
    description: siteConfig.identity.description,
    images: [siteConfig.social.images.site.path],
    locale: siteConfig.identity.locale,
    siteName: siteConfig.social.siteName,
    title: siteConfig.identity.title,
    type: "website",
    url: siteConfig.identity.siteUrl,
  },
  robots: siteConfig.metadata.robots,
  title: {
    default: siteConfig.identity.title,
    template: `%s | ${siteConfig.identity.title}`,
  },
  twitter: {
    card: siteConfig.social.defaultTwitterCard,
    description: siteConfig.identity.description,
    images: [siteConfig.social.images.site.path],
    title: siteConfig.identity.title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${bodyFont.variable} ${displayFont.variable} ${utilityFont.variable} ${editorialSerifFont.variable} ${editorialBodyFont.variable} ${studioFont.variable}`}
      data-theme={activeSiteTheme.name}
      lang="en"
    >
      <body className="m-0 min-h-screen font-sans text-foreground antialiased">
        <StructuredData items={buildSiteStructuredData()} />
        <div className="site-atmosphere relative isolate min-h-screen overflow-hidden">
          <div className="relative flex min-h-screen flex-col">
            <SiteChrome>{children}</SiteChrome>
          </div>
        </div>
      </body>
    </html>
  );
}
