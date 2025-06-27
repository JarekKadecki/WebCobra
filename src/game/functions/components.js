export function Button(scene, x, y, img, callback)
{      
    const boostUpButton = scene.add.image(x, y, img);
    boostUpButton.setInteractive({ useHandCursor: true })
    .on('pointerdown', callback);
    boostUpButton.on('pointerover', () => {
        boostUpButton.setTint(0xaaaaaa);
    });
    boostUpButton.on('pointerout', () => {
        boostUpButton.clearTint();
    });

    return boostUpButton;
}

export function SimpleText(scene, x, y, text, config)
{
    var defaultConfig = {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        };
    if(config != undefined)
    {
        if("fontFamily" in config)  defaultConfig.fontFamily    = config.fontFamily;
        if("fontSize" in config)    defaultConfig.fontSize      = config.fontSize;
        if("color" in config)       defaultConfig.color         = config.color;
    }
    
    const simpleText = scene.add.text(x, y, text, defaultConfig);
    
    return simpleText;
}