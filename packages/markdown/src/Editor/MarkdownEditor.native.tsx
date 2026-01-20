import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
  RichText,
  Toolbar,
  useEditorBridge,
  type EditorBridge,
} from '@10play/tentap-editor';
import Showdown from 'showdown';
import { editorStyles } from './MarkdownEditor.styles';
import type { MarkdownEditorProps, MarkdownEditorRef, ToolbarItem } from './types';

// Configure Showdown converter with GFM support
const showdownConverter = new Showdown.Converter({
  tables: true,
  strikethrough: true,
  tasklists: true,
  ghCodeBlocks: true,
  smoothLivePreview: true,
  simpleLineBreaks: false,
  openLinksInNewWindow: false,
  backslashEscapesHTMLTags: true,
});

// Map our toolbar items to 10tap toolbar items
const TOOLBAR_ITEM_MAP: Record<ToolbarItem, string | string[] | null> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strikethrough: 'strikethrough',
  code: 'code',
  // 'heading' expands to all heading levels since 10tap doesn't support dropdowns
  heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  heading4: 'h4',
  heading5: 'h5',
  heading6: 'h6',
  bulletList: 'bulletList',
  orderedList: 'orderedList',
  taskList: 'taskList',
  blockquote: 'blockquote',
  codeBlock: 'codeBlock',
  horizontalRule: 'horizontalRule',
  link: 'link',
  image: 'image',
  undo: 'undo',
  redo: 'redo',
};

/**
 * Convert markdown to HTML using Showdown.
 */
function markdownToHtml(markdown: string): string {
  return showdownConverter.makeHtml(markdown);
}

/**
 * Convert HTML to markdown using Showdown.
 */
function htmlToMarkdown(html: string): string {
  return showdownConverter.makeMarkdown(html);
}

/**
 * Markdown editor for React Native using 10tap-editor.
 *
 * Uses a WebView-based Tiptap editor under the hood for rich text editing
 * with markdown input/output support.
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
      minHeight = 200,
      maxHeight,
      style,
      testID,
      id,
      accessibilityLabel,
      avoidIosKeyboard = true,
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const lastValueRef = useRef<string>(value ?? initialValue);
    const editorRef = useRef<EditorBridge | null>(null);

    // Apply style variants
    editorStyles.useVariants({
      size,
      linkIntent,
    });

    // Initialize editor with HTML content
    const initialHtml = markdownToHtml(value ?? initialValue);

    const editor = useEditorBridge({
      autofocus: autoFocus,
      avoidIosKeyboard,
      initialContent: initialHtml,
      editable,
      onChange: async () => {
        if (editorRef.current) {
          try {
            const html = await editorRef.current.getHTML();
            const markdown = htmlToMarkdown(html);
            if (markdown !== lastValueRef.current) {
              lastValueRef.current = markdown;
              onChange?.(markdown);
            }
          } catch {
            // Editor might not be ready
          }
        }
      },
    });

    // Store editor ref
    useEffect(() => {
      editorRef.current = editor;
    }, [editor]);

    // Handle controlled value changes
    useEffect(() => {
      if (isControlled && value !== lastValueRef.current && editorRef.current) {
        const html = markdownToHtml(value);
        editorRef.current.setContent(html);
        lastValueRef.current = value;
      }
    }, [value, isControlled]);

    // Expose ref methods
    useImperativeHandle(
      ref,
      () => ({
        getMarkdown: async () => {
          if (!editorRef.current) return '';
          try {
            const html = await editorRef.current.getHTML();
            return htmlToMarkdown(html);
          } catch {
            return lastValueRef.current;
          }
        },
        setMarkdown: (markdown: string) => {
          if (editorRef.current) {
            const html = markdownToHtml(markdown);
            editorRef.current.setContent(html);
            lastValueRef.current = markdown;
          }
        },
        focus: () => editorRef.current?.focus(),
        blur: () => editorRef.current?.blur(),
        isEmpty: async () => {
          if (!editorRef.current) return true;
          try {
            const text = await editorRef.current.getText();
            return !text || text.trim().length === 0;
          } catch {
            return true;
          }
        },
        clear: () => {
          editorRef.current?.setContent('');
          lastValueRef.current = '';
        },
        undo: () => editorRef.current?.undo(),
        redo: () => editorRef.current?.redo(),
      }),
      []
    );

    // Default toolbar items - matches web
    const defaultItems: ToolbarItem[] = [
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
    ];

    // Get disabled items set for filtering
    const disabledItems = new Set(toolbar.disabledItems ?? []);

    // Map toolbar items, expanding arrays (like 'heading' -> ['h1', 'h2', ...])
    // and filtering out disabled items
    const toolbarItems = (toolbar.items ?? defaultItems)
      .filter((item) => !disabledItems.has(item))
      .flatMap((item) => {
        const mapped = TOOLBAR_ITEM_MAP[item];
        if (mapped === null) return [];
        if (Array.isArray(mapped)) return mapped;
        return [mapped];
      });

    const showToolbar = toolbar.visible !== false && editable;
    const toolbarPosition = toolbar.position ?? 'top';

    const containerStyle = [
      (editorStyles.container as any)({ size, linkIntent }),
      style,
    ];

    const editorContentStyle = [
      (editorStyles.editorContent as any)({ size, linkIntent }),
      { minHeight },
      maxHeight !== undefined && { maxHeight },
    ];

    const content = (
      <View
        style={containerStyle}
        nativeID={id}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
      >
        {showToolbar && toolbarPosition === 'top' && (
          <Toolbar editor={editor} items={toolbarItems} />
        )}
        <View style={editorContentStyle}>
          <RichText
            editor={editor}
            onFocus={onFocus}
            onBlur={onBlur}
            style={nativeStyles.richText}
          />
        </View>
        {showToolbar && toolbarPosition === 'bottom' && (
          <Toolbar editor={editor} items={toolbarItems} />
        )}
      </View>
    );

    if (Platform.OS === 'ios' && avoidIosKeyboard) {
      return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          {content}
        </KeyboardAvoidingView>
      );
    }

    return content;
  }
);

const nativeStyles = StyleSheet.create({
  richText: {
    flex: 1,
  },
});

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;
