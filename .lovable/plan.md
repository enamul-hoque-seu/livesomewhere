# Performance Optimization Plan — Target 95+ Mobile

## Current state (from report)
- Performance **67** mobile · FCP **4.5s** · LCP **5.4s** · TBT 30ms · CLS 0.002
- LCP element render delay: **2,980 ms** (waiting for React to mount before hero renders)
- Render-blocking CSS: ~350 ms
- Unused JS: **285 KiB** (editor-vendor 112KB + supabase 40KB shipped to homepage)
- Unsplash course images: 317KB transferred, 249KB savings (1200×675 served, displayed 662×372)
- Logos missing explicit width/height (CLS warning)
- GTM costs ~87ms main thread

## Fixes

### 1. Eliminate LCP render delay (biggest win, ~2s)
The LCP candidate (hero headline) is inside a React tree that only paints after the JS bundle loads/parses. Inject a **static SSR-like hero shell** directly into `index.html` so the browser paints the headline immediately, then hydrate over it.

- Add a `<div id="hero-skeleton">` inside `<div id="root">` in `index.html` containing the H1 ("Hack the gap / From Zero to Root.") and intro paragraph with inline critical CSS (font-family, color, spacing). Browser paints it in the first frame.
- In `src/main.tsx`, React will replace `#root` content on mount — the skeleton naturally goes away.
- Result: LCP becomes the static H1, painted at ~FCP time instead of after JS executes.

### 2. Strip editor-vendor + heavy admin code from initial bundle
- `editor-vendor` (TipTap, 122 KB) is only used in admin. Verify it's not pulled into the main chunk by checking that no public page imports `RichTextEditor`. Currently `AdminLayout` is lazy, but the manualChunk forces those modules into one shared chunk that *might* get preloaded. Move TipTap imports to a dynamic `import()` inside `RichTextEditor.tsx` so it's only fetched when that component renders, and remove the explicit editor-vendor entry from `manualChunks` (let Rollup tree-shake it into the lazy admin chunks naturally).
- Same treatment for any unused-on-home dependency.

### 3. Defer GTM / Analytics
- Move `Analytics` (GTM) load behind `requestIdleCallback` (or a 2-second timeout fallback) so it never blocks the main thread during initial load. Keep it in `<Analytics />` component, just delay the script injection.

### 4. Optimize Unsplash images (249 KB savings)
The DB stores cover_image URLs like `…?w=1200&h=675&fit=crop`. In `Index.tsx` Featured Courses and `Courses.tsx` list:
- Build a helper that rewrites Unsplash URLs to request `w=720&q=70&fm=webp&fit=crop` (matches displayed ~362-720px width range).
- Add `srcSet` with 400w / 720w / 1080w variants and a proper `sizes` attribute.
- Add explicit `width={720}` `height={405}` on the `<img>` tags.

### 5. Logo dimensions (CLS)
- Add `width` and `height` attributes to the `<img>` tags in `Navbar.tsx` and `Footer.tsx` so layout is reserved before the SVG loads.

### 6. Inline critical CSS / reduce render-blocking CSS (350 ms savings)
- The 14.7 KB `index.css` is render-blocking. Keep Tailwind base small by:
  - Already covered; biggest gain comes from #1 (hero paints before CSS-heavy components mount).
- Optionally add `<style>` block in `<head>` with the ~2 KB of critical tokens (`:root` HSL vars + body font/background) so first paint doesn't need the external stylesheet.

### 7. Verify
After deploy, run PageSpeed again. Expect:
- LCP ~1.8–2.5s (from 5.4s)
- FCP ~1.5–2.0s (from 4.5s)
- Score 92–98 mobile

## Files to touch
- `index.html` — add static hero skeleton + critical CSS `<style>`
- `src/main.tsx` — no change needed; React replaces root content
- `src/components/Analytics.tsx` — defer GTM via `requestIdleCallback`
- `src/components/editor/RichTextEditor.tsx` — dynamic-import TipTap modules
- `vite.config.ts` — remove `editor-vendor` manual chunk
- `src/pages/Index.tsx` + `src/pages/Courses.tsx` — Unsplash URL helper + responsive `srcSet` + width/height
- `src/components/layout/Navbar.tsx` + `Footer.tsx` — width/height on logo `<img>`

## Out of scope
- Switching hosts / enabling SSR framework
- Replacing Unsplash with self-hosted assets
