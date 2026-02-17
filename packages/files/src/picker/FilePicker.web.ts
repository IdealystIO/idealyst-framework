import type {
  IFilePicker,
  FilePickerConfig,
  FilePickerResult,
  FilePickerStatus,
  FilePickerState,
  PickedFile,
  CameraOptions,
  ValidationResult,
  PermissionStatus,
} from '../types';
import {
  DEFAULT_FILE_PICKER_CONFIG,
  INITIAL_FILE_PICKER_STATUS,
} from '../constants';
import {
  generateId,
  buildAcceptString,
  validateFiles as validateFilesUtil,
  createPickedFileFromFile,
  createFilePickerError,
  EventEmitter,
  getFileExtension,
} from '../utils';
import { checkPermissions, requestPermissions } from '../permissions/permissions.web';

type FilePickerEvents = {
  stateChange: [FilePickerStatus];
};

/**
 * Web implementation of IFilePicker using HTML5 File API.
 */
export class WebFilePicker implements IFilePicker {
  private _status: FilePickerStatus = { ...INITIAL_FILE_PICKER_STATUS };
  private _events = new EventEmitter<FilePickerEvents>();
  private _defaultConfig: FilePickerConfig;
  private _disposed = false;

  constructor(config?: Partial<FilePickerConfig>) {
    this._defaultConfig = { ...DEFAULT_FILE_PICKER_CONFIG, ...config };
    // Web always has permission for file input
    this._status.permission = 'granted';
  }

  get status(): FilePickerStatus {
    return { ...this._status };
  }

  async checkPermission(): Promise<PermissionStatus> {
    // File input doesn't require permission on web
    return 'granted';
  }

  async requestPermission(): Promise<PermissionStatus> {
    // File input doesn't require permission on web
    return 'granted';
  }

  async pick(config?: Partial<FilePickerConfig>): Promise<FilePickerResult> {
    if (this._disposed) {
      return {
        cancelled: true,
        files: [],
        rejected: [],
        error: createFilePickerError('NOT_SUPPORTED', 'File picker has been disposed'),
      };
    }

    const finalConfig = { ...this._defaultConfig, ...config };
    this._updateState('picking');

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = finalConfig.multiple;
      input.accept = buildAcceptString(finalConfig);

      // Handle capture attribute for mobile
      if (finalConfig.allowCamera && finalConfig.allowedTypes.some(t => t === 'image' || t === 'video')) {
        // Don't set capture, let user choose between camera and library
      }

      const handleChange = async () => {
        cleanup();
        this._updateState('processing');

        try {
          const files = Array.from(input.files || []);

          if (files.length === 0) {
            this._updateState('idle');
            resolve({ cancelled: true, files: [], rejected: [] });
            return;
          }

          // Convert to PickedFile and validate
          const pickedFiles = await this._processFiles(files, finalConfig);
          const { accepted, rejected } = validateFilesUtil(pickedFiles, finalConfig);

          // Get image dimensions for accepted files
          const filesWithDimensions = await this._addImageDimensions(accepted);

          this._updateState('idle');
          resolve({
            cancelled: false,
            files: filesWithDimensions,
            rejected,
          });
        } catch (error) {
          this._updateState('error', createFilePickerError('UNKNOWN', 'Failed to process files', error as Error));
          resolve({
            cancelled: false,
            files: [],
            rejected: [],
            error: this._status.error,
          });
        }
      };

      const handleCancel = () => {
        cleanup();
        this._updateState('idle');
        resolve({ cancelled: true, files: [], rejected: [] });
      };

      const cleanup = () => {
        input.removeEventListener('change', handleChange);
        input.removeEventListener('cancel', handleCancel);
        window.removeEventListener('focus', handleFocusAfterPicker);
      };

      // Fallback for browsers that don't fire 'cancel' event
      let focusTimeout: ReturnType<typeof setTimeout>;
      const handleFocusAfterPicker = () => {
        // Give time for the change event to fire
        focusTimeout = setTimeout(() => {
          if (!input.files?.length) {
            handleCancel();
          }
        }, 300);
      };

      input.addEventListener('change', handleChange);
      input.addEventListener('cancel', handleCancel);

      // Some browsers fire 'focus' when picker is closed without selection
      window.addEventListener('focus', handleFocusAfterPicker, { once: true });

      // Trigger the file picker
      input.click();
    });
  }

  async captureFromCamera(options?: CameraOptions): Promise<FilePickerResult> {
    if (this._disposed) {
      return {
        cancelled: true,
        files: [],
        rejected: [],
        error: createFilePickerError('NOT_SUPPORTED', 'File picker has been disposed'),
      };
    }

    // Check camera permission
    const permissions = await checkPermissions();
    if (permissions.camera !== 'granted') {
      const requested = await requestPermissions();
      if (requested.camera !== 'granted') {
        return {
          cancelled: false,
          files: [],
          rejected: [],
          error: createFilePickerError('PERMISSION_DENIED', 'Camera permission denied'),
        };
      }
    }

    this._updateState('picking');

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.capture = options?.useFrontCamera ? 'user' : 'environment';
      input.accept = options?.mediaType === 'video' ? 'video/*' : 'image/*';

      const handleChange = async () => {
        cleanup();
        this._updateState('processing');

        try {
          const files = Array.from(input.files || []);

          if (files.length === 0) {
            this._updateState('idle');
            resolve({ cancelled: true, files: [], rejected: [] });
            return;
          }

          const pickedFiles = await this._processFiles(files);
          const filesWithDimensions = await this._addImageDimensions(pickedFiles);

          this._updateState('idle');
          resolve({
            cancelled: false,
            files: filesWithDimensions,
            rejected: [],
          });
        } catch (error) {
          this._updateState('error', createFilePickerError('UNKNOWN', 'Failed to capture', error as Error));
          resolve({
            cancelled: false,
            files: [],
            rejected: [],
            error: this._status.error,
          });
        }
      };

      const handleCancel = () => {
        cleanup();
        this._updateState('idle');
        resolve({ cancelled: true, files: [], rejected: [] });
      };

      const cleanup = () => {
        input.removeEventListener('change', handleChange);
        input.removeEventListener('cancel', handleCancel);
      };

      input.addEventListener('change', handleChange);
      input.addEventListener('cancel', handleCancel);

      input.click();
    });
  }

  validateFiles(files: File[] | PickedFile[], config?: Partial<FilePickerConfig>): ValidationResult {
    const finalConfig = { ...this._defaultConfig, ...config };
    return validateFilesUtil(files, finalConfig);
  }

  onStateChange(callback: (status: FilePickerStatus) => void): () => void {
    return this._events.on('stateChange', callback);
  }

  dispose(): void {
    this._disposed = true;
    this._events.removeAllListeners();
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private _updateState(state: FilePickerState, error?: ReturnType<typeof createFilePickerError>): void {
    this._status = {
      ...this._status,
      state,
      error,
    };
    this._events.emit('stateChange', this._status);
  }

  private async _processFiles(files: File[], config?: Partial<FilePickerConfig>): Promise<PickedFile[]> {
    const pickedFiles: PickedFile[] = [];

    for (const file of files) {
      const uri = URL.createObjectURL(file);
      const extension = getFileExtension(file.name);

      const pickedFile: PickedFile = {
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        uri,
        extension,
        lastModified: file.lastModified,
        getArrayBuffer: () => file.arrayBuffer(),
        getData: () => Promise.resolve(file),
      };

      pickedFiles.push(pickedFile);
    }

    return pickedFiles;
  }

  private async _addImageDimensions(files: PickedFile[]): Promise<PickedFile[]> {
    const filesWithDimensions: PickedFile[] = [];

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          const dimensions = await this._getImageDimensions(file.uri);
          filesWithDimensions.push({
            ...file,
            dimensions,
          });
        } catch {
          // If we can't get dimensions, just use the file as-is
          filesWithDimensions.push(file);
        }
      } else if (file.type.startsWith('video/')) {
        try {
          const { dimensions, duration } = await this._getVideoDimensions(file.uri);
          filesWithDimensions.push({
            ...file,
            dimensions,
            duration,
          });
        } catch {
          filesWithDimensions.push(file);
        }
      } else {
        filesWithDimensions.push(file);
      }
    }

    return filesWithDimensions;
  }

  private _getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = uri;
    });
  }

  private _getVideoDimensions(uri: string): Promise<{ dimensions: { width: number; height: number }; duration: number }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');

      video.onloadedmetadata = () => {
        resolve({
          dimensions: { width: video.videoWidth, height: video.videoHeight },
          duration: Math.round(video.duration * 1000), // Convert to milliseconds
        });
        URL.revokeObjectURL(uri); // Clean up
      };

      video.onerror = () => {
        reject(new Error('Failed to load video'));
      };

      video.src = uri;
    });
  }
}

/**
 * Create a new WebFilePicker instance.
 */
export function createFilePicker(config?: Partial<FilePickerConfig>): IFilePicker {
  return new WebFilePicker(config);
}
