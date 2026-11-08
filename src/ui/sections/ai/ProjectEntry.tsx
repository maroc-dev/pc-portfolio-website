import { aiAnchor } from "@/content/parts";
import type { AiProject } from "@/content/types";
import { FlowDiagram } from "./FlowDiagram";
import { NetworkSample } from "./NetworkSample";

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * One professional project as a drop-down: name and summary when closed; what I did, the stack,
 * a flow diagram and any example output when open. Native <details>, so it works without
 * JavaScript and links can open it by id.
 */
export function ProjectEntry({ project }: { project: AiProject }) {
  return (
    <details id={aiAnchor(project.id)} className="group/entry border-line scroll-mt-4 border-b">
      <summary className="flex cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">
          <span className="tape tape-paper group-open/entry:bg-tape text-xs transition-colors">
            {project.org}
          </span>
          <h4 className="type-label mt-2.5 text-xl">{project.name}</h4>
          <span className="text-muted mt-1 block max-w-[60ch] leading-relaxed">
            {project.summary}
          </span>
        </span>
        <span className="border-line text-muted group-hover/entry:text-fg group-hover/entry:border-powder mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-[transform,color,border-color] duration-200 group-open/entry:rotate-45">
          <PlusIcon />
        </span>
      </summary>

      <div className="pb-9">
        <ul className="marker:text-powder max-w-[62ch] list-disc space-y-2 pl-5 leading-relaxed">
          {project.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <ul
          aria-label="Built with"
          className="type-meta text-muted mt-4 flex flex-wrap gap-x-3.5 gap-y-1 text-sm"
        >
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="mt-6">
          <FlowDiagram steps={project.flow} />
        </div>
        {project.sample === "network-diagram" && <NetworkSample />}
      </div>
    </details>
  );
}
