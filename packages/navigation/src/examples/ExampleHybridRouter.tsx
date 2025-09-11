import { NavigatorParam, RouteParam } from '../routing';
import React from 'react';
import { Button, Screen, Text } from '../../../components/src';
import { useNavigator } from '../context';

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
            routes: [
                {
                    type: 'screen',
                    path: '/a',
                    component: () => <Text>Tab Example</Text>,
                    options: {
                        title: 'Tab Example',
                    },
                },
                {
                    type: 'screen',
                    path: '/b',
                    component: () => <Text>Tab Example</Text>,
                    options: {
                        title: 'B',
                    },
                },
            ]
        },
    ]
}

export default ExampleHybridRouter;
