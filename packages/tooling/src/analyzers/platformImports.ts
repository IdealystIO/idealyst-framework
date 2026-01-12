import {
  AnalyzerOptions,
  AnalysisResult,
  FileInput,
  ImportInfo,
  Severity,
  Violation,
  ViolationType,
} from '../types';
import { classifyFile } from '../utils/fileClassifier';
import { parseImports } from '../utils/importParser';
import {
  REACT_NATIVE_SOURCES,
  isReactNativePrimitive,
} from '../rules/reactNativePrimitives';
import {
  isReactDomPrimitive,
} from '../rules/reactDomPrimitives';

/**
 * Default analyzer options
 */
const DEFAULT_OPTIONS: Required<AnalyzerOptions> = {
  severity: 'error',
  additionalNativePrimitives: [],
  additionalDomPrimitives: [],
  ignoredPrimitives: [],
  ignoredPatterns: [],
  additionalNativeSources: [],
  additionalDomSources: [],
};

/**
 * Check if a file path matches any of the ignored patterns
 */
function matchesIgnoredPattern(
  filePath: string,
  patterns: string[]
): boolean {
  if (patterns.length === 0) return false;

  for (const pattern of patterns) {
    // Simple glob matching - convert glob to regex
    const regexPattern = pattern
      .replace(/\*\*/g, '{{GLOBSTAR}}')
      .replace(/\*/g, '[^/]*')
      .replace(/{{GLOBSTAR}}/g, '.*')
      .replace(/\?/g, '.');

    const regex = new RegExp(regexPattern);
    if (regex.test(filePath)) {
      return true;
    }
  }

  return false;
}

/**
 * Creates a violation object
 */
function createViolation(
  type: ViolationType,
  primitive: string,
  source: string,
  filePath: string,
  line: number,
  column: number,
  severity: Severity
): Violation {
  const messages: Record<ViolationType, string> = {
    'native-in-shared': `React Native primitive '${primitive}' from '${source}' should not be used in shared files. Use a .native.tsx file instead.`,
    'dom-in-shared': `React DOM primitive '${primitive}' from '${source}' should not be used in shared files. Use a .web.tsx file instead.`,
    'native-in-web': `React Native primitive '${primitive}' from '${source}' should not be used in web-specific files.`,
    'dom-in-native': `React DOM primitive '${primitive}' from '${source}' should not be used in native-specific files.`,
  };

  return {
    type,
    primitive,
    source,
    filePath,
    line,
    column,
    message: messages[type],
    severity,
  };
}

/**
 * Check if an import should be flagged as a React Native primitive
 */
function isNativePrimitive(
  importInfo: ImportInfo,
  additionalPrimitives: string[]
): boolean {
  const name = importInfo.originalName ?? importInfo.name;

  // Check built-in primitives
  if (isReactNativePrimitive(name)) return true;

  // Check additional primitives
  if (additionalPrimitives.includes(name)) return true;

  // Check if the source is a known React Native source
  const nativeSources: Set<string> = new Set([...REACT_NATIVE_SOURCES]);
  if (nativeSources.has(importInfo.source)) {
    // Any import from react-native that's a component (starts with uppercase)
    if (/^[A-Z]/.test(name)) return true;
  }

  return false;
}

/**
 * Check if an import should be flagged as a React DOM primitive
 */
function isDomPrimitive(
  importInfo: ImportInfo,
  additionalPrimitives: string[]
): boolean {
  const name = importInfo.originalName ?? importInfo.name;

  // Check built-in primitives
  if (isReactDomPrimitive(name)) return true;

  // Check additional primitives
  if (additionalPrimitives.includes(name)) return true;

  return false;
}

/**
 * Analyze a single file for platform import violations
 *
 * @param filePath - Path to the file being analyzed
 * @param sourceCode - The source code content
 * @param options - Analyzer options
 * @returns Analysis result with violations
 *
 * @example
 * ```typescript
 * const result = analyzePlatformImports(
 *   'src/components/Button.tsx',
 *   sourceCode,
 *   { severity: 'error' }
 * );
 *
 * if (result.violations.length > 0) {
 *   for (const v of result.violations) {
 *     console.error(`${v.filePath}:${v.line}:${v.column} - ${v.message}`);
 *   }
 * }
 * ```
 */
export function analyzePlatformImports(
  filePath: string,
  sourceCode: string,
  options?: AnalyzerOptions
): AnalysisResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const fileType = classifyFile(filePath);
  const violations: Violation[] = [];

  // Skip ignored files
  if (matchesIgnoredPattern(filePath, opts.ignoredPatterns)) {
    return {
      filePath,
      fileType,
      violations: [],
      imports: [],
      passed: true,
    };
  }

  // Skip non-component files
  if (fileType === 'other' || fileType === 'styles' || fileType === 'types') {
    return {
      filePath,
      fileType,
      violations: [],
      imports: [],
      passed: true,
    };
  }

  // Parse imports
  const imports = parseImports(sourceCode, filePath, {
    additionalNativeSources: opts.additionalNativeSources,
    additionalDomSources: opts.additionalDomSources,
  });

  // Build ignored primitives set
  const ignoredPrimitives = new Set(opts.ignoredPrimitives);

  // Analyze each import
  for (const imp of imports) {
    // Skip type-only imports
    if (imp.isTypeOnly) continue;

    // Skip ignored primitives
    const primitiveName = imp.originalName ?? imp.name;
    if (ignoredPrimitives.has(primitiveName)) continue;

    // Check for violations based on file type
    switch (fileType) {
      case 'shared':
        // Shared files should not use platform-specific imports
        if (isNativePrimitive(imp, opts.additionalNativePrimitives)) {
          violations.push(
            createViolation(
              'native-in-shared',
              primitiveName,
              imp.source,
              filePath,
              imp.line,
              imp.column,
              opts.severity
            )
          );
        }
        if (isDomPrimitive(imp, opts.additionalDomPrimitives)) {
          violations.push(
            createViolation(
              'dom-in-shared',
              primitiveName,
              imp.source,
              filePath,
              imp.line,
              imp.column,
              opts.severity
            )
          );
        }
        break;

      case 'web':
        // Web files should not use React Native imports
        if (isNativePrimitive(imp, opts.additionalNativePrimitives)) {
          violations.push(
            createViolation(
              'native-in-web',
              primitiveName,
              imp.source,
              filePath,
              imp.line,
              imp.column,
              opts.severity
            )
          );
        }
        break;

      case 'native':
        // Native files should not use React DOM imports
        if (isDomPrimitive(imp, opts.additionalDomPrimitives)) {
          violations.push(
            createViolation(
              'dom-in-native',
              primitiveName,
              imp.source,
              filePath,
              imp.line,
              imp.column,
              opts.severity
            )
          );
        }
        break;
    }
  }

  return {
    filePath,
    fileType,
    violations,
    imports,
    passed: violations.length === 0,
  };
}

/**
 * Analyze multiple files for platform import violations
 *
 * @param files - Array of files to analyze
 * @param options - Analyzer options
 * @returns Array of analysis results
 *
 * @example
 * ```typescript
 * const results = analyzeFiles(
 *   [
 *     { path: 'Button.tsx', content: buttonSource },
 *     { path: 'Button.web.tsx', content: webSource },
 *     { path: 'Button.native.tsx', content: nativeSource },
 *   ],
 *   { severity: 'warning' }
 * );
 *
 * const failed = results.filter(r => !r.passed);
 * ```
 */
export function analyzeFiles(
  files: FileInput[],
  options?: AnalyzerOptions
): AnalysisResult[] {
  return files.map((file) =>
    analyzePlatformImports(file.path, file.content, options)
  );
}

/**
 * Get a summary of analysis results
 */
export interface AnalysisSummary {
  totalFiles: number;
  passedFiles: number;
  failedFiles: number;
  totalViolations: number;
  violationsByType: Record<ViolationType, number>;
  violationsBySeverity: Record<Severity, number>;
}

/**
 * Summarize analysis results
 *
 * @param results - Array of analysis results
 * @returns Summary statistics
 */
export function summarizeResults(results: AnalysisResult[]): AnalysisSummary {
  const violationsByType: Record<ViolationType, number> = {
    'native-in-shared': 0,
    'dom-in-shared': 0,
    'native-in-web': 0,
    'dom-in-native': 0,
  };

  const violationsBySeverity: Record<Severity, number> = {
    error: 0,
    warning: 0,
    info: 0,
  };

  let totalViolations = 0;

  for (const result of results) {
    for (const violation of result.violations) {
      totalViolations++;
      violationsByType[violation.type]++;
      violationsBySeverity[violation.severity]++;
    }
  }

  return {
    totalFiles: results.length,
    passedFiles: results.filter((r) => r.passed).length,
    failedFiles: results.filter((r) => !r.passed).length,
    totalViolations,
    violationsByType,
    violationsBySeverity,
  };
}

/**
 * Format a violation for console output
 */
export function formatViolation(violation: Violation): string {
  const severityPrefix =
    violation.severity === 'error'
      ? 'ERROR'
      : violation.severity === 'warning'
        ? 'WARN'
        : 'INFO';

  return `${severityPrefix}: ${violation.filePath}:${violation.line}:${violation.column} - ${violation.message}`;
}

/**
 * Format all violations from results for console output
 */
export function formatViolations(results: AnalysisResult[]): string[] {
  const lines: string[] = [];

  for (const result of results) {
    for (const violation of result.violations) {
      lines.push(formatViolation(violation));
    }
  }

  return lines;
}
