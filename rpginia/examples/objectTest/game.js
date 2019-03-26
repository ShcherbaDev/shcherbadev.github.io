import RPGinia from '../../engine_0.1.3/RPGinia.js';

const engine = new RPGinia();
const app = new engine.App("Test RPGinia app");
const kb = new app.Keyboard();
const load = new app.Loaders(true);
const world = new app.World(true);

kb.addKey('arrLeft', 37);
kb.addKey('arrRight', 39);

world.initialize({
    app: app,
    levels: load.jsonFile("level", "/resources/levels/test/view.json")
});

world.createElement({
    name: "firstDynamicalText",
    type: "text",
    settings: {
        text: "Text created via game.js",
        color: "red",
        size: 32,
        horizontalAlign: "left"
    },
    coords: [151, 70],
    layer: 2
});

world.createElement({
    name: "secondDynamicalText",
    type: "text",
    settings: {
        text: "Text created via game.js (2)",
        color: "#bbb",
        size: 32,
        horizontalAlign: "left"
    },
    coords: [10, 500]
});

world.createElement({
    name: "cyanRectangle",
    type: "rectangle",
    settings: {
        fill: "cyan"
    },
    coords: [150, 140, 150, 120]
});

world.createElement({
    name: "testDynamicalSprite",
    type: "sprite",
    settings: {
        spriteSheetIndex: 0,
        spriteIndex: 0,
    },
    coords: [400, 200, 200, 150],
    layer: 2
});

world.createElement({
    name: "testDynamicalAnimatedSprite",
    type: "sprite",
    settings: {
        spriteSheetIndex: 1,
        spriteIndex: 0,
        interval: 500,
        isRepeating: true,
        isPlaying: true
    },
    coords: [400, 400, 200, 200]
});

function draw() {
    app.clearPlayground();
    
    if(kb.isPressed('arrRight')) {
        world.getElementByName('cyanRectangle').settings.coords[0] += 2;
        world.getElementByName('secondDynamicalText').settings.coords[0] += 2;
        world.getElementByName('testDynamicalSprite').settings.coords[0] -= 2;
        world.getElementByName('testDynamicalAnimatedSprite').settings.coords[1] -= 3;
    }
    
    if(kb.isPressed('arrLeft')) {
        world.getElementByName('cyanRectangle').settings.coords[0] -= 2;
        world.getElementByName('secondDynamicalText').settings.coords[0] -= 2;
        world.getElementByName('testDynamicalSprite').settings.coords[0] += 2;
        world.getElementByName('testDynamicalAnimatedSprite').settings.coords[1] += 3;
    }

    world.draw();
    requestAnimationFrame(draw);
}
draw();