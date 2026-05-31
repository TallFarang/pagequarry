import Markdoc from "@markdoc/markdoc";
import yaml from "js-yaml";
import type { Config, Node as MarkdocNode } from "@markdoc/markdoc";

import type {
  ContentBlock,
  ManagedPage,
  MediaCardBlockData,
  PageTemplateKey,
} from "@/content/types";
import { resolvePageMeta } from "@/lib/content/metadata";
import {
  contentBlockSchema,
  frontmatterSchema,
  managedPageSchema,
  reservedSlugs,
  slugToPageId,
  validateTemplateSequence,
} from "@/lib/content/contracts";

export type LintIssue = {
  line?: number;
  message: string;
};

export type ParseDraftSuccess = {
  ok: true;
  page: ManagedPage;
};

export type ParseDraftFailure = {
  issues: LintIssue[];
  ok: false;
};

export type ParseDraftResult = ParseDraftSuccess | ParseDraftFailure;

const sectionTone = ["default", "subtle"] as const;
const heroImageModes = ["inline", "background"] as const;
const imageOverlays = ["none", "soft", "strong"] as const;
const mediaImagePositions = ["top", "left", "right", "background"] as const;
const supportingImagePositions = ["top", "left", "right"] as const;
const embedProviders = ["youtube", "googleCalendar", "googleMaps"] as const;
const embedAspects = ["wide", "standard", "square", "tall"] as const;

const markdocConfig = {
  tags: {
    cta: {
      attributes: {
        actionHref: { type: String, required: true },
        actionLabel: { type: String, required: true },
        body: { type: String, required: true },
        title: { type: String, required: true },
      },
    },
    embed: {
      attributes: {
        aspect: { type: String, matches: [...embedAspects] },
        caption: { type: String },
        provider: { type: String, matches: [...embedProviders], required: true },
        src: { type: String, required: true },
        title: { type: String, required: true },
      },
    },
    hero: {
      attributes: {
        actionHref: { type: String },
        actionLabel: { type: String },
        aside: { type: String },
        deck: { type: String, required: true },
        eyebrow: { type: String, required: true },
        imageAlt: { type: String },
        imageCaption: { type: String },
        imageMode: { type: String, matches: [...heroImageModes] },
        imageOverlay: { type: String, matches: [...imageOverlays] },
        imageSrc: { type: String },
        title: { type: String, required: true },
      },
    },
    linkItem: {
      attributes: {
        href: { type: String, required: true },
        label: { type: String, required: true },
        summary: { type: String },
      },
    },
    mediaCard: {
      attributes: {
        actionHref: { type: String },
        actionLabel: { type: String },
        body: { type: String, required: true },
        imageAlt: { type: String },
        imageCaption: { type: String },
        imagePosition: { type: String, matches: [...mediaImagePositions] },
        imageSrc: { type: String, required: true },
        title: { type: String, required: true },
      },
    },
    mediaGrid: {
      validate(node: MarkdocNode) {
        const items = node.children.filter((child) => child.type === "tag");
        if (items.length < 1) {
          return [
            {
              id: "mediaGrid-empty",
              level: "critical",
              message: "mediaGrid must contain at least one mediaCard child tag.",
            },
          ];
        }
        if (items.some((child) => child.tag !== "mediaCard")) {
          return [
            {
              id: "mediaGrid-children",
              level: "critical",
              message: "mediaGrid may only contain mediaCard child tags.",
            },
          ];
        }
        return [];
      },
    },
    metric: {
      attributes: {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    },
    metrics: {
      validate(node: MarkdocNode) {
        const items = node.children.filter((child) => child.type === "tag");
        if (items.length < 1) {
          return [
            {
              id: "metrics-empty",
              level: "critical",
              message: "metrics must contain at least one metric child tag.",
            },
          ];
        }
        if (items.some((child) => child.tag !== "metric")) {
          return [
            {
              id: "metrics-children",
              level: "critical",
              message: "metrics may only contain metric child tags.",
            },
          ];
        }
        return [];
      },
    },
    process: {
      attributes: {
        eyebrow: { type: String, required: true },
        title: { type: String, required: true },
      },
      validate(node: MarkdocNode) {
        const items = node.children.filter((child) => child.type === "tag");
        if (items.length < 1) {
          return [
            {
              id: "process-empty",
              level: "critical",
              message: "process must contain at least one step child tag.",
            },
          ];
        }
        if (items.some((child) => child.tag !== "step")) {
          return [
            {
              id: "process-children",
              level: "critical",
              message: "process may only contain step child tags.",
            },
          ];
        }
        return [];
      },
    },
    quote: {
      attributes: {
        attribution: { type: String, required: true },
        context: { type: String, required: true },
        quote: { type: String, required: true },
      },
    },
    sectionCopy: {
      attributes: {
        eyebrow: { type: String },
        imageAlt: { type: String },
        imageCaption: { type: String },
        imagePosition: { type: String, matches: [...supportingImagePositions] },
        imageSrc: { type: String },
        title: { type: String, required: true },
        tone: { type: String, matches: [...sectionTone] },
      },
      validate(node: MarkdocNode) {
        const invalid = node.children.find((child) => {
          if (child.type === "paragraph" || child.type === "list") return false;
          if (child.type === "tag" && child.tag === "linkItem") return false;
          return true;
        });
        if (invalid) {
          return [
            {
              id: "sectionCopy-children",
              level: "critical",
              message:
                "sectionCopy may contain only paragraphs, bullet lists, and linkItem tags.",
            },
          ];
        }
        return [];
      },
    },
    step: {
      attributes: {
        body: { type: String, required: true },
        title: { type: String, required: true },
      },
    },
  },
} satisfies Config;

function lineOf(node: MarkdocNode) {
  return node.location?.start?.line;
}

function issue(message: string, line?: number): LintIssue {
  return line ? { line, message } : { message };
}

function normalizeYamlValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString().replace(".000Z", "Z");
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeYamlValue(entry));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeYamlValue(entry)])
    );
  }

  return value;
}

function textFromNode(node: MarkdocNode): string {
  if (node.type === "text") {
    return String(node.attributes.content ?? "");
  }
  return node.children.map(textFromNode).join("");
}

function paragraphText(node: MarkdocNode) {
  return textFromNode(node).trim();
}

function listItemText(node: MarkdocNode) {
  return textFromNode(node).trim();
}

function normalizeAction(
  attrs: Record<string, unknown>,
  errors: LintIssue[],
  line?: number
) {
  const href = String(attrs.actionHref ?? "").trim();
  const label = String(attrs.actionLabel ?? "").trim();

  if (href && label) return { href, label };
  if (!href && !label) return undefined;

  errors.push(issue("actionHref and actionLabel must be provided together.", line));
  return undefined;
}

function normalizeMediaAsset(attrs: Record<string, unknown>) {
  const src = String(attrs.imageSrc ?? "").trim();
  if (!src) return undefined;

  return {
    alt: attrs.imageAlt ? String(attrs.imageAlt).trim() : undefined,
    caption: attrs.imageCaption ? String(attrs.imageCaption).trim() : undefined,
    src,
  };
}

function normalizeEmbedSrc(provider: string, rawSrc: string) {
  const src = rawSrc.trim();

  if (provider !== "youtube") return src;

  try {
    const parsed = new URL(src);

    if (parsed.protocol !== "https:") return src;

    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : src;
    }

    if (parsed.hostname === "www.youtube.com") {
      if (parsed.pathname === "/watch") {
        const videoId = parsed.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : src;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        parsed.search = "";
        parsed.hash = "";
        return parsed.toString();
      }
    }
  } catch {
    return src;
  }

  return src;
}

function normalizeMediaCardData(node: MarkdocNode, errors: LintIssue[]) {
  return parseBlock({
    action: normalizeAction(node.attributes, errors, lineOf(node)),
    body: String(node.attributes.body ?? "").trim(),
    image: normalizeMediaAsset(node.attributes),
    imagePosition: node.attributes.imagePosition
      ? String(node.attributes.imagePosition).trim()
      : undefined,
    title: String(node.attributes.title ?? "").trim(),
    type: "mediaCard",
  }, "mediaCard", errors, lineOf(node));
}

function isMediaCardBlock(
  block: ContentBlock | null
): block is { type: "mediaCard" } & MediaCardBlockData {
  return Boolean(block && block.type === "mediaCard");
}

function parseBlock(
  candidate: unknown,
  tag: string,
  errors: LintIssue[],
  line?: number
) {
  const parsed = contentBlockSchema.safeParse(candidate);
  if (parsed.success) return parsed.data;

  for (const detail of parsed.error.issues) {
    const suffix = detail.path.length ? ` ${detail.path.join(".")}` : "";
    errors.push(issue(`${tag}${suffix}: ${detail.message}`, line));
  }

  return null;
}

function normalizeMetrics(node: MarkdocNode, errors: LintIssue[]) {
  const items = node.children
    .filter((child) => child.type === "tag" && child.tag === "metric")
    .map((child) => ({
      label: String(child.attributes.label ?? "").trim(),
      value: String(child.attributes.value ?? "").trim(),
    }));

  return parseBlock({
    items,
    type: "metrics",
  }, "metrics", errors, lineOf(node));
}

function normalizeProcess(node: MarkdocNode, errors: LintIssue[]) {
  const steps = node.children
    .filter((child) => child.type === "tag" && child.tag === "step")
    .map((child) => ({
      body: String(child.attributes.body ?? "").trim(),
      title: String(child.attributes.title ?? "").trim(),
    }));

  return parseBlock({
    eyebrow: String(node.attributes.eyebrow ?? "").trim(),
    steps,
    title: String(node.attributes.title ?? "").trim(),
    type: "process",
  }, "process", errors, lineOf(node));
}

function normalizeSectionCopy(node: MarkdocNode, errors: LintIssue[]) {
  const paragraphs: string[] = [];
  const bullets: string[] = [];
  const links: Array<{ href: string; label: string; summary?: string }> = [];

  for (const child of node.children) {
    if (child.type === "paragraph") {
      const text = paragraphText(child);
      if (text) paragraphs.push(text);
      continue;
    }

    if (child.type === "list") {
      if (child.attributes.ordered) {
        errors.push(issue("sectionCopy lists must be unordered bullet lists.", lineOf(child)));
        continue;
      }
      for (const item of child.children.filter((entry) => entry.type === "item")) {
        const text = listItemText(item);
        if (text) bullets.push(text);
      }
      continue;
    }

    if (child.type === "tag" && child.tag === "linkItem") {
      links.push({
        href: String(child.attributes.href ?? "").trim(),
        label: String(child.attributes.label ?? "").trim(),
        summary: child.attributes.summary
          ? String(child.attributes.summary).trim()
          : undefined,
      });
    }
  }

  if (!paragraphs.length) {
    errors.push(
      issue("sectionCopy requires at least one body paragraph.", lineOf(node))
    );
  }

  return parseBlock({
    body: paragraphs.join("\n\n"),
    bullets: bullets.length ? bullets : undefined,
    eyebrow: node.attributes.eyebrow
      ? String(node.attributes.eyebrow).trim()
      : undefined,
    image: normalizeMediaAsset(node.attributes),
    imagePosition: node.attributes.imagePosition
      ? String(node.attributes.imagePosition).trim()
      : undefined,
    links: links.length ? links : undefined,
    title: String(node.attributes.title ?? "").trim(),
    tone: node.attributes.tone
      ? String(node.attributes.tone).trim()
      : undefined,
    type: "sectionCopy",
  }, "sectionCopy", errors, lineOf(node));
}

function normalizeTopLevelTag(node: MarkdocNode, errors: LintIssue[]) {
  switch (node.tag) {
    case "hero":
      return parseBlock({
        action: normalizeAction(node.attributes, errors, lineOf(node)),
        aside: node.attributes.aside ? String(node.attributes.aside).trim() : undefined,
        deck: String(node.attributes.deck ?? "").trim(),
        eyebrow: String(node.attributes.eyebrow ?? "").trim(),
        image: normalizeMediaAsset(node.attributes),
        imageMode: node.attributes.imageMode
          ? String(node.attributes.imageMode).trim()
          : undefined,
        imageOverlay: node.attributes.imageOverlay
          ? String(node.attributes.imageOverlay).trim()
          : undefined,
        title: String(node.attributes.title ?? "").trim(),
        type: "hero",
      }, "hero", errors, lineOf(node));
    case "mediaCard":
      return normalizeMediaCardData(node, errors);
    case "embed": {
      const provider = String(node.attributes.provider ?? "").trim();

      return parseBlock({
        aspect: node.attributes.aspect
          ? String(node.attributes.aspect).trim()
          : undefined,
        caption: node.attributes.caption
          ? String(node.attributes.caption).trim()
          : undefined,
        provider,
        src: normalizeEmbedSrc(provider, String(node.attributes.src ?? "")),
        title: String(node.attributes.title ?? "").trim(),
        type: "embed",
      }, "embed", errors, lineOf(node));
    }
    case "mediaGrid": {
      const items = node.children
        .filter((child) => child.type === "tag" && child.tag === "mediaCard")
        .map((child) => normalizeMediaCardData(child, errors))
        .filter(isMediaCardBlock)
        .map((item) => ({
          action: item.action,
          body: item.body,
          image: item.image,
          imagePosition: item.imagePosition,
          title: item.title,
        }));

      return parseBlock({
        items,
        type: "mediaGrid",
      }, "mediaGrid", errors, lineOf(node));
    }
    case "metrics":
      return normalizeMetrics(node, errors);
    case "sectionCopy":
      return normalizeSectionCopy(node, errors);
    case "process":
      return normalizeProcess(node, errors);
    case "quote":
      return parseBlock({
        attribution: String(node.attributes.attribution ?? "").trim(),
        context: String(node.attributes.context ?? "").trim(),
        quote: String(node.attributes.quote ?? "").trim(),
        type: "quote",
      }, "quote", errors, lineOf(node));
    case "cta":
      return parseBlock({
        action: {
          href: String(node.attributes.actionHref ?? "").trim(),
          label: String(node.attributes.actionLabel ?? "").trim(),
        },
        body: String(node.attributes.body ?? "").trim(),
        title: String(node.attributes.title ?? "").trim(),
        type: "cta",
      }, "cta", errors, lineOf(node));
    default:
      errors.push(issue(`unknown top-level tag: ${node.tag}`, lineOf(node)));
      return null;
  }
}

function parseFrontmatter(ast: MarkdocNode, errors: LintIssue[]) {
  const raw = ast.attributes.frontmatter;
  if (!raw || typeof raw !== "string") {
    errors.push(issue("frontmatter is required."));
    return null;
  }

  let loaded: unknown;
  try {
    loaded = normalizeYamlValue(yaml.load(raw));
  } catch (error) {
    errors.push(issue(`frontmatter is invalid yaml: ${(error as Error).message}`));
    return null;
  }

  if (
    loaded &&
    typeof loaded === "object" &&
    "slug" in loaded &&
    typeof loaded.slug === "string" &&
    reservedSlugs.has(loaded.slug)
  ) {
    errors.push(issue(`slug ${loaded.slug} is reserved.`));
    return null;
  }

  if (
    loaded &&
    typeof loaded === "object" &&
    "redirect_from" in loaded &&
    Array.isArray(loaded.redirect_from)
  ) {
    const redirectFrom = loaded.redirect_from.filter(
      (entry): entry is string => typeof entry === "string"
    );
    const slug = "slug" in loaded && typeof loaded.slug === "string" ? loaded.slug : null;

    if (slug && redirectFrom.includes(slug)) {
      errors.push(issue("frontmatter redirect_from: must not include the current slug."));
    }

    if (new Set(redirectFrom).size !== redirectFrom.length) {
      errors.push(issue("frontmatter redirect_from: must not contain duplicates."));
    }
  }

  const parsed = frontmatterSchema.safeParse(loaded);
  if (!parsed.success) {
    for (const detail of parsed.error.issues) {
      errors.push(issue(`frontmatter ${detail.path.join(".")}: ${detail.message}`));
    }
    return null;
  }

  return parsed.data;
}

export function parseDraftSource(input: {
  revisionId: string;
  source: string;
  sourceHash: string;
}): ParseDraftResult {
  const errors: LintIssue[] = [];
  const ast = Markdoc.parse(input.source);
  const frontmatter = parseFrontmatter(ast, errors);

  const markdocErrors = Markdoc.validate(ast, markdocConfig);
  for (const error of markdocErrors) {
    errors.push(
      issue(error.error.message, error.location?.start?.line)
    );
  }

  const nonTag = ast.children.find((child) => child.type !== "tag");
  if (nonTag) {
    errors.push(
      issue(
        "document body may contain only approved block tags at the root level.",
        lineOf(nonTag)
      )
    );
  }

  const blocks = ast.children
    .filter((child) => child.type === "tag")
    .map((child) => normalizeTopLevelTag(child, errors))
    .filter(Boolean) as ContentBlock[];

  if (!frontmatter) {
    return { issues: errors, ok: false };
  }

  const templateErrors = validateTemplateSequence(frontmatter.template, blocks);
  for (const message of templateErrors) {
    errors.push(issue(message));
  }

  const page: ManagedPage = {
    blocks,
    meta: resolvePageMeta({
      author: frontmatter.author,
      canonicalUrl: frontmatter.canonical_url,
      description: frontmatter.description,
      publishedAt: frontmatter.published_at,
      revisionId: input.revisionId,
      robots: frontmatter.robots,
      seoTitle: frontmatter.seo_title,
      slug: frontmatter.slug,
      socialDescription: frontmatter.social_description,
      socialImage: frontmatter.social_image,
      socialTitle: frontmatter.social_title,
      status: frontmatter.status,
      summary: frontmatter.summary,
      template: frontmatter.template as PageTemplateKey,
      title: frontmatter.title,
      twitterCard: frontmatter.twitter_card,
      updatedAt: frontmatter.updated_at,
    }),
    pageId: frontmatter.page_id ?? slugToPageId(frontmatter.slug),
    redirectFrom: frontmatter.redirect_from ?? [],
    revisionId: input.revisionId,
    slug: frontmatter.slug,
    sourceHash: input.sourceHash,
    status: frontmatter.status,
    template: frontmatter.template as PageTemplateKey,
  };

  const parsedPage = managedPageSchema.safeParse(page);
  if (!parsedPage.success) {
    for (const detail of parsedPage.error.issues) {
      errors.push(issue(`page ${detail.path.join(".")}: ${detail.message}`));
    }
  }

  if (errors.length) return { issues: errors, ok: false };
  return { ok: true, page };
}
