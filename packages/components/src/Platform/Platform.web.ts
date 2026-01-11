import type { PlatformAPI, PlatformSelectSpec, PlatformSystem } from './types';

/**
 * Platform utility for web
 */
const Platform: PlatformAPI = {
    system: 'web' as PlatformSystem,
    isWeb: true,
    isNative: false,
    isIOS: false,
    isAndroid: false,

    select<T>(spec: PlatformSelectSpec<T>): T | undefined {
        if (spec.web !== undefined) {
            return spec.web;
        }
        return spec.default;
    },
};

export default Platform;
