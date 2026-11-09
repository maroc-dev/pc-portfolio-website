import type { Architecture, Project } from "./types";

/**
 * Every project shown on the site, written from its repo (README, code and reports, read
 * November 2026). Left out on purpose: empty repos (README or license only), forks, private and
 * work repos (the AI section covers that work), the 2023 Kivy build experiments, the
 * password-manager skeleton, and ocvts-project-ideas (mentoring notes, not a project).
 *
 * Draftly and OptiSQL were built with Richard Baah: describe them in Marco's voice with Richard
 * credited, never splitting who did which part. Classmates on school projects are credited as
 * "a classmate" or "team project".
 */
const GITHUB = "https://github.com/maroc-dev";

/** Shared with the systems section, so both show the same picture. */
export const draftlyArchitecture: Architecture = {
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
    { id: "s3", label: "Amazon S3", detail: "Document files", kind: "store", col: 3, row: 3 },
  ],
  edges: [
    { from: "writers", to: "live", label: "edits", both: true },
    { from: "writers", to: "api", label: "accounts" },
    { from: "live", to: "oplog", label: "append", both: true },
    { from: "api", to: "postgres" },
    { from: "api", to: "s3" },
  ],
  groups: [{ label: "On AWS", col: 2, row: 1, colSpan: 2, rowSpan: 3 }],
};

/** Shared with the systems section. */
export const trainingArchitecture: Architecture = {
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
    { id: "primary", label: "Primary", detail: "Parameter server", kind: "store", col: 2, row: 3 },
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
};

export const projects: Project[] = [
  // Highlights
  {
    slug: "draftly",
    title: "Draftly",
    summary:
      "A Google Docs-style editor where several people can write in the same document at once, which I built with my friend Richard Baah.",
    kind: "personal",
    category: "distributed-backend",
    tag: "With Richard Baah",
    details: [
      "Everyone editing a document joins the same room on a live editing server over WebSockets. Each edit travels as a small insert or delete, and the server uses operational transformation to shift it past anything that changed in the meantime, so every copy ends up the same.",
      "A separate Go REST API handles users, documents and sharing, backed by PostgreSQL, with document files in Amazon S3. Each service ships as a Docker image and runs on AWS.",
    ],
    highlights: [
      "Real-time editing for many people at once, kept consistent with operational transformation.",
      "Every edit is appended to a log, so anyone who joins late or reconnects catches up.",
      "Separate services for live editing and for accounts and documents.",
    ],
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
    diagram: draftlyArchitecture,
    links: [
      { label: "Draftly on GitHub", href: "https://github.com/Rich-T-kid/Draftly" },
      { label: "Richard on GitHub", href: "https://github.com/Rich-T-kid" },
    ],
    more: { label: "See how everyone edits at once", part: "server", anchor: "systems-draftly" },
    placeholder: false,
  },
  {
    slug: "optisql",
    title: "OptiSQL",
    summary: "An in-memory query execution engine I built with my friend Richard Baah.",
    kind: "personal",
    category: "databases",
    tag: "With Richard Baah",
    details: [
      "A SQL query comes in over HTTP, gets parsed and optimized into a plan, and the plan is run by operators that scan, filter, join and aggregate data held in memory.",
      "I worked on every part of it: the operators, the physical optimizer in Go with a Rust version alongside, query plans passed around in Substrait, and the HTTP server that takes queries in, all tested in CI.",
    ],
    highlights: [
      "Query plans use Substrait, an open format for describing them.",
      "The engine is written in Go first, with a Rust version mirroring it.",
      "Tests for the Go, Rust and Python parts run in GitHub Actions.",
    ],
    stack: ["Go", "Rust", "C++", "Python", "FastAPI", "Substrait", "Docker", "GitHub Actions"],
    diagram: {
      caption:
        "Simplified to the main pieces. The C++ parser and optimizer were still being built.",
      cols: 3,
      rows: 2,
      nodes: [
        { id: "client", label: "Client", detail: "Sends SQL", kind: "person", col: 1, row: 1 },
        {
          id: "http",
          label: "HTTP server",
          detail: "Python, FastAPI",
          kind: "service",
          col: 2,
          row: 1,
        },
        {
          id: "planner",
          label: "Parser and optimizer",
          detail: "C++, builds the plan",
          kind: "service",
          col: 3,
          row: 1,
        },
        {
          id: "physical",
          label: "Physical optimizer",
          detail: "Go, picks how to run it",
          kind: "service",
          col: 3,
          row: 2,
        },
        {
          id: "operators",
          label: "Operators",
          detail: "Go and Rust: filter, join, aggregate",
          kind: "service",
          col: 2,
          row: 2,
        },
        { id: "data", label: "Data in memory", kind: "store", col: 1, row: 2 },
      ],
      edges: [
        { from: "client", to: "http", label: "SQL" },
        { from: "http", to: "planner" },
        { from: "planner", to: "physical", label: "Substrait plan" },
        { from: "physical", to: "operators" },
        { from: "operators", to: "data", both: true },
      ],
    },
    links: [
      { label: "OptiSQL on GitHub", href: "https://github.com/Rich-T-kid/OptiSQL" },
      { label: "Richard on GitHub", href: "https://github.com/Rich-T-kid" },
    ],
    placeholder: false,
  },

  // Building now
  {
    slug: "goosedb",
    title: "GooseDB",
    summary:
      "A full database system I'm building from the ground up in C++23, for storing and querying media.",
    kind: "personal",
    category: "databases",
    tag: "Building now",
    details: [
      "GooseDB is meant to work more like a distributed, S3-style store than a classic single-machine database: data spread and replicated across machines, with a query layer on top.",
      "I'm building it from the ground up as I work through Carnegie Mellon's database course, starting with the storage engine: 4 KB pages that hold tuples, each with a header, and table schemas that describe their columns.",
    ],
    stack: ["C++23"],
    diagram: {
      caption:
        "The plan, simplified. The storage engine is being built now; dashed boxes are still to come.",
      cols: 4,
      rows: 1,
      nodes: [
        {
          id: "clients",
          label: "Clients",
          detail: "Store and query media",
          kind: "person",
          col: 1,
          row: 1,
        },
        {
          id: "query",
          label: "Query layer",
          detail: "Parse, plan, execute",
          kind: "external",
          col: 2,
          row: 1,
        },
        {
          id: "storage",
          label: "Storage engine",
          detail: "4 KB pages of tuples, schemas",
          kind: "store",
          col: 3,
          row: 1,
        },
        {
          id: "nodes",
          label: "Many machines",
          detail: "Spread and replicate data",
          kind: "external",
          col: 4,
          row: 1,
        },
      ],
      edges: [
        { from: "clients", to: "query", both: true },
        { from: "query", to: "storage", both: true },
        { from: "storage", to: "nodes", both: true },
      ],
    },
    links: [{ label: "Follow GooseDB on GitHub", href: `${GITHUB}/goosedb` }],
    more: { label: "Why I'm building it", part: "ram", anchor: "now-databases" },
    placeholder: false,
  },

  // Systems programming in C
  {
    slug: "myshell",
    title: "myshell",
    summary: "A Unix shell written in C, with pipes, redirection and wildcards.",
    kind: "academic",
    category: "systems-c",
    tag: "Rutgers coursework",
    details: [
      "It reads commands from the terminal or from a batch script, expands wildcards, and runs built-ins like cd, pwd and which itself.",
      "Everything else is started as a real process: fork and exec, with pipes between commands and dup2 to redirect input and output to files.",
    ],
    highlights: [
      "Interactive and batch modes.",
      "Test scripts for built-ins, pipes, redirection, wildcards, errors and edge cases.",
    ],
    stack: ["C", "POSIX", "Make"],
    diagram: {
      cols: 3,
      rows: 2,
      nodes: [
        {
          id: "input",
          label: "Input",
          detail: "Terminal or batch script",
          kind: "person",
          col: 1,
          row: 1,
          rowSpan: 2,
        },
        {
          id: "parser",
          label: "Parser",
          detail: "Tokens, wildcards expanded",
          kind: "service",
          col: 2,
          row: 1,
          rowSpan: 2,
        },
        {
          id: "builtins",
          label: "Built-ins",
          detail: "cd, pwd, which, exit",
          kind: "service",
          col: 3,
          row: 1,
        },
        {
          id: "programs",
          label: "Programs",
          detail: "fork, exec, pipes, redirection",
          kind: "service",
          col: 3,
          row: 2,
        },
      ],
      edges: [
        { from: "input", to: "parser" },
        { from: "parser", to: "builtins" },
        { from: "parser", to: "programs" },
      ],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/myshell` }],
    placeholder: false,
  },
  {
    slug: "mymalloc",
    title: "mymalloc",
    summary:
      "My own malloc and free in C, with error detection and a benchmark against the real thing.",
    kind: "academic",
    category: "systems-c",
    tag: "Rutgers coursework, with a classmate",
    details: [
      "The heap is a single static block of memory. Every chunk starts with an 8-byte header saying how big it is and whether it's in use, and free merges neighbouring free chunks back together so the heap doesn't fragment.",
      "It catches mistakes the system malloc doesn't report, like freeing the same chunk twice or freeing a pointer into the middle of a chunk, and it reports leaks when the program exits.",
    ],
    stats: [
      { value: "6 ms", label: "per memgrind workload run, against 3 ms for the system malloc" },
    ],
    stack: ["C", "Make"],
    diagram: {
      cols: 3,
      rows: 1,
      nodes: [
        {
          id: "program",
          label: "Program",
          detail: "Calls malloc and free",
          kind: "person",
          col: 1,
          row: 1,
        },
        {
          id: "allocator",
          label: "mymalloc",
          detail: "Finds space, splits, merges, checks errors",
          kind: "service",
          col: 2,
          row: 1,
        },
        {
          id: "heap",
          label: "Heap",
          detail: "One static block of 8-byte-headed chunks",
          kind: "store",
          col: 3,
          row: 1,
        },
      ],
      edges: [
        { from: "program", to: "allocator", both: true },
        { from: "allocator", to: "heap", both: true },
      ],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/mymalloc` }],
    placeholder: false,
  },
  {
    slug: "cache-simulator",
    title: "Cache simulator",
    summary:
      "A CPU cache simulator in C that replays memory traces and counts hits, misses and evictions.",
    kind: "academic",
    category: "systems-c",
    tag: "Rutgers CS 211, team project",
    details: [
      "It models a cache as sets of lines with tags and replays a trace of loads, stores and modifies, evicting the least recently used line when a set is full.",
      "For the second part we designed our own policy: a hybrid that keeps lines until space runs out, then evicts based on how often each line is used.",
    ],
    stack: ["C", "Python"],
    diagram: {
      cols: 3,
      rows: 1,
      nodes: [
        {
          id: "trace",
          label: "Memory trace",
          detail: "Loads, stores, modifies",
          kind: "store",
          col: 1,
          row: 1,
        },
        {
          id: "sim",
          label: "Cache simulator",
          detail: "Sets, lines, tags, LRU",
          kind: "service",
          col: 2,
          row: 1,
        },
        {
          id: "counts",
          label: "Results",
          detail: "Hits, misses, evictions",
          kind: "person",
          col: 3,
          row: 1,
        },
      ],
      edges: [
        { from: "trace", to: "sim" },
        { from: "sim", to: "counts" },
      ],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/Cache_Design` }],
    placeholder: false,
  },
  {
    slug: "word-count",
    title: "Recursive word count",
    summary:
      "A C program that walks files and folders and lists every word by how often it appears.",
    kind: "academic",
    category: "systems-c",
    tag: "Rutgers coursework",
    details: [
      "Give it any number of files and directories. It walks directories recursively, reading only .txt files and skipping hidden ones, and counts each word.",
      "Words follow careful rules: leading and trailing hyphens are dropped but inner ones stay, apostrophes count as part of a word, and numbers split words apart. The output is sorted by count, then alphabetically.",
    ],
    stack: ["C", "POSIX", "Make"],
    diagram: {
      cols: 4,
      rows: 1,
      nodes: [
        { id: "paths", label: "Files and folders", kind: "person", col: 1, row: 1 },
        {
          id: "walk",
          label: "Directory walk",
          detail: "Recursive, .txt only, no hidden files",
          kind: "service",
          col: 2,
          row: 1,
        },
        {
          id: "count",
          label: "Word counter",
          detail: "Hyphens, apostrophes, numbers",
          kind: "service",
          col: 3,
          row: 1,
        },
        {
          id: "sorted",
          label: "Sorted list",
          detail: "By count, then A to Z",
          kind: "store",
          col: 4,
          row: 1,
        },
      ],
      edges: [
        { from: "paths", to: "walk" },
        { from: "walk", to: "count" },
        { from: "count", to: "sorted" },
      ],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/recursive_word_count` }],
    placeholder: false,
  },

  // Languages and interpreters
  {
    slug: "pratt-expression-evaluator",
    title: "Pratt-parsing expression evaluator",
    summary:
      "A C++23 calculator REPL that parses expressions with Pratt parsing and remembers variables.",
    kind: "personal",
    category: "languages",
    tag: "Personal project",
    details: [
      "Each line goes through three stages: a lexer turns it into tokens, a Pratt parser builds an expression tree that respects operator precedence and parentheses, and an evaluator walks the tree to compute the answer.",
      "Assignments like x = 3 store values in a hash map, so later expressions can use them.",
    ],
    stack: ["C++23", "Make"],
    diagram: {
      cols: 4,
      rows: 1,
      nodes: [
        {
          id: "line",
          label: "Input line",
          detail: "x = (2 + 3) * 4",
          kind: "person",
          col: 1,
          row: 1,
        },
        { id: "lexer", label: "Lexer", detail: "Tokens", kind: "service", col: 2, row: 1 },
        {
          id: "parser",
          label: "Pratt parser",
          detail: "Expression tree by precedence",
          kind: "service",
          col: 3,
          row: 1,
        },
        {
          id: "eval",
          label: "Evaluator",
          detail: "Walks the tree, stores variables",
          kind: "service",
          col: 4,
          row: 1,
        },
      ],
      edges: [
        { from: "line", to: "lexer" },
        { from: "lexer", to: "parser" },
        { from: "parser", to: "eval" },
      ],
    },
    links: [
      { label: "Source on GitHub", href: `${GITHUB}/cpp-pratt-parsing-expression-evaluator` },
    ],
    placeholder: false,
  },
  {
    slug: "ocaml-interpreter",
    title: "IMP interpreter in OCaml",
    summary:
      "An interpreter for a small imperative language, with loops, conditionals and lambdas.",
    kind: "academic",
    category: "languages",
    tag: "Rutgers CS 314",
    details: [
      "Programs are lexed and parsed with OCaml's lexer and parser generators into a syntax tree, and an evaluator runs the tree.",
      "The language has arithmetic and boolean expressions, conditionals, while and for loops, and lambdas, enough to run programs like factorial, Fibonacci and a palindrome check.",
    ],
    stack: ["OCaml", "ocamllex", "Make"],
    diagram: {
      cols: 4,
      rows: 1,
      nodes: [
        { id: "program", label: "Program", detail: "A .imp file", kind: "person", col: 1, row: 1 },
        {
          id: "parse",
          label: "Lexer and parser",
          detail: "Generated from grammar files",
          kind: "service",
          col: 2,
          row: 1,
        },
        { id: "ast", label: "Syntax tree", kind: "store", col: 3, row: 1 },
        {
          id: "eval",
          label: "Evaluator",
          detail: "Loops, conditionals, lambdas",
          kind: "service",
          col: 4,
          row: 1,
        },
      ],
      edges: [
        { from: "program", to: "parse" },
        { from: "parse", to: "ast" },
        { from: "ast", to: "eval" },
      ],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/ocaml_evaluator` }],
    placeholder: false,
  },

  // AI and machine learning
  {
    slug: "face-and-digit-classification",
    title: "Face and digit classification",
    summary:
      "Three classifiers for handwritten digits and faces, two of them built from scratch, compared on accuracy and speed.",
    kind: "academic",
    category: "ai-ml",
    tag: "Rutgers CS 440, with a classmate",
    details: [
      "Each image becomes raw pixel features: 784 for a digit and 4,200 for a face. We built a perceptron and a three-layer neural network from scratch with NumPy, then the same network in PyTorch.",
      "Each one was trained on 10% to 100% of the training data, five times per step, and we compared test accuracy and training time.",
    ],
    stats: [
      {
        value: "9.6%",
        label: "error on digits with the PyTorch network, using all the training data",
      },
      { value: "9.73%", label: "error on faces with the PyTorch network" },
    ],
    stack: ["Python", "NumPy", "PyTorch", "Matplotlib"],
    diagram: {
      cols: 3,
      rows: 3,
      nodes: [
        {
          id: "images",
          label: "Images",
          detail: "Digits and faces as pixels",
          kind: "store",
          col: 1,
          row: 1,
          rowSpan: 3,
        },
        {
          id: "perceptron",
          label: "Perceptron",
          detail: "From scratch",
          kind: "service",
          col: 2,
          row: 1,
        },
        {
          id: "scratch",
          label: "Neural network",
          detail: "From scratch, NumPy",
          kind: "service",
          col: 2,
          row: 2,
        },
        {
          id: "torch",
          label: "Neural network",
          detail: "PyTorch",
          kind: "service",
          col: 2,
          row: 3,
        },
        {
          id: "results",
          label: "Learning curves",
          detail: "Accuracy and time by data size",
          kind: "person",
          col: 3,
          row: 1,
          rowSpan: 3,
        },
      ],
      edges: [
        { from: "images", to: "perceptron" },
        { from: "images", to: "scratch" },
        { from: "images", to: "torch" },
        { from: "perceptron", to: "results" },
        { from: "scratch", to: "results" },
        { from: "torch", to: "results" },
      ],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/Face-and-Digit-Classification` }],
    placeholder: false,
  },
  {
    slug: "a-star-mazes",
    title: "A* search through mazes",
    summary:
      "Repeated Forward, Backward and Adaptive A* finding paths through mazes the agent can't fully see.",
    kind: "academic",
    category: "ai-ml",
    tag: "Rutgers CS 440",
    details: [
      "It generates 50 grid-world mazes, then sends an agent through each one that only discovers walls as it moves, so it plans with A*, follows the path, and replans when it hits something new.",
      "Three versions are compared: Repeated Forward A*, Repeated Backward A* and Adaptive A*, which reuses what earlier searches learned. The priority queue is a binary heap written by hand, with tie-breaking options.",
    ],
    stack: ["Python"],
    diagram: {
      cols: 3,
      rows: 1,
      nodes: [
        {
          id: "mazes",
          label: "Maze generator",
          detail: "50 grid worlds",
          kind: "store",
          col: 1,
          row: 1,
        },
        {
          id: "search",
          label: "A* searches",
          detail: "Forward, backward, adaptive",
          kind: "service",
          col: 2,
          row: 1,
        },
        {
          id: "results",
          label: "Results",
          detail: "Comparisons and maze pictures",
          kind: "person",
          col: 3,
          row: 1,
        },
      ],
      edges: [
        { from: "mazes", to: "search" },
        { from: "search", to: "results" },
      ],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/CS440-Assignment-1` }],
    placeholder: false,
  },
  {
    slug: "jbmdl-assistant-prototype",
    title: "JBMDL assistant, first version",
    summary:
      "The first version of the AI assistant I built for Joint Base McGuire-Dix-Lakehurst: ask by text or voice, get cited answers.",
    kind: "professional",
    category: "ai-ml",
    tag: "Ocean County College",
    details: [
      "A Streamlit app where people ask questions by typing or speaking. A LangChain pipeline answers from the base's public documents, PDFs people upload, or a web search, and cites where each answer came from.",
      "It also translates, so people can ask in more than one language.",
    ],
    stack: ["Python", "Streamlit", "LangChain", "Speech-to-text", "DuckDuckGo search"],
    diagram: {
      cols: 3,
      rows: 3,
      nodes: [
        {
          id: "person",
          label: "Person",
          detail: "Types or speaks",
          kind: "person",
          col: 1,
          row: 1,
          rowSpan: 3,
        },
        {
          id: "app",
          label: "Streamlit app",
          detail: "Speech-to-text, translation, LLM chain",
          kind: "service",
          col: 2,
          row: 1,
          rowSpan: 3,
        },
        { id: "docs", label: "Public documents", kind: "store", col: 3, row: 1 },
        { id: "uploads", label: "Uploaded PDFs", kind: "store", col: 3, row: 2 },
        { id: "web", label: "Web search", kind: "external", col: 3, row: 3 },
      ],
      edges: [
        { from: "person", to: "app", label: "question, answer", both: true },
        { from: "app", to: "docs" },
        { from: "app", to: "uploads" },
        { from: "app", to: "web" },
      ],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/jbml` }],
    more: { label: "See what it grew into", part: "gpu", anchor: "ai-jbmdl-assistant" },
    placeholder: false,
  },
  {
    slug: "python-executor-mcp",
    title: "Python executor MCP server",
    summary: "An MCP server that lets AI agents run Python code, with the dangerous parts blocked.",
    kind: "personal",
    category: "ai-ml",
    tag: "Personal project",
    details: [
      "An agent sends Python code as an MCP tool call. Before anything runs, the server reads the code's syntax tree and refuses imports and built-ins that could touch the system, like os, subprocess, open and eval.",
      "Safe code runs with its output captured and sent back to the agent. The server ships in a Docker image.",
    ],
    stack: ["Python", "FastMCP", "MCP", "Docker"],
    diagram: {
      cols: 3,
      rows: 1,
      nodes: [
        {
          id: "agent",
          label: "AI agent",
          detail: "Sends code to run",
          kind: "person",
          col: 1,
          row: 1,
        },
        {
          id: "check",
          label: "Safety check",
          detail: "Blocks risky imports and built-ins",
          kind: "service",
          col: 2,
          row: 1,
        },
        {
          id: "run",
          label: "Runner",
          detail: "Captures the output",
          kind: "service",
          col: 3,
          row: 1,
        },
      ],
      edges: [
        { from: "agent", to: "check", label: "tool call", both: true },
        { from: "check", to: "run", both: true },
      ],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/mcp_python_executor` }],
    placeholder: false,
  },
  {
    slug: "house-price-regression",
    title: "House price regression",
    summary: "Predicting house prices with linear regression and a decision tree.",
    kind: "academic",
    category: "ai-ml",
    tag: "Coursework",
    details: [
      "A notebook that splits a housing dataset 80/20 into training and test sets, then trains a linear regression and a decision tree with scikit-learn.",
      "Each model is checked with 5-fold cross-validation and mean squared error, and the tree is drawn out so you can see its decisions.",
    ],
    stack: ["Python", "pandas", "scikit-learn", "Jupyter"],
    diagram: {
      cols: 3,
      rows: 2,
      nodes: [
        {
          id: "data",
          label: "Housing data",
          detail: "80/20 train and test split",
          kind: "store",
          col: 1,
          row: 1,
          rowSpan: 2,
        },
        { id: "linear", label: "Linear regression", kind: "service", col: 2, row: 1 },
        { id: "tree", label: "Decision tree", kind: "service", col: 2, row: 2 },
        {
          id: "eval",
          label: "Evaluation",
          detail: "5-fold cross-validation, error",
          kind: "person",
          col: 3,
          row: 1,
          rowSpan: 2,
        },
      ],
      edges: [
        { from: "data", to: "linear" },
        { from: "data", to: "tree" },
        { from: "linear", to: "eval" },
        { from: "tree", to: "eval" },
      ],
    },
    links: [{ label: "Notebook on GitHub", href: `${GITHUB}/house_regression` }],
    placeholder: false,
  },

  // Distributed systems and backend
  {
    slug: "distributed-training-system",
    title: "Distributed training system",
    summary:
      "A fault-tolerant distributed training system in Go, with a replicated parameter server.",
    kind: "academic",
    category: "distributed-backend",
    tag: "Rutgers CS 417",
    details: [
      "A coordinator splits each training batch across workers over RPC and adds up their gradients in a fixed order, retrying a slow or crashed worker's share elsewhere.",
      "The model lives in a key-value parameter server replicated across a primary and a backup, with every write acknowledged by the backup and each request applied at most once.",
    ],
    stats: [
      {
        value: "22,807",
        label: "training steps per second through the replicated server, on a Rutgers iLab machine",
      },
    ],
    stack: ["Go", "RPC", "Replication", "Gradient descent"],
    diagram: trainingArchitecture,
    links: [{ label: "Source on GitHub", href: `${GITHUB}/distributed-training-system-in-golang` }],
    more: { label: "Read the full story", part: "server", anchor: "systems-distributed-training" },
    placeholder: false,
  },
  {
    slug: "go-rest-api",
    title: "Go REST API",
    summary: "A small REST API in Go, built as practice for a dorm-swap app for Rutgers students.",
    kind: "personal",
    category: "distributed-backend",
    tag: "Practice",
    details: [
      "A Gin server with endpoints to list users and add new ones, kept in memory.",
      "It was practice for RUDorms, an idea for helping Rutgers students find each other to swap dorms.",
    ],
    stack: ["Go", "Gin"],
    diagram: {
      cols: 3,
      rows: 1,
      nodes: [
        { id: "client", label: "Client", detail: "GET and POST", kind: "person", col: 1, row: 1 },
        {
          id: "server",
          label: "Gin server",
          detail: "Users endpoints",
          kind: "service",
          col: 2,
          row: 1,
        },
        { id: "users", label: "Users", detail: "Kept in memory", kind: "store", col: 3, row: 1 },
      ],
      edges: [
        { from: "client", to: "server", label: "JSON", both: true },
        { from: "server", to: "users", both: true },
      ],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/golang_api` }],
    placeholder: false,
  },

  // Apps and games
  {
    slug: "solar-system-explorer",
    title: "Solar System Explorer",
    summary: "Fly a spaceship through a solar system with real orbits, in the browser.",
    kind: "personal",
    category: "apps-games",
    tag: "Unity game",
    details: [
      "Planets follow Newtonian orbits under a gravity model and spin on their axes. They're generated procedurally with a third-party planet generator, with an atmosphere around Earth and bloom on the sun.",
      "You fly a spaceship between them and pick planets to visit. Browsers can't run the compute shaders the planet generator normally uses, so the WebGL build generates planets on the CPU instead.",
    ],
    stack: ["Unity 6", "C#", "Universal Render Pipeline", "WebGL"],
    diagram: {
      cols: 3,
      rows: 2,
      nodes: [
        {
          id: "player",
          label: "Player",
          detail: "Flies and picks planets",
          kind: "person",
          col: 1,
          row: 1,
          rowSpan: 2,
        },
        {
          id: "ship",
          label: "Spaceship",
          detail: "Input System controls",
          kind: "service",
          col: 2,
          row: 1,
        },
        {
          id: "system",
          label: "Solar system",
          detail: "Gravity, orbits, spin",
          kind: "service",
          col: 2,
          row: 2,
        },
        {
          id: "planets",
          label: "Planet builder",
          detail: "Procedural, CPU path for WebGL",
          kind: "service",
          col: 3,
          row: 2,
        },
      ],
      edges: [
        { from: "player", to: "ship" },
        { from: "player", to: "system", label: "select" },
        { from: "ship", to: "system" },
        { from: "system", to: "planets" },
      ],
    },
    links: [
      { label: "Play it on itch.io", href: "https://marocf.itch.io/final-solar-system-explorer" },
      { label: "Source on GitHub", href: `${GITHUB}/Solar-System-Explorer` },
    ],
    placeholder: false,
  },
  {
    slug: "ru-burgers",
    title: "RU Burgers",
    summary:
      "A restaurant ordering app, built twice: once for the desktop with JavaFX and once for Android.",
    kind: "academic",
    category: "apps-games",
    tag: "Rutgers CS 213",
    details: [
      "Customers build burgers, sandwiches, sides and drinks with add-ons, combine them into combos, review the current order and place it, and the store keeps an order history.",
      "Both versions share the same model classes for menu items and orders. The desktop app draws them with JavaFX views and controllers, and the Android app with activities and fragments.",
    ],
    stack: ["Java", "JavaFX", "FXML", "Android", "Maven", "Gradle"],
    diagram: {
      cols: 2,
      rows: 2,
      nodes: [
        {
          id: "desktop",
          label: "Desktop app",
          detail: "JavaFX views and controllers",
          kind: "service",
          col: 1,
          row: 1,
        },
        {
          id: "android",
          label: "Android app",
          detail: "Activities and fragments",
          kind: "service",
          col: 1,
          row: 2,
        },
        {
          id: "model",
          label: "Shared model",
          detail: "Menu items, combos, orders",
          kind: "store",
          col: 2,
          row: 1,
          rowSpan: 2,
        },
      ],
      edges: [
        { from: "desktop", to: "model", both: true },
        { from: "android", to: "model", both: true },
      ],
    },
    links: [
      { label: "Desktop app on GitHub", href: `${GITHUB}/RUBurgers` },
      { label: "Android app on GitHub", href: `${GITHUB}/RUBurgersAndroid` },
    ],
    placeholder: false,
  },
  {
    slug: "flutter-namer-app",
    title: "Flutter namer app",
    summary: "My first Flutter app: random word-pair names you can save as favorites.",
    kind: "personal",
    category: "apps-games",
    tag: "Learning project",
    details: [
      "Built to learn Flutter and Dart. It shows a random word pair, lets you get the next one, and keeps the ones you like in a favorites list.",
      "App state lives in one ChangeNotifier that the widgets listen to, so the screen updates when it changes.",
    ],
    stack: ["Dart", "Flutter", "Provider"],
    diagram: {
      cols: 2,
      rows: 1,
      nodes: [
        {
          id: "ui",
          label: "Widgets",
          detail: "Next and like buttons",
          kind: "service",
          col: 1,
          row: 1,
        },
        {
          id: "state",
          label: "App state",
          detail: "Current pair, favorites",
          kind: "store",
          col: 2,
          row: 1,
        },
      ],
      edges: [{ from: "ui", to: "state", label: "listen, update", both: true }],
    },
    links: [{ label: "Source on GitHub", href: `${GITHUB}/Flutter-Namer-App` }],
    placeholder: false,
  },
];

const bySlug = new Map(projects.map((p) => [p.slug, p]));

export function getProject(slug: string): Project | undefined {
  return bySlug.get(slug);
}

export function getProjects(slugs: readonly string[]): Project[] {
  return slugs.map(getProject).filter((p): p is Project => p !== undefined);
}
