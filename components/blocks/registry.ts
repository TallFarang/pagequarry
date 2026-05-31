import type { ComponentType } from "react";

import {
  CtaBlock,
  HeroBlock,
  MediaCardBlock,
  MediaGridBlock,
  MetricStripBlock,
  ProcessBlock,
  QuoteBlock,
  SectionCopyBlock,
} from "@/components/blocks";
import type { BlockPropsMap } from "@/content/types";

export const blockRegistry = {
  cta: CtaBlock,
  hero: HeroBlock,
  mediaCard: MediaCardBlock,
  mediaGrid: MediaGridBlock,
  metrics: MetricStripBlock,
  process: ProcessBlock,
  quote: QuoteBlock,
  sectionCopy: SectionCopyBlock,
} satisfies {
  [K in keyof BlockPropsMap]: ComponentType<BlockPropsMap[K]>;
};
