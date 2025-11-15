import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import QuestionnaireForm from '../components/QuestionnaireForm';
import { printData } from './functions/tools';
export const PhaserGame = forwardRef(function PhaserGame({ currentActiveScene, configData, gameFinish }, ref) {
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [questionnaireQuestions, setQuestionnaireQuestions] = useState([]);
    const questionnaireScene = useRef(null);
    const game = useRef();

    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame("game-container", configData, gameFinish);
            if (ref) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        };
    }, [ref, configData, gameFinish]);

    useEffect(() => {
        const handleSceneReady = (currentScene) => {
            if (typeof currentActiveScene === "function") currentActiveScene(currentScene);
            if (ref?.current) ref.current.scene = currentScene;
        };

        const handleShowQuestionnaire = (questions, scene) => {
            setQuestionnaireQuestions(questions);
            questionnaireScene.current = scene;
            setShowQuestionnaire(true);
        };

        const handleHideQuestionnaire = (answers) => {
            if (questionnaireScene.current) {
                const data = questionnaireScene.current.registry.get('data');
                data.answers.push(answers);
                printData(data);
                questionnaireScene.current.setNextScene(data)
            } else {
                console.error("Could not process answers — no scene reference");
            }
            setShowQuestionnaire(false);
        };

        EventBus.on('current-scene-ready', handleSceneReady);
        EventBus.on('show-questionnaire', handleShowQuestionnaire);
        EventBus.on('hide-questionnaire', handleHideQuestionnaire);

        return () => {
            EventBus.off('current-scene-ready', handleSceneReady);
            EventBus.off('show-questionnaire', handleShowQuestionnaire);
            EventBus.off('hide-questionnaire', handleHideQuestionnaire);
        };
    }, [currentActiveScene, ref]);

    return (
        <>
            <div id="game-container"></div>
            {showQuestionnaire && (
                <QuestionnaireForm questions={questionnaireQuestions} />
            )}
        </>
    );

});

PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
    configData: PropTypes.object,
    gameFinish: PropTypes.func,
};