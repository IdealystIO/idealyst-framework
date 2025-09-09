# @idealyst/storage

A universal, cross-platform storage solution for React and React Native applications. Provides a consistent API for persistent data storage with fallbacks from secure storage to async storage to local storage.

[![npm version](https://badge.fury.io/js/@idealyst%2Fstorage.svg)](https://badge.fury.io/js/@idealyst%2Fstorage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🌐 **Cross-Platform**: Works seamlessly on React Native and Web
- 🔒 **Security First**: Automatic fallback from secure storage to less secure options
- 🚀 **Simple API**: Async/await based with consistent interface
- 📱 **React Native**: Uses MMKV for high-performance storage
- 🌍 **Web**: Uses localStorage with proper error handling
- 🔧 **TypeScript**: Full type safety and IntelliSense support
- 💾 **Automatic Fallbacks**: Graceful degradation when storage methods fail

## Installation

```bash
# Using yarn (recommended)
yarn add @idealyst/storage

# Using npm
npm install @idealyst/storage
```

### Platform Dependencies

**React Native:**
```bash
# High-performance storage (recommended)
yarn add react-native-mmkv

# Follow installation instructions for react-native-mmkv
cd ios && pod install
```

**Web:**
No additional dependencies required - uses native localStorage.

## Quick Start

```tsx
import { storage } from '@idealyst/storage';

// Store data
await storage.setItem('user', { name: 'John', id: 123 });
await storage.setItem('token', 'abc123');
await storage.setItem('settings', { theme: 'dark', notifications: true });

// Retrieve data
const user = await storage.getItem('user');
const token = await storage.getItem('token');
const settings = await storage.getItem('settings');

// Remove data
await storage.removeItem('token');

// Clear all data
await storage.clear();
```

## API Reference

### `setItem(key: string, value: any): Promise<void>`

Stores a value with the given key. Values are automatically serialized.

```tsx
await storage.setItem('user', { name: 'John', age: 30 });
await storage.setItem('count', 42);
await storage.setItem('isEnabled', true);
await storage.setItem('tags', ['react', 'native']);
```

### `getItem<T>(key: string): Promise<T | null>`

Retrieves a value by key. Returns `null` if the key doesn't exist.

```tsx
const user = await storage.getItem<User>('user');
const count = await storage.getItem<number>('count');
const isEnabled = await storage.getItem<boolean>('isEnabled');
const tags = await storage.getItem<string[]>('tags');

if (user) {
  console.log(user.name); // TypeScript knows this is a User object
}
```

### `removeItem(key: string): Promise<void>`

Removes a specific item from storage.

```tsx
await storage.removeItem('user');
await storage.removeItem('temporaryData');
```

### `clear(): Promise<void>`

Removes all items from storage.

```tsx
await storage.clear();
```

### `getAllKeys(): Promise<string[]>`

Returns all keys currently in storage.

```tsx
const keys = await storage.getAllKeys();
console.log('Stored keys:', keys); // ['user', 'settings', 'token']
```

## Usage Examples

### User Session Management

```tsx
import { storage } from '@idealyst/storage';

interface User {
  id: number;
  name: string;
  email: string;
}

class AuthService {
  static async saveUserSession(user: User, token: string) {
    await Promise.all([
      storage.setItem('currentUser', user),
      storage.setItem('authToken', token),
      storage.setItem('loginTime', new Date().toISOString()),
    ]);
  }

  static async getUserSession() {
    const user = await storage.getItem<User>('currentUser');
    const token = await storage.getItem<string>('authToken');
    
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
```

### Settings Management

```tsx
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
    const stored = await storage.getItem<AppSettings>('appSettings');
    return stored ? { ...defaultSettings, ...stored } : defaultSettings;
  }

  static async updateSettings(newSettings: Partial<AppSettings>) {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };
    await storage.setItem('appSettings', updated);
    return updated;
  }

  static async resetSettings() {
    await storage.setItem('appSettings', defaultSettings);
    return defaultSettings;
  }
}
```

### Cache Management

```tsx
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
    
    await storage.setItem(`cache_${key}`, cacheItem);
  }

  static async getCache<T>(key: string): Promise<T | null> {
    const cacheItem = await storage.getItem<CacheItem<T>>(`cache_${key}`);
    
    if (!cacheItem) return null;
    
    const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiresIn;
    
    if (isExpired) {
      await storage.removeItem(`cache_${key}`);
      return null;
    }
    
    return cacheItem.data;
  }

  static async clearExpiredCache() {
    const keys = await storage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith('cache_'));
    
    for (const key of cacheKeys) {
      const cacheItem = await storage.getItem<CacheItem<any>>(key);
      if (cacheItem) {
        const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiresIn;
        if (isExpired) {
          await storage.removeItem(key);
        }
      }
    }
  }
}
```

## Platform Implementation Details

### React Native
- **Primary**: Uses `react-native-mmkv` for high-performance storage
- **Fallback**: Falls back to `AsyncStorage` if MMKV is unavailable
- **Security**: Data is stored securely on device
- **Performance**: MMKV provides near-instant read/write operations

### Web
- **Primary**: Uses browser `localStorage`
- **Fallback**: Graceful handling when localStorage is unavailable (private browsing)
- **Security**: Data persists across browser sessions
- **Limitations**: ~5-10MB storage limit per domain

## Error Handling

The storage system handles errors gracefully:

```tsx
try {
  await storage.setItem('data', largeObject);
} catch (error) {
  console.error('Storage failed:', error);
  // Handle storage quota exceeded or other errors
}

// Or with error checking
const result = await storage.getItem('data');
if (result === null) {
  // Key doesn't exist or retrieval failed
  console.log('No data found or error occurred');
}
```

## TypeScript Support

Full type safety with generics:

```tsx
// Define your data types
interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
}

// Type-safe storage operations
await storage.setItem('preferences', { theme: 'dark', language: 'en' });
const prefs = await storage.getItem<UserPreferences>('preferences');

if (prefs) {
  // TypeScript knows the exact type
  console.log(prefs.theme); // ✅ Type: 'light' | 'dark'
  console.log(prefs.language); // ✅ Type: string
}
```

## Best Practices

1. **Use TypeScript**: Always specify types for better development experience
2. **Handle Nulls**: Always check for null returns from `getItem`
3. **Batch Operations**: Use `Promise.all` for multiple storage operations
4. **Error Handling**: Wrap storage operations in try-catch blocks for critical data
5. **Key Naming**: Use consistent, descriptive key names
6. **Data Size**: Keep stored objects reasonably sized
7. **Cleanup**: Periodically clean up unused data

## Performance Considerations

- **React Native**: MMKV provides excellent performance for frequent read/write operations
- **Web**: localStorage is synchronous but wrapped in async API for consistency
- **Large Data**: Consider chunking very large objects across multiple keys
- **Frequent Updates**: Storage operations are optimized but avoid excessive writes

## Migration Guide

If migrating from AsyncStorage or localStorage:

```tsx
// Old AsyncStorage code
import AsyncStorage from '@react-native-async-storage/async-storage';
const value = await AsyncStorage.getItem('key');

// New @idealyst/storage code
import { storage } from '@idealyst/storage';
const value = await storage.getItem('key');
```

The API is nearly identical with these improvements:
- Automatic JSON serialization/deserialization
- Better TypeScript support
- Cross-platform compatibility
- Performance optimizations

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © [Idealyst](https://github.com/IdealystIO)

## Links

- [Documentation](https://github.com/IdealystIO/idealyst-framework/tree/main/packages/storage)
- [GitHub](https://github.com/IdealystIO/idealyst-framework)
- [Issues](https://github.com/IdealystIO/idealyst-framework/issues)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)

---

Built with ❤️ by the Idealyst team