import { PrimitiveRule, PrimitiveRuleSet } from '../types';

/**
 * Module sources that indicate React Native platform
 */
export const REACT_NATIVE_SOURCES = [
  'react-native',
  'react-native-web',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-svg',
  '@react-native-vector-icons/material-design-icons',
  '@react-native-vector-icons/common',
  '@react-native-community/async-storage',
  '@react-native-picker/picker',
  'expo',
  'expo-constants',
  'expo-linking',
  'expo-status-bar',
] as const;

/**
 * Core React Native view primitives
 */
const CORE_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'View',
    source: 'react-native',
    platform: 'react-native',
    description: 'Basic container component',
  },
  {
    name: 'Text',
    source: 'react-native',
    platform: 'react-native',
    description: 'Text display component',
  },
  {
    name: 'Image',
    source: 'react-native',
    platform: 'react-native',
    description: 'Image display component',
  },
  {
    name: 'ImageBackground',
    source: 'react-native',
    platform: 'react-native',
    description: 'Background image container',
  },
  {
    name: 'ScrollView',
    source: 'react-native',
    platform: 'react-native',
    description: 'Scrollable container',
  },
  {
    name: 'FlatList',
    source: 'react-native',
    platform: 'react-native',
    description: 'Performant list component',
  },
  {
    name: 'SectionList',
    source: 'react-native',
    platform: 'react-native',
    description: 'Sectioned list component',
  },
  {
    name: 'VirtualizedList',
    source: 'react-native',
    platform: 'react-native',
    description: 'Base virtualized list',
  },
];

/**
 * Interactive/touchable primitives
 */
const INTERACTIVE_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'TouchableOpacity',
    source: 'react-native',
    platform: 'react-native',
    description: 'Touch with opacity feedback',
  },
  {
    name: 'TouchableHighlight',
    source: 'react-native',
    platform: 'react-native',
    description: 'Touch with highlight feedback',
  },
  {
    name: 'TouchableWithoutFeedback',
    source: 'react-native',
    platform: 'react-native',
    description: 'Touch without visual feedback',
  },
  {
    name: 'TouchableNativeFeedback',
    source: 'react-native',
    platform: 'react-native',
    description: 'Android ripple feedback',
  },
  {
    name: 'Pressable',
    source: 'react-native',
    platform: 'react-native',
    description: 'Modern press handler component',
  },
  {
    name: 'Button',
    source: 'react-native',
    platform: 'react-native',
    description: 'Basic button component',
  },
];

/**
 * Input primitives
 */
const INPUT_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'TextInput',
    source: 'react-native',
    platform: 'react-native',
    description: 'Text input field',
  },
  {
    name: 'Switch',
    source: 'react-native',
    platform: 'react-native',
    description: 'Toggle switch component',
  },
  {
    name: 'Slider',
    source: 'react-native',
    platform: 'react-native',
    description: 'Slider input (deprecated)',
  },
];

/**
 * Modal and overlay primitives
 */
const MODAL_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'Modal',
    source: 'react-native',
    platform: 'react-native',
    description: 'Modal overlay component',
  },
  {
    name: 'Alert',
    source: 'react-native',
    platform: 'react-native',
    description: 'Native alert dialog',
  },
  {
    name: 'ActionSheetIOS',
    source: 'react-native',
    platform: 'react-native',
    description: 'iOS action sheet',
  },
  {
    name: 'StatusBar',
    source: 'react-native',
    platform: 'react-native',
    description: 'Status bar controller',
  },
];

/**
 * Animation primitives
 */
const ANIMATION_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'Animated',
    source: 'react-native',
    platform: 'react-native',
    description: 'Animation library namespace',
  },
  {
    name: 'Easing',
    source: 'react-native',
    platform: 'react-native',
    description: 'Easing functions',
  },
  {
    name: 'LayoutAnimation',
    source: 'react-native',
    platform: 'react-native',
    description: 'Layout animation controller',
  },
];

/**
 * Platform and device primitives
 */
const PLATFORM_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'Platform',
    source: 'react-native',
    platform: 'react-native',
    description: 'Platform detection utility',
  },
  {
    name: 'Dimensions',
    source: 'react-native',
    platform: 'react-native',
    description: 'Screen dimensions utility',
  },
  {
    name: 'PixelRatio',
    source: 'react-native',
    platform: 'react-native',
    description: 'Pixel ratio utility',
  },
  {
    name: 'Appearance',
    source: 'react-native',
    platform: 'react-native',
    description: 'Color scheme detection',
  },
  {
    name: 'useColorScheme',
    source: 'react-native',
    platform: 'react-native',
    description: 'Color scheme hook',
  },
  {
    name: 'useWindowDimensions',
    source: 'react-native',
    platform: 'react-native',
    description: 'Window dimensions hook',
  },
];

/**
 * Event handling primitives
 */
const EVENT_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'BackHandler',
    source: 'react-native',
    platform: 'react-native',
    description: 'Android back button handler',
  },
  {
    name: 'Keyboard',
    source: 'react-native',
    platform: 'react-native',
    description: 'Keyboard event handler',
  },
  {
    name: 'PanResponder',
    source: 'react-native',
    platform: 'react-native',
    description: 'Gesture responder system',
  },
  {
    name: 'Linking',
    source: 'react-native',
    platform: 'react-native',
    description: 'Deep linking utility',
  },
  {
    name: 'AppState',
    source: 'react-native',
    platform: 'react-native',
    description: 'App lifecycle state',
  },
];

/**
 * Safety primitives
 */
const SAFETY_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'SafeAreaView',
    source: 'react-native',
    platform: 'react-native',
    description: 'Safe area inset container',
  },
  {
    name: 'KeyboardAvoidingView',
    source: 'react-native',
    platform: 'react-native',
    description: 'Keyboard avoidance container',
  },
];

/**
 * Accessibility primitives
 */
const ACCESSIBILITY_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'AccessibilityInfo',
    source: 'react-native',
    platform: 'react-native',
    description: 'Accessibility information API',
  },
];

/**
 * Style primitives
 */
const STYLE_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'StyleSheet',
    source: 'react-native',
    platform: 'react-native',
    description: 'Style sheet creator',
  },
];

/**
 * All React Native primitives combined
 */
export const REACT_NATIVE_PRIMITIVES: PrimitiveRule[] = [
  ...CORE_PRIMITIVES,
  ...INTERACTIVE_PRIMITIVES,
  ...INPUT_PRIMITIVES,
  ...MODAL_PRIMITIVES,
  ...ANIMATION_PRIMITIVES,
  ...PLATFORM_PRIMITIVES,
  ...EVENT_PRIMITIVES,
  ...SAFETY_PRIMITIVES,
  ...ACCESSIBILITY_PRIMITIVES,
  ...STYLE_PRIMITIVES,
];

/**
 * Set of primitive names for quick lookup
 */
export const REACT_NATIVE_PRIMITIVE_NAMES = new Set(
  REACT_NATIVE_PRIMITIVES.map((p) => p.name)
);

/**
 * Complete rule set for React Native
 */
export const REACT_NATIVE_RULE_SET: PrimitiveRuleSet = {
  platform: 'react-native',
  primitives: REACT_NATIVE_PRIMITIVES,
  sources: [...REACT_NATIVE_SOURCES],
};

/**
 * Check if a name is a React Native primitive
 */
export function isReactNativePrimitive(name: string): boolean {
  return REACT_NATIVE_PRIMITIVE_NAMES.has(name);
}

/**
 * Get primitive info by name
 */
export function getReactNativePrimitive(name: string): PrimitiveRule | undefined {
  return REACT_NATIVE_PRIMITIVES.find((p) => p.name === name);
}
