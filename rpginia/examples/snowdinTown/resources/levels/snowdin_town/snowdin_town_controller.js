function controller(api) {
    const { world, keyboard, camera } = api;
    const background = world.getElementByName('Main background').settings;

    const handleKeyboard = () => {
        if(keyboard.keys.length > 0) {
            if(keyboard.isPressed('arrLeft') && camera.x !== 0) {
                background.coords[0] = background.coords[0] - 1;
            }

            if(api.keyboard.isPressed('arrRight')) {
                background.coords[0] = background.coords[0] + 1;
            }
        }
        requestAnimationFrame(handleKeyboard);
    };

    if(world.currentLevelName === 'Snowdin town') {
        handleKeyboard();
    }

    else {
        cancelAnimationFrame(handleKeyboard);
    }
}