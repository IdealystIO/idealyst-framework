import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UseCameraOptions,
  UseCameraResult,
  CameraStatus,
  CameraError,
  CameraDevice,
  PermissionResult,
  CameraConfig,
  PhotoOptions,
  PhotoResult,
  VideoOptions,
  VideoResult,
  CameraPosition,
  ICamera,
  CreateCameraFactory,
} from '../types';
import { INITIAL_CAMERA_STATUS } from '../constants';

/**
 * Factory function to create a useCamera hook with a specific camera implementation.
 */
export function createUseCameraHook(createCamera: CreateCameraFactory) {
  return function useCamera(options: UseCameraOptions = {}): UseCameraResult {
    const {
      config = {},
      autoRequestPermission = false,
      autoStart = false,
    } = options;

    const cameraRef = useRef<ICamera | null>(null);
    const configRef = useRef<Partial<CameraConfig>>(config);

    // State
    const [status, setStatus] = useState<CameraStatus>(INITIAL_CAMERA_STATUS);
    const [permission, setPermission] = useState<PermissionResult | null>(null);
    const [error, setError] = useState<CameraError | null>(null);

    // Initialize camera instance
    useEffect(() => {
      const camera = createCamera();
      cameraRef.current = camera;

      // Subscribe to state changes
      const unsubscribeState = camera.onStateChange((newStatus) => {
        setStatus(newStatus);
        if (newStatus.error) {
          setError(newStatus.error);
        }
      });

      const unsubscribeError = camera.onError((err) => {
        setError(err);
      });

      // Check or request permissions on mount
      const initPermissions = async () => {
        if (autoRequestPermission) {
          const result = await camera.requestPermission();
          setPermission(result);

          // Auto-start if requested and permission granted
          if (autoStart && result.camera === 'granted') {
            try {
              await camera.start(configRef.current);
            } catch (e) {
              // Error will be handled by error callback
            }
          }
        } else {
          const result = await camera.checkPermission();
          setPermission(result);
        }
      };

      initPermissions();

      return () => {
        unsubscribeState();
        unsubscribeError();
        camera.dispose();
        cameraRef.current = null;
      };
    }, [autoRequestPermission, autoStart]);

    // Update config ref when config changes
    useEffect(() => {
      configRef.current = config;
    }, [config]);

    // Action callbacks
    const start = useCallback(async (overrideConfig?: Partial<CameraConfig>) => {
      if (!cameraRef.current) return;
      setError(null);
      const finalConfig = { ...configRef.current, ...overrideConfig };
      await cameraRef.current.start(finalConfig);
    }, []);

    const stop = useCallback(async () => {
      if (!cameraRef.current) return;
      await cameraRef.current.stop();
    }, []);

    const switchDevice = useCallback(async (deviceOrPosition: string | CameraPosition) => {
      if (!cameraRef.current) return;
      await cameraRef.current.switchDevice(deviceOrPosition);
    }, []);

    const takePhoto = useCallback(async (photoOptions?: PhotoOptions): Promise<PhotoResult> => {
      if (!cameraRef.current) {
        throw new Error('Camera not initialized');
      }
      return cameraRef.current.takePhoto(photoOptions);
    }, []);

    const startRecording = useCallback(async (videoOptions?: VideoOptions) => {
      if (!cameraRef.current) return;
      await cameraRef.current.startRecording(videoOptions);
    }, []);

    const stopRecording = useCallback(async (): Promise<VideoResult> => {
      if (!cameraRef.current) {
        throw new Error('Camera not initialized');
      }
      return cameraRef.current.stopRecording();
    }, []);

    const cancelRecording = useCallback(async () => {
      if (!cameraRef.current) return;
      await cameraRef.current.cancelRecording();
    }, []);

    const setZoom = useCallback((level: number) => {
      cameraRef.current?.setZoom(level);
    }, []);

    const setTorch = useCallback((enabled: boolean) => {
      cameraRef.current?.setTorch(enabled);
    }, []);

    const focusOnPoint = useCallback(async (x: number, y: number) => {
      if (!cameraRef.current) return;
      await cameraRef.current.focusOnPoint(x, y);
    }, []);

    const requestPermission = useCallback(async (): Promise<PermissionResult> => {
      if (!cameraRef.current) {
        return { camera: 'unavailable', microphone: 'unavailable', canAskAgain: false };
      }
      const result = await cameraRef.current.requestPermission();
      setPermission(result);
      return result;
    }, []);

    return {
      // State
      status,
      isActive: status.isActive,
      isRecording: status.isRecording,
      recordingDuration: status.recordingDuration,
      activeDevice: status.activeDevice,
      availableDevices: status.availableDevices,
      permission,
      error,
      zoom: status.zoom,
      torchActive: status.torchActive,

      // Actions
      start,
      stop,
      switchDevice,
      takePhoto,
      startRecording,
      stopRecording,
      cancelRecording,
      setZoom,
      setTorch,
      focusOnPoint,
      requestPermission,

      // Ref
      cameraRef,
    };
  };
}
