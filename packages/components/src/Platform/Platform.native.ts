import { Platform as RNPlatform } from 'react-native';
import type { PlatformAPI, PlatformSelectSpec, PlatformSystem } from './types';

const system: PlatformSystem = RNPlatform.OS === 'ios' ? 'ios' : 'android';

/**
 * Platform utility for React Native (iOS and Android)
 */
const Platform: PlatformAPI = {
    system,
    isWeb: false,
    isNative: true,
    isIOS: RNPlatform.OS === 'ios',
    isAndroid: RNPlatform.OS === 'android',

    select<T>(spec: PlatformSelectSpec<T>): T | undefined {
        // First check for specific platform
        if (system === 'ios' && spec.ios !== undefined) {
            return spec.ios;
        }
        if (system === 'android' && spec.android !== undefined) {
            return spec.android;
        }

        // Then check for native fallback
        if (spec.native !== undefined) {
            return spec.native;
        }

        // Finally check for default
        return spec.default;
    },
};

export default Platform;
