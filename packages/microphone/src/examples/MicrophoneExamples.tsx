import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Screen, Text, View, Button, Card } from '@idealyst/components';
import { useMicrophone, useRecorder } from '../hooks/index.web';
import { AUDIO_PROFILES } from '../constants';
import type { PCMData } from '../types';

/**
 * Audio level visualization bar
 */
const LevelMeter = ({ level, label }: { level: number; label: string }) => {
  const percentage = Math.min(100, Math.max(0, level * 100));
  const color = percentage > 80 ? '#ef4444' : percentage > 50 ? '#f59e0b' : '#22c55e';

  return (
    <View style={{ marginBottom: 8 }}>
      <Text size="sm" style={{ marginBottom: 4 }}>
        {label}: {percentage.toFixed(1)}%
      </Text>
      <View
        style={{
          height: 20,
          backgroundColor: '#e5e7eb',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: color,
            transition: 'width 50ms ease-out',
          }}
        />
      </View>
    </View>
  );
};

/**
 * Simple waveform visualization
 */
const Waveform = ({ samples }: { samples: number[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || samples.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    // Draw center line
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw waveform
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const step = Math.ceil(samples.length / width);
    for (let i = 0; i < width; i++) {
      const sampleIndex = i * step;
      const sample = samples[Math.min(sampleIndex, samples.length - 1)] || 0;
      const y = centerY + sample * centerY * 0.9;

      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    ctx.stroke();
  }, [samples]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={150}
      style={{
        width: '100%',
        maxWidth: 600,
        height: 150,
        borderRadius: 8,
        border: '1px solid #e5e7eb',
      }}
    />
  );
};

/**
 * Audio config selector
 */
const ConfigSelector = ({
  selectedProfile,
  onSelect,
}: {
  selectedProfile: string;
  onSelect: (profile: string) => void;
}) => {
  const profiles = [
    { key: 'speech', label: 'Speech (16kHz)', desc: 'Optimized for voice recognition' },
    { key: 'highQuality', label: 'High Quality (44.1kHz)', desc: 'Music and high-fidelity audio' },
    { key: 'lowLatency', label: 'Low Latency', desc: 'Real-time feedback' },
    { key: 'minimal', label: 'Minimal (8kHz)', desc: 'Low bandwidth voice' },
  ];

  return (
    <View style={{ gap: 8 }}>
      <Text size="md" weight="semibold">
        Audio Profile
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
 * Microphone Examples - Demonstrates @idealyst/microphone package usage
 */
export const MicrophoneExamples = () => {
  const [selectedProfile, setSelectedProfile] = useState<keyof typeof AUDIO_PROFILES>('speech');
  const [waveformSamples, setWaveformSamples] = useState<number[]>([]);
  const [sampleCount, setSampleCount] = useState(0);

  // Get the audio config for the selected profile
  const config = AUDIO_PROFILES[selectedProfile];

  // Microphone hook for streaming
  const {
    isRecording,
    level,
    permission,
    error,
    status,
    start,
    stop,
    requestPermission,
    resetPeakLevel,
    subscribeToAudioData,
  } = useMicrophone({
    config,
    levelUpdateInterval: 50,
  });

  // Recorder hook for file recording
  const {
    isRecording: isFileRecording,
    duration: recordingDuration,
    startRecording,
    stopRecording,
  } = useRecorder();

  const [lastRecording, setLastRecording] = useState<{
    uri: string;
    duration: number;
    size: number;
  } | null>(null);

  // Subscribe to audio data for waveform visualization
  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const unsubscribe = subscribeToAudioData((pcmData: PCMData) => {
      // Update sample count
      setSampleCount((prev) => prev + pcmData.samples.length);

      // Convert samples to normalized float array for visualization
      const normalizedSamples: number[] = [];
      const maxValue = config.bitDepth === 8 ? 128 : config.bitDepth === 16 ? 32768 : 1;

      // Take every Nth sample to reduce data
      const step = Math.max(1, Math.floor(pcmData.samples.length / 200));
      for (let i = 0; i < pcmData.samples.length; i += step) {
        normalizedSamples.push(pcmData.samples[i] / maxValue);
      }

      // Keep last 600 samples for display
      setWaveformSamples((prev) => {
        const combined = [...prev, ...normalizedSamples];
        return combined.slice(-600);
      });
    });

    return unsubscribe;
  }, [isRecording, subscribeToAudioData, config.bitDepth]);

  // Handle streaming start/stop
  const handleToggleStream = useCallback(async () => {
    if (isRecording) {
      await stop();
      setWaveformSamples([]);
      setSampleCount(0);
    } else {
      setWaveformSamples([]);
      setSampleCount(0);
      await start();
    }
  }, [isRecording, start, stop]);

  // Handle file recording start/stop
  const handleToggleRecording = useCallback(async () => {
    if (isFileRecording) {
      const result = await stopRecording();
      setLastRecording({
        uri: result.uri,
        duration: result.duration,
        size: result.size,
      });
    } else {
      setLastRecording(null);
      await startRecording({
        format: 'wav',
        audioConfig: config,
      });
    }
  }, [isFileRecording, startRecording, stopRecording, config]);

  // Format duration
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Screen scroll>
      <View spacing="lg" style={{ padding: 16 }}>
        <Text size="xl" weight="bold">
          Microphone
        </Text>
        <Text size="md" color="secondary">
          Cross-platform microphone access with streaming audio and file recording.
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
                    permission === 'granted'
                      ? '#22c55e'
                      : permission === 'denied' || permission === 'blocked'
                        ? '#ef4444'
                        : '#f59e0b',
                }}
              />
              <Text size="sm">
                {permission === 'granted'
                  ? 'Microphone access granted'
                  : permission === 'denied'
                    ? 'Permission denied'
                    : permission === 'blocked'
                      ? 'Permission blocked - enable in browser settings'
                      : 'Permission not yet requested'}
              </Text>
            </View>
            {permission !== 'granted' && (
              <Button variant="outline" size="sm" onPress={requestPermission}>
                Request Permission
              </Button>
            )}
          </View>
        </Card>

        {/* Audio Config */}
        <Card>
          <View spacing="md" style={{ padding: 16 }}>
            <ConfigSelector selectedProfile={selectedProfile} onSelect={(p) => setSelectedProfile(p as keyof typeof AUDIO_PROFILES)} />
            <Text size="sm" color="secondary">
              Sample Rate: {config.sampleRate} Hz | Channels: {config.channels} | Bit Depth: {config.bitDepth}-bit
            </Text>
          </View>
        </Card>

        {/* Streaming Section */}
        <Card>
          <View spacing="md" style={{ padding: 16 }}>
            <Text size="md" weight="semibold">
              Audio Streaming
            </Text>
            <Text size="sm" color="secondary">
              Stream raw PCM audio data for real-time processing
            </Text>

            {/* Controls */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                variant={isRecording ? 'destructive' : 'solid'}
                onPress={handleToggleStream}
                disabled={permission !== 'granted' && !isRecording}
              >
                {isRecording ? 'Stop Streaming' : 'Start Streaming'}
              </Button>
              {isRecording && (
                <Button variant="outline" onPress={resetPeakLevel}>
                  Reset Peak
                </Button>
              )}
            </View>

            {/* Level Meters */}
            {isRecording && (
              <View style={{ marginTop: 16 }}>
                <LevelMeter level={level.current} label="Current Level" />
                <LevelMeter level={level.peak} label="Peak Level" />
                <LevelMeter level={level.rms} label="RMS Level" />
                <Text size="sm" color="secondary" style={{ marginTop: 8 }}>
                  dB: {level.db === -Infinity ? '-∞' : level.db.toFixed(1)} dB
                </Text>
              </View>
            )}

            {/* Waveform */}
            {waveformSamples.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text size="sm" weight="medium" style={{ marginBottom: 8 }}>
                  Waveform
                </Text>
                <Waveform samples={waveformSamples} />
                <Text size="xs" color="secondary" style={{ marginTop: 4 }}>
                  Processed {sampleCount.toLocaleString()} samples
                </Text>
              </View>
            )}

            {/* Status */}
            <View style={{ marginTop: 16 }}>
              <Text size="xs" color="secondary">
                State: {status.state} | Duration: {formatDuration(status.duration)}
              </Text>
            </View>
          </View>
        </Card>

        {/* File Recording Section */}
        <Card>
          <View spacing="md" style={{ padding: 16 }}>
            <Text size="md" weight="semibold">
              File Recording
            </Text>
            <Text size="sm" color="secondary">
              Record audio to a WAV file
            </Text>

            {/* Controls */}
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Button
                variant={isFileRecording ? 'destructive' : 'solid'}
                onPress={handleToggleRecording}
                disabled={permission !== 'granted' && !isFileRecording}
              >
                {isFileRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              {isFileRecording && (
                <Text size="md" weight="semibold">
                  {formatDuration(recordingDuration)}
                </Text>
              )}
            </View>

            {/* Last Recording */}
            {lastRecording && (
              <View style={{ marginTop: 16, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
                <Text size="sm" weight="medium">
                  Recording Complete
                </Text>
                <Text size="sm" color="secondary">
                  Duration: {formatDuration(lastRecording.duration)} | Size: {formatSize(lastRecording.size)}
                </Text>
                <View style={{ marginTop: 8 }}>
                  <a
                    href={lastRecording.uri}
                    download="recording.wav"
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
                    Download WAV
                  </a>
                </View>
              </View>
            )}
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

export default MicrophoneExamples;
