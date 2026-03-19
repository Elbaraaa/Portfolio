export const personal = {
  name: "Elbaraa Abdalla",
  subTagline: "CS @ University of Arizona · Full-Stack · Systems · AI",
  bio: "I build software that solves real problems — whether that's an AI-powered academic planning platform, a crawler that audits thousands of university pages, or production-facing web systems for the University of Arizona.\n\nCurrently, I'm an IT Web Analyst with UITS, a Web Developer with the Office of Research and Partnerships, and an undergraduate teaching assistant supporting object-oriented programming course.",
  email: "elbaraaa@arizona.edu",
  github: "https://github.com/Elbaraaa",
  linkedin: "https://www.linkedin.com/in/elbaraa-abdalla-a0746728a/",
  location: "Tucson, AZ",
};

export const stats = [
  { label: "Students Mentored", value: "200+" },
  { label: "Pages Link-Audited", value: "4,000+" },
  { label: "University Pages Updated", value: "500+" },
  { label: "Project Showcase Audience", value: "150+" },
];

const experienceUnsorted = [
  {
    id: "e1",
    role: "IT Web Analyst",
    orgShort: "UA UITS",
    period: "Jul 2025 — Present",
    startDate: "2025-07-01",
    endDate: null,
    sortDate: "2025-07-01",
    status: "active",
    description:
      "Reviewed and remediated 500+ university web pages migrated from Drupal and WordPress, improving accessibility compliance and aligning content with University of Arizona web standards.",
    tags: ["Accessibility", "Drupal", "WordPress", "Content QA"],
  },
  {
    id: "e2",
    role: "Web Developer",
    orgShort: "UA ORP",
    period: "May 2024 — Present",
    startDate: "2024-05-01",
    endDate: null,
    sortDate: "2024-05-01",
    status: "active",
    description:
      "Built automation and web tooling for University of Arizona research sites, including a Bash deployment script that cut deployment time by 85%, Drupal backend modules and APIs, and a crawler that audited 4,000+ pages for broken links.",
    tags: ["JavaScript", "Drupal", "Bash", "APIs", "Web Automation"],
  },
  {
    id: "e3",
    role: "Undergraduate Teaching Assistant",
    orgShort: "UA CS Dept",
    period: "Aug 2024 — Dec 2024, Jan 2026 — Present",
    startDate: "2024-08-01",
    endDate: null,
    sortDate: "2026-01-01",
    status: "active",
    description:
      "Mentored 100+ students in CSC 210 (Software Development) and CSC 335 (Object-Oriented Programming and Design) through office hours, debugging support, and assignment feedback focused on Java, object-oriented design, and data structures.",
    tags: ["Java", "OOP", "Data Structures", "Teaching"],
  },
  {
    id: "e4",
    role: "Undergraduate Research Assistant",
    orgShort: "UA VIP",
    period: "Jan 2024 — May 2024",
    startDate: "2024-01-01",
    endDate: "2024-05-31",
    sortDate: "2024-01-01",
    status: "complete",
    description:
      "Collaborated on SafeDrive-AI, a real-time distracted driving detection project using deep learning, and presented the team’s work to 150+ attendees at IShowCase.",
    tags: ["Python", "Deep Learning", "Research", "Transportation Safety"],
  },
  {
    id: "e5",
    role: "Academic Expert Tutor",
    orgShort: "UA SALT Center",
    period: "Sep 2023 — Present",
    startDate: "2023-09-01",
    endDate: null,
    status: "active",
    description:
      "Delivered 200+ hours of one-on-one academic tutoring for students with learning and attention challenges, advanced to Level 3 expert tutor status, and trained 50+ tutors while supporting student success through stronger study strategies, time management, and confidence in technical coursework.",
    tags: ["Tutoring", "Mentorship", "Training", "Student Success", "Leadership"],
  },
  {
    id: "e6",
    role: "Lead CS Buddy Mentor",
    orgShort: "UA CS Buddy Program",
    period: "Aug 2024 — Present",
    startDate: "2024-08-01",
    endDate: null,
    sortDate: "2024-08-01",
    status: "active",
    description:
      "Mentor students in computer science by sharing guidance on coursework, projects, internships, and career growth, while helping build a stronger community within the department.",
    tags: ["Leadership", "Mentorship", "Community", "Career Development"],
  },
  {
    id: "e7",
    role: "Google Software Engineering Program Mentee",
    orgShort: "Basta GSWEP",
    period: "Mar 2025 — May 2025",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    sortDate: "2025-12-01",
    status: "complete",
    description:
      "Participated in Basta’s Google Software Engineering mentorship program, receiving mentorship from a Google software engineer and learning from real-world guidance on technical development, career growth, and software engineering expectations.",
    tags: ["Mentorship", "Software Engineering", "Professional Development", "Google"],
  }
];

export const experience = [...experienceUnsorted].sort((a, b) => {
  const aActive = a.status === "active" ? 1 : 0;
  const bActive = b.status === "active" ? 1 : 0;

  if (aActive !== bActive) {
    return bActive - aActive; // active roles first
  }

  return new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime(); // then newest first
});

export const projects = [
  {
    id: "p1",
    title: "MajorLyte",
    subtitle: "AI Academic Planning Platform",
    category: "AI · Product",
    status: "in-progress",
    description:
      "An AI-powered academic planning platform that helps students navigate degree requirements, explore course pathways, and make more informed academic decisions.",
    longDescription:
      "Originally built at Hack Arizona, MajorLyte won First Place and Best Use of Gemini API. I’m continuing development beyond the hackathon by refining the product experience, expanding functionality, and moving it toward real-world use.",
    tech: ["Gemini API", "AI Planning", "Product Development", "Full-Stack"],
    metrics: ["First Place", "Best Use of Gemini API", "Ongoing development"],
    accent: "#7C6FFF",
  },
  {
    id: "p2",
    title: "UA Link Audit Crawler",
    subtitle: "Website Integrity Automation",
    category: "Automation · Web Engineering",
    status: "shipped",
    description:
      "A crawler that audits thousands of university web pages for broken links and helps prioritize site cleanup at scale.",
    longDescription:
      "Built to support university website maintenance, this tool scanned 4,000+ pages for broken links and surfaced issues for remediation, helping improve content reliability across public-facing sites.",
    tech: ["Web Crawling", "Automation", "Site QA", "Link Auditing"],
    metrics: ["4,000+ pages scanned", "Broken links flagged", "Large-scale cleanup support"],
    accent: "#4AFFC4",
  },
  {
    id: "p3",
    title: "TCP Client-Server Messaging System",
    subtitle: "Socket-Based Communication Project",
    category: "Systems · Networking",
    status: "shipped",
    description:
      "A messaging system in C that uses TCP sockets and a custom protocol to transmit message lengths and payloads reliably between clients and servers.",
    longDescription:
      "Built with low-level socket programming in C, the system handles connection setup, payload framing, parsing, buffer management, and error handling for real-time client-server communication.",
    tech: ["C", "TCP Sockets", "Client-Server", "Systems Programming"],
    metrics: ["Custom protocol", "Real-time messaging", "Robust error handling"],
    accent: "#F97FFF",
  },
  {
    id: "p4",
    title: "Full-Stack Online Bookstore",
    subtitle: "Web Application",
    category: "Full-Stack · Web",
    status: "shipped",
    description:
      "A full-stack bookstore application with dynamic book rendering, authentication flows, and persistent shopping cart functionality.",
    longDescription:
      "Built using JavaScript, HTML, CSS, and RESTful server routes, the application includes session handling with localStorage, cart synchronization, and login-gated actions to support a smooth user experience.",
    tech: ["JavaScript", "HTML", "CSS", "REST APIs", "localStorage"],
    metrics: ["Persistent cart", "Authentication flows", "Dynamic rendering"],
    accent: "#FFB347",
  },
  // {
  //   title: "Interactive Weather Query System",
  //   accent: "#7C6FFF",
  //   description:
  //     "Interactive Java application that connects to an Oracle database using JDBC to run multi-year weather analysis queries across historical datasets.",
  //   stack: ["Java", "JDBC", "Oracle SQL", "SQL"],
  //   bullets: [
  //     "Built a query-driven CLI for average temperatures, precipitation rankings, temperature-difference analysis, and threshold-based filtering.",
  //     "Implemented complex SQL across 2012, 2016, 2020, and 2024 datasets using UNION ALL, parameterized conditions, and dynamic thresholds.",
  //     "Designed formatted tabular output with real-time user input and dataset selection."
  //   ]
  // },

  // {
  //   title: "TCP Client–Server Messaging System",
  //   accent: "#4AFFC4",
  //   description:
  //     "Low-level client-server messaging system in C using TCP sockets and a custom protocol for reliable message exchange.",
  //   stack: ["C", "TCP Sockets", "Networking", "Systems Programming"],
  //   bullets: [
  //     "Built both client and server programs for transmitting message lengths and payloads over TCP.",
  //     "Implemented payload parsing, connection handling, network byte-order conversion, and buffer management.",
  //     "Added robust input validation and error checking for stable real-time communication."
  //   ]
  // },

  // {
  //   title: "Binary Search Tree in MIPS Assembly",
  //   accent: "#F97FFF",
  //   description:
  //     "MIPS assembly implementation of binary search tree operations with direct memory management and pointer-level logic.",
  //   stack: ["MIPS Assembly", "Mars Simulator", "Data Structures", "Low-Level Programming"],
  //   bullets: [
  //     "Programmed BST initialization, traversal, insertion, and deletion in MIPS assembly.",
  //     "Applied low-level memory allocation, pointer arithmetic, and memory management concepts.",
  //     "Translated high-level data structure logic into efficient assembly instructions."
  //   ]
  // },

  // {
  //   title: "2048 Game – JavaFX Application",
  //   accent: "#63D1FF",
  //   description:
  //     "Interactive JavaFX implementation of 2048 using object-oriented design and event-driven programming.",
  //   stack: ["Java", "JavaFX", "OOP", "Git"],
  //   bullets: [
  //     "Implemented real-time tile movement, merging logic, score updates, and game-state management.",
  //     "Used object-oriented design and efficient data structures to support gameplay behavior.",
  //     "Collaborated in an Agile workflow with Git-based version control for iterative development."
  //   ]
  // },

  // {
  //   title: "Java-Based Personal Library System",
  //   accent: "#8BE28B",
  //   description:
  //     "Java application for managing a personal library with search, add, and retrieval functionality built around object-oriented design principles.",
  //   stack: ["Java", "OOP", "File Handling", "Testing"],
  //   bullets: [
  //     "Collaborated with a partner to build a personal library management system in Java.",
  //     "Applied encapsulation and abstraction to implement searching, adding books, and retrieving lists.",
  //     "Performed extensive debugging and testing to ensure correct file handling and input validation."
  //   ]
  // },

  // {
  //   title: "Extendible Hashing Index for Binary Databases",
  //   accent: "#FFD166",
  //   description:
  //     "Dynamic extendible hashing index in Java for fast suffix-based lookups over binary landfill records.",
  //   stack: ["Java", "RandomAccessFile", "Hashing", "Binary Files"],
  //   bullets: [
  //     "Implemented bucket splitting, directory doubling, and custom hash functions for dynamic indexing.",
  //     "Built fixed-width bucket serialization with padded ASCII fields and efficient RandomAccessFile access.",
  //     "Developed a search engine that scans hashed buckets, reconstructs records on demand, and returns matching offsets."
  //   ]
  // },

  // {
  //   title: "Landfill Data Binary Serialization & Search Engine",
  //   accent: "#FF8A8A",
  //   description:
  //     "Java system for converting structured landfill CSV data into fixed-width binary files and querying records efficiently.",
  //   stack: ["Java", "CSV Parsing", "RandomAccessFile", "Binary Serialization"],
  //   bullets: [
  //     "Converted structured landfill datasets from CSV into fixed-width binary storage for efficient retrieval.",
  //     "Designed a custom binary serialization format using padded ASCII fields, binary primitives, and appended schema metadata.",
  //     "Built a companion program for parsing the binary file, extracting middle records, recent-closure analysis, and ternary-search lookups."
  //   ]
  // },

  // {
  //   title: "Single-Cycle CPU",
  //   accent: "#A79DFF",
  //   description:
  //     "Single-cycle CPU implementation focused on MIPS instruction decoding, execution, and control-logic validation.",
  //   stack: ["C", "Computer Architecture", "MIPS", "Systems"],
  //   bullets: [
  //     "Implemented MIPS instruction decoding and execution, including support for custom instructions.",
  //     "Designed control logic for ALU operations, memory access, and branching behavior.",
  //     "Ran system-level tests to validate correctness across instruction and memory workflows."
  //   ]
  // },

  // {
  //   title: "Java Data Structures Library with Memory Pooling",
  //   accent: "#4ECDC4",
  //   description:
  //     "Custom Java data structures library with a doubly linked list allocator that reuses node blocks for efficient dynamic allocation.",
  //   stack: ["Java", "Data Structures", "Memory Management", "OOP"],
  //   bullets: [
  //     "Engineered a doubly linked list implementation with internal memory pooling for low-overhead allocation.",
  //     "Designed a unified interface supporting stacks, queues, and deques through safe handle-based operations.",
  //     "Implemented in-place reversal, destructive concatenation, O(1) clearing, and structural list manipulation without unnecessary garbage creation."
  //   ]
  // }
];

export const skillCategories = [
  {
    category: "Languages",
    accent: "#7C6FFF",
    items: [
      { name: "Java", level: 90 },
      { name: "Python", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "C/C++", level: 80 },
      { name: "SQL", level: 78 },
    ],
  },
  {
    category: "Web / Backend",
    accent: "#F97FFF",
    items: [
      { name: "React.js", level: 82 },
      { name: "Node.js", level: 75 },
      { name: "Drupal", level: 85 },
      { name: "WordPress", level: 78 },
      { name: "REST APIs", level: 80 },
      { name: "HTML/CSS", level: 90 },
    ],
  },
  {
    category: "Systems / Tools",
    accent: "#4AFFC4",
    items: [
      { name: "Linux/Unix", level: 82 },
      { name: "Git", level: 88 },
      { name: "Bash", level: 78 },
      { name: "PostgreSQL", level: 72 },
      { name: "Oracle SQL", level: 75 },
      { name: "Web Automation", level: 82 },
    ],
  },
  {
    category: "AI / Workflow",
    accent: "#FFB347",
    items: [
      { name: "Gemini API", level: 82 },
      { name: "ChatGPT", level: 90 },
      { name: "GitHub Copilot", level: 88 },
      { name: "Claude", level: 84 },
      { name: "AI Prototyping", level: 88 },
      { name: "Accessibility", level: 84 },
    ],
  },
];

export const achievements = [
  {
    icon: "🏆",
    title: "First Place",
    event: "Hack Arizona",
    desc: "Won first place for MajorLyte, an AI-powered academic planning platform.",
  },
  {
    icon: "✨",
    title: "Best Use of Gemini API",
    event: "Hack Arizona",
    desc: "Recognized for using Gemini API to build a high-impact academic planning solution.",
  },
  {
    icon: "🎓",
    title: "Teaching Impact",
    event: "UA CS Department",
    desc: "Mentored 100+ students across Software Development and Object-Oriented Programming courses.",
  },
  {
    icon: "🔎",
    title: "Web Reliability at Scale",
    event: "UA ORP",
    desc: "Built a crawler that audited 4,000+ pages for broken links to support large-scale site cleanup.",
  },
];

export const SECTION_COMMENTS = {
  hero: [
    "Builder, mentor, and hacker at heart.",
    "Software that solves real problems matters to me.",
    "You’re about to see the best of what I’ve built.",
  ],
  about: [
    "I like building useful things, not just flashy ones.",
    "Teaching and engineering both matter to me.",
    "I care a lot about craft, clarity, and real impact.",
  ],
  projects: [
    "These are the projects I’m proudest of.",
    "MajorLyte is the one I’m pushing furthest.",
    "I like building across AI, systems, and web.",
  ],
  experience: [
    "Real work, real users, real constraints.",
    "A lot of my best growth came from shipping in production.",
    "I like being useful on teams.",
  ],
  skills: [
    "Strongest where software meets real problem-solving.",
    "Still learning, always building.",
    "I’d rather show range than pretend perfection.",
  ],
  achievements: [
    "The wins matter, but the work behind them matters more.",
    "Hackathons taught me how fast I can build under pressure.",
    "I take pride in things that are both technical and useful.",
  ],
  arcade: [
    "Take a break — then get back to building.",
    "A portfolio should have some personality.",
    "Yes, I like making things fun too.",
  ],
  guestbook: [
    "Leave your mark before you go.",
    "I read every message.",
    "Appreciate you stopping by.",
  ],
  hire: [
    "I’m looking for work where I can build and grow fast.",
    "Open to software engineering opportunities.",
    "Let’s build something real.",
  ],
  contact: [
    "Let’s connect.",
    "Happy to talk projects, internships, or opportunities.",
    "My inbox is open.",
  ],
};

export const SECTIONS = [
  "hero",
  "about",
  "projects",
  "experience",
  "skills",
  "achievements",
  "arcade",
  "guestbook",
  "hire",
  "contact",
];