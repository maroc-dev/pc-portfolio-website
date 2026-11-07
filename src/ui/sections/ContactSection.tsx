import type { ContactSection as Contact } from "@/content/types";

export function ContactSection({ section }: { section: Contact }) {
  return (
    <>
      <p className="text-cream/90 max-w-[62ch]">{section.intro}</p>
      <ul className="divide-line border-line mt-5 divide-y rounded-xl border">
        {section.links.map((link) => (
          <li key={link.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
            <span className="font-semibold">{link.label}</span>
            {link.href ? (
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-amber underline-offset-4 hover:underline"
              >
                {link.detail}
              </a>
            ) : (
              <span className="text-dust">{link.detail}</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
