import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import { activeSurfaceClass } from "@/components/site/theme-classes";
import type { QuoteBlockData } from "@/content/types";
import { cn } from "@/lib/cn";
import { activeSiteTheme } from "@/site/theme-runtime";

const quoteClasses = {
  accentRule: "border-l border-accent pl-6",
  panel: "p-6 sm:p-8",
} as const;

export function QuoteBlock({
  quote,
  attribution,
  context,
}: QuoteBlockData) {
  return (
    <Section spacing="default" tone="subtle">
      <PageContainer>
        <blockquote
          className={cn(
            quoteClasses[activeSiteTheme.quote],
            activeSiteTheme.quote === "panel" ? activeSurfaceClass() : null
          )}
        >
          <Text className="sm:text-4xl" variant="quote">
            “{quote}”
          </Text>
          <footer className="mt-6 space-y-1 text-sm text-muted-foreground">
            <Text as="p" className="font-medium text-foreground" variant="bodySmall">
              {attribution}
            </Text>
            <Text as="p" variant="bodySmall">
              {context}
            </Text>
          </footer>
        </blockquote>
      </PageContainer>
    </Section>
  );
}
