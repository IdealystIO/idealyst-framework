import type {
  IRecorder,
  RecordingOptions,
  RecordingResult,
  AudioConfig,
  PCMData,
} from '../types';
import { DEFAULT_AUDIO_CONFIG } from '../constants';
import {
  createWavFile,
  concatArrayBuffers,
  mergeConfig,
  createMicrophoneError,
} from '../utils';
import { WebMicrophone } from '../microphone.web';

export class WebRecorder implements IRecorder {
  private microphone: WebMicrophone | null = null;
  private chunks: ArrayBuffer[] = [];
  private startTime: number = 0;
  private _isRecording: boolean = false;
  private _duration: number = 0;
  private config: AudioConfig = DEFAULT_AUDIO_CONFIG;
  private format: 'wav' | 'raw' = 'wav';
  private maxDuration: number = 0;
  private durationIntervalId: ReturnType<typeof setInterval> | null = null;
  private unsubscribeData: (() => void) | null = null;

  get isRecording(): boolean {
    return this._isRecording;
  }

  get duration(): number {
    return this._duration;
  }

  async startRecording(options?: RecordingOptions): Promise<void> {
    if (this._isRecording) {
      throw createMicrophoneError(
        'RECORDING_FAILED',
        'Already recording'
      );
    }

    this.format = options?.format ?? 'wav';
    this.maxDuration = options?.maxDuration ?? 0;
    this.config = mergeConfig(options?.audioConfig, DEFAULT_AUDIO_CONFIG);

    // Create new microphone instance for recording
    this.microphone = new WebMicrophone();
    this.chunks = [];
    this.startTime = Date.now();
    this._duration = 0;

    // Subscribe to audio data
    this.unsubscribeData = this.microphone.onAudioData((pcmData: PCMData) => {
      this.chunks.push(pcmData.buffer.slice(0)); // Clone buffer
    });

    // Start microphone
    await this.microphone.start(this.config);
    this._isRecording = true;

    // Start duration tracking
    this.durationIntervalId = setInterval(() => {
      this._duration = Date.now() - this.startTime;

      // Check max duration
      if (this.maxDuration > 0 && this._duration >= this.maxDuration * 1000) {
        this.stopRecording().catch(console.error);
      }
    }, 100);
  }

  async stopRecording(): Promise<RecordingResult> {
    if (!this._isRecording || !this.microphone) {
      throw createMicrophoneError(
        'RECORDING_FAILED',
        'Not currently recording'
      );
    }

    // Stop duration tracking
    if (this.durationIntervalId) {
      clearInterval(this.durationIntervalId);
      this.durationIntervalId = null;
    }

    // Unsubscribe from data
    if (this.unsubscribeData) {
      this.unsubscribeData();
      this.unsubscribeData = null;
    }

    // Stop microphone
    await this.microphone.stop();
    this.microphone.dispose();
    this.microphone = null;

    this._isRecording = false;
    this._duration = Date.now() - this.startTime;

    // Combine all chunks
    const rawPcmData = concatArrayBuffers(this.chunks);

    // Create final audio data (with WAV header if needed)
    let audioData: ArrayBuffer;
    if (this.format === 'wav') {
      audioData = createWavFile(rawPcmData, this.config);
    } else {
      audioData = rawPcmData;
    }

    // Create blob and URL
    const mimeType = this.format === 'wav' ? 'audio/wav' : 'application/octet-stream';
    const blob = new Blob([audioData], { type: mimeType });
    const uri = URL.createObjectURL(blob);

    const result: RecordingResult = {
      uri,
      duration: this._duration,
      size: audioData.byteLength,
      config: this.config,
      format: this.format,
      getArrayBuffer: async () => audioData,
      getData: async () => blob,
    };

    // Clear chunks
    this.chunks = [];

    return result;
  }

  async cancelRecording(): Promise<void> {
    if (!this._isRecording) {
      return;
    }

    // Stop duration tracking
    if (this.durationIntervalId) {
      clearInterval(this.durationIntervalId);
      this.durationIntervalId = null;
    }

    // Unsubscribe from data
    if (this.unsubscribeData) {
      this.unsubscribeData();
      this.unsubscribeData = null;
    }

    // Stop and dispose microphone
    if (this.microphone) {
      await this.microphone.stop();
      this.microphone.dispose();
      this.microphone = null;
    }

    this._isRecording = false;
    this._duration = 0;
    this.chunks = [];
  }

  dispose(): void {
    this.cancelRecording().catch(() => {});
  }
}

/**
 * Create a new WebRecorder instance.
 */
export function createRecorder(): IRecorder {
  return new WebRecorder();
}
