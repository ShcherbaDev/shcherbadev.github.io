/**
 * Class for creating game objects. The game objects are inherit from it.
 * @memberof RPGinia.World
 * @private
 * @class
 */
class GameObject {
	/**
     * @constructor
	 * @param {object} objectManagerClass - ObjectManager class.
     * @param {object} settings - Game object settings.
     */
	constructor(objectManagerClass, settings) {
		/**
         * World class.
         * @private
         * @type {object}
         */
		this._objectManager = objectManagerClass;

		this._world = this._objectManager._world;

		this._camera = this._world._camera;

		this._app = this._world._app;

		/**
         * Object's settings.
         * @private
         */
		this._settings = settings;

		/** 
		 * App path from the prototype given from App class.
		 * @type {string}
		 * @private
		 */
		this._appPath = this._app._appPath;

		/** 
         * Get a context object for drawing.
         * @type {object}
         * @private
         */
		this._context = this._app._context;
        
		// Setting up a 'layer' property to default value, if it's not defined.
		if (this._settings.layer === undefined) {
			this._settings.layer = 1;
		}

		// Setting up a 'isVisible' property to default value, if it's not defined.
		if (this._settings.isVisible === undefined) {
			this._settings.isVisible = true;
		}
	}

	/**
	 * Get settings object.
	 * @readonly
	 * @type {object}
	 */
	get settings() { return this._settings; }
}

export default GameObject;
