import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { drawApples } from '../functions/draw';
import { Button, SimpleText } from '../functions/components';


export class TakeApples extends Scene
{
    constructor ()
    {
        super('TakeApples');
    }

    applesCount = 12;
    applesStolen = 0;

    create()
    {
        var data = this.registry.get('data');

        this.cameras.main.setBackgroundColor(0x000000);
        
        if(!("applesCount" in data)) data.applesCount = this.applesCount;
        else this.applesCount = data.applesCount;

        this.applesStolen = 0;

        const sceneData = data.gameScenes.filter((d) => d.name == 'TakeApples')[0].sceneData;

        const titleLabel = SimpleText(this, 175, -120, sceneData.topText).setOrigin(0.5);

        var applesTab = drawApples(this, data.applesCount, 0, 1);

        if (!Array.isArray(applesTab)) {
            console.error("drawApples did not return a valid array.");
            applesTab = [];
        }
        
        const applesContainer = this.add.container(this.scale.width*0.4, this.scale.height*0.3, [titleLabel, ... applesTab]);
                        
        const takeApplesText = SimpleText(this, 100, -200, sceneData.leftText,
            {fontSize: 20}).setOrigin(0.5);

        const addButton = Button(this, 100, -75, 'add', 
            () => {this.stealApples(1, titleLabel, applesTab)});

        const subButton = Button(this, 100, 75, 'sub', 
            () => {this.stealApples(-1, titleLabel, applesTab)});

        this.add.container(50, this.scale.height/2, [takeApplesText, addButton, subButton]);

        const nextText = SimpleText(this, 0, -75, sceneData.rightText,
            {fontSize: 25}).setOrigin(0.5);
        
        
        const nextButton = Button(this, 0, 0, 'next',
            () => {
                data.applesCount = this.applesCount;
                data.roundApplesSteal.push(this.applesStolen);
                data.opponentScore -= this.applesStolen;
                this.setNextScene(data);
            });

        this.add.container(this.scale.width*0.9, this.scale.height/2, [nextText, nextButton])


        EventBus.emit('current-scene-ready', this);
    }

    stealApples(count, label, apples)
    {
        var newApplesStolen = count + this.applesStolen;
        if(newApplesStolen >= 0 && newApplesStolen <= this.applesCount)
        {
            this.applesStolen = newApplesStolen;

            for(let i=0; i<this.applesCount; i++)
            {
                if(i<this.applesStolen) apples[i].setTexture('appleX');
                else apples[i].setTexture('apple');
            }

            const txt = `Taking away ${this.applesStolen} apples from opponent`;
            label.setText(txt);
        }
    }

}
