/**
 * Class for work with audio files.
 * @memberof RPGinia.App
 * @class
 */
class AudioManager {
	/**
	 * @hideconstructor
	 */
	constructor() {
		/**
		 * The list of audio settings objects.
		 * @type {Object[]}
		 * @private
		 */
		this._list = [];

		/** 
		 * App path from the prototype given from App class.
		 * @type {String}
		 * @private
		 */
		this._appPath = this.__proto__.appPath;
	}

	/**
	 * Adds an object of audio's settings to the audio list array.
	 * @param {String} name - The name of created audio.
	 * @param {String} path - The path to audio. Output value: appPath + audioPath.
	 * @param {Number} [volume=100] - The value of audio. By default it's 100.
	 * @param {Boolean} [isRepeating=false] - Can audio repeating after it's end. Default value - false.
	 * 
	 * @example
	 * const audio = AudioManager.add("testAudio", "/resources/audio/test.mp3");
	 * 
	 * @returns {Object} Returns an object of audio settings.
	 */
	add(name, path, volume = 100, isRepeating = false) {
		this._list.push({
			name: name,
			path: this._appPath + path,
			volume: volume/100,
			isRepeating: isRepeating,
			audio: new Audio()
		});

		const lastAudio = this._list[this._list.length-1];

		lastAudio.audio.src = lastAudio.path;
		lastAudio.audio.volume = lastAudio.volume;
		lastAudio.audio.load();

		// Audio end event
		if(lastAudio.isRepeating) {
			lastAudio.audio.addEventListener("ended", () => {
				lastAudio.audio.currentTime = 0;
				lastAudio.audio.play();
			}, false);                                          
		}

		return lastAudio;
	}

	/**
	 * Starts audio playback.
	 * @param {String} name - Audio's name to play
	 */
	play(name) {
		const selectedAudio = this._list[this._list.findIndex(e => e.name === name)].audio;
		selectedAudio.play();
	}

	/**
	 * Pausing audio playback.
	 * @param {String} name - Audio's name to pause.
	 */
	pause(name) {
		this._list[this._list.findIndex(e => e.name === name)].audio.pause();
	}

	/**
	 * Stops audio playback and setting up time to start.
	 * @param {String} name - Audio's name to stop.
	 */
	stop(name) {
		this._list[this._list.findIndex(e => e.name === name)].audio.pause();
		this._list[this._list.findIndex(e => e.name === name)].audio.currentTime = 0;
	}

	/**
	 * Returning audio settings by name.
	 * @param {String} name - Audio's name to find. 
	 */
	getAudioByName(name) {
		return this._list[this._list.findIndex(e => e.name === name)];
	}
	
	/** 
	 * Get an array of audio settings.
	 * @readonly
	 * @type {Array}
	 */
	get list() { return this._list }
}

export default AudioManager;