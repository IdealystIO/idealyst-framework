import React from 'react';
import { DrawerNavigatorProvider } from '../context/index.native';
import { NavigatorParam } from './types';

/**
 * Wrapper that renders the header component with navigation context
 * This allows header components to use useNavigator and access route info
 */
export const HeaderWrapper: React.FC<{
    content: React.ComponentType<any>;
    route: NavigatorParam;
    navigation: any;
}> = ({ content: Content, route, navigation }) => {
    return (
        <DrawerNavigatorProvider navigation={navigation} route={route}>
            <Content />
        </DrawerNavigatorProvider>
    );
};
