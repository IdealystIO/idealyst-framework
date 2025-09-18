import { App } from '@test-select-demo/shared';
import { BrowserRouter } from 'react-router-dom';

function WebApp() {
  return (
    <div className="App">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </div>
  );
}

export default WebApp;
