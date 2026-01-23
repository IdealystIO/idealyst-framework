/**
 * Media Recipes - Image upload, camera, and media handling
 */

import { Recipe } from "./types.js";

export const mediaRecipes: Record<string, Recipe> = {
  "image-upload": {
    name: "Image Upload",
    description: "Image picker with preview and upload progress",
    category: "media",
    difficulty: "intermediate",
    packages: ["@idealyst/components", "@idealyst/camera"],
    code: `import React, { useState } from 'react';
import { View, Text, Button, Image, Pressable, Icon, Progress } from '@idealyst/components';
import { useCamera, useImagePicker } from '@idealyst/camera';

interface UploadedImage {
  uri: string;
  width: number;
  height: number;
}

export function ImageUpload({ onUpload }: { onUpload: (image: UploadedImage) => Promise<string> }) {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { pickImage } = useImagePicker();
  const { takePhoto } = useCamera();

  const handlePickImage = async () => {
    const result = await pickImage({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result) {
      setImage(result);
    }
  };

  const handleTakePhoto = async () => {
    const result = await takePhoto({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result) {
      setImage(result);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const url = await onUpload(image);

      clearInterval(interval);
      setUploadProgress(100);

      // Reset after success
      setTimeout(() => {
        setImage(null);
        setUploadProgress(0);
      }, 1000);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={{ gap: 16 }}>
      {image ? (
        <View style={{ alignItems: 'center' }}>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: image.uri }}
              style={{ width: 200, height: 200, borderRadius: 8 }}
            />
            <Pressable
              onPress={() => setImage(null)}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: '#ef4444',
                borderRadius: 12,
                padding: 4,
              }}
            >
              <Icon name="close" size={16} color="#fff" />
            </Pressable>
          </View>

          {isUploading && (
            <Progress value={uploadProgress} style={{ width: 200, marginTop: 12 }} />
          )}

          <Button
            onPress={handleUpload}
            disabled={isUploading}
            loading={isUploading}
            style={{ marginTop: 16 }}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          <Pressable
            onPress={handlePickImage}
            style={{
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 32,
              alignItems: 'center',
            }}
          >
            <Icon name="image-plus" size={48} color="#999" />
            <Text style={{ marginTop: 8, color: '#666' }}>
              Tap to select an image
            </Text>
          </Pressable>

          <Button type="outlined" onPress={handleTakePhoto} leftIcon="camera">
            Take Photo
          </Button>
        </View>
      )}
    </View>
  );
}`,
    explanation: `Image upload with:
- Image picker from gallery
- Camera capture option
- Image preview with remove button
- Upload progress indicator
- Aspect ratio cropping`,
    tips: [
      "Compress images before upload to reduce bandwidth",
      "Add file size validation",
      "Support multiple image selection",
      "Consider image caching for better performance",
    ],
    relatedRecipes: ["profile-screen", "form-with-validation"],
  },
};
