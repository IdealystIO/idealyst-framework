/**
 * @idealyst/markdown - Cross-platform markdown renderer
 *
 * Provides a Markdown component for rendering markdown content
 * with theme integration on both web and React Native platforms.
 *
 * @example
 * ```tsx
 * import { Markdown } from '@idealyst/markdown';
 *
 * function App() {
 *   return (
 *     <Markdown size="md" linkIntent="primary">
 *       # Hello World
 *
 *       This is **markdown** with _emphasis_.
 *     </Markdown>
 *   );
 * }
 * ```
 */

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

// Main component is platform-specific, exported from index.web.ts and index.native.ts
