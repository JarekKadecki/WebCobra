import { Boot } from './scenes/Boot';
import { FirstBoost } from './scenes/FirstBoost';
import { NextOpponent } from './scenes/NextOpponent';
import { Outcome } from './scenes/Outcome';
import { Preloader } from './scenes/Preloader';
import { Questionnaire } from './scenes/Questionnaire';
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
        FirstBoost,
        Questionnaire
    ]
};

Phaser.scene.prototype.setNextScene = function(data)
{
    try {
        
        if(data.currentScene == data.gameScenes.length-1 && data.currentRound == data.gameRounds-1)
        {

            //send gameplay data on finish
            const endGame = this.registry.get('on_game_finished');
            //Choose which stats are about to be submitted
            const stats = {
                roundApplesSteal: data.roundApplesSteal,
                roundScore: data.roundScore,
                roundOutcome: data.roundOutcome,
                roundBoost: data.roundBoost,
                playerPosition: data.playerPosition,
                answers: data.answers
            }
            endGame(stats);
        }
        else if(data.currentRound < data.gameRounds) {
            if(data.currentScene == data.gameScenes.length - 1) {
                data.currentRound += 1;
                data.currentScene = (data.currentScene + 1) % data.gameScenes.length;
            }
        }
        
        return data.gameScenes[data.currentScene];
    }
    catch(error) {
        console.log(error);

        return 'Preloader';
    }
};

const StartGame = (parent, configData, gameFinish) => {

    const game = new Phaser.Game({ ...config, parent });
    game.registry.set('configuration', configData);
    game.registry.set('on_game_finished', gameFinish);

    return game;

}

export default StartGame;
