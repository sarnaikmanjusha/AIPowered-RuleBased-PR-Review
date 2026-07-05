import { ReviewFinding } from './types';

interface RuleDefinition {
  rule: string;
  category: string;
  severity: ReviewFinding['severity'];
  issue: string;
  whyItMatters: string;
  recommendedFix: string;
  suggestedCode: string;
  confidence: number;
  matcher: (line: string) => boolean;
}

const RULES: RuleDefinition[] = [
  {
    rule: 'no-wait-for-timeout',
    category: 'Playwright',
    severity: 'High',
    issue: 'Use of waitForTimeout is discouraged in Playwright tests.',
    whyItMatters: 'It introduces flaky waits and slows the suite.',
    recommendedFix: 'Replace it with auto-waiting locators or explicit expect polling.',
    suggestedCode: "await expect(page.getByRole('button', { name: /Submit/ })).toBeVisible();",
    confidence: 0.98,
    matcher: (line) => line.includes('waitForTimeout')
  },
  {
    rule: 'no-hardcoded-secrets',
    category: 'Security',
    severity: 'Critical',
    issue: 'Potential hardcoded secret detected.',
    whyItMatters: 'Hardcoded secrets can be exposed in source control.',
    recommendedFix: 'Move secrets to environment variables or secure secret stores.',
    suggestedCode: 'const token = process.env.API_TOKEN;',
    confidence: 0.95,
    matcher: (line) => /(token|secret|password|api[_-]?key)/i.test(line)
  },
  {
    rule: 'avoid-page-dollar',
    category: 'Playwright',
    severity: 'Medium',
    issue: 'Legacy page.$ usage detected.',
    whyItMatters: 'The Locator API is preferred for stability and readability.',
    recommendedFix: 'Use locator APIs such as page.getByRole or page.getByTestId.',
    suggestedCode: "const button = page.getByRole('button', { name: /Submit/ });",
    confidence: 0.9,
    matcher: (line) => line.includes('page.$(') || line.includes('page.$$(')
  },
  {
    rule: 'no-any',
    category: 'TypeScript',
    severity: 'High',
    issue: 'The use of `any` weakens type safety.',
    whyItMatters: 'It hides real defects and makes refactoring riskier.',
    recommendedFix: 'Replace `any` with a specific type or narrow it through `unknown`.',
    suggestedCode: 'const data: ApiResponse = await response.json();',
    confidence: 0.94,
    matcher: (line) => /:\s*any\b|as any\b/i.test(line)
  },
  {
    rule: 'no-non-null-assertion',
    category: 'TypeScript',
    severity: 'Medium',
    issue: 'Non-null assertion detected.',
    whyItMatters: 'It can mask runtime errors and make undefined states harder to reason about.',
    recommendedFix: 'Guard the value or use a safe fallback.',
    suggestedCode: 'const value = response.data?.id ?? "unknown";',
    confidence: 0.89,
    matcher: (line) => /!\./.test(line) || /!\s*;/.test(line)
  },
  {
    rule: 'avoid-hardcoded-urls',
    category: 'Architecture',
    severity: 'Medium',
    issue: 'Environment-specific configuration appears hardcoded.',
    whyItMatters: 'Hardcoded URLs make environment switching harder and increase drift.',
    recommendedFix: 'Move environment-dependent values to a shared config module.',
    suggestedCode: 'const baseUrl = process.env.BASE_URL;',
    confidence: 0.87,
    matcher: (line) => /https?:\/\//i.test(line) && !line.includes('process.env')
  },
  {
    rule: 'avoid-console-log-sensitive-data',
    category: 'Security',
    severity: 'Medium',
    issue: 'Sensitive data may be logged.',
    whyItMatters: 'Logs can expose credentials or PII to CI systems and developers.',
    recommendedFix: 'Log only safe metadata and redact sensitive values.',
    suggestedCode: "console.log('login completed for user', user.id);",
    confidence: 0.88,
    matcher: (line) => /console\.log\(|console\.error\(/i.test(line) && /(token|password|secret|email|name)/i.test(line)
  },
  {
    rule: 'avoid-duplicate-setup',
    category: 'Maintainability',
    severity: 'Medium',
    issue: 'Repeated setup logic may indicate duplicated test scaffolding.',
    whyItMatters: 'Duplication makes maintenance and updates more expensive.',
    recommendedFix: 'Extract shared setup into fixtures or helpers.',
    suggestedCode: 'const authenticatedUser = await createAuthenticatedUser();',
    confidence: 0.82,
    matcher: (line) => /beforeEach|beforeAll|login\(|authenticate/i.test(line)
  }
];

export function analyzeCode(file: string, content: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    RULES.forEach((rule) => {
      if (rule.matcher(line)) {
        findings.push({
          file,
          line: lineNumber,
          category: rule.category,
          severity: rule.severity,
          rule: rule.rule,
          issue: rule.issue,
          whyItMatters: rule.whyItMatters,
          recommendedFix: rule.recommendedFix,
          suggestedCode: rule.suggestedCode,
          confidence: rule.confidence
        });
      }
    });
  });

  return findings;
}
