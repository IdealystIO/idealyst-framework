/**
 * @idealyst/markdown/editor - Cross-platform markdown editor
 *
 * Provides a MarkdownEditor component for editing markdown content
 * with a rich text interface on both web and React Native platforms.
 *
 * Web uses Tiptap with tiptap-markdown extension.
 * Native uses 10tap-editor (Tiptap in WebView).
 *
 * @example
 * ```tsx
 * import { MarkdownEditor } from '@idealyst/markdown/editor';
 *
 * function App() {
 *   const [content, setContent] = useState('# Hello World');
 *
 *   return (
 *     <MarkdownEditor
 *       value={content}
 *       onChange={setContent}
 *       placeholder="Start writing..."
 *     />
 *   );
 * }
 * ```
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
