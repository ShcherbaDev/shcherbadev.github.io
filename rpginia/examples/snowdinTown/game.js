import RPGinia from '../../engine_0.1.3/RPGinia.js';

const engine = new RPGinia('https://shcherbadev.github.io/rpginia/examples/snowdinTown/');
const app = new engine.App('My snowdin town');
const world = new app.World();
const cam = new app.Camera();
const loaders = new app.Loaders();
const kb = new app.Keyboard();

world.initialize({
    app,
    loaders,
    camera: cam,
    levels: loaders.jsonFile('level', '/resources/levels/snowdin_town/snowdin_town_view.json'),
    keyboard: kb
});

kb.addKey('arrUp', 38);
kb.addKey('arrDown', 40);
kb.addKey('arrLeft', 37);
kb.addKey('arrRight', 39);

function loop() {
    app.clearPlayground();

    world.draw();

    if(kb.isPressed('arrLeft') && cam.x !== 0) {
        cam.move(5, 0);
    }

    if(kb.isPressed('arrRight')) {
        cam.move(-5, 0);
    }

    requestAnimationFrame(loop);
}
loop();