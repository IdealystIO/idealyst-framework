import type { StorageAdapter } from './types'

export class WebStorage implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    if (typeof localStorage === 'undefined') {
      return null
    }
    return localStorage.getItem(key)
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof localStorage === 'undefined') {
      return
    }
    localStorage.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    if (typeof localStorage === 'undefined') {
      return
    }
    localStorage.removeItem(key)
  }
}

export class ReactNativeStorage implements StorageAdapter {
  private AsyncStorage: any

  constructor() {
    try {
      this.AsyncStorage = require('@react-native-async-storage/async-storage').default
    } catch {
      throw new Error(
        'AsyncStorage is required for React Native. Please install @react-native-async-storage/async-storage'
      )
    }
  }

  async getItem(key: string): Promise<string | null> {
    return await this.AsyncStorage.getItem(key)
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.AsyncStorage.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    await this.AsyncStorage.removeItem(key)
  }
}

export function createDefaultStorage(): StorageAdapter {
  // Check if we're in React Native environment
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return new ReactNativeStorage()
  }
  
  // Default to web storage
  return new WebStorage()
}