/**
 * @idealyst/pdf - Native exports
 *
 * Cross-platform PDF viewer for React and React Native.
 *
 * @example
 * ```tsx
 * import { PDFViewer, PDFViewerRef } from '@idealyst/pdf';
 *
 * // Basic usage
 * <PDFViewer source="https://example.com/document.pdf" style={{ flex: 1 }} />
 *
 * // With local file
 * <PDFViewer source={{ uri: '/path/to/local.pdf' }} />
 *
 * // With ref for imperative control
 * const pdfRef = useRef<PDFViewerRef>(null);
 *
 * <PDFViewer ref={pdfRef} source="https://example.com/document.pdf" />
 *
 * pdfRef.current?.goToPage(5);
 * ```
 */

// Type exports
export type {
  PDFSource,
  PDFDocumentInfo,
  PDFViewerProps,
  PDFViewerRef,
  FitPolicy,
  PDFDirection,
} from './types';

// Component export
export { PDFViewer } from './PDFViewer.native';
