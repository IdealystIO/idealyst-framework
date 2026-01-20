/**
 * MarkdownEditor styles using defineStyle with theme integration.
 *
 * Provides consistent styling for the markdown editor that
 * integrates with the Idealyst theme system.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type EditorVariants = {
  size: Size;
  linkIntent: Intent;
};

/**
 * Dynamic props passed to editor style functions.
 */
export type EditorDynamicProps = {
  linkIntent?: Intent;
  size?: Size;
};

/**
 * Editor styles with theme integration.
 */
// @ts-expect-error - MarkdownEditor is not in the ComponentName union yet
export const editorStyles = defineStyle('MarkdownEditor', (theme: Theme) => ({
  // Main container
  container: (_props: EditorDynamicProps) => ({
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surface.primary,
    overflow: 'hidden',
  }),

  // Editor content area
  editorContent: (_props: EditorDynamicProps) => ({
    padding: 16,
    minHeight: 200,
    fontSize: theme.sizes.typography.body1.fontSize,
    lineHeight: theme.sizes.typography.body1.lineHeight,
    color: theme.colors.text.primary,
  }),

  // Toolbar container
  toolbar: (_props: EditorDynamicProps) => ({
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 4,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    backgroundColor: theme.colors.surface.secondary,
    _web: {
      display: 'flex',
    },
  }),

  // Toolbar button base
  toolbarButton: (_props: EditorDynamicProps) => ({
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: theme.radii.sm,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '500' as const,
    minWidth: 32,
    height: 32,
    _web: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      outline: 'none',
      border: 'none',
    },
  }),

  // Toolbar button active state
  toolbarButtonActive: (_props: EditorDynamicProps) => ({
    backgroundColor: theme.intents?.primary?.primary ?? theme.colors.surface.tertiary,
    color: theme.intents?.primary?.contrast ?? theme.colors.text.inverse,
  }),

  // Focus ring for accessibility
  focusRing: (_props: EditorDynamicProps) => ({
  }),
}));

/**
 * Generate CSS for Tiptap editor based on theme colors.
 * This is injected as a style tag since Tiptap uses its own DOM.
 */
export function generateTiptapCSS(theme: BaseTheme): string {
  const primary = theme.intents?.primary?.primary ?? theme.colors.text.primary;

  return `
    .tiptap-editor-wrapper .tiptap {
      outline: none;
      min-height: 100%;
      font-family: inherit;
    }

    .tiptap-editor-wrapper .tiptap:focus {
      outline: none;
    }

    .tiptap-editor-wrapper .tiptap p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: ${theme.colors.text.tertiary};
      pointer-events: none;
      float: left;
      height: 0;
    }

    /* Headings */
    .tiptap-editor-wrapper .tiptap h1 {
      font-size: ${theme.sizes.typography.h1.fontSize}px;
      line-height: ${theme.sizes.typography.h1.lineHeight}px;
      font-weight: 700;
      margin-top: 1em;
      margin-bottom: 0.5em;
      color: ${theme.colors.text.primary};
    }

    .tiptap-editor-wrapper .tiptap h2 {
      font-size: ${theme.sizes.typography.h2.fontSize}px;
      line-height: ${theme.sizes.typography.h2.lineHeight}px;
      font-weight: 600;
      margin-top: 1em;
      margin-bottom: 0.5em;
      border-bottom: 1px solid ${theme.colors.border.primary};
      padding-bottom: 0.25em;
      color: ${theme.colors.text.primary};
    }

    .tiptap-editor-wrapper .tiptap h3 {
      font-size: ${theme.sizes.typography.h3.fontSize}px;
      line-height: ${theme.sizes.typography.h3.lineHeight}px;
      font-weight: 600;
      margin-top: 1em;
      margin-bottom: 0.5em;
      color: ${theme.colors.text.primary};
    }

    .tiptap-editor-wrapper .tiptap h4,
    .tiptap-editor-wrapper .tiptap h5,
    .tiptap-editor-wrapper .tiptap h6 {
      font-weight: 600;
      margin-top: 1em;
      margin-bottom: 0.5em;
      color: ${theme.colors.text.primary};
    }

    /* Remove top margin from first child */
    .tiptap-editor-wrapper .tiptap > *:first-child {
      margin-top: 0;
    }

    /* Paragraphs */
    .tiptap-editor-wrapper .tiptap p {
      margin-top: 0;
      margin-bottom: 0.5em;
      color: ${theme.colors.text.primary};
    }

    /* Links */
    .tiptap-editor-wrapper .tiptap a {
      color: ${primary};
      text-decoration: underline;
      cursor: pointer;
    }

    .tiptap-editor-wrapper .tiptap a:hover {
      opacity: 0.8;
    }

    /* Inline Code */
    .tiptap-editor-wrapper .tiptap code {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      background-color: ${theme.colors.surface.secondary};
      padding: 2px 6px;
      border-radius: ${theme.radii.xs}px;
      font-size: ${theme.sizes.typography.caption.fontSize}px;
      color: ${theme.colors.text.primary};
    }

    /* Code Blocks */
    .tiptap-editor-wrapper .tiptap pre {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      background-color: ${theme.colors.surface.secondary};
      padding: 16px;
      border-radius: ${theme.radii.md}px;
      margin-top: 12px;
      margin-bottom: 12px;
      overflow-x: auto;
      color: ${theme.colors.text.primary};
    }

    .tiptap-editor-wrapper .tiptap pre code {
      background-color: transparent;
      padding: 0;
      font-size: inherit;
    }

    /* Blockquote */
    .tiptap-editor-wrapper .tiptap blockquote {
      border-left: 4px solid ${primary};
      padding-left: 16px;
      padding-top: 8px;
      padding-bottom: 8px;
      margin-top: 12px;
      margin-bottom: 12px;
      margin-left: 0;
      margin-right: 0;
      background-color: ${theme.colors.surface.secondary};
      border-radius: ${theme.radii.sm}px;
      font-style: italic;
      color: ${theme.colors.text.secondary};
    }

    /* Lists */
    .tiptap-editor-wrapper .tiptap ul,
    .tiptap-editor-wrapper .tiptap ol {
      margin-top: 8px;
      margin-bottom: 8px;
      padding-left: 24px;
      color: ${theme.colors.text.primary};
    }

    .tiptap-editor-wrapper .tiptap li {
      margin-top: 4px;
      margin-bottom: 4px;
    }

    .tiptap-editor-wrapper .tiptap li p {
      margin: 0;
    }

    /* Task list */
    .tiptap-editor-wrapper .tiptap ul[data-type="taskList"] {
      list-style: none;
      padding: 0;
    }

    .tiptap-editor-wrapper .tiptap ul[data-type="taskList"] li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .tiptap-editor-wrapper .tiptap ul[data-type="taskList"] li > label {
      flex-shrink: 0;
      margin-top: 4px;
    }

    .tiptap-editor-wrapper .tiptap ul[data-type="taskList"] li > div {
      flex: 1;
    }

    .tiptap-editor-wrapper .tiptap ul[data-type="taskList"] input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: ${primary};
      cursor: pointer;
    }

    /* Horizontal rule */
    .tiptap-editor-wrapper .tiptap hr {
      height: 1px;
      background-color: ${theme.colors.border.secondary};
      margin-top: 24px;
      margin-bottom: 24px;
      border: none;
    }

    /* Table */
    .tiptap-editor-wrapper .tiptap table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 12px;
      margin-bottom: 12px;
    }

    .tiptap-editor-wrapper .tiptap th,
    .tiptap-editor-wrapper .tiptap td {
      border: 1px solid ${theme.colors.border.primary};
      padding: 12px;
      text-align: left;
    }

    .tiptap-editor-wrapper .tiptap th {
      background-color: ${theme.colors.surface.secondary};
      font-weight: 600;
    }

    /* Strong/Bold */
    .tiptap-editor-wrapper .tiptap strong {
      font-weight: 700;
    }

    /* Italic/Emphasis */
    .tiptap-editor-wrapper .tiptap em {
      font-style: italic;
    }

    /* Strikethrough */
    .tiptap-editor-wrapper .tiptap s {
      text-decoration: line-through;
    }

    /* Underline */
    .tiptap-editor-wrapper .tiptap u {
      text-decoration: underline;
    }

    /* Images */
    .tiptap-editor-wrapper .tiptap img {
      max-width: 100%;
      height: auto;
      border-radius: ${theme.radii.sm}px;
    }
  `;
}
