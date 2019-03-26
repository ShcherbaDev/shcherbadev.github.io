function controller(api) {
    function checkLevel() {
        return api.world.currentLevelName === "Choose the language";
    }

    const flags = [
        api.world.getElementsFromLayer(2)[0].settings, // Britain flag
        api.world.getElementsFromLayer(2)[1].settings, // Ukrainian flag
        api.world.getElementsFromLayer(2)[2].settings  // Russian flag
    ];

    const languagesLabels = [
        api.world.getElementsFromLayer(3)[0].settings, // English language
        api.world.getElementsFromLayer(3)[1].settings, // Ukrainian language
        api.world.getElementsFromLayer(3)[2].settings  // Russian language
    ];

    const languagesPaths = [
        "/resources/languages/english.json",
        "/resources/languages/russian.json",
        "/resources/languages/ukrainian.json"
    ];

    let hoveredLanguage = 0;
    let canChooseLanguage = true;
    let chooseRect;

    if(checkLevel()) {
        chooseRect = api.world.createElement({
            type: "rectangle",
            name: "chooseRect",
            settings: {
                fill: "yellow"
            },
            coords: [
                flags[hoveredLanguage].coords[0]-5,
                flags[hoveredLanguage].coords[1]-5,
                flags[hoveredLanguage].coords[2]+10,
                flags[hoveredLanguage].coords[3]+10
            ],
            layer: 1
        });
    }

    for(let label of languagesLabels)
        label.settings.color = "white";

    languagesLabels[hoveredLanguage].settings.color = "yellow";

    api.keyboard.pressEvent(() => {
        if(canChooseLanguage && checkLevel()) {
            if(hoveredLanguage > 0) {
                hoveredLanguage--;
                languagesLabels[hoveredLanguage+1].settings.color = "white";
            }

            else {
                hoveredLanguage = flags.length-1;
                languagesLabels[0].settings.color = "white";
            }

            chooseRect.coords[0] = flags[hoveredLanguage].coords[0]-5;
            languagesLabels[hoveredLanguage].settings.color = "yellow";
        }
    }, "arrLeft");

    api.keyboard.pressEvent(() => {
        if(canChooseLanguage && checkLevel()) {
            if(hoveredLanguage < flags.length-1) {
                hoveredLanguage++;
                languagesLabels[hoveredLanguage-1].settings.color = "white";
            }

            else {
                hoveredLanguage = 0;
                languagesLabels[flags.length-1].settings.color = "white";
            }

            chooseRect.coords[0] = flags[hoveredLanguage].coords[0]-5;
            languagesLabels[hoveredLanguage].settings.color = "yellow";
        }
    }, "arrRight");

    api.keyboard.pressEvent(() => {
        if(canChooseLanguage && checkLevel()) {
            canChooseLanguage = false;

            api.app.setGlobalVariable("selectedLanguage", api.loaders.jsonFile("language", languagesPaths[hoveredLanguage]));
            api.audio.play("languageConfirm");

            setTimeout(() => {
                api.world.createElement({
                    type: "rectangle",
                    name: "backgroundFill",
                    settings: {
                        fill: "#000"
                    },
                    coords: [
                        0, 0,
                        api.app.canvas.width, api.app.canvas.height
                    ],
                    layer: 999
                });
            }, 490);

            setTimeout(() => {
                if(api.world.getElementByName('backgroundFill') !== undefined)
                    api.world.deleteElement('backgroundFill');

                if(api.world.getElementByName('chooseRect') !== undefined)
                    api.world.deleteElement('chooseRect');

                api.world.setLevel("/resources/levels/dialog/dialogView.json");
            }, 1800);
        }
    }, "enter");
}