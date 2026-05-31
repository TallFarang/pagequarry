import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { CtaBlock } from "@/components/blocks/cta-block";
import { EmbedBlock } from "@/components/blocks/embed-block";
import { HeroBlock } from "@/components/blocks/hero-block";
import { MediaCardBlock } from "@/components/blocks/media-card-block";
import { MediaGridBlock } from "@/components/blocks/media-grid-block";
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

  it("renders media cards and grids with theme media classes", () => {
    const cardHtml = renderToStaticMarkup(
      createElement(MediaCardBlock, {
        title: "Dive boat trips",
        body: "Small-group days on the reef.",
        image: { src: "/images/dive-boat.jpg", alt: "Divers boarding a boat" },
        imagePosition: "left",
        action: { href: "/trips", label: "View trips" },
      })
    );
    const gridHtml = renderToStaticMarkup(
      createElement(MediaGridBlock, {
        items: [
          {
            title: "Training dives",
            body: "Skill-building days.",
            image: { src: "/images/training.jpg", alt: "Instructor with divers" },
          },
        ],
      })
    );

    expect(cardHtml).toContain("theme-media-editorial");
    expect(cardHtml).toContain("%2Fimages%2Fdive-boat.jpg");
    expect(gridHtml).toContain("theme-layout-reading");
    expect(gridHtml).toContain("Training dives");
  });

  it("renders embeds with iframe safety attributes and theme surfaces", () => {
    const html = renderToStaticMarkup(
      createElement(EmbedBlock, {
        title: "Example video",
        provider: "youtube",
        src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        aspect: "wide",
        caption: "An example video embed.",
      })
    );

    expect(html).toContain("theme-surface-plain");
    expect(html).toContain("<iframe");
    expect(html).toContain('title="Example video"');
    expect(html).toContain('src="https://www.youtube.com/embed/dQw4w9WgXcQ"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"');
    expect(html).toContain("An example video embed.");
  });
});
