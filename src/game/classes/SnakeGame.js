import { mod, randomInt } from "../functions/tools";

const Direction = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
  }

export class SnakeGame {
    player = [];
    apples = [];
    score = 0;
    frameTime = 1000;
    gridSize = {x: 0, y: 0};
    scene = null;
    gameContainer = null;
    cellSize = 40;
    direction = Direction.Up;
    grow = false;
    appleColor = 0xf00000;
    playerColor = 0xa0f000;

    constructor(scene, gameContainer, frameTime=1000, gridWidth, gridHeight, cellSize)
    {
        this.scene = scene;
        this.frameTime = frameTime;
        this.gridSize.x = gridWidth;
        this.gridSize.y = gridHeight;
        this.cellSize = cellSize;
        this.gameContainer = gameContainer;
    }

    spawnPlayer()
    {
        const randCell = this.randUnoccupiedCell();
        this.addRect(this.player, randCell.x, randCell.y);
    }

    spawnApples(number)
    {
        for(let i=0; i<number; i++)
        {
            const freeCell = this.randUnoccupiedCell()
            this.addRect(this.apples, freeCell.x, freeCell.y);
        }
    }

    randGridCell()
    {
        const randX = randomInt(0, this.gridSize.x);
        const randY = randomInt(0, this.gridSize.y);

        return {x: randX, y: randY};
    }

    randUnoccupiedCell()
    {
        if(this.apples.length + this.player.length >= this.gridSize.x*this.gridSize.y) 
            return null;

        var uniquePos = false;
     
        while(uniquePos == false)
        {
            uniquePos = true;
            const randCell = this.randGridCell();
            for(let segment of this.player)
            {
                if(segment.x == randCell.x && segment.y == randCell.y)
                    uniquePos = false;
            }
            
            for(let segment of this.apples)
            {
                if(segment.x == randCell.x && segment.y == randCell.y)
                    uniquePos = false;
            }

            if(uniquePos == true) return randCell;
        }
    }

    setDirection(direction)
    {
        if(this.player.length == 1)
        {
            this.direction = direction;
        }
        else if((direction == Direction.Up && this.direction != Direction.Down) ||
                (direction == Direction.Down && this.direction != Direction.Up) ||
                (direction == Direction.Right && this.direction != Direction.Left) ||
                (direction == Direction.Left && this.direction != Direction.Right))
        {
            this.direction = direction;
        }
    }

    getRect(x, y, color)
    {
        const rect = this.scene.add.rectangle(x*this.cellSize, y*this.cellSize,
            this.cellSize, this.cellSize, color).setOrigin(0, 0);
        const res = {
            rectangle: rect,
            x: x,
            y: y
        };

        return res;
    }

    addRect(tab, x, y)
    {
        var color = this.appleColor;
        if(tab == this.player) color = this.playerColor;
        const res = this.getRect(x, y, color);
        tab.push(res);
        this.gameContainer.add(res.rectangle);

        return res;
    }

    movePlayer()
    {
        const head = this.player[0];

        if(this.grow == true)
        {
            // console.log("Growing");
            this.grow = false;
            const tail = this.player.at(-1);
            this.addRect(this.player, tail.x, tail.y);
        }

        var newHead = this.player.pop();

        switch(this.direction)
        {
            case Direction.Up: 
                newHead.x = head.x;
                newHead.y = head.y-1;
                break;
            case Direction.Down:
                newHead.x = head.x;
                newHead.y = head.y+1;
                break;
            case Direction.Right:
                newHead.x = head.x+1;
                newHead.y = head.y;
                break;
            case Direction.Left:
                newHead.x = head.x-1;
                newHead.y = head.y;
                break;
            default: break;
        }

        newHead.x = mod(newHead.x, this.gridSize.x);
        newHead.y = mod(newHead.y, this.gridSize.y);

        newHead.rectangle.setPosition(newHead.x*this.cellSize, newHead.y*this.cellSize);
        this.gameContainer.add(newHead.rectangle);

        this.player.splice(0, 0, newHead);

        // console.log(`x: ${newHead.x} y: ${newHead.y}`)
        // this.player.forEach((x) => {console.log(`Player: x:${x.x} y:${x.y}`)});
        // console.log('\n');
    }

    checkPlayerCollision()
    {
        for(let i=0 ;i<this.player.length; i++)
            for(let j=0; j<this.player.length; j++)
        {
            if(i !== j)
            {
                if(this.player[i].x == this.player[j].x &&
                    this.player[i].y == this.player[j].y)
                    return true;
            }
        }

        return false;
    }

    checkAppleCollision()
    {
        for(let i=0; i<this.apples.length; i++)
            for(let segment of this.player)
                if(this.apples[i].x == segment.x && this.apples[i].y == segment.y)
                    {
                        // console.log(this.apples)
                        // console.log(`PlayerHead at ${this.player[0].x} ${this.player[0].y}`);
                        // console.log(`apple at ${this.apples[i].x} ${this.apples[i].y}`);
                        // console.log();
                        return i;
                    }

        return false;
    }

    removeApple(i)
    {
        if(i>=0 && i<this.apples.length)
        {
            this.apples[i].rectangle.setVisible(false).setActive(false);
            this.apples.splice(i, 1);
        }
    }

    speedUp()
    {
        this.frameTime *= 0.9;
    }

    reset() {
        this.player.forEach(p => p.rectangle.destroy());
        this.apples.forEach(a => a.rectangle.destroy());
        this.player = [];
        this.apples = [];
        this.score = 0;
        this.direction = 'Up';
        this.grow = false;
    }   

}