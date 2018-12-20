import App from "./App.js";

/**
 * Main engine class.
 * @class
 * @global
 */
class RPGinia {
	/**
	 * @constructor
	 * @param {string} [appPath=App location] - Defines an app path. By default it's window.location.href
	 */
	constructor(appPath = window.location.href) {
		this._appPath = appPath;

		/**
		 * Class with main engine functional.
		 * @name RPGinia#App
		 * @memberof RPGinia
		 */
		this.__proto__.App = App;
		this.__proto__.App.prototype.appPath = this._appPath;
	}
}

export default RPGinia;