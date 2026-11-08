import type { ContactSection as Contact } from "@/content/types";

export function ContactSection({ section }: { section: Contact }) {
  return (
    <>
      <p className="max-w-[62ch] text-[1.0625rem] leading-relaxed">{section.intro}</p>
      <ul className="divide-line border-line mt-6 divide-y border-y">
        {section.links.map((link) => (
          <li
            key={link.label}
            className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-6"
          >
            <span className="type-label">{link.label}</span>
            {link.href ? (
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-accent justify-self-start underline decoration-2 underline-offset-4"
              >
                {link.detail}
              </a>
            ) : (
              <span className="text-muted">{link.detail}</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
