import type { ReactNode } from "react";

/*
 * A made-up worked example of operational transformation, following Draftly's rule: an insert
 * or delete that landed earlier in the document, since the version a writer was looking at,
 * shifts that writer's position by its length.
 */

type Tone = "earlier" | "moved" | "wrong";

interface Mark {
  from: number;
  to: number;
  tone: Tone;
}

const TONE: Record<Tone, string> = {
  earlier: "bg-powder/55 border-powder",
  moved: "bg-tape border-tape-ink/50 text-tape-ink",
  wrong: "border-dashed border-muted text-muted line-through",
};

/** A document as a strip of characters, each with its position underneath. */
function Doc({ text, marks = [] }: { text: string; marks?: Mark[] }) {
  return (
    <>
      <span className="sr-only">“{text}”</span>
      <span aria-hidden="true" className="flex flex-wrap gap-0.5">
        {[...text].map((char, i) => {
          const mark = marks.find((m) => i >= m.from && i < m.to);
          return (
            <span key={i} className="flex w-7 flex-col items-center gap-1">
              <span
                className={`flex h-8 w-7 items-center justify-center rounded-[3px] border text-[1.0625rem] font-semibold ${
                  mark ? TONE[mark.tone] : "bg-panel border-line"
                }`}
              >
                {char === " " ? <span className="text-muted font-normal">␣</span> : char}
              </span>
              <span className="text-muted text-[0.6875rem] leading-none">{i}</span>
            </span>
          );
        })}
      </span>
    </>
  );
}

function Step({ who, what, children }: { who: string; what: string; children: ReactNode }) {
  return (
    <li className="grid gap-x-6 gap-y-2.5 py-4 @2xl:grid-cols-[15rem_minmax(0,1fr)] @2xl:items-center">
      <p className="text-sm leading-snug">
        <span className="font-semibold">{who}</span>
        <span className="text-muted block">{what}</span>
      </p>
      <div>{children}</div>
    </li>
  );
}

export function OtExample() {
  return (
    <figure aria-labelledby="ot-example-title" className="mt-9">
      <p className="flex flex-wrap items-center gap-3">
        <span id="ot-example-title" className="type-label">
          Two writers typing at once
        </span>
        <span className="tape text-xs">Example</span>
      </p>
      <ol className="divide-line border-line mt-3 divide-y border-y">
        <Step who="Both writers" what="Start on version 0">
          <Doc text="cat" />
        </Step>
        <Step who="Writer A" what="Types “the ” at position 0. The server makes it version 1.">
          <Doc text="the cat" marks={[{ from: 0, to: 4, tone: "earlier" }]} />
        </Step>
        <Step
          who="Writer B, still on version 0"
          what="Types “s” at position 3. Writer A's 4 characters landed before it, so the server shifts it to 3 + 4 = 7 and sends version 2 to everyone."
        >
          <Doc
            text="the cats"
            marks={[
              { from: 0, to: 4, tone: "earlier" },
              { from: 7, to: 8, tone: "moved" },
            ]}
          />
        </Step>
        <Step who="Without the shift" what="Writer B's “s” would land at 3, inside the wrong word.">
          <Doc text="thes cat" marks={[{ from: 3, to: 4, tone: "wrong" }]} />
        </Step>
      </ol>
      <figcaption className="text-muted mt-2.5 text-sm leading-relaxed">
        A made-up example of the rule Draftly&apos;s server applies to every edit.
      </figcaption>
    </figure>
  );
}
