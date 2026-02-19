/**
 * Media Recipes - Image upload, camera, and media handling
 */

import { Recipe } from "./types.js";

export const mediaRecipes: Record<string, Recipe> = {
  "image-upload": {
    name: "Image Upload",
    description: "Image picker with preview and upload progress using @idealyst/files",
    category: "media",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/files"],
    code: `import React from 'react';
import { View, Text, Button, Image, Pressable, Icon, Progress } from '@idealyst/components';
import type { IconName } from '@idealyst/components';
import { useFilePicker, useFileUpload, FILE_PICKER_PRESETS } from '@idealyst/files';

const closeIcon: IconName = 'close';
const imagePlusIcon: IconName = 'image-plus';

export function ImageUpload({ uploadUrl }: { uploadUrl: string }) {
  const picker = useFilePicker({ config: FILE_PICKER_PRESETS.images });
  const uploader = useFileUpload({ autoStart: false, concurrency: 1 });

  const handlePickImages = async () => {
    const result = await picker.pick();
    if (!result.cancelled && result.files.length > 0) {
      // Images are now in picker.files
    }
  };

  const handleUpload = () => {
    if (picker.files.length === 0) return;
    uploader.addFiles(picker.files, {
      url: uploadUrl,
      method: 'POST',
      fieldName: 'file',
      multipart: true,
      concurrency: 1,
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
    uploader.start();
  };

  return (
    <View gap="md" padding="md">
      {picker.files.length > 0 ? (
        <View style={{ alignItems: 'center' }} gap="md">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} gap="sm">
            {picker.files.map((file) => (
              <View key={file.id} style={{ position: 'relative' }}>
                <Image
                  source={file.uri}
                  width={120}
                  height={120}
                  objectFit="cover"
                  borderRadius={8}
                />
                <Pressable
                  onPress={() => picker.clear()}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: '#ef4444',
                    borderRadius: 12,
                    padding: 4,
                  }}
                >
                  <Icon name={closeIcon} size="xs" />
                </Pressable>
              </View>
            ))}
          </View>

          {uploader.uploads.map((upload) => (
            <View key={upload.id} gap="xs" style={{ width: '100%' }}>
              <Text typography="caption">{upload.file.name}</Text>
              <Progress value={upload.percentage} />
              <Text typography="caption" color="secondary">
                {upload.state} — {upload.percentage}%
              </Text>
            </View>
          ))}

          <View style={{ flexDirection: 'row' }} gap="sm">
            <Button
              onPress={() => picker.clear()}
              type="outlined"
              intent="secondary"
            >
              Clear
            </Button>
            <Button
              onPress={handleUpload}
              disabled={uploader.isUploading}
              loading={uploader.isUploading}
              leftIcon="upload"
            >
              Upload
            </Button>
          </View>
        </View>
      ) : (
        <View gap="sm">
          <Pressable
            onPress={handlePickImages}
            style={{
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 32,
              alignItems: 'center',
            }}
          >
            <Icon name={imagePlusIcon} size="lg" />
            <Text typography="body2" color="secondary" style={{ marginTop: 8 }}>
              Tap to select images
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}`,
    explanation: `Image upload with @idealyst/files:
- useFilePicker with FILE_PICKER_PRESETS.images for image selection
- useFileUpload for upload queue with progress tracking
- Image previews using Image component with source prop
- Icon uses size="xs"/"sm"/"md"/"lg" — NOT numeric values
- Pressable for interactive areas (NOT View with onPress)`,
    tips: [
      "Use FILE_PICKER_PRESETS for common configs (images, documents, etc.)",
      "useFilePicker.pick() returns { cancelled, files, rejected }",
      "Image uses 'source' prop (string or { uri }) — NOT 'src'",
      "Image uses 'objectFit' — NOT 'contentFit'",
      "Icon size is always a Size string: 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    ],
    relatedRecipes: ["profile-screen", "form-with-validation"],
  },
};
