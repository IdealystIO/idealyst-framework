/**
 * Progress Component Examples
 *
 * These examples are type-checked against the actual ProgressProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Progress, View, Text, Button } from '@idealyst/components';

// Example 1: Basic Linear Progress
export function BasicLinearProgress() {
  return (
    <View spacing="md">
      <Progress value={50} max={100} variant="linear" />
      <Text size="sm" color="gray.600">
        50% complete
      </Text>
    </View>
  );
}

// Example 2: Basic Circular Progress
export function BasicCircularProgress() {
  return (
    <View spacing="md">
      <Progress value={75} max={100} variant="circular" />
      <Text size="sm" color="gray.600">
        75% complete
      </Text>
    </View>
  );
}

// Example 3: Progress Sizes
export function ProgressSizes() {
  return (
    <View spacing="lg">
      <View spacing="sm">
        <Text weight="semibold">Linear Sizes</Text>
        <Progress value={60} variant="linear" size="xs" />
        <Progress value={60} variant="linear" size="sm" />
        <Progress value={60} variant="linear" size="md" />
        <Progress value={60} variant="linear" size="lg" />
        <Progress value={60} variant="linear" size="xl" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Circular Sizes</Text>
        <View spacing="sm">
          <Progress value={60} variant="circular" size="xs" />
          <Progress value={60} variant="circular" size="sm" />
          <Progress value={60} variant="circular" size="md" />
          <Progress value={60} variant="circular" size="lg" />
          <Progress value={60} variant="circular" size="xl" />
        </View>
      </View>
    </View>
  );
}

// Example 4: Progress with Intent Colors
export function ProgressWithIntent() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Text size="sm">Primary</Text>
        <Progress value={70} intent="primary" variant="linear" />
      </View>
      <View spacing="sm">
        <Text size="sm">Success</Text>
        <Progress value={70} intent="success" variant="linear" />
      </View>
      <View spacing="sm">
        <Text size="sm">Error</Text>
        <Progress value={70} intent="error" variant="linear" />
      </View>
      <View spacing="sm">
        <Text size="sm">Warning</Text>
        <Progress value={70} intent="warning" variant="linear" />
      </View>
      <View spacing="sm">
        <Text size="sm">Info</Text>
        <Progress value={70} intent="info" variant="linear" />
      </View>
    </View>
  );
}

// Example 5: Progress with Labels
export function ProgressWithLabels() {
  return (
    <View spacing="md">
      <Progress value={45} showLabel variant="linear" />
      <Progress value={80} showLabel label="Installing..." variant="linear" intent="info" />
      <Progress value={100} showLabel label="Complete!" variant="linear" intent="success" />
    </View>
  );
}

// Example 6: Indeterminate Progress
export function IndeterminateProgress() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Text weight="semibold">Linear Indeterminate</Text>
        <Progress indeterminate variant="linear" intent="primary" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Circular Indeterminate</Text>
        <Progress indeterminate variant="circular" intent="primary" />
      </View>
    </View>
  );
}

// Example 7: Rounded Progress
export function RoundedProgress() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Text>Standard corners</Text>
        <Progress value={65} variant="linear" rounded={false} />
      </View>
      <View spacing="sm">
        <Text>Rounded corners</Text>
        <Progress value={65} variant="linear" rounded />
      </View>
    </View>
  );
}

// Example 8: Animated Progress
export function AnimatedProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <View spacing="md">
      <Progress value={progress} showLabel variant="linear" intent="success" />
      <Progress value={progress} showLabel variant="circular" intent="success" />
    </View>
  );
}

// Example 9: File Upload Progress
export function FileUploadProgress() {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const startUpload = () => {
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <View spacing="lg">
      <Button onPress={startUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>
      {uploading && (
        <View spacing="md">
          <Progress
            value={progress}
            showLabel
            label="Uploading file..."
            variant="linear"
            intent="info"
          />
        </View>
      )}
      {progress === 100 && !uploading && (
        <Text size="sm" color="green.600">
          Upload complete!
        </Text>
      )}
    </View>
  );
}

// Example 10: Multi-step Progress
export function MultiStepProgress() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View spacing="lg">
      <View spacing="md">
        <Text weight="semibold">
          Step {currentStep} of {totalSteps}
        </Text>
        <Progress value={progress} showLabel variant="linear" intent="primary" />
      </View>
      <View spacing="sm">
        <Button
          onPress={() => setCurrentStep((prev) => Math.min(prev + 1, totalSteps))}
          disabled={currentStep === totalSteps}
        >
          Next Step
        </Button>
        <Button
          type="outlined"
          onPress={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          disabled={currentStep === 1}
        >
          Previous Step
        </Button>
        <Button type="outlined" onPress={() => setCurrentStep(1)}>
          Reset
        </Button>
      </View>
    </View>
  );
}

// Example 11: Download Progress
export function DownloadProgress() {
  const [downloading, setDownloading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const startDownload = () => {
    setDownloading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <View spacing="lg">
      <Button onPress={startDownload} disabled={downloading} intent="success">
        {downloading ? 'Downloading...' : 'Download'}
      </Button>
      {downloading && (
        <View spacing="md">
          <Progress value={progress} variant="linear" intent="success" />
          <Text size="sm" color="gray.600">
            {progress}% downloaded
          </Text>
        </View>
      )}
    </View>
  );
}

// Example 12: Storage Usage Progress
export function StorageUsageProgress() {
  const usedStorage = 45; // GB
  const totalStorage = 100; // GB
  const percentage = (usedStorage / totalStorage) * 100;

  const getIntent = () => {
    if (percentage < 50) return 'success';
    if (percentage < 80) return 'warning';
    return 'error';
  };

  return (
    <View spacing="md">
      <View spacing="xs">
        <Text weight="semibold">Storage Usage</Text>
        <Text size="sm" color="gray.600">
          {usedStorage} GB of {totalStorage} GB used
        </Text>
      </View>
      <Progress
        value={percentage}
        showLabel
        variant="linear"
        intent={getIntent()}
        rounded
      />
    </View>
  );
}

// Example 13: Battery Level Progress
export function BatteryLevelProgress() {
  const [batteryLevel, setBatteryLevel] = React.useState(75);

  const getIntent = () => {
    if (batteryLevel > 50) return 'success';
    if (batteryLevel > 20) return 'warning';
    return 'error';
  };

  return (
    <View spacing="md">
      <View spacing="xs">
        <Text weight="semibold">Battery Level</Text>
        <Text size="sm" color="gray.600">
          {batteryLevel}% remaining
        </Text>
      </View>
      <Progress
        value={batteryLevel}
        variant="circular"
        showLabel
        intent={getIntent()}
      />
      <View spacing="sm">
        <Button size="sm" onPress={() => setBatteryLevel(Math.min(100, batteryLevel + 10))}>
          Charge +10%
        </Button>
        <Button size="sm" onPress={() => setBatteryLevel(Math.max(0, batteryLevel - 10))}>
          Drain -10%
        </Button>
      </View>
    </View>
  );
}
