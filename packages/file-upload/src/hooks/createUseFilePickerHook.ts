import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UseFilePickerOptions,
  UseFilePickerResult,
  FilePickerStatus,
  FilePickerError,
  PickedFile,
  FilePickerResult,
  FilePickerConfig,
  PermissionResult,
  ValidationResult,
  IFilePicker,
  CreateFilePickerFactory,
  CameraOptions,
} from '../types';
import { INITIAL_FILE_PICKER_STATUS } from '../constants';
import { checkPermissions, requestPermissions } from '../permissions';

/**
 * Create a useFilePicker hook with the given file picker factory.
 */
export function createUseFilePickerHook(createFilePicker: CreateFilePickerFactory) {
  return function useFilePicker(options: UseFilePickerOptions = {}): UseFilePickerResult {
    const { config = {}, autoRequestPermission = false } = options;

    const pickerRef = useRef<IFilePicker | null>(null);
    const configRef = useRef<Partial<FilePickerConfig>>(config);

    const [status, setStatus] = useState<FilePickerStatus>(INITIAL_FILE_PICKER_STATUS);
    const [permission, setPermission] = useState<PermissionResult | null>(null);
    const [error, setError] = useState<FilePickerError | null>(null);
    const [files, setFiles] = useState<PickedFile[]>([]);

    // Update config ref when it changes
    useEffect(() => {
      configRef.current = config;
    }, [config]);

    // Initialize picker
    useEffect(() => {
      const picker = createFilePicker();
      pickerRef.current = picker;

      // Subscribe to state changes
      const unsubscribe = picker.onStateChange((newStatus) => {
        setStatus(newStatus);
        if (newStatus.error) {
          setError(newStatus.error);
        }
      });

      // Check or request permissions
      const initPermissions = async () => {
        if (autoRequestPermission) {
          const result = await requestPermissions();
          setPermission(result);
        } else {
          const result = await checkPermissions();
          setPermission(result);
        }
      };

      initPermissions();

      return () => {
        unsubscribe();
        picker.dispose();
        pickerRef.current = null;
      };
    }, [autoRequestPermission]);

    /**
     * Open file picker.
     */
    const pick = useCallback(async (overrideConfig?: Partial<FilePickerConfig>): Promise<FilePickerResult> => {
      if (!pickerRef.current) {
        return { cancelled: true, files: [], rejected: [] };
      }

      setError(null);
      const finalConfig = { ...configRef.current, ...overrideConfig };
      const result = await pickerRef.current.pick(finalConfig);

      if (!result.cancelled && result.files.length > 0) {
        setFiles(result.files);
      }

      if (result.error) {
        setError(result.error);
      }

      return result;
    }, []);

    /**
     * Open camera to capture.
     */
    const captureFromCamera = useCallback(async (captureOptions?: CameraOptions): Promise<FilePickerResult> => {
      if (!pickerRef.current) {
        return { cancelled: true, files: [], rejected: [] };
      }

      setError(null);
      const result = await pickerRef.current.captureFromCamera(captureOptions);

      if (!result.cancelled && result.files.length > 0) {
        setFiles(result.files);
      }

      if (result.error) {
        setError(result.error);
      }

      return result;
    }, []);

    /**
     * Clear picked files.
     */
    const clear = useCallback(() => {
      setFiles([]);
      setError(null);
    }, []);

    /**
     * Check permissions.
     */
    const checkPermissionStatus = useCallback(async (): Promise<PermissionResult> => {
      const result = await checkPermissions();
      setPermission(result);
      return result;
    }, []);

    /**
     * Request permissions.
     */
    const requestPermissionStatus = useCallback(async (): Promise<PermissionResult> => {
      const result = await requestPermissions();
      setPermission(result);
      return result;
    }, []);

    /**
     * Validate files against current config.
     */
    const validateFiles = useCallback((filesToValidate: File[] | PickedFile[]): ValidationResult => {
      if (!pickerRef.current) {
        return { accepted: [], rejected: [], isValid: false };
      }

      return pickerRef.current.validateFiles(filesToValidate, configRef.current);
    }, []);

    return {
      status,
      isPicking: status.state === 'picking' || status.state === 'processing',
      permission,
      error,
      files,
      pick,
      captureFromCamera,
      clear,
      checkPermission: checkPermissionStatus,
      requestPermission: requestPermissionStatus,
      validateFiles,
      pickerRef,
    };
  };
}
