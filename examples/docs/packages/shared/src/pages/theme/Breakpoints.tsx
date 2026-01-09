import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { useBreakpoint, useScreenWidth, useResponsiveStyle } from '@idealyst/theme';

// Separate component for screen width to isolate re-renders
function ScreenWidthDisplay() {
  const screenWidth = useScreenWidth();
  return (
    <Text typography="h4" weight="semibold">
      {Math.round(screenWidth)}px
    </Text>
  );
}

// Interactive demo boxes that respond to breakpoints
// Only re-renders when breakpoint changes, not on every pixel
function ResponsiveBoxes() {
  const currentBreakpoint = useBreakpoint();
  const bp = currentBreakpoint || 'xs';

  // Use useResponsiveStyle for memoized responsive styles
  const widthBoxStyle = useResponsiveStyle({
    height: 60,
    width: { xs: 100, sm: 150, md: 200, lg: 300, xl: 400 },
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  });

  const paddingBoxStyle = useResponsiveStyle({
    padding: { xs: 8, sm: 16, md: 24, lg: 32, xl: 48 },
    alignSelf: 'flex-start',
    backgroundColor: '#22c55e',
    borderRadius: 8,
  });

  const flexContainerStyle = useResponsiveStyle({
    flexDirection: { xs: 'column', md: 'row' },
    gap: 8,
  });

  return (
    <View id='123' style={{ gap: 24 }}>
      {/* Current breakpoint indicator */}
      <Card type="outlined" style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text typography="body2" color="secondary" style={{ marginBottom: 4 }}>
              Current Breakpoint
            </Text>
            <Text typography="h3" weight="bold" color="link">
              {bp.toUpperCase()}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text typography="body2" color="secondary" style={{ marginBottom: 4 }}>
              Screen Width
            </Text>
            <ScreenWidthDisplay />
          </View>
        </View>
      </Card>

      {/* Responsive width demo */}
      <View>
        <Text typography="body2" weight="semibold" style={{ marginBottom: 8 }}>
          Responsive Width Box
        </Text>
        <View style={widthBoxStyle}>
          <Text color="inverse" weight="medium">
            {bp}: {
              bp === 'xs' ? '100px' :
              bp === 'sm' ? '150px' :
              bp === 'md' ? '200px' :
              bp === 'lg' ? '300px' :
              bp === 'xl' ? '400px' : '?'
            }
          </Text>
        </View>
      </View>

      {/* Responsive padding demo */}
      <View>
        <Text typography="body2" weight="semibold" style={{ marginBottom: 8 }}>
          Responsive Padding Box
        </Text>
        <View style={paddingBoxStyle}>
          <Text color="inverse" weight="medium">
            Padding: {
              bp === 'xs' ? '8px' :
              bp === 'sm' ? '16px' :
              bp === 'md' ? '24px' :
              bp === 'lg' ? '32px' :
              bp === 'xl' ? '48px' : '?'
            }
          </Text>
        </View>
      </View>

      {/* Responsive flex direction demo */}
      <View>
        <Text typography="body2" weight="semibold" style={{ marginBottom: 8 }}>
          Responsive Flex Direction
        </Text>
        <View id={'456'} style={flexContainerStyle}>
          <View radius="sm" style={{ padding: 16, flex: 1, backgroundColor: '#f97316' }}>
            <Text color="inverse" weight="medium" align="center">Box 1</Text>
          </View>
          <View radius="sm" style={{ padding: 16, flex: 1, backgroundColor: '#f97316' }}>
            <Text color="inverse" weight="medium" align="center">Box 2</Text>
          </View>
          <View radius="sm" style={{ padding: 16, flex: 1, backgroundColor: '#f97316' }}>
            <Text color="inverse" weight="medium" align="center">Box 3</Text>
          </View>
        </View>
        <Text typography="caption" color="tertiary" style={{ marginTop: 4 }}>
          {bp === 'xs' || bp === 'sm' ? 'Column layout (xs-sm)' : 'Row layout (md+)'}
        </Text>
      </View>
    </View>
  );
}

// Code example component
function CodeBlock({ children }: { children: string }) {
  return (
    <View
      background="inverse-secondary"
      radius="md"
      style={{ padding: 16, marginVertical: 16 }}
    >
      <Text
        typography="body2"
        color="inverse"
        style={{ fontFamily: 'monospace', whiteSpace: 'pre', lineHeight: 22 }}
      >
        {children}
      </Text>
    </View>
  );
}

export function BreakpointsPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Breakpoints
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Idealyst supports responsive styles using breakpoint-based values.
          Any style property can accept an object mapping breakpoint names to values.
        </Text>

        {/* Default breakpoints */}
        <Text typography="h4" weight="semibold" style={{ marginBottom: 12 }}>
          Default Breakpoints
        </Text>

        <Card type="outlined" style={{ padding: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {[
              { name: 'xs', value: '0px', desc: 'Extra small (phones)' },
              { name: 'sm', value: '576px', desc: 'Small (large phones)' },
              { name: 'md', value: '768px', desc: 'Medium (tablets)' },
              { name: 'lg', value: '992px', desc: 'Large (desktops)' },
              { name: 'xl', value: '1200px', desc: 'Extra large (wide screens)' },
            ].map(bp => (
              <View key={bp.name} style={{ minWidth: 140 }}>
                <Text typography="body1" weight="bold" color="link">{bp.name}</Text>
                <Text typography="body2" weight="medium">{bp.value}+</Text>
                <Text typography="caption" color="tertiary">{bp.desc}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Basic syntax */}
        <Text typography="h4" weight="semibold" style={{ marginBottom: 12 }}>
          useResponsiveStyle Hook
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 8, lineHeight: 24 }}>
          Use the <Text weight="semibold">useResponsiveStyle</Text> hook to create responsive styles.
          Pass an object with breakpoint keys for any style property:
        </Text>

        <CodeBlock>{`import { useResponsiveStyle } from '@idealyst/theme';

function MyComponent() {
  const containerStyle = useResponsiveStyle({
    width: { xs: 100, sm: 200, md: 300, lg: 400, xl: 500 },
    padding: { xs: 8, md: 16, lg: 24 },
    flexDirection: { xs: 'column', md: 'row' },
    backgroundColor: '#3b82f6', // Non-responsive values pass through
  });

  return <View style={containerStyle}>...</View>;
}`}</CodeBlock>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 24 }}>
          Values cascade up - if you only define <Text weight="semibold">xs</Text> and <Text weight="semibold">md</Text>,
          the <Text weight="semibold">xs</Text> value applies to <Text weight="semibold">sm</Text> as well.
          The hook is memoized and only re-renders when the screen width changes.
        </Text>

        {/* Hooks section */}
        <Text typography="h4" weight="semibold" style={{ marginBottom: 12 }}>
          Breakpoint Utility Hooks
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 8, lineHeight: 24 }}>
          For conditional rendering based on breakpoints, use the provided utility hooks:
        </Text>

        <CodeBlock>{`import { useBreakpoint, useBreakpointUp, useBreakpointDown } from '@idealyst/theme';

function MyComponent() {
  // Get current breakpoint name
  const breakpoint = useBreakpoint(); // 'xs' | 'sm' | 'md' | 'lg' | 'xl'

  // Check if at or above a breakpoint
  const isDesktop = useBreakpointUp('lg');

  // Check if below a breakpoint
  const isMobile = useBreakpointDown('md');

  return (
    <View>
      {isMobile && <MobileNav />}
      {isDesktop && <DesktopSidebar />}
    </View>
  );
}`}</CodeBlock>

        {/* Live demo */}
        <Text typography="h4" weight="semibold" style={{ marginBottom: 12, marginTop: 8 }}>
          Live Demo
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Resize your browser window to see responsive styles in action:
        </Text>

        <ResponsiveBoxes />
      </View>
    </Screen>
  );
}
