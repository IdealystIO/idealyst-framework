import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function StoragePage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Storage
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Cross-platform storage abstraction that provides a unified API for persisting data.
          Uses localStorage on web and MMKV on React Native for optimal performance.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          code={`import Storage from '@idealyst/storage';`}
          language="typescript"
          title="Import"
        />

        <Text typography="body2" color="secondary" style={{ marginBottom: 24, marginTop: 16, lineHeight: 24 }}>
          The package automatically uses the correct implementation based on the platform:
          localStorage for web and react-native-mmkv for native apps.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Basic Usage
        </Text>

        <CodeBlock
          code={`import Storage from '@idealyst/storage';

// Store a value
await Storage.setItem('user', JSON.stringify({ name: 'John' }));

// Retrieve a value
const user = await Storage.getItem('user');
if (user) {
  console.log(JSON.parse(user)); // { name: 'John' }
}

// Remove a value
await Storage.removeItem('user');

// Clear all storage
await Storage.clear();`}
          language="typescript"
          title="Basic Operations"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          API Reference
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <MethodCard
            name="getItem(key)"
            signature="getItem(key: string): Promise<string | null>"
            description="Retrieves the value associated with the given key. Returns null if the key doesn't exist."
          />
          <MethodCard
            name="setItem(key, value)"
            signature="setItem(key: string, value: string): Promise<void>"
            description="Stores a string value with the given key. Notifies all listeners of the change."
          />
          <MethodCard
            name="removeItem(key)"
            signature="removeItem(key: string): Promise<void>"
            description="Removes the value associated with the given key."
          />
          <MethodCard
            name="clear()"
            signature="clear(): Promise<void>"
            description="Removes all stored key-value pairs."
          />
          <MethodCard
            name="getAllKeys()"
            signature="getAllKeys(): Promise<string[]>"
            description="Returns an array of all keys currently stored."
          />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Batch Operations
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          For better performance when working with multiple items, use the batch methods:
        </Text>

        <CodeBlock
          code={`// Get multiple items at once
const results = await Storage.multiGet(['key1', 'key2', 'key3']);
// Returns: [['key1', 'value1'], ['key2', 'value2'], ['key3', null]]

// Set multiple items at once
await Storage.multiSet([
  ['key1', 'value1'],
  ['key2', 'value2'],
  ['key3', 'value3'],
]);

// Remove multiple items at once
await Storage.multiRemove(['key1', 'key2', 'key3']);`}
          language="typescript"
          title="Batch Operations"
        />

        <View style={{ gap: 16, marginTop: 24, marginBottom: 32 }}>
          <MethodCard
            name="multiGet(keys)"
            signature="multiGet(keys: string[]): Promise<Array<[string, string | null]>>"
            description="Retrieves multiple values at once. Returns an array of [key, value] tuples."
          />
          <MethodCard
            name="multiSet(pairs)"
            signature="multiSet(keyValuePairs: Array<[string, string]>): Promise<void>"
            description="Stores multiple key-value pairs at once."
          />
          <MethodCard
            name="multiRemove(keys)"
            signature="multiRemove(keys: string[]): Promise<void>"
            description="Removes multiple keys at once."
          />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Change Listeners
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Subscribe to storage changes to keep your UI in sync:
        </Text>

        <CodeBlock
          code={`import Storage from '@idealyst/storage';

// Add a listener
const unsubscribe = Storage.addListener((key, value) => {
  if (key === null) {
    console.log('Storage was cleared');
  } else if (value === null) {
    console.log(\`Key "\${key}" was removed\`);
  } else {
    console.log(\`Key "\${key}" was set to "\${value}"\`);
  }
});

// Later, remove the listener
unsubscribe();`}
          language="typescript"
          title="Storage Listeners"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Platform Differences
        </Text>

        <View style={{ gap: 16 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              Web (localStorage)
            </Text>
            <Text typography="body2" color="tertiary">
              Uses the browser's localStorage API. Data persists across browser sessions.
              Storage limit is typically 5-10MB depending on the browser.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>
              React Native (MMKV)
            </Text>
            <Text typography="body2" color="tertiary">
              Uses react-native-mmkv for high-performance storage. MMKV is significantly
              faster than AsyncStorage and supports synchronous operations internally.
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Working with Objects
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Storage only accepts strings. Use JSON.stringify and JSON.parse for objects:
        </Text>

        <CodeBlock
          code={`// Helper functions for typed storage
async function setObject<T>(key: string, value: T): Promise<void> {
  await Storage.setItem(key, JSON.stringify(value));
}

async function getObject<T>(key: string): Promise<T | null> {
  const value = await Storage.getItem(key);
  return value ? JSON.parse(value) : null;
}

// Usage
interface User {
  id: string;
  name: string;
  email: string;
}

await setObject<User>('currentUser', {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
});

const user = await getObject<User>('currentUser');`}
          language="typescript"
          title="Typed Object Storage"
        />
      </View>
    </Screen>
  );
}

function MethodCard({
  name,
  signature,
  description,
}: {
  name: string;
  signature: string;
  description: string;
}) {
  return (
    <Card variant="outlined" style={{ padding: 16 }}>
      <Text weight="semibold" style={{ marginBottom: 4 }}>
        {name}
      </Text>
      <Text
        typography="caption"
        style={{ fontFamily: 'monospace', marginBottom: 8, color: '#6366f1' }}
      >
        {signature}
      </Text>
      <Text typography="body2" color="tertiary">
        {description}
      </Text>
    </Card>
  );
}
