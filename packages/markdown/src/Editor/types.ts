import type { StyleProp, ViewStyle } from 'react-native';
import type { Size, Intent } from '@idealyst/theme';

/**
 * Toolbar item types available in the editor
 */
export type ToolbarItem =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'heading' // Dropdown for H1-H6
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'horizontalRule'
  | 'link'
  | 'image'
  | 'undo'
  | 'redo';

/**
 * Toolbar configuration
 */
export interface ToolbarConfig {
  /**
   * Items to show in the toolbar
   * @default ['bold', 'italic', 'underline', 'strikethrough', 'code', 'heading1', 'heading2', 'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'link']
   */
  items?: ToolbarItem[];

  /**
   * Items to disable in the toolbar (they will still be visible but grayed out)
   */
  disabledItems?: ToolbarItem[];

  /**
   * Whether to show the toolbar
   * @default true
   */
  visible?: boolean;

  /**
   * Toolbar position
   * @default 'top'
   */
  position?: 'top' | 'bottom';
}

/**
 * Editor ref methods available to parent components
 */
export interface MarkdownEditorRef {
  /**
   * Get the current markdown content
   */
  getMarkdown: () => Promise<string>;

  /**
   * Set the markdown content
   */
  setMarkdown: (markdown: string) => void;

  /**
   * Focus the editor
   */
  focus: () => void;

  /**
   * Blur the editor
   */
  blur: () => void;

  /**
   * Check if editor has content
   */
  isEmpty: () => Promise<boolean>;

  /**
   * Clear all content
   */
  clear: () => void;

  /**
   * Undo last action
   */
  undo: () => void;

  /**
   * Redo last undone action
   */
  redo: () => void;
}

/**
 * MarkdownEditor component props
 */
export interface MarkdownEditorProps {
  /**
   * Initial markdown content
   */
  initialValue?: string;

  /**
   * Controlled value (makes the component controlled)
   */
  value?: string;

  /**
   * Called when content changes with the markdown string
   */
  onChange?: (markdown: string) => void;

  /**
   * Called when the editor gains focus
   */
  onFocus?: () => void;

  /**
   * Called when the editor loses focus
   */
  onBlur?: () => void;

  /**
   * Whether the editor is editable
   * @default true
   */
  editable?: boolean;

  /**
   * Whether to autofocus on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Placeholder text when editor is empty
   */
  placeholder?: string;

  /**
   * Toolbar configuration
   */
  toolbar?: ToolbarConfig;

  /**
   * Text size variant
   * @default 'md'
   */
  size?: Size;

  /**
   * Link color intent
   * @default 'primary'
   */
  linkIntent?: Intent;

  /**
   * Minimum height of the editor
   */
  minHeight?: number;

  /**
   * Maximum height of the editor (enables scrolling)
   */
  maxHeight?: number;

  /**
   * Container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test identifier
   */
  testID?: string;

  /**
   * Unique identifier
   */
  id?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Native only: Avoid iOS keyboard by adding padding
   * @default true
   */
  avoidIosKeyboard?: boolean;
}
