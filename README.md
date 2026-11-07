# pc-portfolio-website

An interactive 3D portfolio. Visitors walk up to my desk in the evening and explore my PC: each
part opens a section on the monitor.

| Part         | Opens                                  |
| ------------ | -------------------------------------- |
| CPU          | About me                               |
| GPU          | AI, ML and graphics projects           |
| RAM          | What I'm working on now, and my skills |
| SSD          | Project archive                        |
| Network card | Distributed systems                    |
| Front I/O    | Contact and résumé                     |

The tower is modelled on my own case (branding removed, network card added).

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · three.js with React Three Fiber and drei ·
GSAP · zustand · Vitest · Playwright.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # typecheck, lint, format check, unit tests
npm run test:e2e     # production build + Playwright (first run: npx playwright install chromium)
```

## Editing content

All copy lives in typed data under [`src/content/`](src/content/), separate from the scene and
the UI:

- [`parts.ts`](src/content/parts.ts): which part opens which section.
- [`sections/`](src/content/sections/): the text of each section.
- [`projects.ts`](src/content/projects.ts): case studies.
- [`profile.ts`](src/content/profile.ts): name and greeting.

Anything not yet confirmed is marked `placeholder: true` and shows a "Draft" note on the site.

## How it's organised

```
src/content/  typed portfolio data (no React)
src/state/    zustand store + URL sync, the only bridge between scene and UI
src/scene/    React Three Fiber scene (desk, monitor, tower, camera rig)
src/ui/       DOM interface (header, dock, monitor window, sections)
src/lib/      motion tokens, device and media helpers
docs/         art direction and interaction spec
tests/e2e/    Playwright tests driven through the DOM controls
```

Every 3D interaction has a DOM equivalent (dock buttons, header links, `?part=` deep links), the
site respects `prefers-reduced-motion`, and it falls back to a poster when WebGL is unavailable.
