/**
 * Taxonomies, canonical aliases, action verbs, and subsumption relationships
 * for the layered semantic matching engine.
 */

import type { SkillCategory } from '@/types';

export const SKILL_CATEGORIES_MAP: Record<SkillCategory, readonly string[]> = {
  languages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Golang',
    'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL',
    'HTML', 'CSS', 'Sass', 'SCSS', 'Bash', 'Shell', 'PowerShell', 'Perl', 'Dart',
    'Elixir', 'Haskell', 'C', 'Assembly', 'Solidity'
  ],
  frameworks: [
    'React', 'React.js', 'Next.js', 'Vue', 'Vue.js', 'Nuxt', 'Nuxt.js',
    'Angular', 'AngularJS', 'Svelte', 'SvelteKit', 'Node.js', 'Express',
    'Express.js', 'NestJS', 'FastAPI', 'Flask', 'Django', 'Spring', 'Spring Boot',
    'ASP.NET', '.NET Core', 'Laravel', 'Ruby on Rails', 'Rails', 'Tailwind CSS',
    'Tailwind', 'Bootstrap', 'GraphQL', 'Redux', 'Zustand', 'Prisma', 'Hibernate',
    'PyTorch', 'TensorFlow', 'Keras', 'Scikit-Learn', 'Pandas', 'NumPy', 'jQuery',
    'Electron', 'React Native', 'Flutter', 'Capacitor', 'gRPC'
  ],
  databases: [
    'PostgreSQL', 'Postgres', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
    'Microsoft SQL Server', 'MSSQL', 'Cassandra', 'DynamoDB', 'Elasticsearch',
    'Neo4j', 'Couchbase', 'Firebase', 'Supabase', 'MariaDB', 'Snowflake',
    'BigQuery', 'Redshift', 'ClickHouse', 'Vector DB', 'Pinecone', 'Milvus', 'Chroma'
  ],
  cloud: [
    'AWS', 'Amazon Web Services', 'Azure', 'Microsoft Azure', 'Google Cloud Platform',
    'GCP', 'Google Cloud', 'Cloudflare', 'Vercel', 'Netlify', 'Heroku', 'DigitalOcean',
    'OpenStack', 'Serverless', 'Lambda', 'EC2', 'S3', 'CloudFront', 'ECS', 'EKS',
    'Cloud Run', 'App Engine', 'Azure Functions', 'IAM'
  ],
  devops: [
    'Docker', 'Kubernetes', 'K8s', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions',
    'GitLab CI', 'CircleCI', 'CI/CD', 'Helm', 'ArgoCD', 'Prometheus', 'Grafana',
    'Datadog', 'Splunk', 'ELK Stack', 'Nginx', 'Apache', 'Linux', 'Ubuntu', 'Debian',
    'CentOS', 'OpenTelemetry', 'Vault', 'Puppet', 'Chef'
  ],
  ai_ml: [
    'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'NLP',
    'Computer Vision', 'LLM', 'Large Language Models', 'Generative AI', 'GenAI',
    'Transformers', 'Hugging Face', 'LangChain', 'LlamaIndex', 'RAG', 'Prompt Engineering',
    'Reinforcement Learning', 'MLOps', 'Vector Embeddings', 'Fine-tuning', 'LoRA',
    'OpenAI API', 'Claude API', 'BERT', 'GPT'
  ],
  testing: [
    'Jest', 'Cypress', 'Playwright', 'Vitest', 'Mocha', 'Chai', 'Selenium',
    'JUnit', 'TestNG', 'PyTest', 'Postman', 'Unit Testing', 'Integration Testing',
    'E2E Testing', 'TDD', 'BDD', 'Load Testing', 'JMeter', 'Storybook', 'K6'
  ],
  security: [
    'OAuth', 'OAuth2', 'JWT', 'SAML', 'SSO', 'Penetration Testing', 'OWASP',
    'Cryptography', 'HTTPS', 'TLS', 'SSL', 'SOC2', 'GDPR', 'HIPAA', 'ISO 27001',
    'Vulnerability Assessment', 'Zero Trust', 'RBAC', 'WAF', 'DevSecOps', 'SIEM'
  ],
  tools: [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Figma',
    'Postman', 'Swagger', 'OpenAPI', 'VS Code', 'Webpack', 'Vite', 'Babel',
    'TurboRepo', 'npm', 'yarn', 'pnpm', 'Notion', 'Slack', 'Linear', 'Trello'
  ],
  soft_skills: [
    'Leadership', 'Team Leadership', 'Mentorship', 'Code Reviews', 'Agile',
    'Scrum', 'Kanban', 'Cross-Functional Collaboration', 'Communication',
    'Problem Solving', 'Critical Thinking', 'Project Management', 'Stakeholder Management',
    'Technical Writing', 'System Design', 'Architecture'
  ],
  domain_knowledge: [
    'FinTech', 'HealthTech', 'E-Commerce', 'SaaS', 'B2B', 'B2C', 'Distributed Systems',
    'Microservices', 'Event-Driven Architecture', 'High Availability', 'Fault Tolerance',
    'Payment Gateways', 'Stripe Integration', 'Real-Time Systems', 'WebSockets',
    'SEO', 'Accessibility', 'WCAG', 'Mobile Optimization'
  ],
};

export const SKILL_ALIASES: Record<string, string> = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'py': 'Python',
  'python': 'Python',
  'golang': 'Go',
  'go': 'Go',
  'react.js': 'React',
  'reactjs': 'React',
  'react': 'React',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'next': 'Next.js',
  'vue.js': 'Vue',
  'vuejs': 'Vue',
  'vue': 'Vue',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'node': 'Node.js',
  'express.js': 'Express',
  'expressjs': 'Express',
  'express': 'Express',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'gcp': 'Google Cloud Platform',
  'google cloud': 'Google Cloud Platform',
  'google cloud platform': 'Google Cloud Platform',
  'azure': 'Microsoft Azure',
  'ms azure': 'Microsoft Azure',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'ci/cd': 'CI/CD',
  'cicd': 'CI/CD',
  'continuous integration': 'CI/CD',
  'github actions': 'GitHub Actions',
  'gh actions': 'GitHub Actions',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'genai': 'Generative AI',
  'generative ai': 'Generative AI',
  'llms': 'Large Language Models',
  'llm': 'Large Language Models',
  'nlp': 'Natural Language Processing',
  'rag': 'RAG',
  'retrieval augmented generation': 'RAG',
  'ml': 'Machine Learning',
  'machine learning': 'Machine Learning',
  'ai': 'AI / Machine Learning',
  'tdd': 'Test-Driven Development',
  'test driven development': 'Test-Driven Development',
  'rest': 'REST APIs',
  'restful': 'REST APIs',
  'rest apis': 'REST APIs',
  'rest api': 'REST APIs',
  'graphql': 'GraphQL',
  'microservices': 'Microservices',
  'relational database': 'Relational Databases (SQL)',
  'relational databases': 'Relational Databases (SQL)',
  'rdbms': 'Relational Databases (SQL)',
  'nosql': 'NoSQL Databases',
};

export const TAXONOMY_RELATIONSHIPS: Array<{
  specific: string[];
  generalOrEcosystem: string;
  relationship: string;
  partialConfidence: number;
}> = [
  {
    specific: ['FastAPI', 'Flask', 'Django', 'Pandas', 'NumPy', 'PyTorch'],
    generalOrEcosystem: 'Python',
    relationship: 'is a framework/library in the Python ecosystem',
    partialConfidence: 0.85,
  },
  {
    specific: ['React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express'],
    generalOrEcosystem: 'JavaScript',
    relationship: 'is built on the JavaScript/TypeScript runtime',
    partialConfidence: 0.90,
  },
  {
    specific: ['PostgreSQL', 'MySQL', 'MSSQL', 'Oracle', 'MariaDB', 'SQLite'],
    generalOrEcosystem: 'Relational Databases (SQL)',
    relationship: 'is a relational SQL database engine',
    partialConfidence: 0.88,
  },
  {
    specific: ['PostgreSQL', 'MySQL', 'MSSQL', 'Oracle', 'SQLite'],
    generalOrEcosystem: 'SQL',
    relationship: 'utilizes the SQL query language',
    partialConfidence: 0.92,
  },
  {
    specific: ['MongoDB', 'DynamoDB', 'Cassandra', 'Couchbase', 'Redis'],
    generalOrEcosystem: 'NoSQL Databases',
    relationship: 'is a non-relational NoSQL database system',
    partialConfidence: 0.88,
  },
  {
    specific: ['Docker', 'Podman', 'Containerd'],
    generalOrEcosystem: 'Containerization',
    relationship: 'provides container packaging and runtime',
    partialConfidence: 0.90,
  },
  {
    specific: ['Kubernetes', 'Helm', 'ArgoCD'],
    generalOrEcosystem: 'Container Orchestration',
    relationship: 'manages container scheduling and orchestration',
    partialConfidence: 0.90,
  },
  {
    specific: ['AWS', 'GCP', 'Azure'],
    generalOrEcosystem: 'Cloud Computing',
    relationship: 'is a major public cloud infrastructure provider',
    partialConfidence: 0.85,
  },
  {
    specific: ['FastAPI', 'Express', 'NestJS', 'Spring Boot', 'Django', 'Rails', 'ASP.NET'],
    generalOrEcosystem: 'REST APIs',
    relationship: 'is commonly used for architecting backend REST API services',
    partialConfidence: 0.80,
  },
  {
    specific: ['Jest', 'Vitest', 'PyTest', 'JUnit', 'Mocha', 'Chai'],
    generalOrEcosystem: 'Unit Testing',
    relationship: 'is an automated unit test framework',
    partialConfidence: 0.85,
  },
];

export const ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'advised', 'analyzed', 'architected',
  'automated', 'boosted', 'budgeted', 'built', 'centralized', 'championed',
  'collaborated', 'conceptualized', 'consolidated', 'constructed', 'converted',
  'coordinated', 'created', 'customized', 'decreased', 'delivered', 'deployed',
  'designed', 'developed', 'devised', 'directed', 'distributed', 'documented',
  'doubled', 'drove', 'eliminated', 'enabled', 'engineered', 'enhanced',
  'established', 'evaluated', 'exceeded', 'executed', 'expanded', 'expedited',
  'formulated', 'fostered', 'founded', 'generated', 'governed', 'guided',
  'halted', 'headed', 'identified', 'implemented', 'improved', 'improvised',
  'increased', 'influenced', 'initiated', 'innovated', 'inspected', 'instituted',
  'instructed', 'integrated', 'invented', 'launched', 'led', 'leveraged',
  'maintained', 'managed', 'maximized', 'mentored', 'migrated', 'minimized',
  'modernized', 'monitored', 'motivated', 'negotiated', 'obtained', 'operated',
  'optimized', 'orchestrated', 'organized', 'originated', 'outperformed',
  'overhauled', 'oversaw', 'partnered', 'performed', 'pioneered', 'planned',
  'prepared', 'presented', 'produced', 'programmed', 'promoted', 'published',
  'rebuilt', 'recruited', 'redesigned', 'reduced', 'refactored', 'reorganized',
  'replaced', 'resolved', 'restructured', 'revamped', 'scaled', 'scheduled',
  'secured', 'simplified', 'slashed', 'solved', 'spearheaded', 'standardized',
  'streamlined', 'strengthened', 'structured', 'surpassed', 'synthesized',
  'targeted', 'trained', 'transformed', 'transitioned', 'translated', 'tripled',
  'uncovered', 'unified', 'updated', 'upgraded', 'validated', 'yielded',
] as const;

export const QUANTIFIABLE_PATTERNS = [
  /\b\d+(?:\.\d+)?%\b/i,
  /\$\s*\d+(?:[.,]\d+)*(?:\s*[kKmMbBtT]|\s*(?:thousand|million|billion))?\b/i,
  /\b\d+(?:[.,]\d+)*\s*(?:users?|customers?|clients?|subscribers?|accounts?|leads?|downloads?|views?|visitors?)\b/i,
  /\b\d+\s*[kKmMbBtT]\+?\s*(?:users?|customers?|clients?|requests?|events?|transactions?)\b/i,
  /\b(?:reduced|decreased|slashed|cut|improved|increased|boosted|saved|generated|delivered)\b/i,
  /\b(?:from|to)\s+\d+(?:\.\d+)?%?\s+(?:to|from)\s+\d+(?:\.\d+)?%?\b/i,
  /\b\d+x\b/i,
  /\b\d+\s*(?:ms|milliseconds?|seconds?|mins?|minutes?|hrs?|hours?|days?|weeks?|months?)\b/i,
  /\b\d+\s*(?:tb|gb|mb|terabytes?|gigabytes?|megabytes?)\b/i,
  /\bteam of \d+\b/i,
] as const;

export const SECTION_HEADERS = [
  'experience', 'work experience', 'employment', 'employment history',
  'work history', 'professional experience', 'career history', 'selected engagements', 'engagements',
  'education', 'educational background', 'academic background',
  'academic history', 'qualifications', 'academic credentials',
  'skills', 'technical skills', 'core competencies', 'competencies',
  'key skills', 'areas of expertise', 'proficiencies', 'technologies', 'tech stack',
  'projects', 'personal projects', 'key projects', 'notable projects',
  'selected projects', 'open source projects', 'portfolio',
  'certifications', 'licenses and certifications', 'certificates',
  'professional development', 'credentials',
  'summary', 'professional summary', 'executive summary', 'profile', 'core profile',
  'about me', 'career objective', 'objective',
  'achievements', 'key achievements', 'awards', 'honors', 'awards and honors',
  'publications', 'volunteer', 'volunteer experience', 'interests',
] as const;

export const WEAK_WORDS = [
  'responsible for', 'duties included', 'worked on', 'helped with',
  'assisted in', 'participated in', 'handled', 'was part of',
  'attempted to', 'tried to', 'involved in', 'familiar with',
  'exposure to', 'knowledge of', 'various tasks', 'day to day tasks',
  'stuff', 'things',
] as const;

/**
 * Returns a robust regular expression for detecting skills with accurate boundary checks.
 * Handles single-letter (C, R) and symbol-suffixed (C++, C#, .NET) skills without false-positives.
 */
export function getSkillRegex(skill: string): RegExp {
  const norm = skill.trim();
  if (norm === 'C' || norm.toLowerCase() === 'c') {
    return /(?:^|[^a-zA-Z0-9+#])C(?![+#a-zA-Z0-9])/i;
  }
  if (norm === 'C++' || norm.toLowerCase() === 'c++') {
    return /(?:^|[^a-zA-Z0-9])C\+\+(?:$|[^a-zA-Z0-9])/i;
  }
  if (norm === 'C#' || norm.toLowerCase() === 'c#') {
    return /(?:^|[^a-zA-Z0-9])C#(?:$|[^a-zA-Z0-9])/i;
  }
  if (norm === 'R' || norm.toLowerCase() === 'r') {
    return /(?:^|[^a-zA-Z0-9])R(?![a-zA-Z0-9])(?:$|[^a-zA-Z0-9])/i;
  }
  if (norm === 'Go' || norm.toLowerCase() === 'go') {
    return /(?:^|[^a-zA-Z0-9])Go(?![a-zA-Z0-9])(?:$|[^a-zA-Z0-9])/i;
  }
  const escaped = norm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, 'i');
}

