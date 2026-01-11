import { NavigatorParam, RouteParam, ScreenOptions, NotFoundComponentProps, NOT_FOUND_SCREEN_NAME } from './types'

import { TypedNavigator } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentWrapper } from './DrawerContentWrapper.native';
import { HeaderWrapper } from './HeaderWrapper.native';
import React from 'react';

// Re-export for backwards compatibility
export { NOT_FOUND_SCREEN_NAME };

/**
 * Creates a NotFound screen component that receives path and params from route params
 */
const createNotFoundScreen = (NotFoundComponent: React.ComponentType<NotFoundComponentProps>) => {
    return React.memo((props: any) => {
        const { route } = props;
        const path = route?.params?.path ?? '';
        const params = route?.params?.params;

        return <NotFoundComponent path={path} params={params} />;
    });
};

/**
 * Build the Mobile navigator using React Navigation
 * @param params
 * @param parentPath
 * @returns
 */
export const buildNavigator = (params: NavigatorParam, parentPath = '') => {
    const NavigatorType = getNavigatorType(params);

    // Wrap screenOptions to provide navigation context to headerRight
    const screenOptions = params.options?.headerRight
        ? (navProps: any) => {
            const baseOptions = typeof params.options === 'function'
                ? params.options(navProps)
                : params.options;

            return {
                ...baseOptions,
                headerRight: () => (
                    <HeaderWrapper
                        content={baseOptions.headerRight}
                        route={params}
                        navigation={navProps.navigation}
                    />
                ),
            };
        }
        : params.options;

    // Build screens including optional 404 screen
    const buildScreens = () => {
        const screens = params.routes.map((child, index) => buildScreen(child, NavigatorType, parentPath, index));

        // Add 404 screen if notFoundComponent is configured
        if (params.notFoundComponent) {
            const NotFoundScreen = createNotFoundScreen(params.notFoundComponent);
            screens.push(
                <NavigatorType.Screen
                    key={NOT_FOUND_SCREEN_NAME}
                    name={NOT_FOUND_SCREEN_NAME}
                    component={NotFoundScreen}
                    options={{ headerShown: false }}
                />
            );
        }

        return screens;
    };

    // Special handling for drawer navigator with custom sidebar
    if (params.layout === 'drawer' && params.sidebarComponent) {
        return () => (
            <NavigatorType.Navigator
                screenOptions={screenOptions}
                drawerContent={(drawerProps: any) => (
                    <DrawerContentWrapper
                        route={params}
                        content={params.sidebarComponent!}
                        drawerProps={drawerProps}
                    />
                )}
            >
                {buildScreens()}
            </NavigatorType.Navigator>
        );
    }

    return () => (
        <NavigatorType.Navigator screenOptions={screenOptions}>
            {buildScreens()}
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
        component = params.component
    } else {
        component = buildNavigator(params, fullPath);
    }

    // Build screen options
    // React Navigation expects headerLeft/headerRight to be functions returning elements
    const buildScreenOptions = (navProps: any) => {
        let options = params.options || {};

        // Handle fullScreen presentation
        if (params.type === 'screen' && options?.fullScreen) {
            options = {
                ...options,
                presentation: 'fullScreenModal',
                headerShown: options.headerShown ?? false,
            };
        }

        // Wrap headerLeft if it's a component
        if (options.headerLeft) {
            const HeaderLeftContent = options.headerLeft as React.ComponentType<any>;
            options = {
                ...options,
                headerLeft: () => (
                    <HeaderWrapper
                        content={HeaderLeftContent}
                        route={params as NavigatorParam}
                        navigation={navProps.navigation}
                    />
                ),
            };
        }

        // Wrap headerRight if it's a component
        if (options.headerRight) {
            const HeaderRightContent = options.headerRight as React.ComponentType<any>;
            options = {
                ...options,
                headerRight: () => (
                    <HeaderWrapper
                        content={HeaderRightContent}
                        route={params as NavigatorParam}
                        navigation={navProps.navigation}
                    />
                ),
            };
        }

        return options;
    };

    // Use function form of options to access navigation props for header wrappers
    const screenOptions = (params.options?.headerLeft || params.options?.headerRight)
        ? buildScreenOptions
        : params.options;

    return (
        <Navigator.Screen
            key={`${fullPath}-${index}`}
            name={fullPath}
            component={component}
            options={screenOptions as any}
        />
    )
}

