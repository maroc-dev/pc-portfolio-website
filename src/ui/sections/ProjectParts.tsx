import type { ProjectLink, Stat } from "@/content/types";

/** Under a diagram when its project doesn't say otherwise. */
export const DIAGRAM_CAPTION = "Simplified to the main pieces and how they talk to each other.";

/** A point that opens with a short name, e.g. "Rooms: each document…", gets that name in bold. */
const LEAD = /^([^:.]{2,32}): /;

/** A titled list of points, each marked with a short powder dash. */
export function Points({ title, points }: { title: string; points: string[] }) {
  return (
    <div>
      <h4 className="type-label text-[0.9375rem]">{title}</h4>
      <ul className="mt-3 max-w-[70ch] space-y-2.5">
        {points.map((point) => {
          const lead = LEAD.exec(point);
          return (
            <li key={point} className="relative pl-5 leading-relaxed">
              <span
                aria-hidden="true"
                className="bg-powder absolute top-[0.72em] left-0 h-[3px] w-2.5 rounded-full"
              />
              {lead ? (
                <>
                  <strong className="font-semibold">{lead[1]}:</strong>{" "}
                  {point.slice(lead[0].length)}
                </>
              ) : (
                point
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Measured results: a big number on a yellow edge, with what it measures beside it. */
export function Stats({ stats, className = "" }: { stats: Stat[]; className?: string }) {
  return (
    <ul className={`grid gap-4 @xl:grid-cols-2 ${className}`}>
      {stats.map((stat) => (
        <li key={stat.label} className="border-tape flex items-center gap-4 border-l-4 pl-4">
          <span className="type-display text-[2.5rem] leading-none">{stat.value}</span>
          <span className="text-muted text-sm leading-snug">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** The stack, as plain chips after a "Built with" label. */
export function BuiltWith({ stack, className = "" }: { stack: string[]; className?: string }) {
  return (
    <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-2 ${className}`}>
      <span className="type-meta text-muted text-sm">Built with</span>
      <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
        {stack.map((tech) => (
          <li key={tech} className="bg-base rounded-[3px] px-2 py-0.5 text-[0.9375rem]">
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Outside links (GitHub, itch.io), opening in a new tab. */
export function ExternalLinks({ links }: { links: ProjectLink[] }) {
  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent font-semibold underline decoration-2 underline-offset-4"
        >
          {link.label}
        </a>
      ))}
    </>
  );
}
