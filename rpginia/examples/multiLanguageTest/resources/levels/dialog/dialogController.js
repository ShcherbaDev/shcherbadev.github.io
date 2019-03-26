function controller(api) {
    let replics = api.app.getGlobalVariable("selectedLanguage") ? 
                api.app.getGlobalVariable("selectedLanguage").data.replics :
                api.loaders.jsonFile('language', '/resources/languages/english.json').data.replics; // If global variable "selectedLanguage" is undefined

    const textMessage = api.world.getElementByName('testText').settings;
    textMessage.settings.text = replics['test_multilanguage_text'];

    const selectedLanguage = api.world.getElementByName('selectedLanguage').settings;
    selectedLanguage.settings.text = replics['selected_language'];

    const padding = 6;

    api.world.createElement({
        name: 'dialogBoxBorder',
        type: 'rectangle',
        settings: {
            fill: '#fff'
        },
        coords: [
            20, api.app.canvas.height-200, api.app.canvas.width-20*2, 180
        ]
    });

    api.world.createElement({
        name: 'dialogBoxMainWindow',
        type: 'rectangle',
        settings: {
            fill: '#000'
        },
        layer: 1,
        coords: [
            20+padding, api.app.canvas.height-200+padding, api.app.canvas.width-20*2-padding*2, 180-padding*2
        ]
    });

    const phrase = replics['ring'];
    let currentSymbolIndex = 0;

    api.world.createElement({
        name: 'dialogText',
        type: 'text',
        settings: {
            font: '8bitoperator',
            size: 42,
            color: '#fff',
            text: '',
            horizontalAlign: 'left'
        },
        coords: [20+padding+20, api.app.canvas.height-200+padding+30]
    });

    let interval = setInterval(() => {
        if(currentSymbolIndex < phrase.length) {
            api.world.getElementByName('dialogText').settings.settings.text += phrase[currentSymbolIndex];
            currentSymbolIndex++;
        }
        else
            clearInterval(interval);
    }, 100);
}