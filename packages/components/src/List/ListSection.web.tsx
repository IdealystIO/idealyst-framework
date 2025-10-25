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
  const sectionProps = getWebProps([listStyles.section, style as any]);
  const titleProps = getWebProps([listStyles.sectionTitle]);
  const contentProps = getWebProps([listStyles.sectionContent]);

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
