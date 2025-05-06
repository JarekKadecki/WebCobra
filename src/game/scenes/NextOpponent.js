import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


export class NextOpponent extends Scene
{
    constructor ()
    {
        super('NextOpponent');
    }

    create()
    {
        this.cameras.main.setBackgroundColor(0x000000);

        this.add.image(512, 384, 'anonymous10');

        this.add.text(512, 100, 'Next opponent:', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setOrigin();

        this.add.text(512, 700, 'LEE, rank 92', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setOrigin();

        EventBus.emit('current-scene-ready', this);
    }

}
