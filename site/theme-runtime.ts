import { siteConfig } from "@/site/config";
import { resolveSiteTheme } from "@/site/themes";

export const activeSiteTheme = resolveSiteTheme(siteConfig.theme);
