import { useId } from "react";
import type { LayerDiagram } from "@/content/types";

/**
 * A system drawn as a stack of layers, top to bottom, with a bracket beside each run of layers a
 * project covers. Layers no project covers stay quiet. Plain grid boxes, so it reflows with the
 * window instead of scaling.
 */
export function LayerStack({ diagram }: { diagram: LayerDiagram }) {
  const titleId = useId();
  const { layers, spans } = diagram;
  const covered = (row: number) => spans.some((s) => row >= s.from && row <= s.to);

  return (
    <figure aria-labelledby={titleId} className="mt-9">
      <p id={titleId} className="type-label">
        {diagram.title}
      </p>
      <div
        className="mt-4 grid grid-cols-[minmax(0,1.5fr)_minmax(6.5rem,1fr)] gap-x-3 @xl:grid-cols-[minmax(0,1fr)_minmax(8rem,14rem)] @xl:gap-x-5"
        style={{ gridTemplateRows: `repeat(${layers.length}, auto)` }}
      >
        <ol className="contents">
          {layers.map((layer, i) => (
            <li
              key={layer.name}
              style={{ gridColumn: 1, gridRow: i + 1 }}
              className={`border-line -mt-px border px-3.5 py-2.5 first:mt-0 first:rounded-t-[4px] last:rounded-b-[4px] ${
                covered(i + 1) ? "bg-base" : "bg-panel text-muted"
              }`}
            >
              <span className={`block font-semibold ${covered(i + 1) ? "" : "text-muted"}`}>
                {layer.name}
              </span>
              <span className="text-muted block text-sm leading-snug">{layer.detail}</span>
            </li>
          ))}
        </ol>
        <ul className="contents">
          {spans.map((span) => (
            <li
              key={span.label}
              style={{ gridColumn: 2, gridRow: `${span.from} / ${span.to + 1}` }}
              className="flex items-stretch gap-2.5 py-1.5 @xl:gap-3.5"
            >
              <span
                aria-hidden="true"
                className={`w-2.5 shrink-0 rounded-r-[3px] border-y-2 border-r-2 ${
                  span.active ? "border-fg" : "border-muted"
                }`}
              />
              <span className="self-center">
                <span className={`tape text-xs ${span.active ? "" : "tape-paper"}`}>
                  {span.label}
                </span>
                <span className="sr-only">
                  {" "}
                  covers{" "}
                  {span.from === span.to
                    ? layers[span.from - 1]!.name
                    : `${layers[span.from - 1]!.name} to ${layers[span.to - 1]!.name}`}
                  .
                </span>
                <span className="text-muted mt-1.5 block text-sm leading-snug">{span.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="text-muted mt-3.5 max-w-[60ch] text-sm leading-relaxed">
        {diagram.caption}
      </figcaption>
    </figure>
  );
}
