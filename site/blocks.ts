import { blockRegistry as coreBlockRegistry } from "@/components/blocks/registry";
export type SiteBlockRegistry = typeof coreBlockRegistry;

// downstream forks can swap existing renderer keys here without touching core.
// adding new block names still requires contract and parser work in lib/content/*.
// Site-specific block overrides are intentionally inactive in production.
// Re-enable by importing components from "@/site/block-overrides" and adding
// entries to this map.
const siteBlockOverrides = {
} satisfies Partial<SiteBlockRegistry>;

export const siteBlockRegistry = {
  ...coreBlockRegistry,
  ...siteBlockOverrides,
} satisfies SiteBlockRegistry;
