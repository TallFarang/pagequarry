import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { activeMotionClass } from "@/components/site/theme-classes";
import { cn } from "@/lib/cn";
import { activeSiteTheme } from "@/site/theme-runtime";

const buttonVariants = cva(
  "inline-flex min-w-[9.75rem] transform-gpu items-center justify-center gap-2 whitespace-nowrap px-5 py-3 text-sm font-semibold tracking-[0.01em] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid:
          "rounded-full bg-slate-900 text-white shadow-[0_18px_36px_rgba(16,32,48,0.18)] hover:-translate-y-px hover:bg-slate-800 hover:shadow-[0_22px_42px_rgba(16,32,48,0.24)] hover:brightness-[1.03] active:translate-y-0 active:shadow-[0_14px_28px_rgba(16,32,48,0.18)]",
        ghost:
          "rounded-full border border-white/70 bg-white/70 text-foreground shadow-[0_18px_36px_rgba(16,32,48,0.08)] backdrop-blur-xl hover:-translate-y-px hover:border-accent/35 hover:bg-white/88 hover:shadow-[0_20px_40px_rgba(16,32,48,0.12)] active:translate-y-0 active:shadow-[0_14px_28px_rgba(16,32,48,0.08)]",
        link: "px-0 py-0 text-accent underline decoration-border underline-offset-4 hover:text-accent/85 hover:decoration-accent",
        oceanSolid:
          "rounded-[var(--control-radius)] bg-accent text-accent-foreground shadow-[var(--shadow-button)] hover:shadow-[var(--motion-shadow)] hover:brightness-[1.04] active:translate-y-0",
        softRounded:
          "rounded-[var(--control-radius)] border border-border bg-surface text-foreground shadow-[var(--shadow-soft)] hover:border-accent/40 hover:text-accent active:translate-y-0",
        sharpOutline:
          "rounded-[var(--control-radius)] border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background active:translate-y-0",
        quietLink:
          "min-w-0 rounded-none px-0 py-1 text-accent underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent",
      },
    },
    defaultVariants: {
      variant: "oceanSolid",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant: variant ?? activeSiteTheme.button }),
          activeMotionClass(),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
