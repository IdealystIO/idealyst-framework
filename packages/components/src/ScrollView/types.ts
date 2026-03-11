import { Size, Surface } from '@idealyst/theme';
import type { ReactNode, RefObject } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ContainerStyleProps } from '../utils/viewStyleProps';
import type { LayoutChangeEvent } from '../hooks/useWebLayout';

export type { LayoutChangeEvent };

// Component-specific type aliases
export type ScrollViewBackgroundVariant = Surface | 'transparent';
export type ScrollViewRadiusVariant = Size | 'none';
export type ScrollViewBorderVariant = 'none' | 'thin' | 'thick';
export type ScrollViewDirection = 'vertical' | 'horizontal' | 'both';

/**
 * Scroll position information.
 */
export interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Content size information for the scrollable content.
 */
export interface ScrollContentSize {
  width: number;
  height: number;
}

/**
 * Layout size of the scroll view container.
 */
export interface ScrollLayoutSize {
  width: number;
  height: number;
}

/**
 * Normalized scroll event provided to all scroll callbacks.
 */
export interface ScrollEvent {
  /** Current scroll offset */
  position: ScrollPosition;
  /** Size of the scrollable content */
  contentSize: ScrollContentSize;
  /** Size of the visible scroll container */
  layoutSize: ScrollLayoutSize;
  /** Whether the content is scrolled to the end (vertical or horizontal depending on direction) */
  isAtEnd: boolean;
  /** Whether the content is scrolled to the start */
  isAtStart: boolean;
}

/**
 * Options for scrollTo operations.
 */
export interface ScrollToOptions {
  x?: number;
  y?: number;
  animated?: boolean;
}

/**
 * Imperative handle exposed via ref for controlling scroll programmatically.
 */
export interface ScrollViewRef {
  /** Scroll to a specific position */
  scrollTo: (options: ScrollToOptions) => void;
  /** Scroll to the end of the content */
  scrollToEnd: (options?: { animated?: boolean }) => void;
  /** Scroll to the top/start of the content */
  scrollToStart: (options?: { animated?: boolean }) => void;
  /** Get current scroll position */
  getScrollPosition: () => ScrollPosition;
  /** Get the underlying native element */
  getInnerElement: () => any;
}

/**
 * Scrollable container with scroll event abstractions and imperative scroll controls.
 */
export interface ScrollViewProps extends ContainerStyleProps {
  children?: ReactNode;

  /** Scroll direction. Defaults to 'vertical'. */
  direction?: ScrollViewDirection;

  /** Background variant */
  background?: ScrollViewBackgroundVariant;

  /** Border radius variant */
  radius?: ScrollViewRadiusVariant;

  /** Border variant */
  border?: ScrollViewBorderVariant;

  /** Custom background color (overrides background variant) */
  backgroundColor?: string;

  /** Custom border radius (overrides radius variant) */
  borderRadius?: number;

  /** Custom border width (overrides border variant) */
  borderWidth?: number;

  /** Custom border color */
  borderColor?: string;

  /** Additional styles */
  style?: StyleProp<ViewStyle>;

  /** Styles applied to the content container */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /** Whether to show scroll indicators. Defaults to true. */
  showsIndicator?: boolean;

  /** Whether to enable paging behavior */
  pagingEnabled?: boolean;

  /** Whether the scroll view bounces at the edges (iOS). Defaults to true. */
  bounces?: boolean;

  /**
   * Called continuously as the user scrolls.
   * Use `scrollEventThrottle` to control frequency.
   */
  onScroll?: (event: ScrollEvent) => void;

  /**
   * Called when scrolling begins (user starts dragging).
   */
  onScrollBegin?: (event: ScrollEvent) => void;

  /**
   * Called when scrolling ends (momentum settles or user lifts finger).
   */
  onScrollEnd?: (event: ScrollEvent) => void;

  /**
   * Called when the scroll position reaches the end of the content.
   * Useful for infinite scroll / load-more patterns.
   */
  onEndReached?: () => void;

  /**
   * Distance from the end (in pixels) at which onEndReached fires.
   * Defaults to 0.
   */
  onEndReachedThreshold?: number;

  /**
   * Throttle interval (ms) for onScroll events on native. Defaults to 16 (~60fps).
   */
  scrollEventThrottle?: number;

  /** Whether scrolling is enabled. Defaults to true. */
  scrollEnabled?: boolean;

  /** Whether the keyboard should dismiss on drag. */
  keyboardDismissMode?: 'none' | 'on-drag' | 'interactive';

  /** Test ID for testing */
  testID?: string;

  /** Callback when layout changes */
  onLayout?: (event: LayoutChangeEvent) => void;
}
