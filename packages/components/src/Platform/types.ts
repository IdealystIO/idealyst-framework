/**
 * Platform system types
 */
export type PlatformSystem = 'web' | 'ios' | 'android';

/**
 * Platform select specification
 * Allows selecting a value based on the current platform
 */
export type PlatformSelectSpec<T> = {
    web?: T;
    ios?: T;
    android?: T;
    native?: T;  // Fallback for ios and android
    default?: T; // Fallback for any platform
};

/**
 * Platform API interface
 */
export interface PlatformAPI {
    /**
     * The current platform system: 'web', 'ios', or 'android'
     */
    system: PlatformSystem;

    /**
     * Whether the current platform is web
     */
    isWeb: boolean;

    /**
     * Whether the current platform is native (ios or android)
     */
    isNative: boolean;

    /**
     * Whether the current platform is iOS
     */
    isIOS: boolean;

    /**
     * Whether the current platform is Android
     */
    isAndroid: boolean;

    /**
     * Select a value based on the current platform
     *
     * @example
     * const padding = Platform.select({
     *   web: 20,
     *   ios: 16,
     *   android: 14,
     *   default: 12,
     * });
     *
     * @example
     * const fontFamily = Platform.select({
     *   web: 'Inter',
     *   native: 'System',
     * });
     */
    select<T>(spec: PlatformSelectSpec<T>): T | undefined;
}
