import { NavigatorParam, RouteParam, ScreenOptions } from './types'

import { TypedNavigator } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentWrapper } from './DrawerContentWrapper.native';
import React from 'react';
import { useUnistyles } from 'react-native-unistyles';
import { useIsFocused } from '@react-navigation/native';

/**
 * Wrapper that makes screen components reactive to theme changes
 * Only updates when the screen is focused
 */
const ThemeAwareScreenWrapper: React.FC<{
    Component: React.ComponentType<any>;
    [key: string]: any;
}> = ({ Component, ...props }) => {
    const isFocused = useIsFocused();

    // Force update mechanism
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

    // Subscribe to theme changes
    const { rt } = useUnistyles();

    // Force re-render when theme changes (only when focused)
    React.useEffect(() => {
        if (isFocused) {
            console.log('[ThemeAwareScreenWrapper] Theme changed, forcing update. New theme:', rt.themeName);
            forceUpdate();
        }
    }, [rt.themeName, isFocused]);

    // Log when component renders
    React.useEffect(() => {
        if (isFocused) {
            console.log('[ThemeAwareScreenWrapper] Screen rendered with theme:', rt.themeName);
        }
    });

    // Only render when focused to optimize performance
    if (!isFocused) {
        return null;
    }

    return <Component {...props} />;
};

/**
 * Build the Mobile navigator using React Navigation
 * @param params
 * @param parentPath
 * @returns
 */
export const buildNavigator = (params: NavigatorParam, parentPath = '') => {
    const NavigatorType = getNavigatorType(params);

    // Special handling for drawer navigator with custom sidebar
    if (params.layout === 'drawer' && params.sidebarComponent) {
        return () => (
            <NavigatorType.Navigator
                screenOptions={params.options}
                drawerContent={(drawerProps: any) => (
                    <DrawerContentWrapper
                        route={params}
                        content={params.sidebarComponent!}
                        drawerProps={drawerProps}
                    />
                )}
            >
                {params.routes.map((child, index) => buildScreen(child, NavigatorType, parentPath, index))}
            </NavigatorType.Navigator>
        );
    }

    return () => (
        <NavigatorType.Navigator screenOptions={params.options}>
            {params.routes.map((child, index) => buildScreen(child, NavigatorType, parentPath, index))}
        </NavigatorType.Navigator>
    )
}

/**
 * Get Navigator Type
 * @param params
 * @returns
 */
const getNavigatorType = (params: NavigatorParam) => {
    switch (params.layout) {
        case 'stack':
            return createNativeStackNavigator();
        case 'tab':
            return createBottomTabNavigator();
        case 'drawer':
            return createDrawerNavigator();
    }
    throw new Error(`Unsupported navigator type: ${params.layout}`);
}

/**
 * Build Screen
 * @param params
 * @param Navigator
 * @param parentPath
 * @returns
 */
const buildScreen = (params: RouteParam, Navigator: TypedNavigator, parentPath = '', index: number) => {
    // Build the full path by combining parent path with current route path
    // Handle root paths properly to avoid double slashes
    let fullPath: string;
    if (!parentPath || parentPath === '/') {
        // If no parent path or parent is root, use the route path directly
        fullPath = params.path;
    } else {
        // For nested routes, combine parent path with route path
        // Remove leading slash from route path to avoid double slashes
        const routePath = params.path.startsWith('/') ? params.path.slice(1) : params.path;
        fullPath = `${parentPath}/${routePath}`;
    }

    // Determine the component - wrap screens with ThemeAwareScreenWrapper
    let component: React.ComponentType<any>;
    if (params.type === 'screen') {
        const OriginalComponent = params.component;
        component = (props: any) => (
            <ThemeAwareScreenWrapper Component={OriginalComponent} {...props} />
        );
    } else {
        component = buildNavigator(params, fullPath);
    }

    return (
        <Navigator.Screen
            key={`${fullPath}-${index}`}
            name={fullPath}
            component={component}
            options={params.options}
        />
    )
}

