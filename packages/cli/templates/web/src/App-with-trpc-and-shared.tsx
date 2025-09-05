import React from 'react';

// Import shared components
import { HelloWorld } from '@{{workspaceScope}}/shared';

function App() {
  return (
    <HelloWorld name="{{projectName}} Developer" platform="web" projectName="{{projectName}}" />
  );
}

export default App;
