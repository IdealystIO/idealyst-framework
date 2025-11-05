export const Progress = {
  category: "feedback",
  description: "Progress indicator showing completion status of tasks or operations",
      props: `
- \`value\`: number - The current progress value (0 to max)
- \`max\`: number - The maximum value representing 100% completion
- \`variant\`: ProgressVariant - The visual variant (linear or circular)
- \`intent\`: ProgressIntentVariant - The intent/color scheme of the progress bar
- \`size\`: ProgressSizeVariant - The size variant of the progress indicator
- \`indeterminate\`: boolean - Whether to show indeterminate/loading animation
- \`showLabel\`: boolean - Whether to display the percentage label
- \`label\`: string - Custom label text (overrides percentage)
- \`rounded\`: boolean - Whether to use rounded ends for linear progress
`,
  features: [
    "Linear and circular variants",
    "Determinate and indeterminate modes",
    "Five intent colors",
    "Three sizes",
    "Percentage label support",
    "Custom label text",
    "Rounded ends option",
  ],
  bestPractices: [
    "Use determinate progress when percentage is known",
    "Use indeterminate progress for unknown duration",
    "Show label for user feedback",
    "Use circular variant for compact spaces",
    "Match intent to operation context",
  ],
  usage: `
import { Progress } from '@idealyst/components';

<Progress
  value={65}
  type="linear"
  intent="primary"
  showLabel
/>
`,
  examples: {
    basic: `import { Progress } from '@idealyst/components';

<Progress value={50} />`,

    variants: `import { Progress, View } from '@idealyst/components';

<View spacing="md">
  <Progress value={30} type="linear" intent="primary" />
  <Progress value={60} type="linear" intent="success" />
  <Progress value={value} type="circular" size="lg" showLabel />
</View>`,

    "with-icons": `import { Progress, View, Text } from '@idealyst/components';

<View spacing="sm">
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text>Uploading...</Text>
    <Text>{progress}%</Text>
  </View>
  <Progress value={progress} intent="primary" />
</View>`,

    interactive: `import { Progress, Button, View, Text } from '@idealyst/components';
import { useState, useEffect } from 'react';

function Example() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (running && progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 10), 500);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      setRunning(false);
    }
  }, [progress, running]);

  const handleStart = () => {
    setProgress(0);
    setRunning(true);
  };

  return (
    <View spacing="md">
      <Progress value={progress} intent="success" showLabel />
      <Button onPress={handleStart} disabled={running}>
        Start
      </Button>
    </View>
  );
}`,
  },
};
