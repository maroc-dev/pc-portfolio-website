import { useId } from "react";
import type { LayerDiagram } from "@/content/types";

/**
 * A system drawn as a stack of layers, top to bottom, with one column per project and a bar
 * down the layers it covers, so overlapping projects stay readable. Layers no project covers
 * stay quiet. Plain grid boxes, so it reflows with the window instead of scaling.
 */
export function LayerStack({ diagram }: { diagram: LayerDiagram }) {
  const titleId = useId();
  const { layers, spans } = diagram;
  const covered = (row: number) => spans.some((s) => row >= s.from && row <= s.to);
  const range = (from: number, to: number) =>
    from === to ? layers[from - 1]!.name : `${layers[from - 1]!.name} to ${layers[to - 1]!.name}`;

  return (
    <figure aria-labelledby={titleId} className="mt-9">
      <p id={titleId} className="type-label">
        {diagram.title}
      </p>
      {/* Drawn for sight; the list below says the same in words. */}
      <div
        aria-hidden="true"
        className="mt-4 grid gap-x-2 @xl:gap-x-4"
        style={{
          gridTemplateColumns: `minmax(0,1fr) repeat(${spans.length}, auto)`,
          gridTemplateRows: `auto repeat(${layers.length}, auto)`,
        }}
      >
        {spans.map((span, i) => (
          <span
            key={span.label}
            style={{ gridColumn: i + 2, gridRow: 1 }}
            className="mb-2.5 justify-self-center"
          >
            <span className={`tape text-xs ${span.active ? "" : "tape-paper"}`}>{span.label}</span>
          </span>
        ))}
        {layers.map((layer, i) => (
          <div
            key={layer.name}
            style={{ gridColumn: 1, gridRow: i + 2 }}
            className={`border-line border border-t-0 px-3.5 py-2.5 first-of-type:rounded-t-[4px] first-of-type:border-t last-of-type:rounded-b-[4px] ${
              covered(i + 1) ? "bg-base" : "bg-panel"
            }`}
          >
            <span className={`block font-semibold ${covered(i + 1) ? "" : "text-muted"}`}>
              {layer.name}
            </span>
            <span className="text-muted block text-sm leading-snug">{layer.detail}</span>
          </div>
        ))}
        {spans.map((span, i) => (
          <span
            key={span.label}
            style={{ gridColumn: i + 2, gridRow: `${span.from + 1} / ${span.to + 2}` }}
            className={`my-1.5 w-2 justify-self-center rounded-full ${
              span.active ? "bg-tape ring-tape-ink/70 ring-1" : "bg-powder"
            }`}
          />
        ))}
      </div>

      <ul className="mt-5 grid gap-x-8 gap-y-3 @xl:grid-cols-2">
        {spans.map((span) => (
          <li key={span.label} className="text-sm leading-snug">
            <span className={`tape text-xs ${span.active ? "" : "tape-paper"}`}>{span.label}</span>
            <span className="sr-only"> covers {range(span.from, span.to)}.</span>
            <span className="text-muted mt-1.5 block">{span.note}</span>
          </li>
        ))}
      </ul>
      <figcaption className="text-muted mt-4 max-w-[60ch] text-sm leading-relaxed">
        {diagram.caption}
      </figcaption>
    </figure>
  );
}
