import LevelManager from './LevelManager.js';
import GameObject from './GameObject.js';
import Camera from './Camera.js';

/**
 * Class for drawing levels and doing their logic.
 * @memberof RPGinia
 * @class
 */
class World {
	/**
	 * @constructor
	 * @param {object} [appClass] - RPGinia app.
	 * @param {boolean} [loadLevelsControllers=true] - Should it load levels controllers.
	 */
	constructor(appClass, loadLevelsControllers = true) {
		this._app = appClass;
		this._loaders = this._app._loaders;

		/** 
		 * Playground tag from the prototype given from App class.
		 * @type {object}
		 * @private
		 */
		this._canvas = this._app._canvas;

		/** 
         * Get a context object for drawing given from App class.
         * @private
         * @type {object}
         */
		this._context = this._app._context;

		/** 
		 * App path from the prototype given from App class.
		 * @type {string}
		 * @private
		 */
		this._appPath = this._app._appPath;

		/**
		 * Should playground draw objects borders boolean.
		 * @type {boolean}
		 * @private
		 */
		this._debugMode = this._app._debugMode;

		/**
		 * Should level manager load controllers for levels.
		 * @type {boolean}
		 * @private
		 */
		this._loadControllers = loadLevelsControllers;

		/**
		 * Camera class.
		 * @type {object}
		 * @private
		 */
		this._camera = new Camera();

		/**
		 * Level manager for changing levels.
		 * @type {object}
		 * @private
		 */
		this._levelManager = new LevelManager(this);
	}

	/**
	 * Method for getting sprite sheet that uses active level.
	 * @private
	 * @returns {object} Sprite sheet that uses active level.
	 */
	_getActiveSpriteSheet() {
		return this._loaders._getFilesByType('spriteSheet').findIndex(async spriteSheet => spriteSheet.name === await this._levelManager.getActiveLevel()._spriteSheetName);
	}

	/** 
	 * Draws level objects. Must be used in a loop.
	 * @async
	 * @example
	 * function loop() {
	 * 	world.render();
	 * 	requestAnimationFrame(loop);
	 * }
	 * loop();
	 */
	async render() {
		await this._levelManager._renderer.render();
	}

	// LevelManager methods

	/**
	 * Method for getting active level.
	 * @async
	 * @returns {object} Active level.
	 */
	async getActiveLevel() {
		const activeLevel = await this._levelManager.getActiveLevel();
		return activeLevel;
	}
	
	/**
	 * Method for setting new active level.
	 * @async
	 * @param {object|string} levelObjOrName - Level's object from Loaders.loadLevel method or string as a name of existing level. 
	 * @param {object} additionalOptions - Additional options which will use on changing level.
	 * @returns {object} New active level object.
	 */
	async setLevel(levelObjOrName, additionalOptions) {
		const newLevel = await this._levelManager.setLevel(levelObjOrName, additionalOptions);
		return newLevel;
	}

	// ObjectManager methods

	/**
	 * Sort game objects by their layer.
	 * @async
	 * @param {object[]} [objectList=objects in current level] - Game object's array.
	 * @returns {object[]} Sorted array.
	 */
	async sortObjectsByLayer(objectList) {
		const currentLevel = await this._levelManager.getActiveLevel();
		
		let sortList = objectList;

		if (sortList === undefined) {
			sortList = currentLevel._objects;
		}

		return currentLevel._objectManager.sortObjectsByLayer(sortList);
	}

	/**
	 * Find a game object by name.
	 * @async
	 * @param {string} name - The name of a searched game object.
	 * @returns {object} Searched game object.
	 */
	async getObjectByName(name) {
		const currentLevel = await this._levelManager.getActiveLevel();
		return currentLevel._objectManager.getObjectByName(name);
	}

	/**
	 * Get game objects by layer.
	 * @async
	 * @param {number} layerNumber - The number of a searched layer.
	 * @returns {object[]} Game objects array which were in searched layer.
	 */
	async getObjectsFromLayer(layerNumber) {
		const currentLevel = await this._levelManager.getActiveLevel();
		return currentLevel._objectManager.getObjectsFromLayer(layerNumber);
	}

	/**
	 * Add a new game object into active level.
	 * @async
	 * @param {object} settings - See game object's types documentation for full list of their settings.
	 * @returns {object} Created game object.
	 */
	async addObjectInCurrentLevel(settings) {
		const currentLevel = await this._levelManager.getActiveLevel();
		return currentLevel._objectManager.addObject(settings);
	}

	/**
	 * Delete game object by name.
	 * @param {string} name - The name of a deleting game object.
	 * @returns {boolean} True if delete was successful.
	 */
	async deleteObjectInCurrentLevel(name) {
		const currentLevel = await this._levelManager.getActiveLevel();
		return currentLevel._objectManager.deleteObject(name);
	}
	
	/**
	 * Get an app class.
	 * @readonly
	 * @type {object}
	 */
	get app() { return this._app; }

	/**
	 * Get loaders class.
	 * @readonly
	 * @type {object}
	 */
	get loaders() { return this._loaders; }

	/**
	 * Get levelManager class.
	 * @type {object}
	 */
	get levelManager() { return this._levelManager; }
	
	/**
	 * Get camera class.
	 * @type {object}
	 */
	get camera() { return this._camera; }

	/** 
	 * Get levels array.
	 * @readonly
	 * @type {object[]}
	 */
	get levels() { return this._levelManager._levelList; }

	/**
	 * Get levelManager static class.
	 * @private
	 * @readonly
	 * @static
	 * @type {object}
	 */
	static get LevelManager() { return LevelManager; }

	/**
	 * Get object static class.
	 * @private
	 * @readonly
	 * @static
	 * @type {object}
	 */
	static get Object() { return GameObject; }
}

export default World;
