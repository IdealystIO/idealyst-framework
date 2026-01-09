import { FileType } from '../types';
import * as path from 'path';

/**
 * Extension patterns for classification
 * Order matters - more specific patterns should come first
 */
const EXTENSION_PATTERNS: Array<{ pattern: RegExp; type: FileType }> = [
  // Platform-specific component files
  { pattern: /\.web\.(tsx|jsx)$/, type: 'web' },
  { pattern: /\.native\.(tsx|jsx)$/, type: 'native' },
  { pattern: /\.ios\.(tsx|jsx)$/, type: 'native' },
  { pattern: /\.android\.(tsx|jsx)$/, type: 'native' },

  // Style files (can be .ts or .tsx)
  { pattern: /\.styles?\.(tsx?|jsx?)$/, type: 'styles' },

  // Type definition files
  { pattern: /\.types?\.(ts|tsx)$/, type: 'types' },
  { pattern: /types\.(ts|tsx)$/, type: 'types' },
  { pattern: /\.d\.ts$/, type: 'types' },

  // Shared component files (generic .tsx/.jsx without platform suffix)
  { pattern: /\.(tsx|jsx)$/, type: 'shared' },
];

/**
 * Files that should be classified as 'other' regardless of extension
 */
const EXCLUDED_PATTERNS: RegExp[] = [
  /\.test\.(tsx?|jsx?)$/,
  /\.spec\.(tsx?|jsx?)$/,
  /\.stories\.(tsx?|jsx?)$/,
  /\.config\.(ts|js)$/,
  /index\.(ts|tsx|js|jsx)$/,
];

/**
 * Classifies a file based on its path and extension
 *
 * @param filePath - The file path to classify
 * @returns The file type classification
 *
 * @example
 * classifyFile('Button.tsx') // 'shared'
 * classifyFile('Button.web.tsx') // 'web'
 * classifyFile('Button.native.tsx') // 'native'
 * classifyFile('Button.styles.tsx') // 'styles'
 * classifyFile('types.ts') // 'types'
 */
export function classifyFile(filePath: string): FileType {
  const fileName = path.basename(filePath);

  // Check if this file should be excluded from component analysis
  for (const pattern of EXCLUDED_PATTERNS) {
    if (pattern.test(fileName)) {
      return 'other';
    }
  }

  // Match against extension patterns
  for (const { pattern, type } of EXTENSION_PATTERNS) {
    if (pattern.test(fileName)) {
      return type;
    }
  }

  return 'other';
}

/**
 * Checks if a file is a component file that should be analyzed
 *
 * @param filePath - The file path to check
 * @returns True if the file is a component file (.tsx or .jsx)
 */
export function isComponentFile(filePath: string): boolean {
  const fileType = classifyFile(filePath);
  return fileType === 'shared' || fileType === 'web' || fileType === 'native';
}

/**
 * Checks if a file is a shared (cross-platform) component file
 * These are the files that should NOT contain platform-specific imports
 *
 * @param filePath - The file path to check
 * @returns True if the file is a shared component file
 */
export function isSharedFile(filePath: string): boolean {
  return classifyFile(filePath) === 'shared';
}

/**
 * Checks if a file is platform-specific
 *
 * @param filePath - The file path to check
 * @returns True if the file is web or native specific
 */
export function isPlatformSpecificFile(filePath: string): boolean {
  const fileType = classifyFile(filePath);
  return fileType === 'web' || fileType === 'native';
}

/**
 * Gets the expected platform for a file
 *
 * @param filePath - The file path to check
 * @returns The expected platform, or null for shared/other files
 */
export function getExpectedPlatform(filePath: string): 'web' | 'native' | null {
  const fileType = classifyFile(filePath);
  if (fileType === 'web') return 'web';
  if (fileType === 'native') return 'native';
  return null;
}

/**
 * Extracts the base component name from a file path
 *
 * @param filePath - The file path
 * @returns The base component name without platform suffix or extension
 *
 * @example
 * getBaseName('Button.web.tsx') // 'Button'
 * getBaseName('Button.native.tsx') // 'Button'
 * getBaseName('Button.tsx') // 'Button'
 */
export function getBaseName(filePath: string): string {
  const fileName = path.basename(filePath);
  return fileName
    .replace(/\.(web|native|ios|android)\.(tsx|jsx|ts|js)$/, '')
    .replace(/\.styles?\.(tsx|jsx|ts|js)$/, '')
    .replace(/\.types?\.(tsx|ts)$/, '')
    .replace(/\.(tsx|jsx|ts|js)$/, '');
}
