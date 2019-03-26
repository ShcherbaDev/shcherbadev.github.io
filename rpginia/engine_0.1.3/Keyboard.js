/**
 * Keyboard event handler class 
 * @memberof RPGinia.App
 * @class
 */
class Keyboard {
	/**
	 * @constructor
	 * @param {Boolean} [debugModeEnable=false] - Debug mode for key press notifications.
	 */
	constructor(debugModeEnable = false) {
		/**
		 * Added keys array.
		 * @private
		 */
		this._keys = [];

		this._debugEnable = debugModeEnable;

		this._init();
	}

	/**
	 * Adds a keyboard events and do press events.
	 * @private
	 */
	_init() {
		window.onkeydown = e => {
			for(let i in this._keys) {
				if(this._keys[i].keyCode === e.keyCode) {
					this._keys[i].isActive = true;

					if(this._keys[i].action !== null)
						this._keys[i].action(e);
				}
				else continue;
			}

			if(this._debugEnable)
				console.log(e);
		}

		window.onkeyup = e => {
			for(let i in this._keys) {
				if(this._keys[i].keyCode === e.keyCode)
					this._keys[i].isActive = false;
				else continue;
			}
		}
	}

	/**
	 * Adds a key to an array.
	 * @param {String} key - Keys name.
	 * @param {Number} keyCode - Keys code. To find desired key code, turn on the debug mode in constructor.
	 */
	addKey(key, keyCode) { 
		this._keys.push({
			keyName: key,
			keyCode: keyCode,
			action: null,
			isActive: false
		});
	}

	/**
	 * Allows you to do a callback when you press a button.
	 * @param {Function} callback - The callback will work if user has pressed the desired key. 
	 * @param {String} key - The key that will do callback. Must be in array with keys via Keyboard.addKey().
	 */
	pressEvent(callback, key) {
		this._keys[this._keys.findIndex(item => item.keyName === key)].action = callback;
	}

	/**
	 * Checking if a key is pressed. Using in a game loop.
	 * @param {String} key - Desired key. Must be in array with keys via Keyboard.addKey().
	 * @returns {Boolean} Is key pressed or not.
	 */
	isPressed(key) { return this._keys[this._keys.findIndex(item => item.keyName === key)].isActive }

	/** 
	 * Get a keys array added via Keyboard.addKey().
	 * @readonly
	 * @type {Array}
	 */
	get keys() { return this._keys }
}

export default Keyboard;