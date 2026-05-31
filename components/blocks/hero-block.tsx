import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import { activeMediaClass, activeSurfaceClass } from "@/components/site/theme-classes";
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

const heroOverlayClasses = {
  none: "",
  soft: "absolute inset-0 bg-background/58 backdrop-blur-[1px]",
  strong: "absolute inset-0 bg-background/78 backdrop-blur-[2px]",
} as const;

function HeroImage({
  alt,
  caption,
  src,
  mode,
}: {
  alt?: string;
  caption?: string;
  mode: "inline" | "background";
  src: string;
}) {
  if (mode === "background") {
    return (
      <Image
        alt={alt ?? ""}
        className="object-cover"
        fill
        loading="eager"
        priority
        sizes="100vw"
        src={src}
      />
    );
  }

  return (
    <figure className={cn("overflow-hidden", activeMediaClass())}>
      <div className="relative aspect-[4/3]">
        <Image
          alt={alt ?? ""}
          className="object-cover"
          fill
          loading="eager"
          sizes="(min-width: 1024px) 28vw, 100vw"
          src={src}
        />
      </div>
      {caption ? (
        <figcaption className="border-t border-border bg-background/72 px-4 py-3">
          <Text as="span" variant="bodySmall">
            {caption}
          </Text>
        </figcaption>
      ) : null}
    </figure>
  );
}

export function HeroBlock({
  eyebrow,
  title,
  deck,
  action,
  aside,
  image,
  imageMode = "inline",
  imageOverlay = "soft",
}: HeroBlockData) {
  const hero = activeSiteTheme.hero;
  const hasBackgroundImage = Boolean(image && imageMode === "background");
  const hasAsideColumn = Boolean(aside || (image && imageMode === "inline"));

  return (
    <Section spacing="hero">
      <PageContainer>
        <div
          className={cn(
            heroContainerClasses[hero],
            hero === "oceanOpen" ? activeSurfaceClass() : null,
            hero === "oceanOpen" ? "p-6 sm:p-8" : null,
            hasBackgroundImage ? "relative overflow-hidden" : null
          )}
        >
          {image && hasBackgroundImage ? (
            <>
              <HeroImage
                alt={image.alt}
                caption={image.caption}
                mode="background"
                src={image.src}
              />
              <div className={heroOverlayClasses[imageOverlay]} />
            </>
          ) : null}

          <div className="relative z-10 max-w-4xl">
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

          {hasAsideColumn ? (
            <div className="relative z-10 grid gap-5">
              {image && imageMode === "inline" ? (
                <HeroImage
                  alt={image.alt}
                  caption={image.caption}
                  mode="inline"
                  src={image.src}
                />
              ) : null}
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
          ) : null}
        </div>
      </PageContainer>
    </Section>
  );
}
