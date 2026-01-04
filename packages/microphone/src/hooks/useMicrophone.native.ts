import { createUseMicrophoneHook } from './createUseMicrophoneHook';
import { createMicrophone } from '../microphone.native';

/**
 * React hook for microphone access on React Native platforms.
 *
 * @example
 * ```tsx
 * import { useMicrophone, AUDIO_PROFILES } from '@idealyst/microphone';
 * import { View, Button, Text } from 'react-native';
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
 *     <View>
 *       <Button
 *         title={isRecording ? 'Stop' : 'Start'}
 *         onPress={isRecording ? stop : start}
 *       />
 *       <Text>Level: {Math.round(level.current * 100)}%</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export const useMicrophone = createUseMicrophoneHook(createMicrophone);
