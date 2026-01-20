import { useState, useRef } from 'react';
import { View, Text, Card, Button, Screen } from '@idealyst/components';
import { MarkdownEditor } from '../index';
import type { MarkdownEditorRef } from '../types';

const SAMPLE_MARKDOWN = `# Welcome to the Editor

This is a **rich text** editor that works with *markdown*.

## Features

- Bold, italic, underline formatting
- Headings (H1-H6)
- Bullet and numbered lists
- Task lists
- Code blocks
- Blockquotes
- Links

### Code Example

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a blockquote with some important information.

Try editing this content!
`;

/**
 * Basic usage example
 */
function BasicEditorExample() {
  const [content, setContent] = useState(SAMPLE_MARKDOWN);

  return (
    <Card>
      <View spacing="md" style={{ padding: 16 }}>
        <Text size="lg" weight="semibold">Basic Editor</Text>
        <Text size="sm" color="secondary">
          A simple controlled editor with markdown input/output
        </Text>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="Start writing..."
          minHeight={300}
        />
      </View>
    </Card>
  );
}

/**
 * Controlled editor with ref methods
 */
function ControlledEditorExample() {
  const [content, setContent] = useState('');
  const [output, setOutput] = useState('');
  const editorRef = useRef<MarkdownEditorRef>(null);

  const handleClear = () => {
    editorRef.current?.clear();
    setOutput('');
  };

  const handleGetContent = async () => {
    const markdown = await editorRef.current?.getMarkdown();
    setOutput(markdown ?? '');
  };

  const handleSetContent = () => {
    editorRef.current?.setMarkdown('# New Content\n\nThis was set programmatically.');
  };

  return (
    <Card>
      <View spacing="md" style={{ padding: 16 }}>
        <Text size="lg" weight="semibold">Editor with Ref Methods</Text>
        <Text size="sm" color="secondary">
          Use ref methods to programmatically control the editor
        </Text>
        <View direction="row" spacing="sm">
          <Button size="sm" type="outlined" onPress={handleClear}>
            Clear
          </Button>
          <Button size="sm" type="outlined" onPress={handleGetContent}>
            Get Markdown
          </Button>
          <Button size="sm" type="outlined" onPress={handleSetContent}>
            Set Content
          </Button>
        </View>
        <MarkdownEditor
          ref={editorRef}
          value={content}
          onChange={setContent}
          placeholder="Type something..."
          minHeight={200}
        />
        {output ? (
          <View spacing="sm">
            <Text size="sm" weight="semibold">Output:</Text>
            <View style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}>
              <Text size="sm" style={{ fontFamily: 'monospace' }}>
                {output}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

/**
 * Read-only mode example
 */
function ReadOnlyEditorExample() {
  return (
    <Card>
      <View spacing="md" style={{ padding: 16 }}>
        <Text size="lg" weight="semibold">Read-Only Mode</Text>
        <Text size="sm" color="secondary">
          Use editable=false for a rich markdown viewer
        </Text>
        <MarkdownEditor
          initialValue={SAMPLE_MARKDOWN}
          editable={false}
          toolbar={{ visible: false }}
          minHeight={250}
        />
      </View>
    </Card>
  );
}

/**
 * Custom toolbar configuration
 */
function CustomToolbarExample() {
  const [content, setContent] = useState('');

  return (
    <Card>
      <View spacing="md" style={{ padding: 16 }}>
        <Text size="lg" weight="semibold">Custom Toolbar</Text>
        <Text size="sm" color="secondary">
          Configure which toolbar items appear and their position
        </Text>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="Minimal formatting options..."
          toolbar={{
            items: ['bold', 'italic', 'link', 'bulletList', 'orderedList'],
            position: 'bottom',
          }}
          minHeight={200}
        />
      </View>
    </Card>
  );
}

/**
 * Disabled toolbar items example
 */
function DisabledItemsExample() {
  const [content, setContent] = useState('');

  return (
    <Card>
      <View spacing="md" style={{ padding: 16 }}>
        <Text size="lg" weight="semibold">Disabled Toolbar Items</Text>
        <Text size="sm" color="secondary">
          Disable specific toolbar items while keeping them visible (grayed out)
        </Text>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="Link and image buttons are disabled..."
          toolbar={{
            items: ['bold', 'italic', 'underline', 'link', 'image', 'bulletList', 'codeBlock'],
            disabledItems: ['link', 'image'],
          }}
          minHeight={200}
        />
      </View>
    </Card>
  );
}

/**
 * Editor with all examples combined
 */
export function MarkdownEditorExamples() {
  return (
    <Screen>
      <View spacing="lg" padding={12}>
        <Text size="xl" weight="bold">
          Markdown Editor
        </Text>
        <Text color="secondary">
          A cross-platform WYSIWYG markdown editor. Uses Tiptap on web and 10tap-editor on native.
        </Text>

        <Card>
          <View spacing="sm" style={{ padding: 16 }}>
            <Text size="lg" weight="semibold">Features</Text>
            <View spacing="xs">
              <Text size="sm">• Markdown input/output - no HTML exposed to consumers</Text>
              <Text size="sm">• Rich text editing with formatting toolbar</Text>
              <Text size="sm">• Controlled and uncontrolled modes</Text>
              <Text size="sm">• Ref methods for programmatic control</Text>
              <Text size="sm">• Configurable toolbar items and position</Text>
              <Text size="sm">• Disable specific toolbar items</Text>
              <Text size="sm">• Theme integration via Unistyles</Text>
            </View>
          </View>
        </Card>

        <BasicEditorExample />
        <ControlledEditorExample />
        <ReadOnlyEditorExample />
        <CustomToolbarExample />
        <DisabledItemsExample />
      </View>
    </Screen>
  );
}

export default MarkdownEditorExamples;
