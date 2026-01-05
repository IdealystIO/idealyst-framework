import type {
  ICamera,
  CameraConfig,
  CameraDevice,
  CameraPosition,
  CameraStatus,
  CameraState,
  CameraError,
  PermissionResult,
  PhotoOptions,
  PhotoResult,
  VideoOptions,
  VideoResult,
  StateChangeCallback,
  ErrorCallback,
  DeviceChangeCallback,
  RecordingProgressCallback,
} from './types';
import {
  DEFAULT_CAMERA_CONFIG,
  INITIAL_CAMERA_STATUS,
  DEFAULT_PHOTO_OPTIONS,
  DEFAULT_VIDEO_OPTIONS,
  VIDEO_QUALITY_RESOLUTIONS,
  PHOTO_QUALITY_MAP,
  PHOTO_MIME_TYPES,
  RECORDING_PROGRESS_INTERVAL,
} from './constants';
import { checkPermission, requestPermission } from './permissions/permissions.web';
import {
  mergeConfig,
  createError,
  mapErrorToCode,
  findDevice,
  clampZoom,
  getPreferredVideoCodec,
  blobToArrayBuffer,
} from './utils';

/**
 * Web implementation of the Camera interface using MediaStream API.
 */
export class WebCamera implements ICamera {
  private _status: CameraStatus = { ...INITIAL_CAMERA_STATUS };
  private _stream: MediaStream | null = null;
  private _mediaRecorder: MediaRecorder | null = null;
  private _recordedChunks: Blob[] = [];
  private _recordingStartTime: number = 0;
  private _recordingInterval: ReturnType<typeof setInterval> | null = null;

  // Callbacks
  private _stateCallbacks: Set<StateChangeCallback> = new Set();
  private _errorCallbacks: Set<ErrorCallback> = new Set();
  private _deviceCallbacks: Set<DeviceChangeCallback> = new Set();
  private _progressCallbacks: Set<RecordingProgressCallback> = new Set();

  // Device change listener
  private _deviceChangeHandler: (() => void) | null = null;

  get status(): CameraStatus {
    return { ...this._status };
  }

  async checkPermission(): Promise<PermissionResult> {
    return checkPermission();
  }

  async requestPermission(): Promise<PermissionResult> {
    return requestPermission();
  }

  async start(config?: Partial<CameraConfig>): Promise<void> {
    if (this._status.state === 'ready' || this._status.state === 'recording') {
      return;
    }

    this._updateState('initializing');
    const finalConfig = mergeConfig(config);

    try {
      // Get available devices first
      const devices = await this.getDevices();
      this._updateStatus({ availableDevices: devices });

      // Find the target device
      const targetDevice = config?.deviceId
        ? findDevice(devices, config.deviceId)
        : findDevice(devices, finalConfig.position);

      if (!targetDevice && devices.length === 0) {
        throw createError('DEVICE_NOT_FOUND', 'No camera devices found');
      }

      // Build constraints
      const constraints: MediaStreamConstraints = {
        video: this._buildVideoConstraints(targetDevice, finalConfig),
        audio: finalConfig.enableAudio,
      };

      // Get media stream
      this._stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Update status
      const activeDevice = targetDevice || devices[0];
      this._updateStatus({
        state: 'ready',
        isActive: true,
        permission: 'granted',
        activeDevice,
        config: finalConfig,
        zoom: finalConfig.zoom,
        torchActive: finalConfig.torch,
      });

      // Set up device change listener
      this._setupDeviceChangeListener();

      // Apply initial torch setting if supported
      if (finalConfig.torch) {
        await this._applyTorch(true);
      }
    } catch (error) {
      const cameraError =
        error instanceof Error
          ? createError(mapErrorToCode(error), error.message, error)
          : createError('INITIALIZATION_FAILED', 'Failed to start camera');

      this._updateStatus({
        state: 'error',
        error: cameraError,
        permission: cameraError.code === 'PERMISSION_DENIED' ? 'denied' : this._status.permission,
      });

      this._notifyError(cameraError);
      throw cameraError;
    }
  }

  async stop(): Promise<void> {
    if (this._status.state === 'idle') {
      return;
    }

    this._updateState('stopping');

    // Cancel any ongoing recording
    if (this._status.isRecording) {
      await this.cancelRecording();
    }

    // Stop all tracks
    if (this._stream) {
      this._stream.getTracks().forEach((track) => track.stop());
      this._stream = null;
    }

    // Remove device change listener
    if (this._deviceChangeHandler) {
      navigator.mediaDevices.removeEventListener('devicechange', this._deviceChangeHandler);
      this._deviceChangeHandler = null;
    }

    this._updateStatus({
      ...INITIAL_CAMERA_STATUS,
      availableDevices: this._status.availableDevices,
    });
  }

  async getDevices(): Promise<CameraDevice[]> {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter((d) => d.kind === 'videoinput');

      return videoDevices.map((device, index) => {
        const position = this._inferPosition(device.label);
        return {
          id: device.deviceId,
          name: device.label || `Camera ${index + 1}`,
          position,
          isDefault: index === 0,
          hasTorch: false, // Will be detected when stream is active
          hasZoom: true, // Web generally supports zoom via constraints
          minZoom: 1,
          maxZoom: 10,
        };
      });
    } catch {
      return [];
    }
  }

  async switchDevice(deviceOrPosition: string | CameraPosition): Promise<void> {
    if (this._status.state !== 'ready') {
      throw createError('INVALID_CONFIG', 'Camera must be active to switch device');
    }

    const device = findDevice(this._status.availableDevices, deviceOrPosition);
    if (!device) {
      throw createError('DEVICE_NOT_FOUND', `Device not found: ${deviceOrPosition}`);
    }

    // Restart with new device
    await this.stop();
    await this.start({
      ...this._status.config,
      deviceId: device.id,
      position: device.position,
    });
  }

  async takePhoto(options?: PhotoOptions): Promise<PhotoResult> {
    if (this._status.state !== 'ready') {
      throw createError('CAPTURE_FAILED', 'Camera must be ready to take photo');
    }

    if (!this._stream) {
      throw createError('CAPTURE_FAILED', 'No active stream');
    }

    this._updateState('capturing');

    try {
      const opts = { ...DEFAULT_PHOTO_OPTIONS, ...options };
      const videoTrack = this._stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      const width = settings.width || 1920;
      const height = settings.height || 1080;

      // Create a video element to capture frame
      const video = document.createElement('video');
      video.srcObject = this._stream;
      video.muted = true;
      await video.play();

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.onloadeddata = () => resolve();
        }
      });

      // Create canvas and capture frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || width;
      canvas.height = video.videoHeight || height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(video, 0, 0);
      video.pause();
      video.srcObject = null;

      // Convert to blob
      const mimeType = PHOTO_MIME_TYPES[opts.format] || 'image/jpeg';
      const quality = (opts.quality || 90) / 100;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          },
          mimeType,
          quality
        );
      });

      const uri = URL.createObjectURL(blob);

      this._updateState('ready');

      return {
        uri,
        width: canvas.width,
        height: canvas.height,
        size: blob.size,
        format: opts.format,
        metadata: {
          timestamp: Date.now(),
        },
        getArrayBuffer: () => blobToArrayBuffer(blob),
        getData: () => Promise.resolve(blob),
      };
    } catch (error) {
      this._updateState('ready');
      const cameraError =
        error instanceof Error
          ? createError('CAPTURE_FAILED', error.message, error)
          : createError('CAPTURE_FAILED', 'Failed to capture photo');
      this._notifyError(cameraError);
      throw cameraError;
    }
  }

  async startRecording(options?: VideoOptions): Promise<void> {
    if (this._status.state !== 'ready') {
      throw createError('RECORDING_FAILED', 'Camera must be ready to record');
    }

    if (!this._stream) {
      throw createError('RECORDING_FAILED', 'No active stream');
    }

    const opts = { ...DEFAULT_VIDEO_OPTIONS, ...options };

    // Apply torch if requested
    if (opts.torch) {
      await this._applyTorch(true);
    }

    // Create MediaRecorder
    const mimeType = getPreferredVideoCodec();
    this._mediaRecorder = new MediaRecorder(this._stream, { mimeType });
    this._recordedChunks = [];

    this._mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this._recordedChunks.push(event.data);
      }
    };

    this._mediaRecorder.start(100); // Collect data every 100ms
    this._recordingStartTime = Date.now();

    // Start progress updates
    this._recordingInterval = setInterval(() => {
      const duration = Date.now() - this._recordingStartTime;
      this._updateStatus({ recordingDuration: duration });
      this._notifyProgress(duration);

      // Check max duration
      if (opts.maxDuration && duration >= opts.maxDuration * 1000) {
        this.stopRecording();
      }
    }, RECORDING_PROGRESS_INTERVAL);

    this._updateStatus({
      state: 'recording',
      isRecording: true,
      recordingDuration: 0,
    });
  }

  async stopRecording(): Promise<VideoResult> {
    if (!this._mediaRecorder || this._status.state !== 'recording') {
      throw createError('RECORDING_FAILED', 'No recording in progress');
    }

    return new Promise((resolve, reject) => {
      if (!this._mediaRecorder) {
        reject(createError('RECORDING_FAILED', 'MediaRecorder not available'));
        return;
      }

      this._mediaRecorder.onstop = () => {
        this._clearRecordingInterval();

        const blob = new Blob(this._recordedChunks, { type: this._mediaRecorder?.mimeType });
        const uri = URL.createObjectURL(blob);
        const duration = Date.now() - this._recordingStartTime;

        // Get video dimensions from stream
        const videoTrack = this._stream?.getVideoTracks()[0];
        const settings = videoTrack?.getSettings();
        const width = settings?.width || 1920;
        const height = settings?.height || 1080;

        this._updateStatus({
          state: 'ready',
          isRecording: false,
          recordingDuration: 0,
        });

        resolve({
          uri,
          duration,
          width,
          height,
          size: blob.size,
          format: blob.type.includes('webm') ? 'mov' : 'mp4', // Approximate format
          hasAudio: this._status.config.enableAudio,
          getArrayBuffer: () => blobToArrayBuffer(blob),
          getData: () => Promise.resolve(blob),
        });
      };

      this._mediaRecorder.onerror = (event) => {
        this._clearRecordingInterval();
        this._updateStatus({
          state: 'ready',
          isRecording: false,
          recordingDuration: 0,
        });
        reject(createError('RECORDING_FAILED', 'Recording failed'));
      };

      this._mediaRecorder.stop();
    });
  }

  async cancelRecording(): Promise<void> {
    if (!this._mediaRecorder || this._status.state !== 'recording') {
      return;
    }

    this._clearRecordingInterval();
    this._mediaRecorder.stop();
    this._recordedChunks = [];

    this._updateStatus({
      state: 'ready',
      isRecording: false,
      recordingDuration: 0,
    });
  }

  setZoom(level: number): void {
    const clampedZoom = clampZoom(level, this._status.activeDevice);

    // Apply zoom via track constraints if supported
    const videoTrack = this._stream?.getVideoTracks()[0];
    if (videoTrack) {
      const capabilities = videoTrack.getCapabilities?.();
      if (capabilities && 'zoom' in capabilities) {
        videoTrack.applyConstraints({
          advanced: [{ zoom: clampedZoom } as MediaTrackConstraintSet],
        }).catch(() => {
          // Zoom not supported, silently fail
        });
      }
    }

    this._updateStatus({ zoom: clampedZoom });
  }

  setTorch(enabled: boolean): void {
    this._applyTorch(enabled).catch(() => {
      // Torch not supported
    });
    this._updateStatus({ torchActive: enabled });
  }

  async focusOnPoint(x: number, y: number): Promise<void> {
    // Web doesn't have direct point-focus support
    // This is a no-op but could trigger autofocus re-lock
    const videoTrack = this._stream?.getVideoTracks()[0];
    if (videoTrack) {
      try {
        await videoTrack.applyConstraints({
          advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet],
        });
      } catch {
        // Focus control not supported
      }
    }
  }

  onStateChange(callback: StateChangeCallback): () => void {
    this._stateCallbacks.add(callback);
    return () => this._stateCallbacks.delete(callback);
  }

  onError(callback: ErrorCallback): () => void {
    this._errorCallbacks.add(callback);
    return () => this._errorCallbacks.delete(callback);
  }

  onDeviceChange(callback: DeviceChangeCallback): () => void {
    this._deviceCallbacks.add(callback);
    return () => this._deviceCallbacks.delete(callback);
  }

  onRecordingProgress(callback: RecordingProgressCallback): () => void {
    this._progressCallbacks.add(callback);
    return () => this._progressCallbacks.delete(callback);
  }

  _getPreviewSource(): MediaStream | null {
    return this._stream;
  }

  dispose(): void {
    this.stop();
    this._stateCallbacks.clear();
    this._errorCallbacks.clear();
    this._deviceCallbacks.clear();
    this._progressCallbacks.clear();
  }

  // === Private Methods ===

  private _updateState(state: CameraState): void {
    this._updateStatus({ state });
  }

  private _updateStatus(partial: Partial<CameraStatus>): void {
    this._status = { ...this._status, ...partial };
    this._notifyStateChange();
  }

  private _notifyStateChange(): void {
    this._stateCallbacks.forEach((cb) => cb(this.status));
  }

  private _notifyError(error: CameraError): void {
    this._errorCallbacks.forEach((cb) => cb(error));
  }

  private _notifyProgress(duration: number): void {
    this._progressCallbacks.forEach((cb) => cb(duration));
  }

  private _notifyDeviceChange(devices: CameraDevice[]): void {
    this._deviceCallbacks.forEach((cb) => cb(devices));
  }

  private _buildVideoConstraints(
    device: CameraDevice | undefined,
    config: CameraConfig
  ): MediaTrackConstraints {
    const resolution = config.resolution || VIDEO_QUALITY_RESOLUTIONS[config.videoQuality];

    const constraints: MediaTrackConstraints = {
      width: { ideal: resolution.width },
      height: { ideal: resolution.height },
      facingMode: config.position === 'front' ? 'user' : 'environment',
    };

    if (device) {
      constraints.deviceId = { exact: device.id };
    }

    return constraints;
  }

  private _inferPosition(label: string): CameraPosition {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('front') || lowerLabel.includes('user') || lowerLabel.includes('facetime')) {
      return 'front';
    }
    if (lowerLabel.includes('back') || lowerLabel.includes('rear') || lowerLabel.includes('environment')) {
      return 'back';
    }
    return 'external';
  }

  private async _applyTorch(enabled: boolean): Promise<void> {
    const videoTrack = this._stream?.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      await videoTrack.applyConstraints({
        advanced: [{ torch: enabled } as MediaTrackConstraintSet],
      });
    } catch {
      // Torch not supported on this device
    }
  }

  private _setupDeviceChangeListener(): void {
    this._deviceChangeHandler = async () => {
      const devices = await this.getDevices();
      this._updateStatus({ availableDevices: devices });
      this._notifyDeviceChange(devices);
    };

    navigator.mediaDevices.addEventListener('devicechange', this._deviceChangeHandler);
  }

  private _clearRecordingInterval(): void {
    if (this._recordingInterval) {
      clearInterval(this._recordingInterval);
      this._recordingInterval = null;
    }
  }
}

/**
 * Factory function to create a WebCamera instance.
 */
export function createCamera(): ICamera {
  return new WebCamera();
}
