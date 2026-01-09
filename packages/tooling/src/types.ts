/**
 * File type classification based on file extension patterns
 */
export type FileType =
  | 'shared'   // .tsx, .jsx - shared cross-platform files
  | 'web'      // .web.tsx, .web.jsx - web-specific files
  | 'native'   // .native.tsx, .native.jsx - React Native-specific files
  | 'styles'   // .styles.tsx, .styles.ts - style definition files
  | 'types'    // .types.ts, types.ts - type definition files
  | 'other';   // non-component files

/**
 * Platform classification for imports
 */
export type Platform = 'react-native' | 'react-dom' | 'neutral';

/**
 * Violation type describing what kind of platform mismatch occurred
 */
export type ViolationType =
  | 'native-in-shared'  // React Native primitive used in shared file
  | 'dom-in-shared'     // React DOM primitive used in shared file
  | 'native-in-web'     // React Native primitive used in web file
  | 'dom-in-native';    // React DOM primitive used in native file

/**
 * Severity level for violations
 */
export type Severity = 'error' | 'warning' | 'info';

/**
 * Information about a single import
 */
export interface ImportInfo {
  /** The imported identifier name */
  name: string;
  /** Original name if aliased (e.g., `Image as RNImage`) */
  originalName?: string;
  /** The module source (e.g., 'react-native', 'react-dom') */
  source: string;
  /** The platform this import belongs to */
  platform: Platform;
  /** Line number in source file */
  line: number;
  /** Column number in source file */
  column: number;
  /** Whether this is a default import */
  isDefault: boolean;
  /** Whether this is a namespace import (import * as X) */
  isNamespace: boolean;
  /** Whether this is a type-only import */
  isTypeOnly: boolean;
}

/**
 * A single violation found during analysis
 */
export interface Violation {
  /** Type of violation */
  type: ViolationType;
  /** The primitive/component that caused the violation */
  primitive: string;
  /** The module source (e.g., 'react-native', 'react-dom') */
  source: string;
  /** Path to the file with the violation */
  filePath: string;
  /** Line number where violation occurred */
  line: number;
  /** Column number where violation occurred */
  column: number;
  /** Human-readable message describing the violation */
  message: string;
  /** Severity level of this violation */
  severity: Severity;
}

/**
 * Result of analyzing a single file
 */
export interface AnalysisResult {
  /** Path to the analyzed file */
  filePath: string;
  /** Classified type of the file */
  fileType: FileType;
  /** List of violations found */
  violations: Violation[];
  /** All imports found in the file */
  imports: ImportInfo[];
  /** Whether the file passed validation (no violations) */
  passed: boolean;
}

/**
 * Options for configuring the platform import analyzer
 */
export interface AnalyzerOptions {
  /**
   * Default severity level for violations
   * @default 'error'
   */
  severity?: Severity;

  /**
   * Additional React Native primitives to flag beyond the built-in list
   * Useful for flagging custom native-only components
   */
  additionalNativePrimitives?: string[];

  /**
   * Additional React DOM primitives to flag beyond the built-in list
   * Useful for flagging custom web-only components
   */
  additionalDomPrimitives?: string[];

  /**
   * Primitives to ignore/allow even if they would normally be flagged
   */
  ignoredPrimitives?: string[];

  /**
   * Glob patterns for files to skip analysis on
   * @example ['**\/*.test.tsx', '**\/*.stories.tsx']
   */
  ignoredPatterns?: string[];

  /**
   * Additional module sources to treat as React Native
   * @example ['react-native-gesture-handler', 'react-native-reanimated']
   */
  additionalNativeSources?: string[];

  /**
   * Additional module sources to treat as React DOM
   * @example ['react-dom/client']
   */
  additionalDomSources?: string[];
}

/**
 * Input for batch file analysis
 */
export interface FileInput {
  /** File path */
  path: string;
  /** File content (source code) */
  content: string;
}

/**
 * Primitive rule definition
 */
export interface PrimitiveRule {
  /** Name of the primitive/component */
  name: string;
  /** Module source it comes from */
  source: string;
  /** Platform it belongs to */
  platform: Platform;
  /** Optional description of why it's platform-specific */
  description?: string;
}

/**
 * Rule set containing primitives for a specific platform
 */
export interface PrimitiveRuleSet {
  /** Platform these rules apply to */
  platform: Platform;
  /** List of primitive rules */
  primitives: PrimitiveRule[];
  /** Module sources that indicate this platform */
  sources: string[];
}
