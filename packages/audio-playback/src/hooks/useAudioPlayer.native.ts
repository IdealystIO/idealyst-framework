import { createUseAudioPlayerHook } from './createUseAudioPlayerHook';
import { createPlayer } from '../player.native';

/**
 * React hook for audio playback (React Native implementation).
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const player = useAudioPlayer();
 *
 *   // Load and play a file
 *   const playFile = async () => {
 *     await player.loadFile('file:///path/to/audio.mp3');
 *     await player.play();
 *   };
 *
 *   // Stream PCM data
 *   const streamPCM = async () => {
 *     await player.loadPCMStream({ sampleRate: 16000, channels: 1, bitDepth: 16 });
 *     await player.play();
 *     // Then feed data with player.feedPCMData(pcmData);
 *   };
 *
 *   return (
 *     <View>
 *       <Button
 *         title={player.isPlaying ? 'Pause' : 'Play'}
 *         onPress={player.isPlaying ? player.pause : player.play}
 *       />
 *     </View>
 *   );
 * }
 * ```
 */
export const useAudioPlayer = createUseAudioPlayerHook(createPlayer);
