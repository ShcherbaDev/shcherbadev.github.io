/**
 * Keyboard event handler class 
 * @memberof RPGinia
 * @class
 */
class Keyboard {
	/**
	 * @constructor
	 * @param {object} [rpginiaApp] - RPGinia app.
	 */
	constructor(rpginiaApp) {
		this._app = rpginiaApp;

		/**
		 * Added keys array.
		 * @private
		 */
		this._keys = [];

		this._debugMode = this._app._debugMode;

		this._init();
	}

	/**
	 * Adds a keyboard events and do press events.
	 * @private
	 */
	_init() {
		window.onkeydown = (e) => {
			this._keys.forEach((key) => {
				const keyboardKey = key;

				if (keyboardKey.keyCode === e.keyCode) {
					keyboardKey.isActive = true;

					if (keyboardKey.action !== null) {
						keyboardKey.action(e);
					}

					return true;
				}
				return false;
			});
		};

		window.onkeyup = (e) => {
			this._keys.forEach((key) => {
				const keyboardKey = key;

				if (keyboardKey.keyCode === e.keyCode) {
					keyboardKey.isActive = false;
					return true;
				}
				return false;
			});
		};

		this._app._keyboard = this;
	}

	/**
	 * Adds a key to an array.
	 * @param {String} key - Keys name.
	 * @param {Number} keyCode - Keys code. To find desired key code, turn on the debug mode in constructor.
	 */
	addKey(key, keyCode) {
		this._keys.push({
			keyName: key,
			keyCode,
			action: null,
			isActive: false
		});
	}

	/**
	 * Allows you to do a callback when you press a button.
	 * @param {Function} callback - The callback will work if user has pressed the desired key. 
	 * @param {String} key - The key that will do callback. Must be in array with keys which was added via addKey() method.
	 */
	pressEvent(callback, key) {
		this._keys[this._keys.findIndex(item => item.keyName === key)].action = callback;
	}

	/**
	 * Checking if a key is pressed. Using in a game loop.
	 * @param {String} key - Desired key. Must be in array with keys via Keyboard.addKey().
	 * @returns {Boolean} Is key pressed or not.
	 */
	isPressed(key) {
		return this._keys[this._keys.findIndex(item => item.keyName === key)].isActive;
	}

	/** 
	 * Get a keys array added via addKey() method.
	 * @readonly
	 * @type {Array}
	 */
	get keys() {
		return this._keys;
	}
}

export default Keyboard;
