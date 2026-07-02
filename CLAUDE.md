# Qian Zhao Portfolio — engineering standards

Static portfolio site (no build step) deployed to GitHub Pages at
`https://irrwood.github.io/qian/`. Owner: Qian Zhao (product designer).
Read this before changing anything; these rules exist to keep 12+ pages
consistent without a framework.

## Architecture

```
index.html          home (grid of project cards)
pages/*.html        one file per subpage (case studies, reviewer, about, resume)
styles/tokens.css   design tokens — THE single source for brand values
styles/*.css        one sheet per template (home / case-study / reviewer / webflow-project / about / resume)
scripts/*.js        one script per concern; all plain ES, no bundler
assets/<project>/   media grouped per project; assets/vendor/ holds gsap etc.
```

Deliberately **no build step, no framework**. Do not introduce React/Vite/
bundlers. If templating ever becomes necessary, the agreed path is Eleventy
(11ty) — nothing heavier.

## Hard rules

1. **Design tokens.** All brand values live in `styles/tokens.css`
   (`--brand-accent: #0059ff`, `--brand-ink`, `--brand-font`, …).
   Template sheets alias them (`--case-accent: var(--brand-accent)`).
   Never hardcode a brand color/font in a template sheet or inline style.
   `resume.css` is intentionally Apple-styled — palette exempt, font aliased.

2. **tokens.css loads first** on every page, before the template sheet:
   `<link rel="stylesheet" href="../styles/tokens.css" />`

3. **Relative paths only.** The site serves from the `/qian/` subpath, so
   `href="/"` breaks. Use `../index.html`, `./resume.html`, etc.

4. **Nav is duplicated by design** (no build step): every page carries the
   same header. When touching nav, update ALL pages. Canonical links:
   Work → `../index.html` · Resume → `./resume.html` · About Me → `./about.html`
   (from `index.html`: `./index.html`, `./pages/…`). Labels exactly:
   `Work`, `Resume`, `About Me`.

5. **Images:** first image on a page loads eagerly; everything below the fold
   gets `loading="lazy" decoding="async"`. Prefer WebP for large art; keep
   posters ≤ 50 KB (jpg, scaled to ≤ 900 px wide).

6. **Video:** always `autoplay muted loop playsinline preload="metadata"` +
   a `poster`. Keep files ≤ ~6 MB — compress with
   `ffmpeg -vf "scale=720:-2" -crf 30 -preset veryfast -an -movflags +faststart`.
   Any page with `<video autoplay>` must include
   `<script defer src="../scripts/media-guard.js"></script>` (pauses videos
   off screen).

7. **Motion standards** (reviewed against Emil Kowalski's bar; skills in
   `.claude/skills/`):
   - Hover motion gated behind `@media (hover: hover) and (pointer: fine)`.
   - `prefers-reduced-motion: reduce` must keep content visible (fade only,
     no movement); GSAP work goes in `gsap.matchMedia()` branches.
   - Ease `ease`/`ease-out`, UI transitions ≤ 300 ms, never `scale(0)`,
     never `transition: all`.
   - Animate `transform`/`opacity` only.

8. **Accessibility:** decorative media `aria-hidden="true"`/empty `alt`;
   meaningful media gets a real `alt`/`aria-label`. Keyboard focus states
   (`:focus-visible`) must exist outside the hover gate.

9. **Git hygiene:** `.gitignore` already excludes `projects/`, `archive/`,
   `previews/`, `output/`, `node_modules/`, `.DS_Store`, `.claude/`,
   `.agents/`, playwright dirs. Never commit those. No file over 100 MB
   (GitHub hard limit); keep media in `assets/<project>/`.
   This sandbox has no push credentials — commit locally and give the owner
   `git push origin main` to run.

## Page templates (copy these, don't invent new ones)

- **Case study** (`pages/case-study-best-wallet.html`): hero video → Overview
  → media grid → My Role → showcase band. Uses `case-study.css` +
  `case-study.js` + `cursor-fx.js` + `hero-rays.js`.
  Page-specific aspect ratios go in a small inline `<style>` (see
  `case-study-lexar-30th.html`) — match containers to source media ratios.
- **Reviewer** (`pages/reviewer.html`): left = scaled iframe of a live URL
  (1280 px source, auto-scaled by `reviewer.js`); if no live URL exists, use
  a scrollable full-page screenshot instead (see `lexar-cp-2026.html`).
- **Webflow import** (`pages/copper.html` etc.): `webflow-project.css` +
  `webflow-project.js`, media under `assets/webflow-projects/<slug>/`.

## Checks before committing

- `node --check scripts/*.js` (syntax)
- Local-reference sweep: every `src`/`href` that isn't http(s) must resolve
  on disk (a Python one-liner sweep was used previously; keep it green).
- No `href="/"` or `/about`-style absolute links.
- New page? Confirm: tokens.css first, nav canonical, lazy images, media-guard
  if it has videos, footer brand → `../index.html`.
