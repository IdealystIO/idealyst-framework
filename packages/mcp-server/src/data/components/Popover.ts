export const Popover = {
  category: "overlay",
  description: "Floating overlay that displays content anchored to an element, useful for tooltips, menus, and contextual information",
      props: `
- \`open\`: boolean - Whether the popover is open/visible
- \`onOpenChange\`: function - Called when the popover should be opened or closed
- \`anchor\`: React.ReactNode | React.RefObject<Element> - The anchor element to position the popover relative to Can be a React element or a ref to a DOM element
- \`children\`: React.ReactNode - The content to display inside the popover
- \`placement\`: PopoverPlacement - Preferred placement of the popover relative to anchor
- \`offset\`: number - Distance from the anchor element in pixels
- \`closeOnClickOutside\`: boolean - Whether clicking outside should close the popover
- \`closeOnEscapeKey\`: boolean - Whether pressing escape key should close the popover (web only)
- \`showArrow\`: boolean - Whether to show an arrow pointing to the anchor
`,
  features: [
    "12 placement options with smart positioning",
    "Automatic repositioning on scroll/resize",
    "Click outside to close",
    "Escape key to close (web)",
    "Optional arrow indicator",
    "Offset control",
    "Accessible with focus management",
  ],
  bestPractices: [
    "Use for contextual information that doesn't require immediate action",
    "Keep popover content focused and concise",
    "Use arrow to clearly indicate relationship to anchor",
    "Allow closing via click outside and Escape key",
    "Don't nest popovers",
    "Consider using Dialog for critical content",
  ],
  usage: `
import { Popover, Button, View, Text } from '@idealyst/components';
import { useState, useRef } from 'react';

function Example() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  return (
    <>
      <div ref={buttonRef}>
        <Button onPress={() => setOpen(true)}>Show Info</Button>
      </div>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={buttonRef}
        placement="bottom"
        showArrow
      >
        <View spacing="sm" style={{ padding: 16 }}>
          <Text weight="bold">Information</Text>
          <Text>Additional context or help text</Text>
        </View>
      </Popover>
    </>
  );
}
`,
  examples: {
    basic: `import { Popover, Button, Text } from '@idealyst/components';
import { useState, useRef } from 'react';

const [open, setOpen] = useState(false);
const buttonRef = useRef(null);

<div ref={buttonRef}>
  <Button onPress={() => setOpen(true)}>Open</Button>
</div>
<Popover open={open} onOpenChange={setOpen} anchor={buttonRef}>
  <Text>Popover content</Text>
</Popover>`,

    variants: `import { Popover, Button, View } from '@idealyst/components';

// Different placements
<Popover open={open} onOpenChange={setOpen} anchor={ref} placement="top">
  <View>Top</View>
</Popover>
<Popover open={open} onOpenChange={setOpen} anchor={ref} placement="bottom-start">
  <View>Bottom Start</View>
</Popover>
<Popover open={open} onOpenChange={setOpen} anchor={ref} placement="right-end">
  <View>Right End</View>
</Popover>`,

    "with-icons": `import { Popover, Button, View, Icon, Text } from '@idealyst/components';
import { useState, useRef } from 'react';

const buttonRef = useRef(null);
const [open, setOpen] = useState(false);

<div ref={buttonRef}>
  <Button icon="help-circle" type="text" onPress={() => setOpen(true)} />
</div>
<Popover open={open} onOpenChange={setOpen} anchor={buttonRef} showArrow>
  <View spacing="sm" style={{ padding: 12, maxWidth: 250 }}>
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Icon name="information" size="md" color="primary" />
      <Text weight="bold">Help</Text>
    </View>
    <Text size="sm">This feature allows you to...</Text>
  </View>
</Popover>`,

    interactive: `import { Popover, Button, View, Text, Input } from '@idealyst/components';
import { useState, useRef } from 'react';

function Example() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const buttonRef = useRef(null);

  return (
    <View spacing="md">
      <div ref={buttonRef}>
        <Button onPress={() => setOpen(true)}>Edit Name</Button>
      </div>

      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={buttonRef}
        placement="bottom-start"
        closeOnClickOutside={false}
      >
        <View spacing="md" style={{ padding: 16, minWidth: 250 }}>
          <Text weight="bold">Edit Name</Text>
          <Input
            value={value}
            onChangeText={setValue}
            placeholder="Enter name"
          />
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
            <Button
              type="outlined"
              size="sm"
              onPress={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onPress={() => {
                handleSave(value);
                setOpen(false);
              }}
            >
              Save
            </Button>
          </View>
        </View>
      </Popover>
    </View>
  );
}`,
  },
};
