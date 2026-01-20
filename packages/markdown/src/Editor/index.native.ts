/**
 * @idealyst/markdown/editor - Cross-platform markdown editor (React Native)
 *
 * Provides a MarkdownEditor component for editing markdown content
 * with a rich text interface on React Native using 10tap-editor.
 */

// Main component
export { default as MarkdownEditor } from './MarkdownEditor.native';

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
