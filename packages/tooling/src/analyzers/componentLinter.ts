import { Severity } from '../types';

/**
 * Types of linting issues the component linter can detect.
 *
 * These are issues that TypeScript cannot catch - primarily style/pattern issues
 * that are syntactically valid but violate Idealyst conventions.
 */
export type LintIssueType =
  | 'hardcoded-color'           // Using color strings like '#fff', 'red', 'rgb()'
  | 'direct-platform-import';   // Importing directly from react-native in shared file

/**
 * A single lint issue found during analysis
 */
export interface LintIssue {
  /** Type of lint issue */
  type: LintIssueType;
  /** Severity level */
  severity: Severity;
  /** Line number where issue occurred */
  line: number;
  /** Column number where issue occurred */
  column: number;
  /** The problematic code snippet */
  code: string;
  /** Human-readable message describing the issue */
  message: string;
  /** Suggested fix (if available) */
  suggestion?: string;
}

/**
 * Result of linting a component file
 */
export interface LintResult {
  /** Path to the analyzed file */
  filePath: string;
  /** List of issues found */
  issues: LintIssue[];
  /** Whether the file passed linting (no errors) */
  passed: boolean;
  /** Count of issues by severity */
  counts: {
    error: number;
    warning: number;
    info: number;
  };
}

/**
 * Options for the component linter
 */
export interface ComponentLinterOptions {
  /**
   * Which rules to enable (all enabled by default)
   */
  rules?: {
    /** Detect hardcoded color values like '#fff', 'red', 'rgb()' */
    hardcodedColors?: boolean | Severity;
    /** Detect direct imports from 'react-native' in shared files */
    directPlatformImports?: boolean | Severity;
  };

  /**
   * Glob patterns for files to ignore
   */
  ignoredPatterns?: string[];

  /**
   * Color values that are allowed (e.g., 'transparent', 'inherit')
   * @default ['transparent', 'inherit', 'currentColor']
   */
  allowedColors?: string[];
}

// Common CSS color names that indicate hardcoded colors
const CSS_COLOR_NAMES = new Set([
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque',
  'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue',
  'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan',
  'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey',
  'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
  'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey',
  'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
  'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
  'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey',
  'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender',
  'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
  'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink',
  'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey',
  'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon',
  'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
  'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred',
  'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy',
  'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
  'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru',
  'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown',
  'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna',
  'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen',
  'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat',
  'white', 'whitesmoke', 'yellow', 'yellowgreen',
]);

// Colors that are generally safe to use
const DEFAULT_ALLOWED_COLORS = new Set([
  'transparent',
  'inherit',
  'currentColor',
  'currentcolor',
]);

// Style properties that typically use colors
const COLOR_PROPERTIES = [
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'shadowColor',
  'textDecorationColor',
  'tintColor',
  'overlayColor',
];

/**
 * Check if a string is a hardcoded color value
 */
function isHardcodedColor(value: string, allowedColors: Set<string>): boolean {
  const trimmed = value.trim().toLowerCase();

  // Check if it's an allowed color
  if (allowedColors.has(trimmed)) {
    return false;
  }

  // Hex color: #fff, #ffffff, #ffffffff
  if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) {
    return true;
  }

  // RGB/RGBA: rgb(0,0,0), rgba(0,0,0,0.5)
  if (/^rgba?\s*\(/.test(trimmed)) {
    return true;
  }

  // HSL/HSLA: hsl(0,0%,0%), hsla(0,0%,0%,0.5)
  if (/^hsla?\s*\(/.test(trimmed)) {
    return true;
  }

  // CSS named color
  if (CSS_COLOR_NAMES.has(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Get the severity for a rule, handling boolean and severity values
 */
function getRuleSeverity(
  rule: boolean | Severity | undefined,
  defaultSeverity: Severity
): Severity | null {
  if (rule === false) return null;
  if (rule === true || rule === undefined) return defaultSeverity;
  return rule;
}

/**
 * Parse source code and find line/column for a match index
 */
function getLineColumn(source: string, index: number): { line: number; column: number } {
  const lines = source.substring(0, index).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

/**
 * Lint a component file for Idealyst-specific issues.
 *
 * Detects issues that TypeScript cannot catch:
 * - Hardcoded colors (TypeScript sees these as valid strings)
 * - Direct react-native imports in shared files (valid TS, but breaks web)
 *
 * @param filePath - Path to the file being analyzed
 * @param sourceCode - The source code content
 * @param options - Linter options
 * @returns Lint result with issues found
 *
 * @example
 * ```typescript
 * const result = lintComponent(
 *   'src/components/MyButton.tsx',
 *   sourceCode,
 *   { rules: { hardcodedColors: 'error' } }
 * );
 *
 * if (!result.passed) {
 *   for (const issue of result.issues) {
 *     console.error(`${issue.line}:${issue.column} - ${issue.message}`);
 *   }
 * }
 * ```
 */
export function lintComponent(
  filePath: string,
  sourceCode: string,
  options: ComponentLinterOptions = {}
): LintResult {
  const issues: LintIssue[] = [];
  const rules = options.rules || {};

  const allowedColors = new Set([
    ...DEFAULT_ALLOWED_COLORS,
    ...(options.allowedColors || []).map(c => c.toLowerCase()),
  ]);

  // Rule: Hardcoded colors
  const hardcodedColorSeverity = getRuleSeverity(rules.hardcodedColors, 'warning');
  if (hardcodedColorSeverity) {
    // Match color properties with string values
    for (const prop of COLOR_PROPERTIES) {
      // Match: backgroundColor: '#fff' or backgroundColor: "red"
      const propRegex = new RegExp(`${prop}\\s*:\\s*['"]([^'"]+)['"]`, 'g');
      let match;
      while ((match = propRegex.exec(sourceCode)) !== null) {
        const colorValue = match[1];
        if (isHardcodedColor(colorValue, allowedColors)) {
          const { line, column } = getLineColumn(sourceCode, match.index);
          issues.push({
            type: 'hardcoded-color',
            severity: hardcodedColorSeverity,
            line,
            column,
            code: match[0],
            message: `Hardcoded color '${colorValue}' in ${prop}. Use theme colors instead.`,
            suggestion: `Use theme.colors.*, theme.intents[intent].*, or pass color via props`,
          });
        }
      }
    }

    // Also check for color/backgroundColor in template literals
    const templateColorRegex = /(?:color|backgroundColor)\s*:\s*`[^`]*#[0-9a-fA-F]{3,8}[^`]*`/g;
    let templateMatch;
    while ((templateMatch = templateColorRegex.exec(sourceCode)) !== null) {
      const { line, column } = getLineColumn(sourceCode, templateMatch.index);
      issues.push({
        type: 'hardcoded-color',
        severity: hardcodedColorSeverity,
        line,
        column,
        code: templateMatch[0],
        message: `Hardcoded hex color in template literal. Use theme colors instead.`,
        suggestion: `Use theme.colors.* or theme.intents[intent].*`,
      });
    }
  }

  // Rule: Direct platform imports in shared files
  const directPlatformSeverity = getRuleSeverity(rules.directPlatformImports, 'warning');
  if (directPlatformSeverity) {
    // Only check shared files (not .web.tsx or .native.tsx)
    const isSharedFile = !filePath.includes('.web.') && !filePath.includes('.native.');
    if (isSharedFile) {
      // Check for direct react-native imports
      const rnImportRegex = /import\s+.*\s+from\s+['"]react-native['"]/g;
      let match;
      while ((match = rnImportRegex.exec(sourceCode)) !== null) {
        const { line, column } = getLineColumn(sourceCode, match.index);
        issues.push({
          type: 'direct-platform-import',
          severity: directPlatformSeverity,
          line,
          column,
          code: match[0],
          message: `Direct import from 'react-native' in shared file. Use @idealyst/components instead.`,
          suggestion: `Import View, Text, etc. from '@idealyst/components'`,
        });
      }
    }
  }

  // Calculate counts
  const counts = {
    error: issues.filter(i => i.severity === 'error').length,
    warning: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
  };

  return {
    filePath,
    issues,
    passed: counts.error === 0,
    counts,
  };
}

/**
 * Lint multiple component files
 *
 * @param files - Array of files to lint
 * @param options - Linter options
 * @returns Array of lint results
 */
export function lintComponents(
  files: Array<{ path: string; content: string }>,
  options: ComponentLinterOptions = {}
): LintResult[] {
  return files.map(file => lintComponent(file.path, file.content, options));
}

/**
 * Format a lint issue for console output
 */
export function formatLintIssue(issue: LintIssue, filePath: string): string {
  const severityPrefix = issue.severity === 'error'
    ? 'ERROR'
    : issue.severity === 'warning'
      ? 'WARN'
      : 'INFO';

  let output = `${severityPrefix}: ${filePath}:${issue.line}:${issue.column} - ${issue.message}`;
  if (issue.suggestion) {
    output += `\n  Suggestion: ${issue.suggestion}`;
  }
  return output;
}

/**
 * Format all lint results for console output
 */
export function formatLintResults(results: LintResult[]): string[] {
  const lines: string[] = [];

  for (const result of results) {
    for (const issue of result.issues) {
      lines.push(formatLintIssue(issue, result.filePath));
    }
  }

  return lines;
}

/**
 * Summary of lint results
 */
export interface LintSummary {
  totalFiles: number;
  passedFiles: number;
  failedFiles: number;
  totalIssues: number;
  issuesByType: Record<LintIssueType, number>;
  issuesBySeverity: Record<Severity, number>;
}

/**
 * Summarize lint results
 */
export function summarizeLintResults(results: LintResult[]): LintSummary {
  const issuesByType: Record<LintIssueType, number> = {
    'hardcoded-color': 0,
    'direct-platform-import': 0,
  };

  const issuesBySeverity: Record<Severity, number> = {
    error: 0,
    warning: 0,
    info: 0,
  };

  let totalIssues = 0;

  for (const result of results) {
    for (const issue of result.issues) {
      totalIssues++;
      issuesByType[issue.type]++;
      issuesBySeverity[issue.severity]++;
    }
  }

  return {
    totalFiles: results.length,
    passedFiles: results.filter(r => r.passed).length,
    failedFiles: results.filter(r => !r.passed).length,
    totalIssues,
    issuesByType,
    issuesBySeverity,
  };
}
