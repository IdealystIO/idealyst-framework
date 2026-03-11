import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import {
  ScrollView as RNScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';
import { scrollViewStyles } from './ScrollView.styles';
import type { ScrollViewProps, ScrollViewRef, ScrollEvent } from './types';
import type { IdealystElement } from '../utils/refTypes';

function buildScrollEvent(e: NativeScrollEvent): ScrollEvent {
  const { contentOffset, contentSize, layoutMeasurement } = e;
  const isVerticalEnd =
    contentOffset.y + layoutMeasurement.height >= contentSize.height - 1;
  const isHorizontalEnd =
    contentOffset.x + layoutMeasurement.width >= contentSize.width - 1;

  return {
    position: { x: contentOffset.x, y: contentOffset.y },
    contentSize: { width: contentSize.width, height: contentSize.height },
    layoutSize: { width: layoutMeasurement.width, height: layoutMeasurement.height },
    isAtEnd: isVerticalEnd || isHorizontalEnd,
    isAtStart: contentOffset.x <= 0 && contentOffset.y <= 0,
  };
}

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
  backgroundColor,
  borderRadius,
  borderWidth,
  borderColor,
  style,
  contentContainerStyle,
  showsIndicator = true,
  pagingEnabled = false,
  bounces = true,
  onScroll,
  onScrollBegin,
  onScrollEnd,
  onEndReached,
  onEndReachedThreshold = 0,
  scrollEventThrottle = 16,
  scrollEnabled = true,
  keyboardDismissMode = 'none',
  testID,
  id,
  onLayout,
}, ref) => {
  const scrollRef = useRef<RNScrollView>(null);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const endReachedRef = useRef(false);

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

  const containerStyle = (scrollViewStyles.container as any)({});
  const contentStyle = (scrollViewStyles.contentContainer as any)({});

  const overrideStyles: ViewStyle = {};
  if (backgroundColor) overrideStyles.backgroundColor = backgroundColor;
  if (borderRadius !== undefined) overrideStyles.borderRadius = borderRadius;
  if (borderWidth !== undefined) overrideStyles.borderWidth = borderWidth;
  if (borderColor) overrideStyles.borderColor = borderColor;

  // Imperative handle
  useImperativeHandle(ref, () => ({
    scrollTo: (options) => {
      scrollRef.current?.scrollTo({
        x: options.x ?? 0,
        y: options.y ?? 0,
        animated: options.animated ?? true,
      });
    },
    scrollToEnd: (options) => {
      scrollRef.current?.scrollToEnd({ animated: options?.animated ?? true });
    },
    scrollToStart: (options) => {
      scrollRef.current?.scrollTo({
        x: 0,
        y: 0,
        animated: options?.animated ?? true,
      });
    },
    getScrollPosition: () => lastPositionRef.current,
    getInnerElement: () => scrollRef.current,
  }), []);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const event = buildScrollEvent(e.nativeEvent);
    lastPositionRef.current = event.position;

    onScroll?.(event);

    // End reached detection
    if (onEndReached) {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const distanceFromEnd = direction === 'horizontal'
        ? contentSize.width - layoutMeasurement.width - contentOffset.x
        : contentSize.height - layoutMeasurement.height - contentOffset.y;

      if (distanceFromEnd <= onEndReachedThreshold && !endReachedRef.current) {
        endReachedRef.current = true;
        onEndReached();
      } else if (distanceFromEnd > onEndReachedThreshold) {
        endReachedRef.current = false;
      }
    }
  }, [onScroll, onEndReached, onEndReachedThreshold, direction]);

  const handleScrollBeginDrag = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScrollBegin?.(buildScrollEvent(e.nativeEvent));
  }, [onScrollBegin]);

  const handleMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScrollEnd?.(buildScrollEvent(e.nativeEvent));
  }, [onScrollEnd]);

  const isHorizontal = direction === 'horizontal';

  return (
    <RNScrollView
      ref={scrollRef}
      style={[containerStyle, overrideStyles, style]}
      contentContainerStyle={[contentStyle, contentContainerStyle]}
      horizontal={isHorizontal}
      showsVerticalScrollIndicator={!isHorizontal && showsIndicator}
      showsHorizontalScrollIndicator={isHorizontal && showsIndicator}
      pagingEnabled={pagingEnabled}
      bounces={bounces}
      scrollEnabled={scrollEnabled}
      scrollEventThrottle={scrollEventThrottle}
      keyboardDismissMode={keyboardDismissMode}
      onScroll={handleScroll}
      onScrollBeginDrag={onScrollBegin ? handleScrollBeginDrag : undefined}
      onMomentumScrollEnd={onScrollEnd ? handleMomentumScrollEnd : undefined}
      onLayout={onLayout}
      testID={testID}
      nativeID={id}
    >
      {children}
    </RNScrollView>
  );
});

ScrollView.displayName = 'ScrollView';

export default ScrollView;
