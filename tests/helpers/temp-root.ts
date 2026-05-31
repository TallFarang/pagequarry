import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function createTempRoot() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "content-site-"));
  fs.mkdirSync(path.join(rootDir, "content"), { recursive: true });
  return rootDir;
}

export const genericDrafts = {
  contact: [
    "---",
    "template: narrative",
    "slug: /contact",
    "page_id: contact",
    "title: contact",
    "description: generic contact page.",
    "---",
    "",
    '{% hero eyebrow="contact" title="Contact the team." deck="A neutral contact page for tests." actionHref="mailto:team@example.test" actionLabel="email" /%}',
    "",
    '{% sectionCopy eyebrow="details" title="Contact details" %}',
    "Use this neutral page to verify narrative publishing behavior.",
    "{% /sectionCopy %}",
    "",
    '{% cta title="Send a note." body="Use the published contact route." actionHref="mailto:team@example.test" actionLabel="email" /%}',
  ].join("\n"),
  features: [
    "---",
    "template: hub",
    "slug: /features",
    "page_id: features",
    "title: features",
    "description: generic feature overview.",
    "---",
    "",
    '{% hero eyebrow="features" title="Feature overview." deck="A neutral feature page for tests." actionHref="/contact" actionLabel="contact" /%}',
    "",
    '{% sectionCopy eyebrow="capability" title="Shared blocks" %}',
    "Reusable content blocks keep page rendering predictable.",
    "",
    '{% linkItem href="/contact" label="contact" summary="A neutral internal link." /%}',
    "{% /sectionCopy %}",
    "",
    '{% cta title="Use the framework." body="Publish content through the same pipeline." actionHref="/contact" actionLabel="contact" /%}',
  ].join("\n"),
  home: [
    "---",
    "template: home",
    "slug: /",
    "page_id: home",
    "title: Test Site",
    "description: generic home page.",
    "---",
    "",
    '{% hero eyebrow="home" title="Publish structured pages." deck="A neutral home page for tests." actionHref="/contact" actionLabel="contact" /%}',
    "",
    "{% metrics %}",
    '{% metric label="pages" value="structured" /%}',
    '{% metric label="content" value="validated" /%}',
    '{% metric label="runtime" value="generated" /%}',
    "{% /metrics %}",
    "",
    '{% sectionCopy eyebrow="system" title="Content pipeline" %}',
    "Drafts are validated before they become published pages.",
    "{% /sectionCopy %}",
    "",
    '{% process eyebrow="flow" title="Publish content." %}',
    '{% step title="Draft" body="Write a markdown draft." /%}',
    '{% step title="Check" body="Validate the draft." /%}',
    '{% step title="Submit" body="Accept the revision." /%}',
    "{% /process %}",
    "",
    '{% quote quote="Predictable content is easier to maintain." attribution="Test Author" context="Generic test fixture" /%}',
    "",
    '{% cta title="Start publishing." body="Use the content workflow." actionHref="/contact" actionLabel="contact" /%}',
  ].join("\n"),
} as const;

export function writeFile(rootDir: string, relativePath: string, content: string) {
  const filePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  return filePath;
}

export function writeGenericDraft(
  rootDir: string,
  name: keyof typeof genericDrafts,
  targetRelativePath?: string
) {
  const target = targetRelativePath || path.join("content", "submit-here", `${name}.md`);
  return writeFile(rootDir, target, genericDrafts[name]);
}
