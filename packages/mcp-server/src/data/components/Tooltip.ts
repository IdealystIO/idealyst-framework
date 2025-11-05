export const Tooltip = {
  category: "overlay",
  description: "Contextual tooltip that displays information on hover or focus",
      props: `
- \`content\`: string | React.ReactNode - The tooltip content to display
- \`children\`: React.ReactNode - The element that triggers the tooltip on hover/focus
- \`placement\`: TooltipPlacement - The placement of the tooltip relative to the trigger
- \`delay\`: number - Delay in milliseconds before showing the tooltip
- \`intent\`: TooltipIntentVariant - The intent/color scheme of the tooltip
- \`size\`: TooltipSizeVariant - The size variant of the tooltip
`,
  features: [
    "Hover and focus triggers",
    "Four placement options",
    "Configurable delay",
    "Five intent colors",
    "Three sizes",
    "String or custom content",
    "Auto-positioning on overflow",
  ],
  bestPractices: [
    "Keep tooltip content concise",
    "Use for supplementary information only",
    "Don't hide critical information in tooltips",
    "Ensure tooltips are keyboard accessible",
    "Use appropriate placement to avoid obscuring content",
    "Add small delay to prevent flashing",
  ],
  usage: `
import { Tooltip, Button } from '@idealyst/components';

<Tooltip content="Click to save your changes" placement="top">
  <Button icon="content-save">Save</Button>
</Tooltip>
`,
  examples: {
    basic: `import { Tooltip, Button } from '@idealyst/components';

<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>`,

    variants: `import { Tooltip, Button, View } from '@idealyst/components';

<View spacing="md">
  <Tooltip content="Top placement" placement="top">
    <Button>Top</Button>
  </Tooltip>
  <Tooltip content="Bottom placement" placement="bottom">
    <Button>Bottom</Button>
  </Tooltip>
  <Tooltip content="Left placement" placement="left">
    <Button>Left</Button>
  </Tooltip>
  <Tooltip content="Right placement" placement="right">
    <Button>Right</Button>
  </Tooltip>
</View>`,

    "with-icons": `import { Tooltip, Icon, Text, View } from '@idealyst/components';

<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <Text>Need help?</Text>
  <Tooltip
    content="Click here for assistance"
    placement="right"
    intent="primary"
  >
    <Icon name="help-circle" size="md" color="primary" />
  </Tooltip>
</View>`,

    interactive: `import { Tooltip, Button, View, Text } from '@idealyst/components';

function ActionButtons() {
  return (
    <View spacing="sm">
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Tooltip content="Save your work" placement="top" delay={500}>
          <Button icon="content-save" type="contained" intent="primary">
            Save
          </Button>
        </Tooltip>

        <Tooltip content="Undo last action" placement="top" delay={500}>
          <Button icon="undo" type="outlined">
            Undo
          </Button>
        </Tooltip>

        <Tooltip content="Delete selected items" placement="top" intent="error" delay={500}>
          <Button icon="delete" type="outlined" intent="error">
            Delete
          </Button>
        </Tooltip>
      </View>

      <Text size="sm" color="secondary">
        Hover over buttons to see tooltips
      </Text>
    </View>
  );
}`,
  },
};
