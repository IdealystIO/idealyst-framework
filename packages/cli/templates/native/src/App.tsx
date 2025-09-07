import React from 'react';
import { App } from '@{{workspaceScope}}/shared';

// Main App component using shared App wrapper
function AppWithShared() {
  return (
    <App 
      apiUrl="http://localhost:3000/trpc"
      name="{{projectName}} Developer"
      platform="mobile"
      projectName="{{projectName}}"
    />
  );
}

export default AppWithShared;
