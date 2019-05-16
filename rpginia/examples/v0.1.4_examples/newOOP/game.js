// Import engine
import RPGinia from '../../../engine_0.1.4/RPGinia.js';

(async () => {
    const app = new RPGinia();
    const loaders = new RPGinia.Loaders(app);
    const audio = new RPGinia.AudioManager(app);
    const world = new RPGinia.World(app);
    const keyboard = new RPGinia.Keyboard(app);

    const levelPathsList = [
        '/resources/levels/snowdin_town/snowdin_town_view.json',
        '/resources/levels/interiors/interior_library/interior_library_view.json'
    ];

    // Load spriteSheets
    await loaders.loadSpriteSheet('townSpriteSheet', '/resources/sprites/spriteSheet.json');

    // Add global variables
    app.setGlobalVariable('cameraSpeed', 5);
    app.setGlobalVariable('minCameraX', 0);
    app.setGlobalVariable('maxCameraX', 3677);

    // Adding keyboard keys
    keyboard.addKey('arrUp', 38);
    keyboard.addKey('arrDown', 40);
    keyboard.addKey('arrLeft', 37);
	keyboard.addKey('arrRight', 39);

    // Add background music audio with volume 50% and repeat after it ends
    audio.add('backgroundMusic', '/resources/audio/snowdin_town.mp3', 50, true);

    await world.setLevel(await loaders.loadLevel(levelPathsList[0]));

    // Draw game
    function loop() {
        app.clearPlayground();

        world.render();

        requestAnimationFrame(loop);
    }
    loop();
})();
