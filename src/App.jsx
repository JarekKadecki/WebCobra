import { useEffect, useRef, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import '../public/style.css';

function App() {
  const phaserRef = useRef();
  const [configData, setConfigData] = useState(null);

  // Fetch the game configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/get_configuration', {method: 'POST'});
        if (!res.ok) throw new Error('Failed to fetch config');
        const json = await res.json();
        console.log('Configuration fetched:\n', JSON.stringify(json));
        setConfigData(json);
      } catch (err) {
        console.error('Error fetching config:', err);
      }
    };

    fetchConfig();
  }, []);

  const currentScene = (scene) => {
    // console.log("App test");
  };

  const onGameFinished = async (data) => {
    await fetch('/api/submit_results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    window.location.href = '/questionnaire';
  };

  return (
    <div id="app">
      {(
        <PhaserGame
          ref={phaserRef}
          configData={configData}
          currentActiveScene={currentScene}
          gameFinish={onGameFinished}
        />
      )}
    </div>
  );
}

export default App;