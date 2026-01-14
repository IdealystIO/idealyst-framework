import { forwardRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getWebProps } from 'react-native-unistyles/web';
import { markdownStyles } from './Markdown.styles';
import { createWebRenderers } from '../renderers/web';
import type { MarkdownProps } from './types';

/**
 * Cross-platform Markdown renderer for web.
 *
 * Uses react-markdown with remark-gfm for GitHub Flavored Markdown support.
 * Integrates with @idealyst/theme for consistent styling.
 */
const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  (
    {
      children,
      size = 'md',
      linkIntent = 'primary',
      styleOverrides,
      linkHandler,
      imageHandler,
      codeOptions,
      gfm = true,
      allowHtml = false,
      components: customComponents,
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

    // Create custom component renderers with theme styles
    const renderers = useMemo(
      () =>
        createWebRenderers({
          styles: markdownStyles,
          dynamicProps: { size, linkIntent },
          styleOverrides,
          linkHandler,
          imageHandler,
          codeOptions,
        }),
      [size, linkIntent, styleOverrides, linkHandler, imageHandler, codeOptions]
    );

    // Merge custom components with default renderers
    const mergedComponents = useMemo(
      () => ({
        ...renderers,
        ...customComponents,
      }),
      [renderers, customComponents]
    );

    // Get web props for the container
    const containerStyleArray = [
      (markdownStyles.container as any)({ size, linkIntent }),
      style,
    ];
    const webProps = getWebProps(containerStyleArray);

    // Configure remark plugins
    const remarkPlugins = useMemo(() => {
      const plugins: any[] = [];
      if (gfm) {
        plugins.push(remarkGfm);
      }
      return plugins;
    }, [gfm]);

    return (
      <div
        {...webProps}
        ref={ref}
        id={id}
        data-testid={testID}
        aria-label={accessibilityLabel}
      >
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          components={mergedComponents}
          skipHtml={!allowHtml}
        >
          {children}
        </ReactMarkdown>
      </div>
    );
  }
);

Markdown.displayName = 'Markdown';

export default Markdown;
