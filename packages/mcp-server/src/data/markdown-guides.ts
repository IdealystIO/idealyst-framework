/**
 * Markdown Package Guides
 *
 * Comprehensive documentation for @idealyst/markdown.
 */

export const markdownGuides: Record<string, string> = {
  "idealyst://markdown/overview": `# @idealyst/markdown

Cross-platform Markdown renderer with theme integration, syntax highlighting, and GFM support.

## Installation

\`\`\`bash
yarn add @idealyst/markdown
\`\`\`

## Platform Support

| Platform | Status |
|----------|--------|
| Web      | ✅ react-markdown |
| iOS      | ✅ react-native-markdown-display |
| Android  | ✅ react-native-markdown-display |

## Key Exports

\`\`\`typescript
import { Markdown } from '@idealyst/markdown';
import type { MarkdownProps, MarkdownStyleOverrides } from '@idealyst/markdown';
\`\`\`

## Quick Start

\`\`\`tsx
import { Markdown } from '@idealyst/markdown';

function MarkdownContent() {
  return (
    <Markdown>
      {\`# Hello World

This is **bold** and *italic* text.

- List item 1
- List item 2

\\\`\\\`\\\`javascript
const x = 42;
\\\`\\\`\\\`
\`}
    </Markdown>
  );
}
\`\`\`
`,

  "idealyst://markdown/api": `# @idealyst/markdown — API Reference

## Markdown Component

### MarkdownProps

\`\`\`typescript
interface MarkdownProps {
  /** Markdown content string */
  children: string;

  /** Text size variant (default: 'md') */
  size?: Size;

  /** Link color intent (default: 'primary') */
  linkIntent?: Intent;

  /** Custom style overrides for specific elements */
  styleOverrides?: MarkdownStyleOverrides;

  /** Link handling configuration */
  linkHandler?: LinkHandler;

  /** Image handling configuration */
  imageHandler?: ImageHandler;

  /** Code block configuration */
  codeOptions?: CodeBlockOptions;

  /** Enable GFM extensions: tables, strikethrough, task lists, footnotes (default: true) */
  gfm?: boolean;

  /** Allow raw HTML in markdown (default: false) */
  allowHtml?: boolean;

  /** Custom component renderers (advanced) */
  components?: Partial<Record<MarkdownElementType, ComponentType<any>>>;

  /** Container style */
  style?: StyleProp<ViewStyle>;

  testID?: string;
  accessibilityLabel?: string;
}
\`\`\`

---

### Style Types

\`\`\`typescript
type MarkdownElementType =
  | 'body' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6'
  | 'paragraph' | 'strong' | 'em' | 'strikethrough'
  | 'link' | 'blockquote'
  | 'codeInline' | 'codeBlock'
  | 'listOrdered' | 'listUnordered' | 'listItem'
  | 'table' | 'tableHead' | 'tableRow' | 'tableCell'
  | 'image' | 'hr' | 'taskListItem' | 'footnote' | 'footnoteRef';

type MarkdownStyleOverrides = Partial<Record<MarkdownElementType, StyleProp<ViewStyle | TextStyle>>>;
\`\`\`

---

### LinkHandler

\`\`\`typescript
interface LinkHandler {
  /** Called when link is pressed. Return true to prevent default. */
  onLinkPress?: (url: string, title?: string) => boolean | void;

  /** Open external links in browser (default: true) */
  openExternalLinks?: boolean;
}
\`\`\`

### ImageHandler

\`\`\`typescript
interface ImageHandler {
  /** Custom image URL resolver for relative paths */
  resolveImageUrl?: (src: string) => string;

  /** Default image dimensions when not specified */
  defaultImageDimensions?: { width?: number; height?: number };

  /** Called when image is pressed */
  onImagePress?: (src: string, alt?: string) => void;
}
\`\`\`

### CodeBlockOptions

\`\`\`typescript
interface CodeBlockOptions {
  /** Enable syntax highlighting (default: false) */
  syntaxHighlighting?: boolean;

  /** Syntax theme: 'auto' | 'light' | 'dark' (default: 'auto') */
  syntaxTheme?: 'auto' | 'light' | 'dark';

  /** Show line numbers (default: false) */
  showLineNumbers?: boolean;

  /** Show copy button — web only (default: true) */
  copyButton?: boolean;
}
\`\`\`
`,

  "idealyst://markdown/examples": `# @idealyst/markdown — Examples

## Basic Rendering

\`\`\`tsx
import React from 'react';
import { View } from '@idealyst/components';
import { Markdown } from '@idealyst/markdown';

function ArticleView({ content }: { content: string }) {
  return (
    <View padding="md">
      <Markdown size="md" gfm>
        {content}
      </Markdown>
    </View>
  );
}
\`\`\`

## Custom Link Handling

\`\`\`tsx
import React from 'react';
import { Markdown } from '@idealyst/markdown';
import { useNavigation } from '@idealyst/navigation';

function DocumentView({ markdown }: { markdown: string }) {
  const { navigate } = useNavigation();

  return (
    <Markdown
      linkHandler={{
        onLinkPress: (url) => {
          if (url.startsWith('/')) {
            navigate(url);
            return true; // Prevent default browser behavior
          }
          return false; // Allow external links to open normally
        },
        openExternalLinks: true,
      }}
    >
      {markdown}
    </Markdown>
  );
}
\`\`\`

## With Syntax Highlighting

\`\`\`tsx
import React from 'react';
import { Markdown } from '@idealyst/markdown';

function CodeDocumentation({ content }: { content: string }) {
  return (
    <Markdown
      codeOptions={{
        syntaxHighlighting: true,
        syntaxTheme: 'auto',
        showLineNumbers: true,
        copyButton: true,
      }}
    >
      {content}
    </Markdown>
  );
}
\`\`\`

## Custom Style Overrides

\`\`\`tsx
import React from 'react';
import { Markdown } from '@idealyst/markdown';

function StyledMarkdown({ content }: { content: string }) {
  return (
    <Markdown
      styleOverrides={{
        heading1: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
        heading2: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
        blockquote: {
          borderLeftWidth: 4,
          borderLeftColor: '#4CAF50',
          paddingLeft: 16,
          fontStyle: 'italic',
        },
        codeBlock: {
          backgroundColor: '#1e1e1e',
          borderRadius: 8,
          padding: 16,
        },
      }}
    >
      {content}
    </Markdown>
  );
}
\`\`\`

## Image Handling

\`\`\`tsx
import React from 'react';
import { Markdown } from '@idealyst/markdown';

function WikiArticle({ content, baseUrl }: { content: string; baseUrl: string }) {
  return (
    <Markdown
      imageHandler={{
        resolveImageUrl: (src) => {
          if (src.startsWith('http')) return src;
          return baseUrl + '/images/' + src;
        },
        defaultImageDimensions: { width: 300 },
        onImagePress: (src, alt) => console.log('Image clicked:', src),
      }}
    >
      {content}
    </Markdown>
  );
}
\`\`\`
`,
};
