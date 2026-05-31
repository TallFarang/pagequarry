import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const forbiddenTerms = [
  ["Page", "Quarry"].join(""),
  ["page", "quarry"].join(""),
  ["hello", "@", "page", "quarry", ".com"].join(""),
  ["juan", "-", "deere"].join(""),
  ["community", "-", "knowledge", "-", "base"].join(""),
  ["product", "-", "docs", "-", "hub"].join(""),
];

const ignoredDirs = new Set([
  ".git",
  ".next",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);

const allowedPrefixes = [
  path.join("examples", "pagequarry"),
];

function walkFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(process.cwd(), fullPath);

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) return [];
      if (allowedPrefixes.some((prefix) => relativePath.startsWith(prefix))) return [];
      return walkFiles(fullPath);
    }

    if (!entry.isFile()) return [];
    return [relativePath];
  });
}

describe("skeleton boundary", () => {
  it("keeps product-specific example material out of active skeleton paths", () => {
    const matches = walkFiles(process.cwd()).flatMap((relativePath) => {
      if (relativePath === path.join("tests", "site", "skeleton-boundary.test.ts")) {
        return [];
      }

      const content = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
      return forbiddenTerms
        .filter((term) => content.includes(term))
        .map((term) => `${relativePath}: ${term}`);
    });

    expect(matches).toEqual([]);
  });

  it("does not expose active homepage markdown source-view routes or helpers", () => {
    const forbiddenSourceViewTerms = [
      "homepage-markdown",
      "HomepageMarkdown",
      "getHomepageMarkdownSource",
      "Look Under the Hood",
      "content/archive/index/current.md",
    ];
    const matches = walkFiles(process.cwd()).flatMap((relativePath) => {
      if (relativePath === path.join("tests", "site", "skeleton-boundary.test.ts")) {
        return [];
      }

      const content = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
      return forbiddenSourceViewTerms
        .filter((term) => content.includes(term))
        .map((term) => `${relativePath}: ${term}`);
    });

    expect(matches).toEqual([]);
  });
});
