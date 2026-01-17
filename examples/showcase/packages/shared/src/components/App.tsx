import React from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import { ShowcaseRouter } from '../navigation/ShowcaseRouter';

/**
 * Main App component for the Idealyst Showcase
 * Sets up navigation with the ShowcaseRouter
 */
export const App: React.FC = () => {
  return <NavigatorProvider route={ShowcaseRouter} />;
};

export default App;
