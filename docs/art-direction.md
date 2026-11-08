# Art direction: Sunny Desk

## Thesis

You've walked into Marco's room on a bright morning. Sunlight comes through the window and
falls across the desk, the PC hums quietly, and the screen says hi. Friendly, welcoming and
blue, with technical precision underneath. Flip the light switch on the wall and it's evening:
the room goes navy and the desk lamp clicks on.

The one memorable thing is the **machine itself**: hover it and every part lights up with an
outline and a name, click one and its signal travels to the monitor.

## History

The first pass ("Evening Workbench") was a dark, amber, after-hours desk. Marco asked for a more
welcoming, friendly blue look with sunlight, so the default became day, and the evening mood
survives as the night theme behind the light switch.

## Interface: the labelled workbench

Home-lab people label everything with a label maker. That tape is the interface's one loud
device: every _name_ (part tags over the PC, the dock, the hover card, the window's title bar,
drive tabs, the project kind) is a strip of label tape. Yellow tape means "this one" (active,
hovered, pointed at); paper tape is the resting state. Tape keeps its colours in both themes,
like the physical thing, and hand-stuck tags get a small stable tilt (`src/lib/tape.ts`).

Everything around the tape stays quiet: paper panels, navy ink, ruled lists instead of rows of
identical rounded cards, no frosted glass, no monospace labels, no all-caps eyebrows. The theme
toggle is a tiny wall plate with a rocker, the DOM twin of the switch on the wall.

## Palette

Semantic tokens with day and night values (see `src/app/globals.css`).

| Token        | Day       | Night     | Role                                         |
| ------------ | --------- | --------- | -------------------------------------------- |
| `base`       | `#e4edf9` | `#0d1628` | Page background (powder sky / navy room)     |
| `panel`      | `#fbfcfe` | `#15203a` | Paper: windows, dock, cards                  |
| `line`       | `#c9d6ea` | `#2b3c5f` | Rules and borders                            |
| `fg`         | `#13234a` | `#e6edfb` | Ink (the navy of the desk mat)               |
| `muted`      | `#4d5d7c` | `#9fb0cd` | Secondary text (≥ 4.5:1)                     |
| `accent`     | `#1f4fbf` | `#8db8ff` | Links and focus rings                        |
| `powder`     | `#a9c0ea` | `#5d77a8` | The case's powder blue: list rules, timeline |
| `tape`       | `#ffd55c` | `#f2c74e` | Yellow label tape: the active or named thing |
| `tape-paper` | `#fdfdfb` | `#dfe5f0` | Resting label tape                           |

In the scene: pale blue walls, light oak desk, navy felt mat, white peripherals, powder-blue
case (`#a9c0ea`), blue LEDs (`#5aa9ff`), cyan data LEDs, and one warm light, the lamp at night.

## Type

One variable family, **Archivo**, with its width axis doing the work:

- Headings: expanded (125%) and heavy, like the lettering on a hardware box.
- Labels and tape: semi-expanded (112.5%) bold.
- Body: normal width, 16–17 px, line length under about 65 characters.
- Small metadata: semi-condensed (87.5%) medium.

Avoid all-caps eyebrows, `→` suffixes, middle-dot meta strings and one-word colour accents.

## The machine

Modelled on Marco's own PC, shown larger than life so parts read clearly: an octagonal
powder-blue showcase case with panoramic glass across the front corners and right side, a
perforated left panel, a chamfered top cap with a honeycomb grille and the front I/O, a tall
vented plinth (the PSU lives inside it), a vertically mounted GPU angled towards the glass so
its fans show, a ring-pump AIO wired to a three-fan side radiator, horizontal RAM, and the
cabling you'd expect. Branding is left off. A mini server (a small home-lab PC) sits on the desk between the monitor and the tower, linked
to the PC by a blue network cable: it is the home of the distributed-systems section.

## Light

- **Day:** sun through the window is the shadow-casting key; the window frame's shadow lands on
  the desk. Soft sun shafts with a little drifting dust. Bright sky-blue hemisphere fill.
- **Night:** moonlight through the window, navy fill, the warm desk lamp on, a blue bias light
  behind the monitor and the keyboard backlight.
- Everything blends over about 1.2 s when the theme changes (instantly under reduced motion).

## Highlighting

- Hovering the PC: a soft blue outline on every selectable part, a small tag naming each one,
  and a hint above the dock.
- Hovering or selecting a part: a strong outline, its own LEDs brighten, and a label follows the
  pointer.
- Outlines are a post-processing pass on capable devices; the low tier falls back to LED glow.

## Copy voice

Plain, warm, first person. Sentence case. Say what things are and what happens when you click
them. Hardware puns only in section headings ("The Core", "Active Memory").
