import type { ReactNode, ComponentType } from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { Size, Intent } from '@idealyst/theme';

/**
 * Markdown element types that can be individually styled
 */
export type MarkdownElementType =
  | 'body'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'paragraph'
  | 'strong'
  | 'em'
  | 'strikethrough'
  | 'link'
  | 'blockquote'
  | 'codeInline'
  | 'codeBlock'
  | 'listOrdered'
  | 'listUnordered'
  | 'listItem'
  | 'table'
  | 'tableHead'
  | 'tableRow'
  | 'tableCell'
  | 'image'
  | 'hr'
  | 'taskListItem'
  | 'footnote'
  | 'footnoteRef';

/**
 * Style overrides for specific markdown elements
 */
export type MarkdownStyleOverrides = Partial<
  Record<MarkdownElementType, StyleProp<ViewStyle | TextStyle>>
>;

/**
 * Link handling options
 */
export interface LinkHandler {
  /**
   * Called when a link is pressed/clicked
   * Return true to prevent default behavior
   */
  onLinkPress?: (url: string, title?: string) => boolean | void;

  /**
   * Whether to open external links in new tab (web) or browser (native)
   * @default true
   */
  openExternalLinks?: boolean;
}

/**
 * Image handling options
 */
export interface ImageHandler {
  /**
   * Custom image resolver for relative paths
   */
  resolveImageUrl?: (src: string) => string;

  /**
   * Default image dimensions when not specified in markdown
   */
  defaultImageDimensions?: { width?: number; height?: number };

  /**
   * Called when an image is pressed/clicked
   */
  onImagePress?: (src: string, alt?: string) => void;
}

/**
 * Code block handling options
 */
export interface CodeBlockOptions {
  /**
   * Enable syntax highlighting
   * @default false
   */
  syntaxHighlighting?: boolean;

  /**
   * Syntax highlighting theme (maps to theme's light/dark)
   * @default 'auto'
   */
  syntaxTheme?: 'auto' | 'light' | 'dark';

  /**
   * Show line numbers in code blocks
   * @default false
   */
  showLineNumbers?: boolean;

  /**
   * Enable copy button for code blocks (web only)
   * @default true
   */
  copyButton?: boolean;
}

/**
 * Main Markdown component props
 */
export interface MarkdownProps {
  /**
   * Markdown content to render
   */
  children: string;

  /**
   * Text size variant - affects base font size and heading scales
   * @default 'md'
   */
  size?: Size;

  /**
   * Link color intent
   * @default 'primary'
   */
  linkIntent?: Intent;

  /**
   * Custom style overrides for specific elements
   */
  styleOverrides?: MarkdownStyleOverrides;

  /**
   * Link handling configuration
   */
  linkHandler?: LinkHandler;

  /**
   * Image handling configuration
   */
  imageHandler?: ImageHandler;

  /**
   * Code block configuration
   */
  codeOptions?: CodeBlockOptions;

  /**
   * Enable GFM extensions (tables, strikethrough, task lists, footnotes)
   * @default true
   */
  gfm?: boolean;

  /**
   * Allow raw HTML in markdown (security consideration)
   * @default false
   */
  allowHtml?: boolean;

  /**
   * Custom component renderers (advanced usage)
   * Web: Maps to react-markdown components prop
   * Native: Maps to react-native-markdown-display rules
   */
  components?: Partial<Record<MarkdownElementType, ComponentType<any>>>;

  /**
   * Container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test identifier
   */
  testID?: string;

  /**
   * Unique identifier
   */
  id?: string;

  /**
   * Accessibility label for the markdown container
   */
  accessibilityLabel?: string;
}

/**
 * Props passed to custom markdown element renderers
 */
export interface MarkdownRendererProps<T = unknown> {
  children?: ReactNode;
  node?: T;
  style?: StyleProp<ViewStyle | TextStyle>;
}
