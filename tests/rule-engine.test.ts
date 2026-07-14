import { analyzeCode } from '../src/rule-engine';
import { reviewFiles } from '../src/index';

describe('rule-engine', () => {
  it('detects waitForTimeout usage', () => {
    const findings = analyzeCode('tests/sample.spec.ts', 'await page.waitForTimeout(5000);');
    expect(findings.some((finding) => finding.rule === 'no-wait-for-timeout')).toBe(true);
  });

  it('detects hardcoded secrets', () => {
    const findings = analyzeCode('tests/sample.ts', "const token = 'abc123';");
    expect(findings.some((finding) => finding.rule === 'no-hardcoded-secrets')).toBe(true);
  });

  it('detects legacy page dollar usage', () => {
    const findings = analyzeCode('tests/sample.spec.ts', 'const element = await page.$("#save");');
    expect(findings.some((finding) => finding.rule === 'avoid-page-dollar')).toBe(true);
  });

  it('detects unsafe any usage in TypeScript', () => {
    const findings = analyzeCode('tests/sample.ts', 'const data: any = await response.json();');
    expect(findings.some((finding) => finding.rule === 'no-any')).toBe(true);
  });

  it('reviews actual sample files from disk and returns multiple findings', async () => {
    const report = await reviewFiles(['tests/sample.spec.ts', 'tests/sample.ts']);
    expect(report.findings.length).toBeGreaterThan(2);
    expect(report.findings.some((finding) => finding.rule === 'no-wait-for-timeout')).toBe(true);
    expect(report.findings.some((finding) => finding.rule === 'no-hardcoded-secrets')).toBe(true);
    expect(report.findings.some((finding) => finding.rule === 'avoid-page-dollar')).toBe(true);
    expect(report.findings.some((finding) => finding.rule === 'no-any')).toBe(true);
  });

  it('falls back gracefully when no OpenAI API key is configured', async () => {
    delete process.env.OPENAI_API_KEY;
    const report = await reviewFiles(['tests/sample.spec.ts', 'tests/sample.ts']);
    expect(report.aiStatus).toBe('fallback');
    expect(report.aiReview.toLowerCase()).toContain('rule-based review');
  });
});
