import { RouteParam } from '../routing';
import React from 'react';
import { Button, Screen, Text } from '../../../components/src';
import { useNavigator } from '../context';

const RootScreen = () => {

    const navigator = useNavigator();

    return <Screen>
        <Text>Root Screen</Text>
        <Button title="Go to Tab" onPress={() => navigator.navigate({
            path: '/a',
            vars: {},
        })} />
    </Screen>
}

const ExampleHybridRouter: RouteParam = {
    path: '/',
    layout: {
        type: 'stack',
    },
    component: RootScreen,
    screenOptions: {
        title: 'Example',
        headerTitle: 'Example Header',
        tabBarLabel: 'Example',
        tabBarIcon: 'example-icon',
    },
    routes: [
        {
            path: 'a',
            component: () => <Text>Nested Tab Example</Text>,
            layout: {
                type: 'tab',
            },
            screenOptions: {
                title: 'Tab Example',
                headerTitle: 'Tab Header',
                tabBarLabel: 'Tab',
                tabBarIcon: 'tab-icon',
            },
            routes: [
                {
                    path: 'nested',
                    component: () => <Text>Tab 2</Text>,
                    screenOptions: {
                        title: 'Nested Tab Example',
                        headerTitle: 'Nested Tab Header',
                        tabBarLabel: 'Nested Tab',
                        tabBarIcon: 'nested-tab-icon',
                    },
                }
            ]
        }
    ]
}

export default ExampleHybridRouter;
