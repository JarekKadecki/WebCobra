export function drawApples(scene, applesCount, applesTaken = 0, scale = 1, padding = 80, maxApplesInRow = 4)
{
    const maxNumberOfRows = Math.ceil(applesCount/maxApplesInRow);

    var applesPlaced = 0;
    var applesTakenPlaced = 0;
    var applesTab = [];
    padding = padding*scale;
    const appleSize = scene.textures.get('apple').getSourceImage();
    for(let row=0; row < maxNumberOfRows; row++)
        for(let col=0; col<maxApplesInRow; col++)
        {
            if(applesTakenPlaced < applesTaken)
            {
                applesTab.push(scene.add.image(col* (appleSize.width+padding) , row*(appleSize.height+padding), 'appleX').setScale(scale));
                applesTakenPlaced++;
            }
            else
            {
                applesTab.push(scene.add.image(col* (appleSize.width+padding) , row*(appleSize.height+padding), 'apple').setScale(scale));
            }
            applesPlaced++;
            if(applesPlaced == applesCount)
            {
                row = maxNumberOfRows;
                break;
            }
        }
        
    return applesTab;
}