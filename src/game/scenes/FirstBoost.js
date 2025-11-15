import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Button, SimpleText } from '../functions/components';
import { setNextEnemy, setNextRound } from '../functions/handleData';

export class FirstBoost extends Scene {
    constructor() {
        super('FirstBoost');
    }

    boostPrice = 5;
    maxBoost = 6;
    scoreTableSize = 15;
    purchasedBoost = 0;
    scoreboardTable = null;
    playerRecordColor = 0x505000;
    recordColor = 0x303030;
    currentPlayerPosition = 112;

    create() {

        var data = this.registry.get('data');

        this.cameras.main.setBackgroundColor(0x000000);
        this.scoreTableSize = data.scoreTableSize;
        
        this.purchasedBoost = 0

        if(data.roundOutcome.at(-1)) {
            this.currentPlayerPosition = data.opponentPosition;
        } else {
            if(data.currentRound == 0) this.currentPlayerPosition = data.playerStartPosition;
            else this.currentPlayerPosition = data.playerPosition.at(-2);
        }
        
        data.playerPosition.push(this.currentPlayerPosition);

        const sceneData = data.scenesData.FirstBoost;

        const topLeftText = SimpleText(this, this.scale.width * 0.3, this.scale.height * 0.1, sceneData.topLeftText)
            .setOrigin(0.5);
        const bottomLeftText = SimpleText(this, this.scale.width * 0.3, this.scale.height * 0.2, sceneData.bottomLeftText,
            {fontSize: 15}).setOrigin(0.5);

        const boostIcons = this.placeBoost();

        const topRightText = SimpleText(this, this.scale.width * 0.65, this.scale.height * 0.1, sceneData.topRightText)
            .setOrigin(0.5);
        
        const scoreboardInfo = this.generateScoreboardInfo(data);
        this.scoreboardTable = this.drawTable(this.scale.width * 0.65, this.scale.height * 0.2, 
            scoreboardInfo.startPosition, scoreboardInfo.playerPosition, scoreboardInfo.playersScores);

        const boostUpButton = Button(this, 100, -75, 'boostUp', () =>
            this.boost(1, boostIcons));

        const boostDownButton = Button(this, 100, 75, 'boostDown', () =>
            this.boost(-1, boostIcons));

        this.add.container(50, this.scale.height / 2, [boostUpButton, boostDownButton]);

        const nextText = SimpleText(this, 0, -75, sceneData.bottomRightText,
            {fontSize: 25}).setOrigin(0.5);

        const nextButton = Button(this, 0, 0, 'next',
            () => {
                data.roundBoost.push(this.purchasedBoost);
                this.currentPlayerPosition = scoreboardInfo.playerPosition;
                data.playerPosition[data.playerPosition.length-1] = this.currentPlayerPosition;
                
                data = setNextEnemy(data);
                // data = setNextRound(data);

                if(data.currentRound < data.gameRounds)
                {
                    // pick new opponent
                    this.setNextScene(data);
                }
        });

        this.add.container(this.scale.width * 0.9, this.scale.height / 2, [nextText, nextButton]);

        EventBus.emit('current-scene-ready', this);
    }

    //function returns player position with list of score offsets on adjacent opponent positions
    generateScoreboardInfo(data) {
        var list = [];
        var newPlayerPosition = this.currentPlayerPosition;
        const opponentScore = data.opponentScore ? data.opponentScore : 10;

        
        for(let i=0; i<data.scoreTableSize; i++)
        {
            list.push(Math.floor(Math.random()*5));
        }

        list.sort((a,b) => b - a);

        var playerInitialSpotInTable = Math.floor(data.scoreTableSize * 0.6);
        if(playerInitialSpotInTable < 7) playerInitialSpotInTable += (7-playerInitialSpotInTable);
        if(playerInitialSpotInTable > data.scoreTableSize) playerInitialSpotInTable = data.scoreTableSize;

        for(let i=0; i<data.scoreTableSize; i++)
        {
            if(i < playerInitialSpotInTable)
            {
                list[i] = (data.roundScore.at(-1) + list[i]) ?? 10;
            }
            else if (i > playerInitialSpotInTable)
            {
                list[i] = (data.roundScore.at(-1) -(4 - list[i])) ?? 10;
            }
            else 
            {
                list[i] = data.roundScore.at(-1) ?? 10;
            }
        }

        // alert(list);

        var startTablePosition = newPlayerPosition - playerInitialSpotInTable;
        if(startTablePosition <= 0) startTablePosition = 1;
        
        return {
            playerPosition: newPlayerPosition,
            startPosition: startTablePosition,
            playerSpotIntable: playerInitialSpotInTable,
            playersScores: list
        }
    }

    drawRecord(x, y, text, color = this.recordColor) {
        const recordRect = this.add.rectangle(0, 0, 400, 30, color).setOrigin(0.5);
        const recordText = this.add.text(0, 0, text, {
            color: '#ffffff',
            fontSize: '15px'
        }).setOrigin(0.5);
        return this.add.container(x, y, [recordRect, recordText]);
    }

    drawTable(x, y, startId, playerId, playersScores) {
        const records = [];
        const recordsData = [];
        const recordPadding = 5;

        for (let i = 0; i < this.scoreTableSize; i++) {
            const id = startId + i;
            const isPlayer = id === playerId;
            const name = isPlayer ? 'You' : `Player ${id}`;
            const score = playersScores[i];
            const record = this.drawRecord(0, (30 + recordPadding) * i, `${id}. ${name}: ${score}`, isPlayer ? this.playerRecordColor : this.recordColor);

            records.push(record);
            recordsData.push({ id: id, name: name, score: score });
        }

        const tableContainer = this.add.container(x, y, records);

        return {
            records,
            data: recordsData,
            container: tableContainer,
            startId,
            playerId
        };
    }

    swapRecords(recordXId, recordYId) {
        const table = this.scoreboardTable;
        const xIndex = recordXId - table.startId;
        const yIndex = recordYId - table.startId;

        if (xIndex < 0 || yIndex < 0 || xIndex >= table.records.length || yIndex >= table.records.length) return;

        const recordX = table.records[xIndex];
        const recordY = table.records[yIndex];
        const nameX = table.data[xIndex].name;
        const nameY = table.data[yIndex].name;
        const scoreX = table.data[xIndex].score;
        const scoreY = table.data[yIndex].score;

        recordX.list[1].setText(`${recordXId}. ${nameY}: ${scoreX}`);
        recordY.list[1].setText(`${recordYId}. ${nameX}: ${scoreY}`);

        if(recordYId == table.playerId) 
        {
            recordX.list[0].setFillStyle(this.playerRecordColor);
            recordY.list[0].setFillStyle(this.recordColor);
        }
        if(recordXId == table.playerId)
        {
            recordX.list[0].setFillStyle(this.recordColor);
            recordY.list[0].setFillStyle(this.playerRecordColor);
        }
        
        table.data[xIndex].name = nameY;
        table.data[yIndex].name = nameX;

        if (recordXId === table.playerId) table.playerId = recordYId;
        else if (recordYId === table.playerId) table.playerId = recordXId;
    }

    placeBoost() {
        const boostIcons = [];
        const boostSize = this.textures.get('boost').getSourceImage();
        const padding = 40;
        const rows = 3;

        for (let row = 0; row < this.maxBoost / rows; row++) {
            for (let col = 0; col < rows; col++) {
                const boost = this.add.image(row * (boostSize.width + padding), col * (boostSize.height + padding), 'boost').setVisible(false);
                boostIcons.push(boost);
            }
        }

        this.add.container(350, 250, boostIcons);
        return boostIcons;
    }

    boost(n, boostIcons) {
        const newBoost = this.purchasedBoost + n;
        if (newBoost >= 0 && newBoost <= this.maxBoost) {
            this.purchasedBoost = newBoost;

            if (n === 1) boostIcons[newBoost - 1]?.setVisible(true);
            if (n === -1) boostIcons[newBoost]?.setVisible(false);

            if (this.scoreboardTable) {
                this.swapRecords(this.scoreboardTable.playerId, this.scoreboardTable.playerId - n);
            }
        }
    }
}
