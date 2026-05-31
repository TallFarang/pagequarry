import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const siteOwnedPrefixes = [
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

  it("keeps active accepted archive pages out of framework main", () => {
    const tracked = execFileSync("git", ["ls-files", "content/archive"], {
      cwd: process.cwd(),
      encoding: "utf8",
    })
      .trim()
      .split("\n")
      .filter(Boolean);

    expect(tracked).toEqual(["content/archive/README.md"]);
  });

  it("allows accepted archive markdown to be committed by downstream sites", () => {
    const deployableArchivePaths = [
      "content/archive/contact/current.md",
      "content/archive/contact/revisions/20260413-101213218-example.md",
    ];

    const ignored = deployableArchivePaths.filter((file) => {
      const result = spawnSync("git", ["check-ignore", "--no-index", file], {
        cwd: process.cwd(),
        encoding: "utf8",
      });

      return result.status === 0;
    });

    expect(ignored).toEqual([]);
  });
});
