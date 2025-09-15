import { NavigatorParam, RouteParam } from './types'

import { TypedNavigator } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

/**
 * Build the Mobile navigator using React Navigation
 * @param params 
 * @param parentPath 
 * @returns 
 */
export const buildNavigator = (params: NavigatorParam, parentPath = '') => {
    const NavigatorType = getNavigatorType(params);
    return () => (
        <NavigatorType.Navigator screenOptions={{
            headerShown: params.options?.headerShown
        }}>
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
    
    console.log('📱 Registering screen:', {
        originalPath: params.path,
        parentPath,
        fullPath,
        type: params.type,
        screenName: fullPath
    });
    
    return (
        <Navigator.Screen
            key={`${fullPath}-${index}`}
            name={fullPath}
            component={params.type === 'screen' ? params.component : buildNavigator(params, fullPath)}
            options={params.options}
        />
    )
}

