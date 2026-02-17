/**
 * @idealyst/markdown/editor - Web implementation
 *
 * Uses Tiptap with tiptap-markdown extension for rich text editing.
 */

// Main component
export { default as MarkdownEditor } from './MarkdownEditor.web';

// Types
export type {
  MarkdownEditorProps,
  MarkdownEditorRef,
  ToolbarItem,
  ToolbarConfig,
} from './types';

// Style types
export type {
  EditorDynamicProps,
  EditorVariants,
} from './MarkdownEditor.styles';
