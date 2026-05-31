import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import {
  activeMediaClass,
  activeMotionClass,
  activeSurfaceClass,
} from "@/components/site/theme-classes";
import type { MediaAsset, MediaCardBlockData, MediaImagePosition } from "@/content/types";
import { cn } from "@/lib/cn";

const mediaFrameClasses = {
  top: "relative aspect-[4/3]",
  left: "relative aspect-[4/3] md:aspect-auto md:min-h-full",
  right: "relative aspect-[4/3] md:aspect-auto md:min-h-full",
  background: "absolute inset-0",
} as const satisfies Record<MediaImagePosition, string>;

const overlayClasses = {
  left: "",
  top: "",
  right: "",
  background: "absolute inset-0 bg-background/78 backdrop-blur-[1px]",
} as const satisfies Record<MediaImagePosition, string>;

function MediaFigure({
  image,
  position,
}: {
  image: MediaAsset;
  position: MediaImagePosition;
}) {
  return (
    <figure className={cn("overflow-hidden", activeMediaClass(), mediaFrameClasses[position])}>
      <Image
        alt={image.alt ?? ""}
        className="object-cover"
        fill
        loading="lazy"
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        src={image.src}
      />
      {position !== "background" && image.caption ? (
        <figcaption className="border-t border-border bg-background/72 px-4 py-3">
          <Text as="span" variant="bodySmall">
            {image.caption}
          </Text>
        </figcaption>
      ) : null}
    </figure>
  );
}

export function MediaCardSurface({
  action,
  body,
  image,
  imagePosition = "top",
  title,
}: MediaCardBlockData) {
  const isBackground = imagePosition === "background";
  const isSideImage = imagePosition === "left" || imagePosition === "right";

  return (
    <article
      className={cn(
        "relative overflow-hidden",
        activeSurfaceClass(),
        activeMotionClass(),
        isSideImage ? "grid md:grid-cols-2" : null,
        isBackground ? "min-h-[22rem] p-6 sm:p-8" : null
      )}
    >
      {isBackground ? (
        <>
          <MediaFigure image={image} position={imagePosition} />
          <div className={overlayClasses[imagePosition]} />
        </>
      ) : null}

      {!isBackground && imagePosition !== "right" ? (
        <MediaFigure image={image} position={imagePosition} />
      ) : null}

      <div className={cn("relative z-10 p-6 sm:p-7", isSideImage ? "self-center" : null)}>
        <Text as="h3" variant="subhead">
          {title}
        </Text>
        <Text as="p" className="mt-3" variant="body">
          {body}
        </Text>
        {isBackground && image.caption ? (
          <Text as="p" className="mt-4" variant="bodySmall">
            {image.caption}
          </Text>
        ) : null}
        {action ? (
          <div className="mt-6">
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          </div>
        ) : null}
      </div>

      {!isBackground && imagePosition === "right" ? (
        <MediaFigure image={image} position={imagePosition} />
      ) : null}
    </article>
  );
}

export function MediaCardBlock(props: MediaCardBlockData) {
  return (
    <Section spacing="default">
      <PageContainer>
        <MediaCardSurface {...props} />
      </PageContainer>
    </Section>
  );
}
