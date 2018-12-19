export default class Keyboard {
	constructor(debugEnable = false) {
		this._keys = {};
		this._keyState = {};
		this._pressActions = [];

		this._debugEnable = debugEnable;

		this._init();
	}

	_init() {
		window.onkeydown = e => {
			this._keyState[e.keyCode] = true;

			for(let i in this._pressActions) {
				if(e.keyCode === this._pressActions[i].keyCode)
					return this._pressActions[i].action(e); 
				else continue;
			}

			if(this._debugEnable)
				console.log(e)
		}

		window.onkeyup = e => {
			this._keyState[e.keyCode] = false;
		}
	}

	addKey(key, keyCode) {
		this._keys[key] = keyCode;
	}

	pressEvent(callback, key) {
		this._pressActions.push({
			action: callback,
			keyCode: this._keys[key],
			isActive: this._keyState[this._keys[key]]
		});
	}

	isPressed(key) {
		return (this._keyState[this._keys[key]]) ? true : false;
	}

	get keys() { return this._keys }
	get pressedKeys() { return this._keyState }
	get actions() { return this._pressActions }
}