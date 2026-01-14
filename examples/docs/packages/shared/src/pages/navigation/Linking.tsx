import React, { useState } from 'react';
import { View, Text, Card, Screen, Button } from '@idealyst/components';
import { Linking } from '@idealyst/navigation';
import { CodeBlock } from '../../components/CodeBlock';
import { LivePreview } from '../../components/LivePreview';

export function LinkingPage() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleOpenExternal = async () => {
    setLastAction('Opening in new tab...');
    await Linking.open('https://github.com/anthropics/claude-code');
  };

  const handleOpenSameTab = async () => {
    setLastAction('Navigating in same tab...');
    // Using external=false would navigate away, so we'll just show the action
    setLastAction('Would navigate to URL in same tab (disabled in demo)');
  };

  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Linking
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          The Linking utility provides a cross-platform way to open external URLs.
          On web, it uses <Text weight="semibold">window.open</Text>. On native,
          it uses React Native's <Text weight="semibold">Linking</Text> API.
        </Text>

        {/* Basic Usage */}
        <Text weight="semibold" typography="h3" style={{ marginBottom: 16 }}>
          Basic Usage
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Import the <Text weight="semibold">Linking</Text> object from @idealyst/navigation
          and call the <Text weight="semibold">open</Text> method with a URL.
        </Text>

        <CodeBlock
          title="Opening a URL"
          code={`import { Linking } from '@idealyst/navigation';

// Open URL in new tab (web) or external app (native)
await Linking.open('https://example.com');

// Explicitly specify external = true (default)
await Linking.open('https://example.com', true);`}
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 24, marginBottom: 12 }}>
          Live Example
        </Text>

        <LivePreview title="Open External URL">
          <Card style={{ padding: 16 }}>
            <Button
              intent="primary"
              onPress={handleOpenExternal}
              style={{ marginBottom: 12 }}
            >
              Open GitHub (New Tab)
            </Button>
            {lastAction && (
              <Text typography="body2" color="tertiary">
                {lastAction}
              </Text>
            )}
          </Card>
        </LivePreview>

        {/* External Parameter */}
        <Text weight="semibold" typography="h3" style={{ marginTop: 48, marginBottom: 16 }}>
          External Parameter
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          The second parameter controls how the URL is opened on web:
        </Text>

        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <Text weight="semibold" style={{ width: 120 }}>external=true</Text>
            <Text color="secondary">Opens in a new tab (default)</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text weight="semibold" style={{ width: 120 }}>external=false</Text>
            <Text color="secondary">Navigates in the current tab</Text>
          </View>
        </View>

        <CodeBlock
          title="Same Tab Navigation (Web)"
          code={`import { Linking } from '@idealyst/navigation';

// Open in the same tab (web only - navigates away from current page)
await Linking.open('https://example.com', false);`}
        />

        <Card intent="warning" style={{ padding: 16, marginTop: 16 }}>
          <Text weight="semibold" style={{ marginBottom: 8 }}>Note</Text>
          <Text typography="body2" color="secondary" style={{ lineHeight: 22 }}>
            On native platforms, the <Text weight="semibold">external</Text> parameter
            is ignored. URLs always open in the device's default browser or
            appropriate app handler.
          </Text>
        </Card>

        {/* API Reference */}
        <Text weight="semibold" typography="h3" style={{ marginTop: 48, marginBottom: 16 }}>
          API Reference
        </Text>

        <CodeBlock
          title="Linking.open"
          code={`Linking.open(url: string, external: boolean = true): Promise<void>

Parameters:
  url      - The URL to open
  external - If true, opens in new tab (web) or external app (native)
             Defaults to true (new tab / external app)

Returns:
  Promise that resolves when the URL is opened`}
        />

        {/* Platform Behavior */}
        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Platform Behavior
        </Text>

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Card style={{ flex: 1, minWidth: 280, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Web</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              {`• Uses window.open() for external links
• Opens in new tab with noopener,noreferrer
• external=false uses window.location.href`}
            </Text>
          </Card>

          <Card style={{ flex: 1, minWidth: 280, padding: 20 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>Native</Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              {`• Uses React Native's Linking.openURL()
• Checks canOpenURL before opening
• Logs warning if URL cannot be opened`}
            </Text>
          </Card>
        </View>

        {/* Common Use Cases */}
        <Text weight="semibold" typography="h3" style={{ marginTop: 48, marginBottom: 16 }}>
          Common Use Cases
        </Text>

        <CodeBlock
          title="Social Links"
          code={`import { Linking } from '@idealyst/navigation';

function SocialLinks() {
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <Button
        type="ghost"
        onPress={() => Linking.open('https://twitter.com/myapp')}
      >
        Twitter
      </Button>
      <Button
        type="ghost"
        onPress={() => Linking.open('https://github.com/myapp')}
      >
        GitHub
      </Button>
    </View>
  );
}`}
        />

        <CodeBlock
          title="Support & Documentation Links"
          code={`import { Linking } from '@idealyst/navigation';

function HelpMenu() {
  const openDocs = () => Linking.open('https://docs.myapp.com');
  const openSupport = () => Linking.open('mailto:support@myapp.com');
  const openPrivacy = () => Linking.open('https://myapp.com/privacy');

  return (
    <Menu>
      <MenuItem label="Documentation" onPress={openDocs} />
      <MenuItem label="Contact Support" onPress={openSupport} />
      <MenuItem label="Privacy Policy" onPress={openPrivacy} />
    </Menu>
  );
}`}
        />
      </View>
    </Screen>
  );
}
