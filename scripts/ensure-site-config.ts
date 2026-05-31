import fs from "node:fs";
import path from "node:path";

export const generatedSiteConfigMarker = "Generated framework fallback config";

const configPath = path.join(process.cwd(), "site", "config.ts");
const fallbackConfig = `// ${generatedSiteConfigMarker}
// This file is ignored by the framework branch. Replace it by running
// npm run site:init, or provide a site-owned site/config.ts in your website repo.
export {
  siteConfig,
  socialImageVariants,
  templateMetadataDefaults,
} from "./default-config";
`;

if (!fs.existsSync(configPath)) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, fallbackConfig, "utf8");
}
