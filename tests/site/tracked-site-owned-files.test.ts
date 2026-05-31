import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const siteOwnedPrefixes = [
  "content/archive/",
  "content/examples/seed/",
  "public/examples/",
  "public/og/",
  "public/site/",
];

const siteOwnedFiles = new Set([
  "site/block-overrides.tsx",
  "site/config.ts",
  "site/template-overrides.tsx",
]);

const allowedTrackedFiles = new Set([
  "content/archive/README.md",
]);

describe("tracked site-owned files", () => {
  it("keeps initialized website files out of the framework branch", () => {
    const tracked = execFileSync("git", ["ls-files"], {
      cwd: process.cwd(),
      encoding: "utf8",
    })
      .trim()
      .split("\n")
      .filter(Boolean);

    const ownedFiles = tracked.filter(
      (file) =>
        fs.existsSync(path.join(process.cwd(), file)) &&
        (siteOwnedPrefixes.some((prefix) => file.startsWith(prefix)) ||
          siteOwnedFiles.has(file)) &&
        !allowedTrackedFiles.has(file)
    );

    expect(ownedFiles).toEqual([]);
  });
});
