import type { MetadataRoute } from "next";

import { siteConfig } from "@/site/config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: siteConfig.manifest.backgroundColor,
    description: siteConfig.manifest.description,
    display: "standalone",
    icons: [
      {
        sizes: siteConfig.manifest.icons.icon.sizes,
        src: siteConfig.manifest.icons.icon.src,
        type: siteConfig.manifest.icons.icon.type,
      },
      {
        sizes: siteConfig.manifest.icons.apple.sizes,
        src: siteConfig.manifest.icons.apple.src,
        type: siteConfig.manifest.icons.apple.type,
      },
    ],
    name: siteConfig.manifest.name,
    short_name: siteConfig.manifest.shortName,
    start_url: "/",
    theme_color: siteConfig.manifest.themeColor,
  };
}
