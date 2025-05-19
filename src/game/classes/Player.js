
class Segment {
    x = -1;
    y = -1;
    prev = null;
    next = null;
    added = false;

    constructor (x=-1, y=-1, prev=null, next=null)
    {
        this.x = x;
        this.y = y;
        this.prev = prev;
        this.next = next;
    }

    setPos(x, y)
    {
        this.x = x;
        this.y = y;
    }

    getPos()
    {
        return {x: this.x, y: this.y};
    }

    add()
    {
            this.added = true;
    }

    setPrev(prev)
    {
        this.prev = prev;
    }

    setNext(next)
    {
        this.next = next;
    }
}

const Direction = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
  }

export class Player {
    body = [];
    mapSize = {x: 0, y: 0};
    direction = Direction.Right;
    
    constructor(x, y, mapWidth, mapHeight)
    {
        this.body.push(new Segment(x, y));
        this.mapSize = {mapWidth, mapHeight};

    }

    //move head according to current direction
    //set pos of each segment to pos of prev
    //add segments added with grow
    moveBody()
    {
        this.body.forEach( (segment) => {
            if(segment.prev != null && segment.added == true)
            {
                segment.setPos(segment.prev.x, segment.prev.y);
            }
            else if(segment.added == false)
            {
                segment.added = true;
            }
        })

        var headPos = this.body[0].getPos();
        switch (this.direction) {
            case 'Up': headPos.y -= 1; break;
            case 'Down': headPos.y += 1; break;
            case 'Left': headPos.x -= 1; break;
            case 'Right': headPos.x += 1; break;
            default: break;
        }
        if(headPos.y < 0) headPos.y += this.mapSize.y;
        if(headPos.x < 0) headPos.x += this.mapSize.x;

        if(headPos.y >= this.mapSize.y) headPos.y = headPos.y % this.mapSize.y;
        if(headPos.x >= this.mapSize.x) headPos.x = headPos.x % this.mapSize.x;

        this.body[0].setPos(headPos.x, headPos.y);
    }

    //Add new segment to body array with added attribute set to false as body hasn't moved yet
    grow()
    {
        var lastSegment = this.body[this.body.length-1];
        var newSegment = new Segment(lastSegment.getPos().x, lastSegment.getPos().y, prev = lastSegment);
        lastSegment.setNext(newSegment);
        this.body.push(newSegment);
    }

    checkSelfCollision()
    {
        var collision = false;
        const copyBody = [...this.body];
        copyBody.sort( (a, b) => a.getPos().x - b.getPos().x);
        for(let i = 0; i<(copyBody.length-1); i++)
        {
            if(copyBody[i].getPos().x == copyBody[i+1].getPos().x && 
            copyBody[i].getPos().y == copyBody[i+1].getPos().y) 
            {
                collision = true;
            }
        }
        return collision;
    }

    checkCollision(x, y) {
        return this.body.some(segment => {
            return segment.getPos().x === x && segment.getPos().y === y;
        });
    }

    setDirection(direction)
    {
        if (Object.values(Direction).includes(direction))
        {
            this.direction = direction;
            return true;
        }
        return false;
    }
}