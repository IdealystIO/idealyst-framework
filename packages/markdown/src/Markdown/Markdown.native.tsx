import { forwardRef, useMemo, ComponentRef } from 'react';
import { View, Linking } from 'react-native';
import MarkdownDisplay from 'react-native-markdown-display';
import { markdownStyles } from './Markdown.styles';
import { createNativeStyles } from '../renderers/native/createNativeStyles';
import type { MarkdownProps } from './types';

/**
 * Cross-platform Markdown renderer for React Native.
 *
 * Uses react-native-markdown-display for native rendering.
 * Integrates with @idealyst/theme for consistent styling.
 */
const Markdown = forwardRef<ComponentRef<typeof View>, MarkdownProps>(
  (
    {
      children,
      size = 'md',
      linkIntent = 'primary',
      styleOverrides,
      linkHandler,
      imageHandler,
      codeOptions: _codeOptions,
      gfm: _gfm = true,
      allowHtml: _allowHtml = false,
      components: _customComponents,
      style,
      testID,
      id,
      accessibilityLabel,
    },
    ref
  ) => {
    // Apply variants for size and linkIntent
    markdownStyles.useVariants({
      size,
      linkIntent,
    });

    // Create native style rules from theme styles
    const nativeStyles = useMemo(
      () =>
        createNativeStyles({
          styles: markdownStyles,
          dynamicProps: { size, linkIntent },
          styleOverrides,
        }),
      [size, linkIntent, styleOverrides]
    );

    // Handle link presses
    const handleLinkPress = (url: string): boolean => {
      if (linkHandler?.onLinkPress) {
        const preventDefault = linkHandler.onLinkPress(url);
        if (preventDefault) {
          return false; // Don't open the link
        }
      }

      // Open external links if enabled (default)
      if (linkHandler?.openExternalLinks ?? true) {
        Linking.openURL(url).catch(console.warn);
      }

      return false; // We handle it ourselves
    };

    return (
      <View
        ref={ref}
        nativeID={id}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        style={[
          (markdownStyles.container as any)({ size, linkIntent }),
          style,
        ]}
      >
        <MarkdownDisplay
          style={nativeStyles}
          onLinkPress={handleLinkPress}
        >
          {children}
        </MarkdownDisplay>
      </View>
    );
  }
);

Markdown.displayName = 'Markdown';

export default Markdown;
