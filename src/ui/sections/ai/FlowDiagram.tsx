import type { FlowStep } from "@/content/types";

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="text-powder my-1 h-4 w-4 shrink-0 rotate-90 self-center @3xl:mx-1 @3xl:my-0 @3xl:rotate-0"
    >
      <path
        d="M2 8h11M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * How a system works, step by step: left to right when there's room, top to bottom when not.
 * An ordered list, so it reads as a sequence without the drawing.
 */
export function FlowDiagram({ steps }: { steps: FlowStep[] }) {
  return (
    <ol aria-label="How it works" className="flex flex-col @3xl:flex-row @3xl:items-stretch">
      {steps.map((step, i) => (
        <li key={step.label} className="flex min-w-0 flex-col @3xl:flex-1 @3xl:flex-row">
          <div className="border-line bg-base rounded-md border px-3 py-2.5 @3xl:flex-1">
            <p className="type-label text-sm leading-tight">{step.label}</p>
            {step.detail && (
              <p className="text-muted mt-1 text-[0.8125rem] leading-snug">{step.detail}</p>
            )}
          </div>
          {i < steps.length - 1 && <Arrow />}
        </li>
      ))}
    </ol>
  );
}
