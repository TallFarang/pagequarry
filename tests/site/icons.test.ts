import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  IBM_Plex_Mono: () => ({ variable: "--font-test" }),
  Libre_Baskerville: () => ({ variable: "--font-test" }),
  Manrope: () => ({ variable: "--font-test" }),
  Public_Sans: () => ({ variable: "--font-test" }),
  Source_Serif_4: () => ({ variable: "--font-test" }),
  Space_Grotesk: () => ({ variable: "--font-test" }),
}));

import manifest from "@/app/manifest";
import { metadata } from "@/app/layout";
import { siteConfig } from "@/site/config";

describe("site icon configuration", () => {
  it("exposes site-owned icon assets from config", () => {
    expect(siteConfig.manifest.icons).toEqual({
      apple: {
        sizes: "180x180",
        src: "/site/apple-icon.svg",
        type: "image/svg+xml",
      },
      icon: {
        sizes: "any",
        src: "/site/icon.svg",
        type: "image/svg+xml",
      },
    });
  });

  it("uses configured icons for Next metadata and web manifest", () => {
    expect(metadata.icons).toEqual({
      apple: "/site/apple-icon.svg",
      icon: "/site/icon.svg",
      shortcut: "/site/icon.svg",
    });

    expect(manifest().icons).toEqual([
      {
        sizes: "any",
        src: "/site/icon.svg",
        type: "image/svg+xml",
      },
      {
        sizes: "180x180",
        src: "/site/apple-icon.svg",
        type: "image/svg+xml",
      },
    ]);
  });
});
