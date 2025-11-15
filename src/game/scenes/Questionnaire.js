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

        EventBus.emit('current-scene-ready', this);

        let questions = data.questionnaires[data.currentQuestionnaire];

        EventBus.emit('show-questionnaire', questions, this);

        console.log(`Showing questionnaire ${data.currentQuestionnaire}`);
        
        data.currentQuestionnaire = (data.currentQuestionnaire + 1) % data.questionnaires.length;

    }

}
