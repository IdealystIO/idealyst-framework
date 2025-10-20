import React from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerNavigatorProvider } from '../context/index.native';
import { NavigatorParam, DrawerSidebarProps } from './types';

/**
 * Wrapper that renders the sidebar component and passes safe area insets
 * The NavigatorContext is already provided by NavigatorProvider higher up in the tree,
 * so the sidebar can use useNavigator hook directly
 */
export const DrawerContentWrapper: React.FC<{
    content: React.ComponentType<DrawerSidebarProps>;
    route: NavigatorParam;
    drawerProps: DrawerContentComponentProps;
}> = ({ content: Content, route, drawerProps }) => {
    // Get safe area insets from React Native Safe Area Context
    const insets = useSafeAreaInsets();

    return (
        <DrawerNavigatorProvider navigation={drawerProps.navigation} route={route}>
            <Content insets={insets} />
        </DrawerNavigatorProvider>
    );
};
