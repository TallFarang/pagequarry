import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";
import { activeSiteTheme } from "@/site/theme-runtime";

const pageContainerVariants = cva("mx-auto w-full px-6 sm:px-8", {
  variants: {
    layout: {
      open: "theme-layout-open max-w-7xl",
      reading: "theme-layout-reading max-w-4xl",
      contained: "theme-layout-contained max-w-6xl",
      compact: "theme-layout-compact max-w-3xl",
    },
    width: {
      narrow: "max-w-3xl",
      reading: "max-w-4xl",
      wide: "max-w-6xl",
      full: "max-w-7xl",
    },
  },
});

type PageContainerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof pageContainerVariants>;

export function PageContainer({
  className,
  layout,
  width,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        pageContainerVariants({
          layout: layout ?? (width ? undefined : activeSiteTheme.layout),
          width,
        }),
        className
      )}
      {...props}
    />
  );
}
