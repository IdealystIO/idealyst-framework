import React from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerNavigatorProvider } from '../context/index.native';
import { NavigatorParam } from './types';

/**
 * Simple wrapper that renders the sidebar component
 * The NavigatorContext is already provided by NavigatorProvider higher up in the tree,
 * so the sidebar can use useNavigator hook directly
 */
export const DrawerContentWrapper: React.FC<{
    content: React.ComponentType;
    route: NavigatorParam;
    drawerProps: DrawerContentComponentProps;
}> = ({ content: Content, route, drawerProps }) => {
    return <DrawerNavigatorProvider navigation={drawerProps.navigation} route={route}>
        <Content />
    </DrawerNavigatorProvider>
};
