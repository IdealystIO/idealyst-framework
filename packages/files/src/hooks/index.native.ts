import { createUseFilePickerHook } from './createUseFilePickerHook';
import { createUseFileUploadHook } from './createUseFileUploadHook';
import { createFilePicker } from '../picker/FilePicker.native';
import { createFileUploader } from '../uploader/FileUploader.native';

// Export hook factories
export { createUseFilePickerHook } from './createUseFilePickerHook';
export { createUseFileUploadHook } from './createUseFileUploadHook';

// Create and export hooks with native-specific factories
export const useFilePicker = createUseFilePickerHook(createFilePicker);
export const useFileUpload = createUseFileUploadHook(createFileUploader);
