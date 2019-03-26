import RPGinia from '../../engine_0.1.3/RPGinia.js';
import * as playerMovement from './resources/js/playerMovement.js';

const engine = new RPGinia();
const app = new engine.App('Test RPGinia app');
const load = new app.Loaders();
const world = new app.World(true);
const kb = new app.Keyboard();
const cam = new app.Camera();
const audio = new app.AudioManager();

// Adding keyboard keys
kb.addKey('enter', 13);
kb.addKey('space', 32);
kb.addKey('arrUp', 38);
kb.addKey('arrDown', 40);
kb.addKey('arrLeft', 37);
kb.addKey('arrRight', 39);
kb.addKey('shift', 16);
kb.addKey('controlLeft', 17);

// Adding audio files
audio.add('languageConfirm', '/resources/audio/languageConfirm.wav');
audio.add('phoneRing', '/resources/audio/ring.wav');

// Levels array
const levelPaths = [
    '/resources/levels/set_language/languagesView.json',
    '/resources/levels/dialog/dialogView.json',
    '/resources/levels/corridor/corridor.json'
];

world.initialize({
    app: app,
    loaders: load,
    levels: load.jsonFile('level', levelPaths[2]),
    keyboard: kb,
    camera: cam,
    audio: audio 
});

const camBordersVertical = 220;
const camBordersHorizontal = 370;

const playerSpeed = 3;
let player;

// Adding player object
if(world.currentLevelName === 'Last corridor') {
    world.createElement({
        name: 'Player',
        type: 'sprite',
        settings: {
            spriteSheetIndex: 2,
            spriteIndex: 1,
            frameIndex: 0,
            isRepeating: true,
            interval: 400,
        },
        coords: [
            275, 240, 46, 64
        ]
    });

    player = world.getElementByName('Player').settings;
}

function movePlayer() {
    if(kb.isPressed('arrUp')) {
        playerMovement.moveUp(player, playerSpeed);

        if(player.coords[1] + cam.y <= camBordersVertical)
            cam.y += playerSpeed;
    }

    if(kb.isPressed('arrDown')) {
        playerMovement.moveDown(player, playerSpeed);

        if(player.coords[1] + player.coords[3] + cam.y >= app.canvas.height - camBordersVertical)
            cam.y -= playerSpeed;
    }

    if(kb.isPressed('arrLeft')) {
        playerMovement.moveLeft(player, playerSpeed);

        if(player.coords[0] + cam.x <= camBordersHorizontal)
            cam.x += playerSpeed;
    }

    if(kb.isPressed('arrRight')) {
        playerMovement.moveRight(player, playerSpeed);

        if(player.coords[0] + player.coords[2] + cam.x >= app.canvas.width - camBordersHorizontal)
            cam.x -= playerSpeed;
    }

    if(
        !kb.isPressed('arrUp') 
        && !kb.isPressed('arrDown') 
        && !kb.isPressed('arrLeft') 
        && !kb.isPressed('arrRight')
    ) {
        player.settings.frameIndex = 0;
        player.settings.isPlaying = false;
    }
}

function draw() {
    app.clearPlayground();
    world.draw();

    if(world.currentLevelName === 'Last corridor') {
        movePlayer();
    }

    requestAnimationFrame(draw);
}
draw();