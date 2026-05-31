import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

export const textVariants = cva("", {
  variants: {
    variant: {
      brand:
        "font-brand text-[0.9rem] font-semibold tracking-[0.12em] text-foreground whitespace-nowrap",
      eyebrow:
        "font-label text-[0.76rem] font-medium uppercase tracking-[0.1em] text-muted-foreground",
      display:
        "font-heading text-[var(--type-display-size)] font-[var(--type-heading-weight)] leading-[0.94] text-foreground",
      lead: "text-lg leading-[var(--type-body-leading)] text-muted-foreground sm:text-[1.22rem]",
      sectionTitle:
        "font-heading text-[var(--type-section-size)] font-[var(--type-heading-weight)] leading-[1.04] text-foreground",
      body: "text-base leading-[var(--type-body-leading)] text-muted-foreground sm:text-[1.05rem]",
      bodySmall: "text-sm leading-6 text-muted-foreground",
      subhead:
        "font-heading text-2xl font-[var(--type-heading-weight)] leading-tight text-foreground",
      link:
        "font-medium text-accent underline decoration-current underline-offset-4",
      inlineLink:
        "text-accent underline decoration-current underline-offset-4",
      metricLabel:
        "font-label text-[0.74rem] font-medium tracking-[0.1em] text-muted-foreground",
      metricValue:
        "font-metric text-4xl font-[var(--type-heading-weight)] leading-none text-foreground",
      quote:
        "font-heading text-3xl font-[var(--type-heading-weight)] leading-[1.04] text-foreground sm:text-[3.2rem]",
      nav: "font-nav text-[0.78rem] font-medium tracking-[0.04em] text-muted-foreground hover:text-accent whitespace-nowrap",
      navTop:
        "font-nav text-[0.78rem] font-medium tracking-[0.04em] text-muted-foreground hover:text-foreground whitespace-nowrap",
      navSection:
        "font-nav text-[0.76rem] font-medium tracking-[0.04em] text-muted-foreground",
      navChild: "text-sm text-muted-foreground hover:text-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TextOwnProps<TAs extends ElementType> = VariantProps<typeof textVariants> & {
  as?: TAs;
  className?: string;
};

export type TextProps<TAs extends ElementType = "p"> = TextOwnProps<TAs> &
  Omit<ComponentPropsWithoutRef<TAs>, keyof TextOwnProps<TAs>>;

export function Text<TAs extends ElementType = "p">({
  as,
  className,
  variant,
  ...props
}: TextProps<TAs>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}
