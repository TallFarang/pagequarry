"use client";

import Link from "next/link";

import { Button } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Text } from "@/components/site/text";
import type { ActionLink } from "@/content/types";
import { siteConfig } from "@/site/config";
import { activeSiteTheme } from "@/site/theme-runtime";

const headerClasses = {
  floating:
    "rounded-[var(--panel-radius)] border border-white/70 bg-surface/78 px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:px-6 sm:py-5",
  flat: "border-b border-border bg-background/88 px-0 py-4 backdrop-blur-xl",
  masthead: "border-y border-border bg-surface/70 px-5 py-6 text-center backdrop-blur-xl sm:px-6",
} as const;

const headerInnerClasses = {
  floating: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
  flat: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
  masthead: "flex flex-col items-center gap-4",
} as const;

const footerClasses = {
  floating:
    "flex flex-col gap-4 rounded-[var(--panel-radius)] border border-white/70 bg-surface/78 px-6 py-6 text-sm text-muted shadow-[var(--shadow-soft)] backdrop-blur-xl md:flex-row md:items-end md:justify-between",
  flat: "flex flex-col gap-4 border-t border-border px-0 py-6 text-sm text-muted md:flex-row md:items-end md:justify-between",
  masthead:
    "flex flex-col items-center gap-4 border-t border-border bg-surface/60 px-6 py-8 text-center text-sm text-muted",
} as const;

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const chrome = activeSiteTheme.chrome;

  return (
    <>
      <header className="sticky top-0 z-30 pt-4">
        <PageContainer>
          <div className={headerClasses[chrome]}>
            <div className={headerInnerClasses[chrome]}>
              <div className="min-w-0 flex-1">
                <Text as={Link} className="shrink-0" href="/" variant="brand">
                  {siteConfig.identity.name}
                </Text>
                <Text
                  as="p"
                  className="mt-1 max-w-xl text-[0.76rem] leading-5 tracking-[0.04em] sm:text-[0.86rem]"
                  variant="bodySmall"
                >
                  {siteConfig.identity.subheader}
                </Text>
              </div>

              {siteConfig.identity.navigation.length > 0 ? (
                <nav
                  aria-label="Primary"
                  className="hidden items-center gap-5 lg:flex"
                >
                  {(siteConfig.identity.navigation as readonly ActionLink[]).map((item) => (
                    <Text
                      as={Link}
                      className="transition-colors duration-200 hover:text-foreground"
                      href={item.href}
                      key={item.href}
                      variant="navTop"
                    >
                      {item.label}
                    </Text>
                  ))}
                </nav>
              ) : null}

              <Button asChild className="shrink-0">
                <Link href={siteConfig.contact.primaryAction.href} target="_blank" rel="noreferrer">
                  {siteConfig.contact.primaryAction.label}
                </Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-10 sm:py-14">
        <PageContainer>
          <div className={footerClasses[chrome]}>
            <div className="max-w-lg space-y-2">
              <Text as="p" variant="brand">
                {siteConfig.identity.name}
              </Text>
              <Text as="p" variant="bodySmall">
                {siteConfig.footer.tagline}
              </Text>
            </div>
            <div className="space-y-1 text-left md:max-w-md md:text-right">
              <Text as="p" variant="bodySmall">
                {siteConfig.footer.meta}
              </Text>
              <Text as="p" variant="bodySmall">
                {siteConfig.footer.note}
              </Text>
            </div>
          </div>
        </PageContainer>
      </footer>
    </>
  );
}
