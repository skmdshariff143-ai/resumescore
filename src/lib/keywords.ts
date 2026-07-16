/**
 * Comprehensive keyword databases for resume analysis.
 *
 * Every constant is a flat array of lowercase strings (or RegExp objects for
 * patterns) so the scoring engine can perform fast, case-insensitive matching.
 */

// ---------------------------------------------------------------------------
// Action Verbs — categorised for reference, merged into a single exported set
// ---------------------------------------------------------------------------

/** Leadership-oriented action verbs. */
const LEADERSHIP_VERBS: readonly string[] = [
  'accelerated', 'achieved', 'administered', 'appointed', 'approved',
  'assigned', 'authorized', 'chaired', 'consolidated', 'coordinated',
  'decided', 'delegated', 'directed', 'eliminated', 'enforced',
  'established', 'executed', 'founded', 'governed', 'headed',
  'hired', 'hosted', 'improved', 'incorporated', 'increased',
  'initiated', 'inspected', 'instituted', 'led', 'managed',
  'mentored', 'motivated', 'navigated', 'orchestrated', 'organized',
  'oversaw', 'pioneered', 'planned', 'presided', 'prioritized',
  'produced', 'recommended', 'reorganized', 'replaced', 'restored',
  'reviewed', 'revitalized', 'spearheaded', 'streamlined', 'strengthened',
  'supervised', 'transformed', 'united',
] as const;

/** Technical / engineering action verbs. */
const TECHNICAL_VERBS: readonly string[] = [
  'administered', 'analyzed', 'architected', 'assembled', 'automated',
  'built', 'calculated', 'coded', 'compiled', 'computed',
  'configured', 'constructed', 'converted', 'customized', 'debugged',
  'deployed', 'designed', 'developed', 'devised', 'diagnosed',
  'digitized', 'engineered', 'fabricated', 'formulated', 'implemented',
  'installed', 'integrated', 'maintained', 'migrated', 'modeled',
  'monitored', 'networked', 'operated', 'optimized', 'overhauled',
  'programmed', 'provisioned', 'reengineered', 'refactored', 'rendered',
  'repaired', 'resolved', 'revamped', 'scaled', 'scripted',
  'secured', 'simplified', 'solved', 'standardized', 'systematized',
  'tested', 'troubleshot', 'upgraded', 'validated',
] as const;

/** Communication / collaboration action verbs. */
const COMMUNICATION_VERBS: readonly string[] = [
  'addressed', 'advertised', 'arbitrated', 'articulated', 'authored',
  'briefed', 'campaigned', 'clarified', 'collaborated', 'communicated',
  'composed', 'consulted', 'conveyed', 'convinced', 'corresponded',
  'counseled', 'critiqued', 'debated', 'defined', 'demonstrated',
  'drafted', 'edited', 'educated', 'elicited', 'enlisted',
  'explained', 'facilitated', 'formalized', 'influenced', 'informed',
  'interpreted', 'interviewed', 'justified', 'lectured', 'liaised',
  'marketed', 'mediated', 'moderated', 'negotiated', 'outlined',
  'participated', 'persuaded', 'pitched', 'presented', 'promoted',
  'proposed', 'publicized', 'reconciled', 'recruited', 'reported',
  'represented', 'synthesized', 'translated', 'wrote',
] as const;

/** Analytical / research action verbs. */
const ANALYTICAL_VERBS: readonly string[] = [
  'appraised', 'assessed', 'audited', 'benchmarked', 'budgeted',
  'centralized', 'charted', 'classified', 'collected', 'compared',
  'correlated', 'decreased', 'detected', 'determined', 'diagnosed',
  'discovered', 'dissected', 'estimated', 'evaluated', 'examined',
  'experimented', 'explored', 'extracted', 'forecasted', 'identified',
  'inspected', 'interpolated', 'investigated', 'mapped', 'measured',
  'observed', 'organized', 'projected', 'quantified', 'ranked',
  'rated', 'reduced', 'researched', 'reviewed', 'sampled',
  'screened', 'studied', 'summarized', 'surveyed', 'systematized',
  'tabulated', 'tested', 'tracked', 'verified',
] as const;

/** Creative / design action verbs. */
const CREATIVE_VERBS: readonly string[] = [
  'abstracted', 'adapted', 'brainstormed', 'composed', 'conceptualized',
  'crafted', 'created', 'cultivated', 'customized', 'designed',
  'developed', 'directed', 'envisioned', 'fashioned', 'founded',
  'generated', 'illustrated', 'imagined', 'improvised', 'innovated',
  'inspired', 'integrated', 'invented', 'launched', 'modeled',
  'originated', 'overhauled', 'performed', 'photographed', 'piloted',
  'planned', 'produced', 'redesigned', 'refined', 'reinvented',
  'remodeled', 'reshaped', 'revamped', 'revolutionized', 'shaped',
  'sketched', 'styled', 'visualized',
] as const;

/**
 * All 200+ strong action verbs, de-duplicated.
 * Categories are preserved above for reference but the engine matches against
 * this single set.
 */
export const ACTION_VERBS: readonly string[] = [
  ...new Set([
    ...LEADERSHIP_VERBS,
    ...TECHNICAL_VERBS,
    ...COMMUNICATION_VERBS,
    ...ANALYTICAL_VERBS,
    ...CREATIVE_VERBS,
  ]),
] as const;

// ---------------------------------------------------------------------------
// Technical Skills
// ---------------------------------------------------------------------------

/** Programming languages. */
const PROGRAMMING_LANGUAGES: readonly string[] = [
  'javascript', 'typescript', 'python', 'java', 'c', 'c++', 'c#',
  'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala',
  'r', 'matlab', 'perl', 'haskell', 'elixir', 'clojure', 'dart',
  'lua', 'objective-c', 'assembly', 'fortran', 'cobol', 'groovy',
  'julia', 'solidity', 'zig', 'ocaml', 'f#', 'erlang', 'bash',
  'shell', 'powershell', 'sql', 'plsql', 'html', 'css', 'sass',
  'less', 'graphql', 'wasm', 'webassembly',
] as const;

/** Frameworks & libraries. */
const FRAMEWORKS: readonly string[] = [
  'react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'angular',
  'vue', 'vue.js', 'vuejs', 'svelte', 'sveltekit', 'nuxt', 'nuxt.js',
  'gatsby', 'remix', 'astro', 'express', 'express.js', 'nestjs',
  'fastify', 'koa', 'django', 'flask', 'fastapi', 'spring',
  'spring boot', 'rails', 'ruby on rails', 'laravel', 'symfony',
  '.net', 'asp.net', 'blazor', 'gin', 'fiber', 'echo',
  'flutter', 'react native', 'electron', 'tauri', 'ionic',
  'tailwindcss', 'tailwind', 'bootstrap', 'material ui', 'chakra ui',
  'ant design', 'styled-components', 'emotion', 'redux', 'mobx',
  'zustand', 'jotai', 'recoil', 'tanstack query', 'react query',
  'trpc', 'prisma', 'drizzle', 'sequelize', 'typeorm', 'hibernate',
  'mongoose', 'apollo', 'relay', 'storybook', 'jest', 'vitest',
  'mocha', 'cypress', 'playwright', 'selenium', 'puppeteer',
  'pytorch', 'tensorflow', 'keras', 'scikit-learn', 'pandas',
  'numpy', 'scipy', 'matplotlib', 'seaborn', 'plotly', 'opencv',
  'hugging face', 'langchain', 'llamaindex',
] as const;

/** Databases & data stores. */
const DATABASES: readonly string[] = [
  'postgresql', 'postgres', 'mysql', 'mariadb', 'sqlite', 'oracle',
  'sql server', 'mssql', 'mongodb', 'dynamodb', 'cassandra',
  'couchdb', 'couchbase', 'firebase', 'firestore', 'supabase',
  'redis', 'memcached', 'elasticsearch', 'opensearch', 'neo4j',
  'arangodb', 'cockroachdb', 'planetscale', 'neon', 'turso',
  'clickhouse', 'snowflake', 'bigquery', 'redshift', 'databricks',
  'pinecone', 'weaviate', 'milvus', 'qdrant', 'chroma',
] as const;

/** Cloud platforms & services. */
const CLOUD: readonly string[] = [
  'aws', 'amazon web services', 'azure', 'microsoft azure',
  'gcp', 'google cloud', 'google cloud platform', 'heroku',
  'vercel', 'netlify', 'cloudflare', 'digitalocean', 'linode',
  'fly.io', 'railway', 'render', 'ec2', 's3', 'lambda',
  'api gateway', 'cloudfront', 'route 53', 'sqs', 'sns', 'ses',
  'ecs', 'eks', 'fargate', 'rds', 'aurora', 'elasticache',
  'cloud functions', 'cloud run', 'app engine', 'compute engine',
  'azure functions', 'azure devops', 'azure ad',
] as const;

/** DevOps, CI/CD & infrastructure. */
const DEVOPS: readonly string[] = [
  'docker', 'kubernetes', 'k8s', 'helm', 'terraform', 'pulumi',
  'ansible', 'chef', 'puppet', 'vagrant', 'packer', 'consul',
  'vault', 'istio', 'envoy', 'nginx', 'apache', 'caddy',
  'jenkins', 'github actions', 'gitlab ci', 'circleci', 'travis ci',
  'argo cd', 'flux', 'spinnaker', 'tekton', 'buildkite',
  'prometheus', 'grafana', 'datadog', 'new relic', 'splunk',
  'elk stack', 'logstash', 'kibana', 'jaeger', 'opentelemetry',
  'sentry', 'pagerduty', 'opsgenie', 'linux', 'unix', 'bash',
  'git', 'github', 'gitlab', 'bitbucket', 'svn',
  'ci/cd', 'infrastructure as code', 'iac', 'microservices',
  'serverless', 'service mesh', 'load balancing', 'cdn',
] as const;

/** AI / ML / Data Science tools & concepts. */
const AI_ML: readonly string[] = [
  'machine learning', 'deep learning', 'neural networks',
  'natural language processing', 'nlp', 'computer vision',
  'reinforcement learning', 'generative ai', 'llm',
  'large language model', 'transformer', 'bert', 'gpt',
  'stable diffusion', 'gan', 'cnn', 'rnn', 'lstm',
  'random forest', 'xgboost', 'gradient boosting', 'svm',
  'k-means', 'pca', 'feature engineering', 'model training',
  'model deployment', 'mlops', 'mlflow', 'kubeflow', 'sagemaker',
  'vertex ai', 'azure ml', 'data pipeline', 'etl', 'elt',
  'data warehouse', 'data lake', 'data modeling', 'a/b testing',
  'statistical analysis', 'regression', 'classification',
  'clustering', 'time series', 'recommendation system',
  'apache spark', 'hadoop', 'kafka', 'airflow', 'dbt',
  'tableau', 'power bi', 'looker', 'metabase', 'jupyter',
  'colab', 'rag', 'retrieval augmented generation', 'fine-tuning',
  'prompt engineering',
] as const;

/** All technical skills, de-duplicated. */
export const TECHNICAL_SKILLS: readonly string[] = [
  ...new Set([
    ...PROGRAMMING_LANGUAGES,
    ...FRAMEWORKS,
    ...DATABASES,
    ...CLOUD,
    ...DEVOPS,
    ...AI_ML,
  ]),
] as const;

// ---------------------------------------------------------------------------
// Soft Skills
// ---------------------------------------------------------------------------

export const SOFT_SKILLS: readonly string[] = [
  'communication', 'teamwork', 'collaboration', 'leadership',
  'problem solving', 'problem-solving', 'critical thinking',
  'analytical thinking', 'creativity', 'adaptability', 'flexibility',
  'time management', 'organization', 'attention to detail',
  'work ethic', 'self-motivated', 'initiative', 'interpersonal',
  'conflict resolution', 'decision making', 'decision-making',
  'emotional intelligence', 'empathy', 'active listening',
  'public speaking', 'presentation', 'negotiation', 'persuasion',
  'mentoring', 'coaching', 'strategic thinking', 'planning',
  'project management', 'risk management', 'stakeholder management',
  'cross-functional', 'multitasking', 'prioritization',
  'accountability', 'reliability', 'dependability', 'resilience',
  'growth mindset', 'continuous learning', 'agile', 'scrum',
  'customer focus', 'customer service', 'client relations',
  'relationship building', 'networking', 'cultural awareness',
  'diversity', 'inclusion', 'innovation', 'entrepreneurial',
  'results-oriented', 'detail-oriented', 'goal-oriented',
  'self-starter', 'proactive', 'resourceful', 'autonomous',
] as const;

// ---------------------------------------------------------------------------
// Education Keywords
// ---------------------------------------------------------------------------

export const EDUCATION_KEYWORDS: readonly string[] = [
  // Degree types
  'bachelor', 'bachelors', "bachelor's", 'b.s.', 'b.a.', 'b.sc.', 'b.eng.',
  'master', 'masters', "master's", 'm.s.', 'm.a.', 'm.sc.', 'm.eng.', 'mba',
  'doctor', 'doctorate', 'ph.d.', 'phd', 'd.sc.', 'ed.d.',
  'associate', 'associates', "associate's", 'a.s.', 'a.a.',
  'diploma', 'certificate', 'certification',
  'degree', 'major', 'minor', 'concentration', 'specialization',
  // Honors & distinctions
  'summa cum laude', 'magna cum laude', 'cum laude',
  'honors', 'honour', 'dean\'s list', 'valedictorian', 'salutatorian',
  'distinction', 'merit', 'first class', 'second class',
  // GPA
  'gpa', 'grade point average', 'cgpa',
  // Certifications
  'aws certified', 'azure certified', 'google certified',
  'pmp', 'scrum master', 'csm', 'cissp', 'ceh',
  'comptia', 'ccna', 'ccnp', 'cka', 'ckad',
  'cpa', 'cfa', 'frm', 'six sigma', 'itil',
  'certified', 'accredited', 'licensed', 'registered',
  // Other
  'coursework', 'thesis', 'dissertation', 'capstone', 'research',
  'study abroad', 'exchange program', 'bootcamp', 'nanodegree',
  'professional development', 'continuing education',
  'university', 'college', 'institute', 'school', 'academy',
] as const;

// ---------------------------------------------------------------------------
// Section Headers
// ---------------------------------------------------------------------------

/** Common resume section header names (lowercased for matching). */
export const SECTION_HEADERS: readonly string[] = [
  'summary', 'professional summary', 'executive summary', 'objective',
  'career objective', 'profile', 'about', 'about me', 'overview',
  'experience', 'work experience', 'professional experience',
  'employment history', 'work history', 'career history',
  'education', 'academic background', 'academic history',
  'skills', 'technical skills', 'core competencies', 'competencies',
  'key skills', 'areas of expertise', 'proficiencies',
  'projects', 'personal projects', 'key projects', 'selected projects',
  'certifications', 'licenses', 'credentials',
  'awards', 'honors', 'achievements', 'accomplishments',
  'publications', 'papers', 'research',
  'volunteer', 'volunteer experience', 'community involvement',
  'extracurricular', 'activities', 'interests', 'hobbies',
  'languages', 'references', 'portfolio',
  'leadership', 'leadership experience',
  'training', 'professional development',
  'organizations', 'affiliations', 'memberships',
] as const;

// ---------------------------------------------------------------------------
// Weak Words & Phrases
// ---------------------------------------------------------------------------

/** Words and phrases that weaken resume impact. */
export const WEAK_WORDS: readonly string[] = [
  'responsible for', 'duties included', 'helped', 'assisted with',
  'worked on', 'involved in', 'participated in', 'tasked with',
  'in charge of', 'handled', 'dealt with', 'familiar with',
  'exposure to', 'utilized', 'various', 'numerous', 'several',
  'some experience', 'basic knowledge', 'understanding of',
  'hard worker', 'team player', 'go-getter', 'think outside the box',
  'self-starter', 'detail-oriented', 'results-driven',
  'fast learner', 'people person', 'synergy', 'leverage',
  'etc', 'and so on', 'and more', 'things like',
  'really', 'very', 'just', 'maybe', 'perhaps',
  'i think', 'i believe', 'i feel', 'try to', 'attempted to',
] as const;

// ---------------------------------------------------------------------------
// Quantifiable Achievement Patterns
// ---------------------------------------------------------------------------

/**
 * Regular expressions that match quantifiable achievements —
 * numbers, percentages, dollar amounts, and results-oriented phrasing.
 *
 * All patterns use the case-insensitive flag.
 */
export const QUANTIFIABLE_PATTERNS: readonly RegExp[] = [
  // Percentages: "15%", "increased by 20%", "reduced 30 percent"
  /\d+\s*%/i,
  /\d+\s*percent/i,

  // Dollar / currency amounts: "$1M", "$500K", "$2.5 million"
  /\$[\d,.]+\s*[kmbt]?\b/i,
  /\$[\d,.]+\s*(thousand|million|billion|trillion)/i,
  /\d+\s*(thousand|million|billion|trillion)\s*dollars/i,

  // Plain large numbers: "1,000", "500K users"
  /\d{1,3}(,\d{3})+/i,
  /\d+\s*[kmbt]\b/i,

  // Multipliers: "2x", "3x faster", "10x growth"
  /\d+(\.\d+)?\s*x\b/i,

  // Time-related metrics: "within 3 months", "in 6 weeks"
  /(?:within|in|over|under)\s+\d+\s*(days?|weeks?|months?|years?|quarters?|sprints?)/i,

  // Growth / reduction phrases
  /(?:increased|decreased|reduced|improved|boosted|grew|cut|saved|generated|delivered|drove|raised|lowered|expanded|shrank|accelerated|gained)\s+(?:by\s+)?\d+/i,

  // Rankings & counts: "top 5%", "#1", "1st place", "20+ clients"
  /top\s+\d+/i,
  /#\d+/i,
  /\d+(?:st|nd|rd|th)\s+(?:place|rank|percentile)/i,
  /\d+\+?\s*(clients?|customers?|users?|employees?|team members?|engineers?|projects?|applications?|servers?|endpoints?|features?|products?|releases?|deployments?|repositories?|microservices?)/i,

  // Ratings & scores: "4.8/5", "98/100"
  /\d+(\.\d+)?\/\d+/i,

  // Hours / effort: "saved 200 hours", "40 hours per week"
  /\d+\s*hours?/i,

  // Revenue / ROI
  /roi\s+of\s+\d+/i,
  /revenue\s+of\s+\$?[\d,.]+/i,
] as const;
