import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { scrollViewStyles } from './ScrollView.styles';
import type { ScrollViewProps, ScrollViewRef, ScrollEvent } from './types';
import useMergeRefs from '../hooks/useMergeRefs';
import { useWebLayout } from '../hooks/useWebLayout';
import { flattenStyle } from '../utils/flattenStyle';
import type { IdealystElement } from '../utils/refTypes';

function buildScrollEvent(el: HTMLElement): ScrollEvent {
  const position = { x: el.scrollLeft, y: el.scrollTop };
  const contentSize = { width: el.scrollWidth, height: el.scrollHeight };
  const layoutSize = { width: el.clientWidth, height: el.clientHeight };
  const isAtEnd =
    el.scrollTop + el.clientHeight >= el.scrollHeight - 1 ||
    el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
  const isAtStart = el.scrollLeft <= 0 && el.scrollTop <= 0;

  return { position, contentSize, layoutSize, isAtEnd, isAtStart };
}

/**
 * Scrollable container with scroll event abstractions and imperative scroll controls.
 * Web implementation uses a container + absolutely positioned scrollable region.
 */
const ScrollView = forwardRef<ScrollViewRef, ScrollViewProps>(({
  children,
  direction = 'vertical',
  background = 'transparent',
  radius = 'none',
  border = 'none',
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  backgroundColor: _backgroundColor,
  borderRadius: _borderRadius,
  borderWidth: _borderWidth,
  borderColor: _borderColor,
  style,
  contentContainerStyle,
  showsIndicator = true,
  onScroll,
  onScrollBegin,
  onScrollEnd,
  onEndReached,
  onEndReachedThreshold = 0,
  scrollEnabled = true,
  testID,
  id,
  onLayout,
}, ref) => {
  const scrollElRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const endReachedRef = useRef(false);
  const layoutRef = useWebLayout<HTMLDivElement>(onLayout);

  const backgroundVariant = background === 'transparent' ? undefined : background;

  scrollViewStyles.useVariants({
    background: backgroundVariant,
    radius,
    border,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  /** @ts-ignore */
  const containerWebProps = getWebProps((scrollViewStyles.container as any)({}));
  /** @ts-ignore */
  const scrollRegionWebProps = getWebProps(scrollViewStyles.scrollableRegion);
  /** @ts-ignore */
  const contentWebProps = getWebProps((scrollViewStyles.contentContainer as any)({}));

  // Imperative handle
  useImperativeHandle(ref, () => ({
    scrollTo: (options) => {
      scrollElRef.current?.scrollTo({
        left: options.x ?? 0,
        top: options.y ?? 0,
        behavior: (options.animated ?? true) ? 'smooth' : 'instant',
      });
    },
    scrollToEnd: (options) => {
      const el = scrollElRef.current;
      if (!el) return;
      const behavior = (options?.animated ?? true) ? 'smooth' : 'instant';
      if (direction === 'horizontal') {
        el.scrollTo({ left: el.scrollWidth, behavior });
      } else {
        el.scrollTo({ top: el.scrollHeight, behavior });
      }
    },
    scrollToStart: (options) => {
      scrollElRef.current?.scrollTo({
        left: 0,
        top: 0,
        behavior: (options?.animated ?? true) ? 'smooth' : 'instant',
      });
    },
    getScrollPosition: () => {
      const el = scrollElRef.current;
      return { x: el?.scrollLeft ?? 0, y: el?.scrollTop ?? 0 };
    },
    getInnerElement: () => scrollElRef.current,
  }), [direction]);

  // Scroll event handling
  const handleScroll = useCallback(() => {
    const el = scrollElRef.current;
    if (!el) return;

    const event = buildScrollEvent(el);
    onScroll?.(event);

    // Scroll begin detection (first scroll after idle)
    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      onScrollBegin?.(event);
    }

    // Scroll end detection via timeout
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = false;
      if (el) onScrollEnd?.(buildScrollEvent(el));
    }, 150);

    // End reached detection
    if (onEndReached) {
      const distanceFromEnd = direction === 'horizontal'
        ? el.scrollWidth - el.clientWidth - el.scrollLeft
        : el.scrollHeight - el.clientHeight - el.scrollTop;

      if (distanceFromEnd <= onEndReachedThreshold && !endReachedRef.current) {
        endReachedRef.current = true;
        onEndReached();
      } else if (distanceFromEnd > onEndReachedThreshold) {
        endReachedRef.current = false;
      }
    }
  }, [onScroll, onScrollBegin, onScrollEnd, onEndReached, onEndReachedThreshold, direction]);

  // Attach scroll listener
  useEffect(() => {
    const el = scrollElRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  const mergedRef = useMergeRefs(layoutRef, containerWebProps.ref);

  const flatStyle = flattenStyle(style);
  const flatContentStyle = flattenStyle(contentContainerStyle);

  // Split user styles: sizing/margin to container, visual to content
  const {
    width, height, minWidth, minHeight, maxWidth, maxHeight,
    flex, flexGrow, flexShrink, flexBasis, alignSelf,
    margin: userMargin, marginTop, marginRight, marginBottom, marginLeft,
    marginBlock, marginInline,
    ...restStyle
  } = flatStyle;

  const containerUserStyles: React.CSSProperties = {
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(minWidth !== undefined && { minWidth }),
    ...(minHeight !== undefined && { minHeight }),
    ...(maxWidth !== undefined && { maxWidth }),
    ...(maxHeight !== undefined && { maxHeight }),
    ...(flex !== undefined && { flex }),
    ...(flexGrow !== undefined && { flexGrow }),
    ...(flexShrink !== undefined && { flexShrink }),
    ...(flexBasis !== undefined && { flexBasis }),
    ...(alignSelf !== undefined && { alignSelf }),
    ...(userMargin !== undefined && { margin: userMargin }),
    ...(marginTop !== undefined && { marginTop }),
    ...(marginRight !== undefined && { marginRight }),
    ...(marginBottom !== undefined && { marginBottom }),
    ...(marginLeft !== undefined && { marginLeft }),
    ...(marginBlock !== undefined && { marginBlock }),
    ...(marginInline !== undefined && { marginInline }),
  };

  // Determine overflow direction
  const overflowX = direction === 'horizontal' || direction === 'both' ? 'auto' : 'hidden';
  const overflowY = direction === 'vertical' || direction === 'both' ? 'auto' : 'hidden';

  // Hide scrollbar CSS
  const scrollbarStyle: React.CSSProperties = showsIndicator ? {} : {
    scrollbarWidth: 'none',
  };

  return (
    <div
      {...containerWebProps}
      style={containerUserStyles}
      ref={mergedRef}
      id={id}
      data-testid={testID}
    >
      <div
        {...scrollRegionWebProps}
        ref={scrollElRef}
        style={{
          position: 'absolute',
          inset: 0,
          overflowX: scrollEnabled ? overflowX : 'hidden',
          overflowY: scrollEnabled ? overflowY : 'hidden',
          boxSizing: 'border-box',
          ...scrollbarStyle,
          ...restStyle,
        }}
      >
        <div
          {...contentWebProps}
          style={flatContentStyle}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

ScrollView.displayName = 'ScrollView';

export default ScrollView;
