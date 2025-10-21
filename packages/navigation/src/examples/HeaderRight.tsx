import React, { useState } from 'react';
import { Button, View } from '@idealyst/components';
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button style={{ padding: 0, margin: 0, }} leftIcon="magnify" size='sm' intent='neutral' variant='text' onPress={() => setShowDialog(true)} />
            <Button variant='outlined' size='sm' onPress={toggleTheme}>
                Toggle Theme
            </Button>
            <ExampleSearchDialog open={showDialog} onOpenChange={setShowDialog} />
        </View>
    );
}