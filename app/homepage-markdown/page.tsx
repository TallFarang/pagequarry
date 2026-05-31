import type { Metadata } from "next";

import { HomepageMarkdownPanel } from "@/components/site/homepage-markdown-view";
import { getHomepageMarkdownSource } from "@/lib/content/homepage-source";

export const metadata: Metadata = {
  description: "The markdown file driving the homepage.",
  title: "Homepage Markdown",
};

export default function HomepageMarkdownPage() {
  return <HomepageMarkdownPanel closeHref="/" source={getHomepageMarkdownSource()} />;
}
