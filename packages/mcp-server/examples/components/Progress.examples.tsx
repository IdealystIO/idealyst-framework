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
      <Progress value={50} max={100} type="linear" />
      <Text typography="body2">
        50% complete
      </Text>
    </View>
  );
}

// Example 2: Basic Circular Progress
export function BasicCircularProgress() {
  return (
    <View spacing="md">
      <Progress value={75} max={100} type="circular" />
      <Text typography="body2">
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
        <Progress value={60} type="linear" size="xs" />
        <Progress value={60} type="linear" size="sm" />
        <Progress value={60} type="linear" size="md" />
        <Progress value={60} type="linear" size="lg" />
        <Progress value={60} type="linear" size="xl" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Circular Sizes</Text>
        <View spacing="sm">
          <Progress value={60} type="circular" size="xs" />
          <Progress value={60} type="circular" size="sm" />
          <Progress value={60} type="circular" size="md" />
          <Progress value={60} type="circular" size="lg" />
          <Progress value={60} type="circular" size="xl" />
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
        <Text typography="body2">Primary</Text>
        <Progress value={70} intent="primary" type="linear" />
      </View>
      <View spacing="sm">
        <Text typography="body2">Success</Text>
        <Progress value={70} intent="success" type="linear" />
      </View>
      <View spacing="sm">
        <Text typography="body2">Danger</Text>
        <Progress value={70} intent="danger" type="linear" />
      </View>
      <View spacing="sm">
        <Text typography="body2">Warning</Text>
        <Progress value={70} intent="warning" type="linear" />
      </View>
      <View spacing="sm">
        <Text typography="body2">Info</Text>
        <Progress value={70} intent="info" type="linear" />
      </View>
    </View>
  );
}

// Example 5: Progress with Labels
export function ProgressWithLabels() {
  return (
    <View spacing="md">
      <Progress value={45} showLabel type="linear" />
      <Progress value={80} showLabel label="Installing..." type="linear" intent="info" />
      <Progress value={100} showLabel label="Complete!" type="linear" intent="success" />
    </View>
  );
}

// Example 6: Indeterminate Progress
export function IndeterminateProgress() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Text weight="semibold">Linear Indeterminate</Text>
        <Progress indeterminate type="linear" intent="primary" />
      </View>
      <View spacing="sm">
        <Text weight="semibold">Circular Indeterminate</Text>
        <Progress indeterminate type="circular" intent="primary" />
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
        <Progress value={65} type="linear" rounded={false} />
      </View>
      <View spacing="sm">
        <Text>Rounded corners</Text>
        <Progress value={65} type="linear" rounded />
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
      <Progress value={progress} showLabel type="linear" intent="success" />
      <Progress value={progress} showLabel type="circular" intent="success" />
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
            type="linear"
            intent="info"
          />
        </View>
      )}
      {progress === 100 && !uploading && (
        <Text typography="body2">
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
        <Progress value={progress} showLabel type="linear" intent="primary" />
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
          <Progress value={progress} type="linear" intent="success" />
          <Text typography="body2">
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
        <Text typography="body2">
          {usedStorage} GB of {totalStorage} GB used
        </Text>
      </View>
      <Progress
        value={percentage}
        showLabel
        type="linear"
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
        <Text typography="body2">
          {batteryLevel}% remaining
        </Text>
      </View>
      <Progress
        value={batteryLevel}
        type="circular"
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
