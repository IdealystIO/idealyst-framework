/**
 * Component Registry Types
 *
 * These types define the structure of the auto-generated component registry
 * that documents all components with their props, types, and valid values.
 */

/**
 * Definition of a single component prop
 */
export interface PropDefinition {
  /** The prop name */
  name: string;

  /** The TypeScript type as a string (e.g., 'Intent', 'Size', 'boolean', 'string') */
  type: string;

  /** Valid values for this prop (for unions, enums, theme-derived types) */
  values?: string[];

  /** Default value if specified in the component */
  default?: string | number | boolean;

  /** Description from JSDoc */
  description?: string;

  /** Whether the prop is required */
  required: boolean;
}

/**
 * Configuration for a controlled state binding
 */
export interface ControlledState {
  /** Initial value for the state */
  initial: any;
  /** The prop name that receives the onChange callback */
  onChangeProp: string;
  /** If true, the callback toggles a boolean value instead of receiving a new value */
  toggle?: boolean;
}

/**
 * Sample props for rendering the component in documentation
 */
export interface SampleProps {
  /** Props needed to render the component (required props, sample data) */
  props?: Record<string, any>;
  /** Default children for the component */
  children?: any;
  /** Controlled state bindings - key is the prop name, value is the state config */
  state?: Record<string, ControlledState>;
}

/**
 * Definition of a component in the registry
 */
export interface ComponentDefinition {
  /** Component name (e.g., 'Button', 'Card') */
  name: string;

  /** Component description from static property or JSDoc */
  description?: string;

  /** All props for this component */
  props: Record<string, PropDefinition>;

  /** Component category for grouping (e.g., 'form', 'display', 'layout') */
  category?: ComponentCategory;

  /** Path to the component file (relative) */
  filePath?: string;

  /** Sample props for rendering in documentation (from docs.ts) */
  sampleProps?: SampleProps;
}

/**
 * Component categories for organizing documentation
 */
export type ComponentCategory =
  | 'layout'
  | 'form'
  | 'display'
  | 'navigation'
  | 'overlay'
  | 'data'
  | 'feedback';

/**
 * The complete component registry
 */
export type ComponentRegistry = Record<string, ComponentDefinition>;

/**
 * Theme values extracted from the theme configuration
 */
export interface ThemeValues {
  /** Intent names (e.g., ['primary', 'success', 'danger', ...]) */
  intents: string[];

  /** Size keys per component (e.g., { button: ['xs', 'sm', 'md', ...], ... }) */
  sizes: Record<string, string[]>;

  /** Radius keys (e.g., ['none', 'xs', 'sm', 'md', ...]) */
  radii: string[];

  /** Shadow keys (e.g., ['none', 'sm', 'md', 'lg', 'xl']) */
  shadows: string[];

  /** Breakpoint keys (e.g., ['xs', 'sm', 'md', 'lg', 'xl']) */
  breakpoints: string[];

  /** Typography keys (e.g., ['h1', 'h2', 'body1', 'body2', ...]) */
  typography: string[];

  /** Surface color keys */
  surfaceColors: string[];

  /** Text color keys */
  textColors: string[];

  /** Border color keys */
  borderColors: string[];
}

/**
 * Options for the component analyzer
 */
export interface ComponentAnalyzerOptions {
  /** Paths to scan for components (e.g., ['packages/components/src']) */
  componentPaths: string[];

  /** Path to the theme file (e.g., 'packages/theme/src/lightTheme.ts') */
  themePath: string;

  /** Component names to include (default: all) */
  include?: string[];

  /** Component names to exclude */
  exclude?: string[];

  /** Whether to include internal/private components */
  includeInternal?: boolean;
}

/**
 * Options for the Vite plugin
 */
export interface IdealystDocsPluginOptions extends ComponentAnalyzerOptions {
  /** Output mode: 'virtual' for virtual module, 'file' for physical file */
  output?: 'virtual' | 'file';

  /** Path to write the registry file (if output is 'file') */
  outputPath?: string;

  /** Enable debug logging */
  debug?: boolean;
}
