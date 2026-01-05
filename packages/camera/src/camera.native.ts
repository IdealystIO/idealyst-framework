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
  PHOTO_QUALITY_MAP,
  RECORDING_PROGRESS_INTERVAL,
} from './constants';
import { checkPermission, requestPermission } from './permissions/permissions.native';
import {
  mergeConfig,
  createError,
  findDevice,
  clampZoom,
} from './utils';

// Types from react-native-vision-camera
type VisionCameraDevice = {
  id: string;
  name: string;
  position: 'front' | 'back' | 'external';
  hasFlash: boolean;
  hasTorch: boolean;
  minZoom: number;
  maxZoom: number;
  neutralZoom: number;
  isMultiCam: boolean;
  supportsRawCapture: boolean;
  formats: unknown[];
};

type VisionCameraRef = {
  takePhoto: (options?: {
    flash?: 'on' | 'off' | 'auto';
    enableShutterSound?: boolean;
  }) => Promise<{
    path: string;
    width: number;
    height: number;
    isMirrored: boolean;
    orientation: string;
  }>;
  startRecording: (options: {
    flash?: 'on' | 'off';
    onRecordingFinished: (video: {
      path: string;
      duration: number;
      width: number;
      height: number;
    }) => void;
    onRecordingError: (error: Error) => void;
  }) => void;
  stopRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
  focus: (point: { x: number; y: number }) => Promise<void>;
};

// Lazy load vision camera module
let visionCameraModule: typeof import('react-native-vision-camera') | null = null;

async function getVisionCamera() {
  if (!visionCameraModule) {
    try {
      visionCameraModule = await import('react-native-vision-camera');
    } catch {
      return null;
    }
  }
  return visionCameraModule;
}

/**
 * Native implementation of the Camera interface using react-native-vision-camera.
 */
export class NativeCamera implements ICamera {
  private _status: CameraStatus = { ...INITIAL_CAMERA_STATUS };
  private _cameraRef: VisionCameraRef | null = null;
  private _nativeDevice: VisionCameraDevice | null = null;
  private _recordingStartTime: number = 0;
  private _recordingInterval: ReturnType<typeof setInterval> | null = null;
  private _recordingPromise: {
    resolve: (result: VideoResult) => void;
    reject: (error: CameraError) => void;
  } | null = null;

  // Callbacks
  private _stateCallbacks: Set<StateChangeCallback> = new Set();
  private _errorCallbacks: Set<ErrorCallback> = new Set();
  private _deviceCallbacks: Set<DeviceChangeCallback> = new Set();
  private _progressCallbacks: Set<RecordingProgressCallback> = new Set();

  get status(): CameraStatus {
    return { ...this._status };
  }

  /**
   * Set the camera ref from CameraPreview component.
   * @internal
   */
  _setCameraRef(ref: VisionCameraRef | null): void {
    this._cameraRef = ref;
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
      // Get available devices
      const devices = await this.getDevices();
      this._updateStatus({ availableDevices: devices });

      // Find the target device
      const targetDevice = config?.deviceId
        ? findDevice(devices, config.deviceId)
        : findDevice(devices, finalConfig.position);

      if (!targetDevice && devices.length === 0) {
        throw createError('DEVICE_NOT_FOUND', 'No camera devices found');
      }

      const activeDevice = targetDevice || devices[0];

      // Store native device reference
      this._nativeDevice = activeDevice._nativeDevice as VisionCameraDevice;

      this._updateStatus({
        state: 'ready',
        isActive: true,
        permission: 'granted',
        activeDevice,
        config: finalConfig,
        zoom: finalConfig.zoom,
        torchActive: finalConfig.torch,
      });
    } catch (error) {
      const cameraError =
        error instanceof Error
          ? createError('INITIALIZATION_FAILED', error.message, error)
          : createError('INITIALIZATION_FAILED', 'Failed to start camera');

      this._updateStatus({
        state: 'error',
        error: cameraError,
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

    this._nativeDevice = null;
    this._cameraRef = null;

    this._updateStatus({
      ...INITIAL_CAMERA_STATUS,
      availableDevices: this._status.availableDevices,
    });
  }

  async getDevices(): Promise<CameraDevice[]> {
    const visionCamera = await getVisionCamera();
    if (!visionCamera) {
      return [];
    }

    try {
      const nativeDevices = visionCamera.Camera.getAvailableCameraDevices();

      return nativeDevices.map((device) => ({
        id: device.id,
        name: device.name || `${device.position} Camera`,
        position: device.position as CameraPosition,
        isDefault: device.position === 'back',
        hasTorch: device.hasTorch,
        hasZoom: true,
        minZoom: device.minZoom,
        maxZoom: device.maxZoom,
        _nativeDevice: device,
      }));
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

    this._nativeDevice = device._nativeDevice as VisionCameraDevice;

    this._updateStatus({
      activeDevice: device,
      config: {
        ...this._status.config,
        position: device.position,
      },
    });
  }

  async takePhoto(options?: PhotoOptions): Promise<PhotoResult> {
    if (this._status.state !== 'ready') {
      throw createError('CAPTURE_FAILED', 'Camera must be ready to take photo');
    }

    if (!this._cameraRef) {
      throw createError('CAPTURE_FAILED', 'Camera not initialized');
    }

    this._updateState('capturing');

    try {
      const opts = { ...DEFAULT_PHOTO_OPTIONS, ...options };

      const photo = await this._cameraRef.takePhoto({
        flash: opts.flash ? 'on' : 'off',
        enableShutterSound: !opts.skipSound,
      });

      const uri = `file://${photo.path}`;

      this._updateState('ready');

      return {
        uri,
        width: photo.width,
        height: photo.height,
        size: 0, // File size not directly available, would need fs stat
        format: opts.format,
        metadata: {
          timestamp: Date.now(),
          orientation: parseInt(photo.orientation) || 0,
        },
        getArrayBuffer: async () => {
          // Use fetch to read file as ArrayBuffer (works with file:// URIs)
          const response = await fetch(uri);
          return response.arrayBuffer();
        },
        getData: async () => {
          // Return the file path for native consumption
          return uri;
        },
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

    if (!this._cameraRef) {
      throw createError('RECORDING_FAILED', 'Camera not initialized');
    }

    const opts = { ...DEFAULT_VIDEO_OPTIONS, ...options };

    // Apply torch if requested
    if (opts.torch) {
      this._updateStatus({ torchActive: true });
    }

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

    // Create promise for recording result
    const recordingPromise = new Promise<VideoResult>((resolve, reject) => {
      this._recordingPromise = { resolve, reject };
    });

    // Start recording
    this._cameraRef.startRecording({
      flash: opts.torch ? 'on' : 'off',
      onRecordingFinished: (video) => {
        this._clearRecordingInterval();

        const result: VideoResult = {
          uri: `file://${video.path}`,
          duration: video.duration * 1000, // Convert to ms
          width: video.width,
          height: video.height,
          size: 0, // Would need fs stat
          format: 'mp4',
          hasAudio: opts.audio ?? true,
          getArrayBuffer: async () => {
            // Use fetch to read file as ArrayBuffer (works with file:// URIs)
            const response = await fetch(`file://${video.path}`);
            return response.arrayBuffer();
          },
          getData: async () => {
            return `file://${video.path}`;
          },
        };

        this._updateStatus({
          state: 'ready',
          isRecording: false,
          recordingDuration: 0,
          torchActive: false,
        });

        this._recordingPromise?.resolve(result);
        this._recordingPromise = null;
      },
      onRecordingError: (error) => {
        this._clearRecordingInterval();

        this._updateStatus({
          state: 'ready',
          isRecording: false,
          recordingDuration: 0,
          torchActive: false,
        });

        const cameraError = createError('RECORDING_FAILED', error.message, error);
        this._notifyError(cameraError);
        this._recordingPromise?.reject(cameraError);
        this._recordingPromise = null;
      },
    });

    this._updateStatus({
      state: 'recording',
      isRecording: true,
      recordingDuration: 0,
    });
  }

  async stopRecording(): Promise<VideoResult> {
    if (this._status.state !== 'recording') {
      throw createError('RECORDING_FAILED', 'No recording in progress');
    }

    if (!this._cameraRef) {
      throw createError('RECORDING_FAILED', 'Camera not initialized');
    }

    // Stop recording - this will trigger onRecordingFinished
    await this._cameraRef.stopRecording();

    // Wait for the recording promise to resolve
    if (this._recordingPromise) {
      return new Promise((resolve, reject) => {
        const originalResolve = this._recordingPromise!.resolve;
        const originalReject = this._recordingPromise!.reject;

        this._recordingPromise!.resolve = (result) => {
          originalResolve(result);
          resolve(result);
        };

        this._recordingPromise!.reject = (error) => {
          originalReject(error);
          reject(error);
        };
      });
    }

    throw createError('RECORDING_FAILED', 'Recording state error');
  }

  async cancelRecording(): Promise<void> {
    if (this._status.state !== 'recording') {
      return;
    }

    this._clearRecordingInterval();

    if (this._cameraRef) {
      try {
        await this._cameraRef.cancelRecording();
      } catch {
        // Ignore errors during cancel
      }
    }

    this._recordingPromise = null;

    this._updateStatus({
      state: 'ready',
      isRecording: false,
      recordingDuration: 0,
      torchActive: false,
    });
  }

  setZoom(level: number): void {
    const clampedZoom = clampZoom(level, this._status.activeDevice);
    this._updateStatus({ zoom: clampedZoom });
    // Zoom is applied via the Camera component's zoom prop
  }

  setTorch(enabled: boolean): void {
    this._updateStatus({ torchActive: enabled });
    // Torch is applied via the Camera component's torch prop
  }

  async focusOnPoint(x: number, y: number): Promise<void> {
    if (!this._cameraRef) {
      return;
    }

    try {
      await this._cameraRef.focus({ x, y });
    } catch {
      // Focus not supported or failed
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

  _getPreviewSource(): VisionCameraDevice | null {
    return this._nativeDevice;
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

  private _clearRecordingInterval(): void {
    if (this._recordingInterval) {
      clearInterval(this._recordingInterval);
      this._recordingInterval = null;
    }
  }
}

/**
 * Factory function to create a NativeCamera instance.
 */
export function createCamera(): ICamera {
  return new NativeCamera();
}
