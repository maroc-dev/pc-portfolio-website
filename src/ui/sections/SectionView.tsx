import type { Section } from "@/content/types";
import { AboutSection } from "./about/AboutSection";
import { AiSection } from "./ai/AiSection";
import { ArchiveSection } from "./ArchiveSection";
import { ContactSection } from "./ContactSection";
import { DraftNote } from "./DraftNote";
import { MemorySection } from "./MemorySection";
import { SystemsSection } from "./systems/SystemsSection";

/** Renders any section from the content registry. */
export function SectionView({ section }: { section: Section }) {
  return (
    <>
      {section.placeholder && <DraftNote />}
      {section.kind === "about" && <AboutSection section={section} />}
      {section.kind === "ai" && <AiSection section={section} />}
      {section.kind === "memory" && <MemorySection section={section} />}
      {section.kind === "archive" && <ArchiveSection section={section} />}
      {section.kind === "contact" && <ContactSection section={section} />}
      {section.kind === "systems" && <SystemsSection section={section} />}
    </>
  );
}
