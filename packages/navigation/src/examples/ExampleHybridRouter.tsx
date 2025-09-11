import { NavigatorParam, RouteParam } from '../routing';
import React from 'react';
import { Button, Screen, Text } from '../../../components/src';
import { useNavigator } from '../context';
import CustomTabLayout from './CustomTabLayout';
import CustomStackLayout from './CustomStackLayout';

const RootScreen = () => {

    const navigator = useNavigator();

    return <Screen>
        <Text>Root Screen</Text>
        <Button title="Go to Tab" onPress={() => navigator.navigate({
            path: '/tab',
            vars: {},
        })} />
    </Screen>
}

const ExampleHybridRouter: NavigatorParam = {
    path: '/',
    type: 'navigator',
    layout: 'stack',
    layoutComponent: CustomStackLayout,
    routes: [
        {
            type: 'screen',
            path: '/',
            component: RootScreen,
            options: {
                title: 'Example',
            },
        },
        {
            type: 'navigator',
            path: '/tab',
            layout: 'tab',
            layoutComponent: CustomTabLayout,
            routes: [
                {
                    type: 'screen',
                    path: '/a',
                    component: () => <Text>Tab A Example</Text>,
                    options: {
                        title: 'Tab Example',
                    },
                },
                {
                    type: 'screen',
                    path: '/b',
                    component: () => <Text>Tab B Example</Text>,
                    options: {
                        title: 'B',
                    },
                },
            ]
        },
    ]
}

export default ExampleHybridRouter;
