import RPGinia from '../../engine_0.1.3/RPGinia.js';

const engine = new RPGinia();
const app = new engine.App("Test RPGinia app", undefined, [1200, 600]);
const load = new app.Loaders();
const world = new app.World();
const kb = new app.Keyboard();
const audio = new app.AudioManager();
const cam = new app.Camera();

const musicVolume = 100;

// Defining keyboard keys
kb.addKey("arrLeft", 37);
kb.addKey("arrRight", 39);
kb.addKey("enter", 13);

// Adding audios
audio.add("ruins", "/resources/audio/ruins.mp3", musicVolume, true);
audio.add("snowy", "/resources/audio/snowy.mp3", musicVolume, true);
audio.add("snowdin", "/resources/audio/snowdin.mp3", musicVolume, true);
audio.add("bonetrousle", "/resources/audio/bonetrousle.mp3", musicVolume, true);
audio.add("waterfall", "/resources/audio/waterfall.mp3", musicVolume, true);
audio.add("anotherMedium", "/resources/audio/anotherMedium.mp3", musicVolume, true);
audio.add("gastersTheme", "/resources/audio/gastersTheme.mp3", musicVolume, true);

world.initialize({
	app: app,
	levels: load.jsonFile("level", "/resources/levels/audioTest/audioTest.json"),
	keyboard: kb,
	audio: audio,
	camera: cam
});

function loop() {
	app.clearPlayground();
	world.draw();
	requestAnimationFrame(loop);
}
loop();