import { activeSiteTheme } from "@/site/theme-runtime";

export const motionClasses = {
  gentle:
    "theme-motion-gentle transition-[transform,background-color,border-color,color,box-shadow,filter] duration-[var(--motion-duration)] ease-[var(--motion-ease)] hover:translate-y-[var(--motion-lift)]",
  minimal:
    "theme-motion-minimal transition-[color,border-color,text-decoration-color] duration-[var(--motion-duration)] ease-[var(--motion-ease)]",
  snappy:
    "theme-motion-snappy transition-[transform,background-color,border-color,color,box-shadow] duration-[var(--motion-duration)] ease-[var(--motion-ease)] hover:translate-y-[var(--motion-lift)]",
  quiet:
    "theme-motion-quiet transition-[background-color,border-color,color] duration-[var(--motion-duration)] ease-[var(--motion-ease)]",
} as const;

export const surfaceClasses = {
  glass:
    "theme-surface-glass rounded-[var(--panel-radius)] border border-white/70 bg-surface/78 shadow-[var(--shadow-soft)] backdrop-blur-xl",
  plain:
    "theme-surface-plain border-y border-border bg-transparent shadow-none",
  crisp:
    "theme-surface-crisp rounded-[var(--panel-radius)] border border-border bg-surface shadow-[var(--shadow-soft)]",
  paper:
    "theme-surface-paper rounded-[var(--panel-radius)] border border-border bg-surface/86 shadow-[var(--shadow-soft)]",
} as const;

export const mediaClasses = {
  soft: "theme-media-soft rounded-[var(--panel-radius)]",
  editorial: "theme-media-editorial rounded-[var(--panel-radius)]",
  crisp: "theme-media-crisp rounded-[var(--panel-radius)]",
  fieldNote: "theme-media-field-note rounded-[var(--panel-radius)]",
} as const;

export function activeMotionClass() {
  return motionClasses[activeSiteTheme.motion];
}

export function activeSurfaceClass() {
  return surfaceClasses[activeSiteTheme.surface];
}

export function activeMediaClass() {
  return mediaClasses[activeSiteTheme.media];
}
