import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { SnakeGame } from '../classes/SnakeGame';
import { drawApples } from '../functions/draw';
import { SimpleText } from '../functions/components';


export class Snake extends Scene
{
    gridDimetions = {x: 32, y: 18};
    cellSize = 40*0.7;
    snakeGame = null;
    gameField = null;
    gameFieldLabel = null;
    scoreLabel = null;
    cursors = null;
    gamePaused = true;
    gameOver = false;
    timer = 0;
    updatedDirection = false;
    data = null;
    gameContainer = null;
    allowDirectionChange = true;


    constructor ()
    {
        super('Snake');
    }

    create()
    {
        var data = this.registry.get('data');
        this.data = data;

        this.cameras.main.setBackgroundColor(0x000000);
        const gameSize = {x: this.sys.game.config.width, y: this.sys.game.config.height};
        const sceneData = data.scenesData.Snake;
        const applesStolen = data.roundApplesSteal.at(-1) ?? 0;
        this.allowDirectionChange = true;

        //setting oponent info panel
        const opponentImage = this.add.image(0, 0, sceneData.opponentImage)
            .setOrigin(0.5);

        const upperOpponentText = SimpleText(this, 0, -300, sceneData.topOpponentText)
            .setOrigin(0.5);

        const lowerOpponentText = SimpleText(this, 0, 300, sceneData.bottomOpponentText + ` rank ${data.opponentPosition}, score ${data.opponentScore}`,
            {fontSize: 38}).setOrigin(0.5);

        const applePanel = drawApples(this, data.applesCount, applesStolen, 1, 50);
        
        const appleContainer = this.add.container(-150,500, applePanel);
        const opponentInfoContainer = this.add.container(0, 0, [opponentImage, upperOpponentText, lowerOpponentText, appleContainer]);
        opponentInfoContainer.setScale(0.5, 0.5);
        opponentInfoContainer.setPosition(gameSize.x*0.9, gameSize.y*0.3);
        
        //setting playground
        this.gameField = this.add.rectangle(0, 0, 
            this.cellSize*this.gridDimetions.x, this.cellSize*this.gridDimetions.y, 0x505050).setOrigin(0);
            
        this.gameFieldLabel = SimpleText(this, this.gameField.width/2, this.gameField.height/2,
            sceneData.gameFieldText, {fontSize: 38}).setOrigin(0.5);        
                        
        this.scoreLabel = SimpleText(this, this.gameField.width/2, -20,
            sceneData.scoreText, {fontSize: 30}).setOrigin(0.5);
            
        console.log(`${data.applesCount} ${applesStolen}`);
        this.gameContainer = this.add.container(0, gameSize.y*0.15, [this.gameField, this.gameFieldLabel, this.scoreLabel]);
            
        //setting up keyboard input handling
        this.cursors = this.input.keyboard.createCursorKeys();

        // setting up snake game
        this.gamePaused = true;
        this.snakeGame = new SnakeGame(
            this,
            this.gameContainer,
            300,
            this.gridDimetions.x,
            this.gridDimetions.y,
            this.cellSize
        );

        this.snakeGame.spawnPlayer();
        this.snakeGame.spawnApples(2);

        if( applesStolen > 0)
        {
            this.snakeGame.score = applesStolen;
            this.scoreLabel.setText(`Score: ${this.snakeGame.score}`);
        }

        this.input.enabled = true;
        this.input.keyboard.on('keydown-P', () => this.endGame(data.opponentScore + 1), this);

        EventBus.emit('current-scene-ready', this);
    }

    update(time, delta)
    {
        
        if(this.cursors.up.isDown) {
            this.allowDirectionChange = false;
            this.snakeGame.setDirection('Up');
            this.updatedDirection = true;
        } else if(this.cursors.down.isDown) {
            this.allowDirectionChange = false;
            this.snakeGame.setDirection('Down');
            this.updatedDirection = true;
        } else if(this.cursors.left.isDown) {
            this.allowDirectionChange = false;
            this.snakeGame.setDirection('Left');
            this.updatedDirection = true;
        } else if(this.cursors.right.isDown) {
            this.allowDirectionChange = false;
            this.snakeGame.setDirection('Right');
            this.updatedDirection = true;
        }

        if(this.gamePaused)
        {
            if(this.cursors.up.isDown)
            {
                this.gamePaused = false;
                this.gameFieldLabel.setVisible(false);
            }
        }
        else if(this.gameOver === true)
        {
            this.gameOver = false;
            this.timer = 0;
            this.gamePaused = true;
            this.endGame();
        }
        else
        {
            this.timer += delta;
            if(this.timer >= this.snakeGame.frameTime)
            {
                this.timer = 0;
                this.snakeGame.movePlayer();
                this.allowDirectionChange = true;
                const eatenApple = this.snakeGame.checkAppleCollision();
                if(eatenApple !== false)
                {
                    //update score
                    this.snakeGame.speedUp();
                    this.snakeGame.removeApple(eatenApple);
                    this.snakeGame.grow = true;
                    this.snakeGame.score += 1;
                    this.scoreLabel.setText(`Score: ${this.snakeGame.score}`);
                    this.snakeGame.spawnApples(1);
                }
                
                if(this.snakeGame.checkPlayerCollision() == true)
                {
                    this.gameOver = true;
                }

                this.updatedDirection = false;
            }
        }

    }

    endGame(n)
    {
        if(n !== undefined)
        {
            this.snakeGame.score = n;
        }

        this.gameFieldLabel.setVisible(true);
        this.gameFieldLabel.setText("Game Over");
        this.children.bringToTop(this.gameFieldLabel);

        this.data.roundScore.push(this.snakeGame.score);
        this.registry.set('data', this.data);
        this.time.delayedCall(2000, () => {
            this.setNextScene(this.data);
        });
    }


}

