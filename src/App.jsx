import React from 'react';

import Chat from './components/Chat';
import Info from './components/Info';
import Map from './components/Map';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="row justify-space-between">
        <Map />
        <Chat />
      </div>
      <div className="row justify-space-between">
        <Info />
      </div>
    </div>
  );
}

export default App;
