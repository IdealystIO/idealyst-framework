import React from 'react';
import MdiIcon from '@mdi/react';
import { IconProps } from './types';
import iconStyles from './Icon.styles';
import { getWebProps } from 'react-native-unistyles/web';

// Internal props that include the transformed path from Babel plugin
interface InternalIconProps extends IconProps {
  path?: string; // Added by Babel plugin transformation
}

const Icon: React.FC<IconProps> = (props: InternalIconProps) => {
  const {
    name,
    size = 'md',
    color,
    style,
    testID,
    accessibilityLabel,
    ...restProps
  } = props;

  // Use Unistyles v3 with color and size variants
  const styles = iconStyles.useVariants({ color, size });
  
  // Check if we have a path prop (from Babel plugin transformation)
  const { path } = restProps as { path?: string };
  const iconProps = getWebProps(styles.icon);
  
  // Use MDI React icon when path is provided (transformed by Babel plugin)
  return (
    <div
      {...iconProps}>
      <MdiIcon
        path={path}
        size={'100%'}
        color={'currentColor'}
        data-testid={testID}
        aria-label={accessibilityLabel || name}
      />
    </div>
  );
  
};

export default Icon; 