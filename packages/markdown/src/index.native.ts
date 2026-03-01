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

// Editor
export { default as MarkdownEditor } from './Editor/MarkdownEditor.native';

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
