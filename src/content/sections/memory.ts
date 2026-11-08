import { photoSlot } from "../photos";
import type { MemorySection } from "../types";

/**
 * RAM: what's loaded right now, from Marco's own notes (November 2026), then his skills.
 *
 * Skills come from his résumé, the work in the AI section and his public repos. A skill is marked
 * `professional` only where the résumé or the AI section shows it used at work, and `learning`
 * only where Marco says he's learning it. Everything else carries no claim about depth.
 */
export const memory: MemorySection = {
  kind: "memory",
  intro:
    "The now in my life: what I'm building, studying and learning this semester, and the skills I bring to it.",
  now: [
    {
      id: "cluster",
      status: "Building",
      title: "A private cloud out of old computers",
      story: [
        "I'm taking the old computers I have lying around and joining them into a private compute cluster with Kubernetes.",
        "The plan is to give my friends free compute: Minecraft and other game servers, a home for old projects, private storage, hosting, whatever they need.",
        "It's for me too. I want the freedom to run my own programs in my own isolated, AWS-like environment, and the best way I know to learn cloud computing, cloud engineering and distributed systems is to run them myself.",
      ],
      photo: photoSlot("The cluster, in progress"),
    },
    {
      id: "rutgers",
      status: "Studying",
      title: "My last semester at Rutgers",
      story: [
        "I'm finishing my B.S. in Computer Science and graduating in January 2027. This semester it's Distributed Systems and Imaging and Multimedia.",
      ],
      more: { label: "Read about my time at Rutgers", part: "cpu", anchor: "about-education" },
    },
    {
      id: "databases",
      status: "Learning",
      title: "Opening the black box of databases",
      story: [
        "I've always wanted to understand databases. For years I treated them as a magic black box: data goes in, answers come out.",
        "Now I'm working through Carnegie Mellon's Intro to Database Systems lectures (15-445/645) and building my own as I go. Seeing how the pieces fit has given me real appreciation for the decades of engineering behind services like S3, Postgres and MongoDB.",
      ],
      links: [
        {
          label: "Watch the CMU lectures",
          href: "https://www.youtube.com/playlist?list=PLSE8ODhjZXjYMAgsGH-GtY5rJYZ6zjsd5",
        },
      ],
      projects: [
        {
          name: "GooseDB",
          status: "Building now",
          detail: [
            "A database for storing and querying media, written in C++23. I'm building it from the bottom up, starting with the storage layer: pages, tuples and schemas.",
            "It's early and changing fast, so GitHub is the best place to see where it stands.",
          ],
          links: [
            { label: "Follow GooseDB on GitHub", href: "https://github.com/maroc-dev/goosedb" },
          ],
        },
        {
          name: "OptiSQL",
          status: "With Richard Baah",
          detail: [
            "An in-memory query execution engine I built with my friend Richard Baah.",
            "I worked on every part of it: the operators that run filters, joins and aggregates, the physical optimizer in Go with a Rust version alongside, query plans passed around in Substrait, and the HTTP server that takes queries in, all tested in CI.",
          ],
          links: [
            { label: "OptiSQL on GitHub", href: "https://github.com/Rich-T-kid/OptiSQL" },
            { label: "Richard on GitHub", href: "https://github.com/Rich-T-kid" },
          ],
        },
      ],
      diagram: {
        title: "Where the two projects sit in a database",
        layers: [
          { name: "Query interface", detail: "Takes SQL in over HTTP" },
          { name: "Planning", detail: "Parses the query and picks a plan" },
          { name: "Execution", detail: "Runs scans, filters, joins and aggregates" },
          { name: "Buffer pool", detail: "Keeps the pages in use in memory" },
          { name: "Storage", detail: "Lays out pages and tuples on disk" },
        ],
        spans: [
          { label: "OptiSQL", note: "The query side, which I built with Richard.", from: 1, to: 3 },
          {
            label: "GooseDB",
            note: "The storage side, building now.",
            from: 5,
            to: 5,
            active: true,
          },
        ],
        caption:
          "Together they cover both ends of the course: OptiSQL is where a query comes in and runs, and GooseDB starts at the bottom, with how data sits on disk. Simplified to five layers.",
      },
    },
  ],
  skillGroups: [
    {
      title: "Languages",
      skills: [
        { name: "Python", tier: "professional" },
        { name: "JavaScript", tier: "professional" },
        { name: "SQL", tier: "professional" },
        { name: "HTML and CSS", tier: "professional" },
        { name: "PHP", tier: "professional" },
        { name: "TypeScript" },
        { name: "Go" },
        { name: "C++" },
        { name: "C" },
        { name: "Java" },
        { name: "C#" },
        { name: "Dart" },
        { name: "OCaml" },
      ],
    },
    {
      title: "AI and machine learning",
      skills: [
        { name: "LLMs", tier: "professional" },
        { name: "Agentic workflows", tier: "professional" },
        { name: "A2A", tier: "professional" },
        { name: "MCP", tier: "professional" },
        { name: "RAG", tier: "professional" },
        { name: "PyTorch", tier: "professional" },
        { name: "Hugging Face Transformers", tier: "professional" },
        { name: "LlamaIndex", tier: "professional" },
        { name: "ImageBind", tier: "professional" },
        { name: "Speech-to-text", tier: "professional" },
        { name: "Text-to-speech" },
        { name: "Local LLMs" },
        { name: "Pipecat" },
      ],
    },
    {
      title: "Web and app frameworks",
      skills: [
        { name: "React", tier: "professional" },
        { name: "React Native", tier: "professional" },
        { name: "Node.js", tier: "professional" },
        { name: "FastAPI", tier: "professional" },
        { name: "Streamlit", tier: "professional" },
        { name: "Flask" },
        { name: "Flutter" },
        { name: "Mesop" },
        { name: "Next.js" },
        { name: "Three.js" },
        { name: "Unity" },
      ],
    },
    {
      title: "Data",
      skills: [
        { name: "PostgreSQL", tier: "professional" },
        { name: "MySQL", tier: "professional" },
        { name: "Weaviate", tier: "professional" },
        { name: "Amazon S3" },
        { name: "Database internals", tier: "learning" },
      ],
    },
    {
      title: "Distributed systems",
      skills: [
        { name: "WebSockets" },
        { name: "Operational transformation" },
        { name: "MapReduce" },
        { name: "Kubernetes", tier: "learning" },
      ],
    },
    {
      title: "Cloud and tools",
      skills: [
        { name: "OAuth", tier: "professional" },
        { name: "AWS" },
        { name: "Google Cloud Platform" },
        { name: "Docker" },
        { name: "Nginx" },
        { name: "Ngrok" },
        { name: "Git" },
        { name: "Unix and Linux" },
      ],
    },
  ],
  placeholder: false,
};
