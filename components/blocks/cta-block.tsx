import Link from "next/link";

import { Button } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import { activeMotionClass, activeSurfaceClass } from "@/components/site/theme-classes";
import type { CtaBlockData } from "@/content/types";
import { cn } from "@/lib/cn";
import { activeSiteTheme } from "@/site/theme-runtime";

const ctaContainerClasses = {
  open: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end",
  contained: "grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end sm:p-8",
  quiet: "mx-auto grid max-w-3xl gap-6 text-center",
} as const;

const ctaTextClasses = {
  open: "max-w-3xl",
  contained: "max-w-3xl",
  quiet: "mx-auto max-w-3xl",
} as const;

const ctaActionClasses = {
  open: "",
  contained: "",
  quiet: "flex justify-center",
} as const;

export function CtaBlock({ title, body, action }: CtaBlockData) {
  const cta = activeSiteTheme.cta;

  return (
    <Section spacing="cta">
      <PageContainer>
        <div
          className={cn(
            ctaContainerClasses[cta],
            cta === "contained" ? activeSurfaceClass() : null,
            activeMotionClass()
          )}
        >
          <div className={ctaTextClasses[cta]}>
            <Text as="h2" className="sm:text-5xl" variant="sectionTitle">
              {title}
            </Text>
            <Text as="p" className="mt-4" variant="lead">
              {body}
            </Text>
          </div>

          <div className={ctaActionClasses[cta]}>
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
