import Loaders from './Loaders.js';
import World from './World.js';
import Keyboard from './Keyboard.js';
import AudioManager from './AudioManager.js';

/**
 * Class with main engine functional.
 * @global
 */
class RPGinia {
	/**
	 * @constructor
	 * @param {string} [appPath=window.location.href] - App URL.
	 * @param {boolean} [debugModeEnabled=false] - Debug mode.
	 * @param {string} [title=RPGinia app] - App's title.
	 * @param {object} [canvas=document.querySelector("canvas")] - App's playground.
	 * @param {array} [sizes=[800, 600]] - Playground sizes. First element - width, second element - height.
	 * @param {boolean} [isImageSmoothingEnabled=false] - Image smoothing.
	 */
	constructor(appPath = window.location.href, debugModeEnabled = false, title = 'RPGinia app', canvas = document.querySelector('canvas'), sizes = [800, 600], isImageSmoothingEnabled = false) {
		this._appPath = appPath;
		this._debugMode = debugModeEnabled;
		
		this._title = title;
		this._canvas = canvas;
		this._context = this._canvas.getContext('2d');
		this._sizes = sizes;
		this._isImageSmoothingEnabled = isImageSmoothingEnabled;

		this._loaders = null;
		this._keyboard = null;
		this._audioManager = null;

		/**
		 * An array of global variables
		 * @private
		 */
		this._globalVariables = [];

		this._init();
	}
	
	/**
	 * Initialize method for setting up the playground's sizes and image smoothing.
	 * @private
	 */
	_init() {
		this._canvas.width = this._sizes[0];
		this._canvas.height = this._sizes[1];
		this._context.imageSmoothingEnabled = this._isImageSmoothingEnabled;
	}
	
	/**
	 * Clears a playground. Must be used in a loop.
	 * @example
	 * function loop() {
	 * 	app.clearBackground();
	 * 
	 *	// Your drawing actions here...
	 *
	 * 	requestAnimationFrame(loop);
	 * }
	 * loop();
	 */
	clearPlayground() {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	/**
	 * Adds a global variable into an global variables array.
	 * @param {string} name - The name of a global variable. 
	 * @param {*} value - The value of a global variable.
	 * @returns {*} The value of a created global variable.
	 */
	setGlobalVariable(name, value) {
		this._globalVariables[name] = value;
		return this._globalVariables[name];
	}

	/**
	 * Gets a value of global variable by name.
	 * @param {string} name - Searched global variable name.
	 * @returns {*} The value of searched global variable.
	 */
	getGlobalVariable(name) {
		return this._globalVariables[name];
	}

	/** 
	 * Get a canvas object.
	 * @readonly
	 * @type {object}
	 */
	get canvas() { return this._canvas; }

	/** 
	 * Get a context object for drawing object
	 * @readonly
	 * @type {object}
	 */
	get context() { return this._context; }

	/** 
	 * Get an array of global variables.
	 * @readonly
	 * @type {object[]}
	 */
	get globalVariables() { return this._globalVariables; }

	/** 
	 * Get playground sizes.
	 * @readonly
	 * @type {number[]}
	 */
	get sizes() { return this._sizes; }

	/**
	 * Get an app's path.
	 * @readonly
	 * @type {string}
	 */
	get appPath() { return this._appPath; }

	/**
	 * Get keyboard class if user has created it.
	 * @readonly
	 * @type {object}
	 */
	get keyboard() { return this._keyboard; }

	/**
	 * Get audio manager class if user has created it.
	 * @readonly
	 * @type {object}
	 */
	get audioManager() { return this._audioManager; }

	/**
	 * Get keyboard class.
	 * @private
	 * @readonly
	 * @static
	 * @type {object}
	 */
	static get Keyboard() { return Keyboard; }

	/**
	 * Get audioManager class.
	 * @private
	 * @readonly
	 * @static
	 * @type {object}
	 */
	static get AudioManager() { return AudioManager; }

	/**
	 * Get loaders class.
	 * @private
	 * @readonly
	 * @static
	 * @type {object}
	 */
	static get Loaders() { return Loaders; }

	/**
	 * Get world class.
	 * @private
	 * @readonly
	 * @static
	 * @type {object}
	 */
	static get World() { return World; }

	/**
	 * Set new canvas sizes.
	 * @param {number[]} newSizesValue - New canvas sizes. First value - width, second - height.
	 */
	set sizes(newSizesValue) {
		this._sizes = newSizesValue;
		this._canvas.width = this._sizes[0];
		this._canvas.height = this._sizes[1];
	}
}

export default RPGinia;
