import { createUseMicrophoneHook } from './createUseMicrophoneHook';
import { createMicrophone } from '../microphone.web';

/**
 * React hook for microphone access on web platforms.
 *
 * @example
 * ```tsx
 * import { useMicrophone, AUDIO_PROFILES } from '@idealyst/microphone';
 *
 * function VoiceInput() {
 *   const {
 *     isRecording,
 *     level,
 *     start,
 *     stop,
 *     subscribeToAudioData
 *   } = useMicrophone({
 *     config: AUDIO_PROFILES.speech,
 *     autoRequestPermission: true,
 *   });
 *
 *   useEffect(() => {
 *     if (!isRecording) return;
 *
 *     return subscribeToAudioData((pcmData) => {
 *       // Process audio data
 *       console.log('Got', pcmData.samples.length, 'samples');
 *     });
 *   }, [isRecording, subscribeToAudioData]);
 *
 *   return (
 *     <div>
 *       <button onClick={isRecording ? stop : start}>
 *         {isRecording ? 'Stop' : 'Start'}
 *       </button>
 *       <div>Level: {Math.round(level.current * 100)}%</div>
 *     </div>
 *   );
 * }
 * ```
 */
export const useMicrophone = createUseMicrophoneHook(createMicrophone);
