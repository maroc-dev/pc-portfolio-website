"use client";

import { useEffect, useState } from "react";
import type { ContactSection as Contact } from "@/content/types";

type CopyState = "idle" | "copied" | "failed";

/** Copies the email address, and says so where screen readers will hear it. */
function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const reset = window.setTimeout(() => setState("idle"), 2500);
    return () => window.clearTimeout(reset);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="border-line hover:border-powder rounded-md border px-3 py-1.5 text-sm transition-colors"
      >
        {state === "copied" ? "Copied" : "Copy address"}
      </button>
      <span aria-live="polite" className="text-muted text-sm">
        {state === "copied" && "Copied to your clipboard."}
        {state === "failed" && "Couldn't copy. Select the address above instead."}
      </span>
    </>
  );
}

/** I/O: email first, then the other places to find Marco. */
export function ContactSection({ section }: { section: Contact }) {
  return (
    <>
      <div className="max-w-[60ch] space-y-3 text-[1.1875rem] leading-relaxed">
        {section.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section
        aria-labelledby="contact-email"
        className="bg-base mt-9 rounded-md px-5 py-6 md:px-7"
      >
        <h3 id="contact-email" className="tape text-xs">
          Email
        </h3>
        <p className="mt-4">
          <a
            href={`mailto:${section.email}`}
            className="type-display decoration-powder text-[1.375rem] break-all underline decoration-2 underline-offset-[6px] @xl:text-[1.875rem]"
          >
            {section.email}
          </a>
        </p>
        <p className="text-muted mt-2">The fastest way to reach me.</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <a
            href={`mailto:${section.email}`}
            className="bg-accent text-panel rounded-md px-3.5 py-1.5 text-sm font-semibold"
          >
            Write an email
          </a>
          <CopyEmail email={section.email} />
        </div>
      </section>

      <ul className="divide-line border-line mt-8 divide-y border-y">
        {section.links.map((link) => (
          <li
            key={link.label}
            className="grid gap-1 py-4 @xl:grid-cols-[9rem_1fr] @xl:items-baseline @xl:gap-6"
          >
            <span className="type-label">{link.label}</span>
            <span>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-semibold underline decoration-2 underline-offset-4"
              >
                {link.detail}
              </a>
              <span className="text-muted mt-1 block text-sm">{link.note}</span>
            </span>
          </li>
        ))}
        <li className="grid gap-1 py-4 @xl:grid-cols-[9rem_1fr] @xl:items-baseline @xl:gap-6">
          <span className="type-label">Résumé</span>
          <span>
            <a
              href={section.resume.href}
              download={section.resume.href.split("/").pop()}
              className="text-accent font-semibold underline decoration-2 underline-offset-4"
            >
              {section.resume.detail}
            </a>
            <span className="text-muted mt-1 block text-sm">{section.resume.note}</span>
          </span>
        </li>
      </ul>
    </>
  );
}
