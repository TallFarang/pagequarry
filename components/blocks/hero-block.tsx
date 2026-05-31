import Link from "next/link";

import { Button } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import { activeSurfaceClass } from "@/components/site/theme-classes";
import type { HeroBlockData } from "@/content/types";
import { cn } from "@/lib/cn";
import { activeSiteTheme } from "@/site/theme-runtime";

const heroContainerClasses = {
  oceanOpen: "theme-hero-ocean-open grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]",
  editorialMasthead:
    "theme-hero-editorial-masthead border-y border-border py-10 text-center",
  studioSplit:
    "theme-hero-studio-split grid gap-10 rounded-[var(--panel-radius)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)] lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center sm:p-8",
  fieldIntro:
    "theme-hero-field-intro grid gap-8 rounded-[var(--panel-radius)] border border-border bg-surface/86 p-6 lg:grid-cols-[minmax(0,1fr)_16rem] sm:p-8",
} as const;

const heroTitleClasses = {
  oceanOpen: "max-w-4xl",
  editorialMasthead: "mx-auto max-w-4xl",
  studioSplit: "max-w-4xl",
  fieldIntro: "max-w-3xl",
} as const;

const heroDeckClasses = {
  oceanOpen: "mt-6 max-w-2xl",
  editorialMasthead: "mx-auto mt-6 max-w-2xl",
  studioSplit: "mt-6 max-w-2xl",
  fieldIntro: "mt-5 max-w-2xl",
} as const;

const heroActionClasses = {
  oceanOpen: "mt-8",
  editorialMasthead: "mt-8 flex justify-center",
  studioSplit: "mt-8",
  fieldIntro: "mt-7",
} as const;

const heroAsideClasses = {
  oceanOpen: "border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0",
  editorialMasthead: "mx-auto max-w-xl border-t border-border pt-4",
  studioSplit: "rounded-[var(--panel-radius)] border border-border bg-background p-5",
  fieldIntro: "border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0",
} as const;

export function HeroBlock({
  eyebrow,
  title,
  deck,
  action,
  aside,
}: HeroBlockData) {
  const hero = activeSiteTheme.hero;

  return (
    <Section spacing="hero">
      <PageContainer>
        <div
          className={cn(
            heroContainerClasses[hero],
            hero === "oceanOpen" ? activeSurfaceClass() : null,
            hero === "oceanOpen" ? "p-6 sm:p-8" : null
          )}
        >
          <div className="max-w-4xl">
            <Text className="mb-4" variant="eyebrow">
              {eyebrow}
            </Text>
            <Text as="h1" className={heroTitleClasses[hero]} variant="display">
              {title}
            </Text>
            <Text as="p" className={heroDeckClasses[hero]} variant="lead">
              {deck}
            </Text>
            {action ? (
              <div className={heroActionClasses[hero]}>
                <Button asChild>
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              </div>
            ) : null}
          </div>

          {aside ? (
            <div
              className={cn(
                heroAsideClasses[hero],
                hero === "oceanOpen" ? activeSurfaceClass() : null
              )}
            >
              <Text as="p" variant="bodySmall" className="leading-7">
                {aside}
              </Text>
            </div>
          ) : null}
        </div>
      </PageContainer>
    </Section>
  );
}
