export function setNextEnemy(data) {
    const currentRound = (data.currentRound + 1) ?? 1;

    var newData = data;

    if (data.roundOutcome.at(-1) == 1) {
        const newOpponentImage = 'anon' + data.roundOutcome.length.toString();
        newData.opponentImage = newOpponentImage;

        const newOpponentScore = data.roundScore.at(-1) +
            data.opponentScoreUpgrade;
        newData.opponentScore = newOpponentScore;

        const newOpponentPosition = data.playerPosition.at(-1) ?? data.playerStartPosition;
        newData.opponentPosition = Math.ceil(newOpponentPosition * data.rankBoostFactorAfterWin);

    }
    else {
        newData.opponentScore += data.opponentScoreLoseUpgrade;
        const newOpponentPosition = data.playerPosition.at(-1) ?? data.playerStartPosition;
        newData.opponentPosition = Math.ceil(newOpponentPosition * data.rankBoostFactorAfterLoose);
    }

    return newData;
}

export function setNextRound(data) {
    var newData = data;
    const newRound = (data.currentRound + 1) ?? 1;
    newData.currentRound = newRound;

    if (newRound > data.gameRounds) return data;
    else return newData;
}

export function endGameStats(data) {
    return {
        stats: {
            roundApplesSteal: data.roundApplesSteal,
            roundScore: data.roundScore,
            roundOutcome: data.roundOutcome,
            roundBoost: data.roundBoost,
            playerPosition: data.playerPosition,
        },
        answers: data.answers
    }
}

export function setNextScene(data) {
    try {

        if (data.currentScene == data.gameScenes.length - 1 && data.currentRound == data.gameRounds - 1) {

            //send gameplay data on finish
            const endGame = this.registry.get('on_game_finished');
            //Choose which stats are about to be submitted
            const stats = endGameStats(data);

            endGame(stats);
        }
        else if (data.currentRound < data.gameRounds) {
            if (data.currentScene == data.gameScenes.length - 1) {
                data.currentRound += 1;
            }
            data.currentScene = (data.currentScene + 1) % data.gameScenes.length;
            console.log(`Loading scene ${data.currentScene}`);
        }

        this.scene.start(data.gameScenes[data.currentScene].name);
    }
    catch (error) {
        console.log(error);

        // this.scene.start('Preloader');
    }
};

export function retriveSceneData(data, nameAsserion = '') {
    let sceneIndex = data.currentScene;

    if (nameAsserion != '' && data.gameScenes[sceneIndex].name != nameAsserion) {
        throw new Error("Scene name and scene index mismatch!");
    }

    if (Array.isArray(data.gameScenes[sceneIndex].sceneData)) {
        let roundIndex = data.currentRound;
        return data.gameScenes[sceneIndex].sceneData[roundIndex];
    }
    else {
        return data.gameScenes[sceneIndex].sceneData;
    }


}