import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";
import { activeSiteTheme } from "@/site/theme-runtime";

const sectionVariants = cva("", {
  variants: {
    tone: {
      default: "",
      subtle: "bg-accent-soft/30",
      accent: "bg-accent text-accent-foreground",
    },
    theme: {
      open: "",
      compact: "",
      banded: "border-y border-border bg-surface/58",
    },
    spacing: {
      hero: "py-16 sm:py-24",
      default: "py-14 sm:py-20",
      compact: "py-10 sm:py-14",
      cta: "py-16 sm:py-18",
    },
  },
  defaultVariants: {
    tone: "default",
    theme: "open",
    spacing: "default",
  },
});

type SectionProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionVariants>;

export function Section({
  className,
  tone,
  spacing,
  theme,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        sectionVariants({ tone, spacing, theme: theme ?? activeSiteTheme.section }),
        className
      )}
      {...props}
    />
  );
}
