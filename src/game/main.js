import { Boot } from './scenes/Boot';
import { FirstBoost } from './scenes/FirstBoost';
import { NextOpponent } from './scenes/NextOpponent';
import { Outcome } from './scenes/Outcome';
import { Preloader } from './scenes/Preloader';
import { Snake } from './scenes/Snake';
import { TakeApples } from './scenes/TakeApples';

export const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // Minimum size
        min: {
            width: 800,
            height: 600
        },
        // Maximum size
        max: {
            width: 1920,
            height: 1080
        },
        zoom: 1,
    },
    physics: {
        default: 'arcade',
    },
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        NextOpponent,
        Snake,
        TakeApples,
        Outcome,
        FirstBoost
    ]
};



const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
