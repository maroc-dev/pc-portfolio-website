import Image from "next/image";
import type { ChainNode, HeapStep, ProjectVisual } from "@/content/types";
import { ArchDiagram } from "../ArchDiagram";
import { OtExample } from "../systems/OtExample";

type Level = 3 | 4 | 5 | 6;

function Title({ level, children }: { level: Level; children: string }) {
  const Heading = `h${level}` as const;
  return <Heading className="type-label text-[0.9375rem]">{children}</Heading>;
}

function Caption({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="text-muted mt-2.5 max-w-[66ch] text-sm leading-relaxed">{children}</p>;
}

const PROMPT = /^(mysh> |\$ )/;

/** Terminal output stays dark in both themes, like a real terminal. */
function Terminal({ lines }: { lines: string[] }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-md bg-[#0d1628] px-4 py-3.5 font-mono text-[0.8125rem] leading-relaxed text-[#c9d6ea]">
      {lines.map((line, i) => {
        const prompt = PROMPT.exec(line);
        return (
          <span key={i} className="block min-h-[1lh]">
            {prompt ? (
              <>
                <span className="text-[#ffd55c]">{prompt[0]}</span>
                <span className="font-semibold text-white">{line.slice(prompt[0].length)}</span>
              </>
            ) : (
              line
            )}
          </span>
        );
      })}
    </pre>
  );
}

function Code({ code }: { code: string }) {
  return (
    <pre className="border-line bg-base mt-3 overflow-x-auto rounded-md border px-4 py-3.5 font-mono text-[0.8125rem] leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

/**
 * The heap as a strip of chunks after each call. Each chunk's header holds its size, and that
 * size is the jump to the next header: the arrow under each chunk shows the link.
 */
function Heap({ steps }: { steps: HeapStep[] }) {
  return (
    <ol className="divide-line border-line mt-3 divide-y border-y">
      {steps.map((step) => (
        <li
          key={step.call}
          className="grid gap-x-6 gap-y-3 py-4 @2xl:grid-cols-[13rem_minmax(0,1fr)] @2xl:items-start"
        >
          <div className="text-sm leading-snug">
            <code className="font-mono font-semibold">{step.call}</code>
            <p className="text-muted mt-1">{step.note}</p>
          </div>
          <div className="overflow-x-auto">
            <div className="flex min-w-[26rem]" role="img" aria-label={heapLabel(step)}>
              {step.chunks.map((chunk, i) => (
                <div
                  key={i}
                  className="flex min-w-[4.25rem] flex-col"
                  style={{ flex: `${Math.max(1.2, Math.log2(chunk.size / 8))} 1 0` }}
                >
                  <div
                    className={`flex h-12 overflow-hidden rounded-[3px] border ${
                      chunk.used ? "border-accent/60 bg-powder/45" : "border-line border-dashed"
                    }`}
                  >
                    <span
                      className={`flex w-6 shrink-0 items-center justify-center border-r text-[0.625rem] leading-none font-semibold ${
                        chunk.used ? "border-accent/50 bg-accent text-white" : "border-line bg-base"
                      }`}
                      title="8-byte header"
                    >
                      {chunk.used ? "1" : "0"}
                    </span>
                    <span className="flex min-w-0 flex-col justify-center px-2 leading-tight">
                      <span className="truncate text-sm font-semibold">
                        {chunk.name ?? (chunk.used ? "used" : "free")}
                      </span>
                      <span className="text-muted text-xs">{chunk.size} B</span>
                    </span>
                  </div>
                  {/* The size field links this header to the next one. */}
                  <div className="border-muted/50 relative mt-1 mr-1 ml-3 h-2.5 rounded-bl-[4px] border-b-2 border-l-2">
                    <span className="border-l-muted/50 absolute -right-1 -bottom-[5px] h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent" />
                  </div>
                  <span className="text-muted mt-0.5 ml-3 text-[0.6875rem]">
                    {i < step.chunks.length - 1 ? `+${chunk.size} to next` : "end of heap"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function heapLabel(step: HeapStep): string {
  return step.chunks
    .map((c) => `${c.name ? `${c.name}: ` : ""}${c.used ? "used" : "free"} ${c.size} bytes`)
    .join(", then ");
}

/** Linked structs in a row, each pointing at the next, ending at NULL. */
function Chain({ nodes, end }: { nodes: ChainNode[]; end: string }) {
  return (
    <div className="mt-3 overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center">
        {nodes.map((node, i) => (
          <li key={i} className="flex items-center">
            <div className="border-line bg-base rounded-md border">
              <p className="type-meta border-line text-muted border-b px-3 py-1.5 text-xs">
                {node.title}
              </p>
              <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-1 px-3 py-2 font-mono text-[0.75rem]">
                {node.fields.map((field) => (
                  <div key={field.label} className="contents">
                    <dt className="text-muted">{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
                <dt className="text-muted">next_command</dt>
                <dd className="text-accent font-semibold">→</dd>
              </dl>
            </div>
            {i < nodes.length - 1 && (
              <span aria-hidden="true" className="text-muted px-2 text-lg">
                →
              </span>
            )}
          </li>
        ))}
        <li className="flex items-center">
          <span aria-hidden="true" className="text-muted px-2 text-lg">
            →
          </span>
          <span className="border-line text-muted rounded-[3px] border border-dashed px-2 py-1 font-mono text-xs">
            {end}
          </span>
        </li>
      </ol>
    </div>
  );
}

function Table({
  columns,
  rows,
  mono = [],
}: {
  columns: string[];
  rows: string[][];
  mono?: number[];
}) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-line border-b-2">
            {columns.map((column) => (
              <th key={column} scope="col" className="type-meta text-muted py-2 pr-4 font-normal">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-line border-b align-top">
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={`py-2.5 pr-4 leading-snug whitespace-pre-line ${
                    mono.includes(c) ? "font-mono text-[0.8125rem]" : ""
                  } ${c === 0 && !mono.includes(0) ? "font-semibold" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** An image the way a classifier reads it: one square per pixel, ink or blank. */
function Pixels({ rows }: { rows: string[] }) {
  const width = Math.max(...rows.map((r) => r.length));
  return (
    <div
      aria-hidden="true"
      className="border-line bg-panel mt-3 inline-grid gap-px rounded-md border p-2"
      style={{ gridTemplateColumns: `repeat(${width}, 0.5rem)` }}
    >
      {rows.flatMap((row, r) =>
        [...row.padEnd(width)].map((ch, c) => (
          <span
            key={`${r}-${c}`}
            className={`h-2 w-2 rounded-[1px] ${ch === " " ? "bg-base" : "bg-fg"}`}
          />
        )),
      )}
    </div>
  );
}

/**
 * "See it work": real examples of a project running, its data, or a picture of its insides.
 * `level` is the heading level for each example's title.
 */
export function ProjectVisuals({ visuals, level }: { visuals: ProjectVisual[]; level: Level }) {
  return (
    <div className="space-y-9">
      {visuals.map((visual, i) => {
        switch (visual.kind) {
          case "ot-example":
            return <OtExample key={i} />;
          case "diagram":
            return (
              <div key={i}>
                <Title level={level}>{visual.title}</Title>
                <ArchDiagram
                  architecture={visual.architecture}
                  name={visual.title}
                  label={visual.title}
                  caption={visual.architecture.caption ?? ""}
                />
              </div>
            );
          default:
            return (
              <figure key={i}>
                <figcaption>
                  <Title level={level}>{visual.title}</Title>
                </figcaption>
                {visual.kind === "terminal" && <Terminal lines={visual.lines} />}
                {visual.kind === "code" && <Code code={visual.code} />}
                {visual.kind === "heap" && <Heap steps={visual.steps} />}
                {visual.kind === "chain" && <Chain nodes={visual.nodes} end={visual.end} />}
                {visual.kind === "table" && (
                  <Table columns={visual.columns} rows={visual.rows} mono={visual.mono} />
                )}
                {visual.kind === "pixels" && <Pixels rows={visual.rows} />}
                {visual.kind === "image" && (
                  <Image
                    src={visual.src}
                    alt={visual.alt}
                    width={visual.width}
                    height={visual.height}
                    sizes="(min-width: 1024px) 720px, 90vw"
                    className="border-line mt-3 h-auto w-full max-w-[48rem] rounded-md border"
                  />
                )}
                <Caption>{visual.caption}</Caption>
              </figure>
            );
        }
      })}
    </div>
  );
}
