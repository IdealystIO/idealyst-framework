import { Screen, View, SVGImage, Text } from '../index';

/** @ts-ignore this is a real file */
import testLogo from './test-logo.svg';

export const SVGImageExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View gap="xl">
        <Text typography="h4" align="center">
          SVG Image Examples
        </Text>
        
        {/* Local SVG File Example */}
        <View gap="md">
          <Text typography="subtitle1">Loading Local SVG File</Text>
          <Text typography="body2">
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
        <View gap="md">
          <Text typography="subtitle1">Intent Colors</Text>
          <Text typography="body2">
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
        <View gap="md">
          <Text typography="subtitle1">Custom Colors</Text>
          <Text typography="body2">
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
        <View gap="md">
          <Text typography="subtitle1">Loading from URL</Text>
          <Text typography="body2">
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
        <View gap="md">
          <Text typography="subtitle1">Resize Modes</Text>
          <Text typography="body2">
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
        <View gap="md">
          <Text typography="subtitle1">Usage Tips</Text>
          <View gap="sm">
            <Text typography="body2">
              • <Text weight="semibold">Local files:</Text> Use relative paths for bundled SVG files
            </Text>
            <Text typography="body2">
              • <Text weight="semibold">Remote URLs:</Text> Use {`{ uri: "https://..." }`} format
            </Text>
            <Text typography="body2">
              • <Text weight="semibold">React Native:</Text> Local SVGs have limited support - use remote URLs or convert to PNG
            </Text>
            <Text typography="body2">
              • <Text weight="semibold">Coloring:</Text> Works best with single-color SVG icons
            </Text>
            <Text typography="body2">
              • <Text weight="semibold">Performance:</Text> Cache remote SVGs for better performance
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};