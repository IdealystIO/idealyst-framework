import React, { createContext, memo, useContext, useMemo } from 'react';
import { NavigateParams, NavigatorProviderProps } from './types';
import { useNavigation, useNavigationState, DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { buildNavigator } from '../routing';
import { useUnistyles } from 'react-native-unistyles';

const NavigatorContext = createContext<{
    navigate: (params: NavigateParams) => void;
}>({
    navigate: () => {},
});

const UnwrappedNavigatorProvider = ({ route }: NavigatorProviderProps) => {

    const navigation = useNavigation();
        
    const navigate = (params: NavigateParams) => {
        console.log('navigate', params);
        navigation.navigate(params.path as never);
    };

    const RouteComponent = useMemo(() => {
        // Memoize the navigator to prevent unnecessary re-renders
        return memo(buildNavigator(route));
    }, [route]);

    console.log('UnwrappedNavigatorProvider render', RouteComponent);
     
    return (
        <NavigatorContext.Provider value={{ navigate }}>
            <RouteComponent />
        </NavigatorContext.Provider>
    )
};

const NavigatorProvider = ({ route }: NavigatorProviderProps) => {
    const {rt} = useUnistyles()
    
    const isDarkMode = rt.themeName === 'dark';

    return (
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <UnwrappedNavigatorProvider route={route} />
        </NavigationContainer>
    )
};

export { NavigatorProvider };


export const useNavigator = () => {
  return useContext(NavigatorContext);
};