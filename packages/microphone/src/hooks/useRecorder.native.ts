import { createUseRecorderHook } from './createUseRecorderHook';
import { createRecorder } from '../recorder/recorder.native';

/**
 * React hook for recording audio to file on React Native platforms.
 *
 * @example
 * ```tsx
 * import { useRecorder } from '@idealyst/microphone';
 * import { View, Button, Text } from 'react-native';
 *
 * function AudioRecorder() {
 *   const { isRecording, duration, startRecording, stopRecording } = useRecorder();
 *   const [recording, setRecording] = useState<RecordingResult | null>(null);
 *
 *   const handleStop = async () => {
 *     const result = await stopRecording();
 *     setRecording(result);
 *
 *     // Get the base64 data for upload
 *     const base64Data = await result.getData();
 *     console.log('Recording size:', result.size, 'bytes');
 *   };
 *
 *   return (
 *     <View>
 *       <Text>Duration: {Math.floor(duration / 1000)}s</Text>
 *       <Button
 *         title={isRecording ? 'Stop' : 'Record'}
 *         onPress={isRecording ? handleStop : () => startRecording()}
 *       />
 *     </View>
 *   );
 * }
 * ```
 */
export const useRecorder = createUseRecorderHook(createRecorder);
