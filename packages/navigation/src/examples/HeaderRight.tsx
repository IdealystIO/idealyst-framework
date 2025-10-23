import React, { useState } from 'react';
import { Button, Icon, View } from '@idealyst/components';
import { UnistylesRuntime } from 'react-native-unistyles';
import ExampleSearchDialog from './ExampleSearchDialog';

export default function HeaderRight() {
    const [isDark, setIsDark] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        UnistylesRuntime.setTheme(newTheme);
        setIsDark(!isDark);
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, }}>
            <Button style={{ padding: 0, margin: 0, }}  type='text' onPress={() => setShowDialog(true)} >
                <Icon name='magnify' intent='neutral' size={'md'} />
            </Button>
            <Button type='text' size='sm' onPress={toggleTheme}>
                <Icon color={isDark ? 'yellow' : 'blue.800'} name={isDark ? 'weather-sunny' : 'moon-waning-crescent'} size='md' />
            </Button>
            <ExampleSearchDialog open={showDialog} onOpenChange={setShowDialog} />
        </View>
    );
}