var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// packages/core/src/keywords.ts
var SKILL_CATEGORIES_MAP = {
  languages: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Go",
    "Golang",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "Scala",
    "R",
    "MATLAB",
    "SQL",
    "HTML",
    "CSS",
    "Sass",
    "SCSS",
    "Bash",
    "Shell",
    "PowerShell",
    "Perl",
    "Dart",
    "Elixir",
    "Haskell",
    "C",
    "Assembly",
    "Solidity"
  ],
  frameworks: [
    "React",
    "React.js",
    "Next.js",
    "Vue",
    "Vue.js",
    "Nuxt",
    "Nuxt.js",
    "Angular",
    "AngularJS",
    "Svelte",
    "SvelteKit",
    "Node.js",
    "Express",
    "Express.js",
    "NestJS",
    "FastAPI",
    "Flask",
    "Django",
    "Spring",
    "Spring Boot",
    "ASP.NET",
    ".NET Core",
    "Laravel",
    "Ruby on Rails",
    "Rails",
    "Tailwind CSS",
    "Tailwind",
    "Bootstrap",
    "GraphQL",
    "Redux",
    "Zustand",
    "Prisma",
    "Hibernate",
    "PyTorch",
    "TensorFlow",
    "Keras",
    "Scikit-Learn",
    "Pandas",
    "NumPy",
    "jQuery",
    "Electron",
    "React Native",
    "Flutter",
    "Capacitor",
    "gRPC"
  ],
  databases: [
    "PostgreSQL",
    "Postgres",
    "MySQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "Oracle",
    "Microsoft SQL Server",
    "MSSQL",
    "Cassandra",
    "DynamoDB",
    "Elasticsearch",
    "Neo4j",
    "Couchbase",
    "Firebase",
    "Supabase",
    "MariaDB",
    "Snowflake",
    "BigQuery",
    "Redshift",
    "ClickHouse",
    "Vector DB",
    "Pinecone",
    "Milvus",
    "Chroma"
  ],
  cloud: [
    "AWS",
    "Amazon Web Services",
    "Azure",
    "Microsoft Azure",
    "Google Cloud Platform",
    "GCP",
    "Google Cloud",
    "Cloudflare",
    "Vercel",
    "Netlify",
    "Heroku",
    "DigitalOcean",
    "OpenStack",
    "Serverless",
    "Lambda",
    "EC2",
    "S3",
    "CloudFront",
    "ECS",
    "EKS",
    "Cloud Run",
    "App Engine",
    "Azure Functions",
    "IAM"
  ],
  devops: [
    "Docker",
    "Kubernetes",
    "K8s",
    "Kafka",
    "Apache Kafka",
    "RabbitMQ",
    "Terraform",
    "Ansible",
    "Jenkins",
    "GitHub Actions",
    "GitLab CI",
    "CircleCI",
    "CI/CD",
    "Helm",
    "ArgoCD",
    "Prometheus",
    "Grafana",
    "Datadog",
    "Splunk",
    "ELK Stack",
    "Nginx",
    "Apache",
    "Linux",
    "Ubuntu",
    "Debian",
    "CentOS",
    "OpenTelemetry",
    "Vault",
    "Puppet",
    "Chef"
  ],
  ai_ml: [
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "NLP",
    "Computer Vision",
    "LLM",
    "Large Language Models",
    "Generative AI",
    "GenAI",
    "Transformers",
    "Hugging Face",
    "LangChain",
    "LlamaIndex",
    "RAG",
    "Prompt Engineering",
    "Reinforcement Learning",
    "MLOps",
    "Vector Embeddings",
    "Fine-tuning",
    "LoRA",
    "OpenAI API",
    "Claude API",
    "BERT",
    "GPT"
  ],
  testing: [
    "Jest",
    "Cypress",
    "Playwright",
    "Vitest",
    "Mocha",
    "Chai",
    "Selenium",
    "JUnit",
    "TestNG",
    "PyTest",
    "Postman",
    "Unit Testing",
    "Integration Testing",
    "E2E Testing",
    "TDD",
    "BDD",
    "Load Testing",
    "JMeter",
    "Storybook",
    "K6"
  ],
  security: [
    "OAuth",
    "OAuth2",
    "JWT",
    "SAML",
    "SSO",
    "Penetration Testing",
    "OWASP",
    "Cryptography",
    "HTTPS",
    "TLS",
    "SSL",
    "SOC2",
    "GDPR",
    "HIPAA",
    "ISO 27001",
    "Vulnerability Assessment",
    "Zero Trust",
    "RBAC",
    "WAF",
    "DevSecOps",
    "SIEM"
  ],
  tools: [
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Jira",
    "Confluence",
    "Figma",
    "Tableau",
    "Power BI",
    "Postman",
    "Swagger",
    "OpenAPI",
    "VS Code",
    "Webpack",
    "Vite",
    "Babel",
    "TurboRepo",
    "npm",
    "yarn",
    "pnpm",
    "Notion",
    "Slack",
    "Linear",
    "Trello"
  ],
  soft_skills: [
    "Leadership",
    "Team Leadership",
    "Mentorship",
    "Code Reviews",
    "Agile",
    "Scrum",
    "Kanban",
    "Cross-Functional Collaboration",
    "Communication",
    "Problem Solving",
    "Critical Thinking",
    "Project Management",
    "Stakeholder Management",
    "Technical Writing",
    "System Design",
    "Architecture",
    "Strategy"
  ],
  domain_knowledge: [
    "Data Analysis",
    "Data Analytics",
    "Statistics",
    "Financial Modeling",
    "Financial Reporting",
    "Budgeting",
    "GAAP",
    "Bookkeeping",
    "Accounts Payable",
    "Risk Assessment",
    "Auditing",
    "Procurement",
    "Market Research",
    "Content Marketing",
    "Campaign Management",
    "Social Media Marketing",
    "Copywriting",
    "Patient Care",
    "Clinical Documentation",
    "Infection Control",
    "Vital Signs",
    "Care Coordination",
    "Mechanical Design",
    "CAD",
    "AutoCAD",
    "SolidWorks",
    "FinTech",
    "HealthTech",
    "E-Commerce",
    "SaaS",
    "B2B",
    "B2C",
    "Distributed Systems",
    "Microservices",
    "Event-Driven Architecture",
    "High Availability",
    "Fault Tolerance",
    "Payment Gateways",
    "Stripe Integration",
    "Real-Time Systems",
    "WebSockets",
    "SEO",
    "Accessibility",
    "WCAG",
    "Mobile Optimization"
  ]
};
var SKILL_ALIASES = {
  "js": "JavaScript",
  "javascript": "JavaScript",
  "ts": "TypeScript",
  "typescript": "TypeScript",
  "py": "Python",
  "python": "Python",
  "golang": "Go",
  "go": "Go",
  "react.js": "React",
  "reactjs": "React",
  "react": "React",
  "next.js": "Next.js",
  "nextjs": "Next.js",
  "next": "Next.js",
  "vue.js": "Vue",
  "vuejs": "Vue",
  "vue": "Vue",
  "node.js": "Node.js",
  "nodejs": "Node.js",
  "node": "Node.js",
  "express.js": "Express",
  "expressjs": "Express",
  "express": "Express",
  "postgres": "PostgreSQL",
  "postgresql": "PostgreSQL",
  "mongo": "MongoDB",
  "mongodb": "MongoDB",
  "aws": "AWS",
  "amazon web services": "AWS",
  "gcp": "Google Cloud Platform",
  "google cloud": "Google Cloud Platform",
  "google cloud platform": "Google Cloud Platform",
  "azure": "Microsoft Azure",
  "ms azure": "Microsoft Azure",
  "k8s": "Kubernetes",
  "kubernetes": "Kubernetes",
  "ci/cd": "CI/CD",
  "cicd": "CI/CD",
  "continuous integration": "CI/CD",
  "github actions": "GitHub Actions",
  "gh actions": "GitHub Actions",
  "tailwind": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "genai": "Generative AI",
  "generative ai": "Generative AI",
  "llms": "Large Language Models",
  "llm": "Large Language Models",
  "nlp": "Natural Language Processing",
  "rag": "RAG",
  "retrieval augmented generation": "RAG",
  "ml": "Machine Learning",
  "machine learning": "Machine Learning",
  "ai": "AI / Machine Learning",
  "tdd": "Test-Driven Development",
  "test driven development": "Test-Driven Development",
  "rest": "REST APIs",
  "restful": "REST APIs",
  "rest apis": "REST APIs",
  "rest api": "REST APIs",
  "graphql": "GraphQL",
  "microservices": "Microservices",
  "relational database": "Relational Databases (SQL)",
  "relational databases": "Relational Databases (SQL)",
  "rdbms": "Relational Databases (SQL)",
  "nosql": "NoSQL Databases"
};
var TAXONOMY_RELATIONSHIPS = [
  {
    specific: ["FastAPI", "Flask", "Django", "Pandas", "NumPy", "PyTorch"],
    generalOrEcosystem: "Python",
    relationship: "is a framework/library in the Python ecosystem",
    partialConfidence: 0.85
  },
  {
    specific: ["React", "Next.js", "Vue", "Angular", "Node.js", "Express"],
    generalOrEcosystem: "JavaScript",
    relationship: "is built on the JavaScript/TypeScript runtime",
    partialConfidence: 0.9
  },
  {
    specific: ["PostgreSQL", "MySQL", "MSSQL", "Oracle", "MariaDB", "SQLite"],
    generalOrEcosystem: "Relational Databases (SQL)",
    relationship: "is a relational SQL database engine",
    partialConfidence: 0.88
  },
  {
    specific: ["PostgreSQL", "MySQL", "MSSQL", "Oracle", "SQLite"],
    generalOrEcosystem: "SQL",
    relationship: "utilizes the SQL query language",
    partialConfidence: 0.92
  },
  {
    specific: ["MongoDB", "DynamoDB", "Cassandra", "Couchbase", "Redis"],
    generalOrEcosystem: "NoSQL Databases",
    relationship: "is a non-relational NoSQL database system",
    partialConfidence: 0.88
  },
  {
    specific: ["Docker", "Podman", "Containerd"],
    generalOrEcosystem: "Containerization",
    relationship: "provides container packaging and runtime",
    partialConfidence: 0.9
  },
  {
    specific: ["Kubernetes", "Helm", "ArgoCD"],
    generalOrEcosystem: "Container Orchestration",
    relationship: "manages container scheduling and orchestration",
    partialConfidence: 0.9
  },
  {
    specific: ["AWS", "GCP", "Azure"],
    generalOrEcosystem: "Cloud Computing",
    relationship: "is a major public cloud infrastructure provider",
    partialConfidence: 0.85
  },
  {
    specific: ["FastAPI", "Express", "NestJS", "Spring Boot", "Django", "Rails", "ASP.NET"],
    generalOrEcosystem: "REST APIs",
    relationship: "is commonly used for architecting backend REST API services",
    partialConfidence: 0.8
  },
  {
    specific: ["Jest", "Vitest", "PyTest", "JUnit", "Mocha", "Chai"],
    generalOrEcosystem: "Unit Testing",
    relationship: "is an automated unit test framework",
    partialConfidence: 0.85
  }
];
var ACTION_VERBS = [
  "accelerated",
  "achieved",
  "administered",
  "advised",
  "analyzed",
  "architected",
  "automated",
  "boosted",
  "budgeted",
  "built",
  "centralized",
  "championed",
  "collaborated",
  "conceptualized",
  "consolidated",
  "constructed",
  "converted",
  "coordinated",
  "created",
  "customized",
  "decreased",
  "delivered",
  "deployed",
  "designed",
  "developed",
  "devised",
  "directed",
  "distributed",
  "documented",
  "doubled",
  "drove",
  "eliminated",
  "enabled",
  "engineered",
  "enhanced",
  "established",
  "evaluated",
  "exceeded",
  "executed",
  "expanded",
  "expedited",
  "formulated",
  "fostered",
  "founded",
  "generated",
  "governed",
  "guided",
  "halted",
  "headed",
  "identified",
  "implemented",
  "improved",
  "improvised",
  "increased",
  "influenced",
  "initiated",
  "innovated",
  "inspected",
  "instituted",
  "instructed",
  "integrated",
  "invented",
  "launched",
  "led",
  "leveraged",
  "maintained",
  "managed",
  "maximized",
  "mentored",
  "migrated",
  "minimized",
  "modernized",
  "monitored",
  "motivated",
  "negotiated",
  "obtained",
  "operated",
  "optimized",
  "orchestrated",
  "organized",
  "originated",
  "outperformed",
  "overhauled",
  "oversaw",
  "partnered",
  "performed",
  "pioneered",
  "planned",
  "prepared",
  "presented",
  "produced",
  "programmed",
  "promoted",
  "published",
  "rebuilt",
  "recruited",
  "redesigned",
  "reduced",
  "refactored",
  "reorganized",
  "replaced",
  "resolved",
  "restructured",
  "revamped",
  "scaled",
  "scheduled",
  "secured",
  "simplified",
  "slashed",
  "solved",
  "spearheaded",
  "standardized",
  "streamlined",
  "strengthened",
  "structured",
  "surpassed",
  "synthesized",
  "targeted",
  "trained",
  "transformed",
  "transitioned",
  "translated",
  "tripled",
  "uncovered",
  "unified",
  "updated",
  "upgraded",
  "validated",
  "yielded"
];
var QUANTIFIABLE_PATTERNS = [
  /\b\d+(?:\.\d+)?%\b/i,
  /\$\s*\d+(?:[.,]\d+)*(?:\s*[kKmMbBtT]|\s*(?:thousand|million|billion))?\b/i,
  /\b\d+(?:[.,]\d+)*\s*(?:users?|customers?|clients?|subscribers?|accounts?|leads?|downloads?|views?|visitors?)\b/i,
  /\b\d+\s*[kKmMbBtT]\+?\s*(?:users?|customers?|clients?|requests?|events?|transactions?)\b/i,
  /\b(?:reduced|decreased|slashed|cut|improved|increased|boosted|saved|generated|delivered)\b/i,
  /\b(?:from|to)\s+\d+(?:\.\d+)?%?\s+(?:to|from)\s+\d+(?:\.\d+)?%?\b/i,
  /\b\d+x\b/i,
  /\b\d+\s*(?:ms|milliseconds?|seconds?|mins?|minutes?|hrs?|hours?|days?|weeks?|months?)\b/i,
  /\b\d+\s*(?:tb|gb|mb|terabytes?|gigabytes?|megabytes?)\b/i,
  /\bteam of \d+\b/i
];
var SECTION_HEADERS = [
  "experience",
  "work experience",
  "employment",
  "employment history",
  "work history",
  "professional experience",
  "career history",
  "selected engagements",
  "engagements",
  "education",
  "educational background",
  "academic background",
  "academic history",
  "qualifications",
  "academic credentials",
  "skills",
  "technical skills",
  "core competencies",
  "competencies",
  "key skills",
  "areas of expertise",
  "proficiencies",
  "technologies",
  "tech stack",
  "projects",
  "personal projects",
  "key projects",
  "notable projects",
  "selected projects",
  "open source projects",
  "portfolio",
  "certifications",
  "licenses and certifications",
  "certificates",
  "professional development",
  "credentials",
  "summary",
  "professional summary",
  "executive summary",
  "profile",
  "core profile",
  "about me",
  "career objective",
  "objective",
  "achievements",
  "key achievements",
  "awards",
  "honors",
  "awards and honors",
  "publications",
  "volunteer",
  "volunteer experience",
  "interests"
];
var WEAK_WORDS = [
  "responsible for",
  "duties included",
  "worked on",
  "helped with",
  "assisted in",
  "participated in",
  "handled",
  "was part of",
  "attempted to",
  "tried to",
  "involved in",
  "familiar with",
  "exposure to",
  "knowledge of",
  "various tasks",
  "day to day tasks",
  "stuff",
  "things"
];
function getSkillRegex(skill) {
  const norm = skill.trim();
  if (norm === "C" || norm.toLowerCase() === "c") {
    return /(?:^|[^a-zA-Z0-9+#])C(?![+#a-zA-Z0-9])/i;
  }
  if (norm === "C++" || norm.toLowerCase() === "c++") {
    return /(?:^|[^a-zA-Z0-9])C\+\+(?:$|[^a-zA-Z0-9])/i;
  }
  if (norm === "C#" || norm.toLowerCase() === "c#") {
    return /(?:^|[^a-zA-Z0-9])C#(?:$|[^a-zA-Z0-9])/i;
  }
  if (norm === "R" || norm.toLowerCase() === "r") {
    return /(?:^|[^a-zA-Z0-9])R(?![a-zA-Z0-9])(?:$|[^a-zA-Z0-9])/i;
  }
  if (norm === "Go" || norm.toLowerCase() === "go") {
    return /(?:^|[^a-zA-Z0-9])Go(?![a-zA-Z0-9])(?:$|[^a-zA-Z0-9])/i;
  }
  const escaped = norm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, "i");
}

// packages/core/src/parser/resume-parser.ts
function cleanLines(text) {
  return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}
function matchSectionHeader(line) {
  const normalized = line.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "").trim();
  if (/(?:summary|profile|objective)/i.test(normalized) && normalized.length < 40) {
    return { matched: true, type: "summary", title: line.trim() };
  }
  if (/(?:experience|employment|work\s+history)/i.test(normalized) && normalized.length < 50) {
    return { matched: true, type: "experience", title: line.trim() };
  }
  if (/(?:education|academic)/i.test(normalized) && normalized.length < 50) {
    return { matched: true, type: "education", title: line.trim() };
  }
  if (/(?:skills?|competenc|expertise|technologies|tech\s+stack)/i.test(normalized) && normalized.length < 45) {
    return { matched: true, type: "skills", title: line.trim() };
  }
  if (/projects?$/i.test(normalized) && normalized.length < 45) {
    return { matched: true, type: "projects", title: line.trim() };
  }
  if (/(?:certif|license|credential)/i.test(normalized) && normalized.length < 45) {
    return { matched: true, type: "certifications", title: line.trim() };
  }
  if (/(?:award|honor)/i.test(normalized) && normalized.length < 40) {
    return { matched: true, type: "awards", title: line.trim() };
  }
  if (/(?:publication)/i.test(normalized) && normalized.length < 40) {
    return { matched: true, type: "publications", title: line.trim() };
  }
  for (const header of SECTION_HEADERS) {
    if (normalized === header || normalized.startsWith(header + ":") || normalized.startsWith(header + " -") || normalized.startsWith(header + " |")) {
      let type = "other";
      if (/summary|profile|about|objective|core profile/i.test(header)) type = "summary";
      else if (/experience|employment|work history|career|selected engagements|engagements/i.test(header)) type = "experience";
      else if (/education|academic/i.test(header)) type = "education";
      else if (/skill|competenc|expertise|technologies|tech stack/i.test(header)) type = "skills";
      else if (/project/i.test(header)) type = "projects";
      else if (/certif|license|credential/i.test(header)) type = "certifications";
      else if (/award|honor/i.test(header)) type = "awards";
      else if (/publication/i.test(header)) type = "publications";
      return { matched: true, type, title: line.trim() };
    }
  }
  return { matched: false, type: "other", title: "" };
}
function extractStructuredLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+|linkedin\.com\/in\/[a-zA-Z0-9_\-]+|github\.com\/[a-zA-Z0-9_\-]+)/gi;
  const matches = text.match(urlRegex) || [];
  const unique = Array.from(new Set(matches.map((m) => m.trim())));
  const structured = [];
  let linkedin;
  let github;
  let portfolio;
  let website;
  for (const raw of unique) {
    const fullUrl = raw.startsWith("http") ? raw : "https://" + raw;
    if (/linkedin\.com/i.test(raw) && !linkedin) {
      linkedin = fullUrl;
      structured.push({ type: "linkedin", url: fullUrl, label: "LinkedIn" });
    } else if (/github\.com/i.test(raw) && !github) {
      github = fullUrl;
      structured.push({ type: "github", url: fullUrl, label: "GitHub" });
    } else if (/portfolio|vercel\.app|netlify\.app|github\.io/i.test(raw) && !portfolio) {
      portfolio = fullUrl;
      structured.push({ type: "portfolio", url: fullUrl, label: "Portfolio" });
    } else if (!website && !/linkedin|github/i.test(raw)) {
      website = fullUrl;
      structured.push({ type: "website", url: fullUrl, label: "Website" });
    } else {
      structured.push({ type: "other", url: fullUrl });
    }
  }
  return { links: unique, structured, linkedin, github, portfolio, website };
}
function extractName(text) {
  const lines = cleanLines(text);
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    if (/@|http|linkedin|github|\.com|\.io|resume|curriculum|curriculum vitae|cv/i.test(line)) continue;
    if (matchSectionHeader(line).matched) continue;
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 4 && /^[\p{L}\p{M}\s.'’-]+$/u.test(line) && line.length < 45) {
      const confidence = i === 0 ? 0.95 : i === 1 ? 0.88 : 0.75;
      return { name: line.trim(), confidence };
    }
  }
  return { name: "Candidate", confidence: 0.3 };
}
function extractLocation(text) {
  const lines = cleanLines(text).slice(0, 10);
  const locationRegex = /([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}|[A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+|\b(Remote|Hybrid|San Francisco|New York|Austin|Seattle|London|Berlin|Toronto|Bangalore|Singapore|Sydney|Dublin)\b)/i;
  for (const line of lines) {
    const parts = line.split(/[|•·\t;]/).map((p) => p.trim()).filter(Boolean);
    for (const part of parts.length > 1 ? parts : [line]) {
      if (/@|github|linkedin|\.com/i.test(part)) continue;
      const match = part.match(locationRegex);
      if (match) {
        return match[0].trim();
      }
    }
  }
  return void 0;
}
function extractCategorizedSkills(text) {
  const result = {
    languages: [],
    frameworks: [],
    databases: [],
    cloud: [],
    devops: [],
    ai_ml: [],
    testing: [],
    security: [],
    tools: [],
    soft_skills: [],
    domain_knowledge: []
  };
  const foundSet = /* @__PURE__ */ new Set();
  for (const [category, list] of Object.entries(SKILL_CATEGORIES_MAP)) {
    const catKey = category;
    for (const skill of list) {
      const regex = getSkillRegex(skill);
      if (regex.test(text)) {
        const canonical = SKILL_ALIASES[skill.toLowerCase()] || skill;
        if (!result[catKey].includes(canonical)) {
          result[catKey].push(canonical);
        }
        foundSet.add(canonical);
      }
    }
  }
  return {
    categorized: result,
    all: Array.from(foundSet)
  };
}
function segmentDocumentSections(text) {
  const lines = text.split(/\r?\n/);
  const sections = [];
  let currentSection = {
    id: "header-0",
    type: "header",
    title: "Header",
    content: "",
    startLine: 0,
    endLine: 0,
    confidence: 0.9
  };
  let sectionLines = [];
  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const line = rawLine.trim();
    const { matched, type, title } = matchSectionHeader(line);
    if (matched && line.length < 50) {
      currentSection.content = sectionLines.join("\n").trim();
      currentSection.endLine = Math.max(0, idx - 1);
      if (currentSection.content.length > 0) {
        sections.push(__spreadValues({}, currentSection));
      }
      currentSection = {
        id: `${type}-${idx}`,
        type,
        title,
        content: "",
        startLine: idx,
        endLine: idx,
        confidence: 0.95
      };
      sectionLines = [];
    } else {
      sectionLines.push(rawLine);
    }
  }
  currentSection.content = sectionLines.join("\n").trim();
  currentSection.endLine = lines.length - 1;
  if (currentSection.content.length > 0) {
    sections.push(__spreadValues({}, currentSection));
  }
  return sections;
}
function splitHeaderParts(text) {
  if (text.includes("|")) {
    return text.split("|").map((p) => p.trim()).filter(Boolean);
  }
  if (text.includes("\u2022")) {
    return text.split("\u2022").map((p) => p.trim()).filter(Boolean);
  }
  if (/\s+[-–—]\s+/.test(text)) {
    return text.split(/\s+[-–—]\s+/).map((p) => p.trim()).filter(Boolean);
  }
  if (text.includes(",")) {
    return text.split(/,/).map((p) => p.trim()).filter(Boolean);
  }
  return [text.trim()];
}
function parseExperienceSection(expText) {
  if (!expText.trim()) return [];
  const items = [];
  const lines = expText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const dateRangePattern = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?(?:\d{1,2}\/)?(\d{4})\s*[-–—to\s]+\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?(?:\d{1,2}\/)?(\d{4}|present|current)?/i;
  const isRoleTitle = (str) => {
    return /\b(engineer|developer|architect|lead|manager|analyst|specialist|consultant|sre|designer|director|vp|head|intern|fellow|scientist|officer|administrator|programmer|technician|representative|assistant|nurse|physician|teacher|accountant|therapist|pharmacist)\b/i.test(str);
  };
  const isCompanyIndicator = (str) => {
    return /\b(inc|corp|ltd|llc|technologies|services|solutions|labs|systems|group|company|co|corporation|bank|health|media|studios|enterprises|holdings|agency|aws|microsoft|google|amazon|meta|apple|netflix|stripe|cloudflare)\b/i.test(str);
  };
  let currentJob = null;
  let pendingHeaderLines = [];
  const commitCurrent = () => {
    if (currentJob && (currentJob.bullets.length > 0 || currentJob.company)) {
      const fullText = currentJob.bullets.join(" ");
      const { all: techs } = extractCategorizedSkills(fullText);
      const achievements = currentJob.bullets.filter((b) => QUANTIFIABLE_PATTERNS.some((p) => p.test(b)));
      items.push({
        company: currentJob.company || "Company",
        role: currentJob.role || "Software Professional",
        startDate: currentJob.startDate || "Past",
        endDate: currentJob.endDate || "Present",
        isCurrent: currentJob.isCurrent || /present|current/i.test(currentJob.endDate),
        isRemote: currentJob.isRemote,
        isHybrid: currentJob.isHybrid,
        isContract: currentJob.isContract,
        isInternship: currentJob.isInternship,
        bullets: currentJob.bullets,
        achievements,
        technologies: techs,
        rawText: currentJob.bullets.join("\n"),
        confidence: currentJob.company && currentJob.role ? 0.92 : 0.75
      });
    }
    currentJob = null;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBullet = /^[•\-*▪►◦‣⁃❖✔★✓→–—]\s*/.test(line);
    const dateMatch = line.match(dateRangePattern);
    if (dateMatch) {
      commitCurrent();
      const isRemote = /\bremote\b/i.test(line);
      const isHybrid = /\bhybrid\b/i.test(line);
      const isContract = /\b(contract|contractor|freelance)\b/i.test(line);
      const isInternship = /\b(intern|internship)\b/i.test(line);
      const dateParts = dateMatch[0].split(/[-–—]|\bto\b/i).map((d) => d.trim());
      const startDate = dateParts[0] || "";
      const endDate = dateParts[1] || (dateMatch[0].toLowerCase().includes("present") ? "Present" : "Present");
      const isCurrent = /present|current/i.test(dateMatch[0]);
      const cleanedLine = line.replace(dateMatch[0], "").replace(/\b(remote|hybrid|contract|contractor|freelance|intern|internship)\b/gi, "").replace(/^[\s|•\-–—,]+|[\s|•\-–—,]+$/g, "").trim();
      let comp = "";
      let role = "";
      if (pendingHeaderLines.length >= 2) {
        const lineA = pendingHeaderLines[pendingHeaderLines.length - 2];
        const lineB = pendingHeaderLines[pendingHeaderLines.length - 1];
        if (isRoleTitle(lineB) && !isRoleTitle(lineA)) {
          comp = lineA;
          role = lineB;
        } else if (isRoleTitle(lineA) && !isRoleTitle(lineB)) {
          role = lineA;
          comp = lineB;
        } else if (isCompanyIndicator(lineA)) {
          comp = lineA;
          role = lineB;
        } else {
          comp = lineA;
          role = lineB;
        }
      } else if (pendingHeaderLines.length === 1) {
        const singleLine = pendingHeaderLines[0];
        const parts = splitHeaderParts(singleLine);
        if (parts.length >= 2) {
          if (isRoleTitle(parts[0])) {
            role = parts[0];
            comp = parts[1];
          } else {
            comp = parts[0];
            role = parts[1];
          }
        } else if (isRoleTitle(singleLine)) {
          role = singleLine;
          comp = cleanedLine || "Organization";
        } else {
          comp = singleLine;
          role = cleanedLine || (isRoleTitle(cleanedLine) ? cleanedLine : "Software Professional");
        }
      } else if (cleanedLine) {
        const parts = splitHeaderParts(cleanedLine);
        if (parts.length >= 2) {
          if (isRoleTitle(parts[0])) {
            role = parts[0];
            comp = parts[1];
          } else {
            comp = parts[0];
            role = parts[1];
          }
        } else {
          if (isRoleTitle(cleanedLine)) {
            role = cleanedLine;
            comp = "Organization";
          } else {
            comp = cleanedLine;
            role = "Software Professional";
          }
        }
      }
      currentJob = {
        company: comp || "Organization",
        role: role || "Software Professional",
        startDate,
        endDate,
        isCurrent,
        isRemote,
        isHybrid,
        isContract,
        isInternship,
        bullets: []
      };
      pendingHeaderLines = [];
    } else if (isBullet) {
      const cleanBullet = line.replace(/^[•\-*▪►◦‣⁃❖✔★✓→–—]\s*/, "").trim();
      if (currentJob) {
        currentJob.bullets.push(cleanBullet);
      } else {
        currentJob = {
          company: pendingHeaderLines[0] || "Organization",
          role: pendingHeaderLines[1] || "Software Professional",
          startDate: "Past",
          endDate: "Present",
          isCurrent: true,
          isRemote: false,
          isHybrid: false,
          isContract: false,
          isInternship: false,
          bullets: [cleanBullet]
        };
        pendingHeaderLines = [];
      }
    } else {
      if (currentJob && currentJob.bullets.length > 0) {
        if (line.length < 60 && !line.endsWith(".") && (isCompanyIndicator(line) || isRoleTitle(line) || pendingHeaderLines.length > 0 || !line.includes(" "))) {
          pendingHeaderLines.push(line);
        } else {
          currentJob.bullets[currentJob.bullets.length - 1] += " " + line;
        }
      } else {
        pendingHeaderLines.push(line);
      }
    }
  }
  commitCurrent();
  return items;
}
function parseEducationSection(eduText) {
  if (!eduText.trim()) return [];
  const items = [];
  const lines = eduText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const gpaMatch = eduText.match(/\bgpa:?\s*(\d(?:\.\d{1,2})?(?:\s*\/\s*4(?:\.0)?)?|\d{1,2}(?:\.\d{1,2})?\s*\/\s*10)/i);
  const foundGPA = gpaMatch ? gpaMatch[1] : void 0;
  for (const line of lines) {
    const hasDegree = /\b(bachelor|master|doctor|associate|b\.s\.|b\.a\.|m\.s\.|m\.a\.|b\.tech|m\.tech|mba|ph\.d|phd|b\.e\.|b\.sc)\b/i.test(line);
    const hasInstitution = /\b(university|college|institute|school|academy|polytechnic)\b/i.test(line);
    if (hasDegree || hasInstitution) {
      const parts = line.split(/[-–—|,]/).map((p) => p.trim());
      const inst = parts.find((p) => /\b(university|college|institute|school)\b/i.test(p)) || parts[0] || "University";
      const deg = parts.find((p) => /\b(bachelor|master|b\.s|b\.a|m\.s|m\.a|phd|b\.tech|m\.tech|associate)\b/i.test(p)) || line;
      items.push({
        institution: inst,
        degree: deg,
        gpa: foundGPA,
        confidence: hasDegree && hasInstitution ? 0.95 : 0.8
      });
    }
  }
  if (items.length === 0 && eduText.trim().length > 10) {
    items.push({
      institution: "Higher Education Institution",
      degree: eduText.split("\n")[0].trim(),
      gpa: foundGPA,
      confidence: 0.65
    });
  }
  return items;
}
function parseProjectsSection(projText) {
  if (!projText.trim()) return [];
  const lines = projText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const projects = [];
  let currentName = "";
  let currentDesc = [];
  for (const line of lines) {
    const isBullet = /^\s*[•\-*▪►◦‣⁃]/.test(line);
    const firstWord = line.trim().split(/\s+/)[0].toLowerCase();
    const isAction = ACTION_VERBS.includes(firstWord) || ["prepared", "supported", "assisted", "treated", "researched"].includes(firstWord);
    if (!isBullet && line.length < 70 && !isAction) {
      if (currentName) {
        const descStr = currentDesc.join(" ");
        const { all: techs } = extractCategorizedSkills(descStr);
        projects.push({
          name: currentName,
          description: descStr,
          technologies: techs,
          confidence: 0.9
        });
        currentDesc = [];
      }
      currentName = line.replace(/[:\-–]/g, "").trim();
    } else {
      currentDesc.push(line.replace(/^\s*[•\-*▪►◦‣⁃]\s*/, "").trim());
    }
  }
  if (currentName) {
    const descStr = currentDesc.join(" ");
    const { all: techs } = extractCategorizedSkills(descStr);
    projects.push({
      name: currentName,
      description: descStr,
      technologies: techs,
      confidence: 0.9
    });
  }
  return projects;
}
function parseCertificationsSection(certText) {
  if (!certText.trim()) return [];
  const lines = certText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lines.map((line) => ({
    name: line.replace(/^\s*[•\-*▪►◦‣⁃]\s*/, "").trim(),
    confidence: 0.9
  }));
}
function parseResume(rawText, fileName = "resume.txt") {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const trimmed = rawText.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const pageCountEstimate = Math.max(1, Math.ceil(wordCount / 450));
  const sections = segmentDocumentSections(trimmed);
  const linksInfo = extractStructuredLinks(trimmed);
  const nameInfo = extractName(trimmed);
  const personalInfo = {
    name: nameInfo.name,
    email: (_a = trimmed.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)) == null ? void 0 : _a[0],
    phone: (_b = trimmed.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/)) == null ? void 0 : _b[0],
    // Do not treat a reordered comma-separated skills list as a location.
    location: extractLocation(((_c = sections.find((section) => section.type === "header")) == null ? void 0 : _c.content) || ""),
    linkedin: linksInfo.linkedin,
    github: linksInfo.github,
    portfolio: linksInfo.portfolio,
    website: linksInfo.website,
    links: linksInfo.links,
    structuredLinks: linksInfo.structured,
    confidence: nameInfo.confidence
  };
  const expSection = ((_d = sections.find((s) => s.type === "experience")) == null ? void 0 : _d.content) || "";
  const eduSection = ((_e = sections.find((s) => s.type === "education")) == null ? void 0 : _e.content) || "";
  const projSection = ((_f = sections.find((s) => s.type === "projects")) == null ? void 0 : _f.content) || "";
  const certSection = ((_g = sections.find((s) => s.type === "certifications")) == null ? void 0 : _g.content) || "";
  const summarySection = (_h = sections.find((s) => s.type === "summary")) == null ? void 0 : _h.content;
  const { categorized, all: allSkills } = extractCategorizedSkills(trimmed);
  const experience = parseExperienceSection(expSection);
  const education = parseEducationSection(eduSection);
  const projects = parseProjectsSection(projSection);
  const certifications = parseCertificationsSection(certSection);
  const achievements = [];
  for (const line of trimmed.split(/\r?\n/)) {
    if (QUANTIFIABLE_PATTERNS.some((p) => p.test(line)) && line.length > 20) {
      achievements.push(line.replace(/^\s*[•\-*▪►◦‣⁃]\s*/, "").trim());
    }
  }
  const sectionHeadersFound = sections.map((s) => s.title);
  return {
    metadata: {
      fileName,
      fileType: /\.pdf$/i.test(fileName) ? "pdf" : /\.docx$/i.test(fileName) ? "docx" : "txt",
      extractedCharCount: trimmed.length,
      wordCount,
      pageCountEstimate,
      extractionQuality: "excellent",
      isScanned: false,
      hasTwoColumns: false
    },
    sections,
    personalInfo,
    summary: summarySection,
    experience,
    education,
    projects,
    certifications,
    skills: categorized,
    allSkills,
    achievements,
    rawText: trimmed,
    wordCount,
    pageCountEstimate,
    sectionHeadersFound
  };
}

// packages/core/src/parser/job-parser.ts
function extractJobTitle(text) {
  var _a;
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.length > 3 && line.length < 60 && !/summary|overview|about|responsibilities/i.test(line)) {
      if (/(engineer|developer|architect|designer|manager|lead|specialist|analyst|consultant|director|vp)/i.test(line)) {
        return line;
      }
    }
  }
  return ((_a = lines[0]) == null ? void 0 : _a.slice(0, 50)) || "Target Role";
}
function extractCompanyName(text) {
  const match = text.match(/\b(?:at|with|join|about)\s+([A-Z][a-zA-Z0-9&\s]{2,30}?)(?:\s+is|,|\.|\n)/);
  if (match) return match[1].trim();
  return "Target Company";
}
function extractWorkMode(text) {
  if (/\b(remote|work from home|wfh|anywhere)\b/i.test(text)) return "remote";
  if (/\b(hybrid|flexible)\b/i.test(text)) return "hybrid";
  if (/\b(on-site|onsite|in-office|in office)\b/i.test(text)) return "onsite";
  return "unspecified";
}
function extractSeniority(text) {
  if (/\b(intern|internship)\b/i.test(text)) return "intern";
  if (/\b(entry|junior|associate|grad)\b/i.test(text)) return "entry";
  if (/\b(principal|staff|distinguished)\b/i.test(text)) return "principal";
  if (/\b(lead|team lead|tech lead)\b/i.test(text)) return "lead";
  if (/\b(senior|sr\.?)\b/i.test(text)) return "senior";
  if (/\b(director|vp|head of|chief)\b/i.test(text)) return "executive";
  if (/\b(mid|intermediate)\b/i.test(text)) return "mid";
  return "unspecified";
}
function extractMinYears(text) {
  const match = text.match(/(\d+)\+?\s*(?:to\s*\d+)?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}
function parseJobDescription(rawText) {
  const trimmed = rawText.trim();
  const { categorized, all: allSkills } = extractCategorizedSkills(trimmed);
  const lines = trimmed.split(/\r?\n/);
  const requiredSkills = [];
  const preferredSkills = [];
  const bonusSkills = [];
  const requirementsList = [];
  let currentImportance = "required";
  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const line = rawLine.trim();
    if (!line) continue;
    if (/\b(bonus|extra credit|optional)\b/i.test(line)) {
      currentImportance = "bonus";
    } else if (/\b(preferred|nice to have|plus|ideal|good to have)\b/i.test(line)) {
      currentImportance = "preferred";
    } else if (/\b(minimum|must have|required|requirements|what you need|qualifications)\b/i.test(line)) {
      currentImportance = "required";
    }
    const isBullet = /^\s*[•\-*▪►◦‣⁃]/.test(rawLine);
    const { all: lineSkills } = extractCategorizedSkills(line);
    if (isBullet || line.length > 20 || lineSkills.length > 0) {
      let category = "skill";
      if (/\b(degree|bachelor|master|phd)\b/i.test(line)) category = "education";
      else if (/\b(certified|certification|license)\b/i.test(line)) category = "certification";
      else if (/\b(years? of experience|track record)\b/i.test(line)) category = "experience";
      else if (/\b(responsible for|manage|deliver|build|lead)\b/i.test(line)) category = "responsibility";
      requirementsList.push({
        id: `req-${idx}`,
        text: line.replace(/^\s*[•\-*▪►◦‣⁃]\s*/, "").trim(),
        category,
        importance: currentImportance,
        extractedSkills: lineSkills
      });
      for (const sk of lineSkills) {
        const canonical = SKILL_ALIASES[sk.toLowerCase()] || sk;
        if (currentImportance === "required" && !requiredSkills.includes(canonical)) {
          requiredSkills.push(canonical);
        } else if (currentImportance === "preferred" && !preferredSkills.includes(canonical)) {
          preferredSkills.push(canonical);
        } else if (currentImportance === "bonus" && !bonusSkills.includes(canonical)) {
          bonusSkills.push(canonical);
        }
      }
    }
  }
  if (requiredSkills.length === 0 && preferredSkills.length === 0 && bonusSkills.length === 0) {
    requiredSkills.push(...allSkills);
  }
  return {
    id: "job-" + Date.now(),
    title: extractJobTitle(trimmed),
    company: extractCompanyName(trimmed),
    workMode: extractWorkMode(trimmed),
    seniority: extractSeniority(trimmed),
    minYearsExperience: extractMinYears(trimmed),
    requiredSkills,
    preferredSkills,
    bonusSkills,
    requirementsList,
    educationRequirements: requirementsList.filter((r) => r.category === "education").map((r) => r.text),
    certifications: requirementsList.filter((r) => r.category === "certification").map((r) => r.text),
    responsibilities: requirementsList.filter((r) => r.category === "responsibility").map((r) => r.text),
    softSkills: categorized.soft_skills,
    domainKnowledge: categorized.domain_knowledge,
    categorizedSkills: categorized,
    rawText: trimmed
  };
}

// packages/core/src/ats/ats-checker.ts
function runATSChecks(resume) {
  var _a;
  const checks = [];
  const text = resume.rawText;
  const wordCount = resume.wordCount;
  const standardHeadersFound = resume.sectionHeadersFound.length;
  const hasStandardHeadings = standardHeadersFound >= 3;
  checks.push({
    id: "ats-headings",
    name: "Standard Section Headings",
    category: "headings",
    passed: hasStandardHeadings,
    severity: "critical",
    message: hasStandardHeadings ? `Identified ${standardHeadersFound} standard section headings (e.g. Experience, Education, Skills).` : "Fewer than 3 standard section headings found. ATS parsers rely on standard titles to catalog your experience.",
    whyItMatters: 'Applicant Tracking Systems sort information by section. Non-standard headings (e.g. "My Journey" or "What I Do") often cause text to be ignored.',
    fix: 'Use conventional headings such as "Work Experience", "Education", "Technical Skills", and "Projects".'
  });
  const hasEmail = Boolean(resume.personalInfo.email);
  checks.push({
    id: "ats-email",
    name: "Professional Email Address",
    category: "contact",
    passed: hasEmail,
    severity: "critical",
    message: hasEmail ? `Email address successfully extracted: ${resume.personalInfo.email}` : "No machine-readable email address was detected.",
    whyItMatters: "Recruiters and automated invitation systems require an accessible email to schedule interviews.",
    fix: "Place your email in plain text near the top of your resume (avoid embedding it inside a non-selectable header graphic)."
  });
  const hasPhone = Boolean(resume.personalInfo.phone);
  checks.push({
    id: "ats-phone",
    name: "Phone Number",
    category: "contact",
    passed: hasPhone,
    severity: "warning",
    message: hasPhone ? `Phone number detected: ${resume.personalInfo.phone}` : "No telephone number detected.",
    whyItMatters: "Recruiters often conduct initial phone screens or send SMS screening invitations.",
    fix: "Include a phone number with country code (e.g., +1 (555) 012-3456)."
  });
  const isWordCountIdeal = wordCount >= 40 && wordCount <= 1200;
  checks.push({
    id: "ats-length",
    name: "Resume Word Count & Density",
    category: "content",
    passed: isWordCountIdeal,
    severity: wordCount < 30 ? "critical" : "warning",
    message: isWordCountIdeal ? `Word count is optimal at ${wordCount} words (ideal single/double page target: 350-1000 words).` : wordCount < 40 ? `Resume is very brief (${wordCount} words). Add detail to your achievements.` : `Resume is long (${wordCount} words). Consider condensing to 1-2 pages.`,
    whyItMatters: "Overly brief resumes lack keyword depth, while overly long resumes get truncated by initial parser buffers.",
    fix: "Aim for 400-800 words for a 1-page resume, or 800-1200 words for senior 2-page resumes."
  });
  const hasLinks = (((_a = resume.personalInfo.links) == null ? void 0 : _a.length) || 0) > 0 || Boolean(resume.personalInfo.linkedin || resume.personalInfo.github);
  checks.push({
    id: "ats-links",
    name: "Online Presence & Professional Links",
    category: "contact",
    passed: hasLinks,
    severity: "info",
    message: hasLinks ? `Found ${resume.personalInfo.links.length} professional link(s) (LinkedIn, GitHub, Portfolio).` : "No LinkedIn or portfolio links found.",
    whyItMatters: "87% of technical recruiters review LinkedIn profiles or GitHub repositories before scheduling technical rounds.",
    fix: "Add your LinkedIn URL and GitHub or portfolio link in plain text."
  });
  const expWithDates = resume.experience.filter((e) => e.startDate && e.startDate !== "Past");
  const hasConsistentDates = expWithDates.length > 0 || resume.experience.length === 0;
  checks.push({
    id: "ats-dates",
    name: "Consistent Chronological Dates",
    category: "formatting",
    passed: hasConsistentDates,
    severity: "warning",
    message: hasConsistentDates ? `Detected chronological date ranges across ${expWithDates.length} work experience entries.` : "Date ranges could not be cleanly identified for your work history.",
    whyItMatters: "ATS parsers calculate your total years of experience automatically using date ranges.",
    fix: 'Use standard date formats such as "MM/YYYY \u2013 MM/YYYY" or "Month YYYY \u2013 Present" for every position.'
  });
  const totalBullets = resume.experience.reduce((sum, e) => sum + e.bullets.length, 0);
  const hasGoodBullets = totalBullets >= 1 || resume.experience.length === 0;
  checks.push({
    id: "ats-bullets",
    name: "Standard Bullet Point Formatting",
    category: "layout",
    passed: hasGoodBullets,
    severity: "warning",
    message: hasGoodBullets ? `Found ${totalBullets} structured bullet points across experience sections.` : "Few or no bullet points detected. Dense paragraphs are difficult for ATS and recruiters to scan.",
    whyItMatters: "Bullet points delineate distinct accomplishments and allow algorithms to isolate individual responsibilities.",
    fix: "Use standard bullet characters (\u2022 or -) with 3-5 bullets per position."
  });
  const hasComplexSymbols = /[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text);
  checks.push({
    id: "ats-symbols",
    name: "Clean Text Encoding & Standard Fonts",
    category: "formatting",
    passed: !hasComplexSymbols,
    severity: "critical",
    message: !hasComplexSymbols ? "Clean Unicode text encoding with no corrupted symbols detected." : "Corrupted characters or unsupported symbol glyphs detected in text stream.",
    whyItMatters: "Complex graphics, proprietary icons, or custom fonts can render as gibberish inside ATS databases.",
    fix: "Stick to standard Unicode bullets and standard system fonts."
  });
  const criticalIssues = checks.filter((c) => !c.passed && c.severity === "critical").length;
  const warnings = checks.filter((c) => !c.passed && c.severity === "warning").length;
  const passed = checks.filter((c) => c.passed).length;
  let score = 100;
  score -= criticalIssues * 20;
  score -= warnings * 10;
  score = Math.max(20, Math.min(100, score));
  let grade = "Excellent";
  if (score >= 90) grade = "Excellent";
  else if (score >= 75) grade = "Strong";
  else if (score >= 55) grade = "Needs Improvement";
  else grade = "High Risk";
  const summary = criticalIssues === 0 && warnings === 0 ? "The implemented text-readability checks passed. Compatibility with individual ATS products is not verified." : `Found ${criticalIssues} critical issue(s) and ${warnings} warning(s) that may hinder ATS parsing.`;
  return {
    score,
    grade,
    checks,
    criticalIssuesCount: criticalIssues,
    warningsCount: warnings,
    passedCount: passed,
    summary
  };
}

// packages/core/src/impact/impact-evaluator.ts
function findActionVerb(text) {
  var _a, _b;
  const words = text.toLowerCase().split(/\s+/);
  const firstWord = (_a = words[0]) == null ? void 0 : _a.replace(/[^a-z]/g, "");
  if (ACTION_VERBS.includes(firstWord)) {
    return firstWord;
  }
  for (let i = 0; i < Math.min(3, words.length); i++) {
    const w = (_b = words[i]) == null ? void 0 : _b.replace(/[^a-z]/g, "");
    if (ACTION_VERBS.includes(w)) {
      return w;
    }
  }
  return void 0;
}
function classifyBulletStrength(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Developing";
  return "Weak";
}
function analyzeBullet(bullet, index) {
  var _a;
  const trimmed = bullet.trim();
  const lower = trimmed.toLowerCase();
  const actionVerb = findActionVerb(trimmed);
  const { all: technologies } = extractCategorizedSkills(trimmed);
  const metricMatch = QUANTIFIABLE_PATTERNS.find((p) => p.test(trimmed));
  const hasQuantifiableMetric = Boolean(metricMatch);
  const metricFound = metricMatch ? (_a = trimmed.match(metricMatch)) == null ? void 0 : _a[0] : void 0;
  const issues = [];
  const suggestions = [];
  let score = 40;
  if (actionVerb) {
    score += 25;
  } else {
    issues.push("Does not start with a strong action verb.");
    suggestions.push('Begin with an accurate action, such as "Prepared", "Supported", "Analyzed" or "Built".');
  }
  if (hasQuantifiableMetric) {
    score += 30;
  } else {
    issues.push("Lacks measurable data or quantifiable impact.");
    suggestions.push("Describe a substantiated outcome; add measurements only if known. Do not invent numbers.");
  }
  if (technologies.length > 0) {
    score += 15;
  }
  const weakWordFound = WEAK_WORDS.find((w) => lower.includes(w));
  if (weakWordFound) {
    score -= 15;
    issues.push(`Contains passive phrasing ("${weakWordFound}").`);
    suggestions.push("Replace passive phrases with active responsibility statements.");
  }
  score = Math.max(20, Math.min(100, score));
  const strength = classifyBulletStrength(score);
  const xyzFormula = trimmed;
  const metricsDriven = trimmed;
  const leadership = trimmed;
  return {
    id: `bullet-${index}`,
    original: trimmed,
    score,
    strength,
    actionVerb,
    technologies,
    hasQuantifiableMetric,
    metricFound,
    // Tool counts do not establish task complexity, and action verbs do not establish leadership.
    ownershipLevel: /\b(led|managed)\s+(?:a\s+|the\s+)?team\b/i.test(trimmed) ? "lead" : "unspecified",
    issues,
    suggestions,
    rewritten: xyzFormula,
    rewriteVariants: {
      xyzFormula,
      metricsDriven,
      leadership
    },
    rewriteReason: hasQuantifiableMetric ? "Original wording and reported metrics preserved; review for clarity." : "Original facts preserved. Add a measurable outcome only if it is verifiable.",
    rewriteType: hasQuantifiableMetric ? "improved_existing" : "needs_candidate_info",
    placeholdersNeeded: hasQuantifiableMetric ? [] : ["Add a verified outcome only if available."]
  };
}
function evaluateResumeImpact(resume) {
  const allBullets = [];
  for (const exp of resume.experience) {
    allBullets.push(...exp.bullets);
  }
  allBullets.push(...resume.projects.map((project) => project.description).filter(Boolean));
  const analyzed = allBullets.map((b, i) => analyzeBullet(b, i));
  const metricsCount = analyzed.filter((a) => a.hasQuantifiableMetric).length;
  const actionVerbsCount = analyzed.filter((a) => Boolean(a.actionVerb)).length;
  const strongBulletsCount = analyzed.filter((a) => a.score >= 70).length;
  const weakBulletsCount = analyzed.filter((a) => a.score < 50).length;
  let overallImpactScore = 50;
  if (allBullets.length > 0) {
    const metricRatio = metricsCount / allBullets.length;
    const verbRatio = actionVerbsCount / allBullets.length;
    overallImpactScore = Math.round(metricRatio * 50 + verbRatio * 35 + strongBulletsCount / allBullets.length * 15);
  }
  const quantificationOpportunities = analyzed.filter((a) => !a.hasQuantifiableMetric && a.original.length > 20).slice(0, 4).map((a) => ({
    bullet: a.original,
    suggestedMetricType: "A substantiated outcome or scope",
    exampleMetric: "Describe what changed as a result of your work; include a measurement only if known."
  }));
  const detectedMetrics = [];
  for (const a of analyzed) {
    if (a.metricFound) {
      detectedMetrics.push(a.metricFound);
    }
  }
  return {
    overallImpactScore: Math.max(25, Math.min(100, overallImpactScore)),
    metricsCount,
    actionVerbsCount,
    strongBulletsCount,
    weakBulletsCount,
    quantificationOpportunities,
    detectedMetrics
  };
}

// packages/core/src/matching/semantic-matcher.ts
function getCategoryForSkill(skill) {
  const norm = skill.toLowerCase();
  for (const [cat, skills] of Object.entries(SKILL_CATEGORIES_MAP)) {
    if (skills.some((s) => s.toLowerCase() === norm)) {
      return cat;
    }
  }
  return "tools";
}
function normalizeSkill(str) {
  return str.toLowerCase().replace(/[^a-z0-9+#]/g, "").trim();
}
function findEvidenceSnippet(resumeText, searchTerms) {
  const lines = resumeText.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length < 15) continue;
    for (const term of searchTerms) {
      const regex = getSkillRegex(term);
      if (regex.test(trimmed)) {
        return trimmed.replace(/^[^a-zA-Z0-9]+/, "");
      }
    }
  }
  return void 0;
}
function matchSingleSkill(targetSkill, resumeSkills, resumeAllSkills, resumeText, importance = "required") {
  const category = getCategoryForSkill(targetSkill);
  const targetNorm = normalizeSkill(targetSkill);
  const exactFound = resumeAllSkills.find((s) => s.toLowerCase() === targetSkill.toLowerCase());
  if (exactFound) {
    const evidence = findEvidenceSnippet(resumeText, [targetSkill, exactFound]);
    return {
      skill: targetSkill,
      category,
      status: "matched",
      importance,
      confidence: 1,
      matchLevel: "level_1_exact",
      evidenceQuote: evidence,
      evidence: evidence || `Direct exact match for "${targetSkill}" found in resume profile.`,
      reasoning: `Verified direct exact match for "${targetSkill}".`
    };
  }
  const normFound = resumeAllSkills.find((s) => normalizeSkill(s) === targetNorm);
  if (normFound) {
    const evidence = findEvidenceSnippet(resumeText, [normFound, targetSkill]);
    return {
      skill: targetSkill,
      category,
      status: "matched",
      importance,
      confidence: 0.95,
      matchLevel: "level_2_normalized",
      evidenceQuote: evidence,
      evidence: evidence || `Normalized token match ("${normFound}") aligns with "${targetSkill}".`,
      reasoning: `Normalized match ("${normFound}") matches required "${targetSkill}".`
    };
  }
  const aliasTarget = SKILL_ALIASES[targetSkill.toLowerCase()];
  if (aliasTarget) {
    const aliasFound = resumeAllSkills.find(
      (s) => (SKILL_ALIASES[s.toLowerCase()] || s).toLowerCase() === aliasTarget.toLowerCase()
    );
    if (aliasFound) {
      const evidence = findEvidenceSnippet(resumeText, [aliasFound, aliasTarget]);
      return {
        skill: targetSkill,
        category,
        status: "matched",
        importance,
        confidence: 0.9,
        matchLevel: "level_3_alias",
        aliasMatched: aliasFound,
        evidenceQuote: evidence,
        evidence: evidence || `Standard industry alias ("${aliasFound}") matches "${targetSkill}".`,
        reasoning: `Candidate's "${aliasFound}" is an established industry synonym for "${targetSkill}".`
      };
    }
  }
  for (const rel of TAXONOMY_RELATIONSHIPS) {
    if (rel.generalOrEcosystem.toLowerCase() === targetSkill.toLowerCase()) {
      const matchedSpecific = resumeAllSkills.find(
        (s) => rel.specific.some((spec) => spec.toLowerCase() === s.toLowerCase())
      );
      if (matchedSpecific) {
        const evidence = findEvidenceSnippet(resumeText, [matchedSpecific]);
        return {
          skill: targetSkill,
          category,
          status: "partial",
          importance,
          confidence: rel.partialConfidence,
          matchLevel: "level_4_taxonomy",
          taxonomyRelationship: rel.relationship,
          aliasMatched: matchedSpecific,
          evidenceQuote: evidence,
          evidence: evidence || `Candidate demonstrates "${matchedSpecific}", which ${rel.relationship}.`,
          reasoning: `Related experience: "${matchedSpecific}" ${rel.relationship}, providing strong foundational familiarity for "${targetSkill}".`,
          suggestion: `Highlight direct experience with ${targetSkill} in addition to ${matchedSpecific}.`
        };
      }
    }
  }
  const contextRegex = getSkillRegex(targetSkill);
  if (contextRegex.test(resumeText)) {
    const evidence = findEvidenceSnippet(resumeText, [targetSkill]);
    return {
      skill: targetSkill,
      category,
      status: "matched",
      importance,
      confidence: 0.75,
      matchLevel: "level_5_context",
      evidenceQuote: evidence,
      evidence: evidence || `Referenced within work experience context.`,
      reasoning: `Mentioned in project or experience narratives.`
    };
  }
  return {
    skill: targetSkill,
    category,
    status: "missing",
    importance,
    confidence: 0.95,
    evidenceQuote: void 0,
    evidence: "No explicit evidence detected in parsed resume text.",
    reasoning: `The resume does not contain explicit evidence of "${targetSkill}". If you have genuine experience with this skill, add it to your relevant projects or work history.`,
    suggestion: `If you possess ${targetSkill} expertise, add 1-2 bullet points demonstrating practical application.`
  };
}
function buildSkillMatrix(resumeSkills, resumeAllSkills, resumeText, requiredSkills, preferredSkills = [], bonusSkills = []) {
  const matrix = {
    languages: [],
    frameworks: [],
    databases: [],
    cloud: [],
    devops: [],
    ai_ml: [],
    testing: [],
    security: [],
    tools: [],
    soft_skills: [],
    domain_knowledge: []
  };
  const processedSkills = /* @__PURE__ */ new Set();
  const processList = (list, importance) => {
    for (const skill of list) {
      const canonical = SKILL_ALIASES[skill.toLowerCase()] || skill;
      if (processedSkills.has(canonical.toLowerCase())) continue;
      processedSkills.add(canonical.toLowerCase());
      const item = matchSingleSkill(skill, resumeSkills, resumeAllSkills, resumeText, importance);
      matrix[item.category].push(item);
    }
  };
  processList(requiredSkills, "required");
  processList(preferredSkills, "preferred");
  processList(bonusSkills, "bonus");
  if (requiredSkills.length === 0 && preferredSkills.length === 0 && bonusSkills.length === 0) {
    for (const [cat, skills] of Object.entries(resumeSkills)) {
      const category = cat;
      for (const skill of skills) {
        if (!matrix[category].some((m) => m.skill.toLowerCase() === skill.toLowerCase())) {
          const evidence = findEvidenceSnippet(resumeText, [skill]);
          matrix[category].push({
            skill,
            category,
            status: "matched",
            importance: "required",
            confidence: 1,
            matchLevel: "level_1_exact",
            evidenceQuote: evidence,
            evidence: evidence || `Identified in candidate skills inventory.`,
            reasoning: `Term detected: ${skill}. This does not independently verify proficiency.`
          });
        }
      }
    }
  }
  for (const items of Object.values(matrix)) {
    for (const item of items) {
      if (item.status === "missing") {
        item.evidenceLevel = "missing";
        continue;
      }
      const terms = [item.skill, item.aliasMatched].filter((term) => Boolean(term));
      const practicalLine = resumeText.split(/\r?\n/).find((line) => terms.some((term) => getSkillRegex(term).test(line)) && /\b(architected|re-engineered|engineered|spearheaded|built|developed|implemented|designed|analyzed|managed|prepared|delivered|created|maintained|supported|treated|assisted|researched|led|reduced|improved|optimized|tested|audited)\b/i.test(line) && !/\b(no|not|never|without|learning|plan to|want to|hope to)\b/i.test(line) && !/^\s*(skills|requirements|technologies)\s*:/i.test(line));
      item.evidenceLevel = practicalLine ? item.taxonomyRelationship ? "transferable" : "demonstrated" : "mentioned";
      if (practicalLine) item.evidenceQuote = practicalLine.trim();
      if (item.evidenceLevel === "mentioned") {
        item.status = "partial";
        item.confidence = Math.min(item.confidence, 0.5);
        item.reasoning = "Term mentioned, but no practical action was detected on the same line. Add genuine project or experience evidence if available.";
      }
    }
  }
  return matrix;
}

// packages/core/src/scoring/rubric.ts
var CAREER_LEVELS = {
  student: "Student / Fresher",
  internship: "Internship Applicant",
  entry: "Entry-Level Professional",
  experienced: "Experienced Professional",
  senior: "Senior Professional",
  switcher: "Career Switcher"
};
var RUBRIC_WEIGHTS = {
  student: [0.15, 0.2, 0.1, 0.1, 0.25, 0.15, 0.05],
  internship: [0.15, 0.2, 0.1, 0.1, 0.25, 0.15, 0.05],
  entry: [0.15, 0.25, 0.15, 0.15, 0.15, 0.1, 0.05],
  experienced: [0.15, 0.25, 0.2, 0.15, 0.1, 0.1, 0.05],
  senior: [0.15, 0.2, 0.25, 0.2, 0.05, 0.1, 0.05],
  switcher: [0.15, 0.2, 0.15, 0.15, 0.2, 0.1, 0.05]
};

// packages/core/src/scoring/scoring-engine.ts
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function assignGrade(score) {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "C+";
  if (score >= 65) return "C";
  if (score >= 55) return "D";
  return "F";
}
function calculateResumeScore(resume, job, mode = "general", careerLevel = "experienced") {
  var _a, _b, _c;
  const isJobMatch = mode === "job_match" && Boolean(job);
  const atsAnalysis = runATSChecks(resume);
  const atsScoreVal = atsAnalysis.score;
  const atsDimension = {
    key: "ats",
    name: "ATS Readability Estimate",
    score: atsScoreVal,
    weight: 0.15,
    contribution: Number((atsScoreVal * 0.15).toFixed(1)),
    icon: "\u{1F916}",
    color: "text-indigo-400",
    feedback: atsAnalysis.summary,
    reason: `${atsAnalysis.passedCount} of ${atsAnalysis.checks.length} readability checks passed.`,
    tips: atsAnalysis.checks.filter((c) => !c.passed).map((c) => c.fix).slice(0, 3),
    evidence: {
      detected: resume.sectionHeadersFound,
      expected: ["Work Experience", "Education", "Skills", "Projects"],
      matched: resume.sectionHeadersFound,
      missing: atsAnalysis.checks.filter((c) => !c.passed && c.severity === "critical").map((c) => c.name),
      impactExplanation: "ATS parsers strip complex styling to extract structured records. These checks cannot certify compatibility with every ATS.",
      recommendedAction: ((_a = atsAnalysis.checks.find((c) => !c.passed)) == null ? void 0 : _a.fix) || "Maintain standard single-column text flow."
    }
  };
  const skillMatrix = buildSkillMatrix(
    resume.skills,
    resume.allSkills,
    resume.rawText,
    (job == null ? void 0 : job.requiredSkills) || [],
    (job == null ? void 0 : job.preferredSkills) || [],
    (job == null ? void 0 : job.bonusSkills) || []
  );
  let allMatched = 0;
  let allRequired = 0;
  const missingRequiredList = [];
  const matchedSkillsList = [];
  for (const items of Object.values(skillMatrix)) {
    for (const item of items) {
      if (item.importance === "required") {
        allRequired++;
        if (item.status === "matched") {
          allMatched += 1;
          matchedSkillsList.push(item.skill);
        } else if (item.status === "partial") {
          allMatched += item.evidenceLevel === "mentioned" ? 0.3 : 0.6;
          matchedSkillsList.push(`${item.skill} (Partial)`);
        } else {
          missingRequiredList.push(item.skill);
        }
      }
    }
  }
  let skillScoreVal = 70;
  const hasJobSkills = Boolean(job && job.requiredSkills.length + job.preferredSkills.length + job.bonusSkills.length);
  if (isJobMatch) {
    const requirements = hasJobSkills ? Object.values(skillMatrix).flat() : [];
    const weight = { required: 1, preferred: 0.5, bonus: 0.25 };
    const total = requirements.reduce((sum, item) => sum + weight[item.importance], 0);
    const supported = requirements.reduce((sum, item) => sum + weight[item.importance] * (item.status === "matched" ? 1 : item.status === "partial" ? item.evidenceLevel === "mentioned" ? 0.3 : 0.6 : 0), 0);
    skillScoreVal = total ? Math.round(100 * supported / total) : 0;
    if (!hasJobSkills) for (const items of Object.values(skillMatrix)) items.length = 0;
  } else {
    const items = Object.values(skillMatrix).flat();
    const demonstrated = items.filter((item) => item.evidenceLevel === "demonstrated").length;
    skillScoreVal = clamp(Math.min(30, items.length * 5) + demonstrated * 15, 0, 95);
  }
  const skillDimension = {
    key: "skill_match",
    name: isJobMatch ? "Job Skill Match" : "Skill Evidence",
    score: skillScoreVal,
    weight: 0.25,
    contribution: Number((skillScoreVal * 0.25).toFixed(1)),
    icon: "\u26A1",
    color: "text-cyan-400",
    feedback: isJobMatch ? hasJobSkills ? `${Math.round(allMatched * 10) / 10} evidence-weighted matches across ${allRequired} required skills; preferred and optional skills also contribute.` : "No recognized job skill requirements. Match score is unavailable." : `Identified ${resume.allSkills.length} skills across ${Object.values(resume.skills).filter((s) => s.length > 0).length} recognized categories.`,
    reason: isJobMatch ? "Recognized required/preferred/optional terms carry weights 1/0.5/0.25. Demonstrated/transferable/mentioned evidence earns 100%/60%/30% credit. Other requirements need manual review." : "Mentioned terms earn limited credit; practical action evidence earns additional credit. This heuristic does not verify proficiency.",
    tips: missingRequiredList.slice(0, 3).map((s) => `Add evidence for missing skill: ${s}`),
    evidence: {
      detected: resume.allSkills.slice(0, 10),
      expected: ((_b = job == null ? void 0 : job.requiredSkills) == null ? void 0 : _b.slice(0, 10)) || ["Skills relevant to your chosen profession", "Practical examples"],
      matched: matchedSkillsList.slice(0, 8),
      missing: missingRequiredList.slice(0, 6),
      impactExplanation: "This editorial rubric gives partial credit to mentions and more credit to detected practical evidence; it does not measure proficiency.",
      recommendedAction: missingRequiredList.length > 0 ? `Integrate genuine practical experience for "${missingRequiredList[0]}" into your work history.` : "Describe how you applied relevant skills in genuine work, projects or study."
    }
  };
  const expCount = resume.experience.length;
  let expScoreVal = 50;
  if (expCount >= 3) expScoreVal += 30;
  else if (expCount >= 1) expScoreVal += 20;
  const totalExpBullets = resume.experience.reduce((sum, e) => sum + e.bullets.length, 0);
  if (totalExpBullets >= 8) expScoreVal += 20;
  else if (totalExpBullets >= 4) expScoreVal += 10;
  expScoreVal = clamp(expScoreVal, 20, 100);
  if (careerLevel === "student" || careerLevel === "internship") {
    const projectEvidence = resume.projects.filter((project) => project.description.trim().length >= 30).length;
    const educationEvidence = resume.education.filter((item) => item.institution && item.degree).length;
    expScoreVal = Math.max(expScoreVal, Math.min(100, projectEvidence * 30 + educationEvidence * 20));
  }
  const expDimension = {
    key: "experience",
    name: "Experience Relevance",
    score: expScoreVal,
    weight: 0.2,
    contribution: Number((expScoreVal * 0.2).toFixed(1)),
    icon: "\u{1F4BC}",
    color: "text-purple-400",
    feedback: `${expCount} career position(s) documented with ${totalExpBullets} detailed achievement bullets.`,
    reason: "Counts detected roles and bullets; student and internship profiles also receive project and education credit.",
    tips: [
      "Maintain 3-5 high-impact bullets per role.",
      "Ensure clear job titles and date ranges are visible."
    ],
    evidence: {
      detected: resume.experience.map((e) => `${e.role} at ${e.company}`),
      expected: [(job == null ? void 0 : job.title) || "Target Role Experience", "Chronological Progression"],
      matched: resume.experience.slice(0, 3).map((e) => e.role),
      missing: expCount === 0 ? ["No work experience entries detected"] : [],
      impactExplanation: "Detailed work history demonstrates proven capability and seniority alignment.",
      recommendedAction: "Structure each bullet to reflect problem, action, and business outcome."
    }
  };
  const impactAnalysis = evaluateResumeImpact(resume);
  const impactScoreVal = impactAnalysis.overallImpactScore;
  const impactDimension = {
    key: "impact",
    name: "Impact & Metrics",
    score: impactScoreVal,
    weight: 0.15,
    contribution: Number((impactScoreVal * 0.15).toFixed(1)),
    icon: "\u{1F3AF}",
    color: "text-emerald-400",
    feedback: `Found ${impactAnalysis.metricsCount} quantifiable metric(s) and ${impactAnalysis.actionVerbsCount} strong action verb(s).`,
    reason: "Explicit outcomes help explain work; numbers alone do not prove value.",
    tips: [
      "Describe outcomes you can substantiate; include measurements only when known.",
      "Describe scope accurately without inventing numerical results."
    ],
    evidence: {
      detected: impactAnalysis.detectedMetrics,
      expected: ["Clear action", "Accurate scope", "Substantiated outcome"],
      matched: impactAnalysis.detectedMetrics,
      missing: impactAnalysis.metricsCount === 0 ? ["No measurable outcomes detected; qualitative outcomes may still be useful"] : [],
      impactExplanation: "Genuine measurements can clarify scope and outcomes. This score does not predict interview rates.",
      recommendedAction: "Clarify your contribution and a substantiated outcome. Add numbers only when known; never invent them."
    }
  };
  const projectCount = resume.projects.length;
  const hasGitHub = Boolean(resume.personalInfo.github);
  const hasPortfolio = Boolean(resume.personalInfo.portfolio || resume.personalInfo.website);
  let projectScoreVal = 40;
  if (projectCount >= 2) projectScoreVal += 35;
  else if (projectCount === 1) projectScoreVal += 20;
  if (hasGitHub || hasPortfolio) projectScoreVal += 25;
  projectScoreVal = clamp(projectScoreVal, 20, 100);
  const projectDimension = {
    key: "projects",
    name: "Projects & Portfolio",
    score: projectScoreVal,
    weight: 0.1,
    contribution: Number((projectScoreVal * 0.1).toFixed(1)),
    icon: "\u{1F680}",
    color: "text-amber-400",
    feedback: `${projectCount} project(s) documented. ${hasGitHub || hasPortfolio ? "Supporting profile or portfolio link detected." : "A relevant portfolio link is optional."}`,
    reason: "Recognizes practical projects, academic work and professional case studies. Links are supporting evidence, not verification.",
    tips: ["Describe your contribution and outcome; include a suitable public example only if you can share it."],
    evidence: {
      detected: resume.projects.map((p) => p.name),
      expected: ["Relevant project or case study", "Contribution and outcome"],
      matched: resume.projects.slice(0, 3).map((p) => p.name),
      missing: projectCount === 0 ? ["Dedicated projects section"] : [],
      impactExplanation: "Projects can demonstrate applied skills across professions. Public links do not establish ownership or proficiency.",
      recommendedAction: "Describe a relevant project, academic assignment or case study with your actual contribution."
    }
  };
  const wordCount = resume.wordCount;
  let readScoreVal = 60;
  const earlyCareer = careerLevel === "student" || careerLevel === "internship" || careerLevel === "entry";
  const minimumWords = earlyCareer ? 180 : 350;
  if (wordCount >= minimumWords && wordCount <= 900) readScoreVal = 95;
  else if (wordCount >= (earlyCareer ? 100 : 250) && wordCount <= 1200) readScoreVal = 75;
  else readScoreVal = 45;
  const readDimension = {
    key: "readability",
    name: "Structure & Readability",
    score: readScoreVal,
    weight: 0.1,
    contribution: Number((readScoreVal * 0.1).toFixed(1)),
    icon: "\u{1F4D0}",
    color: "text-sky-400",
    feedback: `Resume word count is ${wordCount} words (editorial full-credit band for this career profile: ${minimumWords}-900 words).`,
    reason: "Uses a documented word-count heuristic, not a measured recruiter reading-time model.",
    tips: ["Keep paragraphs concise and bullet-focused."],
    evidence: {
      detected: [`${wordCount} words`, `Estimated ${resume.pageCountEstimate} page(s)`],
      expected: [`${minimumWords}-900 words in this editorial rubric; content relevance matters more than length`],
      matched: [`${wordCount} words`],
      missing: [],
      impactExplanation: "Clear visual hierarchy ensures key technical achievements are noticed immediately.",
      recommendedAction: "Ensure equal line spacing and consistent typography across all sections."
    }
  };
  let profileScoreVal = 20;
  if (resume.personalInfo.email) profileScoreVal += 25;
  if (resume.personalInfo.phone) profileScoreVal += 20;
  if (resume.personalInfo.linkedin) profileScoreVal += 20;
  if (resume.personalInfo.location) profileScoreVal += 15;
  profileScoreVal = clamp(profileScoreVal, 20, 100);
  const profileDimension = {
    key: "profile",
    name: "Profile & Contact",
    score: profileScoreVal,
    weight: 0.05,
    contribution: Number((profileScoreVal * 0.05).toFixed(1)),
    icon: "\u{1F4C7}",
    color: "text-rose-400",
    feedback: `Contact details score: ${profileScoreVal}/100.`,
    reason: "Ensures zero friction when recruiters reach out for interview scheduling.",
    tips: ["Provide email, phone, location, and LinkedIn URL in the header."],
    evidence: {
      detected: [
        resume.personalInfo.email ? "Email" : "",
        resume.personalInfo.phone ? "Phone" : "",
        resume.personalInfo.linkedin ? "LinkedIn" : "",
        resume.personalInfo.location ? "Location" : ""
      ].filter(Boolean),
      expected: ["Email", "Phone", "Location", "LinkedIn"],
      matched: [
        resume.personalInfo.email ? "Email" : "",
        resume.personalInfo.phone ? "Phone" : "",
        resume.personalInfo.linkedin ? "LinkedIn" : ""
      ].filter(Boolean),
      missing: [
        !resume.personalInfo.email ? "Email" : "",
        !resume.personalInfo.phone ? "Phone" : "",
        !resume.personalInfo.linkedin ? "LinkedIn" : ""
      ].filter(Boolean),
      impactExplanation: "Missing contact info is an immediate disqualifier for recruiter outreach.",
      recommendedAction: "Verify that email and LinkedIn links are clickable and up to date."
    }
  };
  const dimensions = [
    atsDimension,
    skillDimension,
    expDimension,
    impactDimension,
    projectDimension,
    readDimension,
    profileDimension
  ];
  dimensions.forEach((dimension, index) => {
    dimension.weight = RUBRIC_WEIGHTS[careerLevel][index];
    dimension.contribution = Number((dimension.score * dimension.weight).toFixed(1));
    dimension.confidence = ["degraded", "failed"].includes(resume.metadata.extractionQuality) || dimension.evidence.detected.length === 0 ? "low" : "medium";
  });
  if (careerLevel === "student" || careerLevel === "internship") {
    expDimension.name = "Practical & Academic Evidence";
    expDimension.reason = "Projects and education can substitute for professional experience in this rubric.";
    expDimension.evidence.detected = [
      ...resume.experience.map((item) => item.role),
      ...resume.projects.map((item) => item.name),
      ...resume.education.map((item) => item.degree)
    ];
    expDimension.evidence.recommendedAction = "Describe your actual contribution to a project, internship, or academic assignment.";
    expDimension.feedback = `${resume.projects.length} project(s), ${resume.education.length} education entry/entries and ${expCount} role(s) detected.`;
    expDimension.evidence.missing = expDimension.evidence.detected.length ? [] : ["No practical or academic evidence detected"];
  }
  const overall = Math.round(dimensions.reduce((sum, d) => sum + d.contribution, 0));
  const grade = assignGrade(overall);
  const allBullets = [];
  for (const exp of resume.experience) {
    allBullets.push(...exp.bullets);
  }
  allBullets.push(...resume.projects.map((project) => project.description).filter(Boolean));
  const bulletAnalyses = allBullets.map((b, i) => analyzeBullet(b, i));
  const topActions = [];
  if (missingRequiredList.length > 0) {
    topActions.push({
      id: "action-skills",
      title: `Add evidence for missing required skill(s): ${missingRequiredList.slice(0, 2).join(", ")}`,
      impact: "High",
      dimension: "Job Skill Match",
      reason: `Job requires ${missingRequiredList.slice(0, 2).join(", ")} which are currently missing from resume text.`,
      evidence: `Target job required list specifies ${missingRequiredList[0]}.`,
      howToFix: `If you possess genuine experience with ${missingRequiredList[0]}, add bullet points detailing its practical usage.`,
      expectedScoreBoost: 0,
      expectedScoreBoostLabel: "Re-analyze after editing; no guaranteed increase",
      confidence: 0.95
    });
  }
  if (impactAnalysis.metricsCount < 3) {
    topActions.push({
      id: "action-metrics",
      title: "Clarify the outcome of a work or project contribution",
      impact: "High",
      dimension: "Impact & Metrics",
      reason: `${impactAnalysis.metricsCount} measured outcomes detected in work and project descriptions.`,
      evidence: impactAnalysis.detectedMetrics.join("; ") || "No measured outcomes detected; this does not establish that the work had no impact.",
      howToFix: "Explain the problem, your action and an outcome you can substantiate. Qualitative outcomes are useful; numbers are optional.",
      expectedScoreBoost: 0,
      expectedScoreBoostLabel: "Re-analyze after editing; no guaranteed increase",
      confidence: 0.92
    });
  }
  if (atsAnalysis.criticalIssuesCount > 0) {
    const issue = atsAnalysis.checks.find((c) => !c.passed && c.severity === "critical");
    topActions.push({
      id: "action-ats",
      title: `Fix critical ATS issue: ${(issue == null ? void 0 : issue.name) || "Standard Headings"}`,
      impact: "Medium",
      dimension: "ATS Readability Estimate",
      reason: (issue == null ? void 0 : issue.whyItMatters) || "Ensure clean machine readability across recruiting systems.",
      evidence: (issue == null ? void 0 : issue.message) || "Missing standard structural headers.",
      howToFix: (issue == null ? void 0 : issue.fix) || "Use standard section titles.",
      expectedScoreBoost: 0,
      expectedScoreBoostLabel: "Re-analyze after editing; no guaranteed increase",
      confidence: 0.95
    });
  }
  const topStrengths = [];
  if (atsScoreVal >= 85) topStrengths.push("Detected readable text with standard machine-readable section headings");
  if (skillScoreVal >= 80) topStrengths.push(`Strong coverage of recognized competencies (${resume.allSkills.length} skills identified)`);
  if (impactScoreVal >= 75) topStrengths.push(`Effective use of quantifiable results (${impactAnalysis.metricsCount} metrics detected)`);
  if (topStrengths.length === 0) topStrengths.push("Solid foundational structure ready for targeted metric enhancements");
  const criticalIssues = [];
  if (atsAnalysis.criticalIssuesCount > 0) criticalIssues.push(`${atsAnalysis.criticalIssuesCount} ATS formatting issue(s) detected`);
  if (missingRequiredList.length > 0) criticalIssues.push(`Missing ${missingRequiredList.length} required skill(s) specified in target job`);
  if (impactAnalysis.metricsCount === 0) criticalIssues.push("No quantifiable metrics detected in experience bullets");
  const feedback = [
    {
      id: "fb-overall",
      type: overall >= 80 ? "success" : overall >= 60 ? "warning" : "error",
      category: "Overall",
      title: `Overall Score: ${overall}/100 (${grade})`,
      message: overall >= 85 ? "Strong coverage under the selected editorial rubric. Review the evidence and extraction limitations." : overall >= 70 ? "Several rubric dimensions have supporting evidence. Review the prioritized improvements." : "Some rubric dimensions have limited detected evidence. Check extraction and add only truthful, relevant detail.",
      impactWeight: "high"
    }
  ];
  const lowestPillar = [...dimensions].sort((a, b) => {
    const deficitA = (100 - a.score) * a.weight;
    const deficitB = (100 - b.score) * b.weight;
    return deficitB - deficitA;
  })[0];
  topActions.sort((a, b) => {
    const deficit = (action) => {
      const dimension = dimensions.find((item) => item.name === action.dimension);
      return dimension ? (100 - dimension.score) * dimension.weight : 0;
    };
    return deficit(b) - deficit(a);
  });
  if (lowestPillar && !topActions.some((action) => action.dimension === lowestPillar.name)) {
    topActions.unshift({
      id: `action-${lowestPillar.key}`,
      title: lowestPillar.evidence.recommendedAction,
      dimension: lowestPillar.name,
      impact: "High",
      reason: lowestPillar.reason,
      evidence: lowestPillar.evidence.detected.join("; ") || "No supporting evidence detected.",
      howToFix: lowestPillar.evidence.recommendedAction,
      expectedScoreBoost: 0,
      expectedScoreBoostLabel: "Recalculate after editing; no guaranteed increase",
      confidence: lowestPillar.confidence === "low" ? 0.3 : 0.6
    });
  }
  const topPriority = ((_c = topActions[0]) == null ? void 0 : _c.title) || (lowestPillar == null ? void 0 : lowestPillar.evidence.recommendedAction) || (lowestPillar == null ? void 0 : lowestPillar.tips[0]) || `Optimize ${(lowestPillar == null ? void 0 : lowestPillar.name) || "resume content"} to gain maximum score improvement.`;
  return {
    id: "score-" + Date.now(),
    mode,
    overall,
    careerLevel,
    generalQualityScore: isJobMatch ? calculateResumeScore(resume, void 0, "general", careerLevel).overall : overall,
    grade,
    topPriority,
    atsScore: atsScoreVal,
    skillMatchScore: skillScoreVal,
    experienceScore: expScoreVal,
    impactScore: impactScoreVal,
    projectScore: projectScoreVal,
    readabilityScore: readScoreVal,
    profileScore: profileScoreVal,
    dimensions,
    feedback,
    atsAnalysis,
    skillMatrix,
    impactAnalysis,
    bulletAnalyses,
    topStrengths,
    criticalIssues,
    topActions: topActions.slice(0, 3),
    parsedResume: resume,
    parsedJob: job,
    analyzedAt: (/* @__PURE__ */ new Date()).toISOString(),
    fileName: resume.metadata.fileName,
    resumePreview: resume.rawText.slice(0, 200).replace(/\s+/g, " ").trim()
  };
}

// packages/core/src/errors.ts
var ResumeScoreError = class extends Error {
  constructor(message, code = "RESUME_SCORE_ERROR") {
    super(message);
    this.code = code;
    this.name = "ResumeScoreError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
var ResumeParserError = class extends ResumeScoreError {
  constructor(message, details) {
    super(message, "RESUME_PARSER_ERROR");
    this.details = details;
    this.name = "ResumeParserError";
  }
};
var ScoringError = class extends ResumeScoreError {
  constructor(message, details) {
    super(message, "SCORING_ERROR");
    this.details = details;
    this.name = "ScoringError";
  }
};
var JobMatchError = class extends ResumeScoreError {
  constructor(message, details) {
    super(message, "JOB_MATCH_ERROR");
    this.details = details;
    this.name = "JobMatchError";
  }
};

// packages/core/src/scoring/comparison.ts
function compareResumeVersions(original, edited, context) {
  var _a, _b, _c;
  const score = (text) => {
    var _a2;
    return calculateResumeScore(
      parseResume(text),
      context.parsedJob,
      context.mode,
      (_a2 = context.careerLevel) != null ? _a2 : "experienced"
    );
  };
  const before = score(original);
  const after = score(edited);
  return {
    before: (_a = before.generalQualityScore) != null ? _a : before.overall,
    after: (_b = after.generalQualityScore) != null ? _b : after.overall,
    dimensions: after.dimensions.map((dimension) => {
      const previous = before.dimensions.find((item) => item.key === dimension.key);
      return {
        key: dimension.key,
        name: dimension.name,
        before: previous.score,
        after: dimension.score,
        delta: dimension.score - previous.score,
        explanation: dimension.reason,
        previousEvidence: previous.evidence.detected,
        currentEvidence: dimension.evidence.detected
      };
    }),
    skills: Object.values((_c = after.skillMatrix) != null ? _c : {}).flat()
  };
}

// packages/core/src/index.ts
function parseResume2(text, options) {
  if (typeof text !== "string") {
    throw new ResumeParserError("Resume text must be a string.");
  }
  try {
    const fileName = typeof options === "string" ? options : (options == null ? void 0 : options.fileName) || "resume.txt";
    return parseResume(text, fileName);
  } catch (error) {
    throw new ResumeParserError(
      `Failed to parse resume: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
}
function scoreResume(parsed, options = {}) {
  if (!parsed || typeof parsed !== "object") {
    throw new ScoringError("A valid ResumeParsed object is required for scoring.");
  }
  try {
    let job;
    if (typeof options.job === "string") {
      job = parseJobDescription(options.job);
    } else if (options.job && typeof options.job === "object") {
      job = options.job;
    }
    const mode = options.mode || (job ? "job_match" : "general");
    const careerLevel = options.careerLevel || "experienced";
    return calculateResumeScore(parsed, job, mode, careerLevel);
  } catch (error) {
    throw new ScoringError(
      `Failed to calculate resume score: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
}
function matchJob(parsed, jobTextOrParsed) {
  if (!parsed || !parsed.skills) {
    throw new JobMatchError("A valid ResumeParsed object with extracted skills is required.");
  }
  try {
    const job = typeof jobTextOrParsed === "string" ? parseJobDescription(jobTextOrParsed) : jobTextOrParsed;
    return buildSkillMatrix(
      parsed.skills,
      parsed.allSkills,
      parsed.rawText,
      job.requiredSkills || [],
      job.preferredSkills || [],
      job.bonusSkills || []
    );
  } catch (error) {
    throw new JobMatchError(
      `Failed to match job requirements: ${error instanceof Error ? error.message : String(error)}`,
      error
    );
  }
}
function parseJob(text) {
  if (typeof text !== "string") {
    throw new JobMatchError("Job description text must be a string.");
  }
  return parseJobDescription(text);
}
export {
  CAREER_LEVELS,
  JobMatchError,
  RUBRIC_WEIGHTS,
  ResumeParserError,
  ResumeScoreError,
  ScoringError,
  analyzeBullet,
  buildSkillMatrix,
  calculateResumeScore,
  compareResumeVersions,
  evaluateResumeImpact,
  getCategoryForSkill,
  matchJob,
  parseJob,
  parseJobDescription,
  parseResume2 as parseResume,
  runATSChecks,
  scoreResume
};
