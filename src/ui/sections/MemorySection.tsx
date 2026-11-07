import type { MemorySection as Memory, SkillTier } from "@/content/types";

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
      <h3 className="text-lg font-bold">Currently loaded</h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {section.current.map((item) => (
          <li key={item.title} className="border-line bg-night/40 rounded-xl border p-4">
            <p className="font-semibold">{item.title}</p>
            <p className="text-dust mt-1 text-sm">{item.detail}</p>
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-bold">Skills</h3>
      <div className="mt-3 space-y-5">
        {section.skillGroups.map((group) => (
          <section key={group.title} aria-label={group.title}>
            <h4 className="text-dust text-sm">{group.title}</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li key={skill.name} className="border-line rounded-full border px-3 py-1 text-sm">
                  {skill.name}
                  {skill.tier && (
                    <span className="text-dust ml-2 text-xs">{TIER_LABEL[skill.tier]}</span>
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
