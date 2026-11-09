import type { AboutSection } from "../types";

/*
 * Written from Marco's own notes and résumé (November 2026). Polished for reading, but every fact
 * is his: nothing here should be added without him confirming it.
 */
export const about: AboutSection = {
  kind: "about",
  portrait: {
    placeholder: false,
    src: "/about/marco.jpg",
    width: 648,
    height: 810,
    alt: "Marco standing in a grey polo next to a demo table with a laptop and two monitors.",
    caption: "Marco",
  },
  intro: [
    "I build systems that people actually use, and I like them best when they quietly make someone's day easier. These days that means AI agents, the gateways that keep them secure, and the distributed plumbing underneath.",
    "I got here by trying something new every week, spending a lot of very long days on campus (the good kind), and surviving a detour I never planned. Here's the route.",
  ],
  journey: [
    {
      id: "ocvts",
      place: "OCVTS",
      when: "High school",
      title: "Where it started",
      story: [
        "I wrote my first programs in high school, and soon added a part-time programming course at the Ocean County Vocational Technical School. That's where I picked up Java, Python and the basics of web design.",
        "It turned into competitions, and the competitions turned into results.",
        "More than any language, those years taught me how to learn. On my own I worked through data structures and algorithms, and set myself one rule: explore something new every week.",
      ],
      placings: [
        { place: "3rd", event: "Statewide Java software engineering competition" },
        { place: "1st", event: "SkillsUSA Web Design, in the state" },
      ],
      photo: {
        placeholder: false,
        src: "/about/skillsusa-ocvts.jpg",
        width: 853,
        height: 846,
        alt: "Five students standing in front of the Ocean County Vocational Technical School sign, three of them in red SkillsUSA blazers.",
        caption: "SkillsUSA days at OCVTS",
      },
    },
    {
      id: "occ",
      place: "Ocean County College",
      when: "2022 to 2024",
      title: "Twelve-hour days, the good kind",
      story: [
        "Ocean County College is where I stopped just being busy and started being active. It's also where I found what I want to do: build systems people actually use and love, the kind that make their lives easier.",
        "I spent whole days in the makerspace wiring up Arduinos and other microcontrollers. I founded the Chess Club, joined the Improv Club, and regularly stayed on campus for twelve hours or more.",
        "I also started shipping software for real users: two projects for Joint Base McGuire-Dix-Lakehurst, a sign-in kiosk and a completely private AI assistant. There's more on both under Education.",
      ],
      photo: {
        placeholder: false,
        src: "/about/occ-chess-club.jpg",
        width: 1078,
        height: 810,
        alt: "Two students facing each other over a chessboard and clock in a student life room with a large painted tree on the wall.",
        caption: "A game at the Chess Club I founded",
      },
      more: {
        label: "See how the private assistant works",
        part: "gpu",
        anchor: "ai-jbmdl-assistant",
      },
    },
    {
      id: "att",
      place: "AT&T Labs",
      when: "First internship",
      title: "LLMs, right as they took off",
      story: [
        "My first internship put me at AT&T Labs just as large language models were taking off, so I learned them as they happened.",
        "I built the first version of a tool that turns a prompt or a configuration file into a network diagram. Getting it right meant working closely with network engineers.",
        "I went deep on running models locally, with quantization and llama.cpp, was part of that early community, and got to talk with the team at Weights & Biases. At the end of it, AT&T kept me on as a contractor while I finish my bachelor's.",
      ],
      photo: {
        placeholder: false,
        src: "/about/att-interns.jpg",
        width: 1200,
        height: 900,
        alt: "About fifteen interns gathered on a stage around an AT&T flag, with Marco in the middle of the group.",
        caption: "The interns I mentored at AT&T. I'm in the middle.",
      },
      more: { label: "See how the diagram tool works", part: "gpu", anchor: "ai-network-diagrams" },
    },
    {
      id: "contractor",
      place: "Externetworks, then HCLTech",
      when: "Contractor at AT&T Labs",
      title: "Plumbing for AI agents",
      story: [
        "As a contractor, first through Externetworks and now as a senior software engineer through HCLTech, the projects got bigger and so did the systems. I also mentored interns, leading a team of five.",
      ],
      more: { label: "See how these systems work", part: "gpu", anchor: "ai-professional" },
      built: [
        {
          name: "Network diagrams, at scale",
          detail:
            "Grew my internship tool to handle up to 50 Cisco network nodes, and used it to generate over 1,000 training images for internal model development.",
        },
        {
          name: "Personal agents",
          detail:
            "A scalable way for people to create their own personalized agents across a distributed system.",
        },
        {
          name: "MCP and skills registry",
          detail:
            "An internal registry of MCP servers and skills, holding more than 10,000 skills.",
        },
        {
          name: "MCP gateway",
          detail:
            "Signs people in with OAuth and collects telemetry. People can share their MCP servers and turn REST APIs into new ones.",
        },
        {
          name: "Agent gateway",
          detail:
            "Secures every agent with OAuth, tracks who uses each agent and what it costs, and lets people share their agents, across a lot of users.",
        },
      ],
    },
    {
      id: "rutgers",
      place: "Rutgers",
      when: "2024 onwards",
      title: "Making a big school feel small",
      story: [
        "Rutgers surrounded me with motivated developers and deeply experienced professors. At first it was overwhelming: huge classes, and the feeling of being behind.",
        "So I made it smaller. I joined the Unix Student Club and spent my free hours in the Hackerspace, the makerspace for computer science, and soon it felt like mine.",
        "The courses filled in the foundations: C and C++, mobile development in Java, and the math behind algorithms.",
      ],
      photo: {
        placeholder: false,
        src: "/about/rutgers-hill-center.jpg",
        width: 1000,
        height: 1148,
        alt: "Students climbing the wide outdoor stairs of Hill Center, a tall brick building at Rutgers.",
        caption: "Hill Center, home of Rutgers computer science",
        credit: {
          author: "Tomwsulcer",
          license: "CC0",
          href: "https://commons.wikimedia.org/wiki/File:Rutgers_University_Hill_Center.jpg",
        },
      },
    },
    {
      id: "recovery",
      place: "Recovery",
      when: "A semester off",
      title: "An unplanned pause",
      pause: true,
      story: [
        "Then a near-fatal car crash put me in the hospital. It took three surgeries to keep me alive and well, and I had to sit out a semester, which pushed my graduation back.",
        "I kept building from home. I worked on Draftly, a Google Docs-style editor where several people can write in the same document at once, and started reading about system design.",
        "I fell for it: architecture, scale, and how big systems stay correct. It's where most of my attention goes now.",
      ],
    },
    {
      id: "now",
      place: "Now",
      when: "Today",
      title: "Back at full speed",
      story: [
        "I'm finishing my B.S. in Computer Science at Rutgers, graduating in December 2026, with Distributed Systems and Imaging and Multimedia on this semester's schedule. At work, I build AI agent infrastructure at AT&T Labs.",
      ],
      more: { label: "See what I'm working on now", part: "ram", anchor: "memory-now" },
    },
  ],
  education: [
    {
      name: "Rutgers University",
      degree: "B.S. in Computer Science",
      where: "New Brunswick, NJ",
      when: "2024 to December 2026",
      gpa: "3.7",
      honours: ["Dean's List, 2024"],
      summary:
        "Rutgers connected me with people who know far more than I do about fields I'd never touched, and each of them taught me something. These are the courses that shaped me most.",
      courses: [
        {
          code: "CS 417",
          name: "Distributed Systems",
          current: true,
          takeaway:
            "How programs keep working across many machines: leader election, Lamport clocks, two-phase commit, Paxos, Raft and the CAP theorem.",
        },
        {
          code: "CS 334",
          name: "Introduction to Imaging and Multimedia",
          current: true,
          takeaway: "How images live in software, and the math behind filters that change them.",
        },
        {
          code: "CS 440",
          name: "Introduction to Artificial Intelligence",
          takeaway:
            "Search and probabilistic reasoning, from algorithms that play chess to models that guess the weather from past patterns.",
        },
        {
          code: "CS 214",
          name: "Systems Programming",
          takeaway:
            "Pure C and Unix from start to finish: the file system up close, my own malloc library, my own shell and a word counter.",
        },
        {
          code: "CS 213",
          name: "Software Methodology",
          takeaway: "My first Java mobile app: an ordering system.",
        },
      ],
      photos: [
        {
          placeholder: false,
          src: "/about/rutgers-old-queens.jpg",
          width: 1600,
          height: 900,
          alt: "Old Queens, a brownstone building with a white cupola, behind a lawn on College Avenue at Rutgers.",
          caption: "Old Queens, College Avenue",
          credit: {
            author: "Ajay Suresh",
            license: "CC BY 4.0",
            href: "https://commons.wikimedia.org/wiki/File:Old_Queens_-_Rutgers_University_(55142886116).jpg",
          },
        },
        {
          placeholder: false,
          src: "/about/rutgers-core.jpg",
          width: 831,
          height: 769,
          alt: "The CoRE building, a tall brick and glass building on Rutgers' Busch campus.",
          caption: "The CoRE building, Busch campus",
          credit: {
            author: "Tomwsulcer",
            license: "CC0",
            href: "https://commons.wikimedia.org/wiki/File:Rutgers_University_CoRE_Building.jpg",
          },
        },
      ],
    },
    {
      name: "Ocean County College",
      degree: "A.S. in Computer Science",
      where: "Toms River, NJ",
      when: "2022 to 2024",
      gpa: "3.92",
      honours: [
        "Dean's List, 2022 to 2024",
        "Who's Who Among Students at Ocean County College, 2024",
        "Philip G. Zitelli Scholarship in Leadership, 2024",
      ],
      summary: "Where the journey really started.",
      highlights: [
        "Founded the Chess Club: more than 15 members at our weekly meetings, and a tournament we organized together.",
        "Led a team of five developers on projects for Joint Base McGuire-Dix-Lakehurst, work that grew into a continuing relationship between the college and the base.",
        "Built a self-hosted sign-in kiosk for the base, with a MySQL database and CSV export.",
        "Built a completely private, locally run AI assistant over more than 10,000 pages of public documents. Vector search kept answers accurate and cited, with web search and speech-to-text built in.",
      ],
      photos: [
        {
          placeholder: false,
          src: "/about/occ-library.jpg",
          width: 1024,
          height: 768,
          alt: "The library at Ocean County College, a brick building with tall windows and a glass clock tower.",
          caption: "The library and clock tower",
          credit: {
            author: "Daniel Collins",
            license: "CC BY-SA 2.0",
            href: "https://commons.wikimedia.org/wiki/File:OCC6-NJ.jpg",
          },
        },
      ],
    },
  ],
  hobbies: [
    {
      name: "Climbing",
      detail: "Rock climbing at Gravity Vault.",
      photo: {
        placeholder: false,
        src: "/about/climbing-wall.jpg",
        width: 900,
        height: 900,
        alt: "A bouldering wall covered in colorful holds above a blue crash mat.",
        caption: "A bouldering wall",
        credit: {
          author: "Bondarev.gal",
          license: "CC BY 4.0",
          href: "https://commons.wikimedia.org/wiki/File:Luch_Bouldering_Gym_SpB.jpg",
        },
      },
    },
    {
      name: "Walks and conventions",
      detail: "Walking, and going to conventions.",
      photo: {
        placeholder: false,
        src: "/about/gdc.jpg",
        width: 810,
        height: 810,
        alt: "Giant red GDC letters between red brackets in a convention center lobby.",
        caption: "GDC, the Game Developers Conference",
      },
    },
    {
      name: "Games and PCs",
      detail: "Gaming, and building PCs. The tower on this desk is modeled on mine.",
      photo: {
        placeholder: false,
        src: "/about/my-pc.jpg",
        width: 900,
        height: 900,
        alt: "Inside a white PC case lit blue: a ZOTAC GeForce RTX card, a Thermaltake liquid cooler, RGB memory and three blue fans.",
        caption: "My PC, the one on this desk",
      },
    },
  ],
  placeholder: false,
};
