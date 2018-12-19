import RPGinia from "https://shcherbadev.github.io/rpginia/engine/RPGinia.js";

const engine = new RPGinia;
const app = new engine.App("Test RPGinia app", undefined, [1200, 600]);
const load = new app.Loaders;
const world = new app.World;
const kb = new app.Keyboard;
const audio = new app.AudioManager;

kb.addKey("arrLeft", 37);
kb.addKey("arrRight", 39);
kb.addKey("enter", 13);

audio.add("ruins", "/resources/audio/ruins.mp3");
audio.add("snowy", "/resources/audio/snowy.mp3");
audio.add("snowdin", "/resources/audio/snowdin.mp3");
audio.add("bonetrousle", "/resources/audio/bonetrousle.mp3");
audio.add("waterfall", "/resources/audio/waterfall.mp3");
audio.add("hotland", "/resources/audio/anotherMedium.mp3");

// Loading levels
const level = load.jsonFile("level", "/resources/levels/audioTest/audioTest.json");

world.initialize({
	app: app,
	levels: level,
	keyboard: kb,
	audio: audio
});

function loop() {
	app.clearPlayground();
	world.draw();
	requestAnimationFrame(loop);
}
loop();