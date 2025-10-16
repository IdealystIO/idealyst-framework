import React, { useState } from 'react';
import { Screen, View, Icon, Text, Button } from '../index';
import type { IconName } from '../Icon/icon-types';

// Test Components for Plugin
const SimpleVariableTest = () => {
  const homeIcon = "home";
  const accountIcon = "account";
  const cogIcon = "cog";
  return (
    <>
      <Icon name={homeIcon} size="md" />
      <Icon name={accountIcon} size="md" />
      <Icon name={cogIcon} size="md" />
    </>
  );
};

const NamespaceTest = () => {
  const starIcon = "mdi:star";
  const heartIcon = "mdi:heart";
  const rocketIcon = "mdi:rocket";
  return (
    <>
      <Icon name={starIcon} size="md" />
      <Icon name={heartIcon} size="md" />
      <Icon name={rocketIcon} size="md" />
    </>
  );
};

const TemplateLiteralTest = () => {
  const bellIcon = `bell`;
  const mailIcon = `mail`;
  return (
    <>
      <Icon name={bellIcon} size="md" />
      <Icon name={mailIcon} size="md" />
    </>
  );
};

const MultipleVariablesTest = () => {
  const deleteIcon = "delete";
  const editIcon = "pencil";
  const saveIcon = "content-save";
  const copyIcon = "content-copy";
  return (
    <>
      <Icon name={deleteIcon} size="md" color="red" />
      <Icon name={editIcon} size="md" color="blue" />
      <Icon name={saveIcon} size="md" color="green" />
      <Icon name={copyIcon} size="md" color="orange" />
    </>
  );
};

const FalsePositiveTest = () => {
  const pageName = "home"; // Not used with Icon
  const title = "account"; // Not used with Icon
  return (
    <>
      <Text size="small">Page: {pageName}</Text>
      <Text size="small">Title: {title}</Text>
      <Text size="small" style={{ fontFamily: 'monospace', color: '#666' }}>
        These strings are NOT transformed (not used with Icon)
      </Text>
    </>
  );
};

export const IconExamples = () => {
  // Test state for dynamic icon switching
  const [isPlaying, setIsPlaying] = useState(false);
  const [userStatus, setUserStatus] = useState<'online' | 'offline' | 'away'>('online');

  // Test function that returns an icon name
  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'online': return 'check-circle';
      case 'offline': return 'close-circle';
      case 'away': return 'clock';
      default: return 'help-circle';
    }
  };

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
        <Text size="large" weight="bold" align="center">
          Icon Examples
        </Text>
        
        {/* Color Variants */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Color Variants</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="home-account" size="md" color="primary" />
              <Text size="small">Primary</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="check" size="md" color="secondary" />
              <Text size="small">Secondary</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="alert-circle" size="md" color="blue" />
              <Text size="small">Blue</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="alert" size="md" color="green" />
              <Text size="small">Green</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="cog" size="md" color="red" />
              <Text size="small">Red</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="text" size="md" color="orange" />
              <Text size="small">Orange</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="text" size="md" color="disabled" />
              <Text size="small">Disabled</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="text" size="md" color="muted" />
              <Text size="small">Muted</Text>
            </View>
          </View>
        </View>

        {/* Color Shades */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Color Shades</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="star" size="md" color="blue.200" />
              <Text size="small">Blue 200</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="star" size="md" color="blue.500" />
              <Text size="small">Blue 500</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="star" size="md" color="blue.800" />
              <Text size="small">Blue 800</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="heart" size="md" color="red.300" />
              <Text size="small">Red 300</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="heart" size="md" color="red.600" />
              <Text size="small">Red 600</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="heart" size="md" color="red.900" />
              <Text size="small">Red 900</Text>
            </View>
          </View>
        </View>
        
        {/* Basic Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Basic Icons</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="home" />
            <Icon name="cog" />
            <Icon name="account" />
            <Icon name="magnify" />
            <Icon name="heart" />
            <Icon name="star" />
            <Icon name="bell" />
            <Icon name="mail" />
          </View>
        </View>

        {/* Icon Sizes */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Sizes</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="home" size="xs" />
              <Text size="small">XS (12px)</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="home" size="sm" />
              <Text size="small">SM (16px)</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="home" size="md" />
              <Text size="small">MD (24px)</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="home" size="lg" />
              <Text size="small">LG (32px)</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="home" size="xl" />
              <Text size="small">XL (48px)</Text>
            </View>
          </View>
        </View>

        {/* Custom Colors vs Variants */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Custom Colors vs Variants</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="heart" size="lg" style={{ color: '#FF0000' }} />
              <Text size="small">Custom Red</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="heart" size="lg" color="red" />
              <Text size="small">Red Variant</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="heart" size="lg" style={{ color: '#00FF00' }} />
              <Text size="small">Custom Green</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="heart" size="lg" color="green" />
              <Text size="small">Green Variant</Text>
            </View>
          </View>
        </View>

        {/* Navigation Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Navigation & Movement</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="arrow-left" size="md" />
            <Icon name="arrow-right" size="md" />
            <Icon name="arrow-up" size="md" />
            <Icon name="arrow-down" size="md" />
            <Icon name="chevron-left" size="md" />
            <Icon name="chevron-right" size="md" />
            <Icon name="arrow-left" size="md" />
            <Icon name="forward" size="md" />
            <Icon name="compass" size="md" />
            <Icon name="map-marker" size="md" />
          </View>
        </View>

        {/* Action Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Actions & Controls</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="play" size="md" />
            <Icon name="pause" size="md" />
            <Icon name="stop" size="md" />
            <Icon name="plus" size="md" />
            <Icon name="minus" size="md" />
            <Icon name="pencil" size="md" />
            <Icon name="delete" size="md" />
            <Icon name="content-save" size="md" />
            <Icon name="content-copy" size="md" />
            <Icon name="refresh" size="md" />
          </View>
        </View>

        {/* Communication Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Communication</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="mail" size="md" />
            <Icon name="message" size="md" />
            <Icon name="chat" size="md" />
            <Icon name="phone" size="md" />
            <Icon name="video" size="md" />
            <Icon name="bell" size="md" />
            <Icon name="bell" size="md" />
            <Icon name="bullhorn" size="md" />
          </View>
        </View>

        {/* Social Media Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Social Media</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="facebook" size="md" />
            <Icon name="twitter" size="md" />
            <Icon name="instagram" size="md" />
            <Icon name="linkedin" size="md" />
            <Icon name="youtube" size="md" />
            <Icon name="github" size="md" />
            <Icon name="github" size="md" />
            <Icon name="slack" size="md" />
          </View>
        </View>

        {/* Status & Alert Icons with Variants */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Status & Alerts (Using Variants)</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="check-circle" size="md" color="green" />
              <Text size="small">Success</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="alert" size="md" color="orange" />
              <Text size="small">Warning</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="alert-circle" size="md" color="red" />
              <Text size="small">Error</Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Icon name="information" size="md" color="blue" />
              <Text size="small">Info</Text>
            </View>
          </View>
        </View>

        {/* File & Document Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Files & Documents</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="file-document" size="md" />
            <Icon name="folder" size="md" />
            <Icon name="file-document" size="md" />
            <Icon name="file-pdf-box" size="md" />
            <Icon name="file-word" size="md" />
            <Icon name="file-excel" size="md" />
            <Icon name="zip-box" size="md" />
            <Icon name="attachment" size="md" />
          </View>
        </View>

        {/* Media Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Media & Content</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="image" size="md" />
            <Icon name="camera" size="md" />
            <Icon name="video" size="md" />
            <Icon name="music" size="md" />
            <Icon name="headphones" size="md" />
            <Icon name="microphone" size="md" />
            <Icon name="television" size="md" />
            <Icon name="monitor" size="md" />
          </View>
        </View>

        {/* Technology Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Technology & Devices</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="cellphone" size="md" />
            <Icon name="laptop" size="md" />
            <Icon name="monitor" size="md" />
            <Icon name="tablet" size="md" />
            <Icon name="wifi" size="md" />
            <Icon name="bluetooth" size="md" />
            <Icon name="battery" size="md" />
            <Icon name="usb" size="md" />
          </View>
        </View>

        {/* Weather Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Weather</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="weather-sunny" size="md" />
            <Icon name="weather-night" size="md" />
            <Icon name="cloud" size="md" />
            <Icon name="weather-rainy" size="md" />
            <Icon name="weather-snowy" size="md" />
            <Icon name="weather-lightning" size="md" />
            <Icon name="weather-windy" size="md" />
            <Icon name="umbrella" size="md" />
          </View>
        </View>

        {/* Gaming & Entertainment Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Gaming & Entertainment</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="gamepad" size="md" />
            <Icon name="trophy" size="md" />
            <Icon name="medal" size="md" />
            <Icon name="target" size="md" />
            <Icon name="rocket" size="md" />
            <Icon name="crown" size="md" />
            <Icon name="diamond" size="md" />
            <Icon name="dice-6" size="md" />
          </View>
        </View>

        {/* Business & Work Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Business & Work</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="briefcase" size="md" />
            <Icon name="presentation" size="md" />
            <Icon name="chart-line" size="md" />
            <Icon name="chart-bar" size="md" />
            <Icon name="view-dashboard" size="md" />
            <Icon name="table-large" size="md" />
            <Icon name="file-document" size="md" />
            <Icon name="stamper" size="md" />
          </View>
        </View>

        {/* Tool Icons */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Tools & Utilities</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Icon name="tools" size="md" />
            <Icon name="hammer" size="md" />
            <Icon name="wrench" size="md" />
            <Icon name="screwdriver" size="md" />
            <Icon name="cog" size="md" />
            <Icon name="cog" size="md" />
            <Icon name="toolbox" size="md" />
            <Icon name="hammer-wrench" size="md" />
          </View>
        </View>

        {/* Enhanced Plugin Testing Section */}
        <View spacing="lg" style={{ marginTop: 32, padding: 16, backgroundColor: 'rgba(100, 100, 255, 0.1)', borderRadius: 8 }}>
          <Text size="large" weight="bold">Enhanced Plugin Testing</Text>
          <Text size="small" style={{ fontStyle: 'italic', marginBottom: 16 }}>
            These examples test the new context-aware babel plugin features
          </Text>

          {/* Test 1: Simple Variable */}
          <View spacing="md">
            <Text size="medium" weight="semibold">Test 1: Simple Variable</Text>
            <Text size="small" color="secondary">Icon name from a simple variable</Text>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <SimpleVariableTest />
            </View>
            <Text size="small" style={{ fontFamily: 'monospace', color: '#666' }}>
              const iconName = "home"; &lt;Icon name={'{iconName}'} /&gt;
            </Text>
          </View>

          {/* Test 2: Namespace Prefix */}
          <View spacing="md">
            <Text size="medium" weight="semibold">Test 2: Namespace Prefix (mdi:)</Text>
            <Text size="small" color="secondary">Explicit marking with mdi: prefix</Text>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <NamespaceTest />
            </View>
            <Text size="small" style={{ fontFamily: 'monospace', color: '#666' }}>
              const icon = "mdi:star"; &lt;Icon name={'{icon}'} /&gt;
            </Text>
          </View>

          {/* Test 3: Conditional Expression */}
          <View spacing="md">
            <Text size="medium" weight="semibold">Test 3: Conditional Expression</Text>
            <Text size="small" color="secondary">Ternary operator with two icons</Text>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <Icon name={isPlaying ? "pause" : "play"} size="md" />
              <Button onPress={() => setIsPlaying(!isPlaying)}>
                Toggle Play/Pause
              </Button>
              <Text size="small">Currently: {isPlaying ? 'Playing' : 'Paused'}</Text>
            </View>
            <Text size="small" style={{ fontFamily: 'monospace', color: '#666' }}>
              &lt;Icon name={'{isPlaying ? "pause" : "play"}'} /&gt;
            </Text>
          </View>

          {/* Test 4: Function Return */}
          <View spacing="md">
            <Text size="medium" weight="semibold">Test 4: Function Return Value</Text>
            <Text size="small" color="secondary">Icon name from function (requires manifest or namespace)</Text>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <Icon name={getStatusIcon(userStatus)} size="md" />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button onPress={() => setUserStatus('online')} variant={userStatus === 'online' ? 'contained' : 'outlined'}>
                  Online
                </Button>
                <Button onPress={() => setUserStatus('offline')} variant={userStatus === 'offline' ? 'contained' : 'outlined'}>
                  Offline
                </Button>
                <Button onPress={() => setUserStatus('away')} variant={userStatus === 'away' ? 'contained' : 'outlined'}>
                  Away
                </Button>
              </View>
            </View>
            <Text size="small" style={{ fontFamily: 'monospace', color: '#666' }}>
              &lt;Icon name={'{getStatusIcon(status)}'} /&gt;
            </Text>
          </View>

          {/* Test 5: Namespace with Conditional */}
          <View spacing="md">
            <Text size="medium" weight="semibold">Test 5: Namespace + Conditional</Text>
            <Text size="small" color="secondary">Guaranteed transformation with mdi: prefix</Text>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <Icon name={isPlaying ? "mdi:volume-high" : "mdi:volume-mute"} size="md" />
              <Text size="small">Audio: {isPlaying ? 'On' : 'Muted'}</Text>
            </View>
            <Text size="small" style={{ fontFamily: 'monospace', color: '#666' }}>
              &lt;Icon name={'{isPlaying ? "mdi:volume-high" : "mdi:volume-mute"}'} /&gt;
            </Text>
          </View>

          {/* Test 6: Logical Expression */}
          <View spacing="md">
            <Text size="medium" weight="semibold">Test 6: Logical Expression</Text>
            <Text size="small" color="secondary">Using && and || operators</Text>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <Icon name={userStatus === 'online' && "wifi"} size="md" />
              <Icon name={userStatus === 'offline' || "wifi-off"} size="md" />
            </View>
            <Text size="small" style={{ fontFamily: 'monospace', color: '#666' }}>
              &lt;Icon name={'{condition && "wifi"}'} /&gt;
            </Text>
          </View>

          {/* Test 7: Template Literal (Static) */}
          <View spacing="md">
            <Text size="medium" weight="semibold">Test 7: Template Literal (Static)</Text>
            <Text size="small" color="secondary">Static template strings</Text>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <TemplateLiteralTest />
            </View>
            <Text size="small" style={{ fontFamily: 'monospace', color: '#666' }}>
              const icon = `bell`; &lt;Icon name={'{icon}'} /&gt;
            </Text>
          </View>

          {/* Test 8: No False Positives */}
          <View spacing="md">
            <Text size="medium" weight="semibold">Test 8: No False Positives</Text>
            <Text size="small" color="secondary">Common words NOT used with Icon shouldn't transform</Text>
            <View style={{ flexDirection: 'column', gap: 8 }}>
              <FalsePositiveTest />
            </View>
          </View>

          {/* Test 9: Multiple Variables */}
          <View spacing="md">
            <Text size="medium" weight="semibold">Test 9: Multiple Icon Variables</Text>
            <Text size="small" color="secondary">Several variables used with Icon components</Text>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <MultipleVariablesTest />
            </View>
            <Text size="small" style={{ fontFamily: 'monospace', color: '#666' }}>
              Multiple icon variables in same scope
            </Text>
          </View>

          {/* Summary */}
          <View style={{ marginTop: 16, padding: 12, backgroundColor: 'rgba(0, 255, 0, 0.1)', borderRadius: 4 }}>
            <Text size="small" weight="semibold">Plugin Features Tested:</Text>
            <Text size="small">✓ Simple variables</Text>
            <Text size="small">✓ Namespace prefix (mdi:)</Text>
            <Text size="small">✓ Conditional expressions</Text>
            <Text size="small">✓ Function returns</Text>
            <Text size="small">✓ Logical operators</Text>
            <Text size="small">✓ Template literals</Text>
            <Text size="small">✓ No false positives</Text>
            <Text size="small">✓ Multiple variables</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}; 