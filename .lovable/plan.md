
## The real problem

Google's `site:noobtoroot.com` shows every page — homepage, `/blog/active-directory-enumeration…`, `/blog/blackbird-osint…`, etc. — with the **same** title ("Noob to Root — Tech Tutorials, Linux & Hacking Guides") and the **same** description. Per-page meta is not missing in the CMS; it just never reaches Google.

Why: this project is a pure client-side Vite + React SPA. The only HTML ever served is `index.html`, which hard-codes the sitewide title/description/OG tags (lines 6–7, 58–61). `SEO.tsx` uses `react-helmet-async`, which mutates `document.head` **after** React hydrates in the browser. Googlebot does render JS, but:

1. It frequently indexes the **initial HTML** snapshot first and caches that title/description for weeks.
2. Social crawlers (LinkedIn, X, Slack, Facebook, Discord) do **not** execute JS at all — they only ever see the static `index.html`.

So every route on the site is indexed with the homepage's tags. Helmet is working; it's just too late.

The fix is to bake per-route `<title>`, `<meta name="description">`, canonical, and OG tags into the HTML that is actually served for each URL. On this stack (Vite SPA, Netlify hosting, no SSR runtime) the standard fix is **build-time prerendering**: after `vite build`, crawl every route in a headless browser, let Helmet run, and write the rendered HTML to `dist/<route>/index.html`. Netlify then serves the correct static HTML per URL. Users still get the same SPA experience (the app hydrates on top).

## Plan

### 1. Add `vite-plugin-prerender` (or `react-snap`) to the build

Install `vite-plugin-prerender` and wire it into `vite.config.ts`. It uses Puppeteer to visit each route against the built `dist/` output and snapshots the rendered HTML (including Helmet's head mutations) to `dist/<route>/index.html`.

### 2. Enumerate routes to prerender

The prerender list mirrors the sitemap generator (`scripts/generate-sitemap.ts`) — same source of truth so the two never drift:

- Static: `/`, `/blog`, `/about`, `/categories`, `/courses` (only when `courses_enabled`)
- Dynamic blog posts: query `posts` where `is_published = true` → `/blog/:slug`
- Dynamic courses: query `courses` where `is_published = true` → `/courses/:slug`
- Skip auth-only routes (`/login`, `/profile`, `/admin/*`, `/complete-profile`, `/referrals`, `/courses/:slug/learn`)

Extract this list into a small helper (`scripts/list-public-routes.ts`) that both the sitemap script and the prerender config import. Guarantees sitemap and prerendered pages stay identical.

### 3. Fix the static fallback in `index.html`

Even with prerender, `index.html` is still the fallback for unknown routes and the base template. Trim it so it doesn't fight per-route tags:

- Keep sitewide `og:site_name`, `og:type=website`, favicon, fonts, JSON-LD `Organization`.
- Leave the homepage-appropriate title/description as the default (only served for `/` and unknown routes).

No changes needed to `SEO.tsx` — Helmet already writes the right tags, prerender just captures them.

### 4. Confirm canonical + og:url per route

`SEO.tsx` already normalizes `canonical` and sets `og:url` to the same value. Audit each page to confirm it passes an accurate `canonical` prop:

- `Index.tsx` → `/`
- `BlogIndex.tsx` → `/blog`
- `About.tsx` → `/about`
- `Categories.tsx` → `/categories`
- `Courses.tsx` → `/courses`
- `CourseDetail.tsx` → `/courses/:slug`
- `BlogPost.tsx` → already correct

Add `canonical` where missing.

### 5. Netlify config

Ensure `public/_redirects` still has the SPA fallback `/*  /index.html  200` **below** any prerendered paths. Netlify serves the concrete `dist/<route>/index.html` first when it exists, then falls through to the SPA rewrite.

### 6. Verify

- Run `bun run build`, then `curl -s https://<preview>/blog/active-directory-enumeration | grep -E '<title>|og:title|description'` — must show the post's real title and excerpt, not the sitewide default.
- Use Google's Rich Results Test / URL Inspection on 2–3 URLs to confirm the fetched HTML now contains per-page metadata.
- Ask user to click "Request indexing" in Search Console for the homepage + a couple of top posts to accelerate re-crawl. Existing cached results will refresh over the next crawl cycle (days to weeks — not instant).

## Technical details

- **Why not just wait for Googlebot's JS render?** It does render, but (a) the render pass is delayed and unreliable, and (b) the initial HTML snapshot is what seeds the SERP entry; if that's identical for every URL, Google often dedupes/collapses them under one title until re-render. Prerender fixes the root cause.
- **Why not SSR (Next / TanStack Start)?** That's a full stack migration. Prerender gives 95% of the SEO benefit with a build-time step and no runtime server.
- **Social previews:** prerender also fixes LinkedIn/X/Slack sharing showing "Noob to Root — Tech Tutorials…" for every article. After deploy, ask each platform's link debugger to re-scrape (crawlers cache aggressively).
- **Build time cost:** prerender adds a few seconds per route. For a blog of ~50 posts this is negligible; if the catalog grows to thousands, we can switch to incremental prerender or SSR.

## Out of scope

- Migrating to an SSR framework.
- Changing the CMS/admin editor — per-page meta is already stored correctly in `posts.title`, `posts.excerpt`, `posts.featured_image`.
- SEO copy rewrites — this plan only makes the existing per-page tags reach crawlers.
