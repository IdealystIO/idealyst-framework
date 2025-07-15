import React from 'react';
import { Screen, View, Icon, Text, Button } from '../index';
import type { IconName } from '../Icon/icon-types';

export const IconExamples = () => {
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
      </View>
    </Screen>
  );
}; 