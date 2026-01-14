import type { ComponentType, ReactNode } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import type {
  MarkdownStyleOverrides,
  LinkHandler,
  ImageHandler,
  CodeBlockOptions,
} from '../../Markdown/types';
import type { MarkdownDynamicProps } from '../../Markdown/Markdown.styles';

interface CreateWebRenderersOptions {
  styles: any;
  dynamicProps: MarkdownDynamicProps;
  styleOverrides?: MarkdownStyleOverrides;
  linkHandler?: LinkHandler;
  imageHandler?: ImageHandler;
  codeOptions?: CodeBlockOptions;
}

type RendererProps = {
  children?: ReactNode;
  node?: any;
  [key: string]: any;
};

/**
 * Creates custom component renderers for react-markdown
 * that use theme-integrated styles.
 */
export function createWebRenderers({
  styles,
  dynamicProps,
  styleOverrides,
  linkHandler,
  imageHandler,
  codeOptions,
}: CreateWebRenderersOptions): Record<string, ComponentType<RendererProps>> {
  // Helper to get styled props
  const getStyledProps = (elementName: string) => {
    const styleArray = [
      (styles[elementName] as any)?.(dynamicProps),
      (styleOverrides as any)?.[elementName],
    ].filter(Boolean);
    return getWebProps(styleArray);
  };

  return {
    // Headings
    h1: ({ children }: RendererProps) => (
      <h1 {...getStyledProps('heading1')}>{children}</h1>
    ),
    h2: ({ children }: RendererProps) => (
      <h2 {...getStyledProps('heading2')}>{children}</h2>
    ),
    h3: ({ children }: RendererProps) => (
      <h3 {...getStyledProps('heading3')}>{children}</h3>
    ),
    h4: ({ children }: RendererProps) => (
      <h4 {...getStyledProps('heading4')}>{children}</h4>
    ),
    h5: ({ children }: RendererProps) => (
      <h5 {...getStyledProps('heading5')}>{children}</h5>
    ),
    h6: ({ children }: RendererProps) => (
      <h6 {...getStyledProps('heading6')}>{children}</h6>
    ),

    // Paragraph
    p: ({ children }: RendererProps) => (
      <p {...getStyledProps('body')}>{children}</p>
    ),

    // Emphasis
    strong: ({ children }: RendererProps) => (
      <strong {...getStyledProps('strong')}>{children}</strong>
    ),
    em: ({ children }: RendererProps) => (
      <em {...getStyledProps('em')}>{children}</em>
    ),
    del: ({ children }: RendererProps) => (
      <del {...getStyledProps('strikethrough')}>{children}</del>
    ),

    // Links
    a: ({ children, href, title }: RendererProps) => {
      const handleClick = (e: React.MouseEvent) => {
        if (linkHandler?.onLinkPress) {
          const preventDefault = linkHandler.onLinkPress(href || '', title);
          if (preventDefault) {
            e.preventDefault();
          }
        }
      };

      const isExternal =
        href?.startsWith('http://') || href?.startsWith('https://');
      const shouldOpenExternal =
        isExternal && (linkHandler?.openExternalLinks ?? true);

      return (
        <a
          {...getStyledProps('link')}
          href={href}
          title={title}
          onClick={handleClick}
          target={shouldOpenExternal ? '_blank' : undefined}
          rel={shouldOpenExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },

    // Blockquote
    blockquote: ({ children }: RendererProps) => (
      <blockquote {...getStyledProps('blockquote')}>{children}</blockquote>
    ),

    // Code
    code: ({ children, className, inline }: RendererProps) => {
      // Check if it's inline code
      if (inline) {
        return <code {...getStyledProps('codeInline')}>{children}</code>;
      }

      // Block code - extract language from className
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      return (
        <code
          {...getStyledProps('codeBlockText')}
          data-language={language}
        >
          {children}
        </code>
      );
    },

    pre: ({ children }: RendererProps) => (
      <pre {...getStyledProps('codeBlock')}>{children}</pre>
    ),

    // Lists
    ul: ({ children }: RendererProps) => (
      <ul {...getStyledProps('listUnordered')}>{children}</ul>
    ),
    ol: ({ children }: RendererProps) => (
      <ol {...getStyledProps('listOrdered')}>{children}</ol>
    ),
    li: ({ children, checked }: RendererProps) => {
      // Task list item
      if (typeof checked === 'boolean') {
        return (
          <li {...getStyledProps('taskListItem')}>
            <input
              type="checkbox"
              checked={checked}
              readOnly
              {...getStyledProps('taskCheckbox')}
            />
            <span {...getStyledProps('listItemContent')}>{children}</span>
          </li>
        );
      }

      return <li {...getStyledProps('listItem')}>{children}</li>;
    },

    // Table
    table: ({ children }: RendererProps) => (
      <table {...getStyledProps('table')}>{children}</table>
    ),
    thead: ({ children }: RendererProps) => (
      <thead {...getStyledProps('tableHead')}>{children}</thead>
    ),
    tbody: ({ children }: RendererProps) => <tbody>{children}</tbody>,
    tr: ({ children }: RendererProps) => (
      <tr {...getStyledProps('tableRow')}>{children}</tr>
    ),
    th: ({ children, style: alignStyle }: RendererProps) => (
      <th
        {...getStyledProps('tableHeaderCell')}
        style={alignStyle}
      >
        {children}
      </th>
    ),
    td: ({ children, style: alignStyle }: RendererProps) => (
      <td
        {...getStyledProps('tableCell')}
        style={alignStyle}
      >
        {children}
      </td>
    ),

    // Image
    img: ({ src, alt, title }: RendererProps) => {
      const resolvedSrc = imageHandler?.resolveImageUrl
        ? imageHandler.resolveImageUrl(src || '')
        : src;

      const handleClick = () => {
        if (imageHandler?.onImagePress) {
          imageHandler.onImagePress(src || '', alt);
        }
      };

      return (
        <img
          {...getStyledProps('image')}
          src={resolvedSrc}
          alt={alt}
          title={title}
          onClick={imageHandler?.onImagePress ? handleClick : undefined}
          style={
            imageHandler?.onImagePress ? { cursor: 'pointer' } : undefined
          }
        />
      );
    },

    // Horizontal rule
    hr: () => <hr {...getStyledProps('hr')} />,

    // Break
    br: () => <br />,
  };
}
