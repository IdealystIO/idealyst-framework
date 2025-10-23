import React, { forwardRef } from 'react';
import MdiIcon from '@mdi/react';
import { IconProps } from './types';
import { iconStyles } from './Icon.styles';
import { getWebProps } from 'react-native-unistyles/web';
import useMergeRefs from '../hooks/useMergeRefs';

// Internal props that include the transformed path from Babel plugin
interface InternalIconProps extends IconProps {
  path?: string; // Added by Babel plugin transformation
}

const Icon = forwardRef<HTMLDivElement, IconProps>((props: InternalIconProps, ref) => {
  const {
    name,
    size = 'md',
    color,
    intent,
    style,
    testID,
    accessibilityLabel,
    ...restProps
  } = props;


  // Check if we have a path prop (from Babel plugin transformation)
  const { path } = restProps as { path?: string };
  // @ts-expect-error - Dynamic style function, TS doesn't narrow union type correctly
  const iconProps = getWebProps(iconStyles.icon({ intent, color}));

  const mergedRef = useMergeRefs(ref, iconProps.ref);

  // Use MDI React icon when path is provided (transformed by Babel plugin)
  return (
    <div
      {...iconProps}
      ref={mergedRef}>
      <MdiIcon
        path={path}
        size={'100%'}
        color={'currentColor'}
        data-testid={testID}
        aria-label={accessibilityLabel || name}
      />
    </div>
  );
});

Icon.displayName = 'Icon';

export default Icon; 