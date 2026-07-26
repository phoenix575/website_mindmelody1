# MindMelody — website

The marketing and documentation site for **MindMelody**, a native iOS app that
reads consumer EEG over Bluetooth, scores state on a valence–arousal model
entirely on-device, and adapts audio in real time.

The site content is derived from [`CLAUDE.md`](./CLAUDE.md), which is the
engineering spec for the iOS app itself. **This repository contains the
website, not the Swift app** — the build/test commands documented on the
`/developers` page describe the app's toolchain (XcodeGen + `xcodebuild`) and
are reproduced here as content.

## Stack

| Piece      | Choice                                               |
| ---------- | ---------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, Server Components) |
| Language   | TypeScript (strict)                                  |
| Styling    | Tailwind CSS v4, CSS custom properties for theming   |
| Fonts      | System font stack — no external font requests        |
| Deployment | Any Node host                                        |

## Getting started

```sh
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```sh
npm run build     # production build
npm start         # serve the production build
npm run lint      # ESLint (next/core-web-vitals + TypeScript rules)
npm run typecheck # tsc --noEmit
```

## Configuration

`NEXT_PUBLIC_SITE_URL` sets the canonical origin used for metadata, the
sitemap and `robots.txt`. It falls back to `https://mindmelody.app`, so the
build never depends on external configuration.

```sh
NEXT_PUBLIC_SITE_URL=https://example.com npm run build
```

## Structure

```
src/
  app/
    layout.tsx            root layout, metadata, theme bootstrap, skip link
    page.tsx              home
    how-it-works/         the four-stage signal pipeline
    features/             playback modes, session UI, deliberate non-features
    privacy/              the invariant and the three CI tests enforcing it
    developers/           build & test, module layout, integration setup
    roadmap/              shipped stages and known caveats
    not-found.tsx         404
    robots.ts, sitemap.ts, opengraph-image.tsx, icon.svg
  components/             header, footer, UI primitives, interactive pieces
  lib/
    site.ts               site metadata and navigation
    content.ts            all page content as typed data
```

Content lives in `src/lib/content.ts` rather than inside components, so a
factual change (a new stage, a renamed module) lands in exactly one place.

## Accessibility & performance notes

- Skip link, semantic landmarks, and `aria-current` on the active nav item.
- The playback-mode switcher is a real ARIA tablist with arrow/Home/End keys.
- The FAQ uses native `<details>`, so it works before hydration.
- The valence–arousal explorer is driven by labelled range inputs; pointer
  dragging is an enhancement on top, never the only way in.
- Every animation is disabled under `prefers-reduced-motion: reduce`.
- Light and dark themes are real token sets, chosen before first paint by a
  tiny inline script so the page never flashes.
- No web fonts, no external scripts, no analytics, no client-side data
  fetching — every page is statically prerendered.

## Disclaimer

MindMelody is not a medical device and does not diagnose, treat or monitor any
condition. The valence–arousal signal has never been validated against
ground-truth EEG recordings; see the roadmap page for the full caveat list.
