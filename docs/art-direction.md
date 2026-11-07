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

## Palette

Semantic tokens with day and night values (see `src/app/globals.css`).

| Token    | Day       | Night     | Role                                  |
| -------- | --------- | --------- | ------------------------------------- |
| `base`   | `#eaf2fc` | `#0e1626` | Page background                       |
| `panel`  | `#ffffff` | `#16213a` | Windows, sheets, dock                 |
| `line`   | `#d3e0f1` | `#2a3b5e` | Borders                               |
| `fg`     | `#1b2a44` | `#e7eefc` | Primary text                          |
| `muted`  | `#52627d` | `#9aabc8` | Secondary text (≥ 4.5:1)              |
| `accent` | `#2563c9` | `#7fb2ff` | Links, focus rings, selected states   |
| `warm`   | `#9a5a0c` | `#ffb36b` | Lamp-coloured accents, used sparingly |
| `signal` | `#0b6f7d` | `#5fd0e0` | Data activity                         |

In the scene: pale blue walls, light oak desk, navy felt mat, white peripherals, powder-blue
case (`#a9c0ea`), blue LEDs (`#5aa9ff`), cyan data LEDs, and one warm light, the lamp at night.

## Type

One variable family, **Recursive**: casual axis for headings, linear for body, mono only for
hardware labels and terminal-ish text. Avoid all-caps eyebrows, `→` suffixes and one-word colour
accents.

## The machine

Modelled on Marco's own PC, shown larger than life so parts read clearly: an octagonal
powder-blue showcase case with panoramic glass across the front corners and right side, a
perforated left panel, a chamfered top cap with a honeycomb grille and the front I/O, a tall
vented plinth (the PSU lives inside it), a vertically mounted GPU angled towards the glass so
its fans show, a ring-pump AIO wired to a three-fan side radiator, horizontal RAM, and the
cabling you'd expect. Branding is left off. A network card is added (not in the real build) so
the distributed-systems section has a home.

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
