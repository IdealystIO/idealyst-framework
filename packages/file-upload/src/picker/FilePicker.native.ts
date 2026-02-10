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
  FileType,
} from '../types';
import {
  DEFAULT_FILE_PICKER_CONFIG,
  INITIAL_FILE_PICKER_STATUS,
  DOCUMENT_PICKER_TYPES,
} from '../constants';
import {
  generateId,
  validateFiles as validateFilesUtil,
  createFilePickerError,
  EventEmitter,
  getFileExtension,
} from '../utils';
import { checkPermissions, requestPermissions } from '../permissions/permissions.native';

// Lazy load native modules
let DocumentPicker: typeof import('react-native-document-picker') | null = null;
let ImagePicker: typeof import('react-native-image-picker') | null = null;

async function getDocumentPicker() {
  if (!DocumentPicker) {
    DocumentPicker = await import('react-native-document-picker');
  }
  return DocumentPicker;
}

async function getImagePicker() {
  if (!ImagePicker) {
    ImagePicker = await import('react-native-image-picker');
  }
  return ImagePicker;
}

type FilePickerEvents = {
  stateChange: [FilePickerStatus];
};

/**
 * Native implementation of IFilePicker using react-native-document-picker and react-native-image-picker.
 */
export class NativeFilePicker implements IFilePicker {
  private _status: FilePickerStatus = { ...INITIAL_FILE_PICKER_STATUS };
  private _events = new EventEmitter<FilePickerEvents>();
  private _defaultConfig: FilePickerConfig;
  private _disposed = false;

  constructor(config?: Partial<FilePickerConfig>) {
    this._defaultConfig = { ...DEFAULT_FILE_PICKER_CONFIG, ...config };
  }

  get status(): FilePickerStatus {
    return { ...this._status };
  }

  async checkPermission(): Promise<PermissionStatus> {
    const result = await checkPermissions();
    this._status.permission = result.photoLibrary;
    return result.photoLibrary;
  }

  async requestPermission(): Promise<PermissionStatus> {
    const result = await requestPermissions();
    this._status.permission = result.photoLibrary;
    return result.photoLibrary;
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

    try {
      // Determine if we should use image picker or document picker
      if (this._isMediaOnly(finalConfig.allowedTypes)) {
        return await this._pickMedia(finalConfig);
      } else {
        return await this._pickDocuments(finalConfig);
      }
    } catch (error) {
      this._updateState('error', createFilePickerError('UNKNOWN', 'Failed to pick files', error as Error));
      return {
        cancelled: false,
        files: [],
        rejected: [],
        error: this._status.error,
      };
    }
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

    this._updateState('picking');

    try {
      const imagePicker = await getImagePicker();

      const result = await imagePicker.launchCamera({
        mediaType: this._mapMediaType(options?.mediaType || 'photo'),
        quality: (options?.quality || 80) / 100,
        durationLimit: options?.maxDuration,
        saveToPhotos: options?.saveToLibrary ?? true,
        cameraType: options?.useFrontCamera ? 'front' : 'back',
        includeBase64: false,
        includeExtra: true,
      });

      if (result.didCancel) {
        this._updateState('idle');
        return { cancelled: true, files: [], rejected: [] };
      }

      if (result.errorCode) {
        this._updateState('idle');
        return {
          cancelled: false,
          files: [],
          rejected: [],
          error: this._mapImagePickerError(result.errorCode, result.errorMessage),
        };
      }

      this._updateState('processing');
      const files = await this._transformImagePickerResponse(result);

      this._updateState('idle');
      return {
        cancelled: false,
        files,
        rejected: [],
      };
    } catch (error) {
      this._updateState('error', createFilePickerError('UNKNOWN', 'Failed to capture', error as Error));
      return {
        cancelled: false,
        files: [],
        rejected: [],
        error: this._status.error,
      };
    }
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

  private _isMediaOnly(types: FileType[]): boolean {
    const mediaTypes: FileType[] = ['image', 'video'];
    return types.every(t => mediaTypes.includes(t));
  }

  private async _pickMedia(config: FilePickerConfig): Promise<FilePickerResult> {
    const imagePicker = await getImagePicker();

    const mediaType = this._getMediaTypeFromConfig(config);

    const result = await imagePicker.launchImageLibrary({
      mediaType,
      selectionLimit: config.multiple ? (config.maxFiles || 0) : 1,
      quality: (config.imageQuality || 80) / 100,
      includeBase64: false,
      includeExtra: true,
    });

    if (result.didCancel) {
      this._updateState('idle');
      return { cancelled: true, files: [], rejected: [] };
    }

    if (result.errorCode) {
      this._updateState('idle');
      return {
        cancelled: false,
        files: [],
        rejected: [],
        error: this._mapImagePickerError(result.errorCode, result.errorMessage),
      };
    }

    this._updateState('processing');
    const files = await this._transformImagePickerResponse(result, config);
    const { accepted, rejected } = validateFilesUtil(files, config);

    this._updateState('idle');
    return {
      cancelled: false,
      files: accepted,
      rejected,
    };
  }

  private async _pickDocuments(config: FilePickerConfig): Promise<FilePickerResult> {
    const docPicker = await getDocumentPicker();

    const types = this._buildDocumentPickerTypes(config);

    try {
      const results = await docPicker.default.pick({
        type: types,
        allowMultiSelection: config.multiple,
        copyTo: 'cachesDirectory',
      });

      this._updateState('processing');
      const files = await this._transformDocumentPickerResponse(results, config);
      const { accepted, rejected } = validateFilesUtil(files, config);

      this._updateState('idle');
      return {
        cancelled: false,
        files: accepted,
        rejected,
      };
    } catch (error) {
      const dp = await getDocumentPicker();
      if (dp.default.isCancel(error)) {
        this._updateState('idle');
        return { cancelled: true, files: [], rejected: [] };
      }

      throw error;
    }
  }

  private _getMediaTypeFromConfig(config: FilePickerConfig): 'photo' | 'video' | 'mixed' {
    const hasImage = config.allowedTypes.includes('image');
    const hasVideo = config.allowedTypes.includes('video');

    if (hasImage && hasVideo) return 'mixed';
    if (hasVideo) return 'video';
    return 'photo';
  }

  private _mapMediaType(type: string): 'photo' | 'video' | 'mixed' {
    switch (type) {
      case 'video':
        return 'video';
      case 'mixed':
        return 'mixed';
      default:
        return 'photo';
    }
  }

  private _buildDocumentPickerTypes(config: FilePickerConfig): string[] {
    const types = new Set<string>();

    for (const fileType of config.allowedTypes) {
      const docTypes = DOCUMENT_PICKER_TYPES[fileType] || [];
      for (const t of docTypes) {
        types.add(t);
      }
    }

    return Array.from(types);
  }

  private async _transformImagePickerResponse(
    response: import('react-native-image-picker').ImagePickerResponse,
    config?: FilePickerConfig
  ): Promise<PickedFile[]> {
    const files: PickedFile[] = [];

    for (const asset of response.assets || []) {
      if (!asset.uri) continue;

      const file: PickedFile = {
        id: generateId(),
        name: asset.fileName || `file_${Date.now()}`,
        size: asset.fileSize || 0,
        type: asset.type || 'application/octet-stream',
        uri: asset.uri,
        extension: getFileExtension(asset.fileName || ''),
        lastModified: asset.timestamp ? new Date(asset.timestamp).getTime() : undefined,
        dimensions: asset.width && asset.height ? { width: asset.width, height: asset.height } : undefined,
        duration: asset.duration ? Math.round(asset.duration * 1000) : undefined,
        getArrayBuffer: () => this._readFileAsArrayBuffer(asset.uri!),
        getData: () => this._readFileAsBase64(asset.uri!),
      };

      files.push(file);
    }

    return files;
  }

  private async _transformDocumentPickerResponse(
    results: import('react-native-document-picker').DocumentPickerResponse[],
    config?: FilePickerConfig
  ): Promise<PickedFile[]> {
    const files: PickedFile[] = [];

    for (const doc of results) {
      const file: PickedFile = {
        id: generateId(),
        name: doc.name || `file_${Date.now()}`,
        size: doc.size || 0,
        type: doc.type || 'application/octet-stream',
        uri: doc.fileCopyUri || doc.uri,
        extension: getFileExtension(doc.name || ''),
        getArrayBuffer: () => this._readFileAsArrayBuffer(doc.fileCopyUri || doc.uri),
        getData: () => this._readFileAsBase64(doc.fileCopyUri || doc.uri),
      };

      files.push(file);
    }

    return files;
  }

  private _mapImagePickerError(errorCode: string, errorMessage?: string): ReturnType<typeof createFilePickerError> {
    switch (errorCode) {
      case 'permission':
        return createFilePickerError('PERMISSION_DENIED', errorMessage || 'Permission denied');
      case 'camera_unavailable':
        return createFilePickerError('NOT_SUPPORTED', 'Camera is not available');
      default:
        return createFilePickerError('UNKNOWN', errorMessage || 'Unknown error');
    }
  }

  private async _readFileAsArrayBuffer(uri: string): Promise<ArrayBuffer> {
    // Use react-native-blob-util for file reading
    try {
      const BlobUtil = await import('react-native-blob-util');
      const base64 = await BlobUtil.default.fs.readFile(uri.replace('file://', ''), 'base64');
      return this._base64ToArrayBuffer(base64);
    } catch {
      // Fallback: return empty buffer if reading fails
      return new ArrayBuffer(0);
    }
  }

  private async _readFileAsBase64(uri: string): Promise<string> {
    try {
      const BlobUtil = await import('react-native-blob-util');
      return await BlobUtil.default.fs.readFile(uri.replace('file://', ''), 'base64');
    } catch {
      return '';
    }
  }

  private _base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

/**
 * Create a new NativeFilePicker instance.
 */
export function createFilePicker(config?: Partial<FilePickerConfig>): IFilePicker {
  return new NativeFilePicker(config);
}
