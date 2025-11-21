import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { retriveSceneData } from '../functions/handleData';


export class Questionnaire extends Scene
{
    constructor ()
    {
        super('Questionnaire');
    }

    create()
    {
        var data = this.registry.get('data');
        
        const sceneData = retriveSceneData(data, 'Questionnaire');

        
        EventBus.emit('show-questionnaire', sceneData.questions, this);
        
        EventBus.emit('current-scene-ready', this);

    }

}
