/**
 * Type definitions for @idealyst/pdf
 */

import type { ViewStyle } from 'react-native';

/**
 * PDF source - URL string, object with uri, or base64-encoded data
 */
export type PDFSource = string | { uri: string } | { base64: string };

/**
 * Information about a loaded PDF document
 */
export interface PDFDocumentInfo {
  /** Total number of pages */
  totalPages: number;
}

/**
 * Fit policy for rendering pages
 * - 'width': fit page width to container
 * - 'height': fit page height to container
 * - 'both': fit entire page within container
 */
export type FitPolicy = 'width' | 'height' | 'both';

/**
 * Scroll/page direction
 */
export type PDFDirection = 'horizontal' | 'vertical';

/**
 * Props for the PDFViewer component
 */
export interface PDFViewerProps {
  /**
   * PDF source - URL string, { uri } object, or { base64 } data.
   *
   * @example
   * // URL string
   * source="https://example.com/document.pdf"
   *
   * // URI object
   * source={{ uri: 'https://example.com/document.pdf' }}
   *
   * // Base64 encoded
   * source={{ base64: 'JVBERi0xLjQK...' }}
   */
  source: PDFSource;

  /**
   * Current page number (1-indexed).
   * When provided, the viewer scrolls to this page.
   * @default 1
   */
  page?: number;

  /**
   * Called when the visible page changes.
   * @param page - Current page number (1-indexed)
   * @param totalPages - Total number of pages in the document
   */
  onPageChange?: (page: number, totalPages: number) => void;

  /**
   * Called when the PDF document loads successfully.
   */
  onLoad?: (info: PDFDocumentInfo) => void;

  /**
   * Called when an error occurs loading the PDF.
   */
  onError?: (error: Error) => void;

  /**
   * Enable pinch-to-zoom / scroll-to-zoom.
   * @default true
   */
  zoomEnabled?: boolean;

  /**
   * Minimum zoom level.
   * @default 1
   */
  minZoom?: number;

  /**
   * Maximum zoom level.
   * @default 5
   */
  maxZoom?: number;

  /**
   * Scroll direction for page navigation.
   * @default 'vertical'
   */
  direction?: PDFDirection;

  /**
   * Show a page indicator overlay (e.g. "3 / 10").
   * @default true
   */
  showPageIndicator?: boolean;

  /**
   * How pages should be scaled to fit the container.
   * @default 'width'
   */
  fitPolicy?: FitPolicy;

  /**
   * Container style.
   */
  style?: ViewStyle;

  /**
   * Test ID for testing frameworks.
   */
  testID?: string;
}

/**
 * Ref methods for imperative PDFViewer control
 */
export interface PDFViewerRef {
  /**
   * Navigate to a specific page (1-indexed).
   */
  goToPage: (page: number) => void;

  /**
   * Set the zoom level programmatically.
   */
  setZoom: (level: number) => void;
}
