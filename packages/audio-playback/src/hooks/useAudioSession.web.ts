/**
 * Web implementation of useAudioSession hook.
 * This is a no-op on web since browsers manage audio sessions automatically.
 */

import { getAudioSessionManager } from '../AudioSessionManager.web';
import { createUseAudioSessionHook } from './useAudioSession';

export const useAudioSession = createUseAudioSessionHook(getAudioSessionManager);
