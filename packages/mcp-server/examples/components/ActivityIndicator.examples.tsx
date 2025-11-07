/**
 * ActivityIndicator Component Examples
 *
 * These examples are type-checked against the actual ActivityIndicatorProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { ActivityIndicator, View, Text, Button } from '@idealyst/components';

// Example 1: Basic ActivityIndicator
export function BasicActivityIndicator() {
  return (
    <View spacing="md">
      <ActivityIndicator />
      <Text size="sm" >
        Loading...
      </Text>
    </View>
  );
}

// Example 2: ActivityIndicator Sizes
export function ActivityIndicatorSizes() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <ActivityIndicator size="xs" />
        <Text size="sm">Extra Small</Text>
      </View>
      <View spacing="sm">
        <ActivityIndicator size="sm" />
        <Text size="sm">Small</Text>
      </View>
      <View spacing="sm">
        <ActivityIndicator size="md" />
        <Text size="sm">Medium</Text>
      </View>
      <View spacing="sm">
        <ActivityIndicator size="lg" />
        <Text size="sm">Large</Text>
      </View>
      <View spacing="sm">
        <ActivityIndicator size="xl" />
        <Text size="sm">Extra Large</Text>
      </View>
    </View>
  );
}

// Example 3: ActivityIndicator with Intent Colors
export function ActivityIndicatorWithIntent() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <ActivityIndicator intent="primary" />
        <Text size="sm">Primary</Text>
      </View>
      <View spacing="sm">
        <ActivityIndicator intent="success" />
        <Text size="sm">Success</Text>
      </View>
      <View spacing="sm">
        <ActivityIndicator intent="error" />
        <Text size="sm">Error</Text>
      </View>
      <View spacing="sm">
        <ActivityIndicator intent="warning" />
        <Text size="sm">Warning</Text>
      </View>
      <View spacing="sm">
        <ActivityIndicator intent="info" />
        <Text size="sm">Info</Text>
      </View>
      <View spacing="sm">
        <ActivityIndicator intent="neutral" />
        <Text size="sm">Neutral</Text>
      </View>
    </View>
  );
}

// Example 4: ActivityIndicator with Custom Color
export function ActivityIndicatorWithCustomColor() {
  return (
    <View spacing="md">
      <ActivityIndicator color="blue" size="lg" />
      <ActivityIndicator color="green" size="lg" />
      <ActivityIndicator color="red" size="lg" />
      <ActivityIndicator color="purple" size="lg" />
    </View>
  );
}

// Example 5: Animating Control
export function ActivityIndicatorAnimating() {
  const [animating, setAnimating] = React.useState(true);

  return (
    <View spacing="md">
      <ActivityIndicator animating={animating} size="lg" />
      <Button onPress={() => setAnimating(!animating)}>
        {animating ? 'Stop' : 'Start'} Animation
      </Button>
    </View>
  );
}

// Example 6: ActivityIndicator with Text
export function ActivityIndicatorWithText() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <ActivityIndicator size="md" intent="primary" />
        <Text>Loading data...</Text>
      </View>
    </View>
  );
}

// Example 7: Loading Button State
export function LoadingButtonState() {
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <View spacing="md">
      <Button onPress={handleClick} disabled={loading}>
        {loading ? (
          <View spacing="sm">
            <ActivityIndicator size="sm"  />
            <Text >Loading...</Text>
          </View>
        ) : (
          'Submit'
        )}
      </Button>
    </View>
  );
}

// Example 8: Loading Card
export function LoadingCard() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View background="primary" spacing="lg" radius="lg">
      {loading ? (
        <View spacing="md">
          <ActivityIndicator size="lg" />
          <Text align="center">Loading content...</Text>
        </View>
      ) : (
        <View spacing="md">
          <Text size="lg" weight="bold">
            Content Loaded
          </Text>
          <Text>Here is the content that was loaded.</Text>
        </View>
      )}
    </View>
  );
}

// Example 9: Full Screen Loading
export function FullScreenLoading() {
  const [loading, setLoading] = React.useState(false);

  return (
    <View spacing="md">
      <Button onPress={() => setLoading(true)}>Show Loading Screen</Button>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View spacing="md" background="primary" radius="lg">
            <ActivityIndicator size="xl" intent="primary" />
            <Text weight="semibold">Loading...</Text>
            <Button size="sm" onPress={() => setLoading(false)}>
              Cancel
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

// Example 10: Inline Loading States
export function InlineLoadingStates() {
  return (
    <View spacing="lg">
      <View spacing="sm">
        <View spacing="xs">
          <ActivityIndicator size="xs" />
          <Text size="sm">Saving changes...</Text>
        </View>
      </View>
      <View spacing="sm">
        <View spacing="xs">
          <ActivityIndicator size="xs" intent="success" />
          <Text size="sm">Syncing data...</Text>
        </View>
      </View>
      <View spacing="sm">
        <View spacing="xs">
          <ActivityIndicator size="xs" intent="info" />
          <Text size="sm">Processing request...</Text>
        </View>
      </View>
    </View>
  );
}

// Example 11: Fetching Data Example
export function FetchingDataExample() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<string[]>([]);

  const fetchData = () => {
    setLoading(true);
    setData([]);

    setTimeout(() => {
      setData(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']);
      setLoading(false);
    }, 2000);
  };

  return (
    <View spacing="lg">
      <Button onPress={fetchData} disabled={loading}>
        Fetch Data
      </Button>
      {loading ? (
        <View spacing="md">
          <ActivityIndicator size="lg" intent="primary" />
          <Text align="center">Fetching data...</Text>
        </View>
      ) : data.length > 0 ? (
        <View spacing="sm">
          {data.map((item, index) => (
            <View key={index} background="primary" spacing="md" radius="md">
              <Text>{item}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text size="sm"  align="center">
          Click the button to fetch data
        </Text>
      )}
    </View>
  );
}

// Example 12: Uploading Files Example
export function UploadingFilesExample() {
  const [uploading, setUploading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleUpload = () => {
    setUploading(true);
    setSuccess(false);

    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 3000);
  };

  return (
    <View spacing="md">
      <Button onPress={handleUpload} disabled={uploading} intent="primary">
        Upload Files
      </Button>
      {uploading && (
        <View spacing="sm">
          <ActivityIndicator size="md" intent="primary" />
          <Text size="sm" >
            Uploading files...
          </Text>
        </View>
      )}
      {success && !uploading && (
        <Text size="sm" >
          Files uploaded successfully!
        </Text>
      )}
    </View>
  );
}

// Example 13: Refresh Control
export function RefreshControl() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View spacing="md">
      <View spacing="sm">
        <Text weight="semibold">Content Area</Text>
        <Text size="sm" >
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Text>
      </View>
      {refreshing && (
        <View spacing="sm">
          <ActivityIndicator size="sm" intent="primary" />
          <Text size="sm">Refreshing...</Text>
        </View>
      )}
      <Button size="sm" onPress={handleRefresh} disabled={refreshing}>
        Refresh
      </Button>
    </View>
  );
}
