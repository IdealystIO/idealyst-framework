/**
 * PDF Package Guides
 *
 * Comprehensive documentation for @idealyst/pdf cross-platform PDF viewer.
 */

export const pdfGuides: Record<string, string> = {
  "idealyst://pdf/overview": `# @idealyst/pdf

Cross-platform PDF viewer for React and React Native.

## Installation

\`\`\`bash
yarn add @idealyst/pdf
\`\`\`

### Platform peer dependencies

| Platform | Peer Dependency | Install |
|----------|----------------|---------|
| Web | \`pdfjs-dist\` | \`yarn add pdfjs-dist\` |
| Native | \`react-native-pdf\` | \`yarn add react-native-pdf react-native-blob-util\` |

**Web**: Uses Mozilla PDF.js to render PDF pages to canvas.
**Native**: Uses react-native-pdf (PDFKit on iOS, PdfRenderer on Android).

## Key Exports

| Export | Type | Description |
|--------|------|-------------|
| \`PDFViewer\` | Component | PDF viewer with zoom, page nav, scroll |
| \`PDFViewerRef\` | Ref type | Imperative: \`goToPage()\`, \`setZoom()\` |
| \`PDFSource\` | Type | \`string \\| { uri: string } \\| { base64: string }\` |
| \`PDFDocumentInfo\` | Type | \`{ totalPages: number }\` |
| \`FitPolicy\` | Type | \`'width' \\| 'height' \\| 'both'\` |
| \`PDFDirection\` | Type | \`'horizontal' \\| 'vertical'\` |

## Quick Start

\`\`\`tsx
import { PDFViewer } from '@idealyst/pdf';

function DocumentScreen() {
  return (
    <PDFViewer
      source="https://example.com/document.pdf"
      onLoad={({ totalPages }) => console.log('Pages:', totalPages)}
      onPageChange={(page, total) => console.log(page, '/', total)}
      style={{ flex: 1 }}
    />
  );
}
\`\`\`

## Common Mistakes

1. **Forgetting peer deps** — Web needs \`pdfjs-dist\`, native needs \`react-native-pdf\` + \`react-native-blob-util\`
2. **PDF.js worker not configured** — On web, the worker URL is auto-configured from CDN. If using a custom bundler setup, set \`pdfjs.GlobalWorkerOptions.workerSrc\` before rendering.
3. **page is 1-indexed** — First page is \`1\`, not \`0\`
4. **fitPolicy is a string** — Use \`'width'\`, \`'height'\`, or \`'both'\` (NOT numeric values)
5. **base64 source** — Use \`{ base64: 'JVBERi...' }\` without the data URI prefix
`,

  "idealyst://pdf/api": `# @idealyst/pdf — API Reference

## PDFViewerProps

\`\`\`typescript
interface PDFViewerProps {
  /** PDF source — URL string, { uri } object, or { base64 } data */
  source: PDFSource;

  /** Current page (1-indexed). Default: 1 */
  page?: number;

  /** Called when page changes */
  onPageChange?: (page: number, totalPages: number) => void;

  /** Called when document loads */
  onLoad?: (info: PDFDocumentInfo) => void;

  /** Called on error */
  onError?: (error: Error) => void;

  /** Enable zoom. Default: true */
  zoomEnabled?: boolean;

  /** Min zoom. Default: 1 */
  minZoom?: number;

  /** Max zoom. Default: 5 */
  maxZoom?: number;

  /** Scroll direction. Default: 'vertical' */
  direction?: PDFDirection;

  /** Show page indicator. Default: true */
  showPageIndicator?: boolean;

  /** Fit policy. Default: 'width' */
  fitPolicy?: FitPolicy;

  /** Container style */
  style?: ViewStyle;

  /** Test ID */
  testID?: string;
}
\`\`\`

## Types

\`\`\`typescript
type PDFSource = string | { uri: string } | { base64: string };

type FitPolicy = 'width' | 'height' | 'both';

type PDFDirection = 'horizontal' | 'vertical';

interface PDFDocumentInfo {
  totalPages: number;
}
\`\`\`

## PDFViewerRef (Imperative)

\`\`\`typescript
interface PDFViewerRef {
  /** Navigate to page (1-indexed) */
  goToPage: (page: number) => void;

  /** Set zoom level */
  setZoom: (level: number) => void;
}
\`\`\`

Usage:
\`\`\`tsx
const pdfRef = useRef<PDFViewerRef>(null);

<PDFViewer ref={pdfRef} source="..." />

pdfRef.current?.goToPage(5);
pdfRef.current?.setZoom(2);
\`\`\`
`,

  "idealyst://pdf/examples": `# @idealyst/pdf — Examples

## Basic URL Viewer

\`\`\`tsx
import { PDFViewer } from '@idealyst/pdf';
import { View } from '@idealyst/components';

function BasicPDFScreen() {
  return (
    <View style={{ flex: 1 }}>
      <PDFViewer
        source="https://example.com/document.pdf"
        style={{ flex: 1 }}
      />
    </View>
  );
}
\`\`\`

## With Page Navigation Controls

\`\`\`tsx
import { useRef, useState } from 'react';
import { PDFViewer, PDFViewerRef } from '@idealyst/pdf';
import { View, Text, Button } from '@idealyst/components';

function PDFWithControls() {
  const pdfRef = useRef<PDFViewerRef>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <PDFViewer
        ref={pdfRef}
        source="https://example.com/document.pdf"
        onLoad={({ totalPages: total }) => setTotalPages(total)}
        onPageChange={(page) => setCurrentPage(page)}
        showPageIndicator={false}
        style={{ flex: 1 }}
      />
      <View direction="row" justify="center" align="center" gap="md" padding="md">
        <Button
          label="Previous"
          size="sm"
          onPress={() => pdfRef.current?.goToPage(Math.max(1, currentPage - 1))}
        />
        <Text>{currentPage} / {totalPages}</Text>
        <Button
          label="Next"
          size="sm"
          onPress={() => pdfRef.current?.goToPage(Math.min(totalPages, currentPage + 1))}
        />
      </View>
    </View>
  );
}
\`\`\`

## Base64 Source

\`\`\`tsx
import { PDFViewer } from '@idealyst/pdf';

function Base64PDF({ base64Data }: { base64Data: string }) {
  return (
    <PDFViewer
      source={{ base64: base64Data }}
      fitPolicy="both"
      style={{ flex: 1 }}
    />
  );
}
\`\`\`

## Horizontal Mode

\`\`\`tsx
import { PDFViewer } from '@idealyst/pdf';

function HorizontalPDF() {
  return (
    <PDFViewer
      source="https://example.com/slides.pdf"
      direction="horizontal"
      fitPolicy="both"
      style={{ flex: 1 }}
    />
  );
}
\`\`\`

## With Error Handling

\`\`\`tsx
import { useState } from 'react';
import { PDFViewer } from '@idealyst/pdf';
import { View, Text } from '@idealyst/components';

function SafePDFViewer({ url }: { url: string }) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <View style={{ flex: 1 }} align="center" justify="center">
        <Text intent="danger">Failed to load PDF: {error}</Text>
      </View>
    );
  }

  return (
    <PDFViewer
      source={url}
      onError={(err) => setError(err.message)}
      style={{ flex: 1 }}
    />
  );
}
\`\`\`

## Zoom Controls

\`\`\`tsx
import { useRef, useState } from 'react';
import { PDFViewer, PDFViewerRef } from '@idealyst/pdf';
import { View, Button } from '@idealyst/components';

function ZoomablePDF() {
  const pdfRef = useRef<PDFViewerRef>(null);
  const [zoom, setZoom] = useState(1);

  const handleZoom = (level: number) => {
    setZoom(level);
    pdfRef.current?.setZoom(level);
  };

  return (
    <View style={{ flex: 1 }}>
      <PDFViewer
        ref={pdfRef}
        source="https://example.com/document.pdf"
        minZoom={0.5}
        maxZoom={4}
        style={{ flex: 1 }}
      />
      <View direction="row" justify="center" gap="sm" padding="sm">
        <Button label="50%" size="sm" onPress={() => handleZoom(0.5)} />
        <Button label="100%" size="sm" onPress={() => handleZoom(1)} />
        <Button label="200%" size="sm" onPress={() => handleZoom(2)} />
      </View>
    </View>
  );
}
\`\`\`
`,
};
