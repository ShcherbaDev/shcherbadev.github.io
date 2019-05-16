/**
 * Class for work with audio files.
 * @memberof RPGinia
 * @class
 */
class AudioManager {
	/**
	 * @constructor
	 * @param {object} [rpginiaApp] - RPGinia app.
	 */
	constructor(rpginiaApp) {
		this._app = rpginiaApp;

		/**
		 * The list of audio settings objects.
		 * @type {object[]}
		 * @private
		 */
		this._list = [];

		/** 
		 * App path from the prototype given from App class.
		 * @type {string}
		 * @private
		 */
		this._appPath = this._app._appPath;

		this._app._audioManager = this;
	}

	/**
	 * Adds an object of audio's settings to the audio list array.
	 * @param {string} name - The name of created audio.
	 * @param {string} path - The path to audio. Output value: appPath + audioPath.
	 * @param {number} [volume=100] - The value of audio. By default it's 100.
	 * @param {boolean} [isRepeating=false] - Can audio repeating after it's end. Default value - false.
	 * 
	 * @example
	 * const audio = audioManager.add("testAudio", "/resources/audio/test.mp3");
	 * 
	 * @returns {object} Returns an object of audio settings.
	 */
	add(name, path, volume = 100, isRepeating = false) {
		this._list.push({
			name,
			path: this._appPath + path,
			volume: volume / 100,
			isRepeating,
			audio: new Audio()
		});

		const lastAudio = this._list[this._list.length - 1];

		lastAudio.audio.src = lastAudio.path;
		lastAudio.audio.volume = lastAudio.volume;
		lastAudio.audio.load();

		// Audio end event
		if (lastAudio.isRepeating) {
			lastAudio.audio.addEventListener('ended', () => {
				lastAudio.audio.currentTime = 0;
				lastAudio.audio.play();
			}, false);
		}

		return lastAudio;
	}

	/**
	 * Starts audio playback.
	 * @param {string} name - Audio's name to play
	 */
	play(name) {
		const selectedAudio = this._list[this._list.findIndex(e => e.name === name)].audio;
		selectedAudio.play();
	}

	/**
	 * Pausing audio playback.
	 * @param {string} name - Audio's name to pause.
	 */
	pause(name) {
		this._list[this._list.findIndex(e => e.name === name)].audio.pause();
	}

	/**
	 * Stops audio playback and setting up time to start.
	 * @param {string} name - Audio's name to stop.
	 */
	stop(name) {
		this._list[this._list.findIndex(e => e.name === name)].audio.pause();
		this._list[this._list.findIndex(e => e.name === name)].audio.currentTime = 0;
	}

	/**
	 * Returning audio settings by name.
	 * @param {string} name - Audio's name to find. 
	 */
	getAudioByName(name) {
		return this._list[this._list.findIndex(e => e.name === name)];
	}
	
	/** 
	 * Get an array of audio settings.
	 * @readonly
	 * @type {object[]}
	 */
	get list() { return this._list; }
}

export default AudioManager;
