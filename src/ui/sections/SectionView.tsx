import { getProjects } from "@/content/projects";
import type { Section } from "@/content/types";
import { AboutSection } from "./AboutSection";
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
          <p className="text-cream/90 mb-5 max-w-[62ch]">{section.intro}</p>
          <ProjectList projects={getProjects(section.projectSlugs)} />
        </>
      )}
      {section.kind === "memory" && <MemorySection section={section} />}
      {section.kind === "archive" && <ArchiveSection section={section} />}
      {section.kind === "contact" && <ContactSection section={section} />}
    </>
  );
}
