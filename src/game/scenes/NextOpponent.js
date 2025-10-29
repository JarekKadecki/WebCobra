import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { SimpleText } from '../functions/components';


export class NextOpponent extends Scene
{
    constructor ()
    {
        super('NextOpponent');
    }

    create()
    {
        var data = this.registry.get('data');

        this.cameras.main.setBackgroundColor(0x000000);

        const sceneData = data.scenesData.NextOpponent;

        this.add.image(this.scale.width*0.5, this.scale.height*0.5, sceneData.opponentImage);
        
        const topText = SimpleText(this, this.scale.width*0.5, 100, sceneData.topText + ` rank ${data.opponentPosition}, score ${data.opponentScore}`)
            .setOrigin();
        const bottomText = SimpleText(this, this.scale.width*0.5, 650, sceneData.bottomText
            ,{fontSize: 38}).setOrigin();

        EventBus.emit('current-scene-ready', this);

        console.log(JSON.stringify(data));

        this.time.delayedCall(5000, () => {
            this.scene.setNextScene(data);
        });
    }

}
