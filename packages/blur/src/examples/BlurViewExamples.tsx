/**
 * BlurView Package Examples
 *
 * Demonstrates the @idealyst/blur component:
 * - Basic blur effects with different types
 * - Intensity control
 * - Glassmorphism card patterns
 * - Overlay effects
 */

import React, { useState } from 'react';
import { Screen, View, Text, Card, Slider, Divider, Button, Image } from '@idealyst/components';
import { BlurView } from '../index';

// Sample image for backgrounds
const SAMPLE_IMAGE = 'https://picsum.photos/800/600';

// =============================================================================
// Basic Blur Demo
// =============================================================================

const BasicBlurDemo: React.FC = () => {
  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">Basic Usage</Text>
      <Text color="secondary">
        Simple blur effect over content using the BlurView component.
      </Text>

      <View style={{ position: 'relative', height: 200, borderRadius: 12, overflow: 'hidden' }}>
        <Image
          source={{ uri: SAMPLE_IMAGE }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
        <BlurView
          intensity={50}
          blurType="default"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
          }}
        >
          <Text weight="semibold" style={{ color: '#333' }}>
            Blurred overlay content
          </Text>
          <Text typography="caption" style={{ color: '#555' }}>
            This text is rendered on top of a blur effect
          </Text>
        </BlurView>
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`<BlurView intensity={50} blurType="default">
  <Text>Blurred overlay content</Text>
</BlurView>`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// Blur Types Demo
// =============================================================================

const BlurTypesDemo: React.FC = () => {
  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">Blur Types</Text>
      <Text color="secondary">
        Different blur types for light and dark backgrounds.
      </Text>

      <View direction="row" gap="md" style={{ flexWrap: 'wrap' }}>
        {(['default', 'light', 'dark'] as const).map((type) => (
          <View
            key={type}
            style={{
              flex: 1,
              minWidth: 150,
              position: 'relative',
              height: 150,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: SAMPLE_IMAGE }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
            />
            <BlurView
              intensity={60}
              blurType={type}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                weight="semibold"
                style={{ color: type === 'dark' ? '#fff' : '#333' }}
              >
                {type}
              </Text>
            </BlurView>
          </View>
        ))}
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`// Available blur types
blurType="default"  // Transparent blur
blurType="light"    // Light tinted blur
blurType="dark"     // Dark tinted blur`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// Intensity Control Demo
// =============================================================================

const IntensityControlDemo: React.FC = () => {
  const [intensity, setIntensity] = useState(50);

  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">Intensity Control</Text>
      <Text color="secondary">
        Adjust the blur intensity from 0 to 100.
      </Text>

      <View style={{ position: 'relative', height: 200, borderRadius: 12, overflow: 'hidden' }}>
        <Image
          source={{ uri: SAMPLE_IMAGE }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
        <BlurView
          intensity={intensity}
          blurType="light"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text typography="h3" weight="bold" style={{ color: '#333' }}>
            {intensity}%
          </Text>
          <Text typography="caption" style={{ color: '#555' }}>
            Blur Intensity
          </Text>
        </BlurView>
      </View>

      <View gap="sm">
        <View direction="row" gap="sm" style={{ alignItems: 'center' }}>
          <Text typography="caption" style={{ width: 70 }}>Intensity:</Text>
          <View style={{ flex: 1 }}>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              minimumValue={0}
              maximumValue={100}
              step={5}
            />
          </View>
          <Text typography="caption" style={{ width: 40 }}>{intensity}%</Text>
        </View>
      </View>

      <View direction="row" gap="sm" style={{ justifyContent: 'center' }}>
        <Button type="outlined" size="sm" onPress={() => setIntensity(0)}>0%</Button>
        <Button type="outlined" size="sm" onPress={() => setIntensity(25)}>25%</Button>
        <Button type="outlined" size="sm" onPress={() => setIntensity(50)}>50%</Button>
        <Button type="outlined" size="sm" onPress={() => setIntensity(75)}>75%</Button>
        <Button type="outlined" size="sm" onPress={() => setIntensity(100)}>100%</Button>
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`<BlurView intensity={${intensity}}>
  {/* Content */}
</BlurView>`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// Glassmorphism Card Demo
// =============================================================================

const GlassmorphismDemo: React.FC = () => {
  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">Glassmorphism Pattern</Text>
      <Text color="secondary">
        Create modern frosted glass UI effects.
      </Text>

      <View style={{ position: 'relative', height: 300, borderRadius: 16, overflow: 'hidden' }}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            top: -30,
            left: -30,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            bottom: -50,
            right: -50,
          }}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <BlurView
            intensity={40}
            blurType="light"
            style={{
              padding: 24,
              borderRadius: 16,
              width: '100%',
              maxWidth: 300,
            }}
          >
            <Text typography="h4" weight="bold" style={{ color: '#333', marginBottom: 8 }}>
              Glass Card
            </Text>
            <Text style={{ color: '#555', marginBottom: 16 }}>
              This card uses a blur effect combined with transparency to create a
              glassmorphism design pattern.
            </Text>
            <Button size="sm" intent="primary">
              Learn More
            </Button>
          </BlurView>
        </View>
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`// Glassmorphism pattern
<BlurView
  intensity={40}
  blurType="light"
  style={{
    padding: 24,
    borderRadius: 16,
  }}
>
  <Text>Glass card content</Text>
</BlurView>`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// Modal Overlay Demo
// =============================================================================

const ModalOverlayDemo: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <Card padding="md" gap="md">
      <Text typography="h4" weight="semibold">Modal Overlay</Text>
      <Text color="secondary">
        Use blur as a modal backdrop for focus effects.
      </Text>

      <View style={{ position: 'relative', height: 250, borderRadius: 12, overflow: 'hidden' }}>
        <View style={{ padding: 16 }}>
          <Text weight="semibold" style={{ marginBottom: 8 }}>Background Content</Text>
          <Text color="secondary" style={{ marginBottom: 8 }}>
            This is the main content that will be blurred when the overlay is shown.
          </Text>
          <View direction="row" gap="sm" style={{ marginBottom: 16 }}>
            <View style={{ width: 50, height: 50, backgroundColor: '#e74c3c', borderRadius: 8 }} />
            <View style={{ width: 50, height: 50, backgroundColor: '#3498db', borderRadius: 8 }} />
            <View style={{ width: 50, height: 50, backgroundColor: '#2ecc71', borderRadius: 8 }} />
            <View style={{ width: 50, height: 50, backgroundColor: '#f39c12', borderRadius: 8 }} />
          </View>
          <Button onPress={() => setShowOverlay(true)} intent="primary">
            Show Overlay
          </Button>
        </View>

        {showOverlay && (
          <BlurView
            intensity={70}
            blurType="dark"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                maxWidth: 250,
              }}
            >
              <Text weight="semibold" style={{ marginBottom: 8 }}>
                Modal Content
              </Text>
              <Text color="secondary" style={{ marginBottom: 16 }}>
                The background is blurred to draw focus to this modal.
              </Text>
              <Button onPress={() => setShowOverlay(false)} size="sm">
                Close
              </Button>
            </View>
          </BlurView>
        )}
      </View>

      <View background="secondary" padding="sm" radius="sm">
        <Text typography="caption" style={{ fontFamily: 'monospace' }}>
          {`// Modal overlay pattern
{showOverlay && (
  <BlurView
    intensity={70}
    blurType="dark"
    style={{ position: 'absolute', ...fullSize }}
  >
    <ModalContent />
  </BlurView>
)}`}
        </Text>
      </View>
    </Card>
  );
};

// =============================================================================
// Main Screen
// =============================================================================

export const BlurViewExamples: React.FC = () => {
  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="lg">
        <Text typography="h2" weight="bold" align="center">
          BlurView Examples
        </Text>
        <Text color="secondary" align="center">
          Cross-platform blur effects for React and React Native
        </Text>

        <Divider />

        <BasicBlurDemo />
        <BlurTypesDemo />
        <IntensityControlDemo />
        <GlassmorphismDemo />
        <ModalOverlayDemo />

        <Card type="elevated" padding="md" gap="sm">
          <Text weight="semibold">About @idealyst/blur</Text>
          <Text color="secondary">
            Cross-platform blur component that uses CSS backdrop-filter on web and
            @react-native-community/blur on native platforms.
          </Text>
          <View gap="xs">
            <Text typography="caption" weight="semibold">Props:</Text>
            <Text typography="caption" color="secondary">• intensity (0-100) - Blur strength</Text>
            <Text typography="caption" color="secondary">• blurType - 'default' | 'light' | 'dark'</Text>
            <Text typography="caption" color="secondary">• style - Container styles</Text>
            <Text typography="caption" color="secondary">• children - Content to render</Text>
          </View>
          <View gap="xs" style={{ marginTop: 8 }}>
            <Text typography="caption" weight="semibold">Platform Notes:</Text>
            <Text typography="caption" color="secondary">• Web: Uses CSS backdrop-filter (check browser support)</Text>
            <Text typography="caption" color="secondary">• Native: Requires @react-native-community/blur</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
};

export default BlurViewExamples;
