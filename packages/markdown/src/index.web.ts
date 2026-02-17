/**
 * @idealyst/markdown - Cross-platform markdown renderer (Web)
 *
 * Provides a Markdown component for rendering markdown content
 * with theme integration on web.
 */

// Main component
export { default as Markdown } from './Markdown/Markdown.web';

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
