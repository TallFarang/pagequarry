import Link from "next/link";
import Image from "next/image";

import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import {
  activeMediaClass,
  activeMotionClass,
  activeSurfaceClass,
} from "@/components/site/theme-classes";
import type { MediaAsset, SupportingImagePosition } from "@/content/types";
import type { SectionCopyBlockData } from "@/content/types";
import { cn } from "@/lib/cn";
import { activeSiteTheme } from "@/site/theme-runtime";

const sectionCopyLayoutClasses = {
  open: "grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]",
  compact: "grid gap-6 lg:grid-cols-[11rem_minmax(0,1fr)]",
  banded:
    "grid gap-8 p-6 lg:grid-cols-[14rem_minmax(0,1fr)] sm:p-8",
} as const;

function SupportingImage({
  image,
}: {
  image: MediaAsset;
}) {
  return (
    <figure className={cn("overflow-hidden", activeMediaClass())}>
      <div className="relative aspect-[4/3]">
        <Image
          alt={image.alt ?? ""}
          className="object-cover"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 28vw, 100vw"
          src={image.src}
        />
      </div>
      {image.caption ? (
        <figcaption className="border-t border-border bg-background/72 px-4 py-3">
          <Text as="span" variant="bodySmall">
            {image.caption}
          </Text>
        </figcaption>
      ) : null}
    </figure>
  );
}

function sectionBodyGrid(position: SupportingImagePosition) {
  if (position === "left") return "grid gap-6 lg:grid-cols-[minmax(12rem,0.85fr)_minmax(0,1fr)]";
  if (position === "right") return "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,0.85fr)]";
  return "grid gap-6";
}

export function SectionCopyBlock({
  eyebrow,
  title,
  body,
  bullets,
  image,
  imagePosition = "top",
  links,
  tone = "default",
}: SectionCopyBlockData) {
  const copy = (
    <div className="space-y-6">
      {body.split(/\n\n+/).map((paragraph, i) => (
        <Text as="p" key={i} variant="body">
          {paragraph}
        </Text>
      ))}

      {bullets?.length ? (
        <ul className="space-y-3 border-l border-border pl-5">
          {bullets.map((item) => (
            <li key={item}>
              <Text as="span" variant="body">
                {item}
              </Text>
            </li>
          ))}
        </ul>
      ) : null}

      {links?.length ? (
        <div className="space-y-4 border-t border-border pt-6">
          {links.map((link) => (
            <div className={cn("space-y-1", activeMotionClass())} key={link.href}>
              <Text as={Link} href={link.href} variant="link">
                <span>{link.label}</span>
                <span aria-hidden="true"> {"→"}</span>
              </Text>
              {link.summary ? (
                <Text as="p" variant="bodySmall">
                  {link.summary}
                </Text>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <Section spacing="default" tone={tone}>
      <PageContainer>
        <div
          className={cn(
            sectionCopyLayoutClasses[activeSiteTheme.section],
            activeSurfaceClass(),
            activeSiteTheme.section === "open" ? "p-6 sm:p-8" : null
          )}
        >
          <div>
            {eyebrow ? (
              <Text className="mb-3" variant="eyebrow">
                {eyebrow}
              </Text>
            ) : null}
            <Text as="h2" variant="sectionTitle">
              {title}
            </Text>
          </div>

          <div className={image ? sectionBodyGrid(imagePosition) : undefined}>
            {image && imagePosition !== "right" ? (
              <SupportingImage image={image} />
            ) : null}
            {copy}
            {image && imagePosition === "right" ? (
              <SupportingImage image={image} />
            ) : null}
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
