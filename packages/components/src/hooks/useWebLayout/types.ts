/**
 * Layout information provided when a component's dimensions change.
 */
export interface LayoutInfo {
  /** X position relative to the viewport (web) or parent (native) */
  x: number;
  /** Y position relative to the viewport (web) or parent (native) */
  y: number;
  /** Width of the element */
  width: number;
  /** Height of the element */
  height: number;
}

/**
 * Event fired when a component's layout changes.
 * Compatible with React Native's LayoutChangeEvent structure.
 */
export interface LayoutChangeEvent {
  nativeEvent: {
    layout: LayoutInfo;
  };
}

/**
 * Callback type for layout change events.
 */
export type OnLayoutCallback = (event: LayoutChangeEvent) => void;
