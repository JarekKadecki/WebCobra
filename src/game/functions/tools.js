export function randomInt(a, b)
{
    a = Math.floor(a);
    b = Math.floor(b);
    return Math.floor(Math.random()*Math.abs(b-a) + Math.min(a, b));
}

export function mod(a, b)
{
    a = Math.floor(a);
    b = Math.floor(b);

    while(a < 0) a+=b;
    return a%b;
}

export function printData(data)
{
    let print = {};
    
    print.gameScenes           = data.gameScenes;
    print.gameRounds           = data.gameRounds;
    print.currentRound         = data.currentRound;
    print.currentScene         = data.currentScene;
    print.currentQuestionnaire = data.currentQuestionnaire;
    print.roundApplesSteal     = data.roundApplesSteal;
    print.roundScore           = data.roundScore;
    print.roundOutcome         = data.roundOutcome;
    print.roundBoost           = data.roundBoost;
    print.playerPosition       = data.playerPosition;
    print.answers              = data.answers;

    console.log(print);
}