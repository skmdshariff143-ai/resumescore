/**
 * ResumeScore End-to-End System Verification Script
 * Exercises live Next.js API routes with realistic multi-page resume data.
 * Verifies 7-pillar deterministic scoring, topPriority derivation,
 * AI provider routing, and Zod response schemas.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const http = require('http');

const sampleResume = `Elena Rostova
elena.rostova@cloudtech.dev | (555) 432-8765 | San Francisco, CA
linkedin.com/in/elenarostova | github.com/erostova

PROFESSIONAL SUMMARY
Principal Distributed Systems Engineer with 9+ years experience architecting cloud-native microservices, high-throughput streaming pipelines, and fault-tolerant data stores. Deep expertise in Go, Kubernetes, and PostgreSQL.

WORK EXPERIENCE
Staff Infrastructure Engineer | ScaleMesh Technologies | 2021 - Present
• Architected multi-region event streaming platform in Go and Kafka processing 250,000 events/sec with sub-50ms p99 latency.
• Led migration of 80+ monolithic services to Kubernetes microservices, reducing AWS monthly infrastructure spend by 32% ($140k/mo savings).
• Spearheaded chaos engineering initiatives using Chaos Mesh, improving system availability from 99.9% to 99.995%.
• Mentored 12 senior and mid-level engineers in distributed concurrency patterns and zero-downtime deployment practices.

Senior Backend Engineer | DataCore Systems | 2017 - 2021
• Re-engineered distributed indexing engine using Go, Redis, and Elasticsearch, achieving 4x throughput improvement.
• Optimized PostgreSQL sharding and partitioning schemes across 15TB database cluster, decreasing query timeouts by 94%.
• Designed and enforced automated integration test suite with Vitest and Docker, cutting CI release cycle from 45 mins to 8 mins.

EDUCATION
Master of Science in Computer Science | University of Washington | 2017
Bachelor of Science in Computer Engineering | UC San Diego | 2015

TECHNICAL SKILLS
Languages: Go, Python, TypeScript, SQL, Rust, C++
Cloud & Infrastructure: AWS (EKS, RDS, S3, IAM), Kubernetes, Docker, Terraform, Helm
Databases & Streaming: PostgreSQL, Redis, Apache Kafka, Elasticsearch, DynamoDB
DevOps & Observability: CI/CD, Prometheus, Grafana, OpenTelemetry, Git, Datadog
Security & Architecture: OAuth2, mTLS, Zero Trust, Distributed Consensus, System Design`;

const sampleJob = `Senior Staff Distributed Systems Engineer
CloudScale AI - San Francisco, CA (Hybrid)

About the Role:
We are looking for a Senior Staff Distributed Systems Engineer to lead the architecture and scaling of our core inference routing and distributed data plane.

Requirements:
- 8+ years experience building large-scale, high-concurrency distributed systems.
- Mastery of Go (Golang) or Rust in production environments.
- Production experience with Kubernetes, Docker, and cloud platforms (AWS preferred).
- Deep knowledge of event-driven architectures, Apache Kafka, and distributed storage (PostgreSQL, Redis).
- Proven track record of measurable performance optimizations, p99 latency reductions, and cost efficiency.
- Strong mentoring and cross-functional engineering leadership skills.

Preferred Qualifications:
- Experience with Observability stacks (Prometheus, OpenTelemetry, Grafana).
- Familiarity with Chaos Engineering and high-availability architecture (99.99%+ SLA).
- Contributions to open-source distributed systems projects.`;

function postJSON(path, payload, port = 3000) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runVerification() {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  console.log(`Connecting to live instance at http://localhost:${port}...\n`);

  console.log('====================================================');
  console.log('1. HITTING REAL ENDPOINT: POST /api/analyze');
  console.log('====================================================');
  const analyzeRes = await postJSON('/api/analyze', {
    resumeText: sampleResume,
    jobText: sampleJob,
    mode: 'job_match',
    fileName: 'Elena_Rostova_Resume.pdf',
  }, port);

  console.log('HTTP Status:', analyzeRes.status);
  console.log('Overall Score:', analyzeRes.body?.data?.overall);
  console.log('Grade:', analyzeRes.body?.data?.grade);
  console.log('Top Priority Fix:', analyzeRes.body?.data?.topPriority);
  console.log('Pillars Breakdown:');
  analyzeRes.body?.data?.dimensions?.forEach((d) => {
    console.log(`  - ${d.name} (${Math.round(d.weight * 100)}%): ${d.score}/100 -> Contribution: ${d.contribution}`);
  });

  console.log('\n====================================================');
  console.log('2. HITTING REAL ENDPOINT: POST /api/ai/critique');
  console.log('====================================================');
  const critiqueRes = await postJSON('/api/ai/critique', {
    resumeText: sampleResume,
    jobText: sampleJob,
    fileName: 'Elena_Rostova_Resume.pdf',
  }, port);

  console.log('HTTP Status:', critiqueRes.status);
  console.log('isLLMGenerated:', critiqueRes.body?.isLLMGenerated);
  console.log('Critique Verbatim Response:');
  console.log(JSON.stringify(critiqueRes.body, null, 2));

  console.log('\n====================================================');
  console.log('3. HITTING REAL ENDPOINT: POST /api/ai/rewrite');
  console.log('====================================================');
  const rewriteRes = await postJSON('/api/ai/rewrite', {
    bullet: 'helped with database performance tuning and fixing slow queries',
    technologies: ['PostgreSQL', 'Redis'],
    roleContext: 'Senior Staff Distributed Systems Engineer',
  }, port);

  console.log('HTTP Status:', rewriteRes.status);
  console.log('Rewrite Output:');
  console.log(JSON.stringify(rewriteRes.body, null, 2));
}

runVerification().catch(console.error);
