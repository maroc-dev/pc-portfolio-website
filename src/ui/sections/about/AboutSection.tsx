"use client";

import { useEffect, useRef, useState } from "react";
import type { AboutSection as About } from "@/content/types";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { SubHeading } from "../SubHeading";
import { Education } from "./Education";
import { Hobbies } from "./Hobbies";
import { Journey } from "./Journey";
import { PhotoFrame } from "../PhotoFrame";

const PARTS = [
  { id: "about-journey", label: "My journey" },
  { id: "about-education", label: "Education" },
  { id: "about-hobbies", label: "Hobbies" },
] as const;
type PartId = (typeof PARTS)[number]["id"];

/** Where, as a share of the scroll area's height, a stop counts as reached. */
const READING_LINE = 0.45;

/**
 * Tracks reading progress inside the window's scroll area (`data-scroll-root`): marks journey
 * stops as passed or current and reports which part of the page is on screen. Writes the stop attributes
 * straight to the DOM, so scrolling never re-renders the story.
 */
function useReadingProgress(onPart: (id: PartId) => void) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = root.current;
    const scroller = container?.closest<HTMLElement>("[data-scroll-root]");
    if (!container || !scroller) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const view = scroller.getBoundingClientRect();
      const line = view.top + view.height * READING_LINE;
      const stops = [...container.querySelectorAll<HTMLElement>("[data-stop]")];
      const reached = stops.filter((stop) => stop.getBoundingClientRect().top + 18 <= line);
      const current = reached.at(-1);
      for (const stop of stops) {
        const state = stop === current ? "current" : reached.includes(stop) ? "passed" : null;
        if (state) stop.dataset.state = state;
        else delete stop.dataset.state;
      }

      let part: PartId = PARTS[0].id;
      for (const { id } of PARTS) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= view.top + view.height * 0.3) {
          part = id;
        }
      }
      onPart(part);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [onPart]);
  return root;
}

function jumpTo(id: PartId) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

/** CPU: a photo first, a short hello, then the journey, education and life outside code. */
export function AboutSection({ section }: { section: About }) {
  const [part, setPart] = useState<PartId>(PARTS[0].id);
  const root = useReadingProgress(setPart);

  return (
    <div ref={root}>
      <div className="@2xl:grid @2xl:grid-cols-[13rem_minmax(0,1fr)] @2xl:items-start @2xl:gap-10">
        <PhotoFrame
          photo={section.portrait}
          sizes="(min-width: 768px) 260px, 60vw"
          className="mb-9 max-w-52 @2xl:mb-0"
        />
        <div className="max-w-[58ch] space-y-4 text-[1.1875rem] leading-relaxed">
          {section.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <nav
        aria-label="About me"
        className="bg-panel border-line sticky -top-7 z-10 -mx-5 mt-12 border-b px-5 py-3 md:-top-9 md:-mx-10 md:px-10"
      >
        <ul className="flex flex-wrap gap-2">
          {PARTS.map(({ id, label }) => (
            <li key={id}>
              <button
                type="button"
                aria-current={part === id ? "true" : undefined}
                onClick={() => jumpTo(id)}
                className={`tape text-xs transition-[transform,background-color] duration-150 ${
                  part === id ? "" : "tape-paper hover:bg-tape hover:-rotate-1"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section
        id="about-journey"
        aria-labelledby="about-journey-title"
        className="mt-9 scroll-mt-20"
      >
        <SubHeading id="about-journey-title">My journey</SubHeading>
        <Journey stops={section.journey} />
      </section>

      <section
        id="about-education"
        aria-labelledby="about-education-title"
        className="mt-16 scroll-mt-20"
      >
        <SubHeading id="about-education-title">Education</SubHeading>
        <Education schools={section.education} />
      </section>

      <section
        id="about-hobbies"
        aria-labelledby="about-hobbies-title"
        className="mt-16 scroll-mt-20"
      >
        <SubHeading id="about-hobbies-title">Hobbies</SubHeading>
        <p className="text-muted mt-2">What I do when I&apos;m away from the keyboard.</p>
        <Hobbies hobbies={section.hobbies} />
      </section>
    </div>
  );
}
