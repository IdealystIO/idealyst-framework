import { BrowserRouter } from 'react-router-dom';
import { ExampleStackRouter, } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigatorProvider route={ExampleStackRouter} />
      </BrowserRouter>
    </div>
  );  
}

export default App; 