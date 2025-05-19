import { Player } from "./Player";

class VectorSet {
    set = new Set();
    shift = 100;

    constructor(shift=100)
    {
        this.shift = shift;
    }

    add(value)
    {
        if(Number.isInteger(value))
        {
            this.set.add(value);
        }
        else if(Object.hasOwn(value, 'x') && Object.hasOwn(value, 'y'))
        {
            this.set.add(Math.floor(Number(value.x))*this.shift + Math.floor(Number(value.y)));
        }
    }

    delete(value)
    {
        if(Number.isInteger(value))
        {
            this.set.delete(value);
        }
        else if(Object.hasOwn(value, 'x') && Object.hasOwn(value, 'y'))
        {
            this.set.delete(Math.floor(Number(value.x))*this.shift + Math.floor(Number(value.y)));
        }
    }

    getSize()
    {
        return this.set.size;
    }
}

export class SnakeGame {
    player = null;
    apples = new VectorSet();
    score = 0;
    frameTime = 1;
    gridSize = {x: 0, y: 0};
    posToNumberShift = 100;

    constructor(player, frameTime=1, gridWidth, gridHeight)
    {
        this.player = player;
        this.frameTime = frameTime;
        this.gridSize = {x: gridWidth, y: gridHeight};
        this.posToNumberShift = 10 ** String(this.gridSize.y).length;
        this.apples = new VectorSet(this.posToNumberShift);
    }

    vectorToNumber(value)
    {
        if(Object.hasOwn(value, 'x') && Object.hasOwn(value, 'y'))
        {
            return Math.floor(Number(value.x))*this.posToNumberShift + Math.floor(Number(value.y));
        }
        else
        {
            console.error("Invalid vector passed to SnakeGame::vectorToNumber");
        }
        return 0;
    }

    spawnApples(number)
    {
        var playerCoordsToNumbers = [];
        if(this.player instanceof Player){
            this.player.body.forEach(element => {
                playerCoordsToNumbers.add(this.vectorToNumber(element.getPos()));
            });
        }
        else
        {
            console.error("Invalid Player instance passed to SnakeGame::spawnApples");
        }

        var newApplesCoords = [];
        while(newApplesCoords.length < number)
        {
            var tempCoord = Math.floor(Math.random() * (this.gridSize.x*this.posToNumberShift + this.gridSize.y));
            if (!playerCoordsToNumbers.includes(tempCoord)) 
            {
                newApplesCoords.add(tempCoord);
            }
        }

        newApplesCoords.forEach(coord => this.apples.add(coord));
    }
}