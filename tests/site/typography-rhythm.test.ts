import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

function read(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

describe("theme typography rhythm", () => {
  it("does not hard-code generic font families in shared text variants", () => {
    const source = read("components/site/text.tsx");

    expect(source).not.toMatch(/\bfont-mono\b/);
    expect(source).not.toMatch(/\bfont-serif\b/);
    expect(source).not.toMatch(/\bfont-sans\b/);
  });

  it("does not bypass typography roles in shared block or chrome components", () => {
    const checkedFiles = [
      "components/blocks/hero-block.tsx",
      "components/blocks/section-copy-block.tsx",
      "components/blocks/metric-strip-block.tsx",
      "components/blocks/process-block.tsx",
      "components/blocks/quote-block.tsx",
      "components/blocks/cta-block.tsx",
      "components/site/site-chrome.tsx",
    ];

    for (const file of checkedFiles) {
      const source = read(file);

      expect(source, file).not.toMatch(/\bfont-mono\b/);
      expect(source, file).not.toMatch(/\bfont-serif\b/);
      expect(source, file).not.toMatch(/\bfont-sans\b/);
    }
  });

  it("exposes semantic font roles through global theme tokens", () => {
    const source = read("app/globals.css");

    for (const role of ["brand", "label", "heading", "nav", "metric"]) {
      expect(source).toContain(`--font-${role}:`);
      expect(source).toContain(`.font-${role}`);
      expect(source).toContain(`font-family: var(--font-${role});`);
    }
  });

  it("keeps the ocean theme away from monospace utility roles", () => {
    const source = read("app/globals.css");
    const oceanBlock = source.match(/\[data-theme="ocean"\] \{[\s\S]*?\n\}/)?.[0] ?? "";

    expect(oceanBlock).toContain("--font-brand: var(--font-body);");
    expect(oceanBlock).toContain("--font-label: var(--font-body);");
    expect(oceanBlock).toContain("--font-nav: var(--font-body);");
    expect(oceanBlock).not.toContain("--font-utility");
    expect(oceanBlock).not.toContain("Mono");
    expect(oceanBlock).not.toContain("monospace");
  });
});
