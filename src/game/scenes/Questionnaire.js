import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


export class Questionnaire extends Scene
{
    constructor ()
    {
        super('Questionnaire');
    }

    create()
    {
        var data = this.registry.get('data');
        
        const sceneData = data.gameScenes.filter((d) => d.name == 'Questionnaire')[0].sceneData;

        
        EventBus.emit('current-scene-ready', this);

        EventBus.emit('show-questionnaire', questions, this);

        console.log(`Showing questionnaire ${data.currentQuestionnaire}`);
        
        data.currentQuestionnaire = (data.currentQuestionnaire + 1) % data.questionnaires.length;

    }

}
