import React from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import { AppRouter } from '{{workspaceScope}}/shared';

function App() {
  return (
    <NavigatorProvider route={AppRouter} />
  );
}

export default App;
