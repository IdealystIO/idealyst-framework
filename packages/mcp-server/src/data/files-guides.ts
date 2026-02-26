/**
 * Files Package Guides
 *
 * Comprehensive documentation for @idealyst/files.
 * File picking, upload, and management.
 */

export const filesGuides: Record<string, string> = {
  "idealyst://files/overview": `# @idealyst/files

Cross-platform file picking and upload package.

## Installation

\`\`\`bash
yarn add @idealyst/files
\`\`\`

## Platform Support

| Platform | Status |
|----------|--------|
| Web      | ✅ File API + Drag & Drop |
| iOS      | ✅ UIDocumentPicker + Photos |
| Android  | ✅ Storage Access Framework + MediaStore |

## Key Exports

\`\`\`typescript
import {
  useFilePicker,       // Hook for file picking
  useFileUpload,       // Hook for file upload queue
  FilePickerButton,    // Pre-built picker button component
  DropZone,            // Drag-and-drop zone component (web)
  UploadProgress,      // Upload progress display component
  FILE_PICKER_PRESETS, // Pre-configured picker configs
  UPLOAD_PRESETS,      // Pre-configured upload configs
} from '@idealyst/files';
\`\`\`

> **Common mistakes:**
> - **\`pick()\` returns \`FilePickerResult\`, NOT an array.** Access files via \`result.files\`: \`result.files.length\`, \`result.files[0].uri\`. Do NOT write \`result.length\` or \`result[0]\` — \`FilePickerResult\` is an object: \`{ cancelled: boolean, files: PickedFile[], rejected: RejectedFile[] }\`.
> - The method is \`pick()\`, NOT \`pickFiles()\`
> - \`pick()\` accepts overrides DIRECTLY: \`picker.pick({ allowedTypes: ['image'] })\` — NOT \`picker.pick({ config: { allowedTypes: ['image'] } })\`. The \`{ config: ... }\` wrapper is ONLY for \`useFilePicker()\` initialization.
> - \`FileType\` values are: \`'image' | 'video' | 'audio' | 'document' | 'archive' | 'any'\` — NOT \`'pdf'\` or \`'doc'\`
> - \`PickedFile\` has \`uri\`, \`name\`, \`size\`, \`type\`, \`extension\` — dimensions are in optional \`dimensions?: { width, height }\`, NOT top-level \`width\`/\`height\`

## Quick Start

\`\`\`tsx
import { View, Button, Text } from '@idealyst/components';
import { useFilePicker } from '@idealyst/files';

function FilePicker() {
  const picker = useFilePicker({ config: { allowedTypes: ['image'], multiple: true } });

  const handlePick = async () => {
    const result = await picker.pick();
    if (!result.cancelled) {
      console.log('Picked:', result.files.map(f => f.name));
    }
  };

  return (
    <View padding="md" gap="md">
      <Button onPress={handlePick}>Select Images</Button>
      {picker.files.map(file => (
        <Text key={file.id}>{file.name} ({Math.round(file.size / 1024)}KB)</Text>
      ))}
    </View>
  );
}
\`\`\`
`,

  "idealyst://files/api": `# @idealyst/files — API Reference

## Hooks

### useFilePicker(options?)

File picker hook.

\`\`\`typescript
interface UseFilePickerOptions {
  config?: Partial<FilePickerConfig>;   // Default picker configuration
  autoRequestPermission?: boolean;      // Auto-request permission on mount
}
\`\`\`

**Returns \`UseFilePickerResult\`:**

| Property | Type | Description |
|----------|------|-------------|
| status | FilePickerStatus | Current picker status |
| isPicking | boolean | Whether picker is open |
| permission | PermissionResult \\| null | Permission result |
| error | FilePickerError \\| null | Current error |
| files | PickedFile[] | Last picked files |
| pick | (overrides?: Partial\\<FilePickerConfig\\>) => Promise<FilePickerResult> | **Open file picker. Overrides go DIRECTLY — NOT wrapped in \`{ config }\`.** Example: \`picker.pick({ allowedTypes: ['image'] })\` — NOT \`picker.pick({ config: { allowedTypes: ['image'] } })\` |
| captureFromCamera | (options?) => Promise<FilePickerResult> | Open camera to capture |
| clear | () => void | Clear picked files |
| checkPermission | () => Promise<PermissionResult> | Check permission |
| requestPermission | () => Promise<PermissionResult> | Request permission |
| validateFiles | (files) => ValidationResult | Validate files against config |
| pickerRef | RefObject<IFilePicker \\| null> | Picker instance ref |

---

### useFileUpload(options?)

File upload queue hook.

\`\`\`typescript
interface UseFileUploadOptions {
  config?: Partial<Omit<UploadConfig, 'url'>>;  // Default upload config (url set per-upload)
  autoStart?: boolean;                           // Auto-start uploads when added
  concurrency?: number;                          // Max concurrent uploads
}
\`\`\`

**Returns \`UseFileUploadResult\`:**

| Property | Type | Description |
|----------|------|-------------|
| queueStatus | QueueStatus | Queue status (total, pending, uploading, completed, failed) |
| uploads | UploadProgressInfo[] | All uploads as array |
| isUploading | boolean | Whether any upload is in progress |
| isPaused | boolean | Whether queue is paused |
| hasFailedUploads | boolean | Whether there are failed uploads |
| addFiles | (files, config: { url: string } & Partial\<UploadConfig\>) => string[] | Add files to queue. Only \`url\` is required — e.g., \`addFiles(files, { url: 'https://...' })\`. All other fields have defaults. |
| start | () => void | Start processing queue |
| pause | () => void | Pause all uploads |
| resume | () => void | Resume paused uploads |
| cancel | (uploadId) => void | Cancel specific upload |
| cancelAll | () => void | Cancel all uploads |
| retry | (uploadId) => void | Retry failed upload |
| retryAll | () => void | Retry all failed uploads |
| remove | (uploadId) => void | Remove upload from queue |
| clearCompleted | () => void | Clear completed uploads |
| getUpload | (uploadId) => UploadProgressInfo? | Get upload by ID |

---

## Components

### FilePickerButton

Pre-built button that opens file picker on press.

\`\`\`typescript
interface FilePickerButtonProps {
  children?: ReactNode;
  pickerConfig?: Partial<FilePickerConfig>;
  onPick?: (result: FilePickerResult) => void;
  onError?: (error: FilePickerError) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: Size;
  intent?: Intent;
  leftIcon?: string;  // Material Design Icon name
  style?: StyleProp<ViewStyle>;
}
\`\`\`

### DropZone

Drag-and-drop zone for file selection (web only, renders as pressable on native).

\`\`\`typescript
interface DropZoneProps {
  onDrop?: (files: PickedFile[]) => void;
  onReject?: (rejected: RejectedFile[]) => void;
  config?: Partial<FilePickerConfig>;
  children?: ReactNode | ((state: DropZoneState) => ReactNode);
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  activeStyle?: StyleProp<ViewStyle>;
  rejectStyle?: StyleProp<ViewStyle>;
}
\`\`\`

### UploadProgress

Displays upload progress for a single file.

\`\`\`typescript
interface UploadProgressProps {
  upload: UploadProgressInfo;
  showFileName?: boolean;
  showFileSize?: boolean;
  showSpeed?: boolean;
  showETA?: boolean;
  showCancel?: boolean;
  showRetry?: boolean;
  onCancel?: () => void;
  onRetry?: () => void;
  variant?: 'linear' | 'circular';
  size?: Size;
}
\`\`\`

---

## Types

### FileType

\`\`\`typescript
type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'any';
\`\`\`

> **NOT** \`'pdf'\`, \`'doc'\`, \`'xlsx'\`, etc. Use \`customMimeTypes\` or \`customExtensions\` for specific formats.

### PickedFile

\`\`\`typescript
interface PickedFile {
  id: string;                                   // Unique identifier
  name: string;                                 // Original file name
  size: number;                                 // File size in bytes
  type: string;                                 // MIME type
  uri: string;                                  // File URI
  extension: string;                            // Extension without dot
  lastModified?: number;                        // Last modified timestamp
  dimensions?: { width: number; height: number };  // Image/video dimensions (optional)
  duration?: number;                            // Audio/video duration in ms (optional)
  thumbnailUri?: string;                        // Thumbnail URI (native only)
  getArrayBuffer(): Promise<ArrayBufferLike>;
  getData(): Promise<Blob | string>;
}
\`\`\`

> **Note:** \`dimensions\` is an optional nested object — NOT top-level \`width\`/\`height\` properties.

### FilePickerResult (returned by pick())

\`\`\`typescript
interface FilePickerResult {
  cancelled: boolean;        // Whether user cancelled the picker
  files: PickedFile[];       // Picked files (empty if cancelled)
  rejected: RejectedFile[];  // Files rejected by validation
  error?: FilePickerError;   // Error if picker failed
}
\`\`\`

> **CRITICAL:** \`pick()\` returns \`FilePickerResult\`, NOT an array. Always access \`result.files\` to get the array of picked files:
> \`\`\`typescript
> const result = await picker.pick();
> if (!result.cancelled && result.files.length > 0) {
>   const file = result.files[0]; // ✅ Correct
>   console.log(file.uri, file.name);
> }
> // ❌ WRONG: result.length, result[0] — FilePickerResult is NOT an array
> \`\`\`

### FilePickerConfig

\`\`\`typescript
interface FilePickerConfig {
  allowedTypes: FileType[];       // Default: ['any']
  customMimeTypes?: string[];     // Custom MIME types (overrides allowedTypes)
  customExtensions?: string[];    // Custom extensions (e.g., ['.json', '.csv'])
  multiple: boolean;              // Allow multiple selection (default: false)
  maxFiles?: number;              // Max files when multiple
  maxFileSize?: number;           // Max file size in bytes
  maxTotalSize?: number;          // Max total size for all files
  allowCamera?: boolean;          // Allow camera capture (native, default: true)
  allowLibrary?: boolean;         // Allow photo library (native, default: true)
  imageQuality?: number;          // Camera image quality 0-100 (default: 80)
  maxImageDimensions?: { width: number; height: number };
  includeThumbnails?: boolean;    // Include thumbnails (default: false)
}
\`\`\`

### UploadConfig

\`\`\`typescript
// Only 'url' is required — all other fields have sensible defaults
interface UploadConfig {
  url: string;                                   // Target URL (REQUIRED)
  method?: 'POST' | 'PUT' | 'PATCH';            // Default: 'POST'
  headers?: Record<string, string>;
  fieldName?: string;                            // Form field name (default: 'file')
  formData?: Record<string, string | number | boolean>;
  multipart?: boolean;                           // Default: true
  concurrency?: number;                          // Concurrent uploads (default: 3)
  timeout?: number;                              // Request timeout ms (default: 30000)
  retryEnabled?: boolean;                        // Default: true
  maxRetries?: number;                           // Default: 3
  retryDelay?: 'fixed' | 'exponential';          // Default: 'exponential'
  retryDelayMs?: number;                         // Default: 1000
  chunkedUpload?: boolean;                       // Default: false
  chunkSize?: number;                            // Default: 10MB
  chunkedUploadThreshold?: number;               // Default: 50MB
  backgroundUpload?: boolean;                    // Native only (default: false)
}
\`\`\`

### UploadProgressInfo

\`\`\`typescript
interface UploadProgressInfo {
  id: string;              // Upload ID
  file: PickedFile;        // The file being uploaded
  state: UploadState;      // 'pending' | 'uploading' | 'paused' | 'completed' | 'failed' | 'cancelled'
  bytesUploaded: number;   // Bytes uploaded so far
  bytesTotal: number;      // Total bytes to upload
  percentage: number;      // Progress 0-100
  speed: number;           // Upload speed in bytes/sec
  estimatedTimeRemaining: number;  // ETA in ms (NOT 'eta')
  retryCount: number;      // Number of retry attempts
  error?: UploadError;     // Error if state is 'failed'
  config: UploadConfig;    // Upload configuration used
}
\`\`\`

> **IMPORTANT:** The property is \`state\` (NOT \`status\`) and \`percentage\` (NOT \`progress\`).

### FilePickerResult

\`\`\`typescript
interface FilePickerResult {
  cancelled: boolean;
  files: PickedFile[];
  rejected: RejectedFile[];
  error?: FilePickerError;
}
\`\`\`

### Presets

\`\`\`typescript
// FILE_PICKER_PRESETS
const presets = {
  avatar:    { allowedTypes: ['image'], multiple: false, maxFileSize: 5MB, ... },
  document:  { allowedTypes: ['document'], multiple: false, ... },
  documents: { allowedTypes: ['document'], multiple: true, ... },
  image:     { allowedTypes: ['image'], multiple: false, ... },
  images:    { allowedTypes: ['image'], multiple: true, ... },
  video:     { allowedTypes: ['video'], multiple: false, ... },
  files:     { allowedTypes: ['any'], multiple: true, ... },
};

// UPLOAD_PRESETS
const uploadPresets = {
  simple:     { concurrency: 1, ... },
  largeFile:  { chunkedUpload: true, ... },
  background: { backgroundUpload: true, ... },
  reliable:   { retryEnabled: true, maxRetries: 5, ... },
};
\`\`\`
`,

  "idealyst://files/examples": `# @idealyst/files — Examples

## Basic File Picker

\`\`\`tsx
import React from 'react';
import { View, Button, Text, List } from '@idealyst/components';
import { useFilePicker } from '@idealyst/files';

function DocumentPicker() {
  const picker = useFilePicker({
    config: { allowedTypes: ['document'], multiple: true, maxFiles: 5 },
  });

  const handlePick = async () => {
    const result = await picker.pick();
    if (!result.cancelled) {
      console.log('Selected:', result.files.length, 'files');
    }
  };

  return (
    <View padding="md" gap="md">
      <Button onPress={handlePick} leftIcon="file-document-outline">
        Select Documents
      </Button>
      <List>
        {picker.files.map(file => (
          <View key={file.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }} padding="sm">
            <Text>{file.name}</Text>
            <Text typography="caption" color="secondary">{Math.round(file.size / 1024)}KB</Text>
          </View>
        ))}
      </List>
    </View>
  );
}
\`\`\`

## Image Picker with Preview

\`\`\`tsx
import React from 'react';
import { View, Button, Image, Text } from '@idealyst/components';
import { useFilePicker, FILE_PICKER_PRESETS } from '@idealyst/files';

function ImagePicker() {
  const picker = useFilePicker({ config: FILE_PICKER_PRESETS.images });

  return (
    <View padding="md" gap="md">
      <Button onPress={() => picker.pick()} leftIcon="image-multiple">
        Select Images
      </Button>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} gap="sm">
        {picker.files.map(file => (
          <Image
            key={file.id}
            source={file.uri}
            style={{ width: 100, height: 100, borderRadius: 8 }}
            objectFit="cover"
          />
        ))}
      </View>
    </View>
  );
}
\`\`\`

## File Upload with UploadProgress (Recommended)

Use the pre-built \`UploadProgress\` component for the best experience:

\`\`\`tsx
import React from 'react';
import { View, Button, Text, Badge } from '@idealyst/components';
import { useFilePicker, useFileUpload, UploadProgress } from '@idealyst/files';

function FileUploadScreen() {
  const picker = useFilePicker({ config: { allowedTypes: ['any'], multiple: true } });
  const uploader = useFileUpload({ concurrency: 2 });

  const handlePickAndUpload = async () => {
    const result = await picker.pick();
    if (!result.cancelled && result.files.length > 0) {
      uploader.addFiles(result.files, { url: 'https://api.example.com/upload' });
      uploader.start();
    }
  };

  return (
    <View padding="md" gap="md">
      <Button onPress={handlePickAndUpload} leftIcon="upload">
        Pick & Upload
      </Button>

      {/* Queue summary */}
      {uploader.uploads.length > 0 && (
        <View style={{ flexDirection: 'row' }} gap="sm">
          <Badge intent="success" type="filled">{uploader.queueStatus.completed} done</Badge>
          <Badge intent="info" type="filled">{uploader.queueStatus.uploading} uploading</Badge>
          <Badge intent="neutral" type="filled">{uploader.queueStatus.pending} pending</Badge>
        </View>
      )}

      {/* Per-file progress — use the pre-built UploadProgress component */}
      {uploader.uploads.map(upload => (
        <UploadProgress
          key={upload.id}
          upload={upload}
          showFileName
          showFileSize
          showSpeed
          showCancel={upload.state === 'uploading'}
          showRetry={upload.state === 'failed'}
          onCancel={() => uploader.cancel(upload.id)}
          onRetry={() => uploader.retry(upload.id)}
        />
      ))}
    </View>
  );
}
\`\`\`

## Manual Upload Progress (Custom UI)

If you need custom upload UI, use the \`upload.state\` and \`upload.percentage\` properties:

\`\`\`tsx
import React from 'react';
import { View, Button, Text, Progress } from '@idealyst/components';
import { useFilePicker, useFileUpload } from '@idealyst/files';

function CustomUploadUI() {
  const picker = useFilePicker({ config: { allowedTypes: ['any'], multiple: true } });
  const uploader = useFileUpload({ autoStart: true, concurrency: 2 });

  const handlePick = async () => {
    const result = await picker.pick();
    if (!result.cancelled && result.files.length > 0) {
      uploader.addFiles(result.files, { url: 'https://api.example.com/upload' });
    }
  };

  return (
    <View padding="md" gap="md">
      <Button onPress={handlePick} leftIcon="upload">Pick & Upload</Button>
      {uploader.uploads.map(upload => (
        <View key={upload.id} gap="xs">
          <Text typography="body2" weight="medium">{upload.file.name}</Text>
          <Progress
            type="linear"
            value={upload.percentage}
            intent={upload.state === 'completed' ? 'success' : upload.state === 'failed' ? 'danger' : 'info'}
          />
          <Text typography="caption" color="secondary">
            {upload.state} — {upload.percentage}%
          </Text>
        </View>
      ))}
    </View>
  );
}
\`\`\`

## Custom MIME Types

\`\`\`tsx
// Pick specific file types using customMimeTypes
const picker = useFilePicker({
  config: {
    allowedTypes: ['document'],        // Base category
    customMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
    ],
    customExtensions: ['.pdf', '.docx', '.csv'],
  },
});
\`\`\`

## Drop Zone (Web)

\`\`\`tsx
import React from 'react';
import { View, Text } from '@idealyst/components';
import { DropZone } from '@idealyst/files';

function FileDropArea() {
  return (
    <DropZone
      config={{ allowedTypes: ['image'], maxFileSize: 10 * 1024 * 1024 }}
      onDrop={(files) => console.log('Dropped:', files)}
      onReject={(rejected) => console.log('Rejected:', rejected)}
    >
      {(state) => (
        <View
          padding="xl"
          style={{ alignItems: 'center' }}
          border={state.isDragActive ? 'thick' : 'thin'}
        >
          <Text>{state.isDragActive ? 'Drop files here' : 'Drag files here or click to browse'}</Text>
        </View>
      )}
    </DropZone>
  );
}
\`\`\`

## Pre-built FilePickerButton

\`\`\`tsx
import React from 'react';
import { FilePickerButton } from '@idealyst/files';

function SimpleUpload() {
  return (
    <FilePickerButton
      pickerConfig={{ allowedTypes: ['image'], multiple: false }}
      onPick={(result) => {
        if (!result.cancelled) {
          console.log('File:', result.files[0]?.name);
        }
      }}
      onError={(error) => console.error('Picker error:', error)}
      intent="primary"
      leftIcon="image"
    >
      Upload Photo
    </FilePickerButton>
  );
}
\`\`\`
`,
};
