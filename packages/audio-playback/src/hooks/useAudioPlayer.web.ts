import { createUseAudioPlayerHook } from './createUseAudioPlayerHook';
import { createPlayer } from '../player.web';

/**
 * React hook for audio playback (web implementation).
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const player = useAudioPlayer();
 *
 *   // Load and play a file
 *   const playFile = async () => {
 *     await player.loadFile('/audio/music.mp3');
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
 *     <div>
 *       <button onClick={player.isPlaying ? player.pause : player.play}>
 *         {player.isPlaying ? 'Pause' : 'Play'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useAudioPlayer = createUseAudioPlayerHook(createPlayer);
