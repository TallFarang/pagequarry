---
template: hub
slug: /features
page_id: features
title: Features
description: A neutral feature overview for the starter site.
---

{% hero eyebrow="features" title="A reusable structure for website pages." deck="Use this page to inspect the hub template, section links, and call-to-action block before replacing the copy with your own." actionHref="/contact" actionLabel="Contact" /%}

{% sectionCopy eyebrow="site setup" title="Global settings live in one place." %}
Site identity, navigation, footer copy, metadata defaults, theme selection, and icon paths are configured in site/config.ts.

{% linkItem href="/" label="Homepage" summary="Return to the starter homepage." /%}
{% /sectionCopy %}

{% sectionCopy eyebrow="content workflow" title="Pages are published through validated markdown." tone="subtle" %}
Drafts start in content/submit-here/. The content CLI validates frontmatter, block syntax, allowed block order, slugs, and redirects before accepting a revision.

{% linkItem href="/contact" label="Contact page" summary="Open the starter contact page." /%}
{% /sectionCopy %}

{% sectionCopy eyebrow="presentation" title="React owns layout while markdown owns content." %}
Blocks and templates keep the visual system stable. Authors choose approved content structures instead of inventing page-specific layouts.
{% /sectionCopy %}

{% cta title="Use this as a starting point." body="Replace the starter pages with content for the website you are building." actionHref="/contact" actionLabel="Contact" /%}
