# Art direction — Evening Workbench

## Thesis

You've walked up to Marco's desk in the evening. The lamp is on, the machine is humming, and
the screen says hi. Warm, welcoming and personal first; technical precision underneath.

The one memorable thing is the **machine itself** and the moment a part lights up and its
signal travels to the monitor. Everything around it (type, UI chrome, copy) stays quiet.

## Why this direction

Three warm directions were considered: _Evening Workbench_, _Daylight Studio_ (bright oak and
ceramic, blueprint annotations) and _Retro-Modern_ (CRT monitor, phosphor amber). Evening
Workbench was chosen: it keeps the premium, cinematic feel the brief asks for, makes emissive
details (LEDs, traces, the screen) read beautifully, and the desk-lamp light makes it feel like
a person's space rather than a product render.

## Palette

| Token    | Hex       | Role                                                           |
| -------- | --------- | -------------------------------------------------------------- |
| `night`  | `#1d1b19` | Background. Warm charcoal, never neutral black.                |
| `ink`    | `#262320` | Raised surfaces (windows, sheets).                             |
| `walnut` | `#6b4a33` | Desk and wood.                                                 |
| `amber`  | `#f2a65a` | Lamp, primary glow, focus rings, primary actions.              |
| `cream`  | `#f3e9dc` | Primary text.                                                  |
| `dust`   | `#a89c8e` | Secondary text (≥ 4.5:1 on `night`).                           |
| `teal`   | `#5fb3a8` | Signal accent: data, traces, network activity. Used sparingly. |

## Type

One variable family: **Recursive**, using its axes instead of extra families.

- Headings: `CASL 1` (casual), weight 700–800, tight tracking. Friendly, hand-tuned.
- UI and body: `CASL 0` (linear), weight 400–500, 1.6 line height, ≤ 70ch measure.
- Hardware labels and terminal text only: `MONO 1`. Monospace is used where it is the subject's
  own vernacular (part names, a shell prompt), not as decoration on every small label.

Avoid: all-caps eyebrow labels, `→` suffixes, one-word colour accents in headlines.

## Materials

- **Case:** matte charcoal metal (metalness ~0.6, roughness ~0.45), slightly warm.
- **Side panel:** tinted glass. Physical transmission on capable devices, plain transparency
  on the low tier.
- **PCB:** deep green-black with copper traces drawn into a procedural texture; an emissive
  mask lets traces glow when a part is selected.
- **Desk:** walnut, satin finish.
- **Interior light:** amber LED strip, small teal status LEDs.

## Light

- Key: desk-lamp spotlight, ~2700K, from the upper left, soft falloff.
- Fill: low warm hemisphere + a Lightformer environment for reflections (no HDRI download).
- Interior: emissive strips inside the case.
- Contact shadows on the desk. No postprocessing in the MVP.

## Life

Slow fans, a breathing power LED, an occasional network-LED blink, a blinking cursor on the
monitor, and gentle pointer parallax. All of it stops under reduced motion.

## Copy voice

Plain, warm, first person. Sentence case. Say what things are and what happens when you click
them. Hardware puns are allowed in section headings only ("The Core", "Active Memory").
