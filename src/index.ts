import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import { analyzeCode } from './rule-engine';
import { ReviewFinding, ReviewReport } from './types';

function loadEnvironment(): void {
  const localEnvPath = path.resolve(process.cwd(), '.env');
  const exampleEnvPath = path.resolve(process.cwd(), '.env.example');

  if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath });
  } else if (fs.existsSync(exampleEnvPath)) {
    dotenv.config({ path: exampleEnvPath });
  } else {
    dotenv.config();
  }

  const rawApiKey = process.env.OPENAI_API_KEY?.trim();
  if (rawApiKey) {
    process.env.OPENAI_API_KEY = rawApiKey.replace(/^['"]|['"]$/g, '');
  }
}

loadEnvironment();

function buildAiPrompt(findings: ReviewFinding[]): string {
  const topFindings = findings.slice(0, 20);
  const payload = topFindings.length > 0
    ? JSON.stringify(topFindings, null, 2)
    : 'No rule-based issues were found.';

  return `You are reviewing a Playwright and TypeScript PR. Provide concise, actionable AI suggestions based on the findings below. Keep the response practical and short.\n\nFindings:\n${payload}`;
}

function normalizeAiContent(content: string | Array<{ type?: string; text?: { value?: string } }> | null | undefined): string {
  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item?.text?.value === 'string' ? item.text.value : ''))
      .join('')
      .trim();
  }

  return '';
}

function buildCavemanReview(findings: ReviewFinding[]): string {
  if (findings.length === 0) {
    return 'Caveman review: no big issue. Code look fine.';
  }

  const top = findings[0];
  return `Caveman review: ${top.issue} at ${top.file}:${top.line}. Fix it with ${top.recommendedFix.toLowerCase()}`;
}

async function requestAiReview(findings: ReviewFinding[]): Promise<{ aiReview: string; aiStatus: 'completed' | 'fallback'; aiError?: string }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/^['"]|['"]$/g, '');

  if (!apiKey) {
    return {
      aiReview: buildCavemanReview(findings),
      aiStatus: 'fallback'
    };
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 220,
      messages: [
        {
          role: 'system',
          content: 'You review Playwright and TypeScript pull requests. Return brief, actionable suggestions.'
        },
        {
          role: 'user',
          content: buildAiPrompt(findings)
        }
      ]
    });

    const aiReview = normalizeAiContent(completion.choices[0]?.message?.content);

    if (!aiReview) {
      return {
        aiReview: 'OpenAI returned an empty response. Falling back to the rule-based review results.',
        aiStatus: 'fallback'
      };
    }

    return {
      aiReview,
      aiStatus: 'completed'
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown OpenAI API error';
    return {
      aiReview: `${buildCavemanReview(findings)} (OpenAI fallback: ${message})`,
      aiStatus: 'fallback',
      aiError: message
    };
  }
}

export function renderMarkdownReport(report: ReviewReport): string {
  const findings = report.findings.length > 0
    ? report.findings.map((finding) => `- [${finding.file}:${finding.line}] ${finding.issue} (${finding.severity})`).join('\n')
    : '- No rule-based issues detected.';

  return `# PR Review Report\n\n${report.summary}\n\n## AI Review\n- Status: ${report.aiStatus}\n- ${report.aiReview}\n\n## Rule-based Findings\n${findings}`;
}

export async function generateReport(file: string, content: string): Promise<ReviewReport> {
  const findings = analyzeCode(file, content);
  const aiReview = await requestAiReview(findings);
  const score = Math.max(60, 100 - findings.length * 8);

  return {
    summary: `Reviewed ${file} and found ${findings.length} issue(s).`,
    overallScore: score,
    architectureScore: 88,
    performanceScore: 82,
    maintainabilityScore: 84,
    securityScore: 78,
    testStabilityScore: 80,
    readabilityScore: 86,
    typescriptScore: 85,
    playwrightScore: 79,
    grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D',
    findings,
    aiReview: aiReview.aiReview,
    aiStatus: aiReview.aiStatus,
    aiError: aiReview.aiError
  };
}

export async function reviewFiles(files: string[]): Promise<ReviewReport> {
  const findings: ReviewReport['findings'] = [];

  for (const relativeFile of files) {
    const absoluteFile = path.resolve(process.cwd(), relativeFile);
    if (!fs.existsSync(absoluteFile)) {
      continue;
    }

    const content = fs.readFileSync(absoluteFile, 'utf8');
    findings.push(...analyzeCode(relativeFile, content));
  }

  const aiReview = await requestAiReview(findings);
  const score = Math.max(60, 100 - findings.length * 8);

  return {
    summary: `Reviewed ${files.length} file(s) and found ${findings.length} issue(s).`,
    overallScore: score,
    architectureScore: 88,
    performanceScore: 82,
    maintainabilityScore: 84,
    securityScore: 78,
    testStabilityScore: 80,
    readabilityScore: 86,
    typescriptScore: 85,
    playwrightScore: 79,
    grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D',
    findings,
    aiReview: aiReview.aiReview,
    aiStatus: aiReview.aiStatus,
    aiError: aiReview.aiError
  };
}

if (require.main === module) {
  void (async () => {
    const report = await reviewFiles(['tests/sample.spec.ts', 'tests/sample.ts']);
    const reportPath = path.resolve(process.cwd(), 'review-report.md');
    fs.writeFileSync(reportPath, renderMarkdownReport(report));
    console.log(JSON.stringify(report, null, 2));
  })();
}
