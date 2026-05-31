import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import {
  activeMotionClass,
  activeSurfaceClass,
} from "@/components/site/theme-classes";
import type { EmbedAspect, EmbedBlockData } from "@/content/types";
import { cn } from "@/lib/cn";

const embedAspectClasses = {
  square: "aspect-square",
  standard: "aspect-[4/3]",
  tall: "aspect-[3/4]",
  wide: "aspect-video",
} as const satisfies Record<EmbedAspect, string>;

export function EmbedBlock({
  aspect = "wide",
  caption,
  src,
  title,
}: EmbedBlockData) {
  return (
    <Section spacing="default">
      <PageContainer>
        <figure
          className={cn(
            "overflow-hidden p-4 sm:p-5",
            activeSurfaceClass(),
            activeMotionClass()
          )}
        >
          <div
            className={cn(
              "overflow-hidden rounded-[var(--panel-radius)] border border-border bg-background",
              embedAspectClasses[aspect]
            )}
          >
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              src={src}
              title={title}
            />
          </div>
          {caption ? (
            <figcaption className="mt-4">
              <Text as="span" variant="bodySmall">
                {caption}
              </Text>
            </figcaption>
          ) : null}
        </figure>
      </PageContainer>
    </Section>
  );
}
