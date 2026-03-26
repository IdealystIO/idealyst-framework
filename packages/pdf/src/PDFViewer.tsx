/**
 * PDFViewer - Web implementation
 *
 * Uses pdfjs-dist (Mozilla PDF.js) for rendering PDF documents on the web.
 */

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { GlobalWorkerOptions, getDocument, version } from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { PDFViewerProps, PDFViewerRef, PDFSource } from './types';

// Configure the PDF.js worker
// Users can override this by setting GlobalWorkerOptions.workerSrc before rendering
if (!GlobalWorkerOptions.workerSrc) {
  GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
}

/**
 * Resolve a PDFSource into a pdfjs-dist compatible source parameter.
 */
function resolveSource(source: PDFSource): string | { data: Uint8Array } {
  if (typeof source === 'string') return source;
  if ('uri' in source) return source.uri;

  // base64 → Uint8Array
  const binaryStr = atob(source.base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return { data: bytes };
}

/**
 * PDFViewer component for web.
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

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const pageRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const loadIdRef = useRef(0);

  // Render a single page to a canvas
  const renderPage = useCallback(
    async (doc: PDFDocumentProxy, pageNum: number, canvas: HTMLCanvasElement, scale: number) => {
      const pdfPage = await doc.getPage(pageNum);
      const viewport = pdfPage.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext('2d');
      if (!context) return;

      await pdfPage.render({
        canvasContext: context,
        viewport,
      }).promise;
    },
    []
  );

  // Calculate scale based on fitPolicy and container size
  const calculateScale = useCallback(
    (doc: PDFDocumentProxy, containerWidth: number, containerHeight: number) => {
      // We need the first page to determine dimensions
      return doc.getPage(1).then((firstPage) => {
        const unscaledViewport = firstPage.getViewport({ scale: 1 });
        const pageWidth = unscaledViewport.width;
        const pageHeight = unscaledViewport.height;

        switch (fitPolicy) {
          case 'width':
            return containerWidth / pageWidth;
          case 'height':
            return containerHeight / pageHeight;
          case 'both': {
            const scaleW = containerWidth / pageWidth;
            const scaleH = containerHeight / pageHeight;
            return Math.min(scaleW, scaleH);
          }
          default:
            return 1;
        }
      });
    },
    [fitPolicy]
  );

  // Load and render the PDF document
  useEffect(() => {
    const id = ++loadIdRef.current;
    setIsLoading(true);

    const loadPDF = async () => {
      try {
        // Destroy previous document
        if (pdfDocRef.current) {
          await pdfDocRef.current.destroy();
          pdfDocRef.current = null;
        }

        const resolved = resolveSource(source);
        const doc = await getDocument(resolved).promise;

        if (id !== loadIdRef.current) {
          doc.destroy();
          return;
        }

        pdfDocRef.current = doc;
        const numPages = doc.numPages;
        setTotalPages(numPages);
        setIsLoading(false);
        onLoad?.({ totalPages: numPages });

        // Get container dimensions for scale calculation
        const container = containerRef.current;
        if (!container) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const baseScale = await calculateScale(doc, containerWidth, containerHeight);

        // Clear previous canvases
        const canvasContainer = canvasContainerRef.current;
        if (!canvasContainer) return;
        canvasContainer.innerHTML = '';
        pageRefs.current.clear();

        // Render all pages
        for (let i = 1; i <= numPages; i++) {
          const canvas = document.createElement('canvas');
          canvas.style.display = 'block';
          canvas.style.margin = direction === 'vertical' ? '8px auto' : '8px';
          canvas.dataset.page = String(i);
          canvasContainer.appendChild(canvas);
          pageRefs.current.set(i, canvas);

          await renderPage(doc, i, canvas, baseScale * zoom);
        }
      } catch (err) {
        if (id !== loadIdRef.current) return;
        setIsLoading(false);
        const error = err instanceof Error ? err : new Error(String(err));
        onError?.(error);
      }
    };

    loadPDF();

    return () => {
      loadIdRef.current++;
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
        pdfDocRef.current = null;
      }
    };
  }, [source]);

  // Re-render on zoom change
  useEffect(() => {
    if (!pdfDocRef.current || !containerRef.current) return;

    const doc = pdfDocRef.current;
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const rerender = async () => {
      const baseScale = await calculateScale(doc, containerWidth, containerHeight);
      const scale = baseScale * zoom;

      const entries = Array.from(pageRefs.current.entries());
      for (let i = 0; i < entries.length; i++) {
        const [pageNum, canvas] = entries[i];
        await renderPage(doc, pageNum, canvas, scale);
      }
    };

    rerender();
  }, [zoom, calculateScale, renderPage]);

  // Scroll to page when `page` prop changes
  useEffect(() => {
    const canvas = pageRefs.current.get(page);
    if (canvas) {
      canvas.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
      setCurrentPage(page);
    }
  }, [page]);

  // Track current page via scroll position
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container || totalPages === 0) return;

    const handleScroll = () => {
      const scrollContainer = container.parentElement;
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      const scrollLeft = scrollContainer.scrollLeft;

      let closestPage = 1;
      let closestDistance = Infinity;

      const scrollEntries = Array.from(pageRefs.current.entries());
      for (let i = 0; i < scrollEntries.length; i++) {
        const [pageNum, canvas] = scrollEntries[i];
        const distance =
          direction === 'vertical'
            ? Math.abs(canvas.offsetTop - scrollTop)
            : Math.abs(canvas.offsetLeft - scrollLeft);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPage = pageNum;
        }
      }

      if (closestPage !== currentPage) {
        setCurrentPage(closestPage);
        onPageChange?.(closestPage, totalPages);
      }
    };

    const scrollContainer = container.parentElement;
    scrollContainer?.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [totalPages, currentPage, direction, onPageChange]);

  // Wheel zoom handler
  useEffect(() => {
    if (!zoomEnabled) return;
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      setZoom((prev) => {
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        return Math.min(maxZoom, Math.max(minZoom, prev + delta));
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoomEnabled, minZoom, maxZoom]);

  // Imperative handle
  useImperativeHandle(
    ref,
    () => ({
      goToPage: (targetPage: number) => {
        const canvas = pageRefs.current.get(targetPage);
        if (canvas) {
          canvas.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
          setCurrentPage(targetPage);
        }
      },
      setZoom: (level: number) => {
        setZoom(Math.min(maxZoom, Math.max(minZoom, level)));
      },
    }),
    [minZoom, maxZoom]
  );

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: '#f0f0f0',
    ...(style as any),
  };

  const canvasContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    alignItems: 'center',
    minHeight: '100%',
  };

  const indicatorStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 4,
    fontSize: 14,
    fontFamily: 'system-ui, sans-serif',
    pointerEvents: 'none',
    zIndex: 10,
  };

  return (
    <div ref={containerRef} style={containerStyle} data-testid={testID}>
      <div ref={canvasContainerRef} style={canvasContainerStyle} />
      {showPageIndicator && totalPages > 0 && (
        <div style={indicatorStyle}>
          {currentPage} / {totalPages}
        </div>
      )}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          Loading PDF...
        </div>
      )}
    </div>
  );
});

PDFViewer.displayName = 'PDFViewer';
