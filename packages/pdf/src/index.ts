/**
 * @idealyst/pdf - Web exports
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
 * // With callbacks
 * <PDFViewer
 *   source={{ uri: 'https://example.com/document.pdf' }}
 *   onLoad={({ totalPages }) => console.log('Pages:', totalPages)}
 *   onPageChange={(page, total) => console.log(page, '/', total)}
 * />
 *
 * // With ref for imperative control
 * const pdfRef = useRef<PDFViewerRef>(null);
 *
 * <PDFViewer ref={pdfRef} source="https://example.com/document.pdf" />
 *
 * pdfRef.current?.goToPage(5);
 * pdfRef.current?.setZoom(2);
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
export { PDFViewer } from './PDFViewer';
