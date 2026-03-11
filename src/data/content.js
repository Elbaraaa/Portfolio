export const personal = {
  name: "Elbaraa Abdalla",
  subTagline: "CS @ University of Arizona · Full-Stack · AI · Research",
  bio: "I build systems that matter. Whether it's a RAG-powered academic assistant, an automated site auditing pipeline, or a web experience that teaches 500 students at once — I care about the craft and the impact.\n\nCurrently a Web Developer at UA's Research, Innovation & Impact office and an undergrad TA mentoring CS students through their hardest classes.",
  email: "baraa@email.arizona.edu",
  github: "https://github.com/baraaabdalla",
  linkedin: "https://linkedin.com/in/baraaabdalla",
  location: "Tucson, AZ",
};

export const stats = [
  { label: "Projects Shipped", value: "12+" },
  { label: "Students Mentored", value: "500+" },
  { label: "Hackathons", value: "4" },
  { label: "Research Papers", value: "2" },
];

export const experience = [
  { id: "e1", role: "Web Developer", orgShort: "UA RII", period: "Jan 2024 — Present", status: "active", description: "Architecting and maintaining public-facing web systems for UA's research office. Built an automated link-audit pipeline that reduced broken-link incidents by 80%. Developed interactive SVG-based data visualizations for faculty research dashboards.", tags: ["Next.js", "TypeScript", "Python", "Web Automation"] },
  { id: "e2", role: "Undergraduate Teaching Assistant", orgShort: "UA CS Dept", period: "Aug 2023 — Present", status: "active", description: "CS Mentor for foundational programming and data structures courses. Designed supplemental problem sets, held weekly office hours for 100+ students, and improved pass rates by 15% through structured review sessions.", tags: ["Python", "C++", "Data Structures", "Pedagogy"] },
  { id: "e3", role: "Hackathon Lead Engineer", orgShort: "HackArizona / WildHacks", period: "2022 — 2024", status: "complete", description: "Led cross-functional teams of 3–4 engineers, shipping full-stack prototypes in 24–48 hours. Won Best Use of AI (HackArizona '23) and Most Innovative Hack (WildHacks '24).", tags: ["Full-stack", "AI/ML", "Team Leadership", "Rapid Prototyping"] },
];

export const projects = [
  { id: "p1", title: "Wildcat Helper", subtitle: "UA DegreePlan Copilot", category: "AI · Full-Stack", status: "shipped", description: "A RAG-powered academic assistant that ingests UA degree requirements, course catalogs, and advisor FAQs to answer student questions with source-grounded accuracy.", longDescription: "Built on a vector-search backend (FAISS + LangChain), the system processes 300+ pages of UA academic documentation into a queryable knowledge graph. The front end provides a conversational interface with citation cards linking back to official sources.", tech: ["Next.js", "Python", "LangChain", "FAISS", "OpenAI API", "FastAPI"], metrics: ["300+ docs indexed", "< 2s response", "92% accuracy"], accent: "#7C6FFF" },
  { id: "p2", title: "UA LinkAuditBot", subtitle: "Automated Site Integrity System", category: "DevOps · Automation", status: "shipped", description: "An intelligent web crawler that audits UA's research office websites for broken links, missing metadata, and accessibility violations — then generates structured reports.", longDescription: "Engineered a concurrent Python crawler using asyncio and aiohttp scanning 10,000+ pages/hour. Outputs actionable JSON reports consumed by a React dashboard, with GitHub Actions integration for weekly automated audits.", tech: ["Python", "asyncio", "Playwright", "React", "GitHub Actions", "PostgreSQL"], metrics: ["10K pages/hr", "80% error reduction", "Weekly auto-runs"], accent: "#4AFFC4" },
  { id: "p3", title: "SVG Campus Map", subtitle: "UA Research Visualization", category: "Data Viz · Frontend", status: "shipped", description: "A dynamic, filterable SVG map of UA's research facilities visualizing department relationships, active grants, and interdisciplinary connections.", longDescription: "Built with D3.js and React, the map supports real-time filtering by department, funding source, and research area. Animated force-directed graph overlays show collaboration networks. Used in 20+ donor presentations.", tech: ["React", "D3.js", "SVG", "TypeScript", "REST API"], metrics: ["20+ presentations", "5 depts onboarded", "Real-time data"], accent: "#F97FFF" },
  { id: "p4", title: "DocuMind RAG", subtitle: "Enterprise Document Intelligence", category: "AI · Backend", status: "in-progress", description: "A production-grade retrieval-augmented generation system for large document corpora. Multi-tenant deployments, document versioning, hybrid BM25 + semantic search.", longDescription: "Handles enterprise-scale document ingestion (PDFs, DOCX, HTML) with automatic chunking strategies based on document type. Implements re-ranking via cross-encoders for precision retrieval.", tech: ["Python", "FastAPI", "Weaviate", "LangChain", "Docker", "Redis"], metrics: ["Multi-tenant", "Hybrid search", "< 500ms p95"], accent: "#FFB347" },
];

export const skillCategories = [
  { category: "Languages", accent: "#7C6FFF", items: [{ name: "Python", level: 92 }, { name: "TypeScript", level: 90 }, { name: "SQL", level: 80 }, { name: "C++", level: 75 }, { name: "Bash", level: 70 }] },
  { category: "Frontend", accent: "#F97FFF", items: [{ name: "React / Next.js", level: 92 }, { name: "Tailwind CSS", level: 90 }, { name: "Framer Motion", level: 80 }, { name: "D3.js / SVG", level: 78 }, { name: "WebGL", level: 55 }] },
  { category: "Backend & Infra", accent: "#4AFFC4", items: [{ name: "FastAPI / Flask", level: 85 }, { name: "PostgreSQL", level: 78 }, { name: "GitHub Actions", level: 80 }, { name: "Docker", level: 72 }, { name: "Redis", level: 65 }] },
  { category: "AI & ML", accent: "#FFB347", items: [{ name: "OpenAI API", level: 90 }, { name: "LangChain / RAG", level: 85 }, { name: "Prompt Engineering", level: 88 }, { name: "FAISS / Weaviate", level: 75 }, { name: "Hugging Face", level: 68 }] },
];

export const achievements = [
  { icon: "🏆", title: "Best Use of AI", event: "HackArizona 2023", desc: "Real-time accessibility scanner with AI-powered remediation suggestions." },
  { icon: "⚡", title: "Most Innovative Hack", event: "WildHacks 2024", desc: "Multi-agent research assistant deployed within 36 hours." },
  { icon: "📐", title: "Dean's List", event: "UA 2023–2024", desc: "3.9 GPA while working 20hrs/week across two campus roles." },
  { icon: "📄", title: "Research Contributor", event: "UA RII, 2024", desc: "Co-authored technical report on web accessibility automation." },
];

export const SECTION_COMMENTS = {
  hero: ["Welcome to my space station 🚀", "Scroll down — adventure awaits!", "Type 'elbaraa' for a secret terminal..."],
  about: ["That's me in a nutshell!", "3.9 GPA and still human, I promise.", "I really do love teaching."],
  projects: ["This is where the fun stuff lives!", "Hover cards for more details.", "Wildcat Helper is my baby 🤖"],
  experience: ["Real work, real impact.", "80% fewer broken links? You're welcome UA.", "I love mentoring students."],
  skills: ["Python is my go-to, always.", "Still learning WebGL... we all have gaps.", "Hold the cube to reveal skills!"],
  achievements: ["Hackathon wins hit different at 3am.", "Dean's List while working two jobs!", "I thrive under pressure ⚡"],
  arcade: ["Try to beat my 2048 score!", "Snake is harder than it looks 🐍", "Take a break — you deserve it!"],
  guestbook: ["Leave your mark before you go!", "I read every single one.", "Be creative with your signature ✍️"],
  hire: ["Let's build something amazing!", "Summer 2026 — I'm ready.", "My inbox is always open 📬"],
  contact: ["Don't be a stranger!", "Ping me anytime.", "Let's make something real together."],
};

export const SECTIONS = ["hero", "about", "projects", "experience", "skills", "achievements", "arcade", "guestbook", "hire", "contact"];
