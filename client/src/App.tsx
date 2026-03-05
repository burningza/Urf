import { useState } from 'react';
import { Globe } from './components/Globe';
import './App.css';

function App() {
  const [shaderMode, setShaderMode] = useState(0);

  return (
    <div className="app-container">
      <div className="ui-overlay">
        <h1>WORLDVIEW // OPS_CENTER</h1>
        <div className="controls">
          <button onClick={() => setShaderMode(0)} className={shaderMode === 0 ? 'active' : ''}>NORMAL</button>
          <button onClick={() => setShaderMode(1)} className={shaderMode === 1 ? 'active' : ''}>CRT</button>
          <button onClick={() => setShaderMode(2)} className={shaderMode === 2 ? 'active' : ''}>NVG</button>
          <button onClick={() => setShaderMode(3)} className={shaderMode === 3 ? 'active' : ''}>FLIR</button>
        </div>
      </div>
      <Globe shaderMode={shaderMode} />
    </div>
  );
}

export default App;
