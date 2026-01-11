import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { listStyles } from './List.styles';
import type { ListSectionProps } from './types';

const ListSection: React.FC<ListSectionProps> = ({
  title,
  children,
  collapsed = false,
  style,
  testID,
}) => {
  const sectionProps = getWebProps([listStyles.section as any, style as any]);
  const titleProps = getWebProps([listStyles.sectionTitle as any]);
  const contentProps = getWebProps([listStyles.sectionContent as any]);

  return (
    <div {...sectionProps} data-testid={testID}>
      {title && (
        <div {...titleProps}>
          {title}
        </div>
      )}
      {!collapsed && (
        <div {...contentProps}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ListSection;
