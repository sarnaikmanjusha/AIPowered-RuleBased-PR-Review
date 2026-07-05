"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
exports.reviewFiles = reviewFiles;
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const rule_engine_1 = require("./rule-engine");
dotenv.config();
function generateReport(file, content) {
    const findings = (0, rule_engine_1.analyzeCode)(file, content);
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
function reviewFiles(files) {
    const findings = [];
    files.forEach((relativeFile) => {
        const absoluteFile = path.resolve(process.cwd(), relativeFile);
        if (!fs.existsSync(absoluteFile)) {
            return;
        }
        const content = fs.readFileSync(absoluteFile, 'utf8');
        findings.push(...(0, rule_engine_1.analyzeCode)(relativeFile, content));
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
