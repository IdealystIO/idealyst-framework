/**
 * Core type definitions for the CLI package
 */

// ============================================
// CORE CONFIGURATION TYPES
// ============================================

/**
 * Complete project configuration collected from wizard or CLI args
 */
export interface ProjectConfig {
  // Basic info
  projectName: string;           // kebab-case, npm-valid name
  orgDomain: string;             // e.g., "com.company"
  appDisplayName: string;        // Human-readable name for mobile app

  // Generated identifiers
  iosBundleId: string;           // e.g., "com.company.myapp"
  androidPackageName: string;    // e.g., "com.company.myapp"

  // Extensions
  extensions: ExtensionConfig;

  // Meta
  directory: string;             // Output directory
  useCurrentDir: boolean;        // Initialize in current directory instead of creating new folder
  skipInstall: boolean;          // Skip yarn install
  isInteractive: boolean;        // Was wizard used?
}

/**
 * Extension configuration - which optional features are enabled
 */
export interface ExtensionConfig {
  api: boolean;                  // Enable API server
  prisma: boolean;               // Enable Prisma database
  trpc: boolean;                 // Enable tRPC (requires api)
  graphql: boolean;              // Enable GraphQL (requires api)
  devcontainer: boolean | DevcontainerConfig;  // Enable devcontainer setup
}

/**
 * Devcontainer configuration options
 */
export interface DevcontainerConfig {
  enabled: boolean;
  // Optional services
  postgres: boolean;             // Include PostgreSQL database
  redis: boolean;                // Include Redis cache
  chrome: boolean;               // Include headless Chrome for Playwright
  claudeCode: boolean;           // Include Claude Code with MCP servers
  mcpServers: string[];          // Selected MCP servers for Claude Code
}

/**
 * Available MCP servers for Claude Code
 */
export const AVAILABLE_MCP_SERVERS = [
  {
    id: 'idealyst',
    name: 'Idealyst',
    description: 'Idealyst component documentation and examples',
    requiresChrome: false,
    requiresPostgres: false,
  },
  {
    id: 'serena',
    name: 'Serena',
    description: 'Code navigation and semantic search',
    requiresChrome: false,
    requiresPostgres: false,
  },
  {
    id: 'playwright',
    name: 'Playwright',
    description: 'Browser automation and testing (requires Chrome)',
    requiresChrome: true,
    requiresPostgres: false,
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Query PostgreSQL database (requires PostgreSQL)',
    requiresChrome: false,
    requiresPostgres: true,
  },
] as const;

export type McpServerId = typeof AVAILABLE_MCP_SERVERS[number]['id'];

/**
 * CLI arguments before processing
 */
export interface CLIArgs {
  projectName?: string;
  orgDomain?: string;
  appDisplayName?: string;
  withApi?: boolean;
  withPrisma?: boolean;
  withTrpc?: boolean;
  withGraphql?: boolean;
  withDevcontainer?: boolean;
  noInteractive?: boolean;
  skipInstall?: boolean;
  directory?: string;
}

// ============================================
// WIZARD TYPES
// ============================================

/**
 * A single wizard step definition
 */
export interface WizardStep<T = unknown> {
  id: string;
  prompt: (currentConfig: Partial<ProjectConfig>) => Promise<T>;
  validate: (value: T) => ValidationResult;
  shouldShow?: (config: Partial<ProjectConfig>) => boolean;
}

/**
 * Result of validation
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  suggestions?: string[];
}

/**
 * Wizard state during collection
 */
export interface WizardState {
  currentStep: number;
  totalSteps: number;
  config: Partial<ProjectConfig>;
  completed: boolean;
}

// ============================================
// GENERATOR TYPES
// ============================================

/**
 * Template data passed to template processor
 */
export interface TemplateData {
  projectName: string;
  packageName: string;           // @scope/package-name
  workspaceScope: string;        // Just the scope without @
  version: string;
  description: string;
  appDisplayName: string;
  iosBundleId: string;
  androidPackageName: string;
  idealystVersion: string;

  // Feature flags for conditional template content
  hasApi: boolean;
  hasPrisma: boolean;
  hasTrpc: boolean;
  hasGraphql: boolean;
  hasDevcontainer: boolean;
}

/**
 * Generator result with metadata
 */
export interface GeneratorResult {
  success: boolean;
  projectPath: string;
  packagesCreated: string[];
  extensionsEnabled: string[];
  warnings: string[];
  nextSteps: string[];
}

/**
 * Result from generating a single package
 */
export interface PackageGeneratorResult {
  success: boolean;
  warning?: string;
}

/**
 * Options for React Native initialization
 */
export interface ReactNativeInitOptions {
  projectName: string;
  displayName: string;
  bundleId: string;
  packageName: string;
  directory: string;
  skipInstall: boolean;
  interactive: boolean;
}

// ============================================
// ADD COMMAND TYPES
// ============================================

/**
 * Types of projects that can be added to workspace
 */
export type AddableProjectType = 'web' | 'mobile' | 'api' | 'shared';

/**
 * Options for add command
 */
export interface AddProjectOptions {
  name: string;
  type: AddableProjectType;
  directory: string;            // Workspace root
  appDisplayName?: string;      // For mobile projects
  withTrpc?: boolean;           // For web/mobile
  withGraphql?: boolean;        // For web/mobile
  skipInstall?: boolean;
}

// ============================================
// ERROR TYPES
// ============================================

/**
 * Custom error for missing required arguments in non-interactive mode
 */
export class MissingArgumentsError extends Error {
  public missingArgs: string[];
  public providedArgs: Record<string, unknown>;

  constructor(
    missingArgs: string[],
    providedArgs: Record<string, unknown>
  ) {
    const message = `Missing required arguments: ${missingArgs.join(', ')}\n` +
      `Run with interactive mode (remove --no-interactive) or provide all required arguments.`;
    super(message);
    this.name = 'MissingArgumentsError';
    this.missingArgs = missingArgs;
    this.providedArgs = providedArgs;
  }
}

/**
 * Error when trying to run outside workspace for certain operations
 */
export class NotInWorkspaceError extends Error {
  constructor(operation: string) {
    super(`The '${operation}' command must be run from within an Idealyst workspace.`);
    this.name = 'NotInWorkspaceError';
  }
}

/**
 * Error for invalid extension combinations
 */
export class InvalidExtensionError extends Error {
  constructor(extension: string, requirement: string) {
    super(`Extension '${extension}' requires '${requirement}' to be enabled.`);
    this.name = 'InvalidExtensionError';
  }
}
