import React, { useState, useCallback } from 'react';
import { Screen, Text, View, Button, Card } from '@idealyst/components';
import { useCamera } from '../hooks/index.web';
import { CameraPreview } from '../components/index.web';
import { CAMERA_PROFILES, formatDuration } from '../index';
import type { CameraConfig } from '../types';

/**
 * Profile selector for camera configurations
 */
const ProfileSelector = ({
  selectedProfile,
  onSelect,
}: {
  selectedProfile: string;
  onSelect: (profile: string) => void;
}) => {
  const profiles = [
    { key: 'standard', label: 'Standard', desc: 'Photo/video capture' },
    { key: 'selfie', label: 'Selfie', desc: 'Front camera with mirroring' },
    { key: 'scanning', label: 'Scanning', desc: 'Document/QR scanning' },
    { key: 'video', label: 'Video', desc: 'Video recording (4K)' },
    { key: 'minimal', label: 'Minimal', desc: 'Low bandwidth mode' },
  ];

  return (
    <View style={{ gap: 8 }}>
      <Text size="md" weight="semibold">
        Camera Profile
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {profiles.map((profile) => (
          <Button
            key={profile.key}
            variant={selectedProfile === profile.key ? 'solid' : 'outline'}
            size="sm"
            onPress={() => onSelect(profile.key)}
          >
            {profile.label}
          </Button>
        ))}
      </View>
    </View>
  );
};

/**
 * Camera Examples - Demonstrates @idealyst/camera package usage
 */
export const CameraExamples = () => {
  const [selectedProfile, setSelectedProfile] = useState<keyof typeof CAMERA_PROFILES>('standard');
  const [lastPhoto, setLastPhoto] = useState<{ uri: string; width: number; height: number } | null>(null);
  const [lastVideo, setLastVideo] = useState<{ uri: string; duration: number; size: number } | null>(null);

  // Get the camera config for the selected profile
  const config = CAMERA_PROFILES[selectedProfile] as Partial<CameraConfig>;

  // Camera hook
  const {
    status,
    isActive,
    isRecording,
    recordingDuration,
    activeDevice,
    availableDevices,
    permission,
    error,
    zoom,
    start,
    stop,
    switchDevice,
    takePhoto,
    startRecording,
    stopRecording,
    setZoom,
    requestPermission,
    cameraRef,
  } = useCamera({
    config,
    autoRequestPermission: false,
  });

  // Handle camera start/stop
  const handleToggleCamera = useCallback(async () => {
    if (isActive) {
      await stop();
    } else {
      setLastPhoto(null);
      setLastVideo(null);
      await start();
    }
  }, [isActive, start, stop]);

  // Handle take photo
  const handleTakePhoto = useCallback(async () => {
    try {
      const result = await takePhoto({ format: 'jpeg', quality: 90 });
      setLastPhoto({
        uri: result.uri,
        width: result.width,
        height: result.height,
      });
    } catch (e) {
      console.error('Failed to take photo:', e);
    }
  }, [takePhoto]);

  // Handle video recording toggle
  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      try {
        const result = await stopRecording();
        setLastVideo({
          uri: result.uri,
          duration: result.duration,
          size: result.size,
        });
      } catch (e) {
        console.error('Failed to stop recording:', e);
      }
    } else {
      setLastVideo(null);
      await startRecording({ format: 'webm', audio: true });
    }
  }, [isRecording, startRecording, stopRecording]);

  // Handle device switch
  const handleSwitchCamera = useCallback(async () => {
    const newPosition = activeDevice?.position === 'front' ? 'back' : 'front';
    await switchDevice(newPosition);
  }, [activeDevice, switchDevice]);

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const permissionGranted = permission?.camera === 'granted';

  return (
    <Screen scroll>
      <View spacing="lg" style={{ padding: 16 }}>
        <Text size="xl" weight="bold">
          Camera
        </Text>
        <Text size="md" color="secondary">
          Cross-platform camera access with photo and video capture capabilities.
        </Text>

        {/* Permission Status */}
        <Card>
          <View spacing="md" style={{ padding: 16 }}>
            <Text size="md" weight="semibold">
              Permission Status
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor:
                    permission?.camera === 'granted'
                      ? '#22c55e'
                      : permission?.camera === 'denied' || permission?.camera === 'blocked'
                        ? '#ef4444'
                        : '#f59e0b',
                }}
              />
              <Text size="sm">
                {permission?.camera === 'granted'
                  ? 'Camera access granted'
                  : permission?.camera === 'denied'
                    ? 'Permission denied'
                    : permission?.camera === 'blocked'
                      ? 'Permission blocked - enable in browser settings'
                      : 'Permission not yet requested'}
              </Text>
            </View>
            {!permissionGranted && (
              <Button variant="outline" size="sm" onPress={requestPermission}>
                Request Permission
              </Button>
            )}
          </View>
        </Card>

        {/* Camera Config */}
        <Card>
          <View spacing="md" style={{ padding: 16 }}>
            <ProfileSelector
              selectedProfile={selectedProfile}
              onSelect={(p) => setSelectedProfile(p as keyof typeof CAMERA_PROFILES)}
            />
            <Text size="sm" color="secondary">
              Position: {config.position || 'back'} | Quality: {config.videoQuality || 'high'} | Audio:{' '}
              {config.enableAudio !== false ? 'On' : 'Off'}
            </Text>
          </View>
        </Card>

        {/* Camera Preview */}
        <Card>
          <View spacing="md" style={{ padding: 16 }}>
            <Text size="md" weight="semibold">
              Camera Preview
            </Text>

            {/* Preview Area */}
            <View
              style={{
                width: '100%',
                aspectRatio: '16/9',
                backgroundColor: '#1f2937',
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {isActive && cameraRef.current ? (
                <CameraPreview
                  camera={cameraRef.current}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  enableTapToFocus
                  enablePinchToZoom
                />
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text size="md" style={{ color: '#9ca3af' }}>
                    {permissionGranted ? 'Camera inactive' : 'Grant permission to start'}
                  </Text>
                </View>
              )}

              {/* Recording indicator */}
              {isRecording && (
                <View
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: 'rgba(239, 68, 68, 0.9)',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#fff',
                    }}
                  />
                  <Text size="sm" style={{ color: '#fff' }}>
                    {formatDuration(recordingDuration)}
                  </Text>
                </View>
              )}
            </View>

            {/* Controls */}
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
              <Button
                variant={isActive ? 'destructive' : 'solid'}
                onPress={handleToggleCamera}
                disabled={!permissionGranted}
              >
                {isActive ? 'Stop Camera' : 'Start Camera'}
              </Button>

              {isActive && (
                <>
                  <Button variant="outline" onPress={handleSwitchCamera}>
                    Switch Camera
                  </Button>
                  <Button variant="solid" onPress={handleTakePhoto} disabled={isRecording}>
                    Take Photo
                  </Button>
                  <Button
                    variant={isRecording ? 'destructive' : 'outline'}
                    onPress={handleToggleRecording}
                  >
                    {isRecording ? 'Stop Recording' : 'Record Video'}
                  </Button>
                </>
              )}
            </View>

            {/* Zoom Control */}
            {isActive && (
              <View style={{ marginTop: 16 }}>
                <Text size="sm" weight="medium" style={{ marginBottom: 8 }}>
                  Zoom: {zoom.toFixed(1)}x
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => setZoom(Math.max(1, zoom - 0.5))}
                    disabled={zoom <= 1}
                  >
                    -
                  </Button>
                  <Button variant="outline" size="sm" onPress={() => setZoom(1)}>
                    1x
                  </Button>
                  <Button variant="outline" size="sm" onPress={() => setZoom(2)}>
                    2x
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => setZoom(Math.min(10, zoom + 0.5))}
                    disabled={zoom >= 10}
                  >
                    +
                  </Button>
                </View>
              </View>
            )}

            {/* Device Info */}
            {activeDevice && (
              <View style={{ marginTop: 16 }}>
                <Text size="xs" color="secondary">
                  Device: {activeDevice.label || activeDevice.id} ({activeDevice.position})
                </Text>
                <Text size="xs" color="secondary">
                  Available: {availableDevices.length} camera(s)
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Last Photo */}
        {lastPhoto && (
          <Card>
            <View spacing="md" style={{ padding: 16 }}>
              <Text size="md" weight="semibold">
                Last Photo
              </Text>
              <img
                src={lastPhoto.uri}
                alt="Captured photo"
                style={{
                  width: '100%',
                  maxWidth: 400,
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              />
              <Text size="sm" color="secondary">
                Size: {lastPhoto.width} x {lastPhoto.height}
              </Text>
              <a
                href={lastPhoto.uri}
                download="photo.jpg"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 14,
                }}
              >
                Download Photo
              </a>
            </View>
          </Card>
        )}

        {/* Last Video */}
        {lastVideo && (
          <Card>
            <View spacing="md" style={{ padding: 16 }}>
              <Text size="md" weight="semibold">
                Last Video
              </Text>
              <video
                src={lastVideo.uri}
                controls
                style={{
                  width: '100%',
                  maxWidth: 400,
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              />
              <Text size="sm" color="secondary">
                Duration: {formatDuration(lastVideo.duration)} | Size: {formatSize(lastVideo.size)}
              </Text>
              <a
                href={lastVideo.uri}
                download="video.webm"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 14,
                }}
              >
                Download Video
              </a>
            </View>
          </Card>
        )}

        {/* Status Info */}
        <Card>
          <View spacing="sm" style={{ padding: 16 }}>
            <Text size="sm" weight="semibold">
              Status
            </Text>
            <Text size="xs" color="secondary">
              State: {status.state}
            </Text>
            <Text size="xs" color="secondary">
              Active: {isActive ? 'Yes' : 'No'} | Recording: {isRecording ? 'Yes' : 'No'}
            </Text>
          </View>
        </Card>

        {/* Error Display */}
        {error && (
          <Card>
            <View style={{ padding: 16, backgroundColor: '#fef2f2' }}>
              <Text size="sm" weight="semibold" style={{ color: '#dc2626' }}>
                Error: {error.code}
              </Text>
              <Text size="sm" style={{ color: '#dc2626' }}>
                {error.message}
              </Text>
            </View>
          </Card>
        )}
      </View>
    </Screen>
  );
};

export default CameraExamples;
