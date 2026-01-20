import { forwardRef } from 'react';
import { View as RNView, ScrollView as RNScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenProps } from './types';
import { screenStyles } from './Screen.styles';
import type { IdealystElement } from '../utils/refTypes';

const Screen = forwardRef<IdealystElement, ScreenProps>(({
  children,
  background = 'screen',
  safeArea = true,
  scrollable = true,
  contentInset,
  onLayout,
  // Spacing variants from ContainerStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  id,
}, ref) => {
  const insets = useSafeAreaInsets();

  // Handle 'transparent' background separately since it's not a surface color key
  // The $surface iterator only expands to actual surface color keys
  const backgroundVariant = background === 'transparent' ? undefined : background;

  // Set active variants for this render
  screenStyles.useVariants({
    background: backgroundVariant,
    safeArea,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Call styles as functions to get theme-reactive styles
  const screenStyle = (screenStyles.screen as any)({});

  // Calculate safe area padding
  const safeAreaStyle = safeArea ? {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  } : undefined;

  if (scrollable) {
    // Content styles applied via View wrapper for Unistyles reactivity
    // (contentContainerStyle isn't reactive, only style prop is)
    const contentInsetStyle = contentInset ? {
      paddingTop: (safeArea ? insets.top : 0) + (contentInset.top ?? 0),
      paddingBottom: (safeArea ? insets.bottom : 0) + (contentInset.bottom ?? 0),
      paddingLeft: (safeArea ? insets.left : 0) + (contentInset.left ?? 0),
      paddingRight: (safeArea ? insets.right : 0) + (contentInset.right ?? 0),
    } : safeAreaStyle;

    return (
      <RNScrollView
        ref={ref as any}
        nativeID={id}
        style={[screenStyle, style]}
        contentContainerStyle={{ flexGrow: 1 }}
        testID={testID}
        onLayout={onLayout}
      >
        <RNView style={[contentInsetStyle, { flex: 1 }]}>
          {children}
        </RNView>
      </RNScrollView>
    );
  }

  return (
    <RNView ref={ref as any} nativeID={id} style={[screenStyle, safeAreaStyle, style]} testID={testID} onLayout={onLayout}>
      {children}
    </RNView>
  );
});

Screen.displayName = 'Screen';

export default Screen;
