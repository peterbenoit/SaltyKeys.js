# Documentation Migration Guide — Astro Starlight

Use this file as instructions when converting an existing project's HTML/Tailwind/JS
documentation to the Astro + Starlight setup used by this project.

---

## What this stack is

**Astro** is a static site builder. **Starlight** is an Astro integration purpose-built
for documentation sites. Together they give you:

- A sidebar, search, light/dark mode, and breadcrumbs for free
- Content written as Markdown (`.md`) or MDX (`.mdx`) files
- Custom Astro components you can embed inside MDX
- A production build that is plain static HTML — no runtime framework

---

## Project layout

Documentation lives in a `docs/` subdirectory at the project root. It is a separate
Node project with its own `package.json`.

```
your-project/
├── docs/
│   ├── astro.config.mjs        ← Starlight config (nav, sidebar, meta tags, etc.)
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── assets/             ← Images referenced in content (Astro optimises them)
│       ├── components/         ← Custom .astro components importable in MDX
│       ├── content.config.ts   ← Registers the docs collection (boilerplate, don't change)
│       └── content/
│           └── docs/           ← All content lives here; file path = URL path
│               ├── index.mdx               → / (splash/landing page)
│               ├── getting-started/
│               │   ├── introduction.mdx    → /getting-started/introduction/
│               │   ├── installation.mdx
│               │   └── quick-start.mdx
│               ├── concepts/
│               │   └── *.mdx
│               ├── api/
│               │   └── *.mdx
│               └── project/
│                   ├── changelog.md
│                   └── contributing.mdx
└── (rest of your project)
```

---

## Bootstrapping from scratch

Run this inside your project root (not inside `docs/`):

```bash
npm create astro@latest docs -- --template starlight
```

Then install inside the new directory:

```bash
cd docs && npm install
```

### Test the initial setup

Before proceeding with configuration, verify the scaffolded project works:

```bash
npm run dev
```

Open http://localhost:4321 and confirm:
- The default Starlight page loads
- Navigation works
- Light/dark mode toggle works
- Search is functional

Stop the dev server (Ctrl+C) before continuing.

---

## `package.json` (inside `docs/`)

Minimal. Only three production dependencies are needed:

```json
{
  "name": "docs",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev":     "astro dev",
    "start":   "astro dev",
    "build":   "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/starlight": "^0.37.6",
    "astro": "^5.6.1",
    "sharp": "^0.34.2"
  }
}
```

Do not add Tailwind or any UI library — Starlight provides all necessary styling.

---

## `astro.config.mjs`

This is the main configuration file. Adapt the values; the structure is the same for
every project.

```js
// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://your-project-domain.com',
  integrations: [
    starlight({
      title: 'Your Project',
      description: 'One-sentence description of the project.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/you/your-project' },
      ],
      head: [
        { tag: 'meta', attrs: { name: 'author', content: 'Your Name' } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'Your Project' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
        { tag: 'meta', attrs: { name: 'color-scheme', content: 'light dark' } },
      ],
      editLink: {
        baseUrl: 'https://github.com/you/your-project/edit/main/docs/',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction',  slug: 'getting-started/introduction' },
            { label: 'Installation',  slug: 'getting-started/installation' },
            { label: 'Quick Start',   slug: 'getting-started/quick-start' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            // add concept pages here
          ],
        },
        {
          label: 'API Reference',
          items: [
            // add API pages here
          ],
        },
        {
          label: 'Project',
          items: [
            { label: 'Changelog',    slug: 'project/changelog' },
            { label: 'Contributing', slug: 'project/contributing' },
          ],
        },
      ],
    }),
  ],
});
```

### Test the configuration

After updating `astro.config.mjs`, verify the changes:

```bash
npm run dev
```

Check:
- Site title appears in the header
- Social links display correctly
- Sidebar structure matches your configuration (even if pages don't exist yet)
- No console errors in the browser or terminal

These validation steps catch configuration syntax errors before you invest time in content migration.

---

## `src/content.config.ts`

This is boilerplate. Copy it verbatim and do not modify it.

```ts
import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
```

---

## Content files — frontmatter

Every `.md` / `.mdx` file must start with a frontmatter block.

**Minimum required:**

```yaml
---
title: Page Title
description: One-sentence description shown in search and meta tags.
---
```

**Splash (landing) page only** — `src/content/docs/index.mdx`:

```yaml
---
title: Your Project
description: Tagline here.
template: splash
hero:
  tagline: Longer tagline for the splash layout.
  actions:
    - text: Get Started
      link: /getting-started/introduction/
      icon: right-arrow
    - text: Quick Start
      link: /getting-started/quick-start/
      icon: rocket
      variant: minimal
---
```

---

## Starlight built-in components

Import these at the top of any `.mdx` file. Do not create custom replacements for them.

```mdx
import { Aside, Card, CardGrid, Tabs, TabItem } from '@astrojs/starlight/components';
```

| Component | When to use |
|-----------|-------------|
| `<Aside>` | Notes, warnings, tips. Accepts `type="note"`, `"tip"`, `"caution"`, `"danger"` |
| `<Card>` + `<CardGrid>` | Feature grids on the landing page or overview pages |
| `<Tabs>` + `<TabItem>` | Showing the same concept in multiple formats (npm/pnpm/yarn, JS/TS, etc.) |

### Examples

```mdx
<Aside type="tip">
  You can chain all `$.fn.rq*` methods.
</Aside>

<CardGrid stagger>
  <Card title="Feature A" icon="puzzle">Description here.</Card>
  <Card title="Feature B" icon="document">Description here.</Card>
</CardGrid>

<Tabs>
  <TabItem label="npm">```bash\nnpm install your-package\n```</TabItem>
  <TabItem label="pnpm">```bash\npnpm add your-package\n```</TabItem>
</Tabs>
```

---

## Custom Astro components

When you need a UI element that Starlight doesn't provide, create an `.astro` file in
`docs/src/components/`. Then import it in any `.mdx` file.

**Component file (`docs/src/components/MyComponent.astro`):**

```astro
---
interface Props {
  title?: string;
}
const { title = 'Default Title' } = Astro.props;
---

<div class="my-component">
  <strong>{title}</strong>
  <slot />
</div>

<style>
  /* Use Starlight CSS custom properties for colours so light/dark mode works */
  .my-component {
    border: 1px solid var(--sl-color-gray-4);
    border-radius: 0.5rem;
    padding: 1rem;
    background: var(--sl-color-bg-sidebar);
  }
</style>
```

**Test the component before using it widely:**

1. Create a test page in `docs/src/content/docs/test.mdx`:
   ```mdx
   ---
   title: Component Test
   description: Testing custom components.
   ---

   import MyComponent from '../../components/MyComponent.astro';

   <MyComponent title="Test Title">
     Test content here.
   </MyComponent>
   ```
2. View the page at http://localhost:4321/test/ and verify:
   - Component renders correctly
   - Props are applied
   - Slot content displays
   - Light/dark mode both work
3. Delete the test page after verification

**Using it in MDX:**

```mdx
import MyComponent from '../../../components/MyComponent.astro';

<MyComponent title="Example">
  Content goes here. MDX markup works inside the slot.
</MyComponent>
```

**Starlight CSS custom properties to use in component styles:**

| Property | Meaning |
|----------|---------|
| `--sl-color-bg-sidebar` | Sidebar / muted background |
| `--sl-color-text` | Default body text |
| `--sl-color-text-accent` | Accent/link colour |
| `--sl-color-gray-4` | Muted border |
| `--sl-color-gray-6`, `--sl-color-gray-7` | Button backgrounds |
| `--sl-color-blue-low` | Blue tint for callouts |

For dark mode, use `:global([data-theme='dark']) .your-class { ... }`.

---

## CDN availability for your library

Before wiring up CodePen integration, make sure your library is available from a
CDN that CodePen (and other sandboxed environments) can load. **Do not use raw
GitHub file URLs** (`raw.githubusercontent.com`) — browsers block script execution
from that host in sandboxed iframes.

The standard choices are:

| CDN | URL pattern | Notes |
|-----|-------------|-------|
| **jsDelivr** | `https://cdn.jsdelivr.net/gh/{user}/{repo}@{tag}/{file}` | Recommended. Mirrors GitHub releases and branches. Works in CodePen. |
| **unpkg** | `https://unpkg.com/{package}@{version}/{file}` | npm-only. Requires the lib to be published to npm. |
| **cdnjs** | `https://cdnjs.cloudflare.com/ajax/libs/{lib}/{version}/{file}` | Manual submission required. |

**jsDelivr from a GitHub branch (no npm publish needed):**

```
https://cdn.jsdelivr.net/gh/your-username/your-repo@main/your-lib.js
```

**jsDelivr from a tagged release (recommended for stability):**

```
https://cdn.jsdelivr.net/gh/your-username/your-repo@v1.0.0/your-lib.js
```

Always use a tag or commit SHA in production — `@main` will serve whatever is
currently on the default branch, which may break consumers when you push changes.

**Hardcode the CDN URL in your `CodePenButton` component** so every demo pen
automatically loads your library at the correct version. Users should not need to
know the CDN URL.

---

## CodePen integration

If your project has interactive examples, you can add a **CodePen button** component
that opens a pre-filled pen with the example code. This is useful for letting users
experiment with code samples directly.

**Component file (`docs/src/components/CodePenButton.astro`):**

```astro
---
/**
 * CodePenButton — opens a pre-filled CodePen with the given HTML/CSS/JS.
 * Uses the CodePen Prefill API (POST form) so there's no iframe at page load.
 */
interface Props {
  title: string;
  html?: string;
  css?: string;
  js?: string;
  /** Extra JS URLs to include (e.g. jQuery CDN) */
  jsExternal?: string;
}

const {
  title,
  html = '',
  css = '',
  js = '',
  jsExternal = '',
} = Astro.props;

// Hardcode your library's jsDelivr CDN URL so every demo pen loads it automatically.
// Use a tagged release (e.g. @v1.0.0) rather than @main for stability.
const LIB_CDN = 'https://cdn.jsdelivr.net/gh/your-username/your-repo@main/your-lib.js';

// CodePen prefill data — the form field must be JSON-stringified
const penData = JSON.stringify({
  title,
  html,
  css,
  js,
  js_external: [
    LIB_CDN,
    jsExternal,
  ].filter(Boolean).join(';'),
  editors: '1010', // HTML + JS open, CSS collapsed
});
---

<form
  action="https://codepen.io/pen/define"
  method="POST"
  target="_blank"
  class="codepen-button-form"
>
  <input type="hidden" name="data" value={penData} />
  <button type="submit" class="codepen-button">
    <svg width="16" height="16" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
      <path d="M100 34.2c-.4-2.6-3.3-4-5.3-5.3-3.6-2.4-7.1-4.7-10.7-7.1-8.5-5.7-17.1-11.4-25.6-17.1-2-1.3-4-2.7-6-4-1.4-1-3.3-1-4.8 0-5.7 3.8-11.5 7.7-17.2 11.5L5.2 29C3 30.4.1 31.8 0 34.8c-.1 3.3 0 6.7 0 10v16c0 2.9-.6 6.3 2.1 8.1 6.4 4.4 12.9 8.6 19.4 12.9 8 5.3 16 10.7 24 16 2.2 1.5 4.4 3.1 7.1 1.3 2.3-1.5 4.5-3 6.8-4.5 8.9-5.9 17.8-11.9 26.7-17.8l9.9-6.6c.6-.4 1.3-.8 1.9-1.3 1.4-1 2-2.4 2-4.1V37.3c.1-1.1.2-2.1.1-3.1 0-.1 0 .2 0 0zM54.3 12.3 88 34.8 73 44.9 54.3 32.4zm-8.6 0v20L27.1 44.8 12 34.8zM8.6 42.8 19.3 50 8.6 57.2zm37.1 44.9L12 65.2l15-10.1 18.6 12.5v20.1zM50 60.2 34.8 50 50 39.8 65.2 50zm4.3 27.5v-20l18.6-12.5 15 10.1zm37.1-30.5L80.7 50l10.8-7.2z"/>
    </svg>
    Open in CodePen
  </button>
</form>

<style>
  .codepen-button-form {
    display: inline-block;
    margin: 0.5rem 0 1rem;
  }

  .codepen-button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.9rem;
    border-radius: 0.375rem;
    border: 1px solid var(--sl-color-gray-4);
    background: var(--sl-color-gray-7);
    color: var(--sl-color-text);
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    text-decoration: none;
  }

  .codepen-button:hover {
    background: var(--sl-color-gray-6);
    border-color: var(--sl-color-accent);
  }
</style>
```

**Using it in MDX:**

```mdx
---
title: Quick Start
description: Get started with your project.
---

import CodePenButton from '../../../components/CodePenButton.astro';

## Example

Here's a counter example you can try:

<CodePenButton
  title="Counter Example"
  html={`<div id="app">
  <p>Count: <strong id="count">0</strong></p>
  <button id="inc">Increment</button>
</div>`}
  js={`const count = 0;
document.getElementById('inc').addEventListener('click', () => {
  count++;
  document.getElementById('count').textContent = count;
});`}
/>
```

**When to use CodePen buttons:**

- Place them after code examples that would benefit from live experimentation
- Use them in Getting Started / Quick Start guides
- Include them in API reference pages to demonstrate specific features
- Add them to concept pages when explaining interactive behaviors

**Migration tip:** If your old docs had JSFiddle, JS Bin, or embedded CodePen iframes,
replace them with this button approach. It's faster (no iframe at page load) and more
consistent with the rest of the documentation design.

---

## Handling images and assets

Astro provides two ways to handle images, depending on where they come from and how they're used.

### Images referenced in Markdown/MDX (recommended)

Place images in `docs/src/assets/` and import them in your MDX files. Astro will
automatically optimize these images (WebP conversion, responsive sizes, lazy loading).

**Directory structure:**

```
docs/src/
  assets/
    logo.png
    screenshots/
      feature-a.png
      feature-b.png
  content/
    docs/
      getting-started/
        introduction.mdx
```

**In your MDX file:**

```mdx
---
title: Introduction
description: Getting started guide.
---

import logo from '../../../assets/logo.png';
import featureA from '../../../assets/screenshots/feature-a.png';
import { Image } from 'astro:assets';

<Image src={logo} alt="Project logo" width="200" />

## Features

<Image src={featureA} alt="Feature A screenshot" />
```

**Benefits:**

- Automatic optimization and responsive image generation
- Type safety — build fails if the image doesn't exist
- Images are versioned with your code

### Static assets (public directory)

For images that don't need optimization (e.g., favicons, social preview images, or
images referenced by URL in external tools), place them in `docs/public/`.

**Directory structure:**

```
docs/public/
  favicon.svg
  og-image.png
  diagrams/
    architecture.svg
```

**Referencing them:**

```mdx
![Architecture diagram](/diagrams/architecture.svg)
```

Or in frontmatter:

```yaml
---
title: Introduction
og:image: /og-image.png
---
```

Files in `public/` are served as-is at the root URL. They are **not** processed by Astro.

### Migrating existing images

**IMPORTANT: Preserve all existing images from the old docs.** Do not delete or skip any
images during migration. Every image referenced in the old documentation must be copied
to the new structure.

When converting old documentation:

1. **Identify all images** — search the old docs for `<img>`, `![](...)`, and CSS `background-image`
   - **Copy ALL images** from the old docs structure before proceeding
2. **Categorize them:**
   - **Content images** (screenshots, diagrams, illustrations) → `docs/src/assets/`
   - **Static assets** (favicons, OG images, SVG icons) → `docs/public/`
   - **Ensure no images are left behind** — verify the old docs folder has no orphaned images
3. **Update references:**
   - For images in `assets/`, use the `import` + `<Image>` pattern
   - For images in `public/`, use root-relative paths (`/filename.png`)
4. **Optimize before migrating:**
   - Convert large PNGs to JPG or WebP
   - Compress images (use ImageOptim, Squoosh, or similar)
   - Resize images to 2× the display size (e.g., 1200px wide for a 600px layout)
5. **Test image loading:**
   - Run `npm run dev` and navigate to pages with images
   - Verify all images display correctly
   - Check browser Network tab — images should load without 404 errors
   - Toggle light/dark mode to ensure images work in both themes
6. **Verify after migration:**
   - Compare the old and new docs directories to ensure all images were copied
   - Check the build output for broken image references
   - Run `npm run build` — Astro will fail the build if imported images don't exist

### Image syntax reference

| Source | Syntax |
|--------|--------|
| From `assets/` | `import img from '../../assets/img.png';`<br/>`<Image src={img} alt="..." />` |
| From `public/` | `![Alt text](/path/to/image.png)` |
| External URL | `![Alt text](https://example.com/image.png)` |

**When to use which:**

- **Use `assets/`** for all content images that are part of your documentation
- **Use `public/`** for meta images (OG, favicon), static SVG icons, or images that must remain unprocessed
- **Use external URLs** sparingly — they break if the external site goes down

---

## Converting existing HTML/Tailwind/JS docs

Work through these steps in order.

### 1. Audit the existing content

List every distinct page/section in the old docs. Group them into:

- **Getting Started** — intro, install, quick start
- **Concepts** — how things work (one page per concept)
- **API Reference** — one page per method/attribute/option
- **Project** — changelog, contributing

### 2. Create the sidebar in `astro.config.mjs`

Define the full sidebar before writing any content files. This is the canonical navigation
structure — the sidebar drives the URL slugs.

### 3. Convert pages one at a time

For each page:

1. Create `docs/src/content/docs/<section>/<slug>.mdx`
2. Add frontmatter (`title`, `description`)
3. Paste the existing content; convert HTML markup to Markdown
4. Replace custom UI widgets with Starlight built-ins (`<Aside>`, `<Tabs>`, etc.)
5. Any widget with no Starlight equivalent → create a component in `docs/src/components/`
6. **Test the page immediately** — with dev server running, navigate to the new page and verify:
   - Content renders correctly
   - Links work
   - Code blocks have proper syntax highlighting
   - Images display (see images section below)
   - Components render without errors

**Testing workflow:** Keep `npm run dev` running in a terminal. After saving each file, the browser auto-reloads. Check the page before moving to the next one. This catches issues early when context is fresh.

### 4. Replace Tailwind utility classes

Tailwind is not available. Replace inline layout/colour styles with:

- Starlight CSS properties (`--sl-color-*`, `--sl-font-*`) in component `<style>` blocks
- Standard Markdown (headings, tables, lists) for structure
- `<CardGrid>` / `<Card>` for side-by-side layouts

### 5. Comprehensive testing and validation

#### Development testing checklist

With `npm run dev` running, systematically test:

- [ ] **Navigation** — click through every sidebar link
- [ ] **Search** — search for key terms, verify results link correctly
- [ ] **Internal links** — test cross-references between pages
- [ ] **External links** — verify social links and external resources open correctly
- [ ] **Images** — check all images load in both light and dark mode
- [ ] **Code samples** — verify syntax highlighting and copy buttons work
- [ ] **Interactive components** — test CodePen buttons, tabs, accordions
- [ ] **Responsive design** — resize browser, test mobile navigation
- [ ] **Light/dark mode** — toggle and verify all pages render correctly in both

#### Production build testing

```bash
cd docs
npm run build    # must complete with 0 errors
```

**The build must complete with zero errors.** Common build failures:
- Missing images referenced in MDX imports
- Invalid frontmatter syntax
- Broken internal links (Astro validates these at build time)
- Malformed MDX (unclosed tags, invalid component props)

Fix all errors before proceeding.

#### Preview testing

```bash
npm run preview  # serves the built site at localhost:4321
```

Test the production build:
- [ ] All pages load correctly
- [ ] Assets (images, fonts) load from the correct paths
- [ ] Navigation and search work identically to dev mode
- [ ] No console errors in browser developer tools
- [ ] Page load performance is acceptable

#### Cross-browser testing

Test in at least:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on macOS)

Verify:
- Layout is consistent
- Fonts render correctly
- Interactive elements work

#### Accessibility testing

Run basic accessibility checks:
- Tab through navigation — verify keyboard focus is visible
- Use a screen reader to test a few pages
- Check colour contrast (browser dev tools have built-in analyzers)
- Verify all images have `alt` text

---

## Testing the JavaScript library

If the project you're migrating includes a JavaScript library (a `.js` file that users
include in their projects), write a test suite for it **before** you consider the
migration complete. Documentation without tests leaves the library fragile — easy to
break silently when the code is updated later.

### When to write tests

Write tests if any of the following are true:

- The library exposes a public API (methods, classes, or functions)
- The library has configurable behaviour that varies the output
- The library interacts with browser globals (`window`, `document`, `btoa`, etc.)
- The library will be linked to from the docs as something users depend on

If the library is trivially simple (a single utility function with no branching), a
manually verified smoke test in the browser console may be sufficient. Everything else
warrants an automated suite.

### Recommended approach — Node.js built-in test runner

For a single-file vanilla JS library with no build step, the lightest option is the
Node.js built-in test runner (available from Node 18+). No additional dependencies
are required.

```
your-project/
├── your-lib.js        ← the library
└── test/
    └── your-lib.test.js
```

**Test file structure (`test/your-lib.test.js`):**

```js
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Polyfill browser globals the library needs
globalThis.window = {
  location: { href: 'https://codepen.io/user/pen/AbCdEf', hostname: 'codepen.io' },
};
globalThis.document = {
  querySelector: () => null,
  createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, prepend() {}, remove() {} }),
  body: { prepend() {} },
  readyState: 'complete',
  addEventListener: () => {},
};
globalThis.btoa = (s) => Buffer.from(s, 'binary').toString('base64');
globalThis.atob = (s) => Buffer.from(s, 'base64').toString('binary');

// Load the library via eval so it runs in this module's scope
const libSrc = readFileSync(new URL('../your-lib.js', import.meta.url), 'utf8');
eval(libSrc);

describe('YourLib', () => {
  test('returns expected value for known input', () => {
    const result = YourLib.someMethod('input');
    assert.equal(result, 'expected output');
  });

  test('returns null for invalid input', () => {
    assert.equal(YourLib.someMethod(''), null);
    assert.equal(YourLib.someMethod(null), null);
  });
});
```

Add a `test` script to your root `package.json`:

```json
{
  "scripts": {
    "test": "node --test test/*.test.js"
  }
}
```

Run with:

```bash
npm test
```

### What to test

Cover these categories, in priority order:

| Category | Examples |
|----------|---------|
| **Happy path** | Valid inputs produce the expected output |
| **Invalid inputs** | Empty string, null, wrong type → returns null or throws with a clear message |
| **Round-trip** | If the library has encode/decode or generate/retrieve pairs, verify they reverse correctly |
| **Context-dependent behaviour** | Results that change based on URL, environment, or configuration |
| **Error paths** | Bad config, missing DOM element, corrupted data |

### Polyfilling browser globals for Node.js

Libraries that use `window`, `document`, `btoa`/`atob`, or `localStorage` need those
globals stubbed before the library source is eval'd. Keep stubs minimal — only implement
what the library actually calls.

Common stubs:

```js
// window.location
globalThis.window = {
  location: { href: 'https://your-site.com/projects/my-id', hostname: 'your-site.com' },
};

// document.querySelector (returning null simulates "element not found")
globalThis.document = { querySelector: () => null };

// Base64 (Node.js Buffer-based — identical byte-level behaviour to browser btoa/atob)
globalThis.btoa = (s) => Buffer.from(s, 'binary').toString('base64');
globalThis.atob = (s) => Buffer.from(s, 'base64').toString('binary');
```

To test different environments, reassign `globalThis.window.location.href` between
tests (or between `describe` blocks) before each operation under test.

### Adding tests to the CI / pre-deployment checklist

Once tests exist, run them as part of every build:

```bash
npm test          # library tests
cd docs && npm run build  # docs build
```

Add `npm test` to `CONTRIBUTING.md` so contributors know to run it before opening a PR.

---

## Running the docs locally

```bash
cd docs
npm run dev      # → http://localhost:4321
```

---

## Deploying to Vercel

This project is configured to deploy on **Vercel**. The `vercel.json` at the project
root tells Vercel where to find the docs and how to build them.

### `vercel.json` (project root)

```json
{
  "buildCommand": "npm install --prefix docs && npm run build",
  "outputDirectory": "docs/dist",
  "framework": null
}
```

| Field | Value | Why |
|-------|-------|-----|
| `buildCommand` | `npm install --prefix docs && npm run build` | Installs deps inside `docs/` then runs `astro build` |
| `outputDirectory` | `docs/dist` | Astro writes the static output here |
| `framework` | `null` | Disables Vercel's framework auto-detection; the build command handles everything |

**Do not change `framework` to `astro`** — Vercel's Astro preset assumes the Astro
project is at the repo root, which it isn't. Leaving it `null` and providing the
explicit `buildCommand` is the correct approach for a `docs/` subdirectory layout.

### Setting up Vercel

1. Import the repository in the [Vercel dashboard](https://vercel.com/new)
2. Vercel will detect `vercel.json` automatically — no additional settings needed
3. Set the **Root Directory** to `/` (the repo root, not `docs/`)
4. Do **not** override the Build Command or Output Directory in the Vercel UI —
   `vercel.json` takes precedence, but overrides in the UI can create conflicts

### Environment variables

Astro reads environment variables at **build time**, not runtime (it produces static HTML).

- Prefix public variables with `PUBLIC_` (e.g. `PUBLIC_API_URL`) — they will be inlined
  into the built output
- Variables without `PUBLIC_` are available only during the build; they do not appear in
  the client-side output
- Set variables in **Vercel → Project → Settings → Environment Variables**

### Pre-deployment checklist

Before merging or pushing to the branch Vercel tracks:

```bash
cd docs
npm run build    # must complete with 0 errors
npm run preview  # spot-check the built output at localhost:4321
```

- [ ] `npm run build` exits with 0 errors
- [ ] All pages load in `npm run preview`
- [ ] No broken images or links in the preview
- [ ] `vercel.json` is committed to the repo root

### Vercel preview deployments

Every pull request gets an automatic preview URL. Use this to verify changes before
merging. Share the preview URL with reviewers so they can test in the browser without
running the project locally.

---

## Standard repository and website files

Every project should ship with the files below. Check each one exists and is up to date
before considering a migration complete.

### Repository root

| File | Purpose | Notes |
|------|---------|-------|
| `README.md` | Project overview, install instructions, quick usage | Must exist. Keep it concise; link to the docs site for the full reference. |
| `LICENSE` | Legal terms for use and distribution | Match the SPDX identifier in `package.json` `"license"` field. |
| `CHANGELOG.md` | Human-readable history of releases | Follow [Keep a Changelog](https://keepachangelog.com) format. |
| `CONTRIBUTING.md` | How to file issues, submit PRs, run tests | Link from `README.md`. |
| `SECURITY.md` | How to report vulnerabilities | GitHub will surface this automatically in the Security tab. |
| `CODE_OF_CONDUCT.md` | Community standards | The Contributor Covenant is a good default. |
| `.gitignore` | Files Git should not track | At minimum exclude `node_modules/`, `docs/dist/`, `.env*`. |
| `.editorconfig` | Consistent editor settings across contributors | Tab/space, line ending, trim trailing whitespace. |
| `package.json` | Project metadata, scripts, dependencies | Ensure `name`, `version`, `license`, `description`, `repository`, and `bugs` fields are filled in. |
| `vercel.json` | Vercel deployment config (see Vercel section above) | Must be at the repo root. |

### `docs/public/` — static files served at the site root

These files are served verbatim by the web server and must live in `docs/public/`:

| File | Purpose | Notes |
|------|---------|-------|
| `favicon.svg` (or `.ico`) | Browser tab icon | SVG preferred; add `.ico` for legacy browsers. |
| `robots.txt` | Crawler instructions | Allow all by default; block `docs/dist/` paths if needed. |
| `humans.txt` | Credits for humans, not bots | List contributors, tools, and technologies used. |
| `sitemap.xml` | Search engine page index | Astro/Starlight generates this automatically at build time — verify the output at `/sitemap-index.xml` after `npm run build`. |
| `og-image.png` | Default Open Graph / social share image | 1200 × 630 px. Referenced in `astro.config.mjs` `head` meta tags. |
| `apple-touch-icon.png` | iOS home screen icon | 180 × 180 px. |
| `site.webmanifest` | PWA manifest (name, icons, theme colour) | Required if you want "Add to Home Screen" support. |
| `.well-known/security.txt` | Machine-readable security contact info | See [securitytxt.org](https://securitytxt.org). |

### `robots.txt` template

```
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap-index.xml
```

### `humans.txt` template

```
/* TEAM */
Developer: Your Name
Site: https://your-site.com
Location: Your City, Country

/* THANKS */
Astro: https://astro.build
Starlight: https://starlight.astro.build

/* SITE */
Last update: YYYY/MM/DD
Language: English
Standards: HTML5, CSS3
Components: Astro, Starlight
Hosted on: Vercel
```

### `SECURITY.md` template

```markdown
# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | ✅        |

## Reporting a Vulnerability

Do **not** open a public GitHub issue for security vulnerabilities.

Instead, please report them via [GitHub's private vulnerability reporting](https://github.com/you/your-project/security/advisories/new)
or email security@your-domain.com.

You'll receive a response within 48 hours and a patch within 7 days for confirmed issues.
```

### Checklist

Before marking a migration complete, verify these exist and are accurate:

- [ ] `README.md` — updated with docs site URL and current install instructions
- [ ] `LICENSE` — present, year and author are current
- [ ] `CHANGELOG.md` — initial entry created
- [ ] `CONTRIBUTING.md` — present
- [ ] `SECURITY.md` — present with a valid contact method
- [ ] `CODE_OF_CONDUCT.md` — present
- [ ] `.gitignore` — excludes `node_modules/`, `docs/dist/`, `.env*`
- [ ] `.editorconfig` — present
- [ ] `vercel.json` — present at repo root (see Vercel section)
- [ ] `docs/public/favicon.svg` — present
- [ ] `docs/public/robots.txt` — present with correct sitemap URL
- [ ] `docs/public/humans.txt` — present and up to date
- [ ] `docs/public/og-image.png` — 1200 × 630 px
- [ ] `docs/public/apple-touch-icon.png` — 180 × 180 px
- [ ] `docs/public/site.webmanifest` — present
- [ ] Sitemap accessible at `/sitemap-index.xml` after `npm run build`

---

## What NOT to do

- Do not add Tailwind, Bootstrap, or any CSS framework to the Astro project
- Do not add React, Vue, or Svelte — Starlight components are Astro-only
- Do not edit files in `docs/dist/` — that folder is generated by `npm run build`
- Do not create custom layouts or override Starlight's base layout unless absolutely
  necessary — use the built-in `template: splash` for the landing page and the default
  doc layout for everything else
- Do not write raw CSS outside of component `<style>` blocks; use Starlight's CSS
  properties for theming so light/dark mode works automatically
