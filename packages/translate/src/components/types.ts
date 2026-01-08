import type { ReactElement, ReactNode } from 'react';
import type { Namespace } from 'i18next';

/**
 * Props for the Trans component
 */
export interface TransProps {
  /**
   * Translation key
   */
  i18nKey: string;

  /**
   * Namespace for the translation
   */
  ns?: Namespace;

  /**
   * Default value if key is not found
   */
  defaults?: string;

  /**
   * Component map for interpolation
   * Keys correspond to tags in the translation string
   *
   * @example
   * Translation: "Click <bold>here</bold> for <link>help</link>"
   * Components: { bold: <strong />, link: <a href="/help" /> }
   */
  components?: Record<string, ReactElement>;

  /**
   * Values for interpolation
   */
  values?: Record<string, unknown>;

  /**
   * Count for pluralization
   */
  count?: number;

  /**
   * Context for contextual translations
   */
  context?: string;

  /**
   * Tag name for the wrapper element
   * @default React.Fragment
   */
  parent?: string | null;

  /**
   * Children elements that can be used for interpolation
   */
  children?: ReactNode;

  /**
   * Whether to unescape HTML entities
   * @default false
   */
  shouldUnescape?: boolean;
}
