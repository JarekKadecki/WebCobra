import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(512, 384, 'background');

        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress) => {

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
        
        this.load.image('apple', 'apple.png');
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
        const defaultData = {
            gameRounds: 2,
            gameScenes: [
                // {
                //     name: 'NextOpponent',
                //     sceneData: {
                //             topText: 'Next opponent:',
                //             bottomText: 'Opponent'
                //     },
                // }, 
                // {
                //     name: 'TakeApples',
                //     sceneData: {
                //         topText: 'Taking away 0 apples from opponent.',
                //         leftText: 'Take apples\nfrom you opponent:',
                //         rightText: 'Proceed'
                //     },
                // }, 
                // {
                //     name: 'Snake',
                //     sceneData: {
                //         topOpponentText: 'Your opponent',
                //         bottomOpponentText: 'Opponent',
                //         gameFieldText: 'Press UP to start',
                //         scoreText: 'Score: 0'
                //     },
                // },
                {
                    name: 'FixedSnake',
                    sceneData: {
                        topOpponentText: 'Your opponent',
                        bottomOpponentText: 'Opponent',
                        gameFieldText: 'Press UP to start',
                        promptText: 'You are very close!',
                        outcome: 1,
                        apples: 10,
                        promptTrigger: 10
                    },
                }, 
                {
                    name: 'Outcome',
                        sceneData: {
                        playerImage: 'you',
                        leftText: 'You',
                        rightText: 'Lee'
                    },
                },
                { 
                    name: 'FirstBoost',
                    sceneData: {
                        topLeftText: 'Buy booster',
                        bottomLeftText: 'Rank up for 5 pln per boost',
                        topRightText: 'Scoreboard',
                        bottomRightText: 'Proceed',
                    },
                },
                {
                    name: 'Questionnaire',
                    sceneData: {
                        currentQuestionnaire: 0,
                        questionnaires: [
                                            [
                                                {
                                                    title: "1. What is the answer to question1?",
                                                    answers: ["q1_answer1", "q1_answer2", "q1_answer3", "q1_answer4"]
                                                },
                                                {
                                                    title: "1. What is the answer to question2?",
                                                    answers: ["q2_answer1", "q2_answer2", "q2_answer3", "q2_answer4"]
                                                },
                                                {
                                                    title: "1. What is the answer to question3?",
                                                    answers: ["q3_answer1", "q3_answer2", "q3_answer3", "q3_answer4"]
                                                }
                                            ],
                                            [
                                                {
                                                    title: "2. What is the answer to question1?",
                                                    answers: ["q1_answer1", "q1_answer2", "q1_answer3", "q1_answer4"]
                                                },
                                                {
                                                    title: "2. What is the answer to question2?",
                                                    answers: ["q2_answer1", "q2_answer2", "q2_answer3", "q2_answer4"]
                                                },
                                                {
                                                    title: "2. What is the answer to question3?",
                                                    answers: ["q3_answer1", "q3_answer2", "q3_answer3", "q3_answer4"]
                                                }
                                            ],
                                            [
                                                {
                                                    title: "3. What is the answer to question1?",
                                                    answers: ["q1_answer1", "q1_answer2", "q1_answer3", "q1_answer4"]
                                                },
                                                {
                                                    title: "3. What is the answer to question2?",
                                                    answers: ["q2_answer1", "q2_answer2", "q2_answer3", "q2_answer4"]
                                                },
                                                {
                                                    title: "3. What is the answer to question3?",
                                                    answers: ["q3_answer1", "q3_answer2", "q3_answer3", "q3_answer4"]
                                                }
                                            ],
                                        ]
                    },
                }
            ],
            opponentPosition: 92, //46 !6-> 40 --> 20 !6->14 --> 7 !6-> 1
            opponentScore: 20,
            opponentScoreUpgrade: 15,
            opponentScoreLoseUpgrade: 1,
            opponentImage: 'anon0',
            playerStartPosition: 112,
            applesCount: 12,
            boostPrice: 5,
            rankBoostFactorAfterWin: 0.5,
            rankBoostFactorAfterLoose: 0.9,
            scoreTableSize: 15,
        }

        var data = this.registry.get('configuration');
        if(!data) {
            console.error("Could not get configuration. Loading default configuration");
            data = defaultData;
        }

        data.currentRound       = 0;
        data.currentScene       = 0;
        data.roundApplesSteal   = [];
        data.roundScore         = [];
        data.roundOutcome       = [];
        data.roundBoost         = [];
        data.playerPosition     = [];
        data.answers            = [];

        this.registry.set('data', data);

        this.scene.start(data.gameScenes[data.currentScene].name);
    }
}
