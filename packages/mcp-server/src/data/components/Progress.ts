export const Progress = {
  category: "feedback",
  description: "Progress indicator showing completion status of tasks or operations",
  props: `
- \`value\`: number - Current progress value (0-max)
- \`max\`: number - Maximum value (default: 100)
- \`variant\`: 'linear' | 'circular' - Progress bar style
- \`intent\`: 'primary' | 'neutral' | 'success' | 'error' | 'warning' - Color scheme
- \`size\`: 'sm' | 'md' | 'lg' - Size of progress indicator
- \`indeterminate\`: boolean - Show indeterminate/loading state
- \`showLabel\`: boolean - Show percentage label
- \`label\`: string - Custom label text
- \`rounded\`: boolean - Rounded ends (linear variant)
- \`style\`: ViewStyle - Additional custom styles
- \`testID\`: string - Test identifier
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
  variant="linear"
  intent="primary"
  showLabel
/>
`,
  examples: {
    basic: `import { Progress } from '@idealyst/components';

<Progress value={50} />`,

    variants: `import { Progress, View } from '@idealyst/components';

<View spacing="md">
  <Progress value={30} variant="linear" intent="primary" />
  <Progress value={60} variant="linear" intent="success" />
  <Progress value={value} variant="circular" size="lg" showLabel />
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
