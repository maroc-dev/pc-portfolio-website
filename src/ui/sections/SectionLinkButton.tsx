import type { SectionLink } from "@/content/types";
import { experienceStore } from "@/state/experience-store";

/** Opens another part's section, scrolled to the link's anchor when it has one. */
export function SectionLinkButton({
  link,
  className = "",
}: {
  link: SectionLink;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => experienceStore.getState().select(link.part, link.anchor)}
      className={`text-accent text-left font-semibold underline decoration-2 underline-offset-4 ${className}`}
    >
      {link.label}
    </button>
  );
}
