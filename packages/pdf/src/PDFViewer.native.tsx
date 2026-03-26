/**
 * PDFViewer - Native implementation
 *
 * Uses react-native-pdf for rendering PDF documents on React Native.
 */

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';
import type { PDFViewerProps, PDFViewerRef, PDFSource } from './types';

/**
 * Normalize a PDFSource into a react-native-pdf compatible source object.
 */
function resolveSource(source: PDFSource): { uri: string } {
  if (typeof source === 'string') {
    return { uri: source };
  }
  if ('uri' in source) {
    return { uri: source.uri };
  }
  // base64 → data URI for react-native-pdf
  return { uri: `data:application/pdf;base64,${source.base64}` };
}

/**
 * Convert fitPolicy string to react-native-pdf numeric value.
 * 0 = fit width, 1 = fit height, 2 = fit both
 */
function resolveFitPolicy(fitPolicy: 'width' | 'height' | 'both'): 0 | 1 | 2 {
  switch (fitPolicy) {
    case 'width':
      return 0;
    case 'height':
      return 1;
    case 'both':
      return 2;
    default:
      return 0;
  }
}

/**
 * PDFViewer component for React Native.
 *
 * @example
 * ```tsx
 * import { PDFViewer } from '@idealyst/pdf';
 *
 * <PDFViewer
 *   source="https://example.com/document.pdf"
 *   onLoad={({ totalPages }) => console.log('Pages:', totalPages)}
 *   onPageChange={(page, total) => console.log(page, '/', total)}
 *   style={{ flex: 1 }}
 * />
 * ```
 */
export const PDFViewer = forwardRef<PDFViewerRef, PDFViewerProps>((props, ref) => {
  const {
    source,
    page = 1,
    onPageChange,
    onLoad,
    onError,
    zoomEnabled = true,
    minZoom = 1,
    maxZoom = 5,
    direction = 'vertical',
    showPageIndicator = true,
    fitPolicy = 'width',
    style,
    testID,
  } = props;

  const pdfRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [controlledPage, setControlledPage] = useState(page);

  // Update controlled page when prop changes
  React.useEffect(() => {
    setControlledPage(page);
  }, [page]);

  const handleLoadComplete = useCallback(
    (numberOfPages: number) => {
      setTotalPages(numberOfPages);
      onLoad?.({ totalPages: numberOfPages });
    },
    [onLoad]
  );

  const handlePageChanged = useCallback(
    (pageNum: number, numPages: number) => {
      setCurrentPage(pageNum);
      setTotalPages(numPages);
      onPageChange?.(pageNum, numPages);
    },
    [onPageChange]
  );

  const handleError = useCallback(
    (error: any) => {
      const err = error instanceof Error ? error : new Error(String(error));
      onError?.(err);
    },
    [onError]
  );

  // Imperative handle
  useImperativeHandle(
    ref,
    () => ({
      goToPage: (targetPage: number) => {
        setControlledPage(targetPage);
      },
      setZoom: (_level: number) => {
        // react-native-pdf does not support imperative zoom control;
        // zoom is handled by user gestures within the configured min/max range
      },
    }),
    []
  );

  const resolvedSource = resolveSource(source);

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Pdf
        ref={pdfRef}
        source={resolvedSource}
        page={controlledPage}
        horizontal={direction === 'horizontal'}
        fitPolicy={resolveFitPolicy(fitPolicy)}
        minScale={minZoom}
        maxScale={maxZoom}
        enablePaging={false}
        enableAntialiasing={true}
        enableAnnotationRendering={true}
        onLoadComplete={handleLoadComplete}
        onPageChanged={handlePageChanged}
        onError={handleError}
        style={styles.pdf}
      />
      {showPageIndicator && totalPages > 0 && (
        <View style={styles.indicator}>
          <Text style={styles.indicatorText}>
            {currentPage} / {totalPages}
          </Text>
        </View>
      )}
    </View>
  );
});

PDFViewer.displayName = 'PDFViewer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  pdf: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 14,
  },
});
