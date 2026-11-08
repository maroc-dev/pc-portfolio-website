import type { AiSection as Ai } from "@/content/types";
import { PhotoFrame } from "../PhotoFrame";
import { SubHeading } from "../SubHeading";
import { ProjectEntry } from "./ProjectEntry";

/** GPU: the AI systems Marco builds at work, then the models he runs at home. */
export function AiSection({ section }: { section: Ai }) {
  const { professional, personal } = section;
  return (
    <>
      <section id="ai-professional" aria-labelledby="ai-professional-title" className="scroll-mt-4">
        <SubHeading id="ai-professional-title">Professional</SubHeading>
        <div className="mt-3 max-w-[60ch] space-y-3 text-[1.0625rem] leading-relaxed">
          {professional.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="border-line mt-6 border-t">
          {professional.projects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section id="ai-personal" aria-labelledby="ai-personal-title" className="mt-14 scroll-mt-4">
        <SubHeading id="ai-personal-title">Personal</SubHeading>
        <div className="mt-3 max-w-[60ch] space-y-3 text-[1.0625rem] leading-relaxed">
          {personal.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="mt-8 grid gap-x-10 gap-y-10 @xl:grid-cols-2">
          {personal.rigs.map((rig) => (
            <li key={rig.name}>
              <PhotoFrame photo={rig.photo} sizes="(min-width: 768px) 360px, 80vw" />
              <h4 className="type-label mt-5 text-lg">{rig.name}</h4>
              <p className="text-muted mt-1 leading-relaxed">{rig.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
