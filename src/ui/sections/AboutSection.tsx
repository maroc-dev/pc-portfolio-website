import type { AboutSection as About } from "@/content/types";
import { SubHeading } from "./SubHeading";

export function AboutSection({ section }: { section: About }) {
  return (
    <>
      <div className="max-w-[62ch] space-y-4 text-[1.0625rem] leading-relaxed">
        {section.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <SubHeading className="mt-10">Timeline</SubHeading>
      <ol className="border-powder mt-4 space-y-5 border-l-2 pl-5">
        {section.timeline.map((milestone) => (
          <li key={milestone.title} className="relative">
            <span
              aria-hidden="true"
              className="bg-panel border-powder absolute top-1.5 -left-[27px] h-3 w-3 rounded-full border-2"
            />
            <p className="type-meta text-muted text-sm">{milestone.when}</p>
            <p className="mt-0.5 font-semibold">{milestone.title}</p>
            {milestone.detail && <p className="text-muted mt-0.5 text-sm">{milestone.detail}</p>}
          </li>
        ))}
      </ol>
    </>
  );
}
