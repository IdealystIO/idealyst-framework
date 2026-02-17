import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  useRef,
  useId,
  useMemo,
} from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import { Markdown as TiptapMarkdown } from 'tiptap-markdown';
import { useUnistyles } from 'react-native-unistyles';
import { editorStyles, generateTiptapCSS } from './MarkdownEditor.styles';
import { EditorToolbar } from './EditorToolbar.web';
import type { MarkdownEditorProps, MarkdownEditorRef } from './types';

const DEFAULT_TOOLBAR_ITEMS = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
  'heading',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'link',
] as const;

/**
 * Markdown editor for web using Tiptap.
 *
 * Provides a rich text editing experience with markdown input/output.
 * Uses Tiptap with the tiptap-markdown extension for seamless markdown handling.
 */
const MarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>(
  (
    {
      initialValue = '',
      value,
      onChange,
      onFocus,
      onBlur,
      editable = true,
      autoFocus = false,
      placeholder,
      toolbar = {},
      size = 'md',
      linkIntent = 'primary',
      minHeight,
      maxHeight,
      style,
      testID,
      id,
      accessibilityLabel,
    },
    ref
  ) => {
    const styleId = useId();
    const isControlled = value !== undefined;
    const lastValueRef = useRef<string>(value ?? initialValue);
    const initializedRef = useRef(false);

    // Get theme for CSS generation
    const { theme } = useUnistyles();

    // Apply style variants
    editorStyles.useVariants({
      size,
      linkIntent,
    });

    // Generate and inject CSS for Tiptap
    const tiptapCSS = useMemo(() => generateTiptapCSS(theme), [theme]);

    useEffect(() => {
      const existingStyle = document.getElementById(`tiptap-styles-${styleId}`);
      if (existingStyle) {
        existingStyle.textContent = tiptapCSS;
        return;
      }

      const styleElement = document.createElement('style');
      styleElement.id = `tiptap-styles-${styleId}`;
      styleElement.textContent = tiptapCSS;
      document.head.appendChild(styleElement);

      return () => {
        const el = document.getElementById(`tiptap-styles-${styleId}`);
        if (el) {
          document.head.removeChild(el);
        }
      };
    }, [tiptapCSS, styleId]);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }),
        Placeholder.configure({
          placeholder: placeholder ?? 'Start writing...',
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
          },
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        Underline,
        TiptapMarkdown.configure({
          html: false,
          transformPastedText: true,
          transformCopiedText: true,
        }),
      ],
      content: '', // Start empty, we'll set content after creation
      editable,
      autofocus: autoFocus,
      onUpdate: ({ editor: ed }: { editor: ReturnType<typeof useEditor> }) => {
        const markdown = (ed as any).storage.markdown.getMarkdown();
        lastValueRef.current = markdown;
        onChange?.(markdown);
      },
      onFocus: () => onFocus?.(),
      onBlur: () => onBlur?.(),
    });

    // Set initial content after editor is created
    // tiptap-markdown's setContent handles markdown parsing
    useEffect(() => {
      if (editor && !initializedRef.current) {
        const initialMarkdown = value ?? initialValue;
        if (initialMarkdown) {
          // Use setContent which tiptap-markdown patches to handle markdown
          editor.commands.setContent(initialMarkdown);
          lastValueRef.current = initialMarkdown;
        }
        initializedRef.current = true;
      }
    }, [editor, value, initialValue]);

    // Handle controlled value changes
    useEffect(() => {
      if (isControlled && editor && initializedRef.current && value !== lastValueRef.current) {
        const { from, to } = editor.state.selection;
        // tiptap-markdown patches setContent to handle markdown
        editor.commands.setContent(value ?? '');
        // Try to restore cursor position
        const newDocLength = editor.state.doc.content.size;
        const safeFrom = Math.min(from, newDocLength);
        const safeTo = Math.min(to, newDocLength);
        editor.commands.setTextSelection({ from: safeFrom, to: safeTo });
        lastValueRef.current = value ?? '';
      }
    }, [value, isControlled, editor]);

    // Handle editable changes
    useEffect(() => {
      if (editor) {
        editor.setEditable(editable);
      }
    }, [editable, editor]);

    // Expose ref methods
    useImperativeHandle(
      ref,
      () => ({
        getMarkdown: async () => {
          if (!editor) return '';
          return editor.storage.markdown.getMarkdown();
        },
        setMarkdown: (markdown: string) => {
          if (editor) {
            editor.commands.setContent(markdown);
            lastValueRef.current = markdown;
          }
        },
        focus: () => editor?.commands.focus(),
        blur: () => editor?.commands.blur(),
        isEmpty: async () => editor?.isEmpty ?? true,
        clear: () => {
          editor?.commands.clearContent();
          lastValueRef.current = '';
        },
        undo: () => editor?.commands.undo(),
        redo: () => editor?.commands.redo(),
      }),
      [editor]
    );

    const handleToolbarAction = useCallback(
      (action: string) => {
        if (!editor) return;

        switch (action) {
          case 'bold':
            editor.chain().focus().toggleBold().run();
            break;
          case 'italic':
            editor.chain().focus().toggleItalic().run();
            break;
          case 'underline':
            editor.chain().focus().toggleUnderline().run();
            break;
          case 'strikethrough':
            editor.chain().focus().toggleStrike().run();
            break;
          case 'code':
            editor.chain().focus().toggleCode().run();
            break;
          case 'heading1':
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            break;
          case 'heading2':
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            break;
          case 'heading3':
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            break;
          case 'heading4':
            editor.chain().focus().toggleHeading({ level: 4 }).run();
            break;
          case 'heading5':
            editor.chain().focus().toggleHeading({ level: 5 }).run();
            break;
          case 'heading6':
            editor.chain().focus().toggleHeading({ level: 6 }).run();
            break;
          case 'bulletList':
            editor.chain().focus().toggleBulletList().run();
            break;
          case 'orderedList':
            editor.chain().focus().toggleOrderedList().run();
            break;
          case 'taskList':
            editor.chain().focus().toggleTaskList().run();
            break;
          case 'blockquote':
            editor.chain().focus().toggleBlockquote().run();
            break;
          case 'codeBlock':
            editor.chain().focus().toggleCodeBlock().run();
            break;
          case 'horizontalRule':
            editor.chain().focus().setHorizontalRule().run();
            break;
          case 'link': {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('URL', previousUrl);
            if (url === null) return;
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
            } else {
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
            }
            break;
          }
          case 'undo':
            editor.chain().focus().undo().run();
            break;
          case 'redo':
            editor.chain().focus().redo().run();
            break;
        }
      },
      [editor]
    );

    const isActive = useCallback(
      (action: string): boolean => {
        if (!editor) return false;

        switch (action) {
          case 'bold':
            return editor.isActive('bold');
          case 'italic':
            return editor.isActive('italic');
          case 'underline':
            return editor.isActive('underline');
          case 'strikethrough':
            return editor.isActive('strike');
          case 'code':
            return editor.isActive('code');
          case 'heading1':
            return editor.isActive('heading', { level: 1 });
          case 'heading2':
            return editor.isActive('heading', { level: 2 });
          case 'heading3':
            return editor.isActive('heading', { level: 3 });
          case 'heading4':
            return editor.isActive('heading', { level: 4 });
          case 'heading5':
            return editor.isActive('heading', { level: 5 });
          case 'heading6':
            return editor.isActive('heading', { level: 6 });
          case 'bulletList':
            return editor.isActive('bulletList');
          case 'orderedList':
            return editor.isActive('orderedList');
          case 'taskList':
            return editor.isActive('taskList');
          case 'blockquote':
            return editor.isActive('blockquote');
          case 'codeBlock':
            return editor.isActive('codeBlock');
          case 'link':
            return editor.isActive('link');
          default:
            return false;
        }
      },
      [editor]
    );

    // Build inline styles
    const containerStyle = editorStyles.container({ size, linkIntent });
    const editorContentStyle = editorStyles.editorContent({ size, linkIntent });

    const toolbarItems = toolbar.items ?? DEFAULT_TOOLBAR_ITEMS;
    const toolbarDisabledItems = toolbar.disabledItems ?? [];
    const showToolbar = toolbar.visible !== false && editable;
    const toolbarPosition = toolbar.position ?? 'top';

    return (
      <div
        id={id}
        data-testid={testID}
        aria-label={accessibilityLabel}
        className="tiptap-editor-wrapper"
        style={{
          ...containerStyle,
          ...(minHeight !== undefined ? { minHeight } : {}),
          ...(maxHeight !== undefined ? { maxHeight, overflow: 'auto' } : {}),
          ...(style as React.CSSProperties),
        }}
      >
        {showToolbar && toolbarPosition === 'top' && (
          <EditorToolbar
            editor={editor}
            items={toolbarItems}
            disabledItems={toolbarDisabledItems}
            onAction={handleToolbarAction}
            isActive={isActive}
            size={size}
            linkIntent={linkIntent}
          />
        )}
        <div style={editorContentStyle as React.CSSProperties}>
          <EditorContent editor={editor} />
        </div>
        {showToolbar && toolbarPosition === 'bottom' && (
          <EditorToolbar
            editor={editor}
            items={toolbarItems}
            disabledItems={toolbarDisabledItems}
            onAction={handleToolbarAction}
            isActive={isActive}
            size={size}
            linkIntent={linkIntent}
          />
        )}
      </div>
    );
  }
);

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;
