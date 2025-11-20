import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Button } from '../functions/components';

export class TextScene extends Scene
{
    constructor ()
    {
        super('TextScene');
    }

    create()
    {
        const data = this.registry.get('data');
        this.cameras.main.setBackgroundColor(0x000000);

        const sceneData = data.gameScenes.filter((d) => d.name === 'TextScene')[0].sceneData;

        const screenW = this.scale.width;
        const screenH = this.scale.height;

        let textObj = this.add.text(
            0,
            0,
            sceneData.text,
            {
                fontFamily: 'Verdana',
                fontSize: '48px',
                color: '#ffff00',
                wordWrap: { width: screenW * 0.9, useAdvancedWrap: true },
                align: 'center'
            }
        ).setOrigin(0.5, 0.5);

        let targetMaxHeight = screenH * 0.75;
        let fontSize = 48;

        while (fontSize > 10)
        {
            textObj.setFontSize(fontSize);
            const bounds = textObj.getBounds();

            if (bounds.height <= targetMaxHeight)
                break;

            fontSize -= 2;
        }

        textObj.setPosition(screenW * 0.5, screenH * 0.45);

        const nextButton = Button(
            this,
            screenW * 0.5,
            screenH * 0.9,
            'next',
            () => this.setNextScene(data)
        );
        nextButton.setOrigin(0.5, 0.5);

        EventBus.emit('current-scene-ready', this);
    }
}
