import { getProjects } from "@/content/projects";
import type { Section } from "@/content/types";
import { AboutSection } from "./about/AboutSection";
import { ArchiveSection } from "./ArchiveSection";
import { ContactSection } from "./ContactSection";
import { DraftNote } from "./DraftNote";
import { MemorySection } from "./MemorySection";
import { ProjectList } from "./ProjectList";

/** Renders any section from the content registry. */
export function SectionView({ section }: { section: Section }) {
  return (
    <>
      {section.placeholder && <DraftNote />}
      {section.kind === "about" && <AboutSection section={section} />}
      {section.kind === "projects" && (
        <>
          <p className="mb-6 max-w-[62ch] text-[1.0625rem] leading-relaxed">{section.intro}</p>
          <ProjectList projects={getProjects(section.projectSlugs)} />
        </>
      )}
      {section.kind === "memory" && <MemorySection section={section} />}
      {section.kind === "archive" && <ArchiveSection section={section} />}
      {section.kind === "contact" && <ContactSection section={section} />}
    </>
  );
}
