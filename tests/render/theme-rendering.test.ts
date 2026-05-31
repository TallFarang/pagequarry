import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { CtaBlock } from "@/components/blocks/cta-block";
import { HeroBlock } from "@/components/blocks/hero-block";
import { SectionCopyBlock } from "@/components/blocks/section-copy-block";
import { SiteChrome } from "@/components/site/site-chrome";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("theme rendering", () => {
  it("renders hero blocks with theme-controlled treatment classes", () => {
    const html = renderToStaticMarkup(
      createElement(HeroBlock, {
        eyebrow: "community",
        title: "Build together",
        deck: "Shared pages, templates, and publishing rules.",
        action: { href: "/join", label: "Join" },
      })
    );

    expect(html).toContain("theme-hero-editorial-masthead");
  });

  it("renders section copy and cta blocks with theme surface and motion classes", () => {
    const sectionHtml = renderToStaticMarkup(
      createElement(SectionCopyBlock, {
        eyebrow: "about",
        title: "Reusable content system",
        body: "A paragraph about the shared system.",
      })
    );
    const ctaHtml = renderToStaticMarkup(
      createElement(CtaBlock, {
        title: "Ready to dive?",
        body: "Join the next trip.",
        action: { href: "/join", label: "Join" },
      })
    );

    expect(sectionHtml).toContain("theme-surface-plain");
    expect(ctaHtml).toContain("theme-motion-minimal");
  });

  it("uses the active theme layout for core block containers", () => {
    const html = renderToStaticMarkup(
      createElement(SectionCopyBlock, {
        eyebrow: "about",
        title: "Reusable content system",
        body: "A paragraph about the shared system.",
      })
    );

    expect(html).toContain("theme-layout-reading");
    expect(html).toContain("max-w-4xl");
  });

  it("uses the same active theme layout for header and footer chrome", () => {
    const html = renderToStaticMarkup(
      createElement(SiteChrome, null, createElement("div", null, "page body"))
    );

    expect(html).toContain("page body");
    expect(html).not.toContain("max-w-7xl");
    expect(html.match(/theme-layout-reading/g)).toHaveLength(2);
  });
});
