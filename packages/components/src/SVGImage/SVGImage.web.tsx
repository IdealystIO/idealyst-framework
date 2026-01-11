import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { SVGImageProps } from './types';
import { svgImageStyles } from './SVGImage.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const SVGImage = forwardRef<HTMLDivElement, SVGImageProps>(({
  source,
  width,
  height,
  size,
  color,
  intent,
  resizeMode = 'contain',
  style,
  testID,
  id,
  ...props
}, ref) => {
  // Apply variants using Unistyles 3.0 pattern
  if (intent) {
    svgImageStyles.useVariants({
      intent,
    });
  }

  // Determine dimensions - size takes precedence over individual width/height
  const finalWidth = size || width;
  const finalHeight = size || height;

  // Handle React components (imported SVG components)
  if (typeof source === 'function') {
    const SvgComponent = source;
    const componentContainerProps = getWebProps([svgImageStyles.container, style as any]);
    const mergedRefForComponent = useMergeRefs(ref, componentContainerProps.ref);
    return (
      <div {...componentContainerProps} ref={mergedRefForComponent} {...(props as any)} id={id} data-testid={testID}>
        <SvgComponent
          width={finalWidth || 24}
          height={finalHeight || 24}
          fill={color || 'currentColor'}
          color={color || 'currentColor'}
        />
      </div>
    );
  }

  // Determine source URL
  const sourceUrl = typeof source === 'string' ? source : source.uri;

  // Create the style array
  const containerStyleArray = [
    svgImageStyles.container,
    style as any,
  ];

  // Use getWebProps to generate className and ref for web
  const containerWebProps = getWebProps(containerStyleArray);
  const imageWebProps = getWebProps([svgImageStyles.image as any]);

  // Apply custom color if provided
  // Convert React Native resize modes to CSS object-fit values
  const getObjectFit = (mode: 'contain' | 'cover' | 'stretch'): React.CSSProperties['objectFit'] => {
    switch (mode) {
      case 'contain': return 'contain';
      case 'cover': return 'cover';
      case 'stretch': return 'fill';
      default: return 'contain';
    }
  };

  const imageStyle: React.CSSProperties = {
    width: finalWidth,
    height: finalHeight,
    objectFit: getObjectFit(resizeMode),
    ...(color && {
      filter: `brightness(0) saturate(100%) ${color}`,
    }),
  };

  const mergedRef = useMergeRefs(ref, containerWebProps.ref);

  return (
    <div {...containerWebProps} ref={mergedRef} {...(props as any)} id={id} data-testid={testID}>
      <img
        {...imageWebProps}
        src={sourceUrl}
        alt="SVG Image"
        style={imageStyle}
      />
    </div>
  );
});

SVGImage.displayName = 'SVGImage';

export default SVGImage;