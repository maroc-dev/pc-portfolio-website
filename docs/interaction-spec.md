# Interaction spec

## Scene

Camera at a 3/4 angle from the front-left. Monitor left of centre on a stand; tower on the
right with its glass side facing the camera. Inside: motherboard, CPU and cooler, GPU with two
fans, two RAM sticks, M.2 SSD, front I/O ports. Between the monitor and the tower: a mini
server, wired to the PC with a blue network cable. On the desk: keyboard, lamp,
and a cable from the tower to the monitor.

## Part → content map

| Part     | Section                                       | Heading           |
| -------- | --------------------------------------------- | ----------------- |
| `cpu`    | About me                                      | The Core          |
| `gpu`    | AI: professional projects, local models       | Accelerated Ideas |
| `ram`    | Now: building, studying, learning + skills    | Active Memory     |
| `ssd`    | Project archive                               | Project Archives  |
| `server` | Distributed systems (mini server on the desk) | Connected Systems |
| `io`     | Contact and résumé                            | Connect           |

Motherboard, PSU and cooling are visible but not selectable in the MVP.

## States

`boot → overview ⇄ focused(part)`, with `transitioning` while the camera moves.

- **Default:** part sits in ambient light.
- **Hover (pointer devices):** emissive lift (~150 ms), DOM label with part name and heading,
  pointer cursor. Reverses on leave.
- **Selected:** the selection timeline runs (below); the content window opens on the monitor.

## Selection timeline (~1.9 s, one GSAP timeline)

1. Camera eases to the part's close-up preset (0.8 s, `power3.inOut`); the part glows.
2. A signal pulse runs along the cable to the monitor.
3. Camera eases to the monitor preset (0.9 s, `power3.out`). The tower stays in frame with
   the selected part still lit.
4. The content window opens over the projected screen (0.45 s).

- Switching sections while a window is open skips the close-up: content cross-fades and the
  new part lights up.
- A new selection kills the running timeline and starts from the camera's current pose.
- **Back** (close button, Esc, browser back): window closes (0.25 s), camera returns to the
  overview (0.9 s).
- **Reduced motion:** every step jumps straight to its final state.

## Full view

"Full screen" in the window's title bar (desktop only; phones already get a full-height sheet)
moves the camera in, square to the monitor, until only a sliver of bezel shows (0.7 s). It stays
inside the page: the browser itself does not go full screen. The header and dock fade out.

The window behaves like a real display with a fixed resolution: it is laid out once at the
screen's size in the normal monitor framing and only scaled and moved (a CSS transform) to
follow the screen while the camera moves. Nothing re-flows during the zoom; full view simply
makes the same page bigger.

- Esc steps out one level: full view first, then back to the desk.
- Switching sections keeps full view; going back to the desk leaves it.
- Reduced motion: the camera jumps straight to the framing.

## Opening (about 4.4 s, skippable)

From the very first paint, a still of the opening's first frame (the empty room from the wide
angle; day or night, wide or tall, captured by `scripts/capture-stills.mjs`) fills the scene's
space, and the header already carries the greeting as real text. Before it starts, the canvas
stays hidden for a short beat (at least 1.5 s after the scene
mounts) while every shader is compiled and the desk grain is generated, so nothing stutters
mid-animation. Then the canvas fades in over that identical picture and the scene assembles while the camera glides in from a wider, higher angle: the desk rises into
place, the monitor, lamp, keyboard and mug settle, the light switch slides out of the wall and the mini server drops into place. The
PC builds from the inside out: chassis and plinth, motherboard, CPU, RAM, SSD,
GPU, radiator and wiring, then the glass closes and the cap drops on. The display cable runs
across the desk, the PC powers on (LEDs, fans, interior light) and finally the screen wakes.

A "Setting up the desk" label prints out of a label maker above the dock. Any key, click or
"Skip intro" jumps to the finished scene. Navigation works throughout. Reduced motion and deep
links skip the opening entirely. Schedule: `src/scene/intro/schedule.ts`.

## Desktop (≥ 1024 px)

Header with name and section nav. Scene fills the viewport. A dock of part buttons sits at the
bottom. When focused, the window is aligned to the monitor's projected screen rectangle.

## Mobile (< 768 px or coarse pointer)

Scene as a hero with tighter framing; a grid of labelled part buttons below it. No precise
canvas tapping required. Selecting a part runs the same camera beat and opens a full-screen
sheet styled like the same window. Low quality tier: capped DPR, no shadows, no glass
transmission.

## Fallbacks

- No WebGL: static poster with the same navigation.
- No JavaScript: the server-rendered section index and project pages remain readable.

## Accessibility

- Canvas is `aria-hidden`; every action is reachable from the dock, nav or a deep link
  (`/?part=cpu`).
- The window is a labelled dialog with focus management; Esc leaves full view, then closes it.
- Visible cobalt focus rings. Text contrast ≥ 4.5:1.
