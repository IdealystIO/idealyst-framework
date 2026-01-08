import { DocsApp } from '@idealyst-docs/shared';
import { BrowserRouter } from 'react-router-dom';

function WebApp() {
  return (
    <div className="App">
      <BrowserRouter>
        <DocsApp />
      </BrowserRouter>
    </div>
  );
}

export default WebApp;
