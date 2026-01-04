import { createUseRecorderHook } from './createUseRecorderHook';
import { createRecorder } from '../recorder/recorder.web';

/**
 * React hook for recording audio to file on web platforms.
 *
 * @example
 * ```tsx
 * import { useRecorder } from '@idealyst/microphone';
 *
 * function AudioRecorder() {
 *   const { isRecording, duration, startRecording, stopRecording } = useRecorder();
 *   const [recording, setRecording] = useState<RecordingResult | null>(null);
 *
 *   const handleStop = async () => {
 *     const result = await stopRecording();
 *     setRecording(result);
 *
 *     // Download the recording
 *     const link = document.createElement('a');
 *     link.href = result.uri;
 *     link.download = 'recording.wav';
 *     link.click();
 *   };
 *
 *   return (
 *     <div>
 *       <p>Duration: {Math.floor(duration / 1000)}s</p>
 *       <button onClick={isRecording ? handleStop : () => startRecording()}>
 *         {isRecording ? 'Stop' : 'Record'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useRecorder = createUseRecorderHook(createRecorder);
