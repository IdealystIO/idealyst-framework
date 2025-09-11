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
        <NavigatorType.Navigator>
            {params.routes.map((child) => buildScreen(child, NavigatorType))}
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
const buildScreen = (params: RouteParam, Navigator: TypedNavigator, parentPath = '') => {
    return (
        <Navigator.Screen
            name={params.path}
            component={params.type === 'screen' ? params.component : buildNavigator(params, parentPath + params.path)}
            options={params.options}
        />
    )
}

