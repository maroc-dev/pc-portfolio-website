import type { AboutSection } from "../types";

export const about: AboutSection = {
  kind: "about",
  intro: [
    "This is where I'll introduce myself: who I am, what I like building, and how I think about software.",
    "The short version is coming soon. For now, have a look around the machine.",
  ],
  timeline: [
    { when: "Soon", title: "Education", detail: "Where I studied and what I focused on." },
    { when: "Soon", title: "Experience", detail: "Where I've worked and what I worked on." },
    { when: "Now", title: "Building this site", detail: "The machine you're exploring." },
  ],
  placeholder: true,
};
