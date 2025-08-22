import React from 'react';
import { ScrollView as RNScrollView, ScrollViewProps as RNScrollViewProps } from 'react-native';

interface ScrollViewProps extends RNScrollViewProps {
  children: React.ReactNode;
}

export const ScrollView: React.FC<ScrollViewProps> = (props) => {
  return <RNScrollView {...props} />;
};