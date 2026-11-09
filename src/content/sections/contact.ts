import type { ContactSection } from "../types";

/**
 * I/O: contact details from Marco's résumé (Marco_Resume_2026-1.pdf), confirmed by him for the
 * site on 2026-11-09. His phone number is on the résumé but must never appear here, which is
 * also why the résumé PDF itself isn't posted.
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
  resume: "Email me and I'll send the latest copy.",
  placeholder: false,
};
