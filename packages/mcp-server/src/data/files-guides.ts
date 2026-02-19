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
> - The method is \`pick()\`, NOT \`pickFiles()\`
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
| pick | (config?) => Promise<FilePickerResult> | **Open file picker** |
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
| addFiles | (files, config) => string[] | Add files to upload queue |
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
interface UploadConfig {
  url: string;                                   // Target URL
  method: 'POST' | 'PUT' | 'PATCH';            // Default: 'POST'
  headers?: Record<string, string>;
  fieldName: string;                             // Form field name (default: 'file')
  formData?: Record<string, string | number | boolean>;
  multipart: boolean;                            // Default: true
  concurrency: number;                           // Concurrent uploads (default: 3)
  timeout: number;                               // Request timeout ms (default: 30000)
  retryEnabled: boolean;                         // Default: true
  maxRetries: number;                            // Default: 3
  retryDelay: 'fixed' | 'exponential';
  retryDelayMs: number;                          // Default: 1000
  chunkedUpload: boolean;                        // Default: false
  chunkSize: number;                             // Default: 10MB
  chunkedUploadThreshold: number;                // Default: 50MB
  backgroundUpload: boolean;                     // Native only (default: false)
}
\`\`\`

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

## File Upload with Progress

\`\`\`tsx
import React from 'react';
import { View, Button, Text, Progress } from '@idealyst/components';
import { useFilePicker, useFileUpload } from '@idealyst/files';

function FileUploadScreen() {
  const picker = useFilePicker({ config: { allowedTypes: ['any'], multiple: true } });
  const uploader = useFileUpload({ autoStart: true, concurrency: 2 });

  const handlePickAndUpload = async () => {
    const result = await picker.pick();
    if (!result.cancelled && result.files.length > 0) {
      uploader.addFiles(result.files, {
        url: 'https://api.example.com/upload',
        method: 'POST',
        fieldName: 'file',
        multipart: true,
        concurrency: 2,
        timeout: 30000,
        retryEnabled: true,
        maxRetries: 3,
        retryDelay: 'exponential',
        retryDelayMs: 1000,
        chunkedUpload: false,
        chunkSize: 10 * 1024 * 1024,
        chunkedUploadThreshold: 50 * 1024 * 1024,
        backgroundUpload: false,
      });
    }
  };

  return (
    <View padding="md" gap="md">
      <Button onPress={handlePickAndUpload} leftIcon="upload">
        Pick & Upload
      </Button>
      {uploader.uploads.map(upload => (
        <View key={upload.id} gap="xs">
          <Text>{upload.file.name}</Text>
          <Progress value={upload.percentage} />
          <Text typography="caption">{upload.state} — {upload.percentage}%</Text>
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
