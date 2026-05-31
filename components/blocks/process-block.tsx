import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import { activeMotionClass, activeSurfaceClass } from "@/components/site/theme-classes";
import type { ProcessBlockData } from "@/content/types";
import { cn } from "@/lib/cn";
import { activeSiteTheme } from "@/site/theme-runtime";

const processListClasses = {
  timeline: "grid gap-5",
  cards: "grid gap-4 md:grid-cols-3",
} as const;

const processItemClasses = {
  timeline:
    "grid gap-2 border-t border-border pt-5 sm:grid-cols-[3rem_minmax(0,1fr)]",
  cards: "grid gap-4 p-5",
} as const;

export function ProcessBlock({ eyebrow, title, steps }: ProcessBlockData) {
  const process = activeSiteTheme.process;

  return (
    <Section spacing="default">
      <PageContainer className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div>
          <Text className="mb-3" variant="eyebrow">
            {eyebrow}
          </Text>
          <Text as="h2" variant="sectionTitle">
            {title}
          </Text>
        </div>

        <ol className={processListClasses[process]}>
          {steps.map((step, index) => (
            <li
              className={cn(
                processItemClasses[process],
                process === "cards" ? activeSurfaceClass() : null,
                activeMotionClass()
              )}
              key={step.title}
            >
              <span className="font-metric text-2xl leading-none text-accent">
                0{index + 1}
              </span>
              <div>
                <Text as="h3" variant="subhead">
                  {step.title}
                </Text>
                <Text as="p" className="mt-2" variant="body">
                  {step.body}
                </Text>
              </div>
            </li>
          ))}
        </ol>
      </PageContainer>
    </Section>
  );
}
