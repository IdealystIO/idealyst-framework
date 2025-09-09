import { Screen, View, SVGImage, Text } from '../index';
import testLogo from './test-logo.svg';

export const SVGImageExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
        <Text size="large" weight="bold" align="center">
          SVG Image Examples
        </Text>
        
        {/* Local SVG File Example */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Loading Local SVG File</Text>
          <Text size="small">
            Using the test-logo.svg file - works on web, limited support on React Native
          </Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Original size */}
            <SVGImage 
              source={testLogo}
              width={102} 
              height={30}
            />
            
            {/* Smaller version */}
            <SVGImage 
              source={testLogo}
              width={68} 
              height={20}
            />
            
            {/* Using size prop */}
            <SVGImage 
              source={testLogo}
              size={40}
            />
          </View>
        </View>

        {/* Intent Colors */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Intent Colors</Text>
          <Text size="small">
            SVG images with theme-based coloring
          </Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <SVGImage 
              source={testLogo}
              width={102} 
              height={30}
              intent="primary"
            />
            <SVGImage 
              source={testLogo}
              width={102} 
              height={30}
              intent="success"
            />
            <SVGImage 
              source={testLogo}
              width={102} 
              height={30}
              intent="error"
            />
            <SVGImage 
              source={testLogo}
              width={102} 
              height={30}
              intent="warning"
            />
          </View>
        </View>

        {/* Custom Colors */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Custom Colors</Text>
          <Text size="small">
            Direct color specification
          </Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <SVGImage 
              source={testLogo}
              width={102} 
              height={30}
              color="#ff6b6b"
            />
            <SVGImage 
              source={testLogo}
              width={102} 
              height={30}
              color="#4ecdc4"
            />
            <SVGImage 
              source={testLogo}
              width={102} 
              height={30}
              color="#45b7d1"
            />
          </View>
        </View>

        {/* Remote URL Example */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Loading from URL</Text>
          <Text size="small">
            SVG images loaded from remote URLs (web only for security)
          </Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <SVGImage 
              source={{ uri: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg" }}
              width={60} 
              height={60}
            />
            <SVGImage 
              source={{ uri: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg" }}
              width={60} 
              height={60}
              intent="primary"
            />
            <SVGImage 
              source={{ uri: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg" }}
              width={60} 
              height={60}
              intent="success"
            />
          </View>
        </View>

        {/* Resize Modes */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Resize Modes</Text>
          <Text size="small">
            Different ways to fit SVG images in containers
          </Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <View style={{ width: 80, height: 40, backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <SVGImage 
                source={testLogo}
                width="100%" 
                height="100%"
                resizeMode="contain"
              />
            </View>
            <View style={{ width: 80, height: 40, backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <SVGImage 
                source={testLogo}
                width="100%" 
                height="100%"
                resizeMode="cover"
              />
            </View>
            <View style={{ width: 80, height: 40, backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <SVGImage 
                source={testLogo}
                width="100%" 
                height="100%"
                resizeMode="stretch"
              />
            </View>
          </View>
        </View>

        {/* Usage Tips */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Usage Tips</Text>
          <View spacing="sm">
            <Text size="small">
              • <Text weight="semibold">Local files:</Text> Use relative paths for bundled SVG files
            </Text>
            <Text size="small">
              • <Text weight="semibold">Remote URLs:</Text> Use {`{ uri: "https://..." }`} format
            </Text>
            <Text size="small">
              • <Text weight="semibold">React Native:</Text> Local SVGs have limited support - use remote URLs or convert to PNG
            </Text>
            <Text size="small">
              • <Text weight="semibold">Coloring:</Text> Works best with single-color SVG icons
            </Text>
            <Text size="small">
              • <Text weight="semibold">Performance:</Text> Cache remote SVGs for better performance
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};