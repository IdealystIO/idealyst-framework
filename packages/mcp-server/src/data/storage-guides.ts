export const storageGuides: Record<string, string> = {
  "idealyst://storage/overview": `# @idealyst/storage Overview

Cross-platform storage solution for React and React Native applications. Provides a consistent async API for persistent data storage.

## Features

- **Cross-Platform** - Works seamlessly on React Native and Web
- **Simple API** - Async/await based with consistent interface
- **React Native** - Uses MMKV for high-performance storage
- **Web** - Uses localStorage with proper error handling
- **TypeScript** - Full type safety and IntelliSense support
- **Secure Storage** - Optional encrypted storage via \`createSecureStorage()\` (Keychain on native, Web Crypto on web)

## Installation

\`\`\`bash
yarn add @idealyst/storage

# React Native also needs:
yarn add react-native-mmkv
cd ios && pod install
\`\`\`

## Quick Start

\`\`\`tsx
import { storage } from '@idealyst/storage';

// Store string data
await storage.setItem('token', 'abc123');

// Store objects (use JSON.stringify)
await storage.setItem('user', JSON.stringify({ name: 'John', id: 123 }));

// Retrieve string data
const token = await storage.getItem('token');

// Retrieve and parse objects
const userData = await storage.getItem('user');
const user = userData ? JSON.parse(userData) : null;

// Remove data
await storage.removeItem('token');

// Clear all data
await storage.clear();

// Get all keys
const keys = await storage.getAllKeys();
\`\`\`

## Import Options

\`\`\`tsx
// Named import (recommended)
import { storage } from '@idealyst/storage';

// Default import
import storage from '@idealyst/storage';
\`\`\`

## Platform Details

- **React Native**: Uses \`react-native-mmkv\` for high-performance storage
- **Web**: Uses browser \`localStorage\`
`,

  "idealyst://storage/api": `# Storage API Reference

Complete API reference for @idealyst/storage.

## setItem

Store a string value with the given key.

\`\`\`tsx
await storage.setItem(key: string, value: string): Promise<void>

// Examples
await storage.setItem('token', 'abc123');
await storage.setItem('userId', '42');

// For objects, use JSON.stringify
await storage.setItem('user', JSON.stringify({ name: 'John', age: 30 }));
await storage.setItem('tags', JSON.stringify(['react', 'native']));
await storage.setItem('settings', JSON.stringify({ theme: 'dark', notifications: true }));
\`\`\`

## getItem

Retrieve a string value by key. Returns \`null\` if the key doesn't exist.

\`\`\`tsx
await storage.getItem(key: string): Promise<string | null>

// Examples
const token = await storage.getItem('token');
const userId = await storage.getItem('userId');

// For objects, parse the JSON
const userData = await storage.getItem('user');
const user = userData ? JSON.parse(userData) as User : null;

const tagsData = await storage.getItem('tags');
const tags = tagsData ? JSON.parse(tagsData) as string[] : [];

if (user) {
  console.log(user.name);
}
\`\`\`

## removeItem

Remove a specific item from storage.

\`\`\`tsx
await storage.removeItem(key: string): Promise<void>

// Examples
await storage.removeItem('user');
await storage.removeItem('temporaryData');
\`\`\`

## clear

Remove all items from storage.

\`\`\`tsx
await storage.clear(): Promise<void>
\`\`\`

## getAllKeys

Returns all keys currently in storage.

\`\`\`tsx
await storage.getAllKeys(): Promise<string[]>

// Example
const keys = await storage.getAllKeys();
console.log('Stored keys:', keys); // ['user', 'settings', 'token']
\`\`\`

## Helper Pattern for Typed Storage

Create a typed wrapper for cleaner code:

\`\`\`tsx
import { storage } from '@idealyst/storage';

// Helper functions for typed storage
async function setObject<T>(key: string, value: T): Promise<void> {
  await storage.setItem(key, JSON.stringify(value));
}

async function getObject<T>(key: string): Promise<T | null> {
  const data = await storage.getItem(key);
  return data ? JSON.parse(data) as T : null;
}

// Usage
interface User {
  id: number;
  name: string;
}

await setObject<User>('user', { id: 1, name: 'John' });
const user = await getObject<User>('user');
\`\`\`
`,

  "idealyst://storage/examples": `# Storage Examples

Complete code examples for common @idealyst/storage patterns.

## User Session Management

\`\`\`tsx
import { storage } from '@idealyst/storage';

interface User {
  id: number;
  name: string;
  email: string;
}

class AuthService {
  static async saveUserSession(user: User, token: string) {
    await Promise.all([
      storage.setItem('currentUser', JSON.stringify(user)),
      storage.setItem('authToken', token),
      storage.setItem('loginTime', new Date().toISOString()),
    ]);
  }

  static async getUserSession() {
    const userData = await storage.getItem('currentUser');
    const token = await storage.getItem('authToken');

    const user = userData ? JSON.parse(userData) as User : null;
    return user && token ? { user, token } : null;
  }

  static async clearSession() {
    await Promise.all([
      storage.removeItem('currentUser'),
      storage.removeItem('authToken'),
      storage.removeItem('loginTime'),
    ]);
  }
}
\`\`\`

## Settings Management

\`\`\`tsx
import { storage } from '@idealyst/storage';

interface AppSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  notifications: true,
  language: 'en',
  fontSize: 16,
};

class SettingsService {
  static async getSettings(): Promise<AppSettings> {
    const data = await storage.getItem('appSettings');
    const stored = data ? JSON.parse(data) as AppSettings : null;
    return stored ? { ...defaultSettings, ...stored } : defaultSettings;
  }

  static async updateSettings(newSettings: Partial<AppSettings>) {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };
    await storage.setItem('appSettings', JSON.stringify(updated));
    return updated;
  }

  static async resetSettings() {
    await storage.setItem('appSettings', JSON.stringify(defaultSettings));
    return defaultSettings;
  }
}
\`\`\`

## Cache with Expiration

\`\`\`tsx
import { storage } from '@idealyst/storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

class CacheService {
  static async setCache<T>(key: string, data: T, expiresIn: number = 3600000) {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };

    await storage.setItem(\`cache_\${key}\`, JSON.stringify(cacheItem));
  }

  static async getCache<T>(key: string): Promise<T | null> {
    const data = await storage.getItem(\`cache_\${key}\`);
    if (!data) return null;

    const cacheItem = JSON.parse(data) as CacheItem<T>;
    const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiresIn;

    if (isExpired) {
      await storage.removeItem(\`cache_\${key}\`);
      return null;
    }

    return cacheItem.data;
  }

  static async clearExpiredCache() {
    const keys = await storage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith('cache_'));

    for (const key of cacheKeys) {
      const data = await storage.getItem(key);
      if (data) {
        const cacheItem = JSON.parse(data) as CacheItem<unknown>;
        const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiresIn;
        if (isExpired) {
          await storage.removeItem(key);
        }
      }
    }
  }
}
\`\`\`

## Persisting Language Preference

\`\`\`tsx
import { storage } from '@idealyst/storage';
import { useLanguage } from '@idealyst/translate';
import { useEffect } from 'react';

const LANGUAGE_KEY = 'app_language';

export function usePersistedLanguage() {
  const { language, setLanguage } = useLanguage();

  // Load saved language on mount
  useEffect(() => {
    storage.getItem(LANGUAGE_KEY).then((saved) => {
      if (saved) setLanguage(saved);
    });
  }, []);

  // Save language when changed
  useEffect(() => {
    storage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  return { language, setLanguage };
}
\`\`\`

## React Hook for Storage

\`\`\`tsx
import { storage } from '@idealyst/storage';
import { useState, useEffect, useCallback } from 'react';

export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  // Load value on mount
  useEffect(() => {
    storage.getItem(key).then((stored) => {
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
      setLoading(false);
    });
  }, [key]);

  // Update storage when value changes
  const updateValue = useCallback(async (newValue: T) => {
    setValue(newValue);
    await storage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  // Remove from storage
  const removeValue = useCallback(async () => {
    setValue(initialValue);
    await storage.removeItem(key);
  }, [key, initialValue]);

  return { value, setValue: updateValue, removeValue, loading };
}

// Usage
function MyComponent() {
  const { value: theme, setValue: setTheme, loading } = useStorage('theme', 'light');

  if (loading) return <ActivityIndicator />;

  return (
    <Button onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </Button>
  );
}
\`\`\`

## Error Handling

\`\`\`tsx
import { storage } from '@idealyst/storage';

async function safeStorageOperation() {
  try {
    await storage.setItem('data', JSON.stringify(largeObject));
  } catch (error) {
    console.error('Storage failed:', error);
    // Handle storage quota exceeded or other errors
  }

  // Or with null checking
  const result = await storage.getItem('data');
  if (result === null) {
    // Key doesn't exist or retrieval failed
    console.log('No data found');
  }
}
\`\`\`

## Best Practices

1. **Use JSON.stringify/parse** - Storage only accepts strings, so serialize objects
2. **Handle Nulls** - Always check for null returns from \`getItem\`
3. **Batch Operations** - Use \`Promise.all\` for multiple storage operations
4. **Error Handling** - Wrap storage operations in try-catch blocks for critical data
5. **Key Naming** - Use consistent, descriptive key names
6. **Data Size** - Keep stored objects reasonably sized
7. **Cleanup** - Periodically clean up unused data
8. **Type Safety** - Create typed wrapper functions for better TypeScript support
9. **Use Secure Storage for Secrets** - Use \`createSecureStorage()\` for auth tokens, API keys, and sensitive data
`,

  "idealyst://storage/secure": `# Secure Storage

Encrypted storage for sensitive data like auth tokens, API keys, and secrets. Uses the same \`IStorage\` interface as regular storage — drop-in replacement.

## Installation

\`\`\`bash
yarn add @idealyst/storage

# React Native also needs (for secure storage):
yarn add react-native-keychain react-native-mmkv
cd ios && pod install
\`\`\`

## Quick Start

\`\`\`tsx
import { createSecureStorage } from '@idealyst/storage';

// Create a secure storage instance
const secureStorage = createSecureStorage();

// Same API as regular storage
await secureStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIs...');
const token = await secureStorage.getItem('authToken');
await secureStorage.removeItem('authToken');
await secureStorage.clear();
const keys = await secureStorage.getAllKeys();

// Listeners work too
const unsubscribe = secureStorage.addListener((key, value) => {
  console.log('Secure storage changed:', key);
});
\`\`\`

## Options

\`\`\`tsx
import { createSecureStorage, SecureStorageOptions } from '@idealyst/storage';

const secureStorage = createSecureStorage({
  prefix: 'myapp', // Namespace for keys (default: 'secure')
});
\`\`\`

The \`prefix\` option controls:
- **Native**: Keychain service name and MMKV instance ID
- **Web**: localStorage key prefix and IndexedDB key name

Use different prefixes to create isolated secure storage instances.

## How It Works

### React Native
1. A random 16-byte encryption key is generated on first use
2. The key is stored in the **iOS Keychain** / **Android Keystore** (hardware-backed)
3. An encrypted MMKV instance is created using that key
4. All data is encrypted at rest by MMKV's native AES encryption
5. Keychain accessibility is set to \`WHEN_UNLOCKED_THIS_DEVICE_ONLY\` (not backed up, only accessible when device is unlocked)

### Web
1. A non-extractable AES-256-GCM \`CryptoKey\` is generated on first use
2. The key is stored in **IndexedDB** (non-extractable — cannot be read as raw bytes)
3. Each value is encrypted with a unique random IV before storing in localStorage
4. Requires a **secure context** (HTTPS) for \`crypto.subtle\` access

## Usage Example: Secure Auth Service

\`\`\`tsx
import { createSecureStorage } from '@idealyst/storage';

const secureStorage = createSecureStorage({ prefix: 'auth' });

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class SecureAuthService {
  static async saveTokens(tokens: AuthTokens) {
    await secureStorage.setItem('tokens', JSON.stringify(tokens));
  }

  static async getTokens(): Promise<AuthTokens | null> {
    const data = await secureStorage.getItem('tokens');
    return data ? JSON.parse(data) as AuthTokens : null;
  }

  static async clearTokens() {
    await secureStorage.removeItem('tokens');
  }

  static async saveApiKey(key: string) {
    await secureStorage.setItem('apiKey', key);
  }

  static async getApiKey(): Promise<string | null> {
    return secureStorage.getItem('apiKey');
  }
}
\`\`\`

## When to Use Secure vs Regular Storage

| Data Type | Use |
|-----------|-----|
| Auth tokens, refresh tokens | \`createSecureStorage()\` |
| API keys, client secrets | \`createSecureStorage()\` |
| User preferences, theme | \`storage\` (regular) |
| Cache data | \`storage\` (regular) |
| Session IDs | \`createSecureStorage()\` |
| Language preference | \`storage\` (regular) |

## Platform Requirements

- **React Native**: Requires \`react-native-keychain\` (>=9.0.0) and \`react-native-mmkv\` (>=4.0.0)
- **Web**: Requires secure context (HTTPS) and IndexedDB support
- **Web limitation**: IndexedDB may not be available in some private browsing modes
`,
};
