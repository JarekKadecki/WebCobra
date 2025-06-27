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