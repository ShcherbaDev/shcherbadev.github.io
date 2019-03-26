function controller(api) {
    let hoveredSoundtrack = 0;
    let selectedSoundtrack = 0;
    let isPlaying = false;

    const selectColor = "yellow";
    const defaultColor = "white";

    const soundtrackList = api.world.getElementsFromLayer(2);
    soundtrackList[hoveredSoundtrack].settings.settings.color = selectColor;

    api.keyboard.pressEvent(e => {
        if(hoveredSoundtrack > 0) {
            hoveredSoundtrack--;
            soundtrackList[hoveredSoundtrack+1].settings.settings.color = defaultColor;
        }

        else {
            hoveredSoundtrack = soundtrackList.length-1;
            soundtrackList[0].settings.settings.color = defaultColor;
        }
        soundtrackList[hoveredSoundtrack].settings.settings.color = selectColor;
    }, "arrLeft");

    api.keyboard.pressEvent(e => {
        if(hoveredSoundtrack < soundtrackList.length-1) {
            hoveredSoundtrack++;
            soundtrackList[hoveredSoundtrack-1].settings.settings.color = defaultColor;
        }

        else {
            hoveredSoundtrack = 0;
            soundtrackList[soundtrackList.length-1].settings.settings.color = defaultColor;
        }
        soundtrackList[hoveredSoundtrack].settings.settings.color = selectColor;
    }, "arrRight");

    api.keyboard.pressEvent(e => {
        if(isPlaying && selectedSoundtrack === hoveredSoundtrack) {
            isPlaying = false;
            api.audio.stop(api.audio.list[selectedSoundtrack].name);
            return;
        }

        if(isPlaying && selectedSoundtrack !== hoveredSoundtrack) {
            api.audio.stop(api.audio.list[selectedSoundtrack].name);
            selectedSoundtrack = hoveredSoundtrack;
            api.audio.play(api.audio.list[selectedSoundtrack].name);
            return;
        }

        if(!isPlaying && selectedSoundtrack === hoveredSoundtrack) {
            isPlaying = true;
            api.audio.play(api.audio.list[selectedSoundtrack].name);
            return;
        }

        if(!isPlaying && selectedSoundtrack !== hoveredSoundtrack) {
            isPlaying = true;
            selectedSoundtrack = hoveredSoundtrack;
            api.audio.play(api.audio.list[selectedSoundtrack].name);
            return;
        }
    }, "enter");
}