/**
 * Native implementation of useAudioSession hook.
 * Uses react-native-audio-api's AudioManager under the hood.
 */

import { getAudioSessionManager } from '../AudioSessionManager.native';
import { createUseAudioSessionHook } from './useAudioSession';

export const useAudioSession = createUseAudioSessionHook(getAudioSessionManager);
