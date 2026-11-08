import type { MemorySection as Memory, SkillTier } from "@/content/types";
import { SubHeading } from "./SubHeading";

const TIER_LABEL: Record<SkillTier, string> = {
  professional: "Used at work",
  projects: "Used in projects",
  familiar: "Familiar",
  learning: "Learning",
};

/** RAM: what's loaded right now, then the skills already on board. */
export function MemorySection({ section }: { section: Memory }) {
  return (
    <>
      <SubHeading>Currently loaded</SubHeading>
      <ul className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {section.current.map((item) => (
          <li key={item.title} className="border-powder border-l-[3px] pl-4">
            <p className="font-semibold">{item.title}</p>
            <p className="text-muted mt-1 text-sm leading-relaxed">{item.detail}</p>
          </li>
        ))}
      </ul>

      <SubHeading className="mt-11">Skills</SubHeading>
      <div className="divide-line border-line mt-4 divide-y border-y">
        {section.skillGroups.map((group) => (
          <section
            key={group.title}
            aria-label={group.title}
            className="grid gap-2 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-6"
          >
            <h4 className="type-meta text-muted pt-0.5 text-sm">{group.title}</h4>
            <ul className="flex flex-wrap gap-x-1.5 gap-y-2">
              {group.skills.map((skill) => (
                <li key={skill.name} className="bg-base rounded-[3px] px-2 py-0.5 text-[0.9375rem]">
                  {skill.name}
                  {skill.tier && (
                    <span className="type-meta text-muted ml-2 text-xs">
                      {TIER_LABEL[skill.tier]}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
