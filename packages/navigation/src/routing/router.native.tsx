import { NavigatorParam, RouteParam, ScreenOptions, NotFoundComponentProps } from './types'

import { TypedNavigator } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentWrapper } from './DrawerContentWrapper.native';
import { HeaderWrapper } from './HeaderWrapper.native';
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
 * Cache for wrapped components to maintain stable references across renders
 */
const wrappedComponentCache = new WeakMap<React.ComponentType<any>, React.ComponentType<any>>();

/**
 * Creates a theme-aware component wrapper with a stable reference
 * This prevents React Navigation warnings about inline components
 */
const createThemeAwareComponent = (OriginalComponent: React.ComponentType<any>) => {
    // Check cache first to return the same wrapped component reference
    if (wrappedComponentCache.has(OriginalComponent)) {
        return wrappedComponentCache.get(OriginalComponent)!;
    }

    const Wrapped = React.memo((props: any) => (
        <ThemeAwareScreenWrapper Component={OriginalComponent} {...props} />
    ));
    Wrapped.displayName = `ThemeAware(${OriginalComponent.displayName || OriginalComponent.name || 'Component'})`;

    // Store in cache for future lookups
    wrappedComponentCache.set(OriginalComponent, Wrapped);

    return Wrapped;
};

/**
 * Internal screen name for 404 pages
 */
export const NOT_FOUND_SCREEN_NAME = '__notFound__';

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
        component = createThemeAwareComponent(params.component);
    } else {
        component = buildNavigator(params, fullPath);
    }

    // Build screen options, adding fullScreen presentation if specified
    let screenOptions = params.options;
    if (params.type === 'screen' && params.options?.fullScreen) {
        screenOptions = {
            ...params.options,
            // Use fullScreenModal presentation to bypass parent navigator chrome
            presentation: 'fullScreenModal',
            // Hide header for true fullScreen experience
            headerShown: params.options.headerShown ?? false,
        } as ScreenOptions;
    }

    return (
        <Navigator.Screen
            key={`${fullPath}-${index}`}
            name={fullPath}
            component={component}
            options={screenOptions}
        />
    )
}

