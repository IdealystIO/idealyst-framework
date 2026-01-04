/**
 * Minimal type declarations for react-native.
 * Full types are provided by the consuming application.
 */
declare module 'react-native' {
  export const Platform: {
    OS: 'ios' | 'android' | 'windows' | 'macos' | 'web';
    Version: number | string;
    select: <T>(specifics: { [platform: string]: T }) => T;
  };

  export const PermissionsAndroid: {
    PERMISSIONS: {
      RECORD_AUDIO: string;
      [key: string]: string;
    };
    RESULTS: {
      GRANTED: 'granted';
      DENIED: 'denied';
      NEVER_ASK_AGAIN: 'never_ask_again';
      [key: string]: string;
    };
    check: (permission: string) => Promise<boolean>;
    request: (
      permission: string,
      rationale?: {
        title: string;
        message: string;
        buttonNeutral?: string;
        buttonNegative?: string;
        buttonPositive?: string;
      }
    ) => Promise<'granted' | 'denied' | 'never_ask_again'>;
  };

  export const NativeModules: {
    [key: string]: unknown;
  };

  export class NativeEventEmitter {
    constructor(nativeModule?: unknown);
    addListener(
      eventType: string,
      listener: (...args: unknown[]) => void
    ): { remove: () => void };
    removeAllListeners(eventType: string): void;
    removeSubscription(subscription: { remove: () => void }): void;
  }
}
