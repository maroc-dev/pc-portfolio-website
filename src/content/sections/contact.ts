import type { ContactSection } from "../types";

/**
 * I/O: contact details from Marco's résumé, confirmed by him for the site on 2026-11-09. His
 * phone number must never appear here. The posted PDF (Marco_Resume_2026-3.pdf, served as
 * Marco_Ferreira_Resume_2026.pdf) is the version he made without it; check any replacement for a phone number before publishing it.
 */
export const contact: ContactSection = {
  kind: "contact",
  intro: [
    "I'm finishing my B.S. in Computer Science at Rutgers and building AI agent infrastructure at AT&T Labs.",
    "Whether it's a role, a project or a question about this machine, I'd love to hear from you.",
  ],
  email: "marco.a.ferreira.dev@gmail.com",
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/marco-ferreira",
      detail: "linkedin.com/in/marco-ferreira",
      note: "My work history, and a good place to message me",
    },
    {
      label: "GitHub",
      href: "https://github.com/maroc-dev",
      detail: "github.com/maroc-dev",
      note: "The code behind most of the projects on this site",
    },
  ],
  resume: {
    href: "/resume/Marco_Ferreira_Resume_2026.pdf",
    detail: "Download my résumé (PDF)",
    note: "One page, with my experience, projects and skills",
  },
  placeholder: false,
};
