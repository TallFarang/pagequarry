import { describe, expect, it } from "vitest";

import { siteConfig } from "@/site/config";
import {
  resolveSiteTheme,
  themePresets,
  type SiteThemeName,
  type SiteThemeSelection,
} from "@/site/themes";

const expectedThemeNames = [
  "ocean",
  "editorial",
  "studio",
  "fieldNote",
] satisfies SiteThemeName[];

describe("site themes", () => {
  it("defines complete curated presets for every supported theme", () => {
    expect(Object.keys(themePresets).sort()).toEqual(
      [...expectedThemeNames].sort()
    );

    for (const name of expectedThemeNames) {
      const theme = resolveSiteTheme({ name });

      expect(theme).toMatchObject({
        name,
        button: expect.any(String),
        chrome: expect.any(String),
        cta: expect.any(String),
        hero: expect.any(String),
        media: expect.any(String),
        metrics: expect.any(String),
        motion: expect.any(String),
        process: expect.any(String),
        quote: expect.any(String),
        section: expect.any(String),
        layout: expect.any(String),
        surface: expect.any(String),
        typography: expect.any(String),
      });
    }
  });

  it("maps curated themes to their layout rhythm", () => {
    expect(themePresets.ocean.layout).toBe("contained");
    expect(themePresets.editorial.layout).toBe("reading");
    expect(themePresets.studio.layout).toBe("contained");
    expect(themePresets.fieldNote.layout).toBe("compact");
  });

  it("uses the configured site theme selection", () => {
    const theme = resolveSiteTheme(siteConfig.theme);

    expect(theme.name).toBe("editorial");
    expect(theme.hero).toBe("editorialMasthead");
    expect(theme.button).toBe("quietLink");
    expect(theme.motion).toBe("minimal");
    expect(theme.media).toBe("editorial");
    expect(theme.surface).toBe("plain");
    expect(theme.typography).toBe("editorial");
  });

  it("lets custom themes override approved visual variants over the ocean base", () => {
    const selection = {
      name: "custom",
      custom: {
        button: "sharpOutline",
        chrome: "flat",
        layout: "compact",
        media: "crisp",
        motion: "snappy",
        section: "compact",
        surface: "crisp",
        typography: "studio",
      },
    } satisfies SiteThemeSelection;

    const theme = resolveSiteTheme(selection);

    expect(theme.name).toBe("custom");
    expect(theme.button).toBe("sharpOutline");
    expect(theme.chrome).toBe("flat");
    expect(theme.layout).toBe("compact");
    expect(theme.media).toBe("crisp");
    expect(theme.motion).toBe("snappy");
    expect(theme.section).toBe("compact");
    expect(theme.surface).toBe("crisp");
    expect(theme.typography).toBe("studio");
    expect(theme.hero).toBe(themePresets.ocean.hero);
  });
});
