# Qian Zhao — Portfolio

A static portfolio site (plain HTML/CSS/JS, no build step). Open `index.html`
directly in a browser, or serve the folder with any static host.

> The reviewer page's left-hand preview embeds the **live deployment**
> (<https://w3p-meme.vercel.app>), so it works even when you open the file
> directly via `file://`. The local copy under `previews/w3p-meme/` is kept as
> an offline fallback (that one needs an HTTP server, e.g. `python3 -m http.server`,
> because it's a JS-module bundle).

## Structure

```
.
├── index.html                 # Homepage — the work grid (entry point)
├── pages/                     # Sub-pages
│   ├── case-study-best-wallet.html
│   ├── resume.html            # CV
│   └── reviewer.html          # Reviewer template (preview + project info)
├── styles/                    # One stylesheet per page
│   ├── home.css
│   ├── case-study.css
│   ├── resume.css
│   └── reviewer.css
├── scripts/                   # Page behaviour
│   ├── home-effects.js
│   ├── case-study.js
│   ├── cursor-fx.js
│   ├── hero-rays.js
│   └── reviewer.js            # Scales the reviewer preview iframe
├── assets/                    # Shared media
│   ├── home/                  # Homepage project thumbnails
│   ├── best-wallet/           # Best Wallet case-study media
│   ├── icons/                 # Resume contact icons
│   └── vendor/                # GSAP + ScrollTrigger
├── previews/                  # Static pages embedded by reviewer pages
│   └── w3p-meme/              # Built W3P meme campaign (loaded in the iframe)
├── projects/                  # Editable source projects (Vite apps, run separately)
│   ├── w3p-meme/              # Source for previews/w3p-meme
│   └── f-pepe-assets/         # PNG/GIF asset tool
└── archive/                   # Superseded experiments (not linked from the site)
    ├── index-{apple,libre,signal}.html + matching styles
    └── reviewer-template-vite/  # Original React/Vite version of the reviewer page
```

## The reviewer template

`pages/reviewer.html` is a reusable two-column layout: a scaled live preview of
a front-end page on the left, project information on the right. It started as a
React/Vite app (now archived in `archive/reviewer-template-vite/`) and was
converted to static HTML so any sub-page can reuse it without a build step.

To create a new reviewer page:

1. Copy `pages/reviewer.html`.
2. Point the iframe `src` (inside `.iframe-shell`) at the page you want to
   preview — ideally a **deployed URL** (works on `file://` and always current).
   For an offline-only preview, drop a self-contained static build under
   `previews/<name>/` and point the iframe there (needs an HTTP server).
3. Edit the `.project-heading`, `.project-tags`, `.project-date`, and
   `.project-description` content on the right.

Styling is shared via `styles/reviewer.css`; the preview is scaled to fit by
`scripts/reviewer.js`.

## Source projects

`projects/w3p-meme` and `projects/f-pepe-assets` are standalone Vite apps kept
for future editing. They are **not** part of the static site build. To work on
one:

```bash
cd projects/w3p-meme
npm install
npm run dev      # build with `npm run build`, then copy dist into previews/
```

### Deployment (w3p-meme)

`projects/w3p-meme` is deployed to Vercel (account `qian-5084`) and is live at
<https://w3p-meme.vercel.app>. It's also the page embedded in the reviewer
preview. Config is in `vercel.json` (framework `vite`, output `dist`); `.vercelignore`
excludes the original uncompressed media. Redeploy with:

```bash
cd projects/w3p-meme
npx vercel deploy --prod
```

All hero/roadmap/meme media was compressed (GIF→mp4, 4K hero→1920p) — the page's
media dropped from ~11.5 MB to ~1.6 MB.
