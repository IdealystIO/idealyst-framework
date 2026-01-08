import React from 'react';
import { Trans as I18nextTrans } from 'react-i18next';
import type { TransProps } from './types';

/**
 * Component for rendering translations with rich text and interpolation
 *
 * @example Basic usage
 * ```tsx
 * import { Trans } from '@idealyst/translate';
 *
 * // Translation: "Hello, {{name}}!"
 * <Trans i18nKey="greeting" values={{ name: 'World' }} />
 * ```
 *
 * @example With components
 * ```tsx
 * // Translation: "Click <bold>here</bold> for <link>help</link>"
 * <Trans
 *   i18nKey="helpText"
 *   components={{
 *     bold: <strong />,
 *     link: <a href="/help" />,
 *   }}
 * />
 * ```
 *
 * @example With pluralization
 * ```tsx
 * // Translation: "{{count}} item" / "{{count}} items"
 * <Trans i18nKey="itemCount" count={5} />
 * ```
 *
 * @example With children for interpolation
 * ```tsx
 * // Translation: "Read <0>our terms</0> and <1>privacy policy</1>"
 * <Trans i18nKey="legal">
 *   <a href="/terms">our terms</a>
 *   <a href="/privacy">privacy policy</a>
 * </Trans>
 * ```
 */
export function Trans({
  i18nKey,
  ns,
  defaults,
  components,
  values,
  count,
  context,
  parent,
  children,
  shouldUnescape,
}: TransProps) {
  return (
    <I18nextTrans
      i18nKey={i18nKey}
      ns={ns}
      defaults={defaults}
      components={components}
      values={values}
      count={count}
      context={context}
      parent={parent}
      shouldUnescape={shouldUnescape}
    >
      {children}
    </I18nextTrans>
  );
}

export default Trans;
