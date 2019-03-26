import Object from './Object.js';
import Text from './ObjectTypes/Text.js';
import Rectangle from './ObjectTypes/Rectangle.js';
import Sprite from './ObjectTypes/Sprite.js';

/**
 * Class for drawing levels and doing their logic.
 * @memberof RPGinia.App
 * @class
 */
class World {
	/**
	 * @constructor
	 * @param {Boolean} [debugModeEnabled=false] - Show objects borders.
	 * @param {Boolean} [loadLevelsControllers=true] - Load levels controllers.
	 */
	constructor(debugModeEnabled = false, loadLevelsControllers = true) {
		/**
		 * Levels array
		 * @private
		 */
		this._levels = [];

		/**
		 * Current level ID
		 * @private
		 */
		this._currentLevelId = null;
		
		/**
		 * Previous level ID. Changes when level is changing.
		 * @private
		 */
		this._previousLevelId = null;

		/**
		 * Should playground draw objects borders boolean.
		 * @private
		 */
		this._debugMode = debugModeEnabled;

		/**
		 * Should world load levels controllers.
		 * @private
		 */
		this._loadControllers = loadLevelsControllers;

		this._app = null;
		this._loaders = null;
		this._keyboard = null;
		this._audio = null;
		this._camera = null;

		/** 
		 * Playground tag from the prototype given from App class.
		 * @type {Object}
		 * @private
		 */
		this._canvas = this.__proto__.canvas;

		/** 
         * Get a context object for drawing given from App class.
         * @private
         * @type {Object}
         */
		this._context = this.__proto__.context;

		/** 
		 * App path from the prototype given from App class.
		 * @type {String}
		 * @private
		 */
		this._appPath = this.__proto__.appPath;

		/**
		 * Object class.
		 * @name RPGinia#App#World#Object
		 * @memberof RPGinia#App#World
		 */
		this.__proto__.Object = Object;
		Object.prototype.appPath = this._appPath;
		Object.prototype.context = this._context;
		Object.prototype.world = this;
	}

	/**
	 * Method for doing a logic of level.
	 * @param {Number} [levelId=Current level ID] - ID of level
	 * @private
	 */
	_doController(levelId = this._currentLevelId) {
		/* Notice:
		 * If you want to change the level, but there are keyboard 
		 * events or intervals at the current level, make sure that in
		 * pressEvent, isPressed and intervals includes checking for the
		 * current level name. */

		const levelList = this._levels;
		let xml = new XMLHttpRequest();

		xml.onreadystatechange = () => {
			if(xml.readyState === 4)
				levelList[levelId].controller = eval(`(${xml.responseText})`);
		}

		if(levelList[levelId].controller === undefined) {
			xml.open("get", this._appPath + levelList[levelId].data.settings.controllerPath, false);
			xml.send();
		}
		
		// Do controller
		levelList[levelId].controller({
			app: this._app,
			world: this,
			loaders: this._loaders,
			keyboard: this._keyboard,
			audio: this._audio,
			camera: this._camera
		});
	}

	/**
	 * Sorting objects by layers.
	 * @param {Number} [levelId=Current level ID] - ID of level. 
	 * @private
	 */
	_sortElements(levelId = this._currentLevelId) {
		this._levels[levelId].data.elements.sort((a, b) => {
			if(a.settings.layer > b.settings.layer) 
				return 1;

			if(a.settings.layer < b.settings.layer) 
				return -1;

			return 0;
		});
	}

	/**
	 * Returns a prepared object.
	 * @param {Object} object - Game object.
	 * @param {Object} spriteSheet - Sprite sheet for object (If you're adding a sprite)
	 * @returns {Object} - Prepared for drawing game object.
	 * @private
	 */
	_prepareObject(object) {
		if(object.type === 'rectangle')
			return new Rectangle(object);

		else if(object.type === 'sprite')
			return new Sprite(object);

		else if(object.type === 'text')
			return new Text(object);
	}

	/**
	 * Prepares a level for use.
	 * @param {String} path - Path to level .JSON file.
	 * @private
	 */
	_getReadyLevel(path) {
		const levelList = this._levels;
		this._previousLevelId = this._currentLevelId;
		
		// If can't find needable level - it loads it.
		if(levelList[levelList.findIndex(item => item.path === path)] === undefined) {
			this._currentLevelId++;
			levelList[this._currentLevelId] = this._loaders.jsonFile('level', path);
			levelList[this._currentLevelId].id = this._currentLevelId;
		} else this._currentLevelId = levelList.findIndex(item => item.path === path)

		// Setting up level objects.
		for(let j in levelList[this._currentLevelId].data.elements) {
			levelList[this._currentLevelId].data.elements[j] = this._prepareObject(levelList[this._currentLevelId].data.elements[j])
		}

		// Sorting objects
		this._sortElements();

		// Setting up camera coordinations
		if(this._camera) {
			this._camera.x = 0;
			this._camera.y = 0;
		}

		if(levelList[this._currentLevelId].data.settings.controllerPath && this._loadControllers) {
			this._doController();
		}
	}

	/**
	 * Object's visibility check.
	 * @param {Object} object - Game object
	 * @param {Number} [padding=0] - Indent from which the check will be made. Need for debugging.
	 * @returns {Boolean} Is the object visible or not.
	 * @private
	 */
	_isObjectVisible(object, padding = 0) {
		if(object.isVisible) {
			if(this._camera) {
				return object.coords[0] <= this._canvas.width - padding - this._camera.x
					&& object.coords[1] <= this._canvas.height - padding - this._camera.y
					&& object.coords[0] + object.coords[2] + this._camera.x >= padding 
					&& object.coords[1] + object.coords[3] + this._camera.y >= padding;
			}

			else {
				return object.coords[0] <= this._canvas.width - padding
					&& object.coords[1] <= this._canvas.height - padding
					&& object.coords[0] + object.coords[2] >= padding 
					&& object.coords[1] + object.coords[3] >= padding;
			}
		} else return false;
	}

	/**
	 * Initializes necessary components for stable work. 
	 * 
	 * @example
	 * // Simple initializing with loading one level.
	 * const engine = new RPGinia();
	 * const app = new engine.App();
	 * const world = new app.World();
	 * const loaders = new app.Loaders();
	 * 
	 * world.initialize({
	 * 	app: app,
	 * 	loaders: loaders,
	 * 	levels: loaders.jsonFile('level', '/path/to/level.json')
	 * });
	 * 
	 * @example
	 * // Simple initializing with loading few levels.
	 * const engine = new RPGinia();
	 * const app = new engine.App();
	 * const world = new app.World();
	 * const loaders = new app.Loaders();
	 * 
	 * const levels = [
	 * 	loaders.jsonFile('level', '/path/to/level_1.json'),
	 * 	loaders.jsonFile('level', '/path/to/level_2.json'),
	 * 	loaders.jsonFile('level', '/path/to/level_3.json')
	 * ];
	 * 
	 * world.initialize({
	 * 	app: app,
	 * 	loaders: loaders,
	 * 	levels: levels
	 * });
	 * 
	 * @param {Object} options - Other engine classes.
	 * @param {Object} options.app - App class.
	 * @param {Object} options.loaders - Loaders class.
	 * @param {Object} options.keyboard - Keyboard class.
	 * @param {Object} options.audio - Audio manager class.
	 * @param {Object} options.camera - Camera class.
	 * @param {Object|Object[]} options.levels - Level object or array of levels.
	 * @param {Number} [options.currentLevelId=0] - Loads the level which ID was specified.
	 */
	initialize(options) {
		// Elements init
		this._app = options.app || null;
		this._loaders = options.loaders || null;
		this._keyboard = options.keyboard || null;
		this._audio = options.audio || null;
		this._camera = options.camera || null;

		if(this._camera && !this._camera._world) {
			this._camera._world = this;
			Object.prototype.camera = this._camera;
		}

		this._currentLevelId = options.currentLevelId || 0;

		if(options.levels) {
			this._levels = Array.isArray(options.levels) ? options.levels : [options.levels];
			this._getReadyLevel(this._levels[this._currentLevelId].path);
		}

		else
			throw new Error("Levels are not defined!\nPlease connect at least one level to eliminate this error.");
	}

	/** 
	 * Draws level objects. Must be used in a loop.
	 * @example
	 * function loop() {
	 * 	world.draw();
	 * 	requestAnimationFrame(loop);
	 * }
	 * loop();
	 */
	draw() {
		const levelList = this._levels;
		const levelId = this._currentLevelId;
		const currentLevel = levelList[levelId];
		const elementsInLevel = currentLevel.data.elements;

		// Background draw
		if(currentLevel.data.settings.background) {
			this._context.fillStyle = currentLevel.data.settings.background;
			this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
		}
		
		this._context.save();

		if(this._camera) {
			this._context.translate(this._canvas.width/2, this._canvas.height/2);
			this._context.rotate(this._camera.degree * Math.PI/180);
			this._context.translate(-this._canvas.width/2, -this._canvas.height/2);
		}

		// Level draw
		for(let i in elementsInLevel) {
			const objSettings = elementsInLevel[i].settings;
			
			if(this._isObjectVisible(objSettings)) {
				elementsInLevel[i].draw();

				// If debug mode is enabled - show borders and center points of objects
				if(this._debugMode)
					elementsInLevel[i].drawInDebug();
			}
		}
		
		this._context.restore();
	}

	/**
	 * Searches game object by name.
	 * @param {String} elementName - Searching object name.
	 * @returns {Object} Requested object.
	 */
	getElementByName(elementName) {
		const levelElements = this._levels[this._currentLevelId].data.elements;
		return levelElements[levelElements.findIndex(elem => elem.settings.name === elementName)];
	}

	/**
	 * Searches game objects by layer.
	 * @param {Number} layerNum - Searching layer.
	 * @returns {Object[]} Objects located in the desired layer.
	 */
	getElementsFromLayer(layerNum) {
		const levelElements = this._levels[this._currentLevelId].data.elements;
		let arr = [];

		for(let i in levelElements) {
			if(levelElements[i].settings.layer === layerNum)
				arr.push(levelElements[i])
		}

		return arr;
	}

	/**
	 * Creating a new object in level.
	 * @param {Object} settings - Object settings.
	 * @param {Object[]} spriteSheets - Array of sprite sheets.
	 * @returns {Object} Created object settings.
	 */
	createElement(settings, spriteSheets) {
		const levelData = this._levels[this._currentLevelId].data;
		levelData.elements.push(
			settings.type !== 'sprite' ?
			this._prepareObject(settings) :
			this._prepareObject(settings, spriteSheets || this._levels[this._currentLevelId].spriteSheets)
		);
		this._sortElements();
		return settings;
	}

	/**
	 * Deletes an object in level by name.
	 * @param {String} name - Object name.
	 * @throws Will throw an error if the object wasn't found.
	 */
	deleteElement(name) {
		const elementsInLevel = this._levels[this._currentLevelId].data.elements;
		const searchingElement = elementsInLevel.findIndex(item => item.settings.name === name);
		if(searchingElement !== -1) {
			elementsInLevel.splice(searchingElement, 1);
			this._sortElements();
		}
	
		else
			throw new Error(`Element with name "${name}" is not defined!`);
	}

	/**
	 * Changes level to another.
	 * @param {String} levelPath - Path to the new level.
	 */ 
	setLevel(levelPath) {
		if(this._currentLevelId !== this._previousLevelId)
			this._previousLevelId = this._currentLevelId;
		this._getReadyLevel(levelPath);
	}

	/** 
	 * Get a current level object.
	 * @readonly
	 * @type {Object}
	 */
	get currentLevel() { return this._levels[this._currentLevelId] }

	/** 
	 * Get a current level name.
	 * @readonly
	 * @type {String}
	 */
	get currentLevelName() { return this._levels[this._currentLevelId].data.settings.name }

	/** 
	 * Get a current level ID.
	 * @readonly
	 * @type {Number}
	 */
	get currentLevelId() { return this._currentLevelId }

	/** 
	 * Get levels array.
	 * @readonly
	 * @type {Object[]}
	 */
	get levels() { return this._levels }
}

export default World;