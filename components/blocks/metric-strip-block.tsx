import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import { activeMotionClass, activeSurfaceClass } from "@/components/site/theme-classes";
import type { MetricStripBlockData } from "@/content/types";
import { cn } from "@/lib/cn";
import { activeSiteTheme } from "@/site/theme-runtime";

const metricsContainerClasses = {
  openGrid: "grid gap-6 border-y border-border py-6 sm:grid-cols-3",
  cards: "grid gap-4 sm:grid-cols-3",
} as const;

const metricItemClasses = {
  openGrid: "space-y-1",
  cards: "space-y-1 p-5",
} as const;

export function MetricStripBlock({ items }: MetricStripBlockData) {
  const metrics = activeSiteTheme.metrics;

  return (
    <Section spacing="compact">
      <PageContainer>
        <div className={metricsContainerClasses[metrics]}>
          {items.map((item) => (
            <div
              className={cn(
                metricItemClasses[metrics],
                metrics === "cards" ? activeSurfaceClass() : null,
                activeMotionClass()
              )}
              key={item.label}
            >
              <Text variant="metricLabel">
                {item.label}
              </Text>
              <Text variant="metricValue">
                {item.value}
              </Text>
            </div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
