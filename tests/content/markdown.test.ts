import crypto from "node:crypto";

import { describe, expect, it } from "vitest";

import { parseDraftSource } from "@/lib/content/markdown";
import { genericDrafts } from "@/tests/helpers/temp-root";

describe("parseDraftSource", () => {
  it("accepts a valid home fixture", () => {
    const source = genericDrafts.home;
    const result = parseDraftSource({
      revisionId: "rev-home",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.pageId).toBe("home");
      expect(result.page.slug).toBe("/");
      expect(result.page.template).toBe("home");
      expect(result.page.blocks.map((block) => block.type)).toEqual([
        "hero",
        "metrics",
        "sectionCopy",
        "process",
        "quote",
        "cta",
      ]);
    }
  });

  it("accepts expanded metadata frontmatter and resolves defaults", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /docs/publishing",
      "page_id: docs-publishing",
      "status: published",
      "title: publishing workflow",
      "description: how to validate and publish a page safely through the content pipeline",
      "summary: stage drafts, lint them, and accept them without touching generated runtime files",
      "seo_title: publishing workflow for a structured site",
      "canonical_url: /docs/publishing",
      "robots: noindex",
      "social_title: publishing workflow",
      "social_description: stage drafts, lint them, and accept them without touching generated runtime files",
      "social_image: guide",
      "twitter_card: summary_large_image",
      "author: Example Team",
      "published_at: 2026-04-13T00:00:00Z",
      "updated_at: 2026-04-14T00:00:00Z",
      "redirect_from:",
      "  - /guides/publishing",
      "---",
      "",
      '{% hero eyebrow="example guide" title="publishing workflow" deck="..." actionHref="/contact" actionLabel="contact" /%}',
      "",
      '{% sectionCopy eyebrow="guide" title="what it is" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="contact" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-metadata",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.status).toBe("published");
      expect(result.page.redirectFrom).toEqual(["/guides/publishing"]);
      expect(result.page.meta.summary).toBe("stage drafts, lint them, and accept them without touching generated runtime files");
      expect(result.page.meta.seoTitle).toBe(
        "publishing workflow for a structured site"
      );
      expect(result.page.meta.canonicalUrl).toContain("/docs/publishing");
      expect(result.page.meta.robots).toEqual({ follow: true, index: false });
      expect(result.page.meta.social.title).toBe("publishing workflow");
      expect(result.page.meta.social.imageVariant).toBe("guide");
      expect(result.page.meta.social.twitterCard).toBe("summary_large_image");
      expect(result.page.meta.author).toBe("Example Team");
      expect(result.page.meta.publishedAt).toBe("2026-04-13T00:00:00Z");
      expect(result.page.meta.updatedAt).toBe("2026-04-14T00:00:00Z");
    }
  });

  it("parses hero image attributes and a supporting section image", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /reef",
      "title: reef guide",
      "description: how to prepare for a reef trip",
      "---",
      "",
      '{% hero eyebrow="reef" title="Dive the reef" deck="Small-group reef trips." imageSrc="/images/reef.jpg" imageAlt="Divers above a reef" imageCaption="Morning conditions on the outer reef" imageMode="background" imageOverlay="soft" actionHref="/contact" actionLabel="Book" /%}',
      "",
      '{% sectionCopy eyebrow="prepare" title="What to bring" imageSrc="/images/kit.jpg" imageAlt="Dive kit on a bench" imageCaption="Pack light and check your gear" imagePosition="right" %}',
      "Bring the basics and keep the deck clear.",
      "{% /sectionCopy %}",
      "",
      '{% cta title="Ready?" body="Talk to the team." actionHref="/contact" actionLabel="Contact" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-media-attrs",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.blocks[0]).toMatchObject({
        image: {
          alt: "Divers above a reef",
          caption: "Morning conditions on the outer reef",
          src: "/images/reef.jpg",
        },
        imageMode: "background",
        imageOverlay: "soft",
        type: "hero",
      });
      expect(result.page.blocks[1]).toMatchObject({
        image: {
          alt: "Dive kit on a bench",
          caption: "Pack light and check your gear",
          src: "/images/kit.jpg",
        },
        imagePosition: "right",
        type: "sectionCopy",
      });
    }
  });

  it("parses standalone media cards and media grids", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /trips",
      "title: trip guide",
      "description: pick the right trip",
      "---",
      "",
      '{% hero eyebrow="trips" title="Choose a trip" deck="Find the right day on the water." /%}',
      "",
      '{% mediaCard title="Dive boat trips" body="Small-group days on the reef." imageSrc="/images/dive-boat.jpg" imageAlt="Divers boarding a boat" imagePosition="left" actionHref="/trips/boat" actionLabel="View trips" /%}',
      "",
      "{% mediaGrid %}",
      '{% mediaCard title="Training dives" body="Skill-building days." imageSrc="/images/training.jpg" imageAlt="Instructor with divers" imagePosition="top" /%}',
      '{% mediaCard title="Whale shark season" body="A seasonal highlight." imageSrc="/images/whale-shark.jpg" imageAlt="Divers near a whale shark" imagePosition="background" imageCaption="Conditions vary by season" /%}',
      "{% /mediaGrid %}",
      "",
      '{% sectionCopy title="Details" %}',
      "Pick the trip that fits your certification and comfort.",
      "{% /sectionCopy %}",
      "",
      '{% cta title="Ready?" body="Talk to the team." actionHref="/contact" actionLabel="Contact" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-media-blocks",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.blocks.map((block) => block.type)).toEqual([
        "hero",
        "mediaCard",
        "mediaGrid",
        "sectionCopy",
        "cta",
      ]);
      expect(result.page.blocks[1]).toMatchObject({
        action: { href: "/trips/boat", label: "View trips" },
        image: { alt: "Divers boarding a boat", src: "/images/dive-boat.jpg" },
        imagePosition: "left",
        type: "mediaCard",
      });
      expect(result.page.blocks[2]).toMatchObject({
        items: [
          { image: { src: "/images/training.jpg" }, title: "Training dives" },
          {
            image: {
              caption: "Conditions vary by season",
              src: "/images/whale-shark.jpg",
            },
            imagePosition: "background",
            title: "Whale shark season",
          },
        ],
        type: "mediaGrid",
      });
    }
  });

  it("rejects invalid media options and mediaGrid children", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /bad-media",
      "title: bad media",
      "description: invalid media should fail",
      "---",
      "",
      '{% hero eyebrow="bad" title="Bad media" deck="..." imageSrc="/images/hero.jpg" imageMode="poster" /%}',
      "",
      "{% mediaGrid %}",
      '{% linkItem href="/x" label="not a media card" /%}',
      "{% /mediaGrid %}",
      "",
      '{% sectionCopy title="Body" imageSrc="/images/body.jpg" imagePosition="background" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="Ready?" body="Talk to the team." actionHref="/contact" actionLabel="Contact" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-bad-media",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("imageMode"))).toBe(true);
      expect(result.issues.some((issue) => issue.message.includes("mediaGrid may only contain mediaCard"))).toBe(true);
      expect(result.issues.some((issue) => issue.message.includes("sectionCopy imagePosition"))).toBe(true);
    }
  });

  it("parses and normalizes YouTube embeds from share urls", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /video",
      "title: video guide",
      "description: a page with a video embed",
      "---",
      "",
      '{% hero eyebrow="video" title="Watch the briefing" deck="A neutral video page." /%}',
      "",
      '{% sectionCopy title="Before you go" %}',
      "Watch the briefing before the next step.",
      "{% /sectionCopy %}",
      "",
      '{% embed title="Example video" provider="youtube" src="https://youtu.be/dQw4w9WgXcQ?si=bk_0seWPAck53fJA" aspect="wide" caption="An example video embed." /%}',
      "",
      '{% cta title="Ready?" body="Talk to the team." actionHref="/contact" actionLabel="Contact" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-embed-youtube",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.blocks[2]).toMatchObject({
        aspect: "wide",
        caption: "An example video embed.",
        provider: "youtube",
        src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Example video",
        type: "embed",
      });
    }
  });

  it("rejects embed urls that do not match their provider", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /bad-embed",
      "title: bad embed",
      "description: invalid embeds should fail",
      "---",
      "",
      '{% hero eyebrow="embed" title="Bad embed" deck="..." /%}',
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% embed title="Bad embed" provider="youtube" src="https://calendar.google.com/calendar/embed?src=test" aspect="wide" /%}',
      "",
      '{% embed title="Insecure embed" provider="youtube" src="http://www.youtube.com/embed/dQw4w9WgXcQ" /%}',
      "",
      '{% cta title="Ready?" body="Talk to the team." actionHref="/contact" actionLabel="Contact" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-bad-embed",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("youtube embeds must use"))).toBe(true);
      expect(result.issues.some((issue) => issue.message.includes("must be an https url"))).toBe(true);
    }
  });

  it("rejects invalid metadata fields and redirect aliases", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /guide",
      "status: hidden",
      "title: guide",
      "description: desc",
      "canonical_url: not-a-url",
      "robots: maybe",
      "social_image: made-up",
      "twitter_card: giant",
      "published_at: yesterday",
      "redirect_from:",
      "  - /guide",
      "  - /guide",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-bad-metadata",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((entry) => entry.message.includes("frontmatter status"))).toBe(true);
      expect(result.issues.some((entry) => entry.message.includes("frontmatter canonical_url"))).toBe(
        true
      );
      expect(result.issues.some((entry) => entry.message.includes("frontmatter robots"))).toBe(true);
      expect(result.issues.some((entry) => entry.message.includes("frontmatter social_image"))).toBe(
        true
      );
      expect(result.issues.some((entry) => entry.message.includes("frontmatter twitter_card"))).toBe(
        true
      );
      expect(result.issues.some((entry) => entry.message.includes("frontmatter published_at"))).toBe(
        true
      );
      expect(result.issues.some((entry) => entry.message.includes("redirect_from"))).toBe(true);
    }
  });

  it("rejects malformed frontmatter", () => {
    const source = [
      "---",
      "template: home",
      "slug: /",
      "title",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-bad-frontmatter",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("frontmatter is invalid yaml"))).toBe(true);
    }
  });

  it("rejects root-level prose outside approved tags", () => {
    const source = [
      "---",
      "template: hub",
      "slug: /features",
      "title: features",
      "description: desc",
      "---",
      "",
      "hello world",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-root-text",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.some((issue) =>
          issue.message.includes("document body may contain only approved block tags")
        )
      ).toBe(true);
    }
  });

  it("rejects invalid template block order", () => {
    const source = [
      "---",
      "template: home",
      "slug: /",
      "title: home",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-home-order",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("home requires metrics"))).toBe(true);
      expect(result.issues.some((issue) => issue.message.includes("home requires one process block"))).toBe(true);
    }
  });

  it("rejects ordered lists in sectionCopy", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /guide",
      "title: guide",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "",
      "1. bad",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-ordered-list",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.some((issue) => issue.message.includes("sectionCopy lists must be unordered"))
      ).toBe(true);
    }
  });

  it("rejects reserved slugs", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /_next",
      "title: reserved",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-reserved",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("is reserved"))).toBe(true);
    }
  });

  it("rejects partial hero actions and pages with no valid blocks", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /empty",
      "title: empty",
      "description: desc",
      "---",
      "",
      "just prose",
      "",
      '{% hero eyebrow="x" title="y" deck="z" actionHref="/contact" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-empty",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.some((issue) => issue.message.includes("document body may contain only approved block tags"))
      ).toBe(true);
      expect(
        result.issues.some((issue) => issue.message.includes("actionHref and actionLabel must be provided together"))
      ).toBe(true);
    }
  });

  it("rejects a page that has no valid blocks at all", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /empty",
      "title: empty",
      "description: desc",
      "---",
      "",
      "just prose",
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-no-blocks",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("page blocks"))).toBe(true);
    }
  });

  it("rejects empty and malformed process blocks", () => {
    const emptyProcess = [
      "---",
      "template: narrative",
      "slug: /process-empty",
      "title: process empty",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% process eyebrow="x" title="flow" %}',
      "{% /process %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");
    const wrongChildProcess = emptyProcess.replace("{% /process %}", '{% metric label="x" value="y" /%}\n{% /process %}');

    const emptyResult = parseDraftSource({
      revisionId: "rev-process-empty",
      source: emptyProcess,
      sourceHash: crypto.createHash("sha256").update(emptyProcess).digest("hex"),
    });
    const childResult = parseDraftSource({
      revisionId: "rev-process-child",
      source: wrongChildProcess,
      sourceHash: crypto.createHash("sha256").update(wrongChildProcess).digest("hex"),
    });

    expect(emptyResult.ok).toBe(false);
    expect(childResult.ok).toBe(false);
    if (!emptyResult.ok) {
      expect(emptyResult.issues.some((issue) => issue.message.includes("process must contain"))).toBe(true);
    }
    if (!childResult.ok) {
      expect(childResult.issues.some((issue) => issue.message.includes("process may only contain"))).toBe(true);
    }
  });

  it("rejects invalid sectionCopy children and bullet-only sections", () => {
    const invalidChild = [
      "---",
      "template: guide",
      "slug: /bad-section",
      "title: bad section",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      '{% metric label="x" value="y" /%}',
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");
    const bulletOnly = invalidChild.replace('{% metric label="x" value="y" /%}', "- only a bullet");

    const invalidChildResult = parseDraftSource({
      revisionId: "rev-invalid-section-child",
      source: invalidChild,
      sourceHash: crypto.createHash("sha256").update(invalidChild).digest("hex"),
    });
    const bulletOnlyResult = parseDraftSource({
      revisionId: "rev-bullet-only",
      source: bulletOnly,
      sourceHash: crypto.createHash("sha256").update(bulletOnly).digest("hex"),
    });

    expect(invalidChildResult.ok).toBe(false);
    expect(bulletOnlyResult.ok).toBe(false);
    if (!invalidChildResult.ok) {
      expect(
        invalidChildResult.issues.some((issue) => issue.message.includes("sectionCopy may contain only"))
      ).toBe(true);
    }
    if (!bulletOnlyResult.ok) {
      expect(
        bulletOnlyResult.issues.some((issue) => issue.message.includes("sectionCopy requires at least one body paragraph"))
      ).toBe(true);
    }
  });

  it("rejects invalid metrics children", () => {
    const source = [
      "---",
      "template: caseStudy",
      "slug: /bad-metrics",
      "title: bad metrics",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      "{% metrics %}",
      '{% step title="x" body="y" /%}',
      "{% /metrics %}",
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-bad-metrics",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("metrics may only contain metric child tags"))).toBe(true);
    }
  });

  it("rejects empty metrics blocks", () => {
    const source = [
      "---",
      "template: caseStudy",
      "slug: /empty-metrics",
      "title: empty metrics",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      "{% metrics %}",
      "{% /metrics %}",
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-empty-metrics",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("metrics must contain at least one metric child tag"))).toBe(true);
    }
  });

  it("rejects unknown top-level tags without crashing", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /unknown-top-level",
      "title: unknown top level",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% madeUpBlock title="nope" /%}',
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-unknown-top-level",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("unknown top-level tag"))).toBe(true);
    }
  });
});
