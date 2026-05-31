export type SiteThemeName = "ocean" | "editorial" | "studio" | "fieldNote";
export type SiteThemeSelectionName = SiteThemeName | "custom";

export type ButtonTheme = "oceanSolid" | "softRounded" | "sharpOutline" | "quietLink";
export type ChromeTheme = "floating" | "flat" | "masthead";
export type HeroTheme = "oceanOpen" | "editorialMasthead" | "studioSplit" | "fieldIntro";
export type LayoutTheme = "open" | "reading" | "contained" | "compact";
export type SectionTheme = "open" | "compact" | "banded";
export type CtaTheme = "open" | "contained" | "quiet";
export type MetricsTheme = "openGrid" | "cards";
export type MotionTheme = "gentle" | "minimal" | "snappy" | "quiet";
export type ProcessTheme = "timeline" | "cards";
export type QuoteTheme = "accentRule" | "panel";
export type SurfaceTheme = "glass" | "plain" | "crisp" | "paper";
export type TypographyTheme = "friendly" | "editorial" | "studio" | "fieldNote";

export type SiteTheme = {
  name: SiteThemeSelectionName;
  button: ButtonTheme;
  chrome: ChromeTheme;
  cta: CtaTheme;
  hero: HeroTheme;
  layout: LayoutTheme;
  metrics: MetricsTheme;
  motion: MotionTheme;
  process: ProcessTheme;
  quote: QuoteTheme;
  section: SectionTheme;
  surface: SurfaceTheme;
  typography: TypographyTheme;
};

export type CustomThemeConfig = Partial<Omit<SiteTheme, "name">>;

export type SiteThemeSelection =
  | { name: SiteThemeName }
  | { name: "custom"; custom?: CustomThemeConfig };

export const themePresets = {
  ocean: {
    name: "ocean",
    button: "oceanSolid",
    chrome: "floating",
    cta: "contained",
    hero: "oceanOpen",
    layout: "contained",
    metrics: "cards",
    motion: "gentle",
    process: "timeline",
    quote: "accentRule",
    section: "open",
    surface: "glass",
    typography: "friendly",
  },
  editorial: {
    name: "editorial",
    button: "quietLink",
    chrome: "masthead",
    cta: "quiet",
    hero: "editorialMasthead",
    layout: "reading",
    metrics: "openGrid",
    motion: "minimal",
    process: "timeline",
    quote: "accentRule",
    section: "open",
    surface: "plain",
    typography: "editorial",
  },
  studio: {
    name: "studio",
    button: "sharpOutline",
    chrome: "flat",
    cta: "contained",
    hero: "studioSplit",
    layout: "contained",
    metrics: "cards",
    motion: "snappy",
    process: "cards",
    quote: "panel",
    section: "banded",
    surface: "crisp",
    typography: "studio",
  },
  fieldNote: {
    name: "fieldNote",
    button: "softRounded",
    chrome: "flat",
    cta: "open",
    hero: "fieldIntro",
    layout: "compact",
    metrics: "openGrid",
    motion: "quiet",
    process: "timeline",
    quote: "panel",
    section: "compact",
    surface: "paper",
    typography: "fieldNote",
  },
} as const satisfies Record<SiteThemeName, SiteTheme>;

export function resolveSiteTheme(selection: SiteThemeSelection): SiteTheme {
  if (selection.name === "custom") {
    return {
      ...themePresets.ocean,
      ...selection.custom,
      name: "custom",
    };
  }

  return themePresets[selection.name];
}
