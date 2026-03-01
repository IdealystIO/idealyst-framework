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

// Main component — platform-specific implementations are in index.web.ts and index.native.ts.
// This base index re-exports the web version as the default for bundlers that don't
// resolve "browser" or "react-native" conditions (e.g., plain tsc with types resolution).
export { default as Markdown } from './Markdown/Markdown.web';

// Editor — web fallback for base index (see index.web.ts / index.native.ts for platform-specific)
export { default as MarkdownEditor } from './Editor/MarkdownEditor.web';

// Editor types
export type {
  MarkdownEditorProps,
  MarkdownEditorRef,
  ToolbarItem,
  ToolbarConfig,
} from './Editor/types';

export type {
  EditorDynamicProps,
  EditorVariants,
} from './Editor/MarkdownEditor.styles';
