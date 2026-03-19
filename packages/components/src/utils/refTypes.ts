/**
 * Cross-platform ref types for use with refs across web and React Native.
 *
 * These types provide a unified way to work with refs in a cross-platform manner,
 * especially useful for components like Popover that need to anchor to other elements.
 */

/**
 * Universal element type for cross-platform refs.
 * Works seamlessly in both React web and React Native contexts.
 *
 * @example
 * ```tsx
 * const anchorRef = React.useRef<IdealystElement>(null);
 *
 * <Button ref={anchorRef} onPress={() => setOpen(true)}>
 *   Open Popover
 * </Button>
 * <Popover anchor={anchorRef} open={open} onOpenChange={setOpen}>
 *   <Text>Content</Text>
 * </Popover>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IdealystElement = any;

/**
 * @deprecated Use IdealystElement instead
 */
export type AnchorElement = IdealystElement;

/**
 * @deprecated Use React.RefObject<IdealystElement> instead
 */
export type AnchorRef = React.RefObject<IdealystElement>;

/**
 * @deprecated Use IdealystElement instead
 */
export type CrossPlatformElement = IdealystElement;

/**
 * @deprecated Use React.RefObject<IdealystElement> instead
 */
export type CrossPlatformRef = React.RefObject<IdealystElement>;

/**
 * Imperative handle for text input components (TextInput, TextArea).
 * Provides cross-platform focus/blur control via refs.
 *
 * @example
 * ```tsx
 * const inputRef = React.useRef<TextInputHandle>(null);
 * inputRef.current?.focus();
 * inputRef.current?.blur();
 * ```
 */
export interface TextInputHandle {
  /** Programmatically focus the input */
  focus: () => void;
  /** Programmatically blur the input */
  blur: () => void;
}

// Legacy exports kept for backwards compatibility
export type WebElement = IdealystElement;
export type NativeElement = IdealystElement;
export type ComponentElement<T> = IdealystElement;
