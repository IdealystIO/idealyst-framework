import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ExampleHybridRouter, ExampleTabRouter } from '@idealyst/navigation/examples';
import { NavigatorProvider } from '@idealyst/navigation';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigatorProvider route={ExampleHybridRouter} />
      </BrowserRouter>
    </div>
  );  
}

export default App; 