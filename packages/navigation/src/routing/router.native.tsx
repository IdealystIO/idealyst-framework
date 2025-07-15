import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { RouteParam } from "./types"
import { TypedNavigator } from "@react-navigation/native";

export const buildRouter = (routeParam: RouteParam, path: string = '') => {
    return () => buildNativeRouter(routeParam, path)
}

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
    console.log('Registered routes', nextPath, routeParam.routes);
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
                    <Stack.Screen name={nextPath} component={routeParam.component} />
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
                    <Tab.Screen name={nextPath} component={routeParam.component} />
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
                    <Drawer.Screen name={nextPath} component={routeParam.component} />
                    {routeParam.routes?.map((route) => buildNativeRouter(route, nextPath, Drawer))}
                </Drawer.Navigator>
            )
        case 'modal':
            if (!LastNavigator) {
                throw new Error('LastNavigator is required for modal layout');
            }
            return (
                <>
                    <LastNavigator.Screen options={{ headerShown: false, presentation: 'modal' }} name={nextPath} component={routeParam.component} />
                    {routeParam.routes?.map((route) => buildNativeRouter(route, nextPath, LastNavigator))}
                </>
            )
        case undefined:
            if (!LastNavigator) {
                throw new Error('LastNavigator is required for undefined layout');
            }
            return (
                <>
                    <LastNavigator.Screen name={nextPath} component={routeParam.component} />
                    {routeParam.routes?.map((route) => buildNativeRouter(route, nextPath, LastNavigator))}
                </>
            )
        default:
            throw new Error(`Unknown layout type: ${type}`);
    }
}