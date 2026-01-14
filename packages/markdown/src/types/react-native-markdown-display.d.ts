/**
 * Type declarations for react-native-markdown-display
 *
 * @see https://github.com/iamacup/react-native-markdown-display
 */
declare module 'react-native-markdown-display' {
  import type { ComponentType, ReactNode } from 'react';
  import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export interface MarkdownStyles {
    body?: TextStyle;
    heading1?: TextStyle;
    heading2?: TextStyle;
    heading3?: TextStyle;
    heading4?: TextStyle;
    heading5?: TextStyle;
    heading6?: TextStyle;
    hr?: ViewStyle;
    strong?: TextStyle;
    em?: TextStyle;
    s?: TextStyle;
    blockquote?: ViewStyle;
    bullet_list?: ViewStyle;
    ordered_list?: ViewStyle;
    list_item?: ViewStyle;
    bullet_list_icon?: TextStyle;
    bullet_list_content?: ViewStyle;
    ordered_list_icon?: TextStyle;
    ordered_list_content?: ViewStyle;
    code_inline?: TextStyle;
    code_block?: ViewStyle;
    fence?: ViewStyle;
    table?: ViewStyle;
    thead?: ViewStyle;
    tbody?: ViewStyle;
    th?: TextStyle;
    tr?: ViewStyle;
    td?: TextStyle;
    link?: TextStyle;
    blocklink?: ViewStyle;
    image?: ViewStyle;
    text?: TextStyle;
    textgroup?: ViewStyle;
    paragraph?: ViewStyle;
    hardbreak?: ViewStyle;
    softbreak?: ViewStyle;
    pre?: ViewStyle;
    inline?: ViewStyle;
    span?: ViewStyle;
    [key: string]: ViewStyle | TextStyle | undefined;
  }

  export interface MarkdownProps {
    children: string;
    style?: MarkdownStyles;
    rules?: Record<string, ComponentType<any>>;
    onLinkPress?: (url: string) => boolean;
    debugPrintTree?: boolean;
    markdownit?: any;
  }

  const Markdown: ComponentType<MarkdownProps>;
  export default Markdown;
}
