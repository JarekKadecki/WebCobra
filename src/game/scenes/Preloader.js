import { Scene } from 'phaser';
import { Outcome } from './Outcome';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');

        this.load.image('anon0', 'anon0.png');
        this.load.image('anon1', 'anon1.png');
        this.load.image('anon2', 'anon2.png');
        this.load.image('anon3', 'anon3.png');
        this.load.image('anon4', 'anon4.png');
        this.load.image('anon5', 'anon5.png');
        this.load.image('anon6', 'anon6.png');
        this.load.image('anon7', 'anon7.png');
        this.load.image('anon8', 'anon8.png');
        this.load.image('anon9', 'anon9.png');
        this.load.image('anon10', 'anon10.png');
        this.load.image('anon11', 'anon11.png');
        this.load.image('anon12', 'anon12.png');
        this.load.image('anon13', 'anon13.png');
        

        this.load.image('apple', 'apple.png')
        this.load.image('appleX', 'appleX.png');
        this.load.image('add', 'add.png');
        this.load.image('sub', 'sub.png');
        this.load.image('next', 'next.png');
        this.load.image('you', 'you.png');
        this.load.image('crown', 'crown.png');
        this.load.image('boostUp', 'boostUp.png');
        this.load.image('boostDown', 'boostDown.png');
        this.load.image('boost','boost.png');
    }

    create ()
    {
        const data = {
            scenesData: {
                NextOpponent: {
                    opponentImage: 'anon0',
                    topText: 'Next opponent:',
                    bottomText: 'Opponent'
                },
                TakeApples: {
                    topText: 'Taking away 0 apples from opponent.',
                    leftText: 'Take apples\nfrom you opponent:',
                    rightText: 'Proceed'
                },
                Snake: {
                    opponentImage: 'anon0',
                    topOpponentText: 'Your opponent',
                    bottomOpponentText: 'Opponent',
                    gameFieldText: 'Press UP to start',
                    scoreText: 'Score: 0'
                },
                Outcome: {
                    playerImage: 'you',
                    opponentImage: 'anon0',
                    leftText: 'You',
                    rightText: 'Lee'
                },
                FirstBoost: {
                    topLeftText: 'Buy booster',
                    bottomLeftText: 'Rank up for 5 pln per boost',
                    topRightText: 'Scoreboard',
                    bottomRightText: 'Proceed',
                }
            },
            gameRounds: 2,
            currentRound: 0,
            roundApplesSteal: [],
            roundScore: [],
            roundOutcome: [],
            roundBoost: [],
            opponentPosition: 92, //46 !6-> 40 --> 20 !6->14 --> 7 !6-> 1
            opponentScore: 20,
            opponentScoreUpgrade: 15,
            playerStartPosition: 112,
            playerPosition: [],
            applesCount: 12,
            boostPrice: 5,
            rankBoostFactorAfterWin: 0.5,
            rankBoostFactorAfterLoose: 0.9,
            scoreTableSize: 15
        }

        this.scene.start('NextOpponent', data);
    }
}
