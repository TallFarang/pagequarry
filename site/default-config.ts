import type {
  ActionLink,
  PageTemplateKey,
  SocialImageVariant,
  TwitterCardType,
} from "@/content/types";
import type { SiteThemeSelection } from "@/site/themes";

export const socialImageVariants = {
  caseStudy: {
    alt: "Case study social card",
    path: "/og/page.svg",
  },
  guide: {
    alt: "Guide social card",
    path: "/og/page.svg",
  },
  home: {
    alt: "Home page social card",
    path: "/og/home.svg",
  },
  hub: {
    alt: "Hub page social card",
    path: "/og/page.svg",
  },
  narrative: {
    alt: "Narrative page social card",
    path: "/og/page.svg",
  },
  site: {
    alt: "Site social card",
    path: "/og/site.svg",
  },
} as const satisfies Record<SocialImageVariant, { alt: string; path: string }>;

export const templateMetadataDefaults = {
  caseStudy: {
    openGraphType: "article",
    schemaType: "Article",
    socialImage: "caseStudy",
    twitterCard: "summary_large_image",
  },
  guide: {
    openGraphType: "article",
    schemaType: "Article",
    socialImage: "guide",
    twitterCard: "summary_large_image",
  },
  home: {
    openGraphType: "website",
    schemaType: "WebSite",
    socialImage: "home",
    twitterCard: "summary_large_image",
  },
  hub: {
    openGraphType: "website",
    schemaType: "Service",
    socialImage: "hub",
    twitterCard: "summary_large_image",
  },
  narrative: {
    openGraphType: "website",
    schemaType: "WebPage",
    socialImage: "narrative",
    twitterCard: "summary_large_image",
  },
} as const satisfies Record<
  PageTemplateKey,
  {
    openGraphType: "article" | "website";
    schemaType: "Article" | "Service" | "WebPage" | "WebSite";
    socialImage: SocialImageVariant;
    twitterCard: TwitterCardType;
  }
>;

const primaryAction = {
  href: "/contact",
  label: "Contact",
} as const satisfies ActionLink;

const navigation = [
  { href: "/features", label: "Features" },
  { href: "/contact", label: "Contact" },
] as const satisfies readonly ActionLink[];

export const siteConfig = {
  theme: {
    name: "editorial",
  } satisfies SiteThemeSelection,
  contact: {
    email: "hello@example.com",
    location: "Online",
    primaryAction,
  },
  footer: {
    meta: "Configure the site identity, replace the starter content, and publish pages through structured markdown blocks.",
    note: "Templates, navigation, SEO defaults, and validation stay in code while content is published through the same pipeline.",
    tagline: "Structured publishing for React sites.",
  },
  identity: {
    description:
      "A structured website starter with reusable React templates and a validated markdown publishing workflow.",
    locale: "en_US",
    name: "Site Name",
    navigation,
    shortName: "Site",
    siteUrl: "https://example.com",
    subheader: "A structured website starter",
    title: "Site Name",
  },
  manifest: {
    backgroundColor: "#f7f0e8",
    description:
      "Structured publishing for React sites.",
    icons: {
      apple: {
        sizes: "180x180",
        src: "/site/apple-icon.svg",
        type: "image/svg+xml",
      },
      icon: {
        sizes: "any",
        src: "/site/icon.svg",
        type: "image/svg+xml",
      },
    },
    name: "Site Name",
    shortName: "Site",
    themeColor: "#f7f0e8",
  },
  metadata: {
    defaultAuthor: "Example Team",
    organization: {
      logo: "/site/icon.svg",
      name: "Site Name",
      sameAs: [] as string[],
    },
    robots: {
      follow: true,
      index: true,
    },
  },
  social: {
    defaultTwitterCard: "summary_large_image" as const,
    images: socialImageVariants,
    siteName: "Site Name",
  },
} as const;
