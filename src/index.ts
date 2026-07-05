import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { analyzeCode } from './rule-engine';
import { ReviewReport } from './types';

dotenv.config();

export function generateReport(file: string, content: string): ReviewReport {
  const findings = analyzeCode(file, content);
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
    findings
  };
}

export function reviewFiles(files: string[]): ReviewReport {
  const findings: ReviewReport['findings'] = [];

  files.forEach((relativeFile) => {
    const absoluteFile = path.resolve(process.cwd(), relativeFile);
    if (!fs.existsSync(absoluteFile)) {
      return;
    }

    const content = fs.readFileSync(absoluteFile, 'utf8');
    findings.push(...analyzeCode(relativeFile, content));
  });

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
    findings
  };
}

if (require.main === module) {
  const report = reviewFiles(['tests/sample.spec.ts', 'tests/sample.ts']);
  console.log(JSON.stringify(report, null, 2));
}
