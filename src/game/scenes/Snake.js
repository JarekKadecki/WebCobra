import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Player } from '../classes/Player';
import { SnakeGame } from '../classes/SnakeGame';


export class Snake extends Scene
{
    gridDimetions = {x: 32, y: 18};
    cellSize = {x: gameSize.x/gridDimetions.x, y: gameSize.y/gridDimetions.y};
    player = null;
    snakeGame = null;

    constructor ()
    {
        super('Snake');
    }

    create()
    {
        this.cameras.main.setBackgroundColor(0x000000);
        const gameSize = {x: this.sys.game.config.width, y: this.sys.game.config.height};

        //setting oponent info panel
        const opponentImage = this.add.image(gameSize.x*0.5, gameSize.y*0.5, 'anonymous10')
        .setOrigin(0.5);

        const upperOpponentText = this.add.text(gameSize.x*0.5, gameSize.y*0.125, 'Your opponent', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);

        const lowerOpponentText = this.add.text(gameSize.x*0.5, gameSize.y*0.875, 'LEE, rank 92', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);

        const opponentInfoContainer = this.add.container(0, 0, [opponentImage, upperOpponentText, lowerOpponentText]);
        opponentInfoContainer.setScale(0.5, 0.5);
        opponentInfoContainer.setPosition(gameSize.x*0.6, gameSize.y*0.05);

        // setting playground
        const gameGrid = this.add.rectangle(0, gameSize.y*0.15, gameSize.x*0.7, gameSize.y*0.7, 0x505050).setOrigin(0);

        // setting up player
        this.player = new Player(0, 0, this.gridDimetions.x, this.gridDimetions.y);

        // setting up snake game
        this.snakeGame = new SnakeGame(this.player, 0.5, this.gridDimetions.x, this.gridDimetions.y)
        

        EventBus.emit('current-scene-ready', this);
    }

    update()
    {

    }


}
