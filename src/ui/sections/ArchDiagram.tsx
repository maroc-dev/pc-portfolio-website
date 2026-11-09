"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { ArchKind, Architecture } from "@/content/types";

/** Each kind of component has its own shape, so the diagram reads without a legend. */
const KIND_STYLE: Record<ArchKind, string> = {
  person: "bg-panel border-powder rounded-[1.25rem] text-center",
  service: "bg-base border-line rounded-md",
  store: "bg-base border-line border-t-powder rounded-md border-t-4",
  external: "bg-panel border-line rounded-md border-dashed",
};

interface Box {
  cx: number;
  cy: number;
  hw: number;
  hh: number;
}

interface Segment {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  both: boolean;
  label?: string;
  /** Where the label goes: beside the line, never on it. */
  labelStyle: CSSProperties;
}

/** Space left between an arrow's end and the box it points at. */
const GAP = 5;

/**
 * Places a label just off the line's midpoint: above a horizontal or sloping line, to the right
 * of a vertical one, so it never hides the arrow.
 */
function besideLine(x1: number, y1: number, x2: number, y2: number): CSSProperties {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  if (Math.abs(x2 - x1) < Math.abs(y2 - y1) * 0.5) {
    return { left: mx + 7, top: my, transform: "translateY(-50%)" };
  }
  return { left: mx, top: my - 3, transform: "translate(-50%, -100%)" };
}

/** Where the line from `a`'s centre towards `b`'s centre leaves box `a`. */
function exit(a: Box, b: Box): [number, number] {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const length = Math.hypot(dx, dy) || 1;
  const t = Math.min(dx ? a.hw / Math.abs(dx) : Infinity, dy ? a.hh / Math.abs(dy) : Infinity);
  return [a.cx + dx * t + (dx / length) * GAP, a.cy + dy * t + (dy / length) * GAP];
}

/**
 * A simplified box-and-arrow architecture diagram. Boxes sit on a CSS grid; arrows are drawn
 * between the boxes as laid out (re-measured whenever the diagram changes size, including when
 * its drop-down opens or the window zooms), so they always meet the right edges.
 */
export function ArchDiagram({
  architecture,
  name,
  caption,
}: {
  architecture: Architecture;
  name: string;
  /** Says what was simplified, and why. */
  caption: string;
}) {
  const { cols, rows, nodes, edges, groups = [] } = architecture;
  const canvas = useRef<HTMLDivElement>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const arrowhead = useId();

  useLayoutEffect(() => {
    const el = canvas.current;
    if (!el) return;
    // Fires once on observe, then on every size change (opening, resizing, zooming).
    const observer = new ResizeObserver(() => {
      const origin = el.getBoundingClientRect();
      // The window may be scaled (full view); work in the diagram's own pixels.
      const scale = origin.width / (el.offsetWidth || 1) || 1;
      const boxes = new Map<string, Box>();
      for (const node of el.querySelectorAll<HTMLElement>("[data-node]")) {
        const r = node.getBoundingClientRect();
        boxes.set(node.dataset.node!, {
          cx: (r.left + r.width / 2 - origin.left) / scale,
          cy: (r.top + r.height / 2 - origin.top) / scale,
          hw: r.width / 2 / scale,
          hh: r.height / 2 / scale,
        });
      }
      const next: Segment[] = [];
      for (const edge of edges) {
        const a = boxes.get(edge.from);
        const b = boxes.get(edge.to);
        if (!a || !b) continue;
        const [x1, y1] = exit(a, b);
        const [x2, y2] = exit(b, a);
        next.push({
          key: `${edge.from}-${edge.to}`,
          x1,
          y1,
          x2,
          y2,
          both: Boolean(edge.both),
          label: edge.label,
          labelStyle: besideLine(x1, y1, x2, y2),
        });
      }
      setSegments(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [edges]);

  const labelOf = new Map(nodes.map((n) => [n.id, n.label]));
  const grid: CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, auto)`,
  };

  return (
    <figure aria-label={`${name} architecture`} className="isolate mt-6">
      <div className="border-line bg-panel overflow-x-auto rounded-md border">
        <div
          ref={canvas}
          className="relative grid min-w-[42rem] gap-x-20 gap-y-10 px-6 pt-8 pb-6"
          style={grid}
        >
          {groups.map((group) => (
            <div
              key={group.label}
              aria-hidden="true"
              className="border-powder relative -m-3.5 rounded-lg border border-dashed"
              style={{
                gridColumn: `${group.col} / span ${group.colSpan}`,
                gridRow: `${group.row} / span ${group.rowSpan}`,
              }}
            >
              <span className="type-meta text-muted bg-panel absolute -top-2.5 left-3 px-1.5 text-xs">
                {group.label}
              </span>
            </div>
          ))}

          <svg
            aria-hidden="true"
            className="text-muted pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <marker
                id={arrowhead}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0,1 L9,5 L0,9" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </marker>
            </defs>
            {segments.map((s) => (
              <line
                key={s.key}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke="currentColor"
                strokeWidth="1.4"
                markerEnd={`url(#${arrowhead})`}
                markerStart={s.both ? `url(#${arrowhead})` : undefined}
              />
            ))}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              data-node={node.id}
              className={`relative z-10 self-center border px-3 py-2.5 ${KIND_STYLE[node.kind]}`}
              style={{ gridColumn: node.col, gridRow: `${node.row} / span ${node.rowSpan ?? 1}` }}
            >
              <p className="type-label text-[0.8125rem] leading-tight">{node.label}</p>
              {node.detail && <p className="text-muted mt-1 text-xs leading-snug">{node.detail}</p>}
            </div>
          ))}

          {segments
            .filter((s) => s.label)
            .map((s) => (
              <span
                key={`${s.key}-label`}
                aria-hidden="true"
                className="type-meta text-muted bg-panel absolute z-20 rounded px-1 text-[0.6875rem] leading-tight whitespace-nowrap"
                style={s.labelStyle}
              >
                {s.label}
              </span>
            ))}
        </div>
      </div>

      <ul className="sr-only" aria-label="Connections">
        {edges.map((edge) => (
          <li key={`${edge.from}-${edge.to}`}>
            {labelOf.get(edge.from)} {edge.both ? "and" : "to"} {labelOf.get(edge.to)}
            {edge.label ? `: ${edge.label}` : ""}
          </li>
        ))}
      </ul>
      <figcaption className="text-muted mt-2.5 text-sm leading-relaxed">{caption}</figcaption>
    </figure>
  );
}
