import { useRef } from 'react';
import { PhaserGame } from './game/PhaserGame';

function App() {
  const phaserRef = useRef();

  const currentScene = (scene) => {
    // console.log("Current scene:", scene);
  }

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    </div>
  );
}

export default App;
