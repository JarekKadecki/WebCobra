import { Boot } from './scenes/Boot';
import { FirstBoost } from './scenes/FirstBoost';
import { NextOpponent } from './scenes/NextOpponent';
import { Outcome } from './scenes/Outcome';
import { Preloader } from './scenes/Preloader';
import { Questionnaire } from './scenes/Questionnaire';
import { Snake } from './scenes/Snake';
import { FixedSnake } from './scenes/FixedSnake';
import { TakeApples } from './scenes/TakeApples';
import { TextScene } from './scenes/TextScene';
import { setNextScene } from './functions/handleData';

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
        FixedSnake,
        TakeApples,
        Outcome,
        FirstBoost,
        Questionnaire,
        TextScene
    ]
};

Phaser.Scene.prototype.setNextScene = setNextScene;

const StartGame = (parent, configData, gameFinish) => {

    const game = new Phaser.Game({ ...config, parent });
    game.registry.set('configuration', configData);
    game.registry.set('on_game_finished', gameFinish);

    return game;

}

export default StartGame;
