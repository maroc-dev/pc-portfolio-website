import type { AboutSection as About } from "@/content/types";

export function AboutSection({ section }: { section: About }) {
  return (
    <>
      <div className="text-fg/90 max-w-[62ch] space-y-4 leading-relaxed">
        {section.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h3 className="mt-8 text-lg font-bold">Timeline</h3>
      <ol className="border-line mt-3 space-y-4 border-l pl-5">
        {section.timeline.map((milestone) => (
          <li key={milestone.title}>
            <p className="text-accent type-mono text-xs">{milestone.when}</p>
            <p className="font-semibold">{milestone.title}</p>
            {milestone.detail && <p className="text-muted text-sm">{milestone.detail}</p>}
          </li>
        ))}
      </ol>
    </>
  );
}
