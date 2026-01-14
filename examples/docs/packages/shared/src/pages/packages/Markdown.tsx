import React, { useState } from 'react';
import { View, Text, Card, Screen, TextArea } from '@idealyst/components';
import { Markdown } from '@idealyst/markdown';
import { CodeBlock } from '../../components/CodeBlock';
import { LivePreview } from '../../components/LivePreview';

export function MarkdownPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Markdown
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Cross-platform markdown renderer for React and React Native. Supports GitHub Flavored
          Markdown with full theme integration for consistent styling across platforms.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          code={`yarn add @idealyst/markdown @idealyst/theme

# Web peer dependencies
yarn add react-markdown remark-gfm

# Native peer dependencies
yarn add react-native-markdown-display`}
          language="bash"
          title="Install"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Basic Usage
        </Text>

        <CodeBlock
          code={`import { Markdown } from '@idealyst/markdown';

function MyComponent() {
  return (
    <Markdown>
      {\`# Hello World

This is **bold** and _italic_ text.

- List item 1
- List item 2
- List item 3
\`}
    </Markdown>
  );
}`}
          language="tsx"
          title="Basic Example"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Live Examples
        </Text>

        <LivePreview title="Basic Markdown">
          <View style={{ width: '100%', maxWidth: 600 }}>
            <Markdown>
{`# Welcome to Markdown

This is a paragraph with **bold text**, *italic text*, and \`inline code\`.

## Lists

Here's an unordered list:
- First item
- Second item
- Third item

And an ordered list:
1. Step one
2. Step two
3. Step three

## Blockquote

> This is a blockquote. It can contain multiple lines
> and will be styled with a border on the left.

## Code Block

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

## Link

Check out the [Idealyst documentation](https://github.com/IdealystIO/idealyst-framework).
`}
            </Markdown>
          </View>
        </LivePreview>

        <LivePreview title="Tables (GFM)">
          <View style={{ width: '100%', maxWidth: 600 }}>
            <Markdown>
{`## Project Status

| Feature | Status | Priority |
|---------|--------|----------|
| Authentication | Complete | High |
| Dashboard | In Progress | High |
| Settings | Planned | Medium |
| Analytics | Not Started | Low |
`}
            </Markdown>
          </View>
        </LivePreview>

        <LivePreview title="Task Lists (GFM)">
          <View style={{ width: '100%', maxWidth: 600 }}>
            <Markdown>
{`## Todo List

- [x] Setup project structure
- [x] Install dependencies
- [ ] Write documentation
- [ ] Add unit tests
- [ ] Deploy to production
`}
            </Markdown>
          </View>
        </LivePreview>

        <LivePreview title="Different Sizes">
          <View style={{ width: '100%', maxWidth: 600, gap: 24 }}>
            <View>
              <Text typography="caption" color="secondary" style={{ marginBottom: 8 }}>size="sm"</Text>
              <Markdown size="sm">
{`**Small text** with a [link](#) and \`code\`.`}
              </Markdown>
            </View>
            <View>
              <Text typography="caption" color="secondary" style={{ marginBottom: 8 }}>size="md" (default)</Text>
              <Markdown size="md">
{`**Medium text** with a [link](#) and \`code\`.`}
              </Markdown>
            </View>
            <View>
              <Text typography="caption" color="secondary" style={{ marginBottom: 8 }}>size="lg"</Text>
              <Markdown size="lg">
{`**Large text** with a [link](#) and \`code\`.`}
              </Markdown>
            </View>
          </View>
        </LivePreview>

        <LivePreview title="Link Intents">
          <View style={{ width: '100%', maxWidth: 600, gap: 16 }}>
            <Markdown linkIntent="primary">
{`[Primary link](#) - default intent`}
            </Markdown>
            <Markdown linkIntent="secondary">
{`[Secondary link](#) - muted style`}
            </Markdown>
            <Markdown linkIntent="success">
{`[Success link](#) - positive action`}
            </Markdown>
            <Markdown linkIntent="warning">
{`[Warning link](#) - caution`}
            </Markdown>
            <Markdown linkIntent="danger">
{`[Danger link](#) - destructive action`}
            </Markdown>
          </View>
        </LivePreview>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Interactive Playground
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Try out the Markdown component in real-time. Edit the markdown on the left and see the
          rendered output on the right.
        </Text>

        <MarkdownPlayground />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Props
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <PropCard
            name="children"
            type="string"
            required
            description="The markdown content to render."
          />
          <PropCard
            name="size"
            type="Size"
            defaultValue="'md'"
            description="Text size variant that affects base font size. Options: 'xs', 'sm', 'md', 'lg', 'xl'."
          />
          <PropCard
            name="linkIntent"
            type="Intent"
            defaultValue="'primary'"
            description="Color intent for links. Options: 'primary', 'secondary', 'success', 'warning', 'danger'."
          />
          <PropCard
            name="gfm"
            type="boolean"
            defaultValue="true"
            description="Enable GitHub Flavored Markdown extensions (tables, strikethrough, task lists)."
          />
          <PropCard
            name="allowHtml"
            type="boolean"
            defaultValue="false"
            description="Allow raw HTML in markdown content. Use with caution for security reasons."
          />
          <PropCard
            name="styleOverrides"
            type="MarkdownStyleOverrides"
            description="Custom style overrides for specific markdown elements."
          />
          <PropCard
            name="linkHandler"
            type="LinkHandler"
            description="Custom handler for link clicks/presses."
          />
          <PropCard
            name="imageHandler"
            type="ImageHandler"
            description="Custom handler for image loading and clicks."
          />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          GitHub Flavored Markdown
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          The component supports GFM extensions including tables, task lists, and strikethrough:
        </Text>

        <CodeBlock
          code={`<Markdown gfm>
  {\`## Task List
- [x] Completed task
- [ ] Pending task
- [ ] Another task

## Table
| Name    | Role       |
|---------|------------|
| Alice   | Developer  |
| Bob     | Designer   |

## Strikethrough
This is ~~deleted~~ text.
\`}
</Markdown>`}
          language="tsx"
          title="GFM Features"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Custom Link Handling
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Handle link clicks with custom logic, useful for navigation or analytics:
        </Text>

        <CodeBlock
          code={`import { Markdown } from '@idealyst/markdown';
import { useNavigator } from '@idealyst/navigation';

function DocsContent({ content }: { content: string }) {
  const navigator = useNavigator();

  return (
    <Markdown
      linkHandler={{
        onLinkPress: (url, title) => {
          // Handle internal links
          if (url.startsWith('/')) {
            navigator.navigate(url);
            return true; // Prevent default
          }
          // External links open normally
          return false;
        },
        openExternalLinks: true, // Open in new tab/browser
      }}
    >
      {content}
    </Markdown>
  );
}`}
          language="tsx"
          title="Link Handler"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Style Overrides
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Customize the styling of individual markdown elements:
        </Text>

        <CodeBlock
          code={`<Markdown
  styleOverrides={{
    heading1: { color: 'blue', fontSize: 32 },
    blockquote: { backgroundColor: '#f0f0f0', borderLeftColor: 'purple' },
    codeBlock: { backgroundColor: '#1e1e1e' },
    link: { color: 'green' },
  }}
>
  {\`# Custom Styled Heading

> This blockquote has custom colors

[Custom link color](#)
\`}
</Markdown>`}
          language="tsx"
          title="Style Overrides"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Supported Elements
        </Text>

        <View style={{ gap: 8, marginBottom: 32 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              Text Formatting
            </Text>
            <Text typography="body2" color="tertiary">
              Headings (h1-h6), paragraphs, bold, italic, strikethrough, inline code
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              Block Elements
            </Text>
            <Text typography="body2" color="tertiary">
              Blockquotes, code blocks (fenced), horizontal rules, images
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              Lists
            </Text>
            <Text typography="body2" color="tertiary">
              Ordered lists, unordered lists, task lists (GFM)
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              Tables (GFM)
            </Text>
            <Text typography="body2" color="tertiary">
              Full table support with headers, rows, and column alignment
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              Links
            </Text>
            <Text typography="body2" color="tertiary">
              Inline links, reference links, autolinks
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Platform Differences
        </Text>

        <View style={{ gap: 16 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              Web (react-markdown)
            </Text>
            <Text typography="body2" color="tertiary">
              Uses react-markdown with remark-gfm plugin. Full GFM support including
              footnotes. Links open in new tab by default for external URLs.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              React Native (react-native-markdown-display)
            </Text>
            <Text typography="body2" color="tertiary">
              Uses react-native-markdown-display for native rendering. Most GFM features
              supported. Links open in the device browser via Linking API.
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          TypeScript Types
        </Text>

        <CodeBlock
          code={`interface MarkdownProps {
  children: string;
  size?: Size;
  linkIntent?: Intent;
  styleOverrides?: MarkdownStyleOverrides;
  linkHandler?: LinkHandler;
  imageHandler?: ImageHandler;
  codeOptions?: CodeBlockOptions;
  gfm?: boolean;
  allowHtml?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

interface LinkHandler {
  onLinkPress?: (url: string, title?: string) => boolean | void;
  openExternalLinks?: boolean;
}

interface ImageHandler {
  resolveImageUrl?: (src: string) => string;
  defaultImageDimensions?: { width?: number; height?: number };
  onImagePress?: (src: string, alt?: string) => void;
}

type MarkdownElementType =
  | 'body' | 'heading1' | 'heading2' | 'heading3'
  | 'heading4' | 'heading5' | 'heading6' | 'paragraph'
  | 'strong' | 'em' | 'strikethrough' | 'link'
  | 'blockquote' | 'codeInline' | 'codeBlock'
  | 'listOrdered' | 'listUnordered' | 'listItem'
  | 'table' | 'tableHead' | 'tableRow' | 'tableCell'
  | 'image' | 'hr' | 'taskListItem';`}
          language="typescript"
          title="Type Definitions"
        />
      </View>
    </Screen>
  );
}

const DEFAULT_PLAYGROUND_MARKDOWN = `# Markdown Playground

Welcome to the **interactive playground**! Edit this text to see changes in real-time.

## Features

You can use all standard markdown features:

- **Bold text** and *italic text*
- \`Inline code\` snippets
- [Links](https://example.com)

### Code Blocks

\`\`\`javascript
function hello(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Tables

| Feature | Supported |
|---------|-----------|
| Tables | Yes |
| Task Lists | Yes |
| Strikethrough | Yes |

### Task List

- [x] Learn markdown basics
- [x] Try the playground
- [ ] Build something awesome

> **Tip:** Try adding your own markdown elements!
`;

function MarkdownPlayground() {
  const [markdown, setMarkdown] = useState(DEFAULT_PLAYGROUND_MARKDOWN);

  return (
    <Card variant="outlined" style={{ overflow: 'hidden', marginBottom: 24 }}>
      <View
        style={{
          flexDirection: 'row',
          minHeight: 500,
        }}
      >
        {/* Editor Panel */}
        <View
          style={{
            flex: 1,
            borderRightWidth: 1,
            borderRightColor: '#e5e7eb',
          }}
        >
          <View
            style={{
              padding: 12,
              backgroundColor: '#f9fafb',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb',
            }}
          >
            <Text weight="semibold" typography="body2">
              Markdown Input
            </Text>
          </View>
          <TextArea
            value={markdown}
            onChangeText={setMarkdown}
            style={{
              flex: 1,
              padding: 16,
              fontFamily: 'monospace',
              fontSize: 14,
              lineHeight: 22,
              borderWidth: 0,
              borderRadius: 0,
              minHeight: 450,
              resize: 'none',
            }}
            placeholder="Type your markdown here..."
          />
        </View>

        {/* Preview Panel */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              padding: 12,
              backgroundColor: '#f9fafb',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb',
            }}
          >
            <Text weight="semibold" typography="body2">
              Preview
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              padding: 16,
              overflow: 'auto',
            }}
          >
            <Markdown>{markdown}</Markdown>
          </View>
        </View>
      </View>
    </Card>
  );
}

function PropCard({
  name,
  type,
  defaultValue,
  required,
  description,
}: {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
}) {
  return (
    <Card variant="outlined" style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 }}>
        <Text weight="semibold">{name}</Text>
        {required && (
          <Text typography="caption" style={{ color: '#ef4444' }}>
            required
          </Text>
        )}
      </View>
      <Text
        typography="caption"
        style={{ fontFamily: 'monospace', marginBottom: 8, color: '#6366f1' }}
      >
        {type}
        {defaultValue && ` = ${defaultValue}`}
      </Text>
      <Text typography="body2" color="tertiary">
        {description}
      </Text>
    </Card>
  );
}
