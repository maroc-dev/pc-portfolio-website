@AGENTS.md

# PC Portfolio — project conventions

Interactive 3D portfolio for Marco Ferreira: a desk scene with a PC and a monitor.
Each PC part maps to a portfolio section; the monitor is where content opens.
Design source of truth: `docs/art-direction.md` and `docs/interaction-spec.md`.

## Stack

Next.js 16 (App Router, `cacheComponents`) · React 19 · TypeScript strict · Tailwind v4 ·
three + @react-three/fiber + drei · GSAP (only animation system) · zustand · Vitest · Playwright.

## Layer boundaries (enforced by review)

- `src/content/` — pure typed data. No React, no three.
- `src/state/` — zustand store; the only bridge between scene and UI.
- `src/scene/` — R3F only. Never imports from `src/ui/`.
- `src/ui/` — DOM only. Never imports three / R3F.
- `src/lib/` — framework-agnostic helpers (motion tokens, math, device detection).
- Mesh ↔ content mapping lives only in `src/content/parts.ts`.

## Rules

- Never invent facts about Marco (projects, metrics, employers, dates). Unknown content stays a
  clearly marked placeholder (`placeholder: true`) until Marco confirms it.
- Never include confidential employer information.
- Every 3D interaction must have a DOM equivalent (dock, nav, deep link). Canvas is `aria-hidden`.
- Respect `prefers-reduced-motion`: jump to final states rather than shortening animations.
- One animation system: GSAP for timelines, CSS for simple hover/focus. Don't add Motion or a
  second smooth-scroll engine.
- Reuse geometries/materials; dispose what you create imperatively.

## Workflow

- Micro commits, one concern each, Conventional Commits (`feat(scene): …`, `fix(ui): …`).
- `npm run check` (typecheck, lint, format, unit tests) must pass before each commit.
- `npm run test:e2e` covers navigation through DOM controls.
- `npm run typecheck` runs `next typegen` first (needed for `LayoutProps`/`PageProps`).
