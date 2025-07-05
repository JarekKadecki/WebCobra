import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

export const PhaserGame = forwardRef(function PhaserGame({ currentActiveScene, configData }, ref) {
    const game = useRef();

    useLayoutEffect(() => {
        if (game.current === undefined && configData) {
            game.current = StartGame("game-container", configData);

            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        }
    }, [ref, configData]);

    useEffect(() => {
        EventBus.on('current-scene-ready', (currentScene) => {
            if (currentActiveScene instanceof Function) {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
        });

        return () => {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, ref]);

    return <div id="game-container"></div>;
});

PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
    configData: PropTypes.object
};
