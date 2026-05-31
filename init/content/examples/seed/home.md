---
template: home
slug: /
page_id: home
title: Site Name
description: A neutral starter homepage for a structured website.
---

{% hero eyebrow="starter site" title="Publish a structured website with reusable blocks." deck="This neutral starter page shows the content model without tying the site to a specific brand, product, or organization." aside="Replace this copy, update site/config.ts, and publish your own pages through the content workflow." actionHref="/contact" actionLabel="Contact" /%}

{% metrics %}
{% metric label="Content" value="structured" /%}
{% metric label="Publishing" value="validated" /%}
{% metric label="Runtime" value="generated" /%}
{% /metrics %}

{% sectionCopy eyebrow="overview" title="Start with shared page building blocks." %}
The starter uses a small catalog of blocks so new pages stay consistent as the site grows.

Edit the global identity in site/config.ts, replace the public assets, then revise these starter pages or write new drafts in content/submit-here/.

{% linkItem href="/features" label="View features" summary="See a neutral feature overview page." /%}
{% linkItem href="/contact" label="Contact page" summary="See a neutral contact page." /%}
{% /sectionCopy %}

{% process eyebrow="workflow" title="Create, check, publish." %}
{% step title="Configure the site" body="Set identity, navigation, footer, metadata, theme, and icon paths in site/config.ts." /%}
{% step title="Write drafts" body="Create markdown files in content/submit-here/ using the approved block catalog." /%}
{% step title="Accept revisions" body="Run the content CLI to validate drafts and publish accepted revisions into the archive." /%}
{% /process %}

{% quote quote="A small publishing surface keeps future edits easier to review." attribution="Starter Site" context="Generic example content" /%}

{% cta title="Replace the starter content when you are ready." body="The starter proves the system works. Your website should own the final copy, assets, and navigation." actionHref="/contact" actionLabel="Contact" /%}
