export function setNextEnemy(data)
{
    const currentRound = (data.currentRound + 1) ?? 1;

    var newData = data;

    if(data.roundOutcome[data.currentRound] == 1 ||
        data.roundScore.at(-1) > data.opponentScore)
    {
        const newOpponentImage = 'anon' + currentRound.toString();
        newData.scenesData.NextOpponent.opponentImage = newOpponentImage;
        newData.scenesData.Snake.opponentImage = newOpponentImage;
        newData.scenesData.Outcome.opponentImage = newOpponentImage;

        const newOpponentScore =  data.roundScore.at(-1) + 
                                data.opponentScoreUpgrade;
        newData.opponentScore = newOpponentScore;

        const newOpponentPosition = data.playerPosition[data.currentRound] ?? data.playerStartPosition;
        newData.opponentPosition = Math.ceil(newOpponentPosition*data.rankBoostFactorAfterWin);

    }
    else
    {
        newData.opponentScore += data.opponentScoreLoseUpgrade;
        const newOpponentPosition = data.playerPosition[data.currentRound] ?? data.playerStartPosition;
        newData.opponentPosition = Math.ceil(newOpponentPosition*data.rankBoostFactorAfterLoose);
    }

    return newData;
}

export function setNextRound(data)
{
    var newData = data;
    const newRound = (data.currentRound + 1) ?? 1;
    newData.currentRound = newRound;

    if(newRound > data.gameRounds) return data;
    else return newData;
}