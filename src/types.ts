export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface ReviewFinding {
  file: string;
  line: number;
  category: string;
  severity: Severity;
  rule: string;
  issue: string;
  whyItMatters: string;
  recommendedFix: string;
  suggestedCode: string;
  confidence: number;
}

export interface ReviewReport {
  summary: string;
  overallScore: number;
  architectureScore: number;
  performanceScore: number;
  maintainabilityScore: number;
  securityScore: number;
  testStabilityScore: number;
  readabilityScore: number;
  typescriptScore: number;
  playwrightScore: number;
  grade: string;
  findings: ReviewFinding[];
  aiReview: string;
  aiStatus: 'completed' | 'fallback';
  aiError?: string;
}
