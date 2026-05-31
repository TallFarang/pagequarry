import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const surfaceBlockFiles = [
  "components/blocks/hero-block.tsx",
  "components/blocks/section-copy-block.tsx",
  "components/blocks/cta-block.tsx",
  "components/blocks/quote-block.tsx",
];

function read(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

describe("layout rhythm", () => {
  it("keeps visible block surfaces inside PageContainer rather than on it", () => {
    for (const file of surfaceBlockFiles) {
      const source = read(file);
      const pageContainerTags = source.match(/<PageContainer[\s\S]*?>/g) ?? [];

      expect(pageContainerTags, file).not.toHaveLength(0);
      for (const tag of pageContainerTags) {
        expect(tag, file).not.toContain("activeSurfaceClass");
        expect(tag, file).not.toContain("theme-hero-");
        expect(tag, file).not.toContain("rounded-[var(--panel-radius)]");
        expect(tag, file).not.toContain("border ");
      }
    }
  });

  it("keeps outer max width centralized in PageContainer", () => {
    const checkedFiles = [
      ...surfaceBlockFiles,
      "components/blocks/metric-strip-block.tsx",
      "components/blocks/process-block.tsx",
      "components/site/site-chrome.tsx",
    ];

    for (const file of checkedFiles) {
      const source = read(file);
      const pageContainerTags = source.match(/<PageContainer[\s\S]*?>/g) ?? [];

      for (const tag of pageContainerTags) {
        expect(tag, file).not.toMatch(/\bmax-w-/);
        expect(tag, file).not.toMatch(/\bmx-auto\b/);
        expect(tag, file).not.toMatch(/\bwidth=/);
        expect(tag, file).not.toMatch(/\blayout=/);
      }
    }
  });

  it("does not put independent widths on visible hero surfaces", () => {
    const source = read("components/blocks/hero-block.tsx");
    const heroSurfaceLines = source
      .split("\n")
      .filter((line) => line.includes("theme-hero-"));

    expect(heroSurfaceLines, "hero surface class lines").not.toHaveLength(0);
    for (const line of heroSurfaceLines) {
      expect(line).not.toMatch(/\bmax-w-/);
      expect(line).not.toMatch(/\bmx-auto\b/);
    }
  });
});
