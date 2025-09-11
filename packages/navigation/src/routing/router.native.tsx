import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { RouteParam, ScreenOptions } from "./types"
import { TypedNavigator } from "@react-navigation/native";
import { Icon } from '@idealyst/components';

export const buildRouter = (routeParam: RouteParam, path: string = '') => {
    return () => buildNativeRouter(routeParam, path)
}

/**
 * Convert ScreenOptions to React Navigation screen options
 */
const convertScreenOptions = (screenOptions?: ScreenOptions) => {
    if (!screenOptions) return {};

    const options: any = {};

    if (screenOptions.title) {
        options.title = screenOptions.title;
        // Set default headerTitle to title, but allow headerTitle to override
        if (!screenOptions.headerTitle) {
            options.headerTitle = screenOptions.title;
        }
    }

    if (screenOptions.tabBarLabel) {
        options.tabBarLabel = screenOptions.tabBarLabel;
    }

    if (screenOptions.tabBarIcon) {
        if (typeof screenOptions.tabBarIcon === 'string') {
            options.tabBarIcon = ({ focused }: { focused: boolean; color: string; size: number }) => (
                <Icon 
                    name={screenOptions.tabBarIcon as any} 
                    color={focused ? 'primary' : 'secondary'} 
                />
            );
        } else if (typeof screenOptions.tabBarIcon === 'function') {
            options.tabBarIcon = screenOptions.tabBarIcon
        } else {
            options.tabBarIcon = screenOptions.tabBarIcon;
        }
    }

    if (screenOptions.tabBarBadge !== undefined) {
        options.tabBarBadge = screenOptions.tabBarBadge;
    }

    if (screenOptions.tabBarVisible !== undefined) {
        options.tabBarStyle = screenOptions.tabBarVisible ? {} : { display: 'none' };
    }

    // headerTitle should override the default title in the header
    if (screenOptions.headerTitle) {
        options.headerTitle = screenOptions.headerTitle;
    }

    if (screenOptions.headerBackVisible !== undefined) {
        options.headerBackVisible = screenOptions.headerBackVisible;
    }

    if (screenOptions.headerLeft) {
        options.headerLeft = screenOptions.headerLeft;
    }

    if (screenOptions.headerRight) {
        options.headerRight = screenOptions.headerRight;
    }

    if (screenOptions.platformOptions?.native) {
        Object.assign(options, screenOptions.platformOptions.native);
    }

    return options;
};

/**
 * Create the router supporting React Navigation
 * @param routeParam 
 * @param path 
 * @param LastNavigator 
 * @returns 
 */
const buildNativeRouter = (routeParam: RouteParam, path: string = '', LastNavigator?: TypedNavigator<any>): React.ReactElement => {
    const nextPath = (routeParam.path ? path + routeParam.path : path) || '';
    const type = routeParam.layout?.type;
    const screenOptions = convertScreenOptions(routeParam.screenOptions);

    function buildComponent() {
        switch (type) {
            case 'stack':
                const Stack = createNativeStackNavigator();
                return (
                    <Stack.Navigator
                        screenOptions={{
                            // Disable screen optimization to ensure theme updates
                            freezeOnBlur: false,
                        }}
                    >
                        <Stack.Screen 
                            name={nextPath} 
                            component={routeParam.component} 
                            options={screenOptions}
                        />
                        {routeParam.routes?.map((route) => buildNativeRouter(route, nextPath, Stack))}
                    </Stack.Navigator>
                )
            case 'tab':
                const Tab = createBottomTabNavigator();
                return (
                    <Tab.Navigator
                        screenOptions={{
                            // Disable screen optimization to ensure theme updates
                            lazy: false,
                            freezeOnBlur: false,
                        }}
                    >
                        <Tab.Screen 
                            name={nextPath} 
                            component={routeParam.component}
                            options={screenOptions}
                        />
                        {routeParam.routes?.map((route) => buildNativeRouter(route, nextPath, Tab))}
                    </Tab.Navigator>
                )
            case 'drawer':
                const Drawer = createDrawerNavigator();
                return (
                    <Drawer.Navigator
                        screenOptions={{
                            // Disable screen optimization to ensure theme updates
                            lazy: false,
                            freezeOnBlur: false,
                        }}
                    >
                        <Drawer.Screen 
                            name={nextPath} 
                            component={routeParam.component}
                            options={screenOptions}
                        />
                        {routeParam.routes?.map((route) => buildNativeRouter(route, nextPath, Drawer))}
                    </Drawer.Navigator>
                )
            case 'modal':
                if (!LastNavigator) {
                    throw new Error('LastNavigator is required for modal layout');
                }
                return (
                    <>
                        <LastNavigator.Screen 
                            options={{ headerShown: false, presentation: 'modal', ...screenOptions }} 
                            name={nextPath} 
                            component={routeParam.component} 
                        />
                        {routeParam.routes?.map((route) => buildNativeRouter(route, nextPath, LastNavigator))}
                    </>
                )
            case undefined:
                if (!LastNavigator) {
                    throw new Error('LastNavigator is required for undefined layout - ' + routeParam.path);
                }
                return (
                    <>
                        <LastNavigator.Screen 
                            name={nextPath} 
                            component={routeParam.component}
                            options={screenOptions}
                        />
                        {routeParam.routes?.map((route) => buildNativeRouter(route, nextPath, LastNavigator))}
                    </>
                )
            default:
                throw new Error(`Unknown layout type: ${type}`);
        }    
    }
    const Component = buildComponent();
    if (LastNavigator) {
        return (
            <LastNavigator.Screen 
                name={nextPath} 
                component={() => Component}
                options={screenOptions}
            />
        );
    }
    return Component;
}