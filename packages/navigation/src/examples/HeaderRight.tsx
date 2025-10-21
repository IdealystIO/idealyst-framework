import React, { useState } from 'react';
import { Button } from '@idealyst/components';
import { UnistylesRuntime } from 'react-native-unistyles';

export default function HeaderRight() {

    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        UnistylesRuntime.setTheme(newTheme);
        setIsDark(!isDark);
    };

    return (
        <Button variant='outlined' size='sm' onPress={toggleTheme}>
            Toggle Theme
        </Button>
    );
}