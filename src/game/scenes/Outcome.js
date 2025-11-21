import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Button, SimpleText } from '../functions/components';
import { retriveSceneData } from '../functions/handleData';

export class Outcome extends Scene
{
    constructor ()
    {
        super('Outcome');
    }

    create ()
    {
        var data = this.registry.get('data');

        this.cameras.main.setBackgroundColor(0x000000);

        const sceneData = retriveSceneData(data, 'Outcome');

        // if(data.applesStolen == undefined) data = {applesStolen: 3, applesCount: 4};
        var balance = data.roundScore.at(-1)/data.opponentScore;

        if(data.roundOutcome.length > 0 && 
            ((data.roundOutcome.at(-1) == 1 && balance < 1) || (data.roundOutcome.at(-1) == 0 && balance > 1))){
            balance = data.opponentScore/data.roundScore.at(-1);
        }

        const youImage = this.add.image(0, 0, sceneData.playerImage).setScale(0.5);

        const youLabel = SimpleText(this, 0, 150, sceneData.leftText, 
            {fontSize: 32}).setOrigin(0.5);

        this.add.container(200, this.scale.height/2, [youImage, youLabel]);

        const opponentImage = this.add.image(0, 0, data.opponentImage).setScale(0.5);

        const opponentLabel = SimpleText(this, 0, 150, sceneData.rightText,
            {fontSize: 32}).setOrigin(0.5);

        this.add.container(this.scale.width/2 + 450, this.scale.height/2, [opponentImage, opponentLabel]);

        const crown = this.placeCrown(balance);
        const rectangleHeight = 200;
        const centralLabel = this.getCentralText(balance);

        var height = rectangleHeight*balance/2;
        if(height > 400) height = 400;
        const youRectangle = this.add.rectangle(0, 200, 50, height, 0xaaaaaa).setOrigin(0.5, 1);
        const youCentralLabel = SimpleText(this, 0, 220, sceneData.leftText, 
            {fontSize: 20}).setOrigin(0.5);

        height = rectangleHeight*(1/balance)/2;
        if(height > 400) height = 400;
        const opponentRectangle = this.add.rectangle(100, 200, 50, height, 0xaaaaaa).setOrigin(0.5, 1);
        const opponentCentralLabel = SimpleText(this, 100, 220, sceneData.rightText, 
            {fontSize: 20}).setOrigin(0.5);

        if(balance > 1) 
        {
            youImage.y -= 100;
            youRectangle.setFillStyle(0x00ff00);
        }
        if(balance < 1)
        {
            opponentImage.y -= 100;
            opponentRectangle.setFillStyle(0xff0000);
        }

        this.add.container(this.scale.width/2-50, 400, [centralLabel, youRectangle, youCentralLabel, opponentRectangle,opponentCentralLabel]);

        // console.log(JSON.stringify(data))
        const nextButton = Button(this, this.scale.width*0.85, this.scale.height*0.85, 'next',
            () => {
                this.setNextScene(data);
            });

        EventBus.emit('current-scene-ready', this);
    }

    getCentralText(balance)
    {
        const centralText = this.add.text(50, -300, '', {
            fontFamily: 'Arial Black', fontSize: 40, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        if(balance > 1)
        {
            centralText.setText('Victory');
            centralText.setColor('#00ff00');
        } 
        else if(balance == 1)
        {
            centralText.setText('Tie');
            centralText.setColor('#aaaaaa');
        }
        else
        {
            centralText.setText('Lose');
            centralText.setColor('#ff0000');
        }
        return centralText;
    }

    placeCrown(balance)
    {
        if(balance == 1) return null;

        const crownImage = this.add.image(0, 0, 'crown').setScale(0.5);
        if(balance > 1) crownImage.setPosition(200, 100);
        if(balance < 1) crownImage.setPosition(this.scale.width/2 + 450, 100);
        return crownImage;
    }
}
