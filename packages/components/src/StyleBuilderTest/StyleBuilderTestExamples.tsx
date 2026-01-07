/**
 * StyleBuilderTest Examples
 */
import React, { useState } from 'react';
import { StyleBuilderTest } from './StyleBuilderTest';
import type { StyleBuilderTestProps } from './StyleBuilderTest';
import Screen from '../Screen';

export function StyleBuilderTestExamples() {
    const [intent, setIntent] = useState<StyleBuilderTestProps['intent']>('primary');
    const [size, setSize] = useState<StyleBuilderTestProps['size']>('md');

    return (
        <Screen>
                    <StyleBuilderTest intent={intent} size={size} />

        </Screen>
    );
}

export default StyleBuilderTestExamples;
