import { createUseFilePickerHook } from './createUseFilePickerHook';
import { createUseFileUploadHook } from './createUseFileUploadHook';
import { createFilePicker } from '../picker';
import { createFileUploader } from '../uploader';

// Export hook factories
export { createUseFilePickerHook } from './createUseFilePickerHook';
export { createUseFileUploadHook } from './createUseFileUploadHook';

// Create and export hooks with platform-specific factories
export const useFilePicker = createUseFilePickerHook(createFilePicker);
export const useFileUpload = createUseFileUploadHook(createFileUploader);
