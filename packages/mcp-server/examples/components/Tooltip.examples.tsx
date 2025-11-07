/**
 * Tooltip Component Examples
 *
 * These examples are type-checked against the actual TooltipProps interface
 * to ensure accuracy and correctness.
 */

import React from 'react';
import { Tooltip, View, Text, Button, Icon } from '@idealyst/components';

// Example 1: Basic Tooltip
export function BasicTooltip() {
  return (
    <View spacing="md">
      <Tooltip content="This is a tooltip">
        <Button>Hover me</Button>
      </Tooltip>
    </View>
  );
}

// Example 2: Tooltip Placements
export function TooltipPlacements() {
  return (
    <View spacing="md">
      <Tooltip content="Tooltip on top" placement="top">
        <Button size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Tooltip on bottom" placement="bottom">
        <Button size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Tooltip on left" placement="left">
        <Button size="sm">Left</Button>
      </Tooltip>
      <Tooltip content="Tooltip on right" placement="right">
        <Button size="sm">Right</Button>
      </Tooltip>
    </View>
  );
}

// Example 3: Tooltip Sizes
export function TooltipSizes() {
  return (
    <View spacing="md">
      <Tooltip content="Extra small tooltip" size="xs">
        <Button size="xs">XS</Button>
      </Tooltip>
      <Tooltip content="Small tooltip" size="sm">
        <Button size="sm">SM</Button>
      </Tooltip>
      <Tooltip content="Medium tooltip" size="md">
        <Button size="md">MD</Button>
      </Tooltip>
      <Tooltip content="Large tooltip" size="lg">
        <Button size="lg">LG</Button>
      </Tooltip>
      <Tooltip content="Extra large tooltip" size="xl">
        <Button size="xl">XL</Button>
      </Tooltip>
    </View>
  );
}

// Example 4: Tooltip with Intent Colors
export function TooltipWithIntent() {
  return (
    <View spacing="md">
      <Tooltip content="Primary tooltip" intent="primary">
        <Button intent="primary">Primary</Button>
      </Tooltip>
      <Tooltip content="Success tooltip" intent="success">
        <Button intent="success">Success</Button>
      </Tooltip>
      <Tooltip content="Error tooltip" intent="error">
        <Button intent="error">Error</Button>
      </Tooltip>
      <Tooltip content="Warning tooltip" intent="warning">
        <Button intent="warning">Warning</Button>
      </Tooltip>
      <Tooltip content="Info tooltip" intent="info">
        <Button intent="info">Info</Button>
      </Tooltip>
      <Tooltip content="Neutral tooltip" intent="neutral">
        <Button intent="neutral">Neutral</Button>
      </Tooltip>
    </View>
  );
}

// Example 5: Tooltip with Delay
export function TooltipWithDelay() {
  return (
    <View spacing="md">
      <Tooltip content="Appears immediately" delay={0}>
        <Button size="sm">No delay</Button>
      </Tooltip>
      <Tooltip content="Appears after 500ms" delay={500}>
        <Button size="sm">500ms delay</Button>
      </Tooltip>
      <Tooltip content="Appears after 1 second" delay={1000}>
        <Button size="sm">1s delay</Button>
      </Tooltip>
    </View>
  );
}

// Example 6: Tooltip on Icons
export function TooltipOnIcons() {
  return (
    <View spacing="md">
      <Tooltip content="Home">
        <Icon name="home" size="lg" style={{ cursor: 'pointer' }} />
      </Tooltip>
      <Tooltip content="Search">
        <Icon name="magnify" size="lg" style={{ cursor: 'pointer' }} />
      </Tooltip>
      <Tooltip content="Settings">
        <Icon name="cog" size="lg" style={{ cursor: 'pointer' }} />
      </Tooltip>
      <Tooltip content="Notifications">
        <Icon name="bell" size="lg" style={{ cursor: 'pointer' }} />
      </Tooltip>
      <Tooltip content="Profile">
        <Icon name="account" size="lg" style={{ cursor: 'pointer' }} />
      </Tooltip>
    </View>
  );
}

// Example 7: Tooltip on Text
export function TooltipOnText() {
  return (
    <View spacing="md">
      <Text>
        This is a paragraph with a{' '}
        <Tooltip content="This is additional information">
          <Text weight="semibold">
            tooltipped word
          </Text>
        </Tooltip>{' '}
        in the middle of the sentence.
      </Text>
    </View>
  );
}

// Example 8: Tooltip with Rich Content
export function TooltipWithRichContent() {
  const richContent = (
    <View spacing="xs">
      <Text weight="bold" size="sm" >
        User Information
      </Text>
      <Text size="sm" >
        John Doe
      </Text>
      <Text size="sm" >
        john@example.com
      </Text>
    </View>
  );

  return (
    <View spacing="md">
      <Tooltip content={richContent}>
        <Button type="outlined">Hover for details</Button>
      </Tooltip>
    </View>
  );
}

// Example 9: Tooltip on Disabled Elements
export function TooltipOnDisabledElements() {
  return (
    <View spacing="md">
      <Tooltip content="This button is disabled because you don't have permission">
        <Button disabled>Disabled Action</Button>
      </Tooltip>
    </View>
  );
}

// Example 10: Help Tooltips
export function HelpTooltips() {
  return (
    <View spacing="lg">
      <View spacing="sm">
        <View spacing="xs">
          <Text weight="semibold">Username</Text>
          <Tooltip content="Your username must be unique and at least 3 characters long">
            <Icon name="help-circle" size="sm"  style={{ cursor: 'pointer' }} />
          </Tooltip>
        </View>
        <Text size="sm" >
          Placeholder for input
        </Text>
      </View>

      <View spacing="sm">
        <View spacing="xs">
          <Text weight="semibold">Email</Text>
          <Tooltip content="We'll use this email for account recovery and notifications">
            <Icon name="help-circle" size="sm"  style={{ cursor: 'pointer' }} />
          </Tooltip>
        </View>
        <Text size="sm" >
          Placeholder for input
        </Text>
      </View>

      <View spacing="sm">
        <View spacing="xs">
          <Text weight="semibold">Password</Text>
          <Tooltip content="Password must be at least 8 characters with uppercase, lowercase, and numbers">
            <Icon name="help-circle" size="sm"  style={{ cursor: 'pointer' }} />
          </Tooltip>
        </View>
        <Text size="sm" >
          Placeholder for input
        </Text>
      </View>
    </View>
  );
}

// Example 11: Action Tooltips
export function ActionTooltips() {
  return (
    <View spacing="md">
      <Tooltip content="Save your changes" placement="top">
        <Button size="sm" intent="success">
          <Icon name="content-save" />
        </Button>
      </Tooltip>
      <Tooltip content="Discard changes" placement="top">
        <Button size="sm" intent="error">
          <Icon name="close" />
        </Button>
      </Tooltip>
      <Tooltip content="Undo last action (Ctrl+Z)" placement="top">
        <Button size="sm" type="outlined">
          <Icon name="undo" />
        </Button>
      </Tooltip>
      <Tooltip content="Redo last action (Ctrl+Y)" placement="top">
        <Button size="sm" type="outlined">
          <Icon name="redo" />
        </Button>
      </Tooltip>
    </View>
  );
}

// Example 12: Status Tooltips
export function StatusTooltips() {
  return (
    <View spacing="md">
      <View spacing="sm">
        <Icon name="circle"  size="sm" />
        <Tooltip content="System is operational">
          <Text style={{ cursor: 'pointer' }}>All Systems Online</Text>
        </Tooltip>
      </View>
      <View spacing="sm">
        <Icon name="circle"  size="sm" />
        <Tooltip content="Some services are experiencing issues">
          <Text style={{ cursor: 'pointer' }}>Partial Outage</Text>
        </Tooltip>
      </View>
      <View spacing="sm">
        <Icon name="circle"  size="sm" />
        <Tooltip content="System is currently offline for maintenance">
          <Text style={{ cursor: 'pointer' }}>System Down</Text>
        </Tooltip>
      </View>
    </View>
  );
}

// Example 13: Keyboard Shortcut Tooltips
export function KeyboardShortcutTooltips() {
  const shortcutContent = (name: string, shortcut: string) => (
    <View spacing="xs">
      <Text size="sm" >
        {name}
      </Text>
      <Text size="sm" >
        {shortcut}
      </Text>
    </View>
  );

  return (
    <View spacing="md">
      <Tooltip content={shortcutContent('New File', 'Ctrl+N')}>
        <Button size="sm" type="outlined">
          <Icon name="file-plus" />
        </Button>
      </Tooltip>
      <Tooltip content={shortcutContent('Open File', 'Ctrl+O')}>
        <Button size="sm" type="outlined">
          <Icon name="folder-open" />
        </Button>
      </Tooltip>
      <Tooltip content={shortcutContent('Save', 'Ctrl+S')}>
        <Button size="sm" type="outlined">
          <Icon name="content-save" />
        </Button>
      </Tooltip>
      <Tooltip content={shortcutContent('Print', 'Ctrl+P')}>
        <Button size="sm" type="outlined">
          <Icon name="printer" />
        </Button>
      </Tooltip>
    </View>
  );
}
