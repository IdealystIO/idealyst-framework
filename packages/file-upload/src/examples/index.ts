/**
 * File Upload Examples
 *
 * This file demonstrates common usage patterns for @idealyst/file-upload.
 */

export const basicUploadExample = `
import { useFilePicker, useFileUpload, FilePickerButton, UploadProgress } from '@idealyst/file-upload';
import { View } from 'react-native';

function BasicUploadExample() {
  const { addFiles, uploads, isUploading } = useFileUpload({
    autoStart: true,
  });

  const handlePick = (result) => {
    if (!result.cancelled) {
      addFiles(result.files, {
        url: 'https://api.example.com/upload',
        fieldName: 'file',
      });
    }
  };

  return (
    <View>
      <FilePickerButton
        pickerConfig={{ allowedTypes: ['image'], multiple: true }}
        onPick={handlePick}
      >
        Select Images
      </FilePickerButton>

      {uploads.map(upload => (
        <UploadProgress
          key={upload.id}
          upload={upload}
          showSpeed
          showETA
        />
      ))}
    </View>
  );
}
`;

export const dropZoneExample = `
import { DropZone, useFileUpload } from '@idealyst/file-upload';
import { View, Text } from 'react-native';

function DropZoneExample() {
  const { addFiles, uploads } = useFileUpload({ autoStart: true });

  const handleDrop = (files) => {
    addFiles(files, {
      url: 'https://api.example.com/upload',
    });
  };

  return (
    <View>
      <DropZone
        config={{ allowedTypes: ['document'], multiple: true, maxFiles: 10 }}
        onDrop={handleDrop}
        onReject={(rejected) => console.log('Rejected:', rejected)}
      >
        {(state) => (
          <View>
            <Text>
              {state.isDragActive ? 'Drop files here!' : 'Drag & drop files'}
            </Text>
            <Text>Supports PDF, Word, Excel</Text>
          </View>
        )}
      </DropZone>
    </View>
  );
}
`;

export const chunkedUploadExample = `
import { useFilePicker, useFileUpload, UPLOAD_PRESETS } from '@idealyst/file-upload';
import { View, Button } from 'react-native';

function LargeFileUploadExample() {
  const { pick } = useFilePicker({
    config: { allowedTypes: ['video'], maxFileSize: 500 * 1024 * 1024 }, // 500MB
  });

  const { addFiles, uploads, queueStatus } = useFileUpload();

  const handleUpload = async () => {
    const result = await pick();
    if (!result.cancelled) {
      addFiles(result.files, {
        url: 'https://api.example.com/upload/chunked',
        ...UPLOAD_PRESETS.largeFile, // Enables chunked upload
      });
    }
  };

  return (
    <View>
      <Button title="Upload Large Video" onPress={handleUpload} />
      <Text>Progress: {queueStatus.overallProgress.toFixed(1)}%</Text>
      {uploads.map(upload => (
        <Text key={upload.id}>
          {upload.file.name}: Chunk {upload.currentChunk}/{upload.totalChunks}
        </Text>
      ))}
    </View>
  );
}
`;

export const backgroundUploadExample = `
import { useFilePicker, useFileUpload, UPLOAD_PRESETS } from '@idealyst/file-upload';
import { View, Button, Text } from 'react-native';

function BackgroundUploadExample() {
  const { pick } = useFilePicker();
  const { addFiles, queueStatus, uploads } = useFileUpload();

  const handleUpload = async () => {
    const result = await pick({ allowedTypes: ['any'], multiple: true });
    if (!result.cancelled) {
      addFiles(result.files, {
        url: 'https://api.example.com/upload',
        ...UPLOAD_PRESETS.background, // Enables background upload on native
      });
    }
  };

  return (
    <View>
      <Button title="Upload Files" onPress={handleUpload} />
      <Text>
        Uploading {queueStatus.uploading} of {queueStatus.total} files
      </Text>
      <Text>
        Uploads will continue even if you switch apps
      </Text>
    </View>
  );
}
`;

export const customValidationExample = `
import { useFilePicker, FILE_PICKER_PRESETS } from '@idealyst/file-upload';
import { View, Button, Text } from 'react-native';

function AvatarUploadExample() {
  const { pick, files, error } = useFilePicker({
    config: {
      ...FILE_PICKER_PRESETS.avatar,
      maxFileSize: 2 * 1024 * 1024, // 2MB max
      maxImageDimensions: { width: 512, height: 512 },
    },
  });

  const handleSelect = async () => {
    const result = await pick();
    if (result.rejected.length > 0) {
      // Handle validation errors
      result.rejected.forEach(r => {
        console.log(\`\${r.name}: \${r.message}\`);
      });
    }
  };

  return (
    <View>
      <Button title="Select Avatar" onPress={handleSelect} />
      {files[0] && (
        <Image source={{ uri: files[0].uri }} style={{ width: 100, height: 100 }} />
      )}
      {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
    </View>
  );
}
`;
