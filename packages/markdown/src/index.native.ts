/**
 * @idealyst/markdown - Cross-platform markdown renderer (React Native)
 *
 * Provides a Markdown component for rendering markdown content
 * with theme integration on React Native.
 */

// Main component
export { default as Markdown } from './Markdown/Markdown.native';

// Types
export type {
  MarkdownProps,
  MarkdownElementType,
  MarkdownStyleOverrides,
  LinkHandler,
  ImageHandler,
  CodeBlockOptions,
  MarkdownRendererProps,
} from './Markdown/types';

// Style types
export type {
  MarkdownDynamicProps,
  MarkdownVariants,
} from './Markdown/Markdown.styles';
