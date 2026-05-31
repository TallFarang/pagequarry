# Examples

This directory is the active location for starter fixtures after a site has been initialized.

Use it when you need to:

- reseed a neutral starter site after `npm run site:init`
- test the content pipeline against known-good examples
- inspect one example for each template family

The tracked starter source lives in `init/content/examples/seed/`. `npm run site:init` copies those files into `content/examples/seed/`, then submits them through the content pipeline.

To initialize a new site with starter pages and generic starter assets:

```bash
npm run site:init
```

To reseed only the markdown pages from them:

```bash
npm run content -- seed content/examples/seed
```

Normal writing should not happen here. New drafts still belong in `content/submit-here/`, and reusable starter changes should be made in `init/content/examples/seed/`.
