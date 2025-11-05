export const Chip = {
category: "display",
    description: "Compact element for tags, filters, and selections with optional delete action",
        props: `
- \`label\`: string - The text content of the chip
- \`type\`: ChipType - Visual style variant
- \`intent\`: ChipIntent - Color intent/semantic meaning
- \`size\`: ChipSize - Size of the chip
- \`icon\`: IconName | React.ReactNode - Icon to display before the label. Can be an icon name (string) or a custom React element
- \`deletable\`: boolean - Whether the chip can be deleted
- \`onDelete\`: function - Callback when delete button is pressed
- \`deleteIcon\`: IconName | React.ReactNode - Icon to display in the delete button. Defaults to 'close'
- \`selectable\`: boolean - Whether the chip is selectable
- \`selected\`: boolean - Whether the chip is selected (when selectable)
- \`onPress\`: function - Callback when chip is pressed
- \`disabled\`: boolean - Whether the chip is disabled
`,
    features: [
      "Three variants: filled, outlined, soft",
      "Five intent colors",
      "Icon support with MDI icons",
      "Deletable with onDelete handler",
      "Customizable delete icon (defaults to MDI 'close')",
      "Selectable with selected state",
      "Three sizes",
      "Disabled state",
    ],
    bestPractices: [
      "Use for tags, filters, and multi-select options",
      "Use deletable chips for removable tags",
      "Use selectable chips for filter options",
      "Keep chip labels concise",
    ],
    usage: `
import { Chip } from '@idealyst/components';

<Chip
  label="React"
  icon="check"
  deletable
  onDelete={() => removeTag('React')}
/>
`,
    examples: {
      basic: `import { Chip } from '@idealyst/components';

<Chip label="Tag" />`,
      variants: `import { Chip } from '@idealyst/components';

<Chip label="Filled" type="filled" intent="primary" />
<Chip label="Outlined" type="outlined" intent="success" />
<Chip label="Soft" type="soft" intent="warning" />`,
      "with-icons": `import { Chip } from '@idealyst/components';

<Chip label="Star" icon="star" />
<Chip label="Heart" icon="heart" intent="error" />

// Custom delete icon
<Chip
  label="Custom Delete"
  deletable
  deleteIcon="close-circle"
  onDelete={() => console.log('deleted')}
/>

// Alternative delete icons
<Chip
  label="Remove"
  deletable
  deleteIcon="delete"
  onDelete={() => console.log('deleted')}
/>`,
      interactive: `import { Chip, View } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Node.js']);

  return (
    <View spacing="sm">
      {tags.map(tag => (
        <Chip
          key={tag}
          label={tag}
          deletable
          onDelete={() => setTags(tags.filter(t => t !== tag))}
        />
      ))}
    </View>
  );
}`,
    }
};
