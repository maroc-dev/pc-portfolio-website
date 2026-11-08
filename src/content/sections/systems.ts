import { photoSlot } from "../photos";
import type { SystemsSection } from "../types";

/**
 * Server: software architecture and systems that scale, from Marco's notes (November 2026).
 * Project details come from the repos themselves: Draftly (built with Richard Baah; describe it
 * as Marco's work with Richard credited, never splitting who did which part), the CS 417
 * training system and its reports, and the home cluster from his notes.
 */
export const systems: SystemsSection = {
  kind: "systems",
  intro: [
    "Software architecture is the part of this work I love most. I fell for it during the semester I spent recovering, and I haven't stopped since.",
    "What draws me in is scale. A well-built system can reach a huge number of people at once and keep working when machines fail, traffic spikes or the network drops. Designing things that hold up like that, and that make a real difference in people's lives, is the work I want to do.",
    "Here are three systems I've built to learn it: a live collaborative editor, a private cloud made from old computers, and a fault-tolerant training system.",
  ],
  projects: [
    {
      id: "draftly",
      name: "Draftly",
      short: "Draftly",
      tag: "With Richard Baah",
      summary:
        "A Google Docs-style editor where several people can write in the same document at once, which I built with my friend Richard Baah.",
      built: [
        "Several people open the same document, type at the same time and see each other's changes as they happen.",
        "A separate Go REST API manages users, documents and sharing permissions, backed by PostgreSQL with Alembic migrations, with document files in Amazon S3.",
        "Each service ships as a Docker image and runs on AWS.",
      ],
      showsTitle: "How everyone edits at once",
      shows: [
        "Rooms: each document is a room, and everyone in it keeps a WebSocket connection open to the live editing server, so changes are pushed the moment they happen.",
        "Operations, not documents: every edit travels as a small insert or delete with a position, never the whole document.",
        "Versions: the server keeps a version number and a history for each room, and every operation says which version its writer was looking at.",
        "Operational transformation: if others edited since that version, the server shifts the operation past their inserts and deletes so it lands where the writer meant. It counts characters, not bytes, so accents and emoji don't throw positions off.",
        "One source of truth: the server gives each operation the next version and broadcasts it to the whole room, so every copy ends up the same.",
        "Catching up: every operation is appended to a log, so anyone who joins late or reconnects is replayed what they missed.",
      ],
      sample: "ot-example",
      stack: [
        "Go",
        "WebSockets",
        "Operational transformation",
        "PostgreSQL",
        "Alembic",
        "Amazon S3",
        "Docker",
        "AWS",
      ],
      architecture: {
        cols: 3,
        rows: 3,
        nodes: [
          {
            id: "writers",
            label: "Writers",
            detail: "Editing one document together",
            kind: "person",
            col: 1,
            row: 1,
            rowSpan: 3,
          },
          {
            id: "live",
            label: "Live editing server",
            detail: "Go, rooms, operational transformation",
            kind: "service",
            col: 2,
            row: 1,
          },
          {
            id: "api",
            label: "Documents API",
            detail: "Go, REST",
            kind: "service",
            col: 2,
            row: 2,
            rowSpan: 2,
          },
          {
            id: "oplog",
            label: "Operation log",
            detail: "Every edit, in order",
            kind: "store",
            col: 3,
            row: 1,
          },
          {
            id: "postgres",
            label: "PostgreSQL",
            detail: "Users, documents, sharing",
            kind: "store",
            col: 3,
            row: 2,
          },
          {
            id: "s3",
            label: "Amazon S3",
            detail: "Document files",
            kind: "store",
            col: 3,
            row: 3,
          },
        ],
        edges: [
          { from: "writers", to: "live", label: "edits", both: true },
          { from: "writers", to: "api", label: "accounts" },
          { from: "live", to: "oplog", label: "append", both: true },
          { from: "api", to: "postgres" },
          { from: "api", to: "s3" },
        ],
        groups: [{ label: "On AWS", col: 2, row: 1, colSpan: 2, rowSpan: 3 }],
      },
      links: [
        { label: "Draftly on GitHub", href: "https://github.com/Rich-T-kid/Draftly" },
        { label: "Richard on GitHub", href: "https://github.com/Rich-T-kid" },
      ],
    },
    {
      id: "home-cluster",
      name: "A private cloud out of old computers",
      short: "Home cluster",
      tag: "Building now",
      summary:
        "I'm turning the old computers I have lying around into one private compute cluster with Kubernetes.",
      builtTitle: "What it's for",
      built: [
        "Free compute for my friends: Minecraft and other game servers, a home for old projects, private storage and hosting.",
        "My own isolated, AWS-like environment to run whatever I'm working on.",
      ],
      showsTitle: "What I'm learning",
      shows: [
        "Cloud computing and cloud engineering from the hardware up, not just from a console.",
        "Running real services for real people on machines I own and maintain.",
        "Distributed systems in practice, alongside Distributed Systems at Rutgers.",
      ],
      stack: ["Kubernetes", "Containers"],
      photo: photoSlot("The cluster, in progress"),
      links: [],
      more: { label: "See where it stands in Active Memory", part: "ram", anchor: "now-cluster" },
    },
    {
      id: "distributed-training",
      name: "Distributed training system",
      short: "Distributed training",
      tag: "Rutgers CS 417",
      summary:
        "A small distributed system for training machine learning models, written in Go with no outside libraries.",
      built: [
        "A coordinator splits each training batch across workers over RPC and adds up their gradients in a fixed order, so every run gives the same result.",
        "When a worker is slow or crashes, its share is retried on another worker and training still finishes.",
        "The model lives in a key-value parameter server replicated across a primary and a backup. Every write is forwarded to the backup and acknowledged before it counts, and each request is applied at most once, even when it's retried.",
      ],
      shows: [
        "Fault tolerance: the system keeps going when machines fail.",
        "Correctness under concurrency, checked with Go's race detector, including worker crashes and slow replies.",
        "Replication without applying work twice, the same idea that keeps real databases consistent.",
      ],
      stats: [
        {
          value: "22,807",
          label:
            "training steps per second through the replicated server, on a Rutgers iLab machine",
        },
        { value: "0.0001", label: "final training loss, down from 9.94" },
      ],
      stack: ["Go", "RPC", "Replication", "Gradient descent"],
      architecture: {
        cols: 3,
        rows: 3,
        nodes: [
          {
            id: "coordinator",
            label: "Coordinator",
            detail: "Splits batches, retries slow workers",
            kind: "service",
            col: 1,
            row: 1,
            rowSpan: 2,
          },
          {
            id: "worker-a",
            label: "Worker",
            detail: "Computes gradients",
            kind: "service",
            col: 2,
            row: 1,
          },
          {
            id: "worker-b",
            label: "Worker",
            detail: "Computes gradients",
            kind: "service",
            col: 2,
            row: 2,
          },
          {
            id: "trainer",
            label: "Training loop",
            detail: "Reads and writes the model",
            kind: "service",
            col: 1,
            row: 3,
          },
          {
            id: "primary",
            label: "Primary",
            detail: "Parameter server",
            kind: "store",
            col: 2,
            row: 3,
          },
          {
            id: "backup",
            label: "Backup",
            detail: "A copy of every write",
            kind: "store",
            col: 3,
            row: 3,
          },
        ],
        edges: [
          { from: "coordinator", to: "worker-a", label: "slices", both: true },
          { from: "coordinator", to: "worker-b", both: true },
          { from: "trainer", to: "primary", label: "get, put", both: true },
          { from: "primary", to: "backup", label: "forward", both: true },
        ],
        groups: [
          { label: "Part 1: training", col: 1, row: 1, colSpan: 2, rowSpan: 2 },
          { label: "Part 2: replicated model", col: 1, row: 3, colSpan: 3, rowSpan: 1 },
        ],
      },
      links: [
        {
          label: "Source on GitHub",
          href: "https://github.com/maroc-dev/distributed-training-system-in-golang",
        },
      ],
    },
  ],
  placeholder: false,
};
