import { MediaCardSurface } from "@/components/blocks/media-card-block";
import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import type { MediaGridBlockData } from "@/content/types";
import { cn } from "@/lib/cn";
import { activeSiteTheme } from "@/site/theme-runtime";

const mediaGridClasses = {
  open: "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
  reading: "grid gap-5 md:grid-cols-2",
  contained: "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
  compact: "grid gap-5",
} as const;

export function MediaGridBlock({ items }: MediaGridBlockData) {
  return (
    <Section spacing="default">
      <PageContainer>
        <div className={cn(mediaGridClasses[activeSiteTheme.layout])}>
          {items.map((item) => (
            <MediaCardSurface
              {...item}
              imagePosition={item.imagePosition ?? "top"}
              key={`${item.title}-${item.image.src}`}
            />
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
